import { FileText, Users, Shield, AlertTriangle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { ConfidenceGauge } from "./ConfidenceGauge";
import type { AnalysisResult } from "@/pages/AnalysisPage";

interface AnalysisMetricsProps {
  analysis: AnalysisResult;
  riskCount: number;
}

export function AnalysisMetrics({ analysis, riskCount }: AnalysisMetricsProps) {
  const cards = [
    {
      icon: FileText,
      iconClass: "metric-icon",
      label: "Classification",
      value: analysis.document_type,
      sub: analysis.language?.toUpperCase(),
      isText: true,
    },
    {
      icon: Users,
      iconClass: "metric-icon metric-icon-accent",
      label: "Entities",
      value: analysis.entities.length.toString(),
      sub: "Extracted identifiers",
    },
    {
      icon: Shield,
      iconClass: "metric-icon metric-icon-warning",
      label: "Clauses",
      value: analysis.clauses.length.toString(),
      sub: "Segmented sections",
    },
    {
      icon: AlertTriangle,
      iconClass: "metric-icon metric-icon-danger",
      label: "Risks",
      value: riskCount.toString(),
      sub: "Flagged issues",
    },
    {
      icon: Zap,
      iconClass: "metric-icon metric-icon-success",
      label: "Status",
      value: analysis.confidence_score >= 60 ? "Verified" : "Needs Review",
      valueClass: analysis.confidence_score >= 60 ? "text-success" : "text-warning",
      sub: "Legal marker",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="glass-card-elevated rounded-xl p-4"
        >
          <div className={card.iconClass}>
            <card.icon className="w-3.5 h-3.5 text-inherit" style={{ color: 'inherit' }} />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-3 mb-1">{card.label}</p>
          {card.isText ? (
            <>
              <p className="text-sm font-bold text-foreground leading-tight">{card.value}</p>
              {card.sub && <p className="text-[10px] text-muted-foreground mt-1 font-mono">{card.sub}</p>}
            </>
          ) : (
            <>
              <p className={`text-2xl font-bold ${card.valueClass || "text-foreground"}`}>{card.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{card.sub}</p>
            </>
          )}
        </motion.div>
      ))}

      {/* Confidence Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="glass-card-elevated rounded-xl p-4 flex items-center justify-center"
      >
        <ConfidenceGauge score={analysis.confidence_score} label="AI Confidence" size={90} />
      </motion.div>
    </div>
  );
}
