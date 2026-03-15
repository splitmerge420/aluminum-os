/*
 * Window — Cross-platform adaptive window chrome
 * macOS: traffic light buttons, drag to snap
 * Windows: familiar close/min/max, snap hints
 * ChromeOS: clean chrome, keyboard shortcuts
 * iOS/Android: larger touch targets for title bar buttons, no resize handles
 * All: touch + pointer event support, keyboard accessible, ARIA labels
 */
import { useWindows, type WindowState } from "@/contexts/WindowContext";
import { motion } from "framer-motion";
import {
  Minus, X, Maximize2, Grid3X3, FolderOpen, Mail, CalendarDays,
  Brain, Settings, Globe, StickyNote, Activity, Shield, Database,
  Archive, GitBranch, ScrollText, Cpu, TerminalSquare, Workflow,
  DollarSign, Hexagon, HeartPulse, Hospital, Zap, Sparkles, Layers, ArrowLeftRight, ShoppingCart,
  Atom, Network, RefreshCw,
} from "lucide-react";
import { useRef, useCallback, useEffect, useState, type ReactNode } from "react";

const appIcons: Record<string, React.ReactNode> = {
  spheres: <Grid3X3 className="w-3.5 h-3.5 text-yellow-400" />,
  files: <FolderOpen className="w-3.5 h-3.5 text-amber-400" />,
  mail: <Mail className="w-3.5 h-3.5 text-blue-400" />,
  calendar: <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />,
  council: <Brain className="w-3.5 h-3.5 text-purple-400" />,
  settings: <Settings className="w-3.5 h-3.5 text-slate-400" />,
  browser: <Globe className="w-3.5 h-3.5 text-sky-400" />,
  notes: <StickyNote className="w-3.5 h-3.5 text-yellow-400" />,
  sysmonitor: <Activity className="w-3.5 h-3.5 text-orange-400" />,
  governance: <Shield className="w-3.5 h-3.5 text-green-400" />,
  memory: <Database className="w-3.5 h-3.5 text-violet-400" />,
  vault: <Archive className="w-3.5 h-3.5 text-red-400" />,
  router: <GitBranch className="w-3.5 h-3.5 text-emerald-400" />,
  taip: <ScrollText className="w-3.5 h-3.5 text-amber-400" />,
  forgecore: <Cpu className="w-3.5 h-3.5 text-red-400" />,
  agentshell: <TerminalSquare className="w-3.5 h-3.5 text-teal-400" />,
  deerflow: <Workflow className="w-3.5 h-3.5 text-violet-400" />,
  costoptimizer: <DollarSign className="w-3.5 h-3.5 text-green-400" />,
  taskgraph: <Hexagon className="w-3.5 h-3.5 text-purple-400" />,
  wellness: <HeartPulse className="w-3.5 h-3.5 text-rose-400" />,
  healthcare: <Hospital className="w-3.5 h-3.5 text-blue-400" />,
  appkiller: <Zap className="w-3.5 h-3.5 text-pink-400" />,
  wishlist: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
  unifiedmedical: <Layers className="w-3.5 h-3.5 text-cyan-400" />,
  interopbridge: <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />,
  amazon: <ShoppingCart className="w-3.5 h-3.5 text-[#FF9900]" />,
  regenerative: <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />,
  neuromorphic: <Network className="w-3.5 h-3.5 text-violet-400" />,
  unifiedfield: <Atom className="w-3.5 h-3.5 text-indigo-400" />,
};

interface WindowProps {
  window: WindowState;
  children: ReactNode;
}

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;

