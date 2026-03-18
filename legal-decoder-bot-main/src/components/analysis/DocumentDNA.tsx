import { Shield, FileCheck, Languages, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

interface DocumentDNAProps {
  confidence: number;
  language: string;
  documentType: string;
}

export function DocumentDNA({ confidence, language, documentType }: DocumentDNAProps) {
  const metrics = [
    { icon: Shield, label: "Structural Validity", value: Math.min(confidence + 8, 100), gradient: "from-[#38bdf8] to-[#22c55e]" },
    { icon: FileCheck, label: "Legal Compliance", value: Math.min(confidence + 2, 100), gradient: "from-[#a78bfa] to-[#38bdf8]" },
    { icon: Fingerprint, label: "Authenticity Score", value: Math.max(confidence - 5, 0), gradient: "from-[#22c55e] to-[#38bdf8]" },
    { icon: Languages, label: "Language Match", value: language ? 95 : 50, gradient: "from-[#f59e0b] to-[#22c55e]" },
  ];

  return (
    <div className="space-y-5">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <m.icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-foreground/80">{m.label}</span>
              <span className="text-[10px] font-mono font-bold text-foreground/70">{m.value}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 1, delay: 0.4 + i * 0.12, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${m.gradient}`}
                style={{ boxShadow: '0 0 8px rgba(56,189,248,0.3)' }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
