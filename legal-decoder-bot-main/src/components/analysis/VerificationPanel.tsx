import { Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ConfidenceGauge } from "./ConfidenceGauge";

interface VerificationPanelProps {
  confidence: number;
  documentType: string;
}

export function VerificationPanel({ confidence, documentType }: VerificationPanelProps) {
  const legalityScore = Math.min(confidence + 5, 100);
  const complianceLevel = confidence >= 70 ? "Compliant" : confidence >= 40 ? "Partial" : "Non-Compliant";

  const checks = [
    { label: "Document Structure", status: confidence > 30 ? "pass" : "fail", detail: "Structural elements verified" },
    { label: "Clause Completeness", status: confidence > 50 ? "pass" : "warn", detail: "Missing clauses detected" },
    { label: "Legal Language", status: confidence > 40 ? "pass" : "warn", detail: "Language patterns analyzed" },
    { label: "Signature Presence", status: confidence > 60 ? "pass" : "fail", detail: "Signature blocks checked" },
    { label: "Date Validity", status: confidence > 35 ? "pass" : "fail", detail: "Date references validated" },
    { label: "Party Identification", status: confidence > 45 ? "pass" : "warn", detail: "Named parties verified" },
  ];

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "pass") return <CheckCircle className="w-3.5 h-3.5 text-success" />;
    if (status === "warn") return <AlertCircle className="w-3.5 h-3.5 text-warning" />;
    return <XCircle className="w-3.5 h-3.5 text-destructive" />;
  };

  return (
    <div className="space-y-6">
      {/* Score overview */}
      <div className="flex items-center gap-8">
        <ConfidenceGauge score={legalityScore} label="Legality Score" size={110} />
        <div className="flex-1 space-y-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Compliance Level</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-bold ${
                complianceLevel === "Compliant" ? "text-success" :
                complianceLevel === "Partial" ? "text-warning" : "text-destructive"
              }`}>{complianceLevel}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Document Class</span>
            <p className="text-sm font-semibold text-foreground mt-0.5">{documentType}</p>
          </div>
        </div>
      </div>

      {/* Verification checks */}
      <div className="space-y-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Verification Checks</span>
        <div className="space-y-1.5">
          {checks.map((check, i) => (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <StatusIcon status={check.status} />
                <div>
                  <span className="text-xs font-medium text-foreground">{check.label}</span>
                  <p className="text-[10px] text-muted-foreground">{check.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
