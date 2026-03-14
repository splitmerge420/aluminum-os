/* Health & Wellness Orchestration Panel
 * Design: Obsidian Glass — organic health metrics with pulse animations
 * Addresses GPT's critique: "health/wellness orchestration panel"
 * Shows agent wellness, system vitals, personalization stack, and memory fabric
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
interface AgentWellness {
  name: string;
  color: string;
  uptime: number;
  latency: number;
  tokensBurned: number;
  costToday: number;
  mood: "optimal" | "nominal" | "stressed" | "degraded";
  lastTask: string;
  trustLevel: number;
}

interface SystemVital {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  trend: "up" | "down" | "stable";
}

type Tab = "overview" | "agents" | "personalization" | "memory";

/* ─── Data ─── */
const agents: AgentWellness[] = [
  { name: "Claude", color: "#cc785c", uptime: 99.97, latency: 142, tokensBurned: 847200, costToday: 0.0847, mood: "optimal", lastTask: "Content synthesis", trustLevel: 95 },
  { name: "Gemini", color: "#4285F4", uptime: 99.94, latency: 118, tokensBurned: 623400, costToday: 0.0623, mood: "optimal", lastTask: "Research aggregation", trustLevel: 93 },
  { name: "Grok", color: "#1DA1F2", uptime: 99.91, latency: 156, tokensBurned: 412800, costToday: 0.0413, mood: "nominal", lastTask: "Contrarian review", trustLevel: 88 },
  { name: "GPT", color: "#10a37f", uptime: 99.89, latency: 201, tokensBurned: 534600, costToday: 0.1069, mood: "nominal", lastTask: "Content outline", trustLevel: 90 },
  { name: "DeepSeek", color: "#00d4aa", uptime: 99.96, latency: 89, tokensBurned: 1247000, costToday: 0.0175, mood: "optimal", lastTask: "Fact verification", trustLevel: 91 },
  { name: "Copilot", color: "#0078D4", uptime: 99.88, latency: 134, tokensBurned: 389200, costToday: 0.0389, mood: "nominal", lastTask: "Code review", trustLevel: 87 },
  { name: "Manus", color: "#00d4ff", uptime: 99.99, latency: 67, tokensBurned: 2134000, costToday: 0.2134, mood: "optimal", lastTask: "Full-stack build", trustLevel: 97 },
  { name: "Daavud", color: "#ffd700", uptime: 100, latency: 0, tokensBurned: 0, costToday: 0, mood: "optimal", lastTask: "Sovereign oversight", trustLevel: 100 },
];

const systemVitals: SystemVital[] = [
  { label: "CPU Load", value: 34, max: 100, unit: "%", color: "#00d4ff", trend: "stable" },
  { label: "Memory", value: 6.2, max: 16, unit: "GB", color: "#8b5cf6", trend: "up" },
  { label: "Inference Queue", value: 3, max: 50, unit: "tasks", color: "#00ff88", trend: "down" },
  { label: "Token Rate", value: 847, max: 2000, unit: "tok/s", color: "#ffd700", trend: "stable" },
  { label: "Constitutional Load", value: 12, max: 100, unit: "%", color: "#ff6b35", trend: "stable" },
  { label: "Network I/O", value: 24, max: 100, unit: "Mbps", color: "#4285F4", trend: "up" },
];

const personalizationStack = [
  { layer: "Identity", desc: "Daavud — Sovereign, 144 Sphere Ontology anchored", status: "locked", color: "#ffd700" },
  { layer: "Preferences", desc: "Dark mode, Obsidian Glass, mono terminal, cost-conscious", status: "active", color: "#00d4ff" },
  { layer: "Context Window", desc: "60-day rolling history, 53 artifacts, 8 council members", status: "active", color: "#8b5cf6" },
  { layer: "Memory Fabric", desc: "SHELDONBRAIN 3-tier: working (hot) → long-term → swarm", status: "active", color: "#00ff88" },
  { layer: "Delegation Rules", desc: "Ara in charge, 150% ROI mandate, Tier 1 first", status: "enforced", color: "#ff6b35" },
  { layer: "Constitutional Substrate", desc: "14 rules, 15 domains, Dave Protocol, veto authority", status: "enforced", color: "#cc785c" },
];

