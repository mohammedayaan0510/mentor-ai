import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  StopCircle, 
  RefreshCw, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  User, 
  ArrowRight,
  AlertCircle,
  X,
  Code2,
  HelpCircle,
  Bug,
  Zap,
  Terminal,
  BookOpen,
  Lightbulb,
  Compass
} from 'lucide-react';
import { Message, UserProfile, WorkspaceContext } from '../types';
import { SAMPLE_SUGGESTED_PROMPTS } from '../data';

interface AIChatViewProps {
  messages: Message[];
  sendMessage: (content: string, attachments?: any[]) => Promise<void>;
  regenerateLastResponse: () => Promise<void>;
  clearChat: () => void;
  isGenerating: boolean;
  stopGeneration: () => void;
  user: UserProfile;
  workspaceContext?: WorkspaceContext | null;
  onClearWorkspaceContext?: () => void;
  onOpenWorkspace?: () => void;
}

export default function AIChatView({ 
  messages, 
  sendMessage, 
  regenerateLastResponse, 
  clearChat, 
  isGenerating, 
  stopGeneration,
  user,
  workspaceContext,
  onClearWorkspaceContext,
  onOpenWorkspace
}: AIChatViewProps) {
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 52), 220);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const [speechError, setSpeechError] = useState<string | null>(null);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Text-To-Speech function
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // If speaking, stop it
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }

    // Strip markdown characters before speaking
    const plainText = text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/\* /g, '');

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (files: FileList) => {
    const newAttachments = Array.from(files).map(file => {
      let iconType = 'file';
      if (file.type.startsWith('image/')) iconType = 'image';
      else if (file.type === 'application/pdf') iconType = 'pdf';
      else if (file.name.endsWith('.js') || file.name.endsWith('.py') || file.name.endsWith('.ts') || file.name.endsWith('.cpp')) iconType = 'code';

      return {
        id: Math.random().toString(),
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(1) + ' KB',
        icon: iconType
      };
    });
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    const content = input;
    const currentAttachments = [...attachments];
    
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = '52px';
    }
    
    await sendMessage(content, currentAttachments);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format inline markdown spans (bold, inline code, italics)
  const renderInlineFormattedText = (text: string) => {
    // Split by code blocks or bold spans
    const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return tokens.map((token, i) => {
      if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded-md bg-white/10 text-indigo-300 font-mono text-[12px] border border-white/5">
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
        return (
          <strong key={i} className="font-semibold text-indigo-300">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
        return (
          <em key={i} className="italic text-zinc-200">
            {token.slice(1, -1)}
          </em>
        );
      }
      return token;
    });
  };

  // Custom regex-based Markdown-like parsed renderer for beautiful, immediate results
  const renderMessageContent = (content: string, id: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const header = lines[0].replace('```', '').trim() || 'code';
        const codeText = lines.slice(1, lines.length - 1).join('\n');
        const codeBlockId = `${id}-code-${index}`;

        return (
          <div key={index} className="my-4 border border-white/10 rounded-xl overflow-hidden bg-[#08080a] shadow-lg">
            {/* Header tab */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#121215] border-b border-white/10 text-zinc-400">
              <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{header}</span>
              </span>
              <button
                id={`copy-code-${codeBlockId}`}
                onClick={() => copyToClipboard(codeText, codeBlockId)}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors py-1 px-2.5 hover:bg-white/5 rounded-lg text-xs cursor-pointer font-mono"
              >
                {copiedId === codeBlockId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy Code</span>
                  </>
                )}
              </button>
            </div>
            {/* Real code box with horizontal scrolling */}
            <pre className="p-4 sm:p-5 overflow-x-auto text-zinc-200 text-xs sm:text-[13.5px] font-mono leading-relaxed selection:bg-indigo-500/30">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      } else {
        // Simple formatting for titles, points, lists
        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-2 text-sm sm:text-[14.5px] leading-relaxed sm:leading-7 text-zinc-200">
            {lines.map((line, lIdx) => {
              // Main Header parsing (e.g. ### Header)
              if (line.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="font-display font-bold text-zinc-100 text-base sm:text-lg mt-5 mb-2 pb-1 border-b border-white/5">
                    {renderInlineFormattedText(line.substring(4))}
                  </h4>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="font-display font-bold text-zinc-100 text-lg sm:text-xl mt-6 mb-2.5 pb-1 border-b border-white/10">
                    {renderInlineFormattedText(line.substring(3))}
                  </h3>
                );
              }
              if (line.startsWith('# ')) {
                return (
                  <h2 key={lIdx} className="font-display font-bold text-zinc-100 text-xl sm:text-2xl mt-6 mb-3 pb-1.5 border-b border-white/10">
                    {renderInlineFormattedText(line.substring(2))}
                  </h2>
                );
              }

              // Bullet list item
              if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                const bulletContent = line.trim().substring(2);
                return (
                  <div key={lIdx} className="flex items-start gap-2 ml-2 sm:ml-4 my-1.5 text-zinc-200">
                    <span className="text-indigo-400 font-bold select-none mt-1">•</span>
                    <span className="flex-1">{renderInlineFormattedText(bulletContent)}</span>
                  </div>
                );
              }

              // Numbered list item
              const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 ml-2 sm:ml-4 my-1.5 text-zinc-200">
                    <span className="text-indigo-400 font-mono text-xs font-bold shrink-0 mt-0.5 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      {numMatch[1]}
                    </span>
                    <span className="flex-1">{renderInlineFormattedText(numMatch[2])}</span>
                  </div>
                );
              }

              return line.trim() ? (
                <p key={lIdx} className="my-2 text-zinc-200">
                  {renderInlineFormattedText(line)}
                </p>
              ) : (
                <div key={lIdx} className="h-1.5" />
              );
            })}
          </div>
        );
      }
    });
  };

  return (
    <div 
      className={`
        flex flex-col h-full w-full min-h-0 flex-1 relative border border-white/10 bg-[#121214]/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl shadow-black/40
        ${isDragging ? 'bg-zinc-800/40 ring-2 ring-indigo-500' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* File Drop Overlay indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-[#09090b]/85 backdrop-blur-sm flex flex-col items-center justify-center z-50 pointer-events-none border-2 border-dashed border-indigo-500 rounded-2xl m-3">
          <Paperclip className="w-12 h-12 text-indigo-400 animate-bounce mb-2" />
          <p className="font-display font-bold text-zinc-100 text-lg">Drop your file anywhere</p>
          <p className="text-zinc-400 text-sm mt-1">Images, PDF, and source code files are fully supported</p>
        </div>
      )}

      {/* Header tab bar - Compact & Informative */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#121214] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-zinc-100 text-sm sm:text-base leading-tight">
              AI Coding Mentor
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {workspaceContext?.problem ? (
                <span className="text-indigo-300 font-mono text-[11px]">
                  Context: {workspaceContext.problem.title} ({workspaceContext.language})
                </span>
              ) : (
                'Your intelligent coding companion'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              id="clear-chat-history"
              onClick={clearChat}
              className="text-xs font-semibold px-3 py-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-colors cursor-pointer"
              title="Clear conversation history"
            >
              Clear Chat
            </button>
          )}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${speechEnabled ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            title={speechEnabled ? "Mute audio replies" : "Read replies aloud"}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Active Problem Context Banner (When Workspace Problem is Active) */}
      {workspaceContext?.problem && (
        <div className="mx-4 sm:mx-6 mt-3.5 p-3 sm:p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-lg shadow-indigo-950/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-zinc-100">{workspaceContext.problem.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  workspaceContext.problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                  workspaceContext.problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  {workspaceContext.problem.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-zinc-300">
                  {workspaceContext.language}
                </span>
                {workspaceContext.code && (
                  <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                    {workspaceContext.code.split('\n').length} line(s) in editor
                  </span>
                )}
                {workspaceContext.lastRun?.status && (
                  <span className="text-[10px] text-indigo-300 font-mono hidden lg:inline">
                    • Last Run: {workspaceContext.lastRun.status}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                {workspaceContext.problem.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenWorkspace && (
              <button
                id="chat-open-workspace-btn"
                onClick={onOpenWorkspace}
                className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onClearWorkspaceContext && (
              <button
                id="chat-detach-context-btn"
                onClick={onClearWorkspaceContext}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                title="Detach problem context to chat normally"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages Viewport - Dominant, Smooth Independently Scrollable Area */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 lg:px-8 py-6">
        {messages.length === 0 ? (
          /* Empty Chat State - Visually Useful, Clean & Inviting */
          <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6 py-6 animate-fade-in">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl text-indigo-400 shadow-xl shadow-indigo-500/5">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
                How can I help you code today?
              </h3>
              <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
                {workspaceContext?.problem 
                  ? `Your Mentor has full context on ${workspaceContext.problem.title} (${workspaceContext.language}). Ask for conceptual hints, test case debugging, or complexity analysis below.`
                  : 'Ask anything about algorithms, debugging code, understanding complex concepts, or optimizing performance.'
                }
              </p>
            </div>

            {/* Suggested Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
              {workspaceContext?.problem ? (
                [
                  { title: "Give me a hint", icon: Lightbulb, prompt: `Give me a conceptual hint for ${workspaceContext.problem.title} without spoiling the complete solution.` },
                  { title: "Debug my code", icon: Bug, prompt: `Why isn't my ${workspaceContext.language} code working? Review my logic and point out potential bugs or missed edge cases.` },
                  { title: "Review my approach", icon: Compass, prompt: `Review my current ${workspaceContext.language} code approach, time complexity, and suggest clean optimizations.` },
                  { title: "Explain optimal approach", icon: Zap, prompt: `Explain the optimal algorithmic pattern and data structure for ${workspaceContext.problem.title}.` }
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      id={`context-suggested-prompt-${idx}`}
                      key={idx}
                      onClick={() => {
                        setInput(item.prompt);
                        textareaRef.current?.focus();
                      }}
                      className="p-4 text-left bg-[#0e0e11] hover:bg-zinc-800/80 border border-white/10 hover:border-indigo-500/40 rounded-xl transition-all group cursor-pointer shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-1">
                        <IconComponent className="w-4 h-4 text-indigo-400" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                      <span className="text-[11px] text-indigo-400 mt-2 flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Use Prompt</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })
              ) : (
                [
                  { title: "Explain this concept", icon: BookOpen, prompt: "Explain how dynamic programming memoization works with a simple, clear example." },
                  { title: "Debug my code", icon: Bug, prompt: "Review my code logic for edge cases, null pointers, and off-by-one errors." },
                  { title: "Give me a hint", icon: Lightbulb, prompt: "Give me a conceptual hint for solving my problem without giving the full solution." },
                  { title: "Review my approach", icon: Compass, prompt: "Analyze my current time and space complexity, and suggest optimizations." }
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      id={`suggested-prompt-${idx}`}
                      key={idx}
                      onClick={() => {
                        setInput(item.prompt);
                        textareaRef.current?.focus();
                      }}
                      className="p-4 text-left bg-[#0e0e11] hover:bg-zinc-800/80 border border-white/10 hover:border-indigo-500/40 rounded-xl transition-all group cursor-pointer shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-1">
                        <IconComponent className="w-4 h-4 text-indigo-400" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                      <span className="text-[11px] text-indigo-400 mt-2 flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Use Prompt</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Standard Messages Stream - Generous Width, Clear Differentiation */
          <div className="space-y-6 max-w-5xl mx-auto w-full">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 sm:gap-4 ${isAssistant ? 'w-full' : 'justify-end'}`}
                >
                  {/* Assistant Avatar */}
                  {isAssistant && (
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold border border-indigo-400/30 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`flex flex-col ${isAssistant ? 'w-full max-w-full space-y-1.5' : 'max-w-[90%] sm:max-w-2xl space-y-1.5'}`}>
                    {/* Header line: Role + Timestamp */}
                    <div className={`flex items-center gap-2 text-[11px] font-mono text-zinc-400 ${isAssistant ? '' : 'justify-end'}`}>
                      <span className="font-semibold text-zinc-300">{isAssistant ? 'AI Coding Mentor' : user.name}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Content Box */}
                    <div className={`
                      rounded-2xl text-sm border shadow-sm
                      ${isAssistant 
                        ? 'p-5 sm:p-6 bg-[#0e0e11] border-white/10 text-zinc-200 rounded-tl-sm w-full' 
                        : 'p-4 sm:p-5 bg-indigo-600/20 border-indigo-500/30 text-indigo-50 rounded-tr-sm'
                      }
                    `}>
                      {/* Attached files previews inside bubble */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3.5 pb-3 border-b border-white/10">
                          {msg.attachments.map((file: any, fIdx: number) => (
                            <div key={fIdx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#08080a] border border-white/10 rounded-lg text-xs font-mono text-zinc-300">
                              {file.icon === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> : <FileText className="w-3.5 h-3.5 text-blue-400" />}
                              <span className="truncate max-w-[160px] font-medium">{file.name}</span>
                              <span className="text-[10px] text-zinc-500">({file.size})</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Dynamic message content */}
                      {isAssistant ? (
                        <div className="space-y-2">
                          {renderMessageContent(msg.content, msg.id)}
                          
                          {/* Footer Actions: Audio TTS & Copy */}
                          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-white/5 text-xs text-zinc-400">
                            <button
                              id={`copy-msg-${msg.id}`}
                              onClick={() => copyToClipboard(msg.content, msg.id)}
                              className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors py-1 px-2 hover:bg-white/5 rounded-lg cursor-pointer"
                              title="Copy full response"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-[11px] text-emerald-400 font-semibold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[11px]">Copy</span>
                                </>
                              )}
                            </button>
                            <button
                              id={`speak-msg-${msg.id}`}
                              onClick={() => speakText(msg.content)}
                              className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors py-1 px-2 hover:bg-white/5 rounded-lg cursor-pointer"
                              title="Listen to this mentor response"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Listen</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed sm:leading-7 text-zinc-100 text-sm sm:text-[14.5px]">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {!isAssistant && (
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold border border-white/10 bg-[#121214] text-zinc-300 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Assistant Thinking / Streaming Indicator */}
            {isGenerating && (
              <div className="flex gap-3 sm:gap-4 w-full animate-fade-in">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-indigo-400/30 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white shadow-md mt-1">
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="flex flex-col space-y-1.5 max-w-full">
                  <span className="text-[11px] font-mono text-zinc-400">Mentor AI thinking...</span>
                  <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0e0e11] text-zinc-100 rounded-tl-sm shadow-sm">
                    <div className="flex items-center gap-2 py-1 text-xs font-mono text-indigo-300">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                      <span className="ml-2 text-zinc-400">Formulating explanation & code guidance...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Panel - Fixed / Sticky Bottom with Comfortable Multiline Area */}
      <div className="p-3.5 sm:p-4 lg:p-5 bg-[#121214] border-t border-white/10 shrink-0">
        <div className="max-w-5xl mx-auto w-full space-y-2.5">
          
          {/* Active File Attachments Shelf */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 bg-[#0a0a0d] p-2.5 border border-white/10 rounded-xl animate-fade-in">
              {attachments.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#121215] border border-white/10 rounded-lg text-xs text-zinc-200 font-mono group"
                >
                  {file.icon === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> : <FileText className="w-3.5 h-3.5 text-blue-400" />}
                  <span className="truncate max-w-[160px] font-medium">{file.name}</span>
                  <span className="text-[10px] text-zinc-500">({file.size})</span>
                  <button 
                    id={`remove-attachment-${file.id}`}
                    onClick={() => removeAttachment(file.id)}
                    className="text-zinc-400 hover:text-rose-400 p-0.5 cursor-pointer ml-1"
                    title="Remove attachment"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Speech Error Banner */}
          {speechError && (
            <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{speechError}</span>
            </div>
          )}

          {/* Chat Input Container */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 bg-[#0a0a0d] border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all flex items-end">
              
              {/* Attachment selector button */}
              <div className="flex items-center pb-1 pl-1">
                <button
                  id="chat-attach-files"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  title="Upload Files (Image, PDF, Code)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden" 
                  accept="image/*,.pdf,.txt,.js,.py,.cpp,.ts,.java"
                />
              </div>

              {/* Multiline Comfortable Text Input */}
              <textarea
                id="chat-message-input"
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a coding question, request a hint, or paste code..."
                className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-sm sm:text-[14.5px] text-zinc-100 placeholder-zinc-500 py-2 px-3 min-h-[52px] max-h-56 resize-none leading-relaxed"
                rows={1}
              />

              {/* Speech Microphone button */}
              <div className="flex items-center pb-1 pr-1">
                <button
                  id="chat-toggle-mic"
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${isListening ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'}`}
                  title={isListening ? "Stop listening" : "Voice Input"}
                >
                  {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Stop vs Send Action Buttons */}
            {isGenerating ? (
              <button
                id="chat-stop-generation"
                type="button"
                onClick={stopGeneration}
                className="p-3.5 sm:p-4 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 rounded-2xl transition-colors cursor-pointer shrink-0 shadow-lg"
                title="Stop response"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                id="chat-send-message"
                type="button"
                onClick={handleSend}
                disabled={!input.trim() && attachments.length === 0}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-lg text-white shrink-0 ${(!input.trim() && attachments.length === 0) ? 'bg-[#0a0a0d] text-zinc-600 border border-white/10 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 cursor-pointer'}`}
                title="Send message"
              >
                <Send className="w-5 h-5 fill-current" />
              </button>
            )}
          </div>

          {/* Keyboard hints footer */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 px-2 font-mono">
            <span className="hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-zinc-400 border border-white/5">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-zinc-400 border border-white/5">Shift + Enter</kbd> for new line
            </span>
            <span className="text-zinc-500">
              Markdown & Code Formatting Supported
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