// Detect touch capability
const isTouchCapable = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export default function Window({ window: win, children }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow, moveWindow, resizeWindow } = useWindows();
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; winX: number; winY: number; winW: number; winH: number; dir: ResizeDir } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showSnapHint, setShowSnapHint] = useState<"left" | "right" | "top" | null>(null);

  // Unified pointer position from mouse or touch
  const getPointerPos = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      const t = e.touches[0] || e.changedTouches[0];
      return { x: t.clientX, y: t.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  // ─── Drag handling (mouse + touch) ───
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    focusWindow(win.id);
    dragRef.current = { startX: clientX, startY: clientY, winX: win.x, winY: win.y };
    setIsDragging(true);
  }, [win.id, win.x, win.y, focusWindow]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".no-drag")) return;
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".no-drag")) return;
    const t = e.touches[0];
    handleDragStart(t.clientX, t.clientY);
  }, [handleDragStart]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return;
      const pos = getPointerPos(e);
      const dx = pos.x - dragRef.current.startX;
      const dy = pos.y - dragRef.current.startY;
      const newX = dragRef.current.winX + dx;
      const newY = Math.max(32, dragRef.current.winY + dy);
      moveWindow(win.id, newX, newY);

      // Snap hints (mouse only)
      if (!("touches" in e)) {
        if (pos.x <= 2) setShowSnapHint("left");
        else if (pos.x >= window.innerWidth - 2) setShowSnapHint("right");
        else if (pos.y <= 2) setShowSnapHint("top");
        else setShowSnapHint(null);
      }
    };

    const handleUp = (e: MouseEvent | TouchEvent) => {
      setIsDragging(false);
      setShowSnapHint(null);
      const pos = getPointerPos(e);
      dragRef.current = null;

      // Snap to edge (desktop only)
      if (!("touches" in e)) {
        if (pos.x <= 2) {
          moveWindow(win.id, 0, 32);
          resizeWindow(win.id, window.innerWidth / 2, window.innerHeight - 32 - 80);
        } else if (pos.x >= window.innerWidth - 2) {
          moveWindow(win.id, window.innerWidth / 2, 32);
          resizeWindow(win.id, window.innerWidth / 2, window.innerHeight - 32 - 80);
        } else if (pos.y <= 2) {
          maximizeWindow(win.id);
        }
      }
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleMove, { passive: true });
    document.addEventListener("touchend", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, win.id, moveWindow, resizeWindow, maximizeWindow]);

  // ─── Resize handling (desktop only) ───
  const handleResizeStart = useCallback((e: React.MouseEvent, dir: ResizeDir) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    resizeRef.current = {
      startX: e.clientX, startY: e.clientY,
      winX: win.x, winY: win.y, winW: win.width, winH: win.height, dir,
    };
    setIsResizing(true);
  }, [win.id, win.x, win.y, win.width, win.height, focusWindow]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const { startX, startY, winX, winY, winW, winH, dir } = resizeRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const minW = 320;
      const minH = 240;
      let newX = winX, newY = winY, newW = winW, newH = winH;

      if (dir?.includes("e")) newW = Math.max(minW, winW + dx);
      if (dir?.includes("w")) { newW = Math.max(minW, winW - dx); if (newW > minW) newX = winX + dx; }
      if (dir?.includes("s")) newH = Math.max(minH, winH + dy);
      if (dir?.includes("n")) { newH = Math.max(minH, winH - dy); if (newH > minH) newY = Math.max(32, winY + dy); }

      moveWindow(win.id, newX, newY);
      resizeWindow(win.id, newW, newH);
    };
    const handleUp = () => { setIsResizing(false); resizeRef.current = null; };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
  }, [isResizing, win.id, moveWindow, resizeWindow]);

  if (win.isMinimized) return null;

  const style = win.isMaximized
    ? { top: 32, left: 0, width: "100vw", height: "calc(100vh - 32px - 80px)", zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  const resizeEdgeClass = "absolute z-10";

  // Touch-friendly button sizes
  const btnSize = isTouchCapable ? "w-5 h-5" : "w-3 h-3";
  const btnIconSize = isTouchCapable ? "w-3 h-3" : "w-2 h-2";
  const btnMaxIconSize = isTouchCapable ? "w-2.5 h-2.5" : "w-1.5 h-1.5";

  return (
    <>
      {/* Snap hint overlay */}
      {showSnapHint && (
        <div
          className="fixed z-[99990] border-2 border-cyan-400/40 rounded-xl bg-cyan-400/5 transition-all duration-200 pointer-events-none"
          style={{
            top: 32,
            left: showSnapHint === "right" ? "50%" : 0,
            width: showSnapHint === "top" ? "100vw" : "50vw",
            height: "calc(100vh - 32px - 80px)",
          }}
        />
      )}

      <motion.div
        data-window
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`fixed overflow-hidden ${win.isMaximized ? "" : "rounded-xl"} ${win.isFocused ? "glow-border" : "glass"} ${(isDragging || isResizing) ? "select-none" : ""}`}
        style={style}
        onMouseDown={() => focusWindow(win.id)}
        onTouchStart={() => focusWindow(win.id)}
        role="dialog"
        aria-label={win.title}
      >
        {/* Resize handles (desktop only, not maximized) */}
        {!win.isMaximized && !isTouchCapable && (
          <>
            <div className={`${resizeEdgeClass} top-0 left-2 right-2 h-1.5 cursor-n-resize`} onMouseDown={e => handleResizeStart(e, "n")} />
            <div className={`${resizeEdgeClass} bottom-0 left-2 right-2 h-1.5 cursor-s-resize`} onMouseDown={e => handleResizeStart(e, "s")} />
            <div className={`${resizeEdgeClass} left-0 top-2 bottom-2 w-1.5 cursor-w-resize`} onMouseDown={e => handleResizeStart(e, "w")} />
            <div className={`${resizeEdgeClass} right-0 top-2 bottom-2 w-1.5 cursor-e-resize`} onMouseDown={e => handleResizeStart(e, "e")} />
            <div className={`${resizeEdgeClass} top-0 left-0 w-4 h-4 cursor-nw-resize`} onMouseDown={e => handleResizeStart(e, "nw")} />
            <div className={`${resizeEdgeClass} top-0 right-0 w-4 h-4 cursor-ne-resize`} onMouseDown={e => handleResizeStart(e, "ne")} />
            <div className={`${resizeEdgeClass} bottom-0 left-0 w-4 h-4 cursor-sw-resize`} onMouseDown={e => handleResizeStart(e, "sw")} />
            <div className={`${resizeEdgeClass} bottom-0 right-0 w-4 h-4 cursor-se-resize`} onMouseDown={e => handleResizeStart(e, "se")} />
          </>
        )}

        {/* Title bar */}
        <div
          className="flex items-center h-10 px-3 glass-heavy cursor-default select-none border-b border-white/[0.06]"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={() => win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
        >
          {/* Traffic light buttons */}
          <div className={`flex items-center ${isTouchCapable ? "gap-2" : "gap-1.5"} no-drag mr-3`}>
            <button
              onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
              className={`${btnSize} rounded-full bg-red-500/80 hover:bg-red-500 active:bg-red-600 transition-colors flex items-center justify-center group`}
              aria-label="Close window"
            >
              <X className={`${btnIconSize} text-red-900 opacity-0 group-hover:opacity-100 transition-opacity`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
              className={`${btnSize} rounded-full bg-yellow-500/80 hover:bg-yellow-500 active:bg-yellow-600 transition-colors flex items-center justify-center group`}
              aria-label="Minimize window"
            >
              <Minus className={`${btnIconSize} text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id); }}
              className={`${btnSize} rounded-full bg-green-500/80 hover:bg-green-500 active:bg-green-600 transition-colors flex items-center justify-center group`}
              aria-label={win.isMaximized ? "Restore window" : "Maximize window"}
            >
              <Maximize2 className={`${btnMaxIconSize} text-green-900 opacity-0 group-hover:opacity-100 transition-opacity`} />
            </button>
          </div>

          {/* Title */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
            {appIcons[win.icon] || null}
            <span className="text-xs font-medium text-foreground/70 truncate font-[family-name:var(--font-display)]">
              {win.title}
            </span>
          </div>

          {/* Spacer to balance traffic lights */}
          <div className={isTouchCapable ? "w-20" : "w-16"} />
        </div>

        {/* Window content — momentum scroll on touch */}
        <div
          className="glass overflow-auto scroll-container"
          style={{ height: "calc(100% - 40px)" }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
