import { Lightbulb, ChevronRight } from "lucide-react";

interface Props {
  recommendations: string[];
}

export function ReportRecommendations({ recommendations }: Props) {
  return (
    <div className="ai-insights-panel rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-primary/15">
        <Lightbulb className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">AI Recommendations</span>
      </div>
      <div className="p-5 space-y-2">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs">
            <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <p className="text-foreground leading-relaxed">{rec}</p>
          </div>
        ))}
        <div className="border-t border-primary/10 pt-3 mt-3">
          <p className="text-[10px] text-muted-foreground italic">
            These recommendations are AI-generated and should not be considered legal advice. Always consult a qualified legal professional.
          </p>
        </div>
      </div>
    </div>
  );
}
