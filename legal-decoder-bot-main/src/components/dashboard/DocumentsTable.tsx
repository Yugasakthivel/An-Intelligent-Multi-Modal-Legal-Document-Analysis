import { FileText, CheckCircle2, Loader2, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { Document } from "@/pages/Dashboard";

interface DocumentsTableProps {
  documents: Document[];
  onDocumentClick: (id: string) => void;
}

const statusConfig = {
  completed: { icon: CheckCircle2, label: "Completed", class: "bg-success/10 text-success border-success/20" },
  processing: { icon: Loader2, label: "Processing", class: "bg-primary/10 text-primary border-primary/20" },
  error: { icon: AlertCircle, label: "Error", class: "bg-destructive/10 text-destructive border-destructive/20" },
  pending: { icon: Clock, label: "Pending", class: "bg-warning/10 text-warning border-warning/20" },
};

export function DocumentsTable({ documents, onDocumentClick }: DocumentsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Recent Documents</h3>
        <span className="text-xs text-muted-foreground">{documents.length} total</span>
      </div>

      {documents.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-xl p-16 text-center">
          <div className="w-14 h-14 rounded-xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No documents yet</p>
          <p className="text-xs text-muted-foreground">Upload a legal document to get started with AI analysis</p>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-xl overflow-hidden divide-y divide-border/40">
          {documents.map((doc) => {
            const config = statusConfig[doc.status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isClickable = doc.status === "completed";

            return (
              <div
                key={doc.id}
                onClick={() => isClickable && onDocumentClick(doc.id)}
                className={`flex items-center justify-between p-4 transition-colors duration-150 ${
                  isClickable ? "cursor-pointer hover:bg-muted/30" : "opacity-70"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="outline" className={`${config.class} text-[10px] font-medium gap-1 py-0.5`}>
                    <StatusIcon className={`w-3 h-3 ${doc.status === "processing" ? "animate-spin" : ""}`} />
                    {config.label}
                  </Badge>
                  {isClickable && <ChevronRight className="w-4 h-4 text-muted-foreground/40" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
