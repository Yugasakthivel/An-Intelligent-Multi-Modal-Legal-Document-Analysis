import { FileText, Download, Share2, BookOpen, AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRef, useState } from "react";

interface ReportPanelProps {
  summary: string;
  detailedSummary: string;
  clauseCount: number;
  entityCount: number;
  confidence: number;
  documentType: string;
}

export function ReportPanel({ summary, detailedSummary, clauseCount, entityCount, confidence, documentType }: ReportPanelProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleExport = async (format: string) => {
    if (format !== "PDF") {
      toast.info(`${format} export coming soon — this feature is under development.`);
      return;
    }
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Legal_Report_${new Date().toISOString().replace(/[-:.]/g, "")}.pdf`,
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Report link copied to clipboard!");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Legal Intelligence Report</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("PDF")} disabled={downloading} className="text-[10px] h-7 gap-1.5 border-border/50 bg-secondary/30 hover:bg-secondary/60">
            <Download className="w-3 h-3" /> {downloading ? "Generating..." : "PDF"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("DOCX")} className="text-[10px] h-7 gap-1.5 border-border/50 bg-secondary/30 hover:bg-secondary/60">
            <Download className="w-3 h-3" /> DOCX
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="text-[10px] h-7 gap-1.5 border-border/50 bg-secondary/30 hover:bg-secondary/60">
            <Share2 className="w-3 h-3" /> Share
          </Button>
        </div>
      </div>

      {/* Report sections — wrapped for PDF capture */}
      <div ref={reportRef} className="space-y-4 bg-background p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Document Type", value: documentType, icon: FileText },
            { label: "Clauses Found", value: clauseCount.toString(), icon: BookOpen },
            { label: "Entities", value: entityCount.toString(), icon: TrendingUp },
            { label: "Confidence", value: `${confidence}%`, icon: Shield },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-secondary/30 rounded-lg p-3 text-center"
            >
              <stat.icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-sm font-bold text-foreground">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="intel-panel">
          <div className="intel-panel-header">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Executive Summary</span>
          </div>
          <div className="intel-panel-body">
            <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="intel-panel">
          <div className="intel-panel-header">
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-semibold text-foreground">Detailed Analysis</span>
          </div>
          <div className="intel-panel-body">
            <p className="text-xs text-muted-foreground leading-relaxed">{detailedSummary}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/15">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-warning mb-1">Legal Disclaimer</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              This report is generated by AI analysis and should not be considered legal advice. 
              Always consult a qualified legal professional before acting on these findings.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
