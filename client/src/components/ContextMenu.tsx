/*
 * ContextMenu — Cross-platform adaptive
 * Desktop: right-click to open
 * Touch: long-press (500ms) to open
 * All: viewport-clamped position, keyboard navigable, scrollable overflow
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Layout, Palette, Monitor, Info, Grid3X3, FolderOpen,
  Cpu, Activity, Shield, Archive, ScrollText, TerminalSquare, Workflow,
  DollarSign, Hexagon, HeartPulse, Hospital, Zap, Sparkles, Layers, ArrowLeftRight, ShoppingCart,
  Atom, Network,
} from "lucide-react";
import { useWindows } from "@/contexts/WindowContext";

interface MenuPosition { x: number; y: number; }

type MenuItem = { label: string; icon: React.ReactNode; action: () => void } | "divider";

export default function ContextMenu() {
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const { openWindow } = useWindows();
  const menuRef = useRef<HTMLDivElement>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressPos = useRef<MenuPosition | null>(null);

  // Clamp menu position to viewport
  const clampPosition = useCallback((x: number, y: number) => {
    const menuW = 220;
    const menuH = 500; // approximate max
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
      x: Math.min(x, vw - menuW - 8),
      y: Math.min(y, vh - menuH - 8),
    };
  }, []);

  // Right-click handler (desktop)
  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-window]") || target.closest("[data-dock]") || target.closest("[data-topbar]")) return;
    e.preventDefault();
    setPos(clampPosition(e.clientX, e.clientY));
  }, [clampPosition]);

  // Long-press handlers (touch)
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-window]") || target.closest("[data-dock]") || target.closest("[data-topbar]")) return;
    const t = e.touches[0];
    longPressPos.current = { x: t.clientX, y: t.clientY };
    longPressRef.current = setTimeout(() => {
      if (longPressPos.current) {
        setPos(clampPosition(longPressPos.current.x, longPressPos.current.y));
      }
    }, 500);
  }, [clampPosition]);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if finger moves
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
    setPos(null);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setPos(null);
  }, []);

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleContextMenu, handleClick, handleTouchStart, handleTouchMove, handleTouchEnd, handleKeyDown]);

  const menuItems: MenuItem[] = [
    { label: "144 Spheres", icon: <Grid3X3 className="w-3.5 h-3.5" />, action: () => openWindow("spheres", "144 Spheres — Agent Matrix", "spheres", 1100, 700) },
    { label: "Open Files", icon: <FolderOpen className="w-3.5 h-3.5" />, action: () => openWindow("files", "Files", "files") },
    { label: "Open AI Council", icon: <Cpu className="w-3.5 h-3.5" />, action: () => openWindow("council", "AI Council — Pantheon", "council") },
    { label: "System Monitor", icon: <Activity className="w-3.5 h-3.5" />, action: () => openWindow("sysmonitor", "System Monitor", "sysmonitor") },
    { label: "Governance", icon: <Shield className="w-3.5 h-3.5" />, action: () => openWindow("governance", "Governance", "governance") },
    { label: "Atlas Vault", icon: <Archive className="w-3.5 h-3.5" />, action: () => openWindow("vault", "Atlas Vault", "vault") },
    { label: "TAIP Protocol", icon: <ScrollText className="w-3.5 h-3.5" />, action: () => openWindow("taip", "TAIP Protocol", "taip") },
    { label: "Forge Core", icon: <Cpu className="w-3.5 h-3.5" />, action: () => openWindow("forgecore", "Forge Core — Ring 0", "forgecore") },
    { label: "Agent Shell", icon: <TerminalSquare className="w-3.5 h-3.5" />, action: () => openWindow("agentshell", "Universal Agent Shell", "agentshell", 1000, 650) },
    { label: "DeerFlow Research", icon: <Workflow className="w-3.5 h-3.5" />, action: () => openWindow("deerflow", "DeerFlow — Multi-Agent Research", "deerflow", 950, 650) },
    { label: "Cost Optimizer", icon: <DollarSign className="w-3.5 h-3.5" />, action: () => openWindow("costoptimizer", "Cost Optimizer", "costoptimizer", 950, 600) },
    { label: "Task Graph", icon: <Hexagon className="w-3.5 h-3.5" />, action: () => openWindow("taskgraph", "Task Graph — DAG Executor", "taskgraph", 950, 600) },
    { label: "Health & Wellness", icon: <HeartPulse className="w-3.5 h-3.5" />, action: () => openWindow("wellness", "Health & Wellness", "wellness", 900, 600) },
    { label: "Healthcare Layer", icon: <Hospital className="w-3.5 h-3.5" />, action: () => openWindow("healthcare", "Healthcare Layer", "healthcare", 1000, 650) },
    { label: "Unified Medical Shell", icon: <Layers className="w-3.5 h-3.5" />, action: () => openWindow("unifiedmedical", "Layer 5 — Unified Medical Shell", "unifiedmedical", 1050, 700) },
    { label: "App Killer Registry", icon: <Zap className="w-3.5 h-3.5" />, action: () => openWindow("appkiller", "App Killer — 22,740 Methods", "appkiller", 1050, 700) },
    { label: "Interop Bridge", icon: <ArrowLeftRight className="w-3.5 h-3.5" />, action: () => openWindow("interopbridge", "Interop Bridge — Cross-Device Sync", "interopbridge", 1050, 700) },
    { label: "Amazon ASIP", icon: <ShoppingCart className="w-3.5 h-3.5" />, action: () => openWindow("amazon", "Amazon Strategic Integration Protocol", "amazon", 1050, 700) },
    { label: "Regenerative Compute", icon: <RefreshCw className="w-3.5 h-3.5" />, action: () => openWindow("regenerative", "Regenerative Compute Engine", "regenerative", 1050, 700) },
    { label: "Neuromorphic Arch", icon: <Network className="w-3.5 h-3.5" />, action: () => openWindow("neuromorphic", "Neuromorphic Architecture", "neuromorphic", 1050, 700) },
    { label: "Unified Field", icon: <Atom className="w-3.5 h-3.5" />, action: () => openWindow("unifiedfield", "Unified Field Dashboard v3.0", "unifiedfield", 1050, 700) },
    { label: "Manus Wish List", icon: <Sparkles className="w-3.5 h-3.5" />, action: () => openWindow("wishlist", "Manus Wish List — 60 Wishes", "wishlist", 1050, 700) },
    "divider",
    { label: "Change Wallpaper", icon: <Palette className="w-3.5 h-3.5" />, action: () => openWindow("settings", "Settings", "settings") },
    { label: "Display Settings", icon: <Monitor className="w-3.5 h-3.5" />, action: () => openWindow("settings", "Settings", "settings") },
    { label: "Arrange Windows", icon: <Layout className="w-3.5 h-3.5" />, action: () => {} },
    { label: "Refresh", icon: <RefreshCw className="w-3.5 h-3.5" />, action: () => window.location.reload() },
    "divider",
    { label: "About Aluminum OS", icon: <Info className="w-3.5 h-3.5" />, action: () => openWindow("settings", "Settings", "settings") },
  ];

  return (
    <AnimatePresence>
      {pos && (
        <>
          {/* Backdrop for touch dismiss */}
          <div className="fixed inset-0 z-[99998]" onClick={() => setPos(null)} onTouchEnd={() => setPos(null)} />
          <motion.div
            ref={menuRef}
            data-context-menu
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.12 }}
            className="fixed z-[99999] glass-heavy rounded-xl border border-white/[0.08] py-1.5 px-1 min-w-[200px] max-h-[70vh] overflow-y-auto scroll-container shadow-2xl"
            style={{ left: pos.x, top: pos.y }}
            role="menu"
            aria-label="Context menu"
          >
            {menuItems.map((item, i) =>
              item === "divider" ? (
                <div key={i} className="my-1 mx-2 border-t border-white/[0.06]" role="separator" />
              ) : (
                <button
                  key={i}
                  onClick={() => { item.action(); setPos(null); }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-foreground/70 hover:bg-white/8 active:bg-white/12 hover:text-foreground/90 transition-colors"
                  role="menuitem"
                  tabIndex={0}
                >
                  <span className="text-foreground/40 flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              )
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
