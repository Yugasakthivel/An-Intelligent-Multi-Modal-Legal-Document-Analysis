import { Users, Calendar, MapPin, DollarSign, Scale, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Entity {
  type: string;
  value: string;
  context?: string;
}

interface EntityTagsProps {
  entities: Entity[];
}

const typeConfig: Record<string, { icon: React.ElementType; label: string; bg: string; text: string; border: string }> = {
  party_name: { icon: Users, label: "People / Parties", bg: "rgba(56,189,248,0.1)", text: "#38bdf8", border: "rgba(56,189,248,0.2)" },
  organization: { icon: Building2, label: "Organizations", bg: "rgba(167,139,250,0.1)", text: "#a78bfa", border: "rgba(167,139,250,0.2)" },
  date: { icon: Calendar, label: "Dates", bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.2)" },
  location: { icon: MapPin, label: "Locations", bg: "rgba(251,146,60,0.1)", text: "#fb923c", border: "rgba(251,146,60,0.2)" },
  monetary_amount: { icon: DollarSign, label: "Monetary Values", bg: "rgba(34,197,94,0.1)", text: "#22c55e", border: "rgba(34,197,94,0.2)" },
  legal_reference: { icon: Scale, label: "Legal References", bg: "rgba(34,197,94,0.1)", text: "#22c55e", border: "rgba(34,197,94,0.2)" },
};

export function EntityTags({ entities }: EntityTagsProps) {
  const grouped = entities.reduce((acc, entity) => {
    const group = acc[entity.type] || [];
    group.push(entity);
    acc[entity.type] = group;
    return acc;
  }, {} as Record<string, Entity[]>);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([type, items]) => {
        const config = typeConfig[type] || { icon: Scale, label: type.replace("_", " "), bg: "rgba(148,163,184,0.1)", text: "#94a3b8", border: "rgba(148,163,184,0.2)" };
        const Icon = config.icon;

        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card-elevated rounded-xl"
          >
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
              <Icon className="w-3.5 h-3.5" style={{ color: config.text }} />
              <h3 className="text-xs font-bold text-foreground capitalize">{config.label}</h3>
              <span className="text-[10px] text-muted-foreground ml-auto font-mono">{items.length}</span>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {items.map((entity, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-default transition-all duration-200 hover:brightness-125"
                        style={{
                          background: config.bg,
                          color: config.text,
                          border: `1px solid ${config.border}`,
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        {entity.value}
                      </motion.span>
                    </TooltipTrigger>
                    {entity.context && (
                      <TooltipContent side="bottom" className="max-w-xs text-xs glass-card-elevated border-border/20">
                        {entity.context}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
