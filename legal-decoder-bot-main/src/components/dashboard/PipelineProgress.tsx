import { Upload, ShieldCheck, Cpu, Brain, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface PipelineProgressProps {
  currentStage: string;
}

const stages = [
  { key: "upload", label: "Upload", icon: Upload },
  { key: "validation", label: "Validate", icon: ShieldCheck },
  { key: "processing", label: "Process", icon: Cpu },
  { key: "analysis", label: "AI Analysis", icon: Brain },
  { key: "complete", label: "Complete", icon: CheckCircle2 },
];

export function PipelineProgress({ currentStage }: PipelineProgressProps) {
  const currentIndex = stages.findIndex(s => s.key === currentStage);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/60 rounded-xl p-5"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Processing Pipeline</p>
      <div className="flex items-center gap-1">
        {stages.map((stage, i) => {
          const isComplete = i < currentIndex;
          const isCurrent = i === currentIndex;
          const StageIcon = stage.icon;

          return (
            <div key={stage.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isComplete ? "bg-success/10 text-success" :
                  isCurrent ? "bg-primary/10 text-primary shadow-sm shadow-primary/20" :
                  "bg-muted/60 text-muted-foreground/40"
                }`}>
                  <StageIcon className={`w-4 h-4 ${isCurrent ? "animate-pulse-soft" : ""}`} />
                </div>
                <span className={`text-[10px] font-medium mt-1.5 ${
                  isComplete ? "text-success" : isCurrent ? "text-primary" : "text-muted-foreground/40"
                }`}>{stage.label}</span>
              </div>
              {i < stages.length - 1 && (
                <div className={`h-px flex-1 mx-1 transition-all duration-500 ${
                  isComplete ? "bg-success/40" : "bg-border/40"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
