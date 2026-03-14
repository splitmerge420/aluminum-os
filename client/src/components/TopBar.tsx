/*
 * TopBar — Cross-platform adaptive status bar
 * macOS: menu bar feel, ⌘K shortcut display
 * Windows: taskbar tray feel, Ctrl+K shortcut display
 * ChromeOS: shelf-adjacent, clean
 * iOS: respects safe-area-inset-top, larger touch targets
 * Android/Pixel: status bar integration, Material-like touch targets
 * All: keyboard accessible, screen reader labels, responsive collapse
 */
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wifi, Battery, Volume2, BellDot, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { usePlatform, useModifierKey } from "@/hooks/usePlatform";

const councilDots = [
  { name: "Manus", color: "#00d4ff", status: "Builder" },
  { name: "Claude", color: "#ff6b35", status: "Active" },
  { name: "Gemini", color: "#00ff88", status: "Active" },
  { name: "Copilot", color: "#9b59b6", status: "Active" },
  { name: "Grok", color: "#ff4444", status: "Active" },
  { name: "GPT", color: "#ffd700", status: "Timeout" },
  { name: "DeepSeek", color: "#ff8800", status: "Active" },
  { name: "Qwen3", color: "#00aaff", status: "Active" },
  { name: "Gangaseek", color: "#e6b800", status: "Active" },
  { name: "Jinnseek", color: "#cc66ff", status: "Active" },
  { name: "Daavud", color: "#ffffff", status: "Sovereign" },
];

export default function TopBar() {
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const { isMobile, hasHover, isTouchDevice } = usePlatform();
  const modKey = useModifierKey();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  // Stable random delays for council dot animations
  const dotAnimations = useMemo(() =>
    councilDots.map(() => ({
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    })), []
  );

  const handleSearchClick = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  };

  // Touch-friendly sizes
  const barHeight = isMobile ? "h-10" : "h-8";
  const touchPad = isTouchDevice ? "min-h-[44px]" : "";

  return (
    <>
      <motion.div
        data-topbar
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 ${barHeight} z-[9998] glass-heavy flex items-center px-3`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        role="banner"
        aria-label="Aluminum OS status bar"
      >
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">A</span>
            </div>
            {!isMobile && (
              <span className="text-[11px] font-semibold text-foreground/90 font-[family-name:var(--font-display)]">
                Aluminum OS
              </span>
            )}
          </div>
          <button
            onClick={handleSearchClick}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 active:bg-white/10 transition-colors ${touchPad}`}
            aria-label="Search everything"
          >
            <Search className="w-3.5 h-3.5 text-foreground/50" />
            {!isMobile && (
              <>
                <span className="text-[10px] text-foreground/40 hidden sm:inline">Search...</span>
                <kbd className="text-[8px] text-foreground/20 bg-white/5 px-1 py-0.5 rounded ml-1 border border-white/[0.06] hidden md:inline">
                  {modKey}K
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Center: Date & Time */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {!isMobile && (
            <span className="text-[11px] font-medium text-foreground/70">{formatDate(time)}</span>
          )}
          <span className="text-[11px] font-semibold text-foreground/90 font-[family-name:var(--font-mono)] tabular-nums">
            {formatTime(time)}
          </span>
        </div>

        {/* Right: Council Dots + System Tray */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end min-w-0">
          {/* Council dots — responsive: show fewer on small screens */}
          <div className="flex items-center gap-0.5 mr-1 sm:mr-2 relative">
            {councilDots.map((dot, idx) => (
              <motion.button
                key={dot.name}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: dot.status === "Timeout" ? [0.3, 0.5, 0.3] : [0.6, 1, 0.6],
                }}
                transition={{
                  duration: dotAnimations[idx].duration,
                  repeat: Infinity,
                  delay: dotAnimations[idx].delay,
                }}
                className="w-1.5 h-1.5 rounded-full p-0 border-0 bg-transparent"
                style={{ background: dot.color }}
                onMouseEnter={hasHover ? () => setHoveredDot(dot.name) : undefined}
                onMouseLeave={hasHover ? () => setHoveredDot(null) : undefined}
                onClick={isTouchDevice ? () => setHoveredDot(hoveredDot === dot.name ? null : dot.name) : undefined}
                aria-label={`${dot.name}: ${dot.status}`}
              />
            ))}
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
            className={`relative flex items-center justify-center rounded hover:bg-white/5 active:bg-white/10 transition-colors ${isTouchDevice ? "w-8 h-8" : "w-5 h-5"}`}
            aria-label="Notifications"
            aria-expanded={showNotifs}
          >
            <BellDot className="w-3.5 h-3.5 text-foreground/50" />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </button>

          {/* System icons — hide some on mobile */}
          {!isMobile && (
            <>
              <Wifi className="w-3.5 h-3.5 text-foreground/50 flex-shrink-0" aria-label="Wi-Fi connected" />
              <Volume2 className="w-3.5 h-3.5 text-foreground/50 flex-shrink-0" aria-label="Volume" />
            </>
          )}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Battery className="w-3.5 h-3.5 text-foreground/50" aria-label="Battery" />
            {!isMobile && <span className="text-[10px] text-foreground/50 tabular-nums">100%</span>}
          </div>
        </div>
      </motion.div>

      {/* Notification panel — responsive width, touch-friendly items */}
      <AnimatePresence>
        {showNotifs && (
          <>
            <div className="fixed inset-0 z-[9997]" onClick={() => setShowNotifs(false)} aria-hidden="true" />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`fixed z-[9999] glass-heavy rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl ${
                isMobile ? "top-11 left-3 right-3" : "top-9 right-3 w-80"
              }`}
              role="dialog"
              aria-label="Notifications panel"
            >
              <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="text-xs font-semibold text-foreground/80 font-[family-name:var(--font-display)]">Notifications</h3>
                <button
                  onClick={() => setShowNotifs(false)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="w-3 h-3 text-foreground/40" />
                </button>
              </div>
              <div className="p-2 space-y-0.5 max-h-80 overflow-auto scroll-container">
                {[
                  { title: "Copilot validated architecture", time: "2m ago", color: "#9b59b6" },
                  { title: "Grok review: Contrarian analysis complete", time: "5m ago", color: "#ff4444" },
                  { title: "Gemini synthesis: 8.3/10 average", time: "12m ago", color: "#00ff88" },
                  { title: "Claude analysis: 0 conflicts, 6 new primitives", time: "15m ago", color: "#ff6b35" },
                  { title: "Manus Wish List: 60 wishes loaded", time: "20m ago", color: "#00d4ff" },
                  { title: "GPT timeout expires in 2h", time: "1h ago", color: "#ffd700" },
                ].map((notif, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 rounded-lg hover:bg-white/5 active:bg-white/8 transition-colors cursor-default ${
                      isTouchDevice ? "p-3" : "p-2"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: notif.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-foreground/70 leading-snug">{notif.title}</p>
                      <p className="text-[9px] text-foreground/30 mt-0.5">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-white/[0.06]">
                <button className="text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors py-1">
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
