import { AlertTriangle, Shield } from "lucide-react";

interface Clause {
  title: string;
  content: string;
  type?: string;
}

interface Props {
  riskScore: number;
  riskLevel: string;
  clauses: Clause[];
  allClauses: Clause[];
}

export function ReportRiskAnalysis({ riskScore, riskLevel, clauses, allClauses }: Props) {
  const riskColor = riskLevel === "High" ? "bg-destructive" : riskLevel === "Medium" ? "bg-warning" : "bg-primary";
  const riskCardClass = riskLevel === "High" ? "risk-card-high" : riskLevel === "Medium" ? "risk-card-medium" : "risk-card-low";

  return (
    <div className="intel-panel rounded-xl">
      <div className="intel-panel-header">
        <Shield className="w-4 h-4 text-destructive" />
        <span className="text-sm font-semibold text-foreground">Risk Analysis</span>
      </div>
      <div className="intel-panel-body space-y-4">
        {/* Risk bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Overall Risk Level</span>
              <span className="text-xs font-bold text-foreground">{riskScore}%</span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
              <div className={`h-full ${riskColor} rounded-full transition-all duration-700`} style={{ width: `${riskScore}%` }} />
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${riskLevel === "High" ? "bg-destructive/10 text-destructive" : riskLevel === "Medium" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>
            {riskLevel} Risk
          </span>
        </div>

        {/* Risk items */}
        {clauses.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Detected Risks:</p>
            {clauses.map((c, i) => (
              <div key={i} className={`${riskCardClass} rounded-lg p-3`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No high-risk clauses detected.</p>
        )}

        {/* Total clauses info */}
        <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
          Total clauses analyzed: <span className="font-semibold text-foreground">{allClauses.length}</span>
        </div>
      </div>
    </div>
  );
}
