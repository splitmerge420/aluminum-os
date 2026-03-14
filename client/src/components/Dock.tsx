/*
 * Dock — Cross-platform adaptive
 * macOS: magnification on hover, centered bottom dock
 * Windows: taskbar feel, no magnification on touch
 * ChromeOS: shelf-like, horizontal scroll
 * iOS/Android: bottom nav feel, larger touch targets, no hover magnification
 * All: scrollable overflow, safe area respect, keyboard accessible
 */
import { useWindows } from "@/contexts/WindowContext";
import { usePlatform } from "@/hooks/usePlatform";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Terminal, FolderOpen, Mail, CalendarDays, Brain, Settings, Globe,
  StickyNote, Activity, Shield, Database, Archive, GitBranch, ScrollText,
  Cpu, TerminalSquare, Workflow, DollarSign, Hexagon, HeartPulse,
  Hospital, Zap, Sparkles, ChevronLeft, ChevronRight,
} from "lucide-react";

export interface DockApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const dockApps: DockApp[] = [
  { id: "terminal", name: "Terminal", icon: <Terminal className="w-5 h-5" />, color: "#00d4ff", gradient: "from-cyan-500/40 to-cyan-700/20" },
  { id: "files", name: "Files", icon: <FolderOpen className="w-5 h-5" />, color: "#ffb347", gradient: "from-amber-400/40 to-orange-600/20" },
  { id: "mail", name: "Mail", icon: <Mail className="w-5 h-5" />, color: "#4285F4", gradient: "from-blue-400/40 to-blue-700/20" },
  { id: "calendar", name: "Calendar", icon: <CalendarDays className="w-5 h-5" />, color: "#00ff88", gradient: "from-emerald-400/40 to-green-700/20" },
  { id: "council", name: "AI Council", icon: <Brain className="w-5 h-5" />, color: "#9b59b6", gradient: "from-purple-400/40 to-violet-700/20" },
  { id: "settings", name: "Settings", icon: <Settings className="w-5 h-5" />, color: "#8899aa", gradient: "from-slate-400/40 to-slate-600/20" },
  { id: "browser", name: "Browser", icon: <Globe className="w-5 h-5" />, color: "#0078D4", gradient: "from-sky-400/40 to-indigo-600/20" },
  { id: "notes", name: "Notes", icon: <StickyNote className="w-5 h-5" />, color: "#ffd700", gradient: "from-yellow-400/40 to-amber-600/20" },
  { id: "sysmonitor", name: "System Monitor", icon: <Activity className="w-5 h-5" />, color: "#ff6b35", gradient: "from-orange-400/40 to-red-600/20" },
  { id: "governance", name: "Governance", icon: <Shield className="w-5 h-5" />, color: "#00ff88", gradient: "from-green-400/40 to-emerald-700/20" },
  { id: "memory", name: "SHELDONBRAIN", icon: <Database className="w-5 h-5" />, color: "#9b59b6", gradient: "from-violet-400/40 to-purple-700/20" },
  { id: "vault", name: "Atlas Vault", icon: <Archive className="w-5 h-5" />, color: "#e74c3c", gradient: "from-red-400/40 to-rose-700/20" },
  { id: "router", name: "Model Router", icon: <GitBranch className="w-5 h-5" />, color: "#00ff88", gradient: "from-emerald-400/40 to-teal-700/20" },
  { id: "taip", name: "TAIP Protocol", icon: <ScrollText className="w-5 h-5" />, color: "#d97706", gradient: "from-amber-500/40 to-orange-700/20" },
  { id: "forgecore", name: "Forge Core", icon: <Cpu className="w-5 h-5" />, color: "#ff4444", gradient: "from-red-500/40 to-orange-700/20" },
  { id: "agentshell", name: "Agent Shell", icon: <TerminalSquare className="w-5 h-5" />, color: "#00ffcc", gradient: "from-teal-400/40 to-cyan-700/20" },
  { id: "deerflow", name: "DeerFlow Research", icon: <Workflow className="w-5 h-5" />, color: "#7c3aed", gradient: "from-violet-500/40 to-purple-800/20" },
  { id: "costoptimizer", name: "Cost Optimizer", icon: <DollarSign className="w-5 h-5" />, color: "#22c55e", gradient: "from-green-500/40 to-emerald-800/20" },
  { id: "taskgraph", name: "Task Graph", icon: <Hexagon className="w-5 h-5" />, color: "#a855f7", gradient: "from-purple-500/40 to-violet-800/20" },
  { id: "wellness", name: "Health & Wellness", icon: <HeartPulse className="w-5 h-5" />, color: "#ef4444", gradient: "from-rose-500/40 to-red-800/20" },
  { id: "healthcare", name: "Healthcare Layer", icon: <Hospital className="w-5 h-5" />, color: "#0078D4", gradient: "from-blue-500/40 to-indigo-800/20" },
  { id: "appkiller", name: "App Killer Registry", icon: <Zap className="w-5 h-5" />, color: "#ff3366", gradient: "from-pink-500/40 to-rose-800/20" },
  { id: "wishlist", name: "Manus Wish List", icon: <Sparkles className="w-5 h-5" />, color: "#00d4ff", gradient: "from-cyan-500/40 to-blue-700/20" },
];

