import { motion } from "framer-motion";

interface ConfidenceGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

export function ConfidenceGauge({ score, label = "Confidence", size = 100 }: ConfidenceGaugeProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Track */}
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          {/* Glow layer */}
          <motion.circle
            cx={center} cy={center} r={radius} fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
            opacity="0.2" filter="blur(4px)"
          />
          {/* Main arc */}
          <motion.circle
            cx={center} cy={center} r={radius} fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="text-xl font-bold text-foreground leading-none"
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}
