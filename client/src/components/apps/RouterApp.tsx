/* Model Router — 3-Tier Inference Routing Dashboard
 * Design: Obsidian Glass — dark with colored tier indicators
 * Shows all 7+ models across 3 cost tiers with simulated routing
 */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  tier: 1 | 2 | 3;
  costPer1k: number;
  latencyMs: number;
  color: string;
  strengths: string[];
  status: "online" | "degraded" | "offline";
  requestsToday: number;
  tokensToday: number;
}

const models: ModelConfig[] = [
  {
    id: "deepseek-r1",
    name: "DeepSeek-R1",
    provider: "DeepSeek",
    tier: 1,
    costPer1k: 0.00014,
    latencyMs: 180,
    color: "#00d4ff",
    strengths: ["Cost-efficient", "Reasoning", "Code"],
    status: "online",
    requestsToday: 4821,
    tokensToday: 2_400_000,
  },
  {
    id: "qwen-2.5",
    name: "Qwen 2.5",
    provider: "Alibaba",
    tier: 1,
    costPer1k: 0.00016,
    latencyMs: 150,
    color: "#ffd700",
    strengths: ["Multilingual", "Golden Triangle", "Speed"],
    status: "online",
    requestsToday: 2103,
    tokensToday: 1_050_000,
  },
  {
    id: "gemini-2.5",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    tier: 2,
    costPer1k: 0.00075,
    latencyMs: 220,
    color: "#4285F4",
    strengths: ["Multimodal", "Long context", "Search"],
    status: "online",
    requestsToday: 1847,
    tokensToday: 920_000,
  },
  {
    id: "claude-3.5",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    tier: 2,
    costPer1k: 0.003,
    latencyMs: 350,
    color: "#d97706",
    strengths: ["Constitution", "Safety", "Nuance"],
    status: "online",
    requestsToday: 1204,
    tokensToday: 600_000,
  },
  {
    id: "copilot",
    name: "Copilot GPT-4",
    provider: "Microsoft",
    tier: 2,
    costPer1k: 0.003,
    latencyMs: 400,
    color: "#0078D4",
    strengths: ["Enterprise", "365 Integration", "Code"],
    status: "online",
    requestsToday: 987,
    tokensToday: 490_000,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    tier: 3,
    costPer1k: 0.005,
    latencyMs: 500,
    color: "#10a37f",
    strengths: ["General", "Creative", "Reasoning"],
    status: "online",
    requestsToday: 643,
    tokensToday: 320_000,
  },
  {
    id: "grok-3",
    name: "Grok-3",
    provider: "xAI",
    tier: 3,
    costPer1k: 0.005,
    latencyMs: 450,
    color: "#ff4444",
    strengths: ["Adversarial", "Real-time", "Unfiltered"],
    status: "online",
    requestsToday: 412,
    tokensToday: 206_000,
  },
];

const tierLabels: Record<number, { name: string; desc: string; color: string }> = {
  1: { name: "Tier 1 — Bulk", desc: "High-volume, cost-efficient inference", color: "#00ff88" },
  2: { name: "Tier 2 — Standard", desc: "Balanced quality and cost", color: "#ffd700" },
  3: { name: "Tier 3 — Premium", desc: "Maximum capability, highest cost", color: "#ff6b35" },
};

interface RoutingEvent {
  id: number;
  query: string;
  model: string;
  tier: number;
  tokens: number;
  latency: number;
  cost: number;
  timestamp: Date;
}

