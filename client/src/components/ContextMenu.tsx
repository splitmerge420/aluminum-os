import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Layout, Palette, Monitor, Info, Terminal, FolderOpen, Settings, Cpu, Activity, Shield, Archive, ScrollText, TerminalSquare } from "lucide-react";
import { useWindows } from "@/contexts/WindowContext";

interface MenuPosition {
  x: number;
  y: number;
}

export default function ContextMenu() {
  const [pos, setPos] = useState<MenuPosition | null>(null);
  const { openWindow } = useWindows();

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only show on desktop background, not on windows or dock
    if (target.closest('[data-window]') || target.closest('[data-dock]') || target.closest('[data-topbar]')) return;
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleClick = useCallback(() => setPos(null), []);

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [handleContextMenu, handleClick]);

  const menuItems = [
    { label: "Open Terminal", icon: <Terminal className="w-3.5 h-3.5" />, action: () => openWindow("terminal", "Aluminum Terminal", "terminal") },
    { label: "Open Files", icon: <FolderOpen className="w-3.5 h-3.5" />, action: () => openWindow("files", "Files", "files") },
    { label: "Open AI Council", icon: <Cpu className="w-3.5 h-3.5" />, action: () => openWindow("council", "AI Council — Pantheon", "council") },
    { label: "System Monitor", icon: <Activity className="w-3.5 h-3.5" />, action: () => openWindow("sysmonitor", "System Monitor", "sysmonitor") },
    { label: "Governance", icon: <Shield className="w-3.5 h-3.5" />, action: () => openWindow("governance", "Governance", "governance") },
    { label: "Atlas Vault", icon: <Archive className="w-3.5 h-3.5" />, action: () => openWindow("vault", "Atlas Vault", "vault") },
    { label: "TAIP Protocol", icon: <ScrollText className="w-3.5 h-3.5" />, action: () => openWindow("taip", "TAIP Protocol", "taip") },
    { label: "Forge Core", icon: <Cpu className="w-3.5 h-3.5" />, action: () => openWindow("forgecore", "Forge Core — Ring 0", "forgecore") },
    { label: "Agent Shell", icon: <TerminalSquare className="w-3.5 h-3.5" />, action: () => openWindow("agentshell", "Universal Agent Shell", "agentshell", 1000, 650) },
    "divider" as const,
    { label: "Change Wallpaper", icon: <Palette className="w-3.5 h-3.5" />, action: () => openWindow("settings", "Settings", "settings") },
    { label: "Display Settings", icon: <Monitor className="w-3.5 h-3.5" />, action: () => openWindow("settings", "Settings", "settings") },
    { label: "Arrange Windows", icon: <Layout className="w-3.5 h-3.5" />, action: () => {} },
    { label: "Refresh", icon: <RefreshCw className="w-3.5 h-3.5" />, action: () => window.location.reload() },
    "divider" as const,
    { label: "About Aluminum OS", icon: <Info className="w-3.5 h-3.5" />, action: () => openWindow("settings", "Settings", "settings") },
  ];

  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.12 }}
          className="fixed z-[99999] glass-heavy rounded-xl border border-white/[0.08] py-1.5 px-1 min-w-[200px] shadow-2xl"
          style={{ left: pos.x, top: pos.y }}
        >
          {menuItems.map((item, i) =>
            item === "divider" ? (
              <div key={i} className="my-1 mx-2 border-t border-white/[0.06]" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  (item as any).action();
                  setPos(null);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-foreground/70 hover:bg-white/8 hover:text-foreground/90 transition-colors"
              >
                <span className="text-foreground/40">{(item as any).icon}</span>
                <span>{(item as any).label}</span>
              </button>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
