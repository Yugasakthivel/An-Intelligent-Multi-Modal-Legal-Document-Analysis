import { GitCompare, Plus, Minus, Edit3 } from "lucide-react";
import { motion } from "framer-motion";

interface ComparisonPanelProps {
  clauses: Array<{ title: string; content: string; type?: string }>;
}

export function ComparisonPanel({ clauses }: ComparisonPanelProps) {
  // Simulate comparison data from existing clauses
  const comparisonItems = clauses.slice(0, 6).map((clause, i) => ({
    title: clause.title,
    status: i % 3 === 0 ? "added" : i % 3 === 1 ? "modified" : "present",
    original: i % 3 === 1 ? "Original version of clause text..." : null,
    current: clause.content,
  }));

  const statusConfig = {
    added: { icon: Plus, color: "text-success", bg: "bg-success/8", border: "border-l-success", label: "Added" },
    removed: { icon: Minus, color: "text-destructive", bg: "bg-destructive/8", border: "border-l-destructive", label: "Removed" },
    modified: { icon: Edit3, color: "text-warning", bg: "bg-warning/8", border: "border-l-warning", label: "Modified" },
    present: { icon: GitCompare, color: "text-muted-foreground", bg: "bg-secondary/30", border: "border-l-border", label: "Unchanged" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <GitCompare className="w-4 h-4 text-accent" />
        <span className="text-xs font-semibold text-foreground">Document Clause Comparison</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{comparisonItems.length} clauses analyzed</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {(["added", "modified", "present"] as const).map((s) => {
          const cfg = statusConfig[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cfg.color.replace("text-", "bg-")}`} />
              <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {comparisonItems.map((item, i) => {
          const cfg = statusConfig[item.status as keyof typeof statusConfig];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`intel-panel border-l-3 ${cfg.border} ${cfg.bg} p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                <span className="text-xs font-semibold text-foreground">{item.title}</span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5.5 line-clamp-2">{item.current}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
