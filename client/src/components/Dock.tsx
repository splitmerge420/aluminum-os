/*
 * Dock — AI-Native Permabar
 * 
 * NO TERMINAL. This is not a legacy OS. Agent Shell IS the interface.
 * 
 * Layout: [Core Apps] | [Council Innovation Slots] | [All Apps]
 * 
 * Core: Files, Council, Browser, 144 Spheres, Governance, Vault, Healthcare, Settings
 * AI Button: Provider-neutral, opens Agent Shell — first icon, always visible
 * Innovation Slots: 1-2 per Council member, user-customizable
 * All Apps: grid button opens AppLauncher
 */
import { useWindows } from "@/contexts/WindowContext";
import { usePlatform } from "@/hooks/usePlatform";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FolderOpen, Brain, Globe, Settings,
  Shield, Archive, Hospital, TerminalSquare, Grid3X3,
  Sparkles, Workflow, GitBranch, Zap, Eye,
  Mic, Database, Hexagon, HeartPulse,
  GripVertical, X, Plus, ChevronDown, MessageCircle,
} from "lucide-react";

export interface DockApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

/* ── Core 8: the AI-native essentials (Agent Shell is now the AI button) ── */
const coreApps: DockApp[] = [
  { id: "files", name: "Files", icon: <FolderOpen className="w-6 h-6" />, color: "#ffb347", gradient: "from-amber-400/40 to-orange-600/20" },
  { id: "council", name: "AI Council", icon: <Brain className="w-6 h-6" />, color: "#9b59b6", gradient: "from-purple-400/40 to-violet-700/20" },
  { id: "browser", name: "Browser", icon: <Globe className="w-6 h-6" />, color: "#0078D4", gradient: "from-sky-400/40 to-indigo-600/20" },
  { id: "spheres", name: "144 Spheres", icon: <Grid3X3 className="w-6 h-6" />, color: "#FFD700", gradient: "from-yellow-400/40 to-amber-600/20" },
  { id: "governance", name: "Governance", icon: <Shield className="w-6 h-6" />, color: "#00ff88", gradient: "from-green-400/40 to-emerald-700/20" },
  { id: "vault", name: "Atlas Vault", icon: <Archive className="w-6 h-6" />, color: "#e74c3c", gradient: "from-red-400/40 to-rose-700/20" },
  { id: "healthcare", name: "Healthcare", icon: <Hospital className="w-6 h-6" />, color: "#0078D4", gradient: "from-blue-500/40 to-indigo-800/20" },
  { id: "settings", name: "Settings", icon: <Settings className="w-6 h-6" />, color: "#8899aa", gradient: "from-slate-400/40 to-slate-600/20" },
];

/* ── Council Innovation Slots: each member's signature features ── */
interface InnovationSlot {
  id: string;
  name: string;
  member: string;
  memberColor: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  appId: string; // which app it opens
}