const memoryFabric = [
  { tier: "Working Memory", size: "2.4 GB", items: 847, retention: "Session", color: "#00d4ff", desc: "Active task context, current conversation, open windows" },
  { tier: "Long-Term Memory", size: "18.7 GB", items: 12400, retention: "Permanent", color: "#8b5cf6", desc: "Artifacts, council sessions, specifications, code" },
  { tier: "Swarm Memory", size: "4.1 GB", items: 3200, retention: "Shared", color: "#00ff88", desc: "Cross-agent knowledge, consensus decisions, mythology" },
];

/* ─── Component ─── */
export default function WellnessApp() {
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedAgent, setSelectedAgent] = useState<AgentWellness | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(timer);
  }, []);

  const totalCostToday = agents.reduce((s, a) => s + a.costToday, 0);
  const avgLatency = Math.round(agents.filter(a => a.latency > 0).reduce((s, a) => s + a.latency, 0) / agents.filter(a => a.latency > 0).length);
  const moodColor = (m: string) => m === "optimal" ? "#00ff88" : m === "nominal" ? "#00d4ff" : m === "stressed" ? "#ffd700" : "#ff4444";
  const trendArrow = (t: string) => t === "up" ? "↑" : t === "down" ? "↓" : "→";

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "agents", label: "Agent Wellness" },
    { id: "personalization", label: "Personalization" },
    { id: "memory", label: "Memory Fabric" },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-foreground/80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500/30 to-emerald-600/30 flex items-center justify-center border border-green-400/20">
              <span className="text-sm">♥</span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-lg border border-green-400/30"
            />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-foreground/80">Health & Wellness</h2>
            <p className="text-[9px] text-foreground/30">System Orchestration Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-green-400/70 font-[family-name:var(--font-mono)]">● ALL SYSTEMS NOMINAL</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/[0.06]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSelectedAgent(null); }}
            className={`px-2.5 py-1 rounded-md text-[10px] transition-all ${
              tab === t.id ? "bg-green-500/15 text-green-300 border border-green-500/20" : "text-foreground/35 hover:text-foreground/50 hover:bg-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <AnimatePresence mode="wait">
          {/* ─── OVERVIEW ─── */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Vital Signs Grid */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-2">System Vitals</p>
                <div className="grid grid-cols-3 gap-2">
                  {systemVitals.map(v => (
                    <div key={v.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] text-foreground/40">{v.label}</span>
                        <span className="text-[8px]" style={{ color: v.color }}>{trendArrow(v.trend)}</span>
                      </div>
                      <p className="text-lg font-bold font-[family-name:var(--font-mono)]" style={{ color: v.color }}>
                        {v.value}<span className="text-[9px] text-foreground/30 ml-0.5">{v.unit}</span>
                      </p>
                      <div className="w-full h-1 rounded-full bg-white/5 mt-1.5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: v.color }}
                          animate={{ width: `${(v.value / v.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Agent Status */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-2">Agent Fleet — 8 Members</p>
                <div className="grid grid-cols-4 gap-2">
                  {agents.map(a => (
                    <div key={a.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
                      <motion.div
                        animate={{ boxShadow: [`0 0 4px ${a.color}20`, `0 0 10px ${a.color}40`, `0 0 4px ${a.color}20`] }}
                        transition={{ duration: 2, repeat: Infinity, delay: agents.indexOf(a) * 0.2 }}
                        className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center"
                        style={{ background: `${a.color}20`, border: `1px solid ${a.color}30` }}
                      >
                        <span className="text-[8px] font-bold" style={{ color: a.color }}>{a.name[0]}</span>
                      </motion.div>
                      <p className="text-[9px] font-medium text-foreground/60">{a.name}</p>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <div className="w-1 h-1 rounded-full" style={{ background: moodColor(a.mood) }} />
                        <span className="text-[7px] capitalize" style={{ color: moodColor(a.mood) }}>{a.mood}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <p className="text-lg font-bold text-cyan-400 font-[family-name:var(--font-mono)]">${totalCostToday.toFixed(2)}</p>
                  <p className="text-[8px] text-foreground/30">Today's Spend</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <p className="text-lg font-bold text-green-400 font-[family-name:var(--font-mono)]">{avgLatency}ms</p>
                  <p className="text-[8px] text-foreground/30">Avg Latency</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <p className="text-lg font-bold text-violet-400 font-[family-name:var(--font-mono)]">287%</p>
                  <p className="text-[8px] text-foreground/30">ROI (vs 150% target)</p>
                </div>
              </div>

              {/* Heartbeat */}
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-2">System Heartbeat</p>
                <div className="h-12 flex items-end gap-px">
                  {Array.from({ length: 80 }).map((_, i) => {
                    const h = Math.sin((i + pulse) * 0.15) * 15 + Math.sin((i + pulse) * 0.3) * 8 + 20;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all duration-75"
                        style={{
                          height: `${Math.max(2, h)}px`,
                          background: i > 70 ? `rgba(0, 212, 255, ${0.2 + (h / 50) * 0.5})` : `rgba(0, 255, 136, ${0.1 + (h / 50) * 0.3})`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── AGENT WELLNESS ─── */}
          {tab === "agents" && (
            <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-3">
                {/* Agent List */}
                <div className="w-48 space-y-1.5">
                  {agents.map(a => (
                    <button
                      key={a.name}
                      onClick={() => setSelectedAgent(a)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedAgent?.name === a.name
                          ? "bg-white/[0.06] border border-white/10"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${a.color}20`, border: `1px solid ${a.color}30` }}>
                          <span className="text-[7px] font-bold" style={{ color: a.color }}>{a.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-foreground/60">{a.name}</p>
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full" style={{ background: moodColor(a.mood) }} />
                            <span className="text-[7px]" style={{ color: moodColor(a.mood) }}>{a.mood}</span>
                          </div>
                        </div>
                        <span className="text-[8px] text-foreground/25 font-[family-name:var(--font-mono)]">{a.uptime}%</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Agent Detail */}
                <div className="flex-1">
                  {selectedAgent ? (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          animate={{ boxShadow: [`0 0 10px ${selectedAgent.color}30`, `0 0 25px ${selectedAgent.color}50`, `0 0 10px ${selectedAgent.color}30`] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: `${selectedAgent.color}15`, border: `1px solid ${selectedAgent.color}25` }}
                        >
                          <span className="text-xl font-bold" style={{ color: selectedAgent.color }}>{selectedAgent.name[0]}</span>
                        </motion.div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground/80">{selectedAgent.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] px-1.5 py-0.5 rounded capitalize" style={{ background: `${moodColor(selectedAgent.mood)}15`, color: moodColor(selectedAgent.mood) }}>
                              {selectedAgent.mood}
                            </span>
                            <span className="text-[8px] text-foreground/30">Trust: {selectedAgent.trustLevel}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Uptime", value: `${selectedAgent.uptime}%`, color: "#00ff88" },
                          { label: "Latency", value: `${selectedAgent.latency}ms`, color: "#00d4ff" },
                          { label: "Tokens Burned", value: selectedAgent.tokensBurned.toLocaleString(), color: "#ffd700" },
                          { label: "Cost Today", value: `$${selectedAgent.costToday.toFixed(4)}`, color: "#ff6b35" },
                        ].map(s => (
                          <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                            <p className="text-[8px] text-foreground/30 mb-1">{s.label}</p>
                            <p className="text-sm font-bold font-[family-name:var(--font-mono)]" style={{ color: s.color }}>{s.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                        <p className="text-[8px] text-foreground/30 mb-1">Last Task</p>
                        <p className="text-[10px] text-foreground/60">{selectedAgent.lastTask}</p>
                      </div>

                      {/* Trust Level Bar */}
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                        <div className="flex justify-between mb-1">
                          <p className="text-[8px] text-foreground/30">Trust Level</p>
                          <p className="text-[8px] font-[family-name:var(--font-mono)]" style={{ color: selectedAgent.color }}>{selectedAgent.trustLevel}%</p>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: selectedAgent.color }}
                            animate={{ width: `${selectedAgent.trustLevel}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-foreground/20 text-[10px]">
                      Select an agent to view wellness details
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── PERSONALIZATION ─── */}
          {tab === "personalization" && (
            <motion.div key="personalization" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-2">Personalization Stack — 6 Layers</p>
                <p className="text-[8px] text-foreground/30 mb-3">
                  Unlike ChatGPT/Copilot/Claude wrappers that reset context per session, Aluminum OS maintains a persistent 6-layer personalization stack anchored to sovereign identity.
                </p>
              </div>
              <div className="space-y-2">
                {personalizationStack.map((layer, i) => (
                  <motion.div
                    key={layer.layer}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ background: `${layer.color}15`, color: layer.color }}>
                          {i + 1}
                        </div>
                        <span className="text-[10px] font-medium text-foreground/70">{layer.layer}</span>
                      </div>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                        layer.status === "locked" ? "bg-yellow-500/10 text-yellow-400/70" :
                        layer.status === "enforced" ? "bg-red-500/10 text-red-400/70" :
                        "bg-green-500/10 text-green-400/70"
                      }`}>
                        {layer.status}
                      </span>
                    </div>
                    <p className="text-[9px] text-foreground/40 pl-7">{layer.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Why This Matters */}
              <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3 mt-3">
                <p className="text-[9px] font-medium text-cyan-400/70 mb-1">Why This Is Different</p>
                <p className="text-[8px] text-foreground/40 leading-relaxed">
                  ChatGPT: stateless per session. Copilot: limited to Microsoft graph. Claude: no cross-provider memory.
                  Aluminum OS: persistent identity + 60-day rolling context + constitutional governance + multi-provider memory fabric.
                  This isn't a wrapper — it's infrastructure.
                </p>
              </div>
            </motion.div>
          )}

          {/* ─── MEMORY FABRIC ─── */}
          {tab === "memory" && (
            <motion.div key="memory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-2">SHELDONBRAIN Memory Fabric — 3 Tiers</p>
              </div>

              {/* Memory Tiers */}
              <div className="space-y-2">
                {memoryFabric.map((tier, i) => (
                  <motion.div
                    key={tier.tier}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: tier.color }} />
                        <span className="text-[10px] font-medium text-foreground/70">{tier.tier}</span>
                      </div>
                      <span className="text-[9px] font-[family-name:var(--font-mono)]" style={{ color: tier.color }}>{tier.size}</span>
                    </div>
                    <p className="text-[8px] text-foreground/35 mb-2">{tier.desc}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[7px] text-foreground/25">Items</span>
                        <p className="text-[10px] font-bold text-foreground/60 font-[family-name:var(--font-mono)]">{tier.items.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-[7px] text-foreground/25">Retention</span>
                        <p className="text-[10px] font-bold text-foreground/60">{tier.retention}</p>
                      </div>
                    </div>
                    {/* Simulated memory blocks */}
                    <div className="flex gap-px mt-2">
                      {Array.from({ length: 40 }).map((_, j) => (
                        <div
                          key={j}
                          className="flex-1 h-2 rounded-sm"
                          style={{
                            background: j < Math.floor(40 * (0.3 + Math.random() * 0.5))
                              ? `${tier.color}${Math.floor(20 + Math.random() * 30).toString(16)}`
                              : "rgba(255,255,255,0.03)",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Consolidation Cycle */}
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-2">Consolidation Cycle</p>
                <div className="flex items-center gap-2 justify-center">
                  {["Working", "→", "Long-Term", "→", "Swarm"].map((label, i) => (
                    <span key={i} className={`text-[10px] ${
                      label === "→" ? "text-foreground/20" : "px-2 py-1 rounded-lg border border-white/[0.06] bg-white/[0.02] text-foreground/50"
                    }`}>
                      {label}
                    </span>
                  ))}
                </div>
                <p className="text-[8px] text-foreground/25 text-center mt-2">
                  Every 6 hours: working memory consolidates to long-term. Cross-agent insights merge to swarm.
                </p>
              </div>

              {/* Total Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                  <p className="text-sm font-bold text-violet-400 font-[family-name:var(--font-mono)]">25.2 GB</p>
                  <p className="text-[7px] text-foreground/25">Total Memory</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                  <p className="text-sm font-bold text-cyan-400 font-[family-name:var(--font-mono)]">16,447</p>
                  <p className="text-[7px] text-foreground/25">Total Items</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                  <p className="text-sm font-bold text-green-400 font-[family-name:var(--font-mono)]">53</p>
                  <p className="text-[7px] text-foreground/25">Vault Artifacts</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
