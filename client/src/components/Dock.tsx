import { useWindows } from "@/contexts/WindowContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Terminal,
  FolderOpen,
  Mail,
  CalendarDays,
  Brain,
  Settings,
  Globe,
  StickyNote,
  Activity,
  Shield,
  Database,
  Archive,
  GitBranch,
  ScrollText,
  Cpu,
  TerminalSquare,
  Workflow,
  DollarSign,
} from "lucide-react";

export interface DockApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const dockApps: DockApp[] = [
  {
    id: "terminal",
    name: "Terminal",
    icon: <Terminal className="w-5 h-5" />,
    color: "#00d4ff",
    gradient: "from-cyan-500/40 to-cyan-700/20",
  },
  {
    id: "files",
    name: "Files",
    icon: <FolderOpen className="w-5 h-5" />,
    color: "#ffb347",
    gradient: "from-amber-400/40 to-orange-600/20",
  },
  {
    id: "mail",
    name: "Mail",
    icon: <Mail className="w-5 h-5" />,
    color: "#4285F4",
    gradient: "from-blue-400/40 to-blue-700/20",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: <CalendarDays className="w-5 h-5" />,
    color: "#00ff88",
    gradient: "from-emerald-400/40 to-green-700/20",
  },
  {
    id: "council",
    name: "AI Council",
    icon: <Brain className="w-5 h-5" />,
    color: "#9b59b6",
    gradient: "from-purple-400/40 to-violet-700/20",
  },
  {
    id: "settings",
    name: "Settings",
    icon: <Settings className="w-5 h-5" />,
    color: "#8899aa",
    gradient: "from-slate-400/40 to-slate-600/20",
  },
  {
    id: "browser",
    name: "Browser",
    icon: <Globe className="w-5 h-5" />,
    color: "#0078D4",
    gradient: "from-sky-400/40 to-indigo-600/20",
  },
  {
    id: "notes",
    name: "Notes",
    icon: <StickyNote className="w-5 h-5" />,
    color: "#ffd700",
    gradient: "from-yellow-400/40 to-amber-600/20",
  },
  {
    id: "sysmonitor",
    name: "System Monitor",
    icon: <Activity className="w-5 h-5" />,
    color: "#ff6b35",
    gradient: "from-orange-400/40 to-red-600/20",
  },
  {
    id: "governance",
    name: "Governance",
    icon: <Shield className="w-5 h-5" />,
    color: "#00ff88",
    gradient: "from-green-400/40 to-emerald-700/20",
  },
  {
    id: "memory",
    name: "SHELDONBRAIN",
    icon: <Database className="w-5 h-5" />,
    color: "#9b59b6",
    gradient: "from-violet-400/40 to-purple-700/20",
  },
  {
    id: "vault",
    name: "Atlas Vault",
    icon: <Archive className="w-5 h-5" />,
    color: "#e74c3c",
    gradient: "from-red-400/40 to-rose-700/20",
  },
  {
    id: "router",
    name: "Model Router",
    icon: <GitBranch className="w-5 h-5" />,
    color: "#00ff88",
    gradient: "from-emerald-400/40 to-teal-700/20",
  },
  {
    id: "taip",
    name: "TAIP Protocol",
    icon: <ScrollText className="w-5 h-5" />,
    color: "#d97706",
    gradient: "from-amber-500/40 to-orange-700/20",
  },
  {
    id: "forgecore",
    name: "Forge Core",
    icon: <Cpu className="w-5 h-5" />,
    color: "#ff4444",
    gradient: "from-red-500/40 to-orange-700/20",
  },
  {
    id: "agentshell",
    name: "Agent Shell",
    icon: <TerminalSquare className="w-5 h-5" />,
    color: "#00ffcc",
    gradient: "from-teal-400/40 to-cyan-700/20",
  },
  {
    id: "deerflow",
    name: "DeerFlow Research",
    icon: <Workflow className="w-5 h-5" />,
    color: "#7c3aed",
    gradient: "from-violet-500/40 to-purple-800/20",
  },
  {
    id: "costoptimizer",
    name: "Cost Optimizer",
    icon: <DollarSign className="w-5 h-5" />,
    color: "#22c55e",
    gradient: "from-green-500/40 to-emerald-800/20",
  },
];

export default function Dock() {
  const { openWindow, windows, focusWindow, restoreWindow } = useWindows();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = (app: DockApp) => {
    // Check if window is already open
    const existing = windows.find(w => w.appId === app.id);
    if (existing) {
      if (existing.isMinimized) {
        restoreWindow(existing.id);
      }
      focusWindow(existing.id);
      return;
    }

    const titles: Record<string, string> = {
      terminal: "Aluminum Terminal",
      files: "Files — alum://drive/",
      mail: "Universal Inbox",
      calendar: "Calendar",
      council: "AI Council — Pantheon",
      settings: "System Settings",
      browser: "Aluminum Browser",
      notes: "Notes",
      sysmonitor: "System Monitor — Ring Status",
      governance: "Governance — Constitutional Dashboard",
      memory: "SHELDONBRAIN — Memory Viewer",
      vault: "Atlas Vault — Artifact Gallery",
      router: "Model Router — 3-Tier Inference",
      taip: "TAIP — Trained Adult Instance Protocol",
      forgecore: "Forge Core — Ring 0 Kernel Viewer",
      agentshell: "Universal Agent Shell",
      deerflow: "DeerFlow — Multi-Agent Research",
      costoptimizer: "Cost Optimizer — Spend Governance",
    };
    const sizes: Record<string, [number, number]> = {
      terminal: [850, 500],
      council: [950, 650],
      browser: [1000, 650],
      settings: [750, 550],
      sysmonitor: [900, 600],
      governance: [900, 600],
      memory: [900, 600],
      vault: [950, 650],
      router: [900, 600],
      taip: [850, 600],
      forgecore: [950, 650],
      agentshell: [1000, 650],
      deerflow: [950, 650],
      costoptimizer: [950, 600],
    };
    const [w, h] = sizes[app.id] || [800, 550];
    openWindow(app.id, titles[app.id] || app.name, app.id, w, h);
  };

  return (
    <motion.div
      data-dock
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]"
    >
      <div className="glass-heavy rounded-2xl px-3 py-2 flex items-end gap-1.5 border border-white/[0.08]">
        {dockApps.map((app, i) => {
          const isOpen = windows.some(w => w.appId === app.id);
          const isMinimized = windows.some(w => w.appId === app.id && w.isMinimized);
          const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - i) : 999;
          const scale = hoveredIndex !== null
            ? distance === 0 ? 1.45 : distance === 1 ? 1.15 : 1
            : 1;

          return (
            <motion.button
              key={app.id}
              animate={{ scale, y: scale > 1 ? -(scale - 1) * 24 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(app)}
              className="relative flex flex-col items-center group"
            >
              <div
                className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-200 bg-gradient-to-br ${app.gradient} border border-white/[0.06] ${isMinimized ? "opacity-60" : ""}`}
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
              <AnimatePresence>
                {hoveredIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -top-9 px-2.5 py-1 rounded-lg glass-heavy text-[11px] font-medium text-foreground/90 whitespace-nowrap font-[family-name:var(--font-display)] border border-white/[0.08]"
                  >
                    {app.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
