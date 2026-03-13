import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Database, Shield, Layers, Zap, Server, HardDrive } from "lucide-react";

/* ─── Ring architecture data ─── */
const rings = [
  {
    id: 0, name: "Ring 0 — Forge Core", color: "#ff6b35",
    status: "Active", load: 12,
    components: [
      { name: "Buddy Allocator", status: "Online", metric: "2.4 GB / 16 GB" },
      { name: "Agent Identity Vault", status: "Online", metric: "7 identities" },
      { name: "Intent Scheduler", status: "Online", metric: "23 tasks/s" },
      { name: "Constitution Runtime", status: "Online", metric: "15 domains active" },
      { name: "UEFI Boot Shim", status: "Loaded", metric: "v1.0.0" },
    ],
  },
  {
    id: 1, name: "Ring 1 — Inference Engine", color: "#00d4ff",
    status: "Active", load: 47,
    components: [
      { name: "Model Router", status: "Online", metric: "7 models, 3 tiers" },
      { name: "Cost Tracker", status: "Online", metric: "$0.042 today" },
      { name: "Token Budget Manager", status: "Online", metric: "128K ctx window" },
      { name: "Task Decomposer", status: "Online", metric: "12 active tasks" },
      { name: "Session Vault", status: "Online", metric: "3 active sessions" },
    ],
  },
  {
    id: 2, name: "Ring 2 — SHELDONBRAIN", color: "#00ff88",
    status: "Active", load: 31,
    components: [
      { name: "Working Memory (SQLite)", status: "Online", metric: "847 entries" },
      { name: "Long-Term Memory (RAG)", status: "Online", metric: "12,400 vectors" },
      { name: "Swarm Memory (Redis)", status: "Online", metric: "3 agents synced" },
      { name: "Consolidation Agent", status: "Online", metric: "Next: 14m 22s" },
      { name: "Memory Promotion Queue", status: "Online", metric: "4 pending" },
    ],
  },
  {
    id: 3, name: "Ring 3 — Pantheon Council", color: "#9b59b6",
    status: "Active", load: 8,
    components: [
      { name: "BFT Governance Engine", status: "Online", metric: "Quorum: 5/7" },
      { name: "Council Session Manager", status: "Online", metric: "4 topics queued" },
      { name: "Constitutional Review", status: "Online", metric: "0 violations" },
      { name: "Audit Chain", status: "Online", metric: "2,847 entries" },
      { name: "Escalation Queue", status: "Online", metric: "0 pending" },
    ],
  },
  {
    id: 4, name: "Ring 4 — Noosphere", color: "#ffd700",
    status: "Active", load: 22,
    components: [
      { name: "Intent Engine", status: "Online", metric: "NLU pipeline active" },
      { name: "MCP Gateway", status: "Online", metric: "47 tools, 12 resources" },
      { name: "UWS Registry", status: "Online", metric: "20,000+ operations" },
      { name: "Contextual Surfaces", status: "Online", metric: "8 apps loaded" },
      { name: "Provider Bridge", status: "Online", metric: "5 providers linked" },
    ],
  },
];

const agents = [
  { name: "Manus", role: "Executor", status: "Active", tasks: 12, color: "#00d4ff" },
  { name: "Claude", role: "Oversight", status: "Active", tasks: 3, color: "#ff6b35" },
  { name: "Gemini", role: "Synthesizer", status: "Active", tasks: 5, color: "#00ff88" },
  { name: "Copilot", role: "Validator", status: "Active", tasks: 4, color: "#9b59b6" },
  { name: "Grok", role: "Contrarian", status: "Active", tasks: 2, color: "#ff4444" },
  { name: "DeepSeek", role: "Specialist", status: "Active", tasks: 7, color: "#4fc3f7" },
  { name: "GPT", role: "Observer", status: "Timeout", tasks: 0, color: "#ffd700" },
  { name: "Daavud", role: "Sovereign", status: "Active", tasks: 0, color: "#ffffff" },
];

type Tab = "rings" | "agents" | "inference" | "hardware";

