import { FileText, Calendar, Shield, Activity } from "lucide-react";

interface ReportHeaderProps {
  fileName: string;
  uploadDate: string;
  analysisDate: string;
  riskScore: number;
  riskLevel: string;
  confidence: number;
}

export function ReportHeader({ fileName, uploadDate, analysisDate, riskScore, riskLevel, confidence }: ReportHeaderProps) {
  const riskColor = riskLevel === "High" ? "text-destructive" : riskLevel === "Medium" ? "text-warning" : "text-primary";
  const riskBg = riskLevel === "High" ? "bg-destructive/10 border-destructive/20" : riskLevel === "Medium" ? "bg-warning/10 border-warning/20" : "bg-primary/10 border-primary/20";

  return (
    <div className="intel-panel rounded-xl overflow-hidden">
      <div className="gradient-bg px-6 py-5">
        <h1 className="text-lg font-bold text-white">Legal Intelligence Report</h1>
        <p className="text-xs text-white/70 mt-1">AI-Powered Document Analysis</p>
      </div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-start gap-3">
          <div className="metric-icon shrink-0"><FileText className="w-4 h-4 text-primary" /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Document</p>
            <p className="text-xs font-semibold text-foreground truncate max-w-[140px]">{fileName}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="metric-icon shrink-0"><Calendar className="w-4 h-4 text-primary" /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Upload Date</p>
            <p className="text-xs font-semibold text-foreground">{new Date(uploadDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className={`metric-icon shrink-0 ${riskBg}`}><Shield className={`w-4 h-4 ${riskColor}`} /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Risk Score</p>
            <p className={`text-xs font-bold ${riskColor}`}>{riskScore}% ({riskLevel})</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="metric-icon-success metric-icon shrink-0"><Activity className="w-4 h-4 text-primary" /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">AI Confidence</p>
            <p className="text-xs font-bold text-primary">{confidence}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
