import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { UploadArea } from "@/components/dashboard/UploadArea";
import { DocumentsTable } from "@/components/dashboard/DocumentsTable";
import { PipelineProgress } from "@/components/dashboard/PipelineProgress";
import { toast } from "sonner";

export interface Document {
  id: string;
  file_name: string;
  file_type: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const fetchDocuments = useCallback(async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDocuments(data as Document[]);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
    });
    fetchDocuments();
  }, [navigate, fetchDocuments]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, JPG, or PNG file");
      return;
    }

    setUploading(true);
    setPipelineStage("upload");

    try {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      setPipelineStage("validation");
      const { error: uploadError } = await supabase.storage
        .from("legal-documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      setPipelineStage("processing");
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .insert({
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          status: "pending",
        })
        .select()
        .single();
      if (docError) throw docError;

      const isImage = file.type.startsWith("image/");
      let payload: { documentId: string; documentText?: string; documentBase64?: string; mimeType?: string };

      if (isImage) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        payload = { documentId: (doc as Document).id, documentBase64: base64, mimeType: file.type };
      } else {
        const text = await file.text();
        payload = { documentId: (doc as Document).id, documentText: text };
      }

      setPipelineStage("analysis");
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-document`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.session?.access_token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      setPipelineStage("complete");
      toast.success("Document analyzed successfully!");
      fetchDocuments();
      setTimeout(() => setPipelineStage(null), 2000);
    } catch (err) {
      console.error(err);
      setPipelineStage(null);
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const completedDocs = documents.filter(d => d.status === "completed").length;
  const errorDocs = documents.filter(d => d.status === "error").length;

  return (
    <AppLayout title="Legal Intelligence" subtitle="Document Analysis Control Center">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <MetricCards
          totalDocuments={documents.length}
          completedDocuments={completedDocs}
          errorDocuments={errorDocs}
        />

        {pipelineStage && <PipelineProgress currentStage={pipelineStage} />}

        <UploadArea uploading={uploading} onFileUpload={handleFileUpload} />

        <DocumentsTable documents={documents} onDocumentClick={(id) => navigate(`/analysis/${id}`)} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
