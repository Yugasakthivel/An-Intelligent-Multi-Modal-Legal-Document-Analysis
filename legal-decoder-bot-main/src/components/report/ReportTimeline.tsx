import { Clock, Calendar } from "lucide-react";

interface TimelineEvent {
  date: string;
  event: string;
  type?: string;
}

interface Props {
  events: TimelineEvent[];
}

export function ReportTimeline({ events }: Props) {
  return (
    <div className="intel-panel rounded-xl">
      <div className="intel-panel-header">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Document Timeline</span>
      </div>
      <div className="intel-panel-body">
        {!events || events.length === 0 ? (
          <p className="text-xs text-muted-foreground">No timeline events extracted.</p>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[9px] top-1 bottom-1 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />
            <div className="space-y-3">
              {events.map((event, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                  <div className="flex-1 bg-secondary/50 rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] font-mono font-semibold text-primary">{event.date}</span>
                      {event.type && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
                          {event.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/80">{event.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
