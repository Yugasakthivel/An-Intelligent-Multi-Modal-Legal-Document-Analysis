import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Cpu, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportExecutiveSummary } from "@/components/report/ReportExecutiveSummary";
import { ReportRiskAnalysis } from "@/components/report/ReportRiskAnalysis";
import { ReportMissingClauses } from "@/components/report/ReportMissingClauses";
import { ReportEntities } from "@/components/report/ReportEntities";
import { ReportTimeline } from "@/components/report/ReportTimeline";
import { ReportVerification } from "@/components/report/ReportVerification";
import { ReportComparison } from "@/components/report/ReportComparison";
import { ReportRecommendations } from "@/components/report/ReportRecommendations";
import type { AnalysisResult, DocumentInfo } from "@/pages/AnalysisPage";

const AnalysisReportPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Legal_Report_${document?.file_name || "document"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      await html2pdf().set(opt).from(reportRef.current).save();
      toast.success("PDF report downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Analysis Report">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Cpu className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Generating report...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!analysis || !document) {
    return (
      <AppLayout title="Analysis Report">
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-muted-foreground">Report data not found</p>
        </div>
      </AppLayout>
    );
  }

  const riskClauses = analysis.clauses.filter(c =>
    ["termination", "penalty", "liability", "indemnity"].includes(c.type?.toLowerCase() || "")
  );
  const riskScore = Math.round(
    riskClauses.length > 0
      ? Math.min(100, 30 + riskClauses.length * 15)
      : Math.max(10, 100 - analysis.confidence_score)
  );
  const riskLevel = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low";

  const standardClauses = [
    "Confidentiality Clause",
    "Termination Clause",
    "Dispute Resolution",
    "Jurisdiction Clause",
    "Liability Limitation",
    "Force Majeure",
    "Indemnification",
    "Non-Compete Clause",
  ];
  const foundClauseTitles = analysis.clauses.map(c => c.title.toLowerCase());
  const missingClausesList = standardClauses.map(sc => ({
    name: sc,
    present: foundClauseTitles.some(t => t.includes(sc.toLowerCase().split(" ")[0])),
  }));

  const recommendations: string[] = [];
  missingClausesList.filter(m => !m.present).forEach(m => recommendations.push(`Add a ${m.name}`));
  if (riskScore >= 40) recommendations.push("Review and clarify liability boundaries");
  if (riskScore >= 60) recommendations.push("Specify termination conditions explicitly");
  if (analysis.confidence_score < 80) recommendations.push("Improve document structure for better AI confidence");
  if (recommendations.length === 0) recommendations.push("Document appears well-structured. Periodic review recommended.");

  return (
    <AppLayout title="Legal Analysis Report" subtitle={document.file_name}>
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
        {/* Download bar */}
        <div className="flex items-center justify-end print:hidden">
          <Button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="gradient-bg text-primary-foreground gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Generating PDF..." : "Download Full Report"}
          </Button>
        </div>

        {/* Printable report area */}
        <div ref={reportRef} className="space-y-5">
          <ReportHeader
            fileName={document.file_name}
            uploadDate={document.created_at}
            analysisDate={analysis.id ? new Date().toISOString() : document.created_at}
            riskScore={riskScore}
            riskLevel={riskLevel}
            confidence={analysis.confidence_score}
          />
          <ReportExecutiveSummary summary={analysis.summary} detailedSummary={analysis.detailed_summary} />
          <ReportRiskAnalysis riskScore={riskScore} riskLevel={riskLevel} clauses={riskClauses} allClauses={analysis.clauses} />
          <ReportMissingClauses clauses={missingClausesList} />
          <ReportEntities entities={analysis.entities} />
          <ReportTimeline events={analysis.timeline} />
          <ReportVerification confidence={analysis.confidence_score} documentType={analysis.document_type} />
          <ReportComparison clauses={analysis.clauses} />
          <ReportRecommendations recommendations={recommendations} />
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalysisReportPage;
