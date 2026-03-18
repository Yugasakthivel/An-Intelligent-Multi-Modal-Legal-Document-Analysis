import { Upload, Loader2, FileUp } from "lucide-react";
import { motion } from "framer-motion";

interface UploadAreaProps {
  uploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadArea({ uploading, onFileUpload }: UploadAreaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <label className="group flex flex-col items-center justify-center border-2 border-dashed border-border/70 rounded-xl p-10 cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 bg-card/30">
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <span className="text-sm font-semibold text-foreground">Processing document...</span>
            <span className="text-xs text-muted-foreground mt-1">AI analysis in progress</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-muted/60 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors duration-200">
              <FileUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
            <span className="text-sm font-semibold text-foreground mb-1">Upload a legal document</span>
            <span className="text-xs text-muted-foreground">PDF, JPG, PNG — Drag & drop or click to browse</span>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onFileUpload}
          disabled={uploading}
        />
      </label>
    </motion.div>
  );
}
