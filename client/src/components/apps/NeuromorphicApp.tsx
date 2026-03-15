/**
 * Neuromorphic Architecture Viewer — Aluminum OS
 * Spiking neural networks, event-driven compute, attention routing
 * Integrated with SHELDONBRAIN 144 Spheres + Constitutional Governance
 * 
 * Design: Deep indigo/violet with electric synaptic pulse patterns
 * Principles: Brain-inspired compute — spikes not clocks, events not batches
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Zap, Activity, Eye, Network, Cpu, Waves,
  GitBranch, Target, Sparkles, Shield, BarChart3,
  ChevronRight, AlertTriangle, Check, RefreshCw,
} from "lucide-react";

type Tab = "topology" | "spikes" | "attention" | "councils" | "pathways" | "metrics";

// ─── Spiking Neurons (mapped to Houses) ───
interface NeuronCluster {
  id: string;
  house: string;
  houseIndex: number;
  neuronCount: number;
  firingRate: number; // Hz
  threshold: number;
  potential: number; // mV equivalent
  status: "firing" | "resting" | "refractory" | "inhibited";
  connections: number;
  god: string;
  element: string;
  lastSpike: string;
}

const neuronClusters: NeuronCluster[] = [
  { id: "nc-01", house: "Formal Sciences", houseIndex: 0, neuronCount: 2400, firingRate: 42.3, threshold: -55, potential: -48, status: "firing", connections: 1840, god: "Prometheus", element: "H-Cr", lastSpike: "2ms ago" },
  { id: "nc-02", house: "Social Sciences", houseIndex: 1, neuronCount: 2200, firingRate: 38.1, threshold: -55, potential: -62, status: "resting", connections: 1620, god: "Hestia", element: "Mn-Kr", lastSpike: "18ms ago" },
  { id: "nc-03", house: "Humanities", houseIndex: 2, neuronCount: 2100, firingRate: 35.7, threshold: -55, potential: -51, status: "firing", connections: 1580, god: "Clio", element: "Rb-Cd", lastSpike: "5ms ago" },
  { id: "nc-04", house: "Arts", houseIndex: 3, neuronCount: 1900, firingRate: 44.8, threshold: -55, potential: -70, status: "refractory", connections: 1420, god: "Apollo", element: "In-Nd", lastSpike: "1ms ago" },
  { id: "nc-05", house: "Natural Sciences", houseIndex: 4, neuronCount: 2600, firingRate: 51.2, threshold: -55, potential: -45, status: "firing", connections: 2100, god: "Newton", element: "Pm-Dy", lastSpike: "0ms ago" },
  { id: "nc-06", house: "Health Sciences", houseIndex: 5, neuronCount: 2800, firingRate: 39.4, threshold: -55, potential: -58, status: "resting", connections: 2240, god: "Asclepius", element: "Ho-Po", lastSpike: "12ms ago" },
  { id: "nc-07", house: "Education", houseIndex: 6, neuronCount: 1800, firingRate: 33.2, threshold: -55, potential: -53, status: "firing", connections: 1340, god: "Chiron", element: "At-Cm", lastSpike: "3ms ago" },
  { id: "nc-08", house: "Business & Econ", houseIndex: 7, neuronCount: 2000, firingRate: 46.7, threshold: -55, potential: -42, status: "firing", connections: 1560, god: "Hermes", element: "Bk-Hs", lastSpike: "1ms ago" },
  { id: "nc-09", house: "Law & Politics", houseIndex: 8, neuronCount: 2300, firingRate: 28.9, threshold: -55, potential: -67, status: "inhibited", connections: 1780, god: "Themis", element: "Mt-Ubn", lastSpike: "45ms ago" },
  { id: "nc-10", house: "Religion & Phil", houseIndex: 9, neuronCount: 1700, firingRate: 22.4, threshold: -55, potential: -72, status: "resting", connections: 1280, god: "Ra", element: "Ubi-Utb", lastSpike: "82ms ago" },
  { id: "nc-11", house: "Interdisciplinary", houseIndex: 10, neuronCount: 2500, firingRate: 48.9, threshold: -55, potential: -44, status: "firing", connections: 2060, god: "Pan", element: "Utt-Uqq", lastSpike: "0ms ago" },
  { id: "nc-12", house: "Vault (Sovereign)", houseIndex: 11, neuronCount: 500, firingRate: 12.0, threshold: -80, potential: -78, status: "resting", connections: 144, god: "Sovereign", element: "Au", lastSpike: "200ms ago" },
];

// ─── Attention Heads (Council Model Routing) ───
interface AttentionHead {
  model: string;
  color: string;
  focus: string;
  weight: number;
  queries: number;
  latency: string;
  spheres: string;
}

const attentionHeads: AttentionHead[] = [
  { model: "Claude", color: "#d4a574", focus: "Constitutional reasoning & safety analysis", weight: 0.94, queries: 12400, latency: "180ms", spheres: "House 9 (Law), House 3 (Ethics)" },
  { model: "Gemini", color: "#4285f4", focus: "Multimodal synthesis & spatial reasoning", weight: 0.91, queries: 18200, latency: "120ms", spheres: "House 5 (Science), House 4 (Arts)" },
  { model: "GPT-4", color: "#10a37f", focus: "General reasoning & code generation", weight: 0.89, queries: 15600, latency: "200ms", spheres: "House 1 (Formal), House 8 (Business)" },
  { model: "Grok", color: "#1da1f2", focus: "Real-time data & contrarian analysis", weight: 0.87, queries: 9800, latency: "90ms", spheres: "House 2 (Social), House 11 (Interdisciplinary)" },
  { model: "Copilot", color: "#0078d4", focus: "Code synthesis & developer tooling", weight: 0.86, queries: 11200, latency: "150ms", spheres: "House 1 (CS), House 7 (Ed Tech)" },
  { model: "DeepSeek", color: "#ff6b35", focus: "Deep technical research & math", weight: 0.88, queries: 7400, latency: "250ms", spheres: "House 1 (Math), House 5 (Physics)" },
  { model: "Qwen", color: "#7c3aed", focus: "Multilingual & cross-cultural reasoning", weight: 0.85, queries: 6200, latency: "160ms", spheres: "House 2 (Linguistics), House 10 (Religion)" },
  { model: "Llama", color: "#1877f2", focus: "Open-source reasoning & edge inference", weight: 0.82, queries: 5100, latency: "80ms", spheres: "House 11 (STS), House 7 (E-Learning)" },
  { model: "Mistral", color: "#ff7000", focus: "Efficient inference & European compliance", weight: 0.83, queries: 4800, latency: "70ms", spheres: "House 9 (Intl Law), House 8 (Intl Business)" },
  { model: "Manus", color: "#00d4ff", focus: "System architecture & Builder operations", weight: 0.96, queries: 22000, latency: "0ms", spheres: "All 12 Houses + Vault" },
];

// ─── Synaptic Pathways ───
interface Pathway {
  from: string;
  to: string;
  strength: number;
  type: "excitatory" | "inhibitory" | "modulatory";
  bandwidth: string;
  protocol: string;
}

const pathways: Pathway[] = [
  { from: "Formal Sciences", to: "Natural Sciences", strength: 0.95, type: "excitatory", bandwidth: "4.2 Gbps", protocol: "Mycelium" },
  { from: "Natural Sciences", to: "Health Sciences", strength: 0.92, type: "excitatory", bandwidth: "3.8 Gbps", protocol: "Mycelium" },
  { from: "Health Sciences", to: "Education", strength: 0.78, type: "modulatory", bandwidth: "2.1 Gbps", protocol: "Whale Song" },
  { from: "Law & Politics", to: "Business & Econ", strength: 0.85, type: "excitatory", bandwidth: "3.2 Gbps", protocol: "Ant Colony" },
  { from: "Humanities", to: "Arts", strength: 0.91, type: "excitatory", bandwidth: "3.6 Gbps", protocol: "Murmuration" },
  { from: "Religion & Phil", to: "Humanities", strength: 0.88, type: "modulatory", bandwidth: "2.8 Gbps", protocol: "Whale Song" },
  { from: "Social Sciences", to: "Law & Politics", strength: 0.82, type: "excitatory", bandwidth: "2.9 Gbps", protocol: "Ant Colony" },
  { from: "Interdisciplinary", to: "All Houses", strength: 0.76, type: "modulatory", bandwidth: "1.8 Gbps", protocol: "Slime Mold" },
  { from: "Vault", to: "Health Sciences", strength: 0.99, type: "inhibitory", bandwidth: "0.5 Gbps", protocol: "Immune System" },
  { from: "Vault", to: "Law & Politics", strength: 0.97, type: "inhibitory", bandwidth: "0.4 Gbps", protocol: "Immune System" },
  { from: "Education", to: "Formal Sciences", strength: 0.74, type: "excitatory", bandwidth: "2.0 Gbps", protocol: "Coral Reef" },
  { from: "Business & Econ", to: "Interdisciplinary", strength: 0.71, type: "modulatory", bandwidth: "1.6 Gbps", protocol: "Octopus" },
];

// ─── Spike Train Events ───
interface SpikeEvent {
  time: string;
  cluster: string;
  type: "spike" | "burst" | "inhibition" | "plasticity";
  amplitude: number;
  detail: string;
}

const spikeEvents: SpikeEvent[] = [
  { time: "14:32:18.042", cluster: "Natural Sciences", type: "burst", amplitude: 82, detail: "Physics sphere fired 12-spike burst — Council query on quantum computing triggered cascade through Chemistry and Biology" },
  { time: "14:32:17.998", cluster: "Formal Sciences", type: "spike", amplitude: 65, detail: "Data Science (Cr/Thoth) single spike — Qdrant similarity search completed in 3ms, results propagated to RAG pipeline" },
  { time: "14:32:17.891", cluster: "Vault", type: "inhibition", amplitude: 95, detail: "Sovereign inhibition — Class A data access attempted without INV-3 consent. Vault threshold held at -80mV. Access denied." },
  { time: "14:32:17.756", cluster: "Arts", type: "plasticity", amplitude: 45, detail: "Long-term potentiation in Digital Arts sphere — new creative pattern learned from user interaction, synapse weight +0.12" },
  { time: "14:32:17.612", cluster: "Health Sciences", type: "spike", amplitude: 71, detail: "Medicine (Ta/Asclepius) spike — patient vitals update received from One Medical bridge, propagated to Mental Health sphere" },
  { time: "14:32:17.445", cluster: "Interdisciplinary", type: "burst", amplitude: 88, detail: "Complex Systems (Uqq/Chaos) 8-spike burst — emergent pattern detected across Houses 1, 5, and 11. Murmuration protocol engaged." },
  { time: "14:32:17.301", cluster: "Business & Econ", type: "spike", amplitude: 58, detail: "Finance (Es/Hades) spike — AWS cost anomaly detected, routed to Supply Chain (Rf/Hecate) for optimization" },
  { time: "14:32:17.189", cluster: "Law & Politics", type: "inhibition", amplitude: 72, detail: "Constitutional Law (Mt/Themis) inhibited Business query — sovereignty cap at 47% would be violated. Query rerouted." },
  { time: "14:32:17.034", cluster: "Education", type: "plasticity", amplitude: 38, detail: "E-Learning (Th/Thor) synapse strengthened — user learning pattern reinforced, weight +0.08 on pedagogy pathway" },
  { time: "14:32:16.890", cluster: "Humanities", type: "spike", amplitude: 52, detail: "Philosophy (Sr/Socrates) spike — ethical query from Council deliberation, propagated to Ethics (Mo/Dike) for consensus" },
];

export default function NeuromorphicApp() {
  const [tab, setTab] = useState<Tab>("topology");
  const [clusters, setClusters] = useState(neuronClusters);
  const [tick, setTick] = useState(0);

  // Simulate neural activity
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setClusters(prev => prev.map(c => {
        const noise = (Math.random() - 0.5) * 8;
        let newPotential = c.potential + noise;
        let newStatus = c.status;
        let newRate = c.firingRate + (Math.random() - 0.5) * 2;

        if (newPotential > c.threshold && c.status !== "refractory") {
          newStatus = "firing";
          newPotential = -70; // reset after spike
          newRate = Math.min(60, newRate + 2);
        } else if (c.status === "firing") {
          newStatus = "refractory";
        } else if (c.status === "refractory") {
          newStatus = "resting";
          newPotential = -65;
        } else if (c.status === "inhibited" && Math.random() > 0.9) {
          newStatus = "resting";
        } else if (newPotential < -75) {
          newStatus = "resting";
        }

        return {
          ...c,
          potential: Math.max(-80, Math.min(-30, newPotential)),
          status: newStatus,
          firingRate: Math.max(5, Math.min(60, newRate)),
        };
      }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "topology", label: "Topology", icon: <Network className="w-3.5 h-3.5" /> },
    { id: "spikes", label: "Spike Train", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "attention", label: "Attention", icon: <Eye className="w-3.5 h-3.5" /> },
    { id: "councils", label: "Council Heads", icon: <Brain className="w-3.5 h-3.5" /> },
    { id: "pathways", label: "Pathways", icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: "metrics", label: "Metrics", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  const totalNeurons = clusters.reduce((s, c) => s + c.neuronCount, 0);
  const avgFiringRate = (clusters.reduce((s, c) => s + c.firingRate, 0) / clusters.length).toFixed(1);
  const firingCount = clusters.filter(c => c.status === "firing").length;
  const totalConnections = clusters.reduce((s, c) => s + c.connections, 0);

  const statusColor = (s: string) => {
    switch (s) {
      case "firing": return "text-violet-400";
      case "resting": return "text-blue-400";
      case "refractory": return "text-amber-400";
      case "inhibited": return "text-red-400";
      default: return "text-foreground/40";
    }
  };

  const statusGlow = (s: string) => {
    switch (s) {
      case "firing": return "shadow-[0_0_8px_rgba(139,92,246,0.4)]";
      case "resting": return "";
      case "refractory": return "shadow-[0_0_4px_rgba(251,191,36,0.3)]";
      case "inhibited": return "shadow-[0_0_4px_rgba(239,68,68,0.3)]";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a0a1a] to-[#0d0d20] text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-violet-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Brain className="w-5 h-5 text-violet-400" />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: firingCount > 4 ? "0 0 12px rgba(139,92,246,0.5)" : "0 0 4px rgba(139,92,246,0.2)" }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-violet-300">Neuromorphic Architecture</h2>
              <p className="text-[9px] text-foreground/30 font-mono">Spiking Neural Network × 144 Spheres × Event-Driven Compute</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-violet-400" />
              <span className="text-violet-400 font-bold">{totalNeurons.toLocaleString()}</span>
              <span className="text-foreground/25">neurons</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400">{avgFiringRate} Hz</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">{firingCount}/12 firing</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                  : "text-foreground/40 hover:text-foreground/60 hover:bg-white/5"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* ── Topology ── */}
          {tab === "topology" && (
            <motion.div key="topology" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total Neurons", value: totalNeurons.toLocaleString(), color: "#8b5cf6", sub: "across 12 clusters" },
                  { label: "Avg Firing Rate", value: `${avgFiringRate} Hz`, color: "#fbbf24", sub: "spikes per second" },
                  { label: "Connections", value: totalConnections.toLocaleString(), color: "#00d4ff", sub: "synaptic links" },
                  { label: "Active Clusters", value: `${firingCount}/12`, color: "#00ff88", sub: "currently firing" },
                ].map((m, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-foreground/30 uppercase tracking-wider">{m.label}</p>
                    <p className="text-lg font-bold mt-1" style={{ color: m.color }}>{m.value}</p>
                    <p className="text-[9px] text-foreground/25 mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Neuron Cluster Grid */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-foreground/30 mb-2">Neuron Clusters — Live Membrane Potential</p>
                <div className="grid grid-cols-4 gap-2">
                  {clusters.map(c => (
                    <motion.div
                      key={c.id}
                      className={`bg-white/[0.02] border border-white/5 rounded-lg p-2.5 relative overflow-hidden ${statusGlow(c.status)}`}
                      animate={{ borderColor: c.status === "firing" ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.05)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-semibold text-foreground/80 truncate">{c.house}</p>
                          <motion.div
                            className={`w-2 h-2 rounded-full ${
                              c.status === "firing" ? "bg-violet-400" :
                              c.status === "resting" ? "bg-blue-400" :
                              c.status === "refractory" ? "bg-amber-400" : "bg-red-400"
                            }`}
                            animate={{ scale: c.status === "firing" ? [1, 1.5, 1] : 1 }}
                            transition={{ duration: 0.3, repeat: c.status === "firing" ? Infinity : 0 }}
                          />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <p className="text-lg font-bold text-violet-400">{c.potential.toFixed(0)}</p>
                          <span className="text-[9px] text-foreground/25">mV</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[8px] text-foreground/25">{c.firingRate.toFixed(1)} Hz</span>
                          <span className={`text-[8px] ${statusColor(c.status)}`}>{c.status}</span>
                        </div>
                        <div className="text-[7px] text-foreground/15 mt-0.5 font-mono">{c.god} · {c.element}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Spike Train ── */}
          {tab === "spikes" && (
            <motion.div key="spikes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                <p className="text-[10px] text-violet-300 font-semibold mb-1">Spike Train Monitor</p>
                <p className="text-[9px] text-foreground/40">
                  Real-time spiking events across all 12 neuron clusters. Spikes = single neuron firings. Bursts = coordinated multi-spike cascades.
                  Inhibitions = constitutional gates blocking unauthorized propagation. Plasticity = synaptic weight updates from learning.
                </p>
              </div>
              {spikeEvents.map((e, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${
                        e.type === "spike" ? "bg-violet-500/10 text-violet-400 border-violet-500/10" :
                        e.type === "burst" ? "bg-amber-500/10 text-amber-400 border-amber-500/10" :
                        e.type === "inhibition" ? "bg-red-500/10 text-red-400 border-red-500/10" :
                        "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                      }`}>{e.type}</span>
                      <p className="text-[10px] font-semibold text-foreground/70">{e.cluster}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[8px]">
                      <span className="text-violet-400 font-mono">{e.amplitude}mV</span>
                      <span className="text-foreground/25 font-mono">{e.time}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-foreground/35">{e.detail}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Attention ── */}
          {tab === "attention" && (
            <motion.div key="attention" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                <p className="text-[10px] text-violet-300 font-semibold mb-1">Attention Routing Matrix</p>
                <p className="text-[9px] text-foreground/40">
                  Neuromorphic attention routing determines which neuron clusters receive compute priority.
                  Inspired by biological selective attention — the brain doesn't process everything equally.
                  High-firing clusters get more synaptic bandwidth. Vault always has priority inhibition rights.
                </p>
              </div>
              {/* Attention heatmap */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-foreground/30 mb-2">Cluster Attention Weights — Live</p>
                <div className="space-y-1.5">
                  {clusters.map(c => {
                    const weight = c.firingRate / 60;
                    return (
                      <div key={c.id} className="flex items-center gap-2">
                        <span className="text-[9px] text-foreground/50 w-28 truncate">{c.house}</span>
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, rgba(139,92,246,${0.3 + weight * 0.7}), rgba(0,212,255,${0.3 + weight * 0.7}))`,
                            }}
                            animate={{ width: `${weight * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-[9px] text-violet-400 font-mono w-12 text-right">{(weight * 100).toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Council Heads ── */}
          {tab === "councils" && (
            <motion.div key="councils" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                <p className="text-[10px] text-violet-300 font-semibold mb-1">Council Attention Heads</p>
                <p className="text-[9px] text-foreground/40">
                  Each Council model operates as an attention head in the neuromorphic architecture.
                  Queries are routed based on domain expertise — Claude handles constitutional reasoning,
                  Gemini handles multimodal synthesis, Manus handles system architecture. All heads
                  operate in parallel with weighted consensus.
                </p>
              </div>
              {attentionHeads.map((h, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: h.color }} />
                      <p className="text-[11px] font-semibold text-foreground/80">{h.model}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[9px]">
                      <span className="text-foreground/25">{h.latency}</span>
                      <span className="font-mono" style={{ color: h.color }}>{(h.weight * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-foreground/50 mb-1">{h.focus}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-foreground/25 font-mono">{h.spheres}</span>
                    <span className="text-[8px] text-foreground/25">{h.queries.toLocaleString()} queries</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${h.weight * 100}%`, background: h.color }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Pathways ── */}
          {tab === "pathways" && (
            <motion.div key="pathways" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                <p className="text-[10px] text-violet-300 font-semibold mb-1">Synaptic Pathways</p>
                <p className="text-[9px] text-foreground/40">
                  Inter-house connections modeled as synaptic pathways. Excitatory pathways amplify signals.
                  Inhibitory pathways (from Vault) block unauthorized propagation. Modulatory pathways adjust
                  signal strength without directly causing spikes. Each uses a biomimetic transport protocol.
                </p>
              </div>
              {pathways.map((p, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-foreground/60">{p.from}</span>
                    <ChevronRight className="w-3 h-3 text-foreground/20" />
                    <span className="text-[10px] text-foreground/60">{p.to}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded border ml-auto ${
                      p.type === "excitatory" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" :
                      p.type === "inhibitory" ? "bg-red-500/10 text-red-400 border-red-500/10" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/10"
                    }`}>{p.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground/30">Strength: <span className="text-violet-400">{(p.strength * 100).toFixed(0)}%</span></span>
                      <span className="text-foreground/30">BW: <span className="text-cyan-400">{p.bandwidth}</span></span>
                    </div>
                    <span className="text-foreground/25 font-mono text-[8px]">{p.protocol}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${p.strength * 100}%`,
                      background: p.type === "excitatory" ? "#00ff88" : p.type === "inhibitory" ? "#ef4444" : "#3b82f6",
                    }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Metrics ── */}
          {tab === "metrics" && (
            <motion.div key="metrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                <p className="text-[10px] text-violet-300 font-semibold mb-1">Neuromorphic Performance Metrics</p>
                <p className="text-[9px] text-foreground/40">
                  Comparison of neuromorphic (event-driven) vs traditional (clock-driven) compute across key dimensions.
                  Neuromorphic architecture processes only when events occur — no wasted cycles polling empty queues.
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { metric: "Energy Efficiency", neuro: "12.4 TOPS/W", trad: "2.1 TOPS/W", improvement: "+490%", color: "#00ff88" },
                  { metric: "Latency (P99)", neuro: "3.2ms", trad: "45ms", improvement: "-93%", color: "#8b5cf6" },
                  { metric: "Throughput", neuro: "142K events/s", trad: "18K req/s", improvement: "+689%", color: "#00d4ff" },
                  { metric: "Memory Usage", neuro: "2.4 GB", trad: "18.7 GB", improvement: "-87%", color: "#fbbf24" },
                  { metric: "Idle Power", neuro: "0.3W", trad: "45W", improvement: "-99.3%", color: "#ef4444" },
                  { metric: "Fault Recovery", neuro: "12ms", trad: "2.4s", improvement: "-99.5%", color: "#10b981" },
                  { metric: "Concurrent Queries", neuro: "28,400", trad: "1,200", improvement: "+2,267%", color: "#f97316" },
                  { metric: "Learning Rate", neuro: "Real-time", trad: "Batch (hourly)", improvement: "∞", color: "#a855f7" },
                ].map((m, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-semibold text-foreground/70">{m.metric}</p>
                      <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.improvement}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[9px]">
                      <div>
                        <span className="text-foreground/25">Neuromorphic: </span>
                        <span className="text-violet-400 font-mono">{m.neuro}</span>
                      </div>
                      <div>
                        <span className="text-foreground/25">Traditional: </span>
                        <span className="text-foreground/40 font-mono">{m.trad}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
