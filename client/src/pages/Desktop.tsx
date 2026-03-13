import { WindowProvider, useWindows } from "@/contexts/WindowContext";
import Window from "@/components/Window";
import TopBar from "@/components/TopBar";
import Dock from "@/components/Dock";
import TerminalApp from "@/components/apps/TerminalApp";
import CouncilApp from "@/components/apps/CouncilApp";
import FilesApp from "@/components/apps/FilesApp";
import MailApp from "@/components/apps/MailApp";
import CalendarApp from "@/components/apps/CalendarApp";
import SettingsApp from "@/components/apps/SettingsApp";
import BrowserApp from "@/components/apps/BrowserApp";
import NotesApp from "@/components/apps/NotesApp";
import SystemMonitorApp from "@/components/apps/SystemMonitorApp";
import GovernanceApp from "@/components/apps/GovernanceApp";
import MemoryApp from "@/components/apps/MemoryApp";
import VaultApp from "@/components/apps/VaultApp";
import RouterApp from "@/components/apps/RouterApp";
import TaipApp from "@/components/apps/TaipApp";
import ContextMenu from "@/components/ContextMenu";
import AppLauncher from "@/components/AppLauncher";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const WALLPAPER_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032278456/Hh5ewk9S7tZhGC5LJu4CmG/aluminum-wallpaper-main_9ae15f6a.png";

const appComponents: Record<string, React.FC> = {
  terminal: TerminalApp,
  council: CouncilApp,
  files: FilesApp,
  mail: MailApp,
  calendar: CalendarApp,
  settings: SettingsApp,
  browser: BrowserApp,
  notes: NotesApp,
  sysmonitor: SystemMonitorApp,
  governance: GovernanceApp,
  memory: MemoryApp,
  vault: VaultApp,
  router: RouterApp,
  taip: TaipApp,
};

const bootSteps = [
  { text: "Initializing kernel...", duration: 150 },
  { text: "Loading AluminumKernel...", duration: 200 },
  { text: "Connecting providers: Google...", duration: 180 },
  { text: "Connecting providers: Microsoft...", duration: 180 },
  { text: "Connecting providers: Apple...", duration: 150 },
  { text: "Ring 0 — Forge Core initialized", duration: 150 },
  { text: "Ring 1 — Inference Engine online", duration: 150 },
  { text: "Ring 2 — SHELDONBRAIN memory loaded", duration: 150 },
  { text: "Ring 3 — Pantheon Council quorum achieved", duration: 200 },
  { text: "Ring 4 — Noosphere experience layer ready", duration: 200 },
  { text: "Starting Obsidian Glass UI...", duration: 300 },
  { text: "Welcome, Daavud.", duration: 400 },
];

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [providerStatus, setProviderStatus] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    bootSteps.forEach((s, i) => {
      timers.push(setTimeout(() => setStep(i), elapsed));
      elapsed += s.duration;
    });
    [0, 1, 2, 3, 4].forEach((idx, i) => {
      timers.push(setTimeout(() => {
        setProviderStatus(prev => { const next = [...prev]; next[idx] = true; return next; });
      }, 400 + i * 180));
    });
    timers.push(setTimeout(onComplete, elapsed + 300));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min(((step + 1) / bootSteps.length) * 100, 100);
  const providers = ["Google", "Microsoft", "Apple", "Android", "Chrome"];
  const providerColors = ["#4285F4", "#0078D4", "#999", "#3DDC84", "#4285F4"];

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[99999] bg-[#060610] flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }}
        />
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-col items-center relative z-10"
      >
        <motion.div
          animate={{ boxShadow: ["0 0 30px rgba(0,212,255,0.2)", "0 0 60px rgba(0,212,255,0.3)", "0 0 30px rgba(0,212,255,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center mb-6 border border-cyan-500/20"
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663032278456/Hh5ewk9S7tZhGC5LJu4CmG/aluminum-logo_a619fe4a.png"
            alt="Aluminum OS"
            className="w-12 h-12 rounded-lg"
          />
        </motion.div>
        <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-foreground/90 text-glow mb-1">
          Aluminum OS
        </h1>
        <p className="text-[10px] text-foreground/30 mb-6 font-[family-name:var(--font-mono)]">Obsidian Glass Edition — v1.0.0</p>
        <div className="flex items-center gap-4 mb-6">
          {providers.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: providerStatus[i] ? 1 : 0.3 }}
              className="flex flex-col items-center gap-1"
            >
              <motion.div
                animate={providerStatus[i] ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="w-2 h-2 rounded-full"
                style={{ background: providerStatus[i] ? providerColors[i] : "rgba(255,255,255,0.2)" }}
              />
              <span className="text-[8px] text-foreground/30">{p}</span>
            </motion.div>
          ))}
        </div>
        <div className="w-72 h-1 rounded-full bg-white/5 overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #00d4ff, #0078D4)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] text-foreground/40 font-[family-name:var(--font-mono)] h-4">
          {bootSteps[step]?.text}
        </p>
      </motion.div>
    </motion.div>
  );
}

function DesktopWidgets() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="absolute top-12 right-6 flex flex-col gap-3 z-10 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-light rounded-xl px-4 py-3 text-right"
      >
        <p className="text-2xl font-light text-foreground/70 font-[family-name:var(--font-display)] tabular-nums">
          {time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </p>
        <p className="text-[10px] text-foreground/30">
          {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-light rounded-xl px-4 py-3"
      >
        <p className="text-[9px] uppercase tracking-wider text-foreground/25 font-[family-name:var(--font-display)] mb-1.5">System</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[10px] text-foreground/35">Providers</span>
            <span className="text-[10px] text-green-400/70 font-[family-name:var(--font-mono)]">5/5 online</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[10px] text-foreground/35">Council</span>
            <span className="text-[10px] text-cyan-400/70 font-[family-name:var(--font-mono)]">8/8 active</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[10px] text-foreground/35">Wishes</span>
            <span className="text-[10px] text-foreground/50 font-[family-name:var(--font-mono)]">110/110</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DesktopContent() {
  const { windows } = useWindows();

  return (
    <div
      className="fixed inset-0"
      style={{
        backgroundImage: `url(${WALLPAPER_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <TopBar />
      <DesktopWidgets />
      <AnimatePresence>
        {windows.map(win => {
          const AppComponent = appComponents[win.appId];
          if (!AppComponent) return null;
          return (
            <Window key={win.id} window={win}>
              <AppComponent />
            </Window>
          );
        })}
      </AnimatePresence>
      <Dock />
      <ContextMenu />
      <AppLauncher />
    </div>
  );
}

export default function Desktop() {
  const [booted, setBooted] = useState(false);
  const handleBootComplete = useCallback(() => setBooted(true), []);

  return (
    <WindowProvider>
      <AnimatePresence mode="wait">
        {!booted && <BootScreen key="boot" onComplete={handleBootComplete} />}
      </AnimatePresence>
      {booted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DesktopContent />
        </motion.div>
      )}
    </WindowProvider>
  );
}
