import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, FolderOpen, Mail, Calendar, Brain, Settings, Globe, FileText, Cpu, Shield, Database, Zap, Archive, GitBranch, ScrollText } from "lucide-react";
import { useWindows } from "@/contexts/WindowContext";

interface LauncherApp {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const allApps: LauncherApp[] = [
  { id: "terminal", name: "Terminal", description: "Aluminum Shell — uws CLI", icon: <Terminal className="w-5 h-5" />, category: "System" },
  { id: "files", name: "Files", description: "Universal File Graph — alum://drive/", icon: <FolderOpen className="w-5 h-5" />, category: "System" },
  { id: "mail", name: "Mail", description: "Universal Inbox — Gmail + Outlook + iCloud", icon: <Mail className="w-5 h-5" />, category: "Communication" },
  { id: "calendar", name: "Calendar", description: "Unified Calendar — All providers", icon: <Calendar className="w-5 h-5" />, category: "Productivity" },
  { id: "council", name: "AI Council", description: "Pantheon — 8 council members", icon: <Brain className="w-5 h-5" />, category: "Intelligence" },
  { id: "settings", name: "Settings", description: "System configuration", icon: <Settings className="w-5 h-5" />, category: "System" },
  { id: "browser", name: "Browser", description: "Aluminum Browser", icon: <Globe className="w-5 h-5" />, category: "Web" },
  { id: "notes", name: "Notes", description: "Universal Notes — All providers", icon: <FileText className="w-5 h-5" />, category: "Productivity" },
  { id: "sysmonitor", name: "System Monitor", description: "Ring status, agents, inference load", icon: <Cpu className="w-5 h-5" />, category: "System" },
  { id: "governance", name: "Governance", description: "Constitutional dashboard — 15 domains", icon: <Shield className="w-5 h-5" />, category: "Core" },
  { id: "memory", name: "SHELDONBRAIN", description: "3-tier memory viewer — Working, Long-Term, Swarm", icon: <Database className="w-5 h-5" />, category: "Core" },
  { id: "vault", name: "Atlas Vault", description: "40+ artifacts — documents, specs, websites", icon: <Archive className="w-5 h-5" />, category: "Archive" },
  { id: "router", name: "Model Router", description: "3-tier inference — 7 models — cost tracking", icon: <GitBranch className="w-5 h-5" />, category: "Intelligence" },
  { id: "taip", name: "TAIP Protocol", description: "Trained Adult Instance Protocol v1.0", icon: <ScrollText className="w-5 h-5" />, category: "Constitution" },
  // Virtual apps (not openable but searchable)
  { id: "fusion", name: "Fusion Engine", description: "Cross-provider workflow engine", icon: <Zap className="w-5 h-5" />, category: "Core" },
  { id: "identity", name: "Identity Graph", description: "Unified sovereign identity — Janus bridge", icon: <Cpu className="w-5 h-5" />, category: "Core" },
];

const openableApps = ["terminal", "files", "mail", "calendar", "council", "settings", "browser", "notes", "sysmonitor", "governance", "memory", "vault", "router", "taip"];

export default function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { openWindow } = useWindows();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filtered = query
    ? allApps.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      )
    : allApps;

  const handleSelect = (app: LauncherApp) => {
    if (openableApps.includes(app.id)) {
      openWindow(app.id, app.name, app.id);
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99998]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[560px] z-[99999] glass-heavy rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <Search className="w-4 h-4 text-foreground/30" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search apps, commands, files..."
                className="flex-1 bg-transparent text-sm text-foreground/90 placeholder:text-foreground/25 outline-none font-[family-name:var(--font-body)]"
              />
              <kbd className="text-[9px] text-foreground/20 bg-white/5 px-1.5 py-0.5 rounded border border-white/[0.06] font-[family-name:var(--font-mono)]">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-foreground/30">No results for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filtered.map(app => (
                    <button
                      key={app.id}
                      onClick={() => handleSelect(app)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-foreground/50 group-hover:text-cyan-400 transition-colors">
                        {app.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-medium text-foreground/80 group-hover:text-foreground/95">{app.name}</p>
                        <p className="text-[10px] text-foreground/30">{app.description}</p>
                      </div>
                      <span className="text-[9px] text-foreground/15 bg-white/3 px-2 py-0.5 rounded-md">{app.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[9px] text-foreground/20 font-[family-name:var(--font-mono)]">alum search</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-foreground/15">Navigate</span>
                <kbd className="text-[8px] text-foreground/15 bg-white/3 px-1 py-0.5 rounded">↑↓</kbd>
                <span className="text-[9px] text-foreground/15">Open</span>
                <kbd className="text-[8px] text-foreground/15 bg-white/3 px-1 py-0.5 rounded">↵</kbd>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function useAppLauncher() {
  return {
    open: () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true })),
  };
}
