import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Scale, ArrowRight, FileSearch, Shield, Zap, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate("/dashboard");
      setChecking(false);
    });
  }, [navigate]);

  if (checking) return null;

  const features = [
    { icon: FileSearch, title: "Smart OCR", desc: "Extract text from PDFs, images, and scanned documents with AI-powered OCR" },
    { icon: Shield, title: "Risk Detection", desc: "Identify legal risks, missing clauses, and compliance issues automatically" },
    { icon: Zap, title: "Instant Analysis", desc: "Get entity extraction, clause segmentation, and summaries in seconds" },
    { icon: MessageSquare, title: "Document Chat", desc: "Ask questions and get source-backed answers about your legal documents" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-border bg-card sticky top-0 z-20">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Scale className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">LegalDocAI</span>
          </div>
          <Button size="sm" onClick={() => navigate("/auth")} className="gradient-bg text-primary-foreground text-xs font-semibold gap-1.5 shadow-md">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/6 via-primary/3 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container relative pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-primary/8 text-primary rounded-full px-3.5 py-1.5 text-xs font-semibold mb-6 border border-primary/15">
              <Zap className="w-3.5 h-3.5" />
              Powered by Advanced AI Models
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-5 leading-[1.1] tracking-tight"
          >
            Legal Document
            <br />
            <span className="gradient-text">Intelligence Platform</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed"
          >
            Upload contracts, agreements, and legal notices. Get instant classification, risk analysis, entity extraction, and AI-powered insights.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-3"
          >
            <Button size="lg" onClick={() => navigate("/auth")} className="gradient-bg text-primary-foreground font-semibold gap-2 shadow-lg hover:shadow-xl transition-all h-12 px-6">
              Start Analyzing <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 font-semibold text-foreground border-border hover:bg-secondary">
              View Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/12 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