const allInnovationSlots: InnovationSlot[] = [
  // Manus — Builder
  { id: "manus-wishlist", name: "Wish List", member: "Manus", memberColor: "#00d4ff", icon: <Sparkles className="w-5 h-5" />, color: "#00d4ff", gradient: "from-cyan-500/30 to-blue-700/15", appId: "wishlist" },
  { id: "manus-deerflow", name: "DeerFlow", member: "Manus", memberColor: "#00d4ff", icon: <Workflow className="w-5 h-5" />, color: "#7c3aed", gradient: "from-violet-500/30 to-purple-800/15", appId: "deerflow" },
  // Claude — Oversight
  { id: "claude-safety", name: "Safety Audit", member: "Claude", memberColor: "#ff6b35", icon: <Shield className="w-5 h-5" />, color: "#ff6b35", gradient: "from-orange-400/30 to-red-700/15", appId: "governance" },
  // Gemini — Synthesizer
  { id: "gemini-synthesis", name: "Synthesis", member: "Gemini", memberColor: "#00ff88", icon: <Hexagon className="w-5 h-5" />, color: "#00ff88", gradient: "from-emerald-400/30 to-green-700/15", appId: "taskgraph" },
  // Copilot — Validator
  { id: "copilot-router", name: "Model Router", member: "Copilot", memberColor: "#9b59b6", icon: <GitBranch className="w-5 h-5" />, color: "#9b59b6", gradient: "from-purple-400/30 to-violet-700/15", appId: "router" },
  // Grok — Contrarian
  { id: "grok-voice", name: "Voice Engine", member: "Grok", memberColor: "#ff4444", icon: <Mic className="w-5 h-5" />, color: "#ff4444", gradient: "from-red-400/30 to-rose-700/15", appId: "agentshell" },
  { id: "grok-stress", name: "Stress Test", member: "Grok", memberColor: "#ff4444", icon: <Zap className="w-5 h-5" />, color: "#ff4444", gradient: "from-red-500/30 to-orange-700/15", appId: "appkiller" },
  // DeepSeek — Specialist
  { id: "deepseek-memory", name: "Memory", member: "DeepSeek", memberColor: "#4fc3f7", icon: <Database className="w-5 h-5" />, color: "#4fc3f7", gradient: "from-sky-400/30 to-blue-700/15", appId: "memory" },
  // GPT — Observer
  { id: "gpt-observe", name: "Observer", member: "GPT", memberColor: "#ffd700", icon: <Eye className="w-5 h-5" />, color: "#ffd700", gradient: "from-yellow-400/30 to-amber-700/15", appId: "sysmonitor" },
  // Wellness
  { id: "wellness-pulse", name: "Wellness", member: "System", memberColor: "#ef4444", icon: <HeartPulse className="w-5 h-5" />, color: "#ef4444", gradient: "from-rose-500/30 to-red-800/15", appId: "wellness" },
];

// Default visible innovation slots (user can customize)
const DEFAULT_VISIBLE_SLOTS = ["manus-wishlist", "copilot-router", "grok-voice", "deepseek-memory"];

const STORAGE_KEY = "aluminum-dock-slots";

