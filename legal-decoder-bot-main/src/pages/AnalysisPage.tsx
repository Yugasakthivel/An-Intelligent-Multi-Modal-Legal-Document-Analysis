import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Cpu } from "lucide-react";
import { AnalysisHeader } from "@/components/analysis/AnalysisHeader";
import { AnalysisMetrics } from "@/components/analysis/AnalysisMetrics";
import { AnalysisOverview } from "@/components/analysis/AnalysisOverview";
import { AnalysisTabs } from "@/components/analysis/AnalysisTabs";

export interface AnalysisResult {
  id: string;
  document_type: string;
  confidence_score: number;
  entities: Array<{ type: string; value: string; context?: string }>;
  clauses: Array<{ title: string; content: string; type?: string }>;
  summary: string;
  detailed_summary: string;
  timeline: Array<{ date: string; event: string; type?: string }>;
  language: string;
}

export interface DocumentInfo {
  id: string;
  file_name: string;
  created_at: string;
}

const AnalysisPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const [docRes, analysisRes] = await Promise.all([
        supabase.from("documents").select("id, file_name, created_at").eq("id", id).single(),
        supabase.from("analysis_results").select("*").eq("document_id", id).single(),
      ]);

      if (docRes.data) setDocument(docRes.data as DocumentInfo);
      if (analysisRes.data) setAnalysis(analysisRes.data as unknown as AnalysisResult);
      setLoading(false);
    };
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <AppLayout title="Analysis">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Cpu className="w-5 h-5 text-primary animate-pulse-soft" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Processing intelligence...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!analysis || !document) {
    return (
      <AppLayout title="Analysis">
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-muted-foreground">Analysis not found</p>
        </div>
      </AppLayout>
    );
  }

  const riskCount = analysis.clauses.filter(c =>
    ["termination", "penalty", "liability"].includes(c.type?.toLowerCase() || "")
  ).length;

  return (
    <AppLayout title={document.file_name} subtitle="Legal Intelligence Analysis">
      <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-6">
        <AnalysisHeader document={document} />
        <AnalysisMetrics analysis={analysis} riskCount={riskCount} />
        <AnalysisOverview analysis={analysis} />
        <AnalysisTabs analysis={analysis} documentId={id!} />
      </div>
    </AppLayout>
  );
};

export default AnalysisPage;
