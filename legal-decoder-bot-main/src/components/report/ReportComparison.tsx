import { GitCompare } from "lucide-react";

interface Clause {
  title: string;
  content: string;
  type?: string;
}

interface Props {
  clauses: Clause[];
}

export function ReportComparison({ clauses }: Props) {
  const types = [...new Set(clauses.map(c => c.type || "general").map(t => t.toLowerCase()))];

  return (
    <div className="intel-panel rounded-xl">
      <div className="intel-panel-header">
        <GitCompare className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-foreground">Document Comparison</span>
      </div>
      <div className="intel-panel-body">
        {clauses.length === 0 ? (
          <p className="text-xs text-muted-foreground">No clauses available for comparison.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Clause categories found in this document:
            </p>
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <span key={t} className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-secondary border border-border text-foreground capitalize">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground border-t border-border pt-3">
              Upload a reference document to enable side-by-side comparison analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
