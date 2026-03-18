import { BookOpen } from "lucide-react";

interface Props {
  summary: string;
  detailedSummary: string;
}

export function ReportExecutiveSummary({ summary, detailedSummary }: Props) {
  return (
    <div className="intel-panel rounded-xl">
      <div className="intel-panel-header">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Executive Summary</span>
      </div>
      <div className="intel-panel-body space-y-3">
        <p className="text-sm text-foreground leading-relaxed">{summary}</p>
        {detailedSummary && (
          <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">{detailedSummary}</p>
        )}
      </div>
    </div>
  );
}
