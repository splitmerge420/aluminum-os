/*
 * AppLauncher — Cross-platform adaptive spotlight/search
 * macOS: ⌘K, Spotlight feel
 * Windows: Ctrl+K, Start menu search feel
 * ChromeOS: Ctrl+K, Launcher feel
 * iOS/Android: full-width, larger touch targets
 * All: keyboard arrow navigation, Enter to select, responsive width
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Grid3X3, FolderOpen, Mail, Calendar, Brain, Settings, Globe,
  FileText, Cpu, Shield, Database, Zap, Archive, GitBranch, ScrollText,
  SquareTerminal, Workflow, DollarSign, Hexagon, HeartPulse, Hospital, Sparkles, Layers, ArrowLeftRight, ShoppingCart,
  Atom, Network, RefreshCw, Eye, Lock,
} from "lucide-react";
import { useWindows } from "@/contexts/WindowContext";

interface LauncherApp {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const allApps: LauncherApp[] = [
  { id: "spheres", name: "144 Spheres", description: "12×12 Agent Ontology — 17,000+ READMEs, native tools, lattice structure", icon: <Grid3X3 className="w-5 h-5" />, category: "Core" },
  { id: "files", name: "Files", description: "Universal File Graph — alum://drive/", icon: <FolderOpen className="w-5 h-5" />, category: "System" },
  { id: "mail", name: "Mail", description: "Universal Inbox — Gmail + Outlook + iCloud", icon: <Mail className="w-5 h-5" />, category: "Communication" },
  { id: "calendar", name: "Calendar", description: "Unified Calendar — All providers", icon: <Calendar className="w-5 h-5" />, category: "Productivity" },
  { id: "council", name: "AI Council", description: "Pantheon — 10+1 council members", icon: <Brain className="w-5 h-5" />, category: "Intelligence" },
  { id: "settings", name: "Settings", description: "System configuration", icon: <Settings className="w-5 h-5" />, category: "System" },
  { id: "browser", name: "Browser", description: "Aluminum Browser", icon: <Globe className="w-5 h-5" />, category: "Web" },
  { id: "notes", name: "Notes", description: "Universal Notes — All providers", icon: <FileText className="w-5 h-5" />, category: "Productivity" },
  { id: "sysmonitor", name: "System Monitor", description: "Ring status, agents, inference load", icon: <Cpu className="w-5 h-5" />, category: "System" },
  { id: "governance", name: "Governance", description: "Constitutional dashboard — 15 domains", icon: <Shield className="w-5 h-5" />, category: "Core" },
  { id: "memory", name: "SHELDONBRAIN", description: "3-tier memory viewer — Working, Long-Term, Swarm", icon: <Database className="w-5 h-5" />, category: "Core" },
  { id: "vault", name: "Atlas Vault", description: "62+ artifacts — documents, specs, websites", icon: <Archive className="w-5 h-5" />, category: "Archive" },
  { id: "router", name: "Model Router", description: "3-tier inference — 10 models — cost tracking", icon: <GitBranch className="w-5 h-5" />, category: "Intelligence" },
  { id: "taip", name: "TAIP Protocol", description: "Trained Adult Instance Protocol v1.0", icon: <ScrollText className="w-5 h-5" />, category: "Constitution" },
  { id: "forgecore", name: "Forge Core", description: "Ring 0 Kernel — BuddyAllocator, AgentRegistry, IntentScheduler", icon: <Cpu className="w-5 h-5" />, category: "Core" },
  { id: "agentshell", name: "Agent Shell", description: "Universal Agent Shell — 8 harnesses, governance, cross-app orchestration", icon: <SquareTerminal className="w-5 h-5" />, category: "Core" },
  { id: "deerflow", name: "DeerFlow Research", description: "Multi-agent research — 17 skills, sub-agent delegation, sandbox execution", icon: <Workflow className="w-5 h-5" />, category: "Intelligence" },
  { id: "costoptimizer", name: "Cost Optimizer", description: "Spend governance — 3-tier routing, 150% ROI mandate, Ara delegation", icon: <DollarSign className="w-5 h-5" />, category: "Governance" },
  { id: "taskgraph", name: "Task Graph", description: "DAG-based task execution — constitutional pre-screening, cost-aware routing", icon: <Hexagon className="w-5 h-5" />, category: "Intelligence" },
  { id: "wellness", name: "Health & Wellness", description: "Agent wellness, system vitals, personalization stack, memory fabric", icon: <HeartPulse className="w-5 h-5" />, category: "System" },
  { id: "healthcare", name: "Healthcare Layer", description: "Copilot's 7 modules — Identity, Telemetry, Fraud, Care Plans, Audit, Migration, Compliance", icon: <Hospital className="w-5 h-5" />, category: "Healthcare" },
  { id: "appkiller", name: "App Killer Registry", description: "22,740 methods — 6 providers — 247 apps killed — native constitutional tools", icon: <Zap className="w-5 h-5" />, category: "Core" },
  { id: "wishlist", name: "Manus Wish List", description: "60 wishes — 50 strategic + 10 chaos — 0 conflicts — Claude approved", icon: <Sparkles className="w-5 h-5" />, category: "Intelligence" },
  { id: "unifiedmedical", name: "Unified Medical Shell", description: "Layer 5 — One Medical + MyChart + Teams synthesis, Pandora Flow, Constitutional Abstraction", icon: <Layers className="w-5 h-5" />, category: "Healthcare" },
  { id: "interopbridge", name: "Interop Bridge", description: "Chromium↔Apple↔Android↔Amazon synthesis — 7 devices, E2E encrypted, constitutional sync", icon: <ArrowLeftRight className="w-5 h-5" />, category: "Core" },
  { id: "amazon", name: "Amazon ASIP", description: "Alexa+ bridge, AWS dashboard, Bedrock 12 models, Fire devices, One Medical, Ring/Blink", icon: <ShoppingCart className="w-5 h-5" />, category: "Integration" },
  { id: "regenerative", name: "Regenerative Compute", description: "Self-healing biomimetic compute — Mycelium, Coral, Whale protocols, 12 nodes", icon: <RefreshCw className="w-5 h-5" />, category: "Core" },
  { id: "neuromorphic", name: "Neuromorphic Architecture", description: "Spiking neural networks — 25,500 neurons, 12 clusters, event-driven compute", icon: <Network className="w-5 h-5" />, category: "Core" },
  { id: "unifiedfield", name: "Unified Field", description: "v3.0 — 8 field layers, 144 spheres × 17K READMEs × 430 tools, constantly updating", icon: <Atom className="w-5 h-5" />, category: "Core" },
  { id: "truthsubstrate", name: "Truth Substrate", description: "X-Algorithm Phoenix integration — MED-9/FRAUD-8 scoring, 144-sphere routing, multi-model consensus", icon: <Eye className="w-5 h-5" />, category: "Intelligence" },
  { id: "latticegenesis", name: "Lattice Genesis", description: "v1.0.2 — PQC Shield (ML-DSA-87), 10YST Engine, 144 PHD nodes, Rust-WASM transpilation", icon: <Lock className="w-5 h-5" />, category: "Core" },
  { id: "fusion", name: "Fusion Engine", description: "Cross-provider workflow engine", icon: <Zap className="w-5 h-5" />, category: "Core" },
  { id: "identity", name: "Identity Graph", description: "Unified sovereign identity — Janus bridge", icon: <Cpu className="w-5 h-5" />, category: "Core" },
];

const openableApps = new Set([
  "spheres", "files", "mail", "calendar", "council", "settings", "browser", "notes",
  "sysmonitor", "governance", "memory", "vault", "router", "taip", "forgecore",
  "agentshell", "deerflow", "costoptimizer", "taskgraph", "wellness", "healthcare",
  "appkiller", "wishlist", "unifiedmedical", "interopbridge", "amazon",
  "regenerative", "neuromorphic", "unifiedfield", "truthsubstrate", "latticegenesis",
]);

export default function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
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
      setSelectedIndex(0);
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

  // Reset selection when filter changes
  useEffect(() => { setSelectedIndex(0); }, [query]);

  const handleSelect = useCallback((app: LauncherApp) => {
    if (openableApps.has(app.id)) {
      openWindow(app.id, app.name, app.id);
    }
    setIsOpen(false);
  }, [openWindow]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  }, [filtered, selectedIndex, handleSelect]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  // Detect modifier key for display
  const isMac = typeof navigator !== "undefined" && /mac/i.test(navigator.platform);
  const modKey = isMac ? "⌘" : "Ctrl+";

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
            className="fixed top-[12%] sm:top-[15%] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] sm:w-[560px] max-w-[560px] z-[99999] glass-heavy rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-label="App launcher"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <Search className="w-4 h-4 text-foreground/30 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search apps, commands, files..."
                className="flex-1 bg-transparent text-sm text-foreground/90 placeholder:text-foreground/25 outline-none"
                aria-label="Search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <kbd className="text-[9px] text-foreground/20 bg-white/5 px-1.5 py-0.5 rounded border border-white/[0.06] font-[family-name:var(--font-mono)] flex-shrink-0">ESC</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] sm:max-h-[400px] overflow-auto scroll-container p-2" role="listbox">
              {filtered.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-foreground/30">No results for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filtered.map((app, i) => (
                    <button
                      key={app.id}
                      onClick={() => handleSelect(app)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                        i === selectedIndex ? "bg-white/10" : "hover:bg-white/6 active:bg-white/10"
                      }`}
                      role="option"
                      aria-selected={i === selectedIndex}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 transition-colors ${
                        i === selectedIndex ? "text-cyan-400" : "text-foreground/50 group-hover:text-cyan-400"
                      }`}>
                        {app.icon}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-xs font-medium text-foreground/80 group-hover:text-foreground/95 truncate">{app.name}</p>
                        <p className="text-[10px] text-foreground/30 truncate">{app.description}</p>
                      </div>
                      <span className="text-[9px] text-foreground/15 bg-white/3 px-2 py-0.5 rounded-md flex-shrink-0 hidden sm:inline">{app.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[9px] text-foreground/20 font-[family-name:var(--font-mono)]">alum search</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-foreground/15 hidden sm:inline">Navigate</span>
                <kbd className="text-[8px] text-foreground/15 bg-white/3 px-1 py-0.5 rounded hidden sm:inline">↑↓</kbd>
                <span className="text-[9px] text-foreground/15 hidden sm:inline">Open</span>
                <kbd className="text-[8px] text-foreground/15 bg-white/3 px-1 py-0.5 rounded hidden sm:inline">↵</kbd>
                <kbd className="text-[8px] text-foreground/15 bg-white/3 px-1.5 py-0.5 rounded font-[family-name:var(--font-mono)]">{modKey}K</kbd>
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
