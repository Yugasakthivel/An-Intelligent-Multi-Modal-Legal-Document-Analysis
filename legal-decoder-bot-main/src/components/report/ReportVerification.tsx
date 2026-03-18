import { Fingerprint, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  confidence: number;
  documentType: string;
}

export function ReportVerification({ confidence, documentType }: Props) {
  const isVerified = confidence >= 75;

  return (
    <div className="intel-panel rounded-xl">
      <div className="intel-panel-header">
        <Fingerprint className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Verification Status</span>
      </div>
      <div className="intel-panel-body">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border">
            {isVerified ? (
              <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
            ) : (
              <AlertCircle className="w-6 h-6 text-warning mx-auto mb-2" />
            )}
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Authenticity</p>
            <p className={`text-sm font-bold ${isVerified ? "text-primary" : "text-warning"}`}>
              {isVerified ? "Verified" : "Needs Review"}
            </p>
          </div>
          <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border">
            <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Structure</p>
            <p className="text-sm font-bold text-primary">Valid</p>
          </div>
          <div className="text-center p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="relative w-14 h-14 mx-auto mb-2">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-border" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke="url(#reportGauge)" strokeWidth="2.5"
                  strokeDasharray={`${confidence * 0.975} 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="reportGauge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                {confidence}%
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">AI Confidence</p>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground border-t border-border pt-3">
          Document Type: <span className="font-semibold text-foreground">{documentType}</span>
        </div>
      </div>
    </div>
  );
}
