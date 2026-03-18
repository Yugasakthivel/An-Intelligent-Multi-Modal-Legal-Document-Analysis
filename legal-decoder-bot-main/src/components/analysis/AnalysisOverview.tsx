import { Eye, Fingerprint, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { DocumentDNA } from "./DocumentDNA";
import type { AnalysisResult } from "@/pages/AnalysisPage";

interface AnalysisOverviewProps {
  analysis: AnalysisResult;
}

export function AnalysisOverview({ analysis }: AnalysisOverviewProps) {
  const topPeople = analysis.entities.filter(e => e.type === "party_name").slice(0, 4);
  const topOrgs = analysis.entities.filter(e => e.type === "organization").slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Document DNA */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card-elevated rounded-xl col-span-1 lg:col-span-3"
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
          <Fingerprint className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground tracking-wide">Document DNA</span>
        </div>
        <div className="p-5">
          <DocumentDNA
            confidence={analysis.confidence_score}
            language={analysis.language}
            documentType={analysis.document_type}
          />
        </div>
      </motion.div>

      {/* Key Takeaways */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="glass-card-elevated rounded-xl col-span-1 lg:col-span-5"
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground tracking-wide">Key Takeaways</span>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-foreground/85 leading-relaxed">{analysis.summary}</p>
          {analysis.detailed_summary && (
            <div className="border-t pt-4" style={{ borderColor: 'rgba(148,163,184,0.06)' }}>
              <p className="text-xs text-muted-foreground leading-relaxed">{analysis.detailed_summary}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="ai-insights-panel col-span-1 lg:col-span-4"
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b" style={{ borderColor: 'rgba(56,189,248,0.1)' }}>
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground tracking-wide">AI Insights</span>
          <span className="ml-auto text-[9px] font-mono px-2.5 py-1 rounded-full gradient-bg text-white font-semibold flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" />
            INTELLIGENCE
          </span>
        </div>
        <div className="p-5 space-y-4">
          {topPeople.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2.5">Key Individuals</p>
              <div className="flex flex-wrap gap-1.5">
                {topPeople.map((e, i) => (
                  <span key={i} className="text-[11px] px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                    {e.value}
                  </span>
                ))}
              </div>
            </div>
          )}
          {topOrgs.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2.5">Organizations</p>
              <div className="flex flex-wrap gap-1.5">
                {topOrgs.map((e, i) => (
                  <span key={i} className="text-[11px] px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                    {e.value}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="border-t pt-4" style={{ borderColor: 'rgba(56,189,248,0.1)' }}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2.5">Authenticity Signal</p>
            <div className="flex items-center gap-2.5">
              <div className={`w-2.5 h-2.5 rounded-full ${analysis.confidence_score >= 60 ? "intel-dot-active" : "intel-dot-warning"}`} />
              <span className={`text-xs font-bold ${analysis.confidence_score >= 60 ? "text-success" : "text-warning"}`}>
                {analysis.confidence_score >= 60 ? "Authentic Pattern Detected" : "Requires Manual Verification"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