export default function RouterApp() {
  const [activeTab, setActiveTab] = useState<"overview" | "routing" | "costs">("overview");
  const [routingLog, setRoutingLog] = useState<RoutingEvent[]>([]);

  // Simulate routing events
  useEffect(() => {
    const queries = [
      "Summarize today's council decisions",
      "Generate Rust code for buddy allocator",
      "Translate governance doc to Arabic",
      "Analyze 144-sphere ontology patterns",
      "Draft enterprise specification section",
      "Review constitutional compliance",
      "Parse GangaSeek infrastructure data",
      "Synthesize memory consolidation report",
      "Evaluate Ara transit protocol risks",
      "Generate TPU benchmark analysis",
    ];

    let eventId = 0;
    const addEvent = () => {
      const model = models[Math.floor(Math.random() * models.length)];
      const tokens = Math.floor(Math.random() * 2000) + 100;
      const event: RoutingEvent = {
        id: eventId++,
        query: queries[Math.floor(Math.random() * queries.length)],
        model: model.name,
        tier: model.tier,
        tokens,
        latency: model.latencyMs + Math.floor(Math.random() * 100),
        cost: (tokens / 1000) * model.costPer1k,
        timestamp: new Date(),
      };
      setRoutingLog(prev => [event, ...prev].slice(0, 50));
    };

    // Initial batch
    for (let i = 0; i < 8; i++) addEvent();
    const interval = setInterval(addEvent, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalCostToday = useMemo(() =>
    models.reduce((sum, m) => sum + (m.tokensToday / 1000) * m.costPer1k, 0),
  []);

  const totalTokensToday = useMemo(() =>
    models.reduce((sum, m) => sum + m.tokensToday, 0),
  []);

  return (
    <div className="h-full flex flex-col bg-[#080812]/80 text-foreground/80">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 flex items-center gap-2">
              <span className="text-lg">🔀</span> MODEL ROUTER
            </h2>
            <p className="text-[10px] text-foreground/30 mt-0.5">
              3-tier inference routing — {models.length} models — ${totalCostToday.toFixed(2)} today
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-400/70">All models online</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {(["overview", "routing", "costs"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] capitalize transition-colors ${
                activeTab === tab
                  ? "bg-white/10 text-foreground/90 font-medium"
                  : "text-foreground/30 hover:text-foreground/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Models", value: models.length.toString(), color: "#00d4ff" },
                { label: "Requests/day", value: models.reduce((s, m) => s + m.requestsToday, 0).toLocaleString(), color: "#00ff88" },
                { label: "Tokens/day", value: `${(totalTokensToday / 1_000_000).toFixed(1)}M`, color: "#ffd700" },
                { label: "Cost/day", value: `$${totalCostToday.toFixed(2)}`, color: "#ff6b35" },
              ].map(stat => (
                <div key={stat.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <p className="text-[9px] text-foreground/30 mb-1">{stat.label}</p>
                  <p className="text-lg font-bold font-[family-name:var(--font-mono)]" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Tier breakdown */}
            {[1, 2, 3].map(tier => {
              const tierModels = models.filter(m => m.tier === tier);
              const tierInfo = tierLabels[tier];
              return (
                <div key={tier}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: tierInfo.color }} />
                    <h3 className="text-[11px] font-bold text-foreground/80">{tierInfo.name}</h3>
                    <span className="text-[9px] text-foreground/25">{tierInfo.desc}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {tierModels.map((model, i) => (
                      <motion.div
                        key={model.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors group"
                      >
                        {/* Model indicator */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
                          style={{ background: `${model.color}15`, color: model.color }}
                        >
                          {model.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] font-medium text-foreground/80">{model.name}</p>
                            <span className="text-[8px] text-foreground/20">{model.provider}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              model.status === "online" ? "bg-green-400" :
                              model.status === "degraded" ? "bg-yellow-400" : "bg-red-400"
                            }`} />
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {model.strengths.map(s => (
                              <span key={s} className="text-[8px] text-foreground/25">{s}</span>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] font-[family-name:var(--font-mono)]" style={{ color: model.color }}>
                            ${model.costPer1k.toFixed(5)}/1k
                          </p>
                          <p className="text-[9px] text-foreground/25">{model.latencyMs}ms avg</p>
                        </div>

                        {/* Usage bar */}
                        <div className="w-16 flex-shrink-0">
                          <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: model.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(model.requestsToday / 5000) * 100}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                            />
                          </div>
                          <p className="text-[8px] text-foreground/20 mt-0.5 text-right">
                            {model.requestsToday.toLocaleString()} req
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "routing" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-bold text-foreground/70">Live Routing Log</h3>
              <span className="text-[9px] text-foreground/25">{routingLog.length} events</span>
            </div>
            {routingLog.map((event, i) => {
              const model = models.find(m => m.name === event.model);
              return (
                <motion.div
                  key={event.id}
                  initial={i === 0 ? { opacity: 0, y: -10 } : {}}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div
                    className="w-1.5 h-8 rounded-full flex-shrink-0"
                    style={{ background: tierLabels[event.tier]?.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-foreground/60 truncate">{event.query}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-medium" style={{ color: model?.color || "#fff" }}>
                        {event.model}
                      </span>
                      <span className="text-[8px] text-foreground/20">T{event.tier}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[9px] text-foreground/40 font-[family-name:var(--font-mono)]">
                      {event.tokens} tok · {event.latency}ms
                    </p>
                    <p className="text-[8px] text-foreground/20">
                      ${event.cost.toFixed(5)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === "costs" && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-foreground/70">Cost Breakdown by Model</h3>
            {models
              .sort((a, b) => (b.tokensToday / 1000) * b.costPer1k - (a.tokensToday / 1000) * a.costPer1k)
              .map((model, i) => {
                const cost = (model.tokensToday / 1000) * model.costPer1k;
                const pct = (cost / totalCostToday) * 100;
                return (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-foreground/70">{model.name}</span>
                        <span className="text-[8px] text-foreground/20">T{model.tier}</span>
                      </div>
                      <span className="text-[10px] font-[family-name:var(--font-mono)]" style={{ color: model.color }}>
                        ${cost.toFixed(4)} ({pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: model.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[8px] text-foreground/20">{(model.tokensToday / 1000).toFixed(0)}k tokens</span>
                      <span className="text-[8px] text-foreground/20">${model.costPer1k.toFixed(5)}/1k</span>
                    </div>
                  </motion.div>
                );
              })}

            {/* Total */}
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground/70">Total Daily Cost</span>
                <span className="text-sm font-bold text-cyan-400 font-[family-name:var(--font-mono)]">
                  ${totalCostToday.toFixed(2)}
                </span>
              </div>
              <p className="text-[9px] text-foreground/25 mt-1">
                Projected monthly: ${(totalCostToday * 30).toFixed(2)} — {(totalTokensToday * 30 / 1_000_000).toFixed(0)}M tokens
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
