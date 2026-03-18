import { FileText, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardsProps {
  totalDocuments: number;
  completedDocuments: number;
  errorDocuments: number;
}

export function MetricCards({ totalDocuments, completedDocuments, errorDocuments }: MetricCardsProps) {
  const metrics = [
    {
      label: "Total Documents",
      value: totalDocuments,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Analyzed",
      value: completedDocuments,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Errors",
      value: errorDocuments,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Success Rate",
      value: totalDocuments > 0 ? `${Math.round((completedDocuments / totalDocuments) * 100)}%` : "—",
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="metric-card"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.label}</span>
            <div className={`w-8 h-8 rounded-lg ${m.bgColor} flex items-center justify-center`}>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{m.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
