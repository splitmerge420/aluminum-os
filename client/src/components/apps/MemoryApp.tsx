import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Database, Layers, ArrowUp, Clock, Zap, Search } from "lucide-react";

/* ─── SHELDONBRAIN Memory Architecture v1.0 ─── */
const workingMemory = [
  { id: 1, type: "context", content: "User is building Aluminum OS v3.1 — desktop web UI", age: "2m", tokens: 847, priority: "high" },
  { id: 2, type: "task", content: "Implement AI Council session with animated dialogue", age: "5m", tokens: 312, priority: "high" },
  { id: 3, type: "entity", content: "Daavud = Human Sovereign, splitmerge420", age: "12m", tokens: 45, priority: "medium" },
  { id: 4, type: "context", content: "7 council members: Manus, Claude, Gemini, Grok, Copilot, GPT, DeepSeek", age: "15m", tokens: 128, priority: "high" },
  { id: 5, type: "preference", content: "Glass-morphism UI, dark theme, Obsidian Glass Edition", age: "20m", tokens: 67, priority: "medium" },
  { id: 6, type: "task", content: "Cross-reference spec docs with current build", age: "25m", tokens: 234, priority: "low" },
  { id: 7, type: "entity", content: "uws = Universal Workspace CLI, 237 files, 47K lines", age: "30m", tokens: 89, priority: "medium" },
  { id: 8, type: "context", content: "Boot sequence: UEFI → Forge Core → Inference → Agent → Experience", age: "35m", tokens: 156, priority: "low" },
];

const longTermMemory = [
  { id: 1, category: "Architecture", entries: 234, lastAccess: "2m ago", vector_count: 1240, source: "Pinecone" },
  { id: 2, category: "Council Sessions", entries: 47, lastAccess: "14m ago", vector_count: 3200, source: "Pinecone" },
  { id: 3, category: "User Preferences", entries: 89, lastAccess: "5m ago", vector_count: 445, source: "Pinecone" },
  { id: 4, category: "Code Patterns", entries: 567, lastAccess: "1m ago", vector_count: 4100, source: "Pinecone" },
  { id: 5, category: "Provider Configs", entries: 34, lastAccess: "45m ago", vector_count: 170, source: "Pinecone" },
  { id: 6, category: "Wish Fulfillment", entries: 110, lastAccess: "30m ago", vector_count: 2200, source: "Pinecone" },
  { id: 7, category: "Error Patterns", entries: 23, lastAccess: "2h ago", vector_count: 115, source: "Pinecone" },
  { id: 8, category: "Governance Decisions", entries: 156, lastAccess: "8m ago", vector_count: 780, source: "Pinecone" },
];

const swarmMemory = [
  { agent: "Manus", shared: 45, received: 23, lastSync: "1m ago", status: "Synced" },
  { agent: "Claude", shared: 12, received: 34, lastSync: "3m ago", status: "Synced" },
  { agent: "Gemini", shared: 28, received: 19, lastSync: "5m ago", status: "Synced" },
  { agent: "Copilot", shared: 8, received: 15, lastSync: "8m ago", status: "Synced" },
  { agent: "Grok", shared: 5, received: 11, lastSync: "12m ago", status: "Synced" },
  { agent: "DeepSeek", shared: 67, received: 42, lastSync: "30s ago", status: "Synced" },
  { agent: "GPT", shared: 0, received: 0, lastSync: "—", status: "Timeout" },
];

const promotionQueue = [
  { from: "Working", to: "Long-Term", content: "Council session dialogue patterns", status: "Pending", confidence: 0.92 },
  { from: "Working", to: "Long-Term", content: "Ring architecture component mapping", status: "Pending", confidence: 0.88 },
  { from: "Working", to: "Long-Term", content: "UWS miracle command definitions", status: "Processing", confidence: 0.95 },
  { from: "Long-Term", to: "Swarm", content: "Cross-provider sync preferences", status: "Pending", confidence: 0.78 },
];

type Tab = "working" | "longterm" | "swarm" | "consolidation";

