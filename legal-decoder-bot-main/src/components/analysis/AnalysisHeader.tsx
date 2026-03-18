import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, FileText, Upload, FileBarChart } from "lucide-react";
import { motion } from "framer-motion";
import type { DocumentInfo } from "@/pages/AnalysisPage";

interface AnalysisHeaderProps {
  document: DocumentInfo;
}

export function AnalysisHeader({ document }: AnalysisHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="h-10 w-10 rounded-xl glass-card hover:border-primary/30 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </Button>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="text-[9px] font-mono gradient-bg text-primary-foreground border-0 gap-1 px-2 py-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              AI Analyzed
            </Badge>
            <Badge variant="outline" className="text-[9px] font-mono text-muted-foreground border-border/30 bg-transparent">
              {new Date(document.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-primary" />
            {document.file_name}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 tracking-wide">Legal Intelligence Report</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/analysis-report/${document.id}`)}
          className="text-xs h-9 gap-1.5 glass-card border-primary/30 text-primary hover:bg-primary/5"
        >
          <FileBarChart className="w-3.5 h-3.5" />
          View Full Report
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="text-xs h-9 gap-1.5 glass-card border-border/30 hover:border-primary/30 text-muted-foreground hover:text-foreground"
        >
          Open Dashboard
        </Button>
        <Button
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="text-xs h-9 gap-1.5 gradient-bg text-white border-0 shadow-lg shadow-primary/20"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload New
        </Button>
      </div>
    </motion.div>
  );
}