export default function Dock() {
  const { openWindow, windows, focusWindow, restoreWindow } = useWindows();
  const { isMobile, isTouchDevice, hasHover } = usePlatform();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll overflow
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", check); ro.disconnect(); };
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const handleClick = (app: DockApp) => {
    const existing = windows.find(w => w.appId === app.id);
    if (existing) {
      if (existing.isMinimized) restoreWindow(existing.id);
      focusWindow(existing.id);
      return;
    }
    const titles: Record<string, string> = {
      terminal: "Aluminum Terminal", files: "Files — alum://drive/", mail: "Universal Inbox",
      calendar: "Calendar", council: "AI Council — Pantheon", settings: "System Settings",
      browser: "Aluminum Browser", notes: "Notes", sysmonitor: "System Monitor — Ring Status",
      governance: "Governance — Constitutional Dashboard", memory: "SHELDONBRAIN — Memory Viewer",
      vault: "Atlas Vault — Artifact Gallery", router: "Model Router — 3-Tier Inference",
      taip: "TAIP — Trained Adult Instance Protocol", forgecore: "Forge Core — Ring 0 Kernel Viewer",
      agentshell: "Universal Agent Shell", deerflow: "DeerFlow — Multi-Agent Research",
      costoptimizer: "Cost Optimizer — Spend Governance", taskgraph: "Task Graph — DAG Executor",
      wellness: "Health & Wellness — System Panel", healthcare: "Healthcare Layer — Copilot's 7 Modules",
      appkiller: "App Killer — 22,740 Methods Registry",
      wishlist: "Manus Wish List — 60 Wishes (50 Strategic + 10 Chaos)",
    };
    const sizes: Record<string, [number, number]> = {
      terminal: [850, 500], council: [950, 650], browser: [1000, 650], settings: [750, 550],
      sysmonitor: [900, 600], governance: [900, 600], memory: [900, 600], vault: [950, 650],
      router: [900, 600], taip: [850, 600], forgecore: [950, 650], agentshell: [1000, 650],
      deerflow: [950, 650], costoptimizer: [950, 600], taskgraph: [950, 600], wellness: [900, 600],
      healthcare: [1000, 650], appkiller: [1050, 700], wishlist: [1050, 700],
    };
    const [w, h] = sizes[app.id] || [800, 550];
    openWindow(app.id, titles[app.id] || app.name, app.id, w, h);
  };

  // Icon size: larger on touch devices for better tap targets
  const iconSize = isMobile ? "w-11 h-11" : "w-12 h-12";
  const iconRadius = isMobile ? "rounded-xl" : "rounded-[14px]";
  const gapClass = isMobile ? "gap-1" : "gap-1.5";

  return (
    <motion.div
      data-dock
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }}
    >
      <div className="relative flex items-center max-w-[calc(100vw-32px)]">
        {/* Scroll left indicator */}
        {canScrollLeft && !isMobile && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 z-10 w-6 h-6 rounded-full glass-heavy flex items-center justify-center text-foreground/50 hover:text-foreground/80 transition-colors"
            aria-label="Scroll dock left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        <div
          ref={scrollRef}
          className={`glass-heavy rounded-2xl px-2.5 py-2 flex items-end ${gapClass} border border-white/[0.08] overflow-x-auto scrollbar-none`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          {dockApps.map((app, i) => {
            const isOpen = windows.some(w => w.appId === app.id);
            const isMinimized = windows.some(w => w.appId === app.id && w.isMinimized);

            // Only apply magnification on desktop with hover capability
            const distance = hasHover && hoveredIndex !== null ? Math.abs(hoveredIndex - i) : 999;
            const scale = hasHover && hoveredIndex !== null
              ? distance === 0 ? 1.4 : distance === 1 ? 1.12 : 1
              : 1;

            return (
              <motion.button
                key={app.id}
                animate={{ scale, y: scale > 1 ? -(scale - 1) * 20 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onMouseEnter={hasHover ? () => setHoveredIndex(i) : undefined}
                onMouseLeave={hasHover ? () => setHoveredIndex(null) : undefined}
                onClick={() => handleClick(app)}
                className="relative flex flex-col items-center group flex-shrink-0 touch-feedback"
                aria-label={`Open ${app.name}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(app); } }}
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
                {/* Open indicator dot */}
                {isOpen && (
                  <div
                    className="absolute -bottom-1.5 w-1 h-1 rounded-full"
                    style={{ background: app.color, boxShadow: `0 0 4px ${app.color}` }}
                  />
                )}
                {/* Tooltip: only on hover-capable devices */}
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
        </div>

        {/* Scroll right indicator */}
        {canScrollRight && !isMobile && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 z-10 w-6 h-6 rounded-full glass-heavy flex items-center justify-center text-foreground/50 hover:text-foreground/80 transition-colors"
            aria-label="Scroll dock right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
