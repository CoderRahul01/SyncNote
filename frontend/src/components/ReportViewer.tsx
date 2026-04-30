"use client";

import { motion } from "framer-motion";
import { Clock, ExternalLink, ChevronRight, Bookmark } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ReportViewerProps {
  report: string;
  platform: string;
}

export default function ReportViewer({ report, platform }: ReportViewerProps) {
  // Helper to parse timestamps and make them clickable
  const renderers = {
    text: ({ value }: { value: string }) => {
      const timestampRegex = /\[(\d{1,2}:\d{2})\]/g;
      const parts = value.split(timestampRegex);
      
      return (
        <>
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              return (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/20 text-accent font-mono text-sm cursor-pointer hover:bg-accent/30 transition-colors"
                >
                  <Clock size={12} />
                  {part}
                </span>
              );
            }
            return part;
          })}
        </>
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl glass rounded-3xl overflow-hidden border-white/10"
    >
      {/* Header Info */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
            <Bookmark />
          </div>
          <div>
            <h3 className="text-xl font-bold">Knowledge Synthesis Report</h3>
            <p className="text-sm text-foreground/40 capitalize">Source: {platform}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-accent hover:underline">
          <ExternalLink size={14} /> View Source
        </button>
      </div>

      {/* Content */}
      <div className="p-8 md:p-12 prose prose-invert max-w-none prose-headings:text-gradient prose-a:text-accent prose-strong:text-accent">
        <ReactMarkdown 
          components={{
            h1: ({children}) => <h1 className="text-4xl font-extrabold mb-8">{children}</h1>,
            h2: ({children}) => <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-white/5 pb-2">{children}</h2>,
            p: ({children}) => <p className="text-foreground/70 leading-relaxed mb-4">{children}</p>,
            li: ({children}) => <li className="text-foreground/70 mb-2">{children}</li>,
          }}
        >
          {report}
        </ReactMarkdown>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end gap-4">
        <button className="px-6 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">Save to Library</button>
        <button className="px-6 py-2 rounded-xl bg-accent text-white shadow-lg shadow-accent/20 text-sm font-medium">Export to Notion</button>
      </div>
    </motion.div>
  );
}
