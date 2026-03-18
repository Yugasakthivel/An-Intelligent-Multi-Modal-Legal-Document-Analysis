import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

interface Clause {
  title: string;
  content: string;
  type?: string;
}

interface RiskClauseCardProps {
  clause: Clause;
  index: number;
}

const typeStyles: Record<string, { riskClass: string; level: string; badgeBg: string; badgeText: string }> = {
  obligation: { riskClass: "risk-card-medium", level: "Medium", badgeBg: "rgba(245,158,11,0.15)", badgeText: "#f59e0b" },
  right: { riskClass: "risk-card-low", level: "Low", badgeBg: "rgba(34,197,94,0.15)", badgeText: "#22c55e" },
  termination: { riskClass: "risk-card-high", level: "High", badgeBg: "rgba(239,68,68,0.15)", badgeText: "#ef4444" },
  penalty: { riskClass: "risk-card-critical", level: "Critical", badgeBg: "rgba(239,68,68,0.2)", badgeText: "#ef4444" },
  liability: { riskClass: "risk-card-high", level: "High", badgeBg: "rgba(239,68,68,0.15)", badgeText: "#ef4444" },
  confidentiality: { riskClass: "risk-card-medium", level: "Medium", badgeBg: "rgba(245,158,11,0.15)", badgeText: "#f59e0b" },
};

export function RiskClauseCard({ clause, index }: RiskClauseCardProps) {
  const style = typeStyles[clause.type?.toLowerCase() || ""] || {
    riskClass: "",
    level: "Info",
    badgeBg: "rgba(148,163,184,0.1)",
    badgeText: "#94a3b8",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`intel-panel ${style.riskClass} p-5`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.1)' }}>
            <span className="text-[9px] font-bold font-mono text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground mb-1.5">{clause.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{clause.content}</p>
          </div>
        </div>
        {clause.type && (
          <Badge
            className="text-[9px] capitalize font-bold border-0 shrink-0 px-2.5 py-1"
            style={{ background: style.badgeBg, color: style.badgeText }}
          >
            {style.level} Risk
          </Badge>
        )}
      </div>

      {clause.type && (
        <div className="flex items-center gap-2.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(148,163,184,0.06)' }}>
          <Shield className="w-3 h-3 text-primary" />
          <span className="text-[10px] text-primary/90 font-medium">
            {clause.type === "termination" ? "Review termination conditions carefully before signing" :
             clause.type === "penalty" ? "Negotiate penalty caps and limitation of liability" :
             clause.type === "liability" ? "Consider adding indemnification limits" :
             "Standard clause — verify alignment with your requirements"}
          </span>
        </div>
      )}
    </motion.div>
  );
}
