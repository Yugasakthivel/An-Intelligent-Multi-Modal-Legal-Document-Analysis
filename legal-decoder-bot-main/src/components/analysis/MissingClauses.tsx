import { AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

interface MissingClause {
  name: string;
  importance: "high" | "medium" | "low";
  reason: string;
  suggestion: string;
}

interface MissingClausesProps {
  clauses: MissingClause[];
}

const defaultClauses: MissingClause[] = [
  {
    name: "Confidentiality Clause",
    importance: "high",
    reason: "Without a confidentiality clause, shared information may be disclosed to third parties.",
    suggestion: "Add a mutual NDA section covering all proprietary information."
  },
  {
    name: "Termination Clause",
    importance: "high",
    reason: "No clear exit strategy defined. Either party may face difficulty ending the agreement.",
    suggestion: "Include termination conditions, notice periods, and post-termination obligations."
  },
  {
    name: "Governing Law",
    importance: "medium",
    reason: "Absence of governing law clause may lead to jurisdictional disputes.",
    suggestion: "Specify the applicable jurisdiction and governing law."
  },
  {
    name: "Force Majeure",
    importance: "medium",
    reason: "No provisions for unforeseeable circumstances that prevent fulfillment.",
    suggestion: "Add force majeure clause covering natural disasters, pandemics, etc."
  },
];

export function MissingClauses({ clauses }: MissingClausesProps) {
  const displayClauses = clauses.length > 0 ? clauses : defaultClauses;

  const importanceConfig = {
    high: { border: "border-l-destructive", bg: "bg-destructive/5", badge: "bg-destructive/15 text-destructive" },
    medium: { border: "border-l-warning", bg: "bg-warning/5", badge: "bg-warning/15 text-warning" },
    low: { border: "border-l-info", bg: "bg-info/5", badge: "bg-info/15 text-info" },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <span className="text-xs font-semibold text-foreground">{displayClauses.length} Missing Clauses Detected</span>
      </div>

      {displayClauses.map((clause, i) => {
        const config = importanceConfig[clause.importance];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`intel-panel border-l-3 ${config.border} ${config.bg} p-4`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                <h4 className="text-sm font-semibold text-foreground">{clause.name}</h4>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${config.badge}`}>
                {clause.importance}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2 pl-5.5">{clause.reason}</p>
            <div className="flex items-start gap-1.5 pl-5.5">
              <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-primary/80 leading-relaxed">{clause.suggestion}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