export default function Dock() {
  const { openWindow, windows, focusWindow, restoreWindow } = useWindows();
  const { isMobile, isTouchDevice, hasHover } = usePlatform();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showSlotEditor, setShowSlotEditor] = useState(false);

  // Customizable innovation slots
  const [visibleSlotIds, setVisibleSlotIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_SLOTS;
    } catch { return DEFAULT_VISIBLE_SLOTS; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleSlotIds));
  }, [visibleSlotIds]);

  const visibleSlots = allInnovationSlots.filter(s => visibleSlotIds.includes(s.id));

  const toggleSlot = useCallback((slotId: string) => {
    setVisibleSlotIds(prev => {
      if (prev.includes(slotId)) return prev.filter(id => id !== slotId);
      if (prev.length >= 6) return prev; // max 6 innovation slots
      return [...prev, slotId];
    });
  }, []);

  const handleClick = (appId: string, title: string, w: number, h: number) => {
    const existing = windows.find(win => win.appId === appId);
    if (existing) {
      if (existing.isMinimized) restoreWindow(existing.id);
      focusWindow(existing.id);
      return;
    }
    openWindow(appId, title, appId, w, h);
  };

  const handleCoreClick = (app: DockApp) => {
    const titles: Record<string, string> = {
      agentshell: "Universal Agent Shell",
      files: "Files — alum://drive/",
      council: "AI Council — Pantheon",
      browser: "Aluminum Browser",
      spheres: "144 Spheres — Agent Matrix",
      governance: "Governance — Constitutional Dashboard",
      vault: "Atlas Vault — Artifact Gallery",
      healthcare: "Healthcare Layer — Copilot's 7 Modules",
      settings: "System Settings",
    };
    const sizes: Record<string, [number, number]> = {
      agentshell: [1000, 650],
      council: [950, 650],
      browser: [1000, 650],
      spheres: [1100, 700],
      governance: [900, 600],
      vault: [950, 650],
      healthcare: [1000, 650],
      settings: [750, 550],
    };
    const [w, h] = sizes[app.id] || [800, 550];
    handleClick(app.id, titles[app.id] || app.name, w, h);
  };

  const handleSlotClick = (slot: InnovationSlot) => {
    const slotTitles: Record<string, string> = {
      wishlist: "Manus Wish List — 60 Wishes",
      deerflow: "DeerFlow — Multi-Agent Research",
      governance: "Governance — Constitutional Dashboard",
      taskgraph: "Task Graph — DAG Executor",
      router: "Model Router — 3-Tier Inference",
      agentshell: "Universal Agent Shell",
      appkiller: "App Killer — 22,740 Methods Registry",
      memory: "SHELDONBRAIN — Memory Viewer",
      sysmonitor: "System Monitor — Ring Status",
      wellness: "Health & Wellness — System Panel",
    };
    handleClick(slot.appId, slotTitles[slot.appId] || slot.name, 950, 650);
  };

  const openAllApps = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  };

  // Sizing — BIG for touch-first (Amazon Fire, iPhone, Android, Pixel)
  const iconSize = isMobile ? "w-12 h-12" : "w-14 h-14";
  const aiSize = isMobile ? "w-14 h-14" : "w-16 h-16";
  const slotSize = isMobile ? "w-11 h-11" : "w-12 h-12";
  const iconRadius = isMobile ? "rounded-xl" : "rounded-2xl";
  const aiRadius = isMobile ? "rounded-2xl" : "rounded-[18px]";
  const slotRadius = isMobile ? "rounded-xl" : "rounded-xl";

  // Total items for hover tracking
  const totalCore = coreApps.length;
  const totalSlots = visibleSlots.length;

  return (
    <>
      <motion.div
        data-dock
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)" }}
        role="navigation"
        aria-label="Application dock"
      >
        <div className="glass-heavy rounded-2xl px-3 py-2.5 flex items-end gap-2 border border-white/[0.08]">

          {/* ── AI Button — Provider-neutral, opens Agent Shell ── */}
          <motion.button
            animate={{
              scale: hasHover && hoveredIndex === -1 ? 1.4 : 1,
              y: hasHover && hoveredIndex === -1 ? -10 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onMouseEnter={hasHover ? () => setHoveredIndex(-1) : undefined}
            onMouseLeave={hasHover ? () => setHoveredIndex(null) : undefined}
            onClick={() => handleClick("agentshell", "AI — Aluminum Intelligence", 1000, 650)}
            className="relative flex flex-col items-center group flex-shrink-0 touch-feedback"
            aria-label="AI — Talk to your AI"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick("agentshell", "AI — Aluminum Intelligence", 1000, 650); } }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 16px rgba(0,212,255,0.4), 0 0 32px rgba(0,212,255,0.15), 0 0 48px rgba(0,212,255,0.05)",
                  "0 0 28px rgba(0,212,255,0.6), 0 0 56px rgba(0,212,255,0.2), 0 0 72px rgba(0,212,255,0.08)",
                  "0 0 16px rgba(0,212,255,0.4), 0 0 32px rgba(0,212,255,0.15), 0 0 48px rgba(0,212,255,0.05)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`${aiSize} ${aiRadius} flex items-center justify-center bg-gradient-to-br from-cyan-400/50 via-blue-500/40 to-indigo-600/30 border-2 border-cyan-400/40`}
            >
              <span className="text-white font-extrabold text-lg font-[family-name:var(--font-display)] tracking-tight drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]">AI</span>
            </motion.div>
            {windows.some(w => w.appId === "agentshell") && (
              <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-cyan-400" style={{ boxShadow: "0 0 4px #00d4ff" }} />
            )}
            {hasHover && (
              <AnimatePresence>
                {hoveredIndex === -1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -top-9 px-2.5 py-1 rounded-lg glass-heavy text-[11px] font-medium text-cyan-300 whitespace-nowrap font-[family-name:var(--font-display)] border border-cyan-400/20 pointer-events-none"
                  >
                    AI
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.button>

          {/* ── Divider after AI ── */}
          <div className="w-px h-10 bg-cyan-400/20 mx-1 self-center flex-shrink-0" />

          {/* ── Core Apps ── */}
          {coreApps.map((app, i) => {
            const isOpen = windows.some(w => w.appId === app.id);
            const isMinimized = windows.some(w => w.appId === app.id && w.isMinimized);
            const distance = hasHover && hoveredIndex !== null ? Math.abs(hoveredIndex - i) : 999;
            const scale = hasHover && hoveredIndex !== null
              ? distance === 0 ? 1.35 : distance === 1 ? 1.1 : 1
              : 1;

            return (
              <motion.button
                key={app.id}
                animate={{ scale, y: scale > 1 ? -(scale - 1) * 20 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onMouseEnter={hasHover ? () => setHoveredIndex(i) : undefined}
                onMouseLeave={hasHover ? () => setHoveredIndex(null) : undefined}
                onClick={() => handleCoreClick(app)}
                className="relative flex flex-col items-center group flex-shrink-0 touch-feedback"
                aria-label={`Open ${app.name}`}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCoreClick(app); } }}
              >
                <div
                  className={`${iconSize} ${iconRadius} flex items-center justify-center transition-all duration-200 bg-gradient-to-br ${app.gradient} border border-white/[0.06] ${isMinimized ? "opacity-60" : ""}`}
                  style={{
                    boxShadow: scale > 1
                      ? `0 0 24px ${app.color}50, inset 0 1px 1px rgba(255,255,255,0.1)`
                      : "inset 0 1px 1px rgba(255,255,255,0.06)",
                    color: app.color,
                  }}
                >
                  {app.icon}
                </div>
                {isOpen && (
                  <div
                    className="absolute -bottom-1.5 w-1 h-1 rounded-full"
                    style={{ background: app.color, boxShadow: `0 0 4px ${app.color}` }}
                  />
                )}
                {hasHover && (
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-9 px-2.5 py-1 rounded-lg glass-heavy text-[11px] font-medium text-foreground/90 whitespace-nowrap font-[family-name:var(--font-display)] border border-white/[0.08] pointer-events-none"
                      >
                        {app.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.button>
            );
          })}

          {/* ── Divider ── */}
          {visibleSlots.length > 0 && (
            <div className="w-px h-10 bg-white/[0.08] mx-1 self-center flex-shrink-0" />
          )}

          {/* ── Council Innovation Slots (customizable) ── */}
          {visibleSlots.map((slot, si) => {
            const idx = totalCore + si;
            const isOpen = windows.some(w => w.appId === slot.appId);
            const distance = hasHover && hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : 999;
            const scale = hasHover && hoveredIndex !== null
              ? distance === 0 ? 1.3 : distance === 1 ? 1.08 : 1
              : 1;

            return (
              <motion.button
                key={slot.id}
                animate={{ scale, y: scale > 1 ? -(scale - 1) * 18 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onMouseEnter={hasHover ? () => setHoveredIndex(idx) : undefined}
                onMouseLeave={hasHover ? () => setHoveredIndex(null) : undefined}
                onClick={() => handleSlotClick(slot)}
                className="relative flex flex-col items-center group flex-shrink-0 touch-feedback"
                aria-label={`${slot.member}: ${slot.name}`}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSlotClick(slot); } }}
              >
                <div
                  className={`${slotSize} ${slotRadius} flex items-center justify-center transition-all duration-200 bg-gradient-to-br ${slot.gradient} border border-white/[0.04] relative`}
                  style={{
                    boxShadow: scale > 1
                      ? `0 0 16px ${slot.color}40, inset 0 1px 1px rgba(255,255,255,0.08)`
                      : "inset 0 1px 1px rgba(255,255,255,0.04)",
                    color: slot.color,
                  }}
                >
                  {slot.icon}
                  {/* Member badge — tiny colored dot in corner */}
                  <div
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-black/30"
                    style={{ background: slot.memberColor }}
                  />
                </div>
                {isOpen && (
                  <div
                    className="absolute -bottom-1.5 w-1 h-1 rounded-full"
                    style={{ background: slot.color, boxShadow: `0 0 4px ${slot.color}` }}
                  />
                )}
                {hasHover && (
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-11 px-2.5 py-1 rounded-lg glass-heavy border border-white/[0.08] pointer-events-none text-center"
                      >
                        <p className="text-[10px] font-medium text-foreground/90 whitespace-nowrap">{slot.name}</p>
                        <p className="text-[8px] whitespace-nowrap" style={{ color: slot.memberColor }}>{slot.member}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.button>
            );
          })}

          {/* ── Customize Slots button ── */}
          <motion.button
            animate={{
              scale: hasHover && hoveredIndex === totalCore + totalSlots ? 1.2 : 1,
              y: hasHover && hoveredIndex === totalCore + totalSlots ? -4 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onMouseEnter={hasHover ? () => setHoveredIndex(totalCore + totalSlots) : undefined}
            onMouseLeave={hasHover ? () => setHoveredIndex(null) : undefined}
            onClick={() => setShowSlotEditor(!showSlotEditor)}
            className="relative flex flex-col items-center group flex-shrink-0 touch-feedback"
            aria-label="Customize innovation slots"
            tabIndex={0}
          >
            <div className={`${isMobile ? "w-8 h-11" : "w-8 h-12"} rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/[0.06] border-dashed text-foreground/20 hover:text-foreground/40 transition-colors`}>
              <ChevronDown className="w-4 h-4" />
            </div>
            {hasHover && (
              <AnimatePresence>
                {hoveredIndex === totalCore + totalSlots && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -top-9 px-2.5 py-1 rounded-lg glass-heavy text-[10px] font-medium text-foreground/70 whitespace-nowrap border border-white/[0.08] pointer-events-none"
                  >
                    Customize
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.button>

          {/* ── Divider ── */}
          <div className="w-px h-10 bg-white/[0.08] mx-1 self-center flex-shrink-0" />

          {/* ── All Apps ── */}
          <motion.button
            animate={{
              scale: hasHover && hoveredIndex === totalCore + totalSlots + 1 ? 1.35 : 1,
              y: hasHover && hoveredIndex === totalCore + totalSlots + 1 ? -7 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onMouseEnter={hasHover ? () => setHoveredIndex(totalCore + totalSlots + 1) : undefined}
            onMouseLeave={hasHover ? () => setHoveredIndex(null) : undefined}
            onClick={openAllApps}
            className="relative flex flex-col items-center group flex-shrink-0 touch-feedback"
            aria-label="All Apps"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAllApps(); } }}
          >
            <div
              className={`${iconSize} ${iconRadius} flex items-center justify-center transition-all duration-200 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/[0.08] border-dashed text-foreground/30 hover:text-foreground/60`}
            >
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="7" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="13" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="1" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="13" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="1" y="13" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="7" y="13" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
                <rect x="13" y="13" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
              </svg>
            </div>
            {hasHover && (
              <AnimatePresence>
                {hoveredIndex === totalCore + totalSlots + 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -top-9 px-2.5 py-1 rounded-lg glass-heavy text-[11px] font-medium text-foreground/90 whitespace-nowrap font-[family-name:var(--font-display)] border border-white/[0.08] pointer-events-none"
                  >
                    All Apps
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Slot Editor Popover ── */}
      <AnimatePresence>
        {showSlotEditor && (
          <>
            <div className="fixed inset-0 z-[9998]" onClick={() => setShowSlotEditor(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[10000] glass-heavy rounded-xl border border-white/[0.08] shadow-2xl w-[340px] max-w-[calc(100vw-32px)]"
            >
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-foreground/90 font-[family-name:var(--font-display)]">
                    Customize Innovation Slots
                  </h3>
                  <p className="text-[10px] text-foreground/40 mt-0.5">
                    {visibleSlotIds.length}/6 slots active — drag to reorder
                  </p>
                </div>
                <button
                  onClick={() => setShowSlotEditor(false)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-foreground/40" />
                </button>
              </div>
              <div className="p-3 space-y-1 max-h-64 overflow-auto scroll-container">
                {allInnovationSlots.map(slot => {
                  const isActive = visibleSlotIds.includes(slot.id);
                  const isFull = visibleSlotIds.length >= 6 && !isActive;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => !isFull && toggleSlot(slot.id)}
                      disabled={isFull}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? "bg-white/[0.06] border border-white/[0.1]"
                          : isFull
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br border border-white/[0.04]"
                        style={{ color: slot.color }}
                      >
                        {slot.icon}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-[11px] font-medium text-foreground/80 truncate">{slot.name}</p>
                        <p className="text-[9px] truncate" style={{ color: slot.memberColor }}>{slot.member}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isActive ? "border-cyan-400 bg-cyan-400/20" : "border-white/20"
                      }`}>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={() => setVisibleSlotIds(DEFAULT_VISIBLE_SLOTS)}
                  className="text-[10px] text-foreground/40 hover:text-foreground/60 transition-colors"
                >
                  Reset to defaults
                </button>
                <button
                  onClick={() => setShowSlotEditor(false)}
                  className="text-[10px] text-cyan-400/80 hover:text-cyan-400 transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
