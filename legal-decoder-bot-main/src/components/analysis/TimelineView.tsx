import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineEvent {
  date: string;
  event: string;
  type?: string;
}

interface TimelineViewProps {
  events: TimelineEvent[];
}

export function TimelineView({ events }: TimelineViewProps) {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="w-8 h-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">No timeline events extracted</p>
      </div>
    );
  }

  const typeColor = (t?: string) => {
    if (!t) return "primary";
    if (t === "deadline") return "destructive";
    if (t === "effective") return "success";
    if (t === "notice") return "warning";
    return "primary";
  };

  return (
    <div className="relative pl-6">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border/60 to-transparent" />
      <div className="space-y-1">
        {events.map((event, i) => {
          const color = typeColor(event.type);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex items-start gap-4 py-3 group"
            >
              <div className="absolute -left-6 top-4 flex items-center justify-center">
                <div className={`w-2.5 h-2.5 rounded-full bg-${color} ring-4 ring-background`} />
              </div>
              <div className="intel-panel flex-1 p-4 group-hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-mono font-medium text-primary">{event.date}</span>
                  {event.type && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase bg-${color}/10 text-${color}`}>
                      {event.type}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{event.event}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
