import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { documentId, documentText, documentBase64, mimeType } = await req.json();
    if (!documentId) throw new Error("Missing documentId");
    if (!documentText && !documentBase64) throw new Error("Missing document content");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    await supabase.from("documents").update({ status: "processing" }).eq("id", documentId);

    const systemPrompt = `You are a legal document analysis AI. Analyze the provided legal document and extract all information. If the document is an image, perform OCR first. If the document is in Tamil, Hindi, or another non-English language, translate it to English for analysis.`;

    // Build user message content - multimodal for images, text for documents
    let userContent: any;
    if (documentBase64) {
      userContent = [
        { type: "text", text: "Analyze this legal document image. Perform OCR to extract text, then analyze:" },
        { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${documentBase64}` } },
      ];
    } else {
      userContent = `Analyze this legal document:\n\n${documentText.substring(0, 30000)}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_analysis",
            description: "Submit the complete legal document analysis",
            parameters: {
              type: "object",
              properties: {
                document_type: { type: "string", enum: ["Agreement", "Contract", "Legal Notice", "Property Document", "Court Judgment", "Other"] },
                confidence_score: { type: "number" },
                language: { type: "string" },
                entities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["party_name", "date", "location", "monetary_amount", "legal_reference"] },
                      value: { type: "string" },
                      context: { type: "string" },
                    },
                    required: ["type", "value"],
                  },
                },
                clauses: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      content: { type: "string" },
                      type: { type: "string" },
                    },
                    required: ["title", "content"],
                  },
                },
                summary: { type: "string" },
                detailed_summary: { type: "string" },
                timeline: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: { type: "string" },
                      event: { type: "string" },
                      type: { type: "string" },
                    },
                    required: ["date", "event"],
                  },
                },
              },
              required: ["document_type", "confidence_score", "entities", "clauses", "summary", "detailed_summary", "timeline"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_analysis" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      await supabase.from("documents").update({ status: "error" }).eq("id", documentId);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const analysis = JSON.parse(toolCall.function.arguments);

    // Sanitize raw_text: remove null bytes for Postgres compatibility
    const safeRawText = documentText
      ? documentText.substring(0, 50000).replace(/\u0000/g, "")
      : "[Image document - text extracted by OCR]";

    const { error: insertError } = await supabase.from("analysis_results").insert({
      document_id: documentId,
      user_id: user.id,
      document_type: analysis.document_type,
      confidence_score: analysis.confidence_score,
      entities: analysis.entities,
      clauses: analysis.clauses,
      summary: analysis.summary,
      detailed_summary: analysis.detailed_summary,
      timeline: analysis.timeline,
      raw_text: safeRawText,
      language: analysis.language || "en",
    });

    if (insertError) throw insertError;

    await supabase.from("documents").update({ status: "completed" }).eq("id", documentId);

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-document error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
