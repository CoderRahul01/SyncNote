"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Sparkles, Youtube, Instagram, Linkedin, Zap, Search, BarChart3, ShieldCheck, ArrowLeft } from "lucide-react";
import ReportViewer from "@/components/ReportViewer";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<{ report: string; platform: string } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:8000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, user_id: "demo_user" })
      });
      
      if (!response.ok) throw new Error("Failed to generate report");
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error(error);
      // Fallback for demo if backend is not running
      setReportData({
        platform: "youtube",
        report: "# Demo Report: Vibe Coding with AI Agents\n\n## Executive Summary\nThis video explores the emerging trend of 'Vibe Coding', where developers use high-level natural language to guide agentic systems. [02:15]\n\n## Technical Deep Dive\n- **Agent Orchestration**: Using multi-agent loops for complex tasks. [04:45]\n- **Prompt Engineering**: Transitioning from instruction to intent-based interaction. [08:20]\n\n## Actionable Insights\n1. Use specialized agents for research vs. coding.\n2. Maintain a long-term memory bank for project context."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {!reportData ? (
          <motion.div 
            key="input-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full flex flex-col items-center"
          >
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-12"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                <Zap className="text-white fill-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gradient">SyncNote</h1>
            </motion.div>

            {/* Hero Section */}
            <div className="max-w-4xl w-full flex flex-col items-center text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
              >
                Your <span className="text-accent">Attention Garden</span> for Social Knowledge
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-12"
              >
                Transform productive scrolling into structured insights. Extract transcripts, verify claims, and build your second brain from YouTube, Instagram, and LinkedIn.
              </motion.p>

              {/* Search Bar Container */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-2xl relative"
              >
                <div className="glass p-2 rounded-2xl flex items-center gap-2 border-white/10 group focus-within:border-accent/50 transition-all duration-300">
                  <div className="pl-4 text-foreground/40">
                    <Link2 size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Paste YouTube, Instagram, or LinkedIn URL..."
                    className="flex-1 bg-transparent border-none outline-none text-lg py-3 px-2 text-foreground placeholder:text-foreground/30"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={!url || isGenerating}
                    className="bg-accent hover:bg-accent/80 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Generate Report</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Social Icons Support */}
                <div className="flex gap-6 mt-6 justify-center text-foreground/40">
                  <div className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors cursor-default">
                    <Youtube size={16} /> YouTube
                  </div>
                  <div className="flex items-center gap-2 text-sm hover:text-pink-500 transition-colors cursor-default">
                    <Instagram size={16} /> Instagram
                  </div>
                  <div className="flex items-center gap-2 text-sm hover:text-blue-500 transition-colors cursor-default">
                    <Linkedin size={16} /> LinkedIn
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
              {[
                { icon: <Search />, title: "Logic Extraction", desc: "AI-powered synthesis of technical code logic and business strategies." },
                { icon: <ShieldCheck />, title: "Verification Triage", desc: "Claims fact-checked against Google Search to filter misinformation." },
                { icon: <BarChart3 />, title: "Knowledge Growth", desc: "Visual analytics of your learning journey and topic mastery over time." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass p-8 rounded-3xl border-white/5 hover:border-accent/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <div className="text-accent">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-foreground/50 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="report-view"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-full flex flex-col items-center"
          >
            <button 
              onClick={() => setReportData(null)}
              className="self-start flex items-center gap-2 text-foreground/40 hover:text-accent mb-8 transition-colors"
            >
              <ArrowLeft size={18} /> Back to Search
            </button>
            <ReportViewer report={reportData.report} platform={reportData.platform} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-20 text-foreground/20 text-sm flex items-center gap-2"
      >
        Built on <span className="font-mono">Gemini Enterprise Agent Platform</span>
      </motion.div>
    </main>
  );
}
