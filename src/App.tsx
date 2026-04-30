import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  History, 
  Folder as FolderIcon, 
  Hash, 
  Search, 
  Send, 
  CheckCircle2, 
  Code, 
  Zap, 
  ArrowRight, 
  MoreVertical,
  Github,
  Video,
  ExternalLink,
  MessageSquare,
  Copy,
  ChevronDown,
  LayoutDashboard,
  Clock,
  Sparkles,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Activity,
  Cpu,
  Database,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { geminiService } from './services/geminiService';
import { InsightNote, Folder, ChatMessage, ContentSource } from './types';

// Simple initial data
const INITIAL_FOLDERS: Folder[] = [
  { id: '1', name: 'Engineering', icon: 'Code' },
  { id: '2', name: 'Strategy', icon: 'Zap' },
  { id: '3', name: 'UI/UX', icon: 'Sparkles' },
];

export default function App() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [notes, setNotes] = useState<InsightNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [folders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showObservability, setShowObservability] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const detectSource = (url: string): ContentSource => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('linkedin.com')) return 'linkedin';
    return 'unknown';
  };

  const handleGenerate = async () => {
    if (!url.trim()) return;

    setIsProcessing(true);
    setProcessingStep('Multimodal Extraction initiated...');
    
    // Simulated sub-agent orchestration steps
    await new Promise(r => setTimeout(r, 800));
    setProcessingStep('Activating Tool-Set: Platform Extractor...');
    await new Promise(r => setTimeout(r, 1000));
    setProcessingStep('Synthesizing across 1M token context...');
    await new Promise(r => setTimeout(r, 1000));
    setProcessingStep('Grounding via Google Search verification...');
    
    try {
      const source = detectSource(url);
      const generatedData = await geminiService.summarizeContent(url, source);
      
      const newNote: InsightNote = {
        id: Math.random().toString(36).substr(2, 9),
        title: generatedData.title,
        url: url,
        source: source,
        timestamp: Date.now(),
        takeaways: generatedData.takeaways,
        actionItems: generatedData.actionItems.map((item: string) => ({ text: item, completed: false })),
        technicalContext: generatedData.technicalContext,
        fullSummary: generatedData.fullSummary,
        executionTrace: generatedData.executionTrace,
        verificationStatus: generatedData.verificationStatus as any,
      };

      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
      setChatMessages([]);
      setUrl('');
    } catch (error) {
      console.error("Failed to generate note:", error);
      alert("Failed to synthesize knowledge. Please check the URL or try again.");
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedNote || isChatLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await geminiService.chatWithNote(selectedNote.title, userMsg.content, chatMessages);
      const assistantMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const toggleActionItem = (noteId: string, itemIndex: number) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const newItems = [...note.actionItems];
        newItems[itemIndex].completed = !newItems[itemIndex].completed;
        return { ...note, actionItems: newItems };
      }
      return note;
    }));
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-stone-950 text-stone-200 overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-500">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-stone-800">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-stone-900 shadow-lg shadow-amber-500/10">S</div>
          <h1 className="text-lg font-semibold tracking-tight text-white">SyncNote</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold px-2">History</p>
            <div className="space-y-1">
              {filteredNotes.length === 0 && (
                <p className="px-2 py-4 text-xs text-stone-600 italic">No history yet...</p>
              )}
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded text-sm transition-all duration-200 flex items-center gap-3",
                    selectedNoteId === note.id 
                      ? "bg-stone-800/50 text-amber-500 border-l-2 border-amber-500" 
                      : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/30"
                  )}
                >
                  <span className="truncate flex-1">{note.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold px-2">Folders</p>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className="w-full text-left px-3 py-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/30 rounded text-sm transition-colors flex items-center gap-2"
                >
                  <span className="opacity-50 text-xs shrink-0">📁</span>
                  <span className="truncate">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-stone-800 bg-deep-dark">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-stone-800/50 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-[10px] font-bold text-stone-300">
              RP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Rahul Pandey</p>
              <p className="text-[10px] text-stone-500">Enterprise Pro</p>
            </div>
            <span className="text-stone-600 group-hover:text-stone-400">⚙️</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col bg-stone-950 relative">
        {/* Capture Bar */}
        <header className="p-6 border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex gap-3 max-w-4xl mx-auto items-center">
            <div className="relative flex-1 group">
              <input
                type="text"
                placeholder="Paste URL (YouTube, Instagram, LinkedIn)..."
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-stone-700 text-stone-200 shadow-inner"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                disabled={isProcessing}
              />
              <div className="absolute right-3 top-3.5 text-[9px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-500 font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">CMD+V</div>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={!url.trim() || isProcessing}
              className={cn(
                "px-6 py-3 bg-amber-500 text-stone-900 font-bold rounded-lg text-sm hover:bg-amber-400 transition-all shadow-lg active:scale-95 flex items-center gap-2 shrink-0 disabled:opacity-50 disabled:grayscale",
                isProcessing && "animate-pulse"
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Insights
                </>
              )}
            </button>
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
            {!selectedNoteId && !isProcessing ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center space-y-4 max-w-md">
                   <div className="w-16 h-16 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <LayoutDashboard className="w-8 h-8 text-stone-600" />
                   </div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Knowledge Synthesis Engine</h2>
                   <p className="text-stone-500 text-sm">Paste any link to transform short-form scrolling into high-fidelity structured notes and technical insights.</p>
                </div>
              </motion.div>
            ) : (
              <div className="max-w-5xl mx-auto h-full flex flex-col">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div 
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                    >
                      <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-2 border-stone-800 rounded-full" />
                        <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 border-t-2 border-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-stone-100">Activating Gemini Enterprise Agent Platform</h3>
                        <p className="text-stone-500 font-mono text-[10px] tracking-widest uppercase">{processingStep}</p>
                        <div className="flex gap-2 justify-center">
                          <Cpu className="w-3 h-3 text-stone-700 animate-bounce" style={{ animationDelay: '0s' }} />
                          <Activity className="w-3 h-3 text-stone-700 animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <Database className="w-3 h-3 text-stone-700 animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </motion.div>
                  ) : selectedNote ? (
                    <motion.div 
                      key={selectedNote.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-10"
                    >
                      {/* Agentic Note Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider",
                              selectedNote.source === 'youtube' ? 'bg-red-950 text-red-400 border-red-900/50' : 
                              selectedNote.source === 'instagram' ? 'bg-pink-950 text-pink-400 border-pink-900/50' :
                              selectedNote.source === 'linkedin' ? 'bg-blue-950 text-blue-400 border-blue-900/50' : 
                              'bg-amber-950 text-amber-400 border-amber-900/50'
                            )}>
                              {selectedNote.source === 'unknown' ? 'Knowledge Source' : `${selectedNote.source}`}
                            </span>
                            <div className="h-4 w-px bg-stone-800" />
                            <div className={cn(
                              "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              selectedNote.verificationStatus === 'verified' ? "text-emerald-500 bg-emerald-500/5" :
                              selectedNote.verificationStatus === 'caution' ? "text-amber-500 bg-amber-500/5" : "text-stone-500 bg-stone-800"
                            )}>
                              {selectedNote.verificationStatus === 'verified' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                              {selectedNote.verificationStatus}
                            </div>
                          </div>
                          <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
                            {selectedNote.title}
                          </h2>
                          <div className="flex items-center gap-4 text-stone-500 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {new Date(selectedNote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            <LinkIcon className="w-3 h-3 ml-2" />
                            <a href={selectedNote.url} target="_blank" rel="noopener noreferrer" className="hover:text-stone-300 transition-colors truncate max-w-xs">{selectedNote.url}</a>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setShowObservability(!showObservability)}
                            className={cn(
                              "p-2 rounded-lg border transition-all flex items-center gap-2 text-[10px] font-bold uppercase",
                              showObservability ? "bg-amber-500/10 border-amber-500/50 text-amber-500" : "bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300"
                            )}
                          >
                            <Terminal className="w-4 h-4" />
                            Observability
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-10">
                        {/* Left Column: Synthesized Content */}
                        <div className={cn(
                          "space-y-10 transition-all duration-300",
                          showObservability ? "col-span-12 lg:col-span-8" : "col-span-12 lg:col-span-7"
                        )}>
                          <section>
                            <h3 className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-5 flex items-center gap-2">
                              <span className="w-1 h-1 bg-amber-500 rounded-full" />
                              Key Takeaways
                            </h3>
                            <ul className="space-y-4">
                              {selectedNote.takeaways.map((point, i) => (
                                <li key={i} className="flex gap-4 text-sm leading-relaxed text-stone-300 group">
                                  <div className="flex flex-col items-center shrink-0">
                                    <span className="text-amber-500 font-bold">•</span>
                                    {point.timestamp && (
                                      <button className="text-[10px] font-mono text-stone-600 group-hover:text-amber-500 transition-colors bg-stone-900 px-1 rounded border border-stone-800 mt-1">
                                        {point.timestamp}
                                      </button>
                                    )}
                                  </div>
                                  <span>{point.text}</span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          <section>
                            <h3 className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-5 flex items-center gap-2">
                              <span className="w-1 h-1 bg-amber-500 rounded-full" />
                              Technical Analysis
                            </h3>
                            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 font-mono text-xs text-stone-300 leading-relaxed shadow-inner overflow-x-auto scrollbar-hide relative group">
                              <button className="absolute right-4 top-4 p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-400 transition-all opacity-0 group-hover:opacity-100">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <pre className="whitespace-pre-wrap">{selectedNote.technicalContext}</pre>
                            </div>
                          </section>

                          <section>
                             <h3 className="text-stone-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-5 flex items-center gap-2">
                              <span className="w-1 h-1 bg-stone-700 rounded-full" />
                              Executive Summary
                            </h3>
                            <p className="text-stone-400 text-sm leading-relaxed italic border-l border-stone-800 pl-6">
                              {selectedNote.fullSummary}
                            </p>
                          </section>
                        </div>

                        {/* Right Column: Visibility depend on observational state or not */}
                        {!showObservability && (
                          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
                            <section className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl">
                              <h3 className="text-white text-[10px] uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                Action Items
                              </h3>
                              <div className="space-y-3">
                                {selectedNote.actionItems.map((item, i) => (
                                  <label 
                                    key={i} 
                                    className="flex items-center gap-3 group cursor-pointer"
                                    onClick={() => toggleActionItem(selectedNote.id, i)}
                                  >
                                    <div className={cn(
                                      "w-4 h-4 border rounded transition-all flex items-center justify-center shrink-0",
                                      item.completed 
                                        ? "bg-amber-500/10 border-amber-500/50" 
                                        : "bg-stone-800 border-stone-700 group-hover:border-stone-500"
                                    )}>
                                      {item.completed && <span className="text-amber-500 text-[10px] font-bold">✓</span>}
                                    </div>
                                    <span className={cn(
                                      "text-xs transition-all",
                                      item.completed ? "text-stone-500 line-through" : "text-stone-300"
                                    )}>
                                      {item.text}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </section>

                            {/* Chat Section */}
                            <section className="flex-1 bg-deep-dark border border-stone-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl min-h-[350px]">
                              <div className="p-4 border-b border-stone-800 bg-stone-900/20 flex items-center justify-between">
                                <p className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-2">
                                  <span className={cn("w-2 h-2 rounded-full", isChatLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
                                  Agent Memory Active
                                </p>
                                <MessageSquare className="w-3.5 h-3.5 text-stone-700" />
                              </div>

                              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide text-[11px]">
                                {chatMessages.length === 0 && (
                                  <p className="text-stone-600 text-center py-10 italic">Discuss this insight with your Synthesis Agent...</p>
                                )}
                                {chatMessages.map((msg) => (
                                  <div key={msg.id} className={cn(
                                    "p-3 rounded-xl border leading-relaxed",
                                    msg.role === 'user' 
                                      ? "bg-stone-800/30 text-stone-400 border-stone-800/50 ml-4" 
                                      : "bg-amber-500/5 text-amber-100 border-amber-500/10 italic mr-4 shadow-sm"
                                  )}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                  </div>
                                ))}
                                {isChatLoading && (
                                  <div className="flex items-center gap-2 text-stone-700 animate-pulse">
                                    <div className="w-1 h-1 bg-stone-700 rounded-full" />
                                    Agent is thinking...
                                  </div>
                                )}
                                <div ref={chatEndRef} />
                              </div>

                              <div className="p-4 border-t border-stone-800">
                                <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 group focus-within:border-amber-500/30 transition-all">
                                  <input 
                                    type="text" 
                                    placeholder="Ask about this synthesis..." 
                                    className="bg-transparent border-none text-[11px] flex-1 focus:outline-none placeholder:text-stone-700 text-stone-300"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                  />
                                  <button 
                                    onClick={handleSendMessage}
                                    disabled={!chatInput.trim() || isChatLoading}
                                    className="text-stone-600 hover:text-amber-500 transition-colors ml-2"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </section>
                          </div>
                        )}

                        {/* Observability Detail Panel */}
                        {showObservability && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="col-span-12 lg:col-span-4 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6"
                          >
                             <div className="flex items-center justify-between">
                               <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                 <Activity className="w-3.5 h-3.5 text-amber-500" />
                                 Execution Traces
                               </h3>
                               <div className="text-[10px] font-mono text-stone-600">v1.2.4-stable</div>
                             </div>

                             <div className="space-y-6">
                                {selectedNote.executionTrace.map((trace, i) => (
                                  <div key={i} className="relative pl-6 pb-6 border-l border-stone-800 last:pb-0">
                                     <div className={cn(
                                       "absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-stone-900",
                                       trace.status === 'verified' ? "bg-emerald-500" : "bg-amber-500"
                                     )} />
                                     <div className="space-y-1">
                                       <div className="flex items-center justify-between">
                                         <p className="text-xs font-bold text-stone-300">{trace.step}</p>
                                         <span className="text-[10px] font-mono text-stone-600">{trace.timestamp}</span>
                                       </div>
                                       <p className="text-[10px] text-stone-500 font-mono flex items-center gap-2">
                                         STATUS: <span className={trace.status === 'verified' ? "text-emerald-500/80" : "text-amber-500/80"}>{trace.status.toUpperCase()}</span>
                                       </p>
                                     </div>
                                  </div>
                                ))}
                             </div>

                             <div className="pt-6 border-t border-stone-800 space-y-4">
                               <h4 className="text-[8px] font-bold text-stone-600 uppercase tracking-widest">Platform Allocation</h4>
                               <div className="grid grid-cols-2 gap-3">
                                 <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
                                   <p className="text-[8px] text-stone-600 uppercase mb-1">Model</p>
                                   <p className="text-[10px] font-mono text-stone-400">Gemini 1.5 Flash</p>
                                 </div>
                                 <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
                                   <p className="text-[8px] text-stone-600 uppercase mb-1">Memory Bank</p>
                                   <p className="text-[10px] font-mono text-stone-400">Active (v2)</p>
                                 </div>
                               </div>
                             </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Bottom Processing Bar */}
          <footer className="mt-auto border-t border-stone-800">
            <div className="bg-stone-900 h-1 overflow-hidden">
               <motion.div 
                className={cn("h-full", isProcessing ? "bg-amber-500" : "bg-emerald-500")}
                initial={{ width: 0 }}
                animate={{ width: isProcessing ? "70%" : selectedNoteId ? "100%" : 0 }}
                transition={{ duration: 1 }}
               />
            </div>
            <div className="px-6 py-2.5 bg-stone-900 flex justify-between items-center text-[10px] font-mono">
              <div className="flex items-center gap-2.5">
                <div className={cn("w-1.5 h-1.5 rounded-full", isProcessing ? "bg-amber-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]")} />
                <span className="text-stone-500 uppercase tracking-[0.2em]">
                  {isProcessing ? processingStep : "Infrastructure: Secured via Agent Gateway"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-stone-700 uppercase tracking-widest font-bold">Latency: 2ms</span>
                 <span className="text-stone-700 uppercase tracking-widest font-bold">v1.2.4-stable</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>

  );
}
