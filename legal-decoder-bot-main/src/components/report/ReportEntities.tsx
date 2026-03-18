import { Users, Building2, MapPin, CalendarDays, Banknote } from "lucide-react";

interface Entity {
  type: string;
  value: string;
  context?: string;
}

interface Props {
  entities: Entity[];
}

const categoryConfig: Record<string, { icon: typeof Users; label: string; bg: string; text: string; border: string }> = {
  person: { icon: Users, label: "Parties", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  organization: { icon: Building2, label: "Organizations", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  location: { icon: MapPin, label: "Locations", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  date: { icon: CalendarDays, label: "Dates", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  money: { icon: Banknote, label: "Money Values", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
};

export function ReportEntities({ entities }: Props) {
  const grouped = entities.reduce<Record<string, Entity[]>>((acc, e) => {
    const key = e.type.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="intel-panel rounded-xl">
      <div className="intel-panel-header">
        <Users className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-foreground">Entity Extraction</span>
      </div>
      <div className="intel-panel-body">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-xs text-muted-foreground">No entities extracted.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(grouped).map(([type, items]) => {
              const config = categoryConfig[type] || categoryConfig.person;
              const Icon = config.icon;
              return (
                <div key={type} className={`rounded-lg border p-3 ${config.bg} ${config.border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-3.5 h-3.5 ${config.text}`} />
                    <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
                  </div>
                  <div className="space-y-1">
                    {items.map((item, i) => (
                      <p key={i} className="text-xs text-foreground">{item.value}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
