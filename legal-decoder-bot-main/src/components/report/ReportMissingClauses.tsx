import { CheckCircle2, AlertCircle, ClipboardList } from "lucide-react";

interface ClauseStatus {
  name: string;
  present: boolean;
}

interface Props {
  clauses: ClauseStatus[];
}

export function ReportMissingClauses({ clauses }: Props) {
  return (
    <div className="intel-panel rounded-xl">
      <div className="intel-panel-header">
        <ClipboardList className="w-4 h-4 text-warning" />
        <span className="text-sm font-semibold text-foreground">Missing Clauses</span>
      </div>
      <div className="intel-panel-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {clauses.map((c) => (
            <div
              key={c.name}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                c.present
                  ? "bg-primary/5 border-primary/20 text-primary"
                  : "bg-warning/5 border-warning/20 text-warning"
              }`}
            >
              {c.present ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{c.name}</span>
              <span className="ml-auto text-[10px] opacity-70">{c.present ? "Found" : "Missing"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
