import { motion, AnimatePresence } from "framer-motion";
import { Search, Wifi, Battery, Volume2, BellDot } from "lucide-react";
import { useState, useEffect } from "react";

const councilDots = [
  { name: "Manus", color: "#00d4ff", status: "Active" },
  { name: "Claude", color: "#ff6b35", status: "Active" },
  { name: "Gemini", color: "#00ff88", status: "Active" },
  { name: "Copilot", color: "#9b59b6", status: "Active" },
  { name: "Grok", color: "#ff4444", status: "Active" },
  { name: "GPT", color: "#ffd700", status: "Timeout" },
  { name: "Daavud", color: "#ffffff", status: "Sovereign" },
];

export default function TopBar() {
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  // Trigger AppLauncher via Ctrl+K
  const handleSearchClick = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  };

  return (
    <>
      <motion.div
        data-topbar
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 h-8 z-[9998] glass-heavy flex items-center px-3"
      >
        {/* Left: Logo + App Menu */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">A</span>
            </div>
            <span className="text-[11px] font-semibold text-foreground/90 font-[family-name:var(--font-display)]">
              Aluminum OS
            </span>
          </div>
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-white/5 transition-colors"
          >
            <Search className="w-3 h-3 text-foreground/50" />
            <span className="text-[10px] text-foreground/40">Search everything...</span>
            <kbd className="text-[8px] text-foreground/20 bg-white/5 px-1 py-0.5 rounded ml-1 border border-white/[0.06]">⌘K</kbd>
          </button>
        </div>

        {/* Center: Date & Time */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-foreground/70">{formatDate(time)}</span>
          <span className="text-[11px] font-semibold text-foreground/90 font-[family-name:var(--font-mono)]">
            {formatTime(time)}
          </span>
        </div>

        {/* Right: System Tray + Council Dots */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Council dots */}
          <div className="flex items-center gap-0.5 mr-2 relative">
            {councilDots.map((dot) => (
              <motion.div
                key={dot.name}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: dot.status === "Timeout" ? [0.3, 0.5, 0.3] : [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="w-1.5 h-1.5 rounded-full cursor-pointer"
                style={{ background: dot.color }}
                onMouseEnter={() => setHoveredDot(dot.name)}
                onMouseLeave={() => setHoveredDot(null)}
              />
            ))}
            {/* Council dot tooltip */}
            <AnimatePresence>
              {hoveredDot && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-7 right-0 glass-heavy rounded-lg px-2.5 py-1.5 border border-white/[0.08] whitespace-nowrap z-50"
                >
                  <p className="text-[10px] font-medium" style={{ color: councilDots.find(d => d.name === hoveredDot)?.color }}>
                    {hoveredDot}
                  </p>
                  <p className="text-[9px] text-foreground/40">
                    {councilDots.find(d => d.name === hoveredDot)?.status}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification bell */}
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-5 h-5 flex items-center justify-center rounded hover:bg-white/5 transition-colors"
          >
            <BellDot className="w-3.5 h-3.5 text-foreground/50" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </button>

          {/* System icons */}
          <Wifi className="w-3.5 h-3.5 text-foreground/50" />
          <Volume2 className="w-3.5 h-3.5 text-foreground/50" />
          <div className="flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-foreground/50" />
            <span className="text-[10px] text-foreground/50">100%</span>
          </div>
        </div>
      </motion.div>

      {/* Notification panel */}
      <AnimatePresence>
        {showNotifs && (
          <>
            <div className="fixed inset-0 z-[9997]" onClick={() => setShowNotifs(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-9 right-3 w-72 z-[9999] glass-heavy rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl"
            >
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <h3 className="text-[11px] font-semibold text-foreground/80 font-[family-name:var(--font-display)]">Notifications</h3>
              </div>
              <div className="p-2 space-y-1 max-h-80 overflow-auto">
                {[
                  { title: "Copilot validated architecture", time: "2m ago", color: "#9b59b6" },
                  { title: "Grok review: Contrarian analysis complete", time: "5m ago", color: "#ff4444" },
                  { title: "Gemini synthesis: 8.3/10 average", time: "12m ago", color: "#00ff88" },
                  { title: "GitHub push: 237 files committed", time: "30m ago", color: "#00d4ff" },
                  { title: "GPT timeout expires in 2h", time: "1h ago", color: "#ffd700" },
                ].map((notif, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                    <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: notif.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-foreground/70">{notif.title}</p>
                      <p className="text-[9px] text-foreground/30">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-white/[0.06]">
                <button className="text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors">
                  Clear all
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