export default function MemoryApp() {
  const [tab, setTab] = useState<Tab>("working");
  const [consolidationTimer, setConsolidationTimer] = useState(852);

  useEffect(() => {
    const t = setInterval(() => setConsolidationTimer(p => p > 0 ? p - 1 : 1800), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  const typeColors: Record<string, string> = {
    context: "#00d4ff", task: "#ff6b35", entity: "#00ff88", preference: "#9b59b6",
  };

  const priorityColors: Record<string, string> = {
    high: "#ff4444", medium: "#ffd700", low: "#8899aa",
  };

  const agentColors: Record<string, string> = {
    Manus: "#00d4ff", Claude: "#ff6b35", Gemini: "#00ff88", Copilot: "#9b59b6",
    Grok: "#ff4444", DeepSeek: "#4fc3f7", GPT: "#ffd700",
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "working", label: "Working", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "longterm", label: "Long-Term", icon: <Database className="w-3.5 h-3.5" /> },
    { id: "swarm", label: "Swarm", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "consolidation", label: "Consolidation", icon: <ArrowUp className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-full flex" style={{ background: "linear-gradient(180deg, rgba(8,8,20,0.95) 0%, rgba(5,5,15,0.98) 100%)" }}>
      {/* Sidebar */}
      <div className="w-44 glass-heavy border-r border-white/5 p-2 flex flex-col">
        <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">SHELDONBRAIN</p>
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

        <div className="mt-auto pt-3 border-t border-white/5 px-2 py-2 space-y-2">
          <div className="glass rounded-lg p-2.5 text-center">
            <Clock className="w-4 h-4 text-cyan-400/50 mx-auto mb-1" />
            <p className="text-[9px] text-foreground/30">Next Consolidation</p>
            <p className="text-sm font-bold font-[family-name:var(--font-mono)] text-cyan-400">{formatTimer(consolidationTimer)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-foreground/30">Working</span>
              <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">847 entries</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-foreground/30">Long-Term</span>
              <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">12,400 vec</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-foreground/30">Swarm</span>
              <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">6 agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        {tab === "working" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Tier 1 — Working Memory</h2>
            <p className="text-[10px] text-foreground/35 mb-4">LLM-native context window + SQLite backing store — {workingMemory.reduce((a, m) => a + m.tokens, 0).toLocaleString()} tokens active</p>

            <div className="space-y-1.5">
              {workingMemory.map((mem, i) => (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-lg p-3 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-[family-name:var(--font-mono)]"
                      style={{ background: `${typeColors[mem.type]}15`, color: typeColors[mem.type], border: `1px solid ${typeColors[mem.type]}25` }}
                    >
                      {mem.type}
                    </span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full"
                      style={{ background: `${priorityColors[mem.priority]}10`, color: priorityColors[mem.priority] }}
                    >
                      {mem.priority}
                    </span>
                    <span className="text-[8px] text-foreground/20 ml-auto font-[family-name:var(--font-mono)]">{mem.tokens} tok</span>
                    <span className="text-[8px] text-foreground/20">{mem.age}</span>
                  </div>
                  <p className="text-[11px] text-foreground/60">{mem.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "longterm" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Tier 2 — Long-Term Memory</h2>
            <p className="text-[10px] text-foreground/35 mb-4">RAG pipeline + Pinecone vector store — 12,400 vectors across 8 categories</p>

            <div className="grid grid-cols-2 gap-2">
              {longTermMemory.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-lg p-3 hover:bg-white/3 transition-colors cursor-default"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-3.5 h-3.5 text-cyan-400/50" />
                    <span className="text-xs text-foreground/80 font-medium">{cat.category}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-foreground/30">Entries</span>
                      <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">{cat.entries}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-foreground/30">Vectors</span>
                      <span className="text-[9px] text-cyan-400/60 font-[family-name:var(--font-mono)]">{cat.vector_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-foreground/30">Last Access</span>
                      <span className="text-[9px] text-foreground/40">{cat.lastAccess}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "swarm" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Tier 3 — Swarm Memory</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Redis-backed cross-agent shared memory — 6 agents synced</p>

            <div className="space-y-2">
              {swarmMemory.map((agent, i) => (
                <motion.div
                  key={agent.agent}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/3 transition-colors"
                >
                  <motion.div
                    animate={agent.status === "Synced" ? { boxShadow: [`0 0 6px ${agentColors[agent.agent]}30`, `0 0 12px ${agentColors[agent.agent]}50`, `0 0 6px ${agentColors[agent.agent]}30`] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: `radial-gradient(circle, ${agentColors[agent.agent]}20, ${agentColors[agent.agent]}08)`,
                      border: `1px solid ${agentColors[agent.agent]}${agent.status === "Synced" ? "40" : "15"}`,
                      opacity: agent.status === "Timeout" ? 0.4 : 1,
                    }}
                  >
                    {agent.agent[0]}
                  </motion.div>
                  <div className="flex-1">
                    <span className="text-xs font-medium" style={{ color: agentColors[agent.agent] }}>{agent.agent}</span>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[9px] text-foreground/30">↑ {agent.shared} shared</span>
                      <span className="text-[9px] text-foreground/30">↓ {agent.received} received</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] ${agent.status === "Synced" ? "text-green-400/70" : "text-yellow-400/70"}`}>{agent.status}</span>
                    <p className="text-[9px] text-foreground/25">{agent.lastSync}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "consolidation" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Memory Consolidation</h2>
            <p className="text-[10px] text-foreground/35 mb-4">30-minute cycle — Promotes high-value working memory to long-term storage</p>

            {/* Promotion flow visualization */}
            <div className="flex items-center justify-center gap-4 mb-5">
              {["Working Memory", "Long-Term Memory", "Swarm Memory"].map((tier, i) => (
                <div key={tier} className="flex items-center gap-3">
                  <div className="glass rounded-lg p-3 text-center w-36">
                    <p className="text-[10px] text-foreground/60 font-medium">{tier}</p>
                    <p className="text-[8px] text-foreground/25 mt-0.5">Tier {i + 1}</p>
                  </div>
                  {i < 2 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowUp className="w-4 h-4 text-cyan-400/40 rotate-90" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Promotion queue */}
            <h3 className="text-xs font-bold font-[family-name:var(--font-display)] text-foreground/70 mb-2">Promotion Queue</h3>
            <div className="space-y-1.5">
              {promotionQueue.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-lg p-3 flex items-center gap-3"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400/70">{item.from}</span>
                    <ArrowUp className="w-3 h-3 text-foreground/20 rotate-90" />
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-400/10 text-green-400/70">{item.to}</span>
                  </div>
                  <p className="text-[10px] text-foreground/50 flex-1">{item.content}</p>
                  <div className="text-right">
                    <span className={`text-[9px] ${item.status === "Processing" ? "text-cyan-400/70" : "text-foreground/30"}`}>{item.status}</span>
                    <p className="text-[8px] text-foreground/20 font-[family-name:var(--font-mono)]">{(item.confidence * 100).toFixed(0)}% conf</p>
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