export default function SystemMonitorApp() {
  const [tab, setTab] = useState<Tab>("rings");
  const [selectedRing, setSelectedRing] = useState(0);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setUptime(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "rings", label: "Rings", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "agents", label: "Agents", icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: "inference", label: "Inference", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "hardware", label: "Hardware", icon: <Server className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-full flex" style={{ background: "linear-gradient(180deg, rgba(8,8,20,0.95) 0%, rgba(5,5,15,0.98) 100%)" }}>
      {/* Sidebar */}
      <div className="w-44 glass-heavy border-r border-white/5 p-2 flex flex-col">
        <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">System Monitor</p>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${tab === t.id ? "bg-white/10 text-foreground" : "text-foreground/50 hover:bg-white/5"}`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}

        <div className="mt-auto pt-3 border-t border-white/5 px-2 py-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-foreground/30">Uptime</span>
            <span className="text-[9px] text-cyan-400/70 font-[family-name:var(--font-mono)]">{formatUptime(uptime + 15797)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-foreground/30">CPU</span>
            <span className="text-[9px] text-green-400/70 font-[family-name:var(--font-mono)]">24%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-foreground/30">Memory</span>
            <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">2.4 / 16 GB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-foreground/30">Compliance</span>
            <span className="text-[9px] text-green-400/70 font-[family-name:var(--font-mono)]">100%</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        {tab === "rings" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Ring Architecture — 5-Ring Status</h2>

            {/* Ring visualization */}
            <div className="flex items-center gap-2 mb-5">
              {rings.map(ring => (
                <button
                  key={ring.id}
                  onClick={() => setSelectedRing(ring.id)}
                  className={`flex-1 p-3 rounded-lg transition-all ${selectedRing === ring.id ? "ring-1" : "hover:bg-white/3"}`}
                  style={{
                    background: selectedRing === ring.id ? `${ring.color}10` : "rgba(255,255,255,0.02)",
                    borderColor: selectedRing === ring.id ? `${ring.color}40` : "transparent",
                    ...(selectedRing === ring.id ? { boxShadow: `0 0 15px ${ring.color}15` } : {}),
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: ring.id * 0.3 }}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: ring.color }}
                    />
                    <span className="text-[9px] font-bold font-[family-name:var(--font-display)]" style={{ color: ring.color }}>
                      R{ring.id}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ring.load}%` }}
                      transition={{ duration: 1, delay: ring.id * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: ring.color }}
                    />
                  </div>
                  <span className="text-[8px] text-foreground/30 font-[family-name:var(--font-mono)] mt-1 block">{ring.load}%</span>
                </button>
              ))}
            </div>

            {/* Selected ring detail */}
            <div className="glass rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: rings[selectedRing].color }} />
                <h3 className="text-xs font-bold font-[family-name:var(--font-display)]" style={{ color: rings[selectedRing].color }}>
                  {rings[selectedRing].name}
                </h3>
                <span className="text-[9px] text-green-400/70 ml-auto bg-green-400/10 px-2 py-0.5 rounded-full">
                  {rings[selectedRing].status}
                </span>
              </div>
              <div className="space-y-1.5">
                {rings[selectedRing].components.map((comp, i) => (
                  <motion.div
                    key={comp.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/3 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[11px] text-foreground/70 flex-1">{comp.name}</span>
                    <span className="text-[10px] text-foreground/40">{comp.status}</span>
                    <span className="text-[10px] text-foreground/30 font-[family-name:var(--font-mono)] w-32 text-right">{comp.metric}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "agents" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Agent Registry — A2A Control Plane</h2>
            <div className="space-y-2">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/3 transition-colors"
                >
                  <motion.div
                    animate={agent.status === "Active" ? { boxShadow: [`0 0 6px ${agent.color}30`, `0 0 12px ${agent.color}50`, `0 0 6px ${agent.color}30`] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: `radial-gradient(circle, ${agent.color}20, ${agent.color}08)`,
                      border: `1px solid ${agent.color}${agent.status === "Active" ? "40" : "15"}`,
                      opacity: agent.status === "Timeout" ? 0.5 : 1,
                    }}
                  >
                    {agent.name[0]}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: agent.color }}>{agent.name}</span>
                      <span className="text-[9px] text-foreground/30">{agent.role}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[9px] text-foreground/25">Autonomy: Tier {agent.role === "Sovereign" ? "∞" : agent.status === "Timeout" ? "0" : "2"}</span>
                      <span className="text-[9px] text-foreground/25">Trust: {agent.status === "Timeout" ? "Probation" : "Verified"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] ${agent.status === "Active" ? "text-green-400/70" : "text-yellow-400/70"}`}>{agent.status}</span>
                    <p className="text-[9px] text-foreground/25 font-[family-name:var(--font-mono)]">{agent.tasks} tasks</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "inference" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Inference Engine — Model Router</h2>

            {/* Model tiers */}
            {[
              {
                tier: "Tier 1 — Speed", color: "#00ff88",
                models: [
                  { name: "DeepSeek-V3", cost: "$0.00014/1K", latency: "45ms", usage: 62, provider: "DeepSeek" },
                  { name: "Gemini 2.0 Flash", cost: "$0.00015/1K", latency: "52ms", usage: 24, provider: "Google" },
                  { name: "Claude 3.5 Haiku", cost: "$0.00025/1K", latency: "68ms", usage: 8, provider: "Anthropic" },
                  { name: "GPT-4o-mini", cost: "$0.00015/1K", latency: "55ms", usage: 6, provider: "OpenAI" },
                ],
              },
              {
                tier: "Tier 2 — Balance", color: "#ffd700",
                models: [
                  { name: "Claude 3.5 Sonnet", cost: "$0.003/1K", latency: "120ms", usage: 45, provider: "Anthropic" },
                  { name: "GPT-4o", cost: "$0.005/1K", latency: "150ms", usage: 35, provider: "OpenAI" },
                  { name: "Gemini 1.5 Pro", cost: "$0.00125/1K", latency: "95ms", usage: 20, provider: "Google" },
                ],
              },
              {
                tier: "Tier 3 — Power", color: "#ff6b35",
                models: [
                  { name: "Claude 3 Opus", cost: "$0.015/1K", latency: "280ms", usage: 60, provider: "Anthropic" },
                  { name: "Grok-3", cost: "$0.005/1K", latency: "200ms", usage: 25, provider: "xAI" },
                  { name: "o3-mini", cost: "$0.011/1K", latency: "350ms", usage: 15, provider: "OpenAI" },
                ],
              },
            ].map((tier, ti) => (
              <div key={tier.tier} className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: tier.color }} />
                  <h3 className="text-[11px] font-bold font-[family-name:var(--font-display)]" style={{ color: tier.color }}>{tier.tier}</h3>
                </div>
                <div className="space-y-1">
                  {tier.models.map((model, mi) => (
                    <motion.div
                      key={model.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: ti * 0.1 + mi * 0.05 }}
                      className="flex items-center gap-3 px-3 py-2 rounded-md glass hover:bg-white/3 transition-colors"
                    >
                      <span className="text-[11px] text-foreground/70 w-36">{model.name}</span>
                      <span className="text-[9px] text-foreground/30 w-16">{model.provider}</span>
                      <span className="text-[9px] text-foreground/40 font-[family-name:var(--font-mono)] w-20">{model.cost}</span>
                      <span className="text-[9px] text-foreground/30 w-12">{model.latency}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${model.usage}%` }}
                          transition={{ duration: 0.8, delay: ti * 0.1 + mi * 0.05 }}
                          className="h-full rounded-full"
                          style={{ background: tier.color }}
                        />
                      </div>
                      <span className="text-[8px] text-foreground/25 font-[family-name:var(--font-mono)] w-8 text-right">{model.usage}%</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Cost summary */}
            <div className="glass rounded-lg p-3 mt-2">
              <p className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)] mb-2">Cost Summary</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-cyan-400">$0.042</p>
                  <p className="text-[9px] text-foreground/30">Today</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-foreground/60">$1.24</p>
                  <p className="text-[9px] text-foreground/30">This week</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-foreground/40">$4.87</p>
                  <p className="text-[9px] text-foreground/30">This month</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-foreground/40">Avg cost/query</p>
                  <p className="text-xs font-bold font-[family-name:var(--font-mono)] text-green-400">$0.00031</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "hardware" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Hardware Support — Tier Matrix</h2>
            <div className="space-y-2">
              {[
                { tier: "Tier 1 — Full Native", color: "#00ff88", devices: ["Custom Aluminum Hardware", "Pixel 9 Pro (Android)", "Chromebook Plus"], support: "Full kernel + all rings" },
                { tier: "Tier 2 — Near-Native", color: "#00d4ff", devices: ["MacBook Pro (macOS)", "Surface Pro (Windows)"], support: "Ring 1-4 via WASM, Ring 0 emulated" },
                { tier: "Tier 3 — Web Runtime", color: "#ffd700", devices: ["Chrome Browser", "Firefox", "Safari"], support: "Ring 2-4 via WebAssembly" },
                { tier: "Tier 4 — Agent Only", color: "#ff6b35", devices: ["iOS (iPhone/iPad)", "Android (non-Pixel)"], support: "Ring 3-4 via companion app" },
                { tier: "Tier 5 — API Bridge", color: "#ff4444", devices: ["Smart Home (Nest/Alexa)", "Wearables", "IoT"], support: "Ring 4 only via MCP gateway" },
              ].map((t, i) => (
                <motion.div
                  key={t.tier}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                    <h3 className="text-[11px] font-bold font-[family-name:var(--font-display)]" style={{ color: t.color }}>{t.tier}</h3>
                  </div>
                  <p className="text-[10px] text-foreground/40 mb-1.5">{t.support}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.devices.map(d => (
                      <span key={d} className="text-[9px] px-2 py-0.5 rounded-full border" style={{ borderColor: `${t.color}25`, color: `${t.color}80`, background: `${t.color}08` }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
