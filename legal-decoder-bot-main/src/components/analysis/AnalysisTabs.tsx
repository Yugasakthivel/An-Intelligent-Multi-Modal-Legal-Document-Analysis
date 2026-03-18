import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, AlertTriangle, Users, Calendar,
  Fingerprint, GitCompare, FileBarChart, MessageSquare
} from "lucide-react";
import { RiskClauseCard } from "./RiskClauseCard";
import { MissingClauses } from "./MissingClauses";
import { EntityTags } from "./EntityTags";
import { TimelineView } from "./TimelineView";
import { VerificationPanel } from "./VerificationPanel";
import { ComparisonPanel } from "./ComparisonPanel";
import { ReportPanel } from "./ReportPanel";
import DocumentChat from "@/components/DocumentChat";
import { motion } from "framer-motion";
import type { AnalysisResult } from "@/pages/AnalysisPage";

interface AnalysisTabsProps {
  analysis: AnalysisResult;
  documentId: string;
}

const tabs = [
  { value: "risks", icon: Shield, label: "Risks" },
  { value: "missing", icon: AlertTriangle, label: "Missing Clauses" },
  { value: "entities", icon: Users, label: "Entities" },
  { value: "timeline", icon: Calendar, label: "Timeline" },
  { value: "verification", icon: Fingerprint, label: "Verification" },
  { value: "comparison", icon: GitCompare, label: "Comparison" },
  { value: "report", icon: FileBarChart, label: "Report" },
  { value: "chat", icon: MessageSquare, label: "Ask AI" },
];

export function AnalysisTabs({ analysis, documentId }: AnalysisTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
    >
      <Tabs defaultValue="risks" className="space-y-4">
        <TabsList className="glass-card p-1.5 rounded-xl h-auto flex-wrap gap-1 border-border/20">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-[11px] gap-1.5 rounded-lg px-3.5 py-2.5 text-muted-foreground transition-all duration-200
                data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none
                data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:rounded-b-none
                hover:text-foreground"
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="risks">
          <div className="space-y-3">
            {analysis.clauses.map((clause, i) => (
              <RiskClauseCard key={i} clause={clause} index={i} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="missing">
          <div className="glass-card-elevated rounded-xl p-6">
            <MissingClauses clauses={[]} />
          </div>
        </TabsContent>

        <TabsContent value="entities">
          <EntityTags entities={analysis.entities} />
        </TabsContent>

        <TabsContent value="timeline">
          <div className="glass-card-elevated rounded-xl p-6">
            <TimelineView events={analysis.timeline} />
          </div>
        </TabsContent>

        <TabsContent value="verification">
          <div className="glass-card-elevated rounded-xl p-6">
            <VerificationPanel confidence={analysis.confidence_score} documentType={analysis.document_type} />
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="glass-card-elevated rounded-xl p-6">
            <ComparisonPanel clauses={analysis.clauses} />
          </div>
        </TabsContent>

        <TabsContent value="report">
          <div className="glass-card-elevated rounded-xl p-6">
            <ReportPanel
              summary={analysis.summary}
              detailedSummary={analysis.detailed_summary}
              clauseCount={analysis.clauses.length}
              entityCount={analysis.entities.length}
              confidence={analysis.confidence_score}
              documentType={analysis.document_type}
            />
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <DocumentChat documentId={documentId} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
