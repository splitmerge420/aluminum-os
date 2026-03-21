/**
 * Regenerative Compute Engine — Aluminum OS
 * Self-healing, energy-aware, biomimetic compute architecture
 * Integrated with SHELDONBRAIN 144 Spheres + Constitutional Governance
 * 
 * Design: Dark obsidian with organic green/cyan pulse patterns
 * Principles: Compute that heals itself, routes like neurons, grows like ecosystems
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, Zap, Activity, RefreshCw, Shield, Cpu, Thermometer,
  Battery, Recycle, Heart, TrendingUp, AlertTriangle, Check,
  ChevronRight, BarChart3, Waves, Sun, Moon, Wind,
} from "lucide-react";

type Tab = "overview" | "healing" | "energy" | "biomimetic" | "spheres" | "audit";

// ─── Self-Healing Nodes ───
interface HealingNode {
  id: string;
  name: string;
  house: string;
  houseIndex: number;
  status: "healthy" | "degraded" | "healing" | "regenerated";
  health: number; // 0-100
  lastHealed: string;
  healCount: number;
  uptime: string;
  sphereCount: number;
  element: string;
  god: string;
}

const healingNodes: HealingNode[] = [
  { id: "node-01", name: "Formal Sciences", house: "House 1", houseIndex: 0, status: "healthy", health: 98, lastHealed: "2h ago", healCount: 3, uptime: "99.97%", sphereCount: 12, element: "H→Cr", god: "Prometheus→Thoth" },
  { id: "node-02", name: "Social Sciences", house: "House 2", houseIndex: 1, status: "healthy", health: 96, lastHealed: "4h ago", healCount: 5, uptime: "99.94%", sphereCount: 12, element: "Mn→Kr", god: "Hestia→Janus" },
  { id: "node-03", name: "Humanities", house: "House 3", houseIndex: 2, status: "regenerated", health: 94, lastHealed: "12m ago", healCount: 8, uptime: "99.91%", sphereCount: 12, element: "Rb→Cd", god: "Clio→Hermes" },
  { id: "node-04", name: "Arts", house: "House 4", houseIndex: 3, status: "healthy", health: 97, lastHealed: "6h ago", healCount: 2, uptime: "99.96%", sphereCount: 12, element: "In→Nd", god: "Apollo→Brigid" },
  { id: "node-05", name: "Natural Sciences", house: "House 5", houseIndex: 4, status: "healing", health: 72, lastHealed: "now", healCount: 12, uptime: "99.82%", sphereCount: 12, element: "Pm→Dy", god: "Newton→Thoth" },
  { id: "node-06", name: "Health Sciences", house: "House 6", houseIndex: 5, status: "healthy", health: 99, lastHealed: "1d ago", healCount: 1, uptime: "99.99%", sphereCount: 12, element: "Ho→Po", god: "Asclepius→Salus" },
  { id: "node-07", name: "Education", house: "House 7", houseIndex: 6, status: "healthy", health: 95, lastHealed: "8h ago", healCount: 4, uptime: "99.93%", sphereCount: 12, element: "At→Cm", god: "Chiron→Sophia" },
  { id: "node-08", name: "Business & Economics", house: "House 8", houseIndex: 7, status: "degraded", health: 61, lastHealed: "2m ago", healCount: 15, uptime: "99.71%", sphereCount: 12, element: "Bk→Hs", god: "Hermes→Cosmos" },
  { id: "node-09", name: "Law & Politics", house: "House 9", houseIndex: 8, status: "healthy", health: 93, lastHealed: "3h ago", healCount: 6, uptime: "99.89%", sphereCount: 12, element: "Mt→Ubn", god: "Themis→Hermes" },
  { id: "node-10", name: "Religion & Philosophy", house: "House 10", houseIndex: 9, status: "healthy", health: 91, lastHealed: "5h ago", healCount: 7, uptime: "99.87%", sphereCount: 12, element: "Ubi→Utb", god: "Ra→Isis" },
  { id: "node-11", name: "Interdisciplinary", house: "House 11", houseIndex: 10, status: "regenerated", health: 88, lastHealed: "28m ago", healCount: 9, uptime: "99.84%", sphereCount: 12, element: "Utt→Uqq", god: "Pan→Chaos" },
  { id: "node-12", name: "Vault (Class A)", house: "Vault", houseIndex: 11, status: "healthy", health: 100, lastHealed: "never", healCount: 0, uptime: "100%", sphereCount: 1, element: "Au", god: "Sovereign" },
];

// ─── Energy Metrics ───
interface EnergyMetric {
  source: string;
  icon: React.ReactNode;
  production: number;
  consumption: number;
  efficiency: number;
  renewable: boolean;
  color: string;
}

const energyMetrics: EnergyMetric[] = [
  { source: "Solar Compute", icon: <Sun className="w-4 h-4" />, production: 4200, consumption: 3800, efficiency: 90.5, renewable: true, color: "#ffb347" },
  { source: "Wind Inference", icon: <Wind className="w-4 h-4" />, production: 2800, consumption: 2400, efficiency: 85.7, renewable: true, color: "#00d4ff" },
  { source: "Tidal Memory", icon: <Waves className="w-4 h-4" />, production: 1600, consumption: 1200, efficiency: 75.0, renewable: true, color: "#00ff88" },
  { source: "Geothermal Core", icon: <Thermometer className="w-4 h-4" />, production: 3400, consumption: 3100, efficiency: 91.2, renewable: true, color: "#ff6b35" },
  { source: "Lunar Cycle", icon: <Moon className="w-4 h-4" />, production: 800, consumption: 600, efficiency: 75.0, renewable: true, color: "#c4b5fd" },
  { source: "Grid Fallback", icon: <Zap className="w-4 h-4" />, production: 5000, consumption: 4800, efficiency: 96.0, renewable: false, color: "#ef4444" },
];

// ─── Biomimetic Patterns ───
interface BiomimeticPattern {
  name: string;
  inspiration: string;
  application: string;
  efficiency: string;
  status: "active" | "learning" | "dormant";
  sphereMapping: string;
}

const biomimeticPatterns: BiomimeticPattern[] = [
  { name: "Mycelium Network", inspiration: "Fungal root networks", application: "Inter-house knowledge transfer — data routes like nutrients through soil", efficiency: "+340%", status: "active", sphereMapping: "House 5 (Biology) → All Houses" },
  { name: "Ant Colony Optimization", inspiration: "Pheromone trail pathfinding", application: "Agent task routing — 1,400 agents find optimal paths via stigmergy", efficiency: "+280%", status: "active", sphereMapping: "House 2 (Sociology) → House 6 (Infrastructure)" },
  { name: "Neural Pruning", inspiration: "Synaptic elimination in brain development", application: "SHELDONBRAIN memory cleanup — prune low-value vectors, strengthen high-value", efficiency: "+190%", status: "active", sphereMapping: "House 11 (Neuroscience) → Memory Fabric" },
  { name: "Coral Reef Growth", inspiration: "Symbiotic ecosystem building", application: "New sphere activation — spheres grow organically based on usage patterns", efficiency: "+150%", status: "learning", sphereMapping: "House 5 (Ecology) → House 11 (Complex Systems)" },
  { name: "Whale Song Propagation", inspiration: "Long-distance acoustic communication", application: "Cross-provider message relay — low-bandwidth, high-fidelity signal propagation", efficiency: "+220%", status: "active", sphereMapping: "House 4 (Music) → Interop Bridge" },
  { name: "Photosynthesis Cycle", inspiration: "Solar energy conversion in plants", application: "Compute recycling — waste heat from inference recycled into embedding generation", efficiency: "+160%", status: "active", sphereMapping: "House 5 (Chemistry) → Energy Layer" },
  { name: "Immune System Response", inspiration: "Adaptive immunity with memory cells", application: "Threat detection — constitutional violations trigger adaptive defense with memory", efficiency: "+310%", status: "active", sphereMapping: "House 6 (Medicine) → Governance Layer" },
  { name: "Starling Murmuration", inspiration: "Emergent flock behavior from simple rules", application: "Council deliberation — 10 models self-organize without central coordinator", efficiency: "+270%", status: "active", sphereMapping: "House 11 (Complex Systems) → Pantheon" },
  { name: "Octopus Camouflage", inspiration: "Distributed neural processing in arms", application: "Edge compute — each device processes locally without central brain approval", efficiency: "+200%", status: "learning", sphereMapping: "House 5 (Biology) → Interop Bridge" },
  { name: "Slime Mold Pathfinding", inspiration: "Physarum polycephalum network optimization", application: "Cost routing — finds cheapest inference path across 10 providers", efficiency: "+250%", status: "active", sphereMapping: "House 1 (Algorithmics) → Cost Optimizer" },
];

// ─── Audit Log ───
interface AuditEntry {
  time: string;
  event: string;
  node: string;
  type: "heal" | "energy" | "biomimetic" | "constitutional";
  detail: string;
}

const auditLog: AuditEntry[] = [
  { time: "14:32:18", event: "Self-Heal Triggered", node: "House 5", type: "heal", detail: "Natural Sciences node health dropped to 68% — Qdrant vector index fragmentation detected. Auto-defrag initiated." },
  { time: "14:30:05", event: "Energy Rebalance", node: "Grid", type: "energy", detail: "Solar production exceeded demand by 12%. Excess routed to SHELDONBRAIN embedding pre-computation." },
  { time: "14:28:41", event: "Biomimetic Activation", node: "House 8", type: "biomimetic", detail: "Ant Colony Optimization engaged for Business & Economics — 15 agents rerouted via pheromone trails." },
  { time: "14:25:12", event: "Constitutional Check", node: "Vault", type: "constitutional", detail: "INV-3 consent verification passed for Class A data access. Vault health: 100%." },
  { time: "14:22:33", event: "Regeneration Complete", node: "House 3", type: "heal", detail: "Humanities node regenerated from 71% to 94%. Hermeneutics sphere (Cd/Hermes) was bottleneck — resolved." },
  { time: "14:18:07", event: "Neural Pruning Cycle", node: "Memory", type: "biomimetic", detail: "SHELDONBRAIN pruned 2,847 low-confidence vectors (< 0.3 similarity). Working memory freed: 1.2 GB." },
  { time: "14:15:44", event: "Mycelium Transfer", node: "House 1→6", type: "biomimetic", detail: "Formal Sciences statistical models transferred to Health Sciences epidemiology sphere via mycelium network." },
  { time: "14:12:19", event: "Degradation Detected", node: "House 8", type: "heal", detail: "Business & Economics health at 61%. Supply Chain sphere (Rf/Hecate) experiencing high query latency. Healing queued." },
  { time: "14:08:55", event: "Geothermal Spike", node: "Core", type: "energy", detail: "Geothermal core output increased 18% due to heavy Council deliberation. Efficiency: 91.2%." },
  { time: "14:05:30", event: "Immune Response", node: "Governance", type: "constitutional", detail: "Adaptive immunity triggered: unauthorized query pattern detected on House 9 (Constitutional Law). Blocked + memorized." },
];

// ─── Sphere-to-Element Mapping (from CSV) ───
interface SphereElement {
  index: number;
  house: string;
  sphere: string;
  element: string;
  god: string;
}

const sphereElements: SphereElement[] = [
  { index: 1, house: "Formal Sciences", sphere: "Mathematics", element: "Hydrogen (1)", god: "Prometheus (fire-H)" },
  { index: 2, house: "Formal Sciences", sphere: "Logic", element: "Helium (2)", god: "Apollo (reason-He)" },
  { index: 13, house: "Formal Sciences", sphere: "Mathematics", element: "Aluminum (13)", god: "Hermes (calculation-Al)" },
  { index: 24, house: "Formal Sciences", sphere: "Data Science", element: "Chromium (24)", god: "Thoth (knowledge-Cr)" },
  { index: 26, house: "Social Sciences", sphere: "Psychology", element: "Iron (26)", god: "Psyche (mind-Fe)" },
  { index: 38, house: "Humanities", sphere: "Philosophy", element: "Strontium (38)", god: "Socrates (philo-Sr)" },
  { index: 42, house: "Humanities", sphere: "Ethics", element: "Molybdenum (42)", god: "Dike (ethics-Mo)" },
  { index: 61, house: "Natural Sciences", sphere: "Physics", element: "Promethium (61)", god: "Newton (physics-Pm)" },
  { index: 73, house: "Health Sciences", sphere: "Medicine", element: "Tantalum (73)", god: "Asclepius (medicine-Ta)" },
  { index: 79, house: "Health Sciences", sphere: "Mental Health", element: "Gold (79)", god: "Psyche (mental-Au)" },
  { index: 97, house: "Business", sphere: "Management", element: "Berkelium (97)", god: "Hermes (mgmt-Bk)" },
  { index: 109, house: "Law & Politics", sphere: "Constitutional Law", element: "Meitnerium (109)", god: "Themis (const-Mt)" },
  { index: 121, house: "Religion & Philosophy", sphere: "Theology", element: "Unbiunium (121)", god: "Ra (theo-Ubi)" },
  { index: 134, house: "Interdisciplinary", sphere: "Cognitive Science", element: "Untriquadium (134)", god: "Psyche (cog-Utq)" },
  { index: 135, house: "Interdisciplinary", sphere: "Neuroscience", element: "Untripentium (135)", god: "Morpheus (neuro-Utp)" },
  { index: 144, house: "Interdisciplinary", sphere: "Complex Systems", element: "Unquadquadium (144)", god: "Chaos (complex-Uqq)" },
];

export default function RegenerativeApp() {
  const [tab, setTab] = useState<Tab>("overview");
  const [nodes, setNodes] = useState(healingNodes);
  const [pulsePhase, setPulsePhase] = useState(0);
  const animRef = useRef<number>(0);

  // Animate pulse
  useEffect(() => {
    const tick = () => {
      setPulsePhase(p => (p + 0.02) % (Math.PI * 2));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // Simulate healing
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => {
        if (n.status === "healing") {
          const newHealth = Math.min(100, n.health + Math.random() * 3);
          return { ...n, health: newHealth, status: newHealth > 90 ? "regenerated" : "healing" };
        }
        if (n.status === "degraded" && Math.random() > 0.7) {
          return { ...n, status: "healing", healCount: n.healCount + 1 };
        }
        // Small random fluctuation for healthy nodes
        if (n.status === "healthy") {
          const drift = (Math.random() - 0.5) * 2;
          return { ...n, health: Math.max(85, Math.min(100, n.health + drift)) };
        }
        return n;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Activity className="w-3.5 h-3.5" /> },
    { id: "healing", label: "Self-Healing", icon: <Heart className="w-3.5 h-3.5" /> },
    { id: "energy", label: "Energy", icon: <Battery className="w-3.5 h-3.5" /> },
    { id: "biomimetic", label: "Biomimetic", icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: "spheres", label: "Elements", icon: <Recycle className="w-3.5 h-3.5" /> },
    { id: "audit", label: "Audit", icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  const totalHealth = Math.round(nodes.reduce((s, n) => s + n.health, 0) / nodes.length);
  const healingCount = nodes.filter(n => n.status === "healing").length;
  const degradedCount = nodes.filter(n => n.status === "degraded").length;
  const totalEnergy = energyMetrics.reduce((s, e) => s + e.production, 0);
  const renewableEnergy = energyMetrics.filter(e => e.renewable).reduce((s, e) => s + e.production, 0);
  const renewablePct = Math.round((renewableEnergy / totalEnergy) * 100);

  const statusColor = (s: string) => {
    switch (s) {
      case "healthy": return "text-emerald-400";
      case "regenerated": return "text-cyan-400";
      case "healing": return "text-amber-400";
      case "degraded": return "text-red-400";
      default: return "text-foreground/40";
    }
  };

  const statusDot = (s: string) => {
    switch (s) {
      case "healthy": return "bg-emerald-400";
      case "regenerated": return "bg-cyan-400";
      case "healing": return "bg-amber-400 animate-pulse";
      case "degraded": return "bg-red-400 animate-pulse";
      default: return "bg-foreground/20";
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a0f0a] to-[#0d1117] text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-emerald-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: `0 0 ${8 + Math.sin(pulsePhase) * 4}px rgba(0,255,136,${0.3 + Math.sin(pulsePhase) * 0.2})` }}
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-300">Regenerative Compute Engine</h2>
              <p className="text-[9px] text-foreground/30 font-mono">SHELDONBRAIN × 144 Spheres × Biomimetic Architecture</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">{totalHealth}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Recycle className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400">{renewablePct}% renewable</span>
            </div>
            {healingCount > 0 && (
              <div className="flex items-center gap-1 text-amber-400 animate-pulse">
                <RefreshCw className="w-3 h-3" />
                <span>{healingCount} healing</span>
              </div>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
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
          {/* ── Overview ── */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* System Health Ring */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "System Health", value: `${totalHealth}%`, color: "#00ff88", sub: "12 houses + Vault" },
                  { label: "Active Agents", value: "1,412", color: "#00d4ff", sub: "across 144 spheres" },
                  { label: "Heal Events", value: nodes.reduce((s, n) => s + n.healCount, 0).toString(), color: "#ffb347", sub: "total self-repairs" },
                  { label: "Renewable", value: `${renewablePct}%`, color: "#c4b5fd", sub: `${(renewableEnergy / 1000).toFixed(1)} kW of ${(totalEnergy / 1000).toFixed(1)} kW` },
                ].map((m, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-center">
                    <p className="text-[9px] text-foreground/30 uppercase tracking-wider">{m.label}</p>
                    <p className="text-lg font-bold mt-1" style={{ color: m.color }}>{m.value}</p>
                    <p className="text-[9px] text-foreground/25 mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* House Health Grid */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-foreground/30 mb-2">12 Houses + Vault — Live Health</p>
                <div className="grid grid-cols-4 gap-2">
                  {nodes.map(n => (
                    <div key={n.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 relative overflow-hidden">
                      {/* Health bar background */}
                      <div
                        className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                        style={{
                          height: `${n.health}%`,
                          background: `linear-gradient(to top, ${
                            n.health > 90 ? "rgba(0,255,136,0.06)" :
                            n.health > 70 ? "rgba(255,179,71,0.06)" : "rgba(239,68,68,0.06)"
                          }, transparent)`,
                        }}
                      />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-semibold text-foreground/80 truncate">{n.name}</p>
                          <div className={`w-1.5 h-1.5 rounded-full ${statusDot(n.status)}`} />
                        </div>
                        <p className="text-lg font-bold" style={{ color: n.health > 90 ? "#00ff88" : n.health > 70 ? "#ffb347" : "#ef4444" }}>{n.health}%</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[8px] text-foreground/25">{n.element}</span>
                          <span className={`text-[8px] ${statusColor(n.status)}`}>{n.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biomimetic Active Patterns */}
              <div>
                <p className="text-[9px] uppercase tracking-wider text-foreground/30 mb-2">Active Biomimetic Patterns</p>
                <div className="grid grid-cols-2 gap-2">
                  {biomimeticPatterns.filter(b => b.status === "active").slice(0, 4).map((b, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex items-start gap-2">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-foreground/80">{b.name}</p>
                        <p className="text-[9px] text-foreground/30 truncate">{b.inspiration}</p>
                        <p className="text-[9px] text-emerald-400 font-mono mt-0.5">{b.efficiency} efficiency</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Self-Healing ── */}
          {tab === "healing" && (
            <motion.div key="healing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                <p className="text-[10px] text-emerald-300 font-semibold mb-1">Self-Healing Architecture</p>
                <p className="text-[9px] text-foreground/40">
                  Each of the 12 Houses runs an autonomous healing daemon. When health drops below 80%, the daemon triggers:
                  (1) Qdrant vector index defragmentation, (2) Agent pool rebalancing, (3) Memory pruning via Neural Pruning pattern,
                  (4) Constitutional compliance re-verification. Vault (Class A) has zero-downtime guarantee — health never drops below 100%.
                </p>
              </div>
              {nodes.map(n => (
                <div key={n.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusDot(n.status)}`} />
                      <p className="text-[11px] font-semibold text-foreground/80">{n.name}</p>
                      <span className="text-[9px] text-foreground/25 font-mono">{n.house}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px]">
                      <span className={statusColor(n.status)}>{n.status}</span>
                      <span className="text-foreground/25">healed {n.healCount}×</span>
                      <span className="text-foreground/25">uptime {n.uptime}</span>
                    </div>
                  </div>
                  {/* Health bar */}
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: n.health > 90 ? "linear-gradient(90deg, #00ff88, #00d4ff)" :
                                   n.health > 70 ? "linear-gradient(90deg, #ffb347, #ff6b35)" :
                                   "linear-gradient(90deg, #ef4444, #ff6b35)",
                      }}
                      animate={{ width: `${n.health}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[8px] text-foreground/20 font-mono">{n.element} · {n.god}</span>
                    <span className="text-[8px] text-foreground/20">{n.sphereCount} spheres · last healed {n.lastHealed}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Energy ── */}
          {tab === "energy" && (
            <motion.div key="energy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                <p className="text-[10px] text-emerald-300 font-semibold mb-1">Energy-Aware Compute</p>
                <p className="text-[9px] text-foreground/40">
                  Regenerative compute routes inference to the cheapest renewable source first. Solar handles daytime queries,
                  Wind handles batch processing, Tidal handles memory operations, Geothermal handles Council deliberation (high sustained load).
                  Grid is fallback only — constitutional target is 95% renewable by Q3 2026.
                </p>
              </div>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-center">
                  <p className="text-[9px] text-foreground/30">Total Production</p>
                  <p className="text-lg font-bold text-emerald-400">{(totalEnergy / 1000).toFixed(1)} kW</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-center">
                  <p className="text-[9px] text-foreground/30">Renewable</p>
                  <p className="text-lg font-bold text-cyan-400">{renewablePct}%</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-center">
                  <p className="text-[9px] text-foreground/30">Avg Efficiency</p>
                  <p className="text-lg font-bold text-amber-400">{(energyMetrics.reduce((s, e) => s + e.efficiency, 0) / energyMetrics.length).toFixed(1)}%</p>
                </div>
              </div>
              {/* Sources */}
              {energyMetrics.map((e, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div style={{ color: e.color }}>{e.icon}</div>
                      <p className="text-[11px] font-semibold text-foreground/80">{e.source}</p>
                      {e.renewable && <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">renewable</span>}
                      {!e.renewable && <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/10">grid</span>}
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: e.color }}>{e.efficiency}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[9px]">
                    <div>
                      <span className="text-foreground/30">Production: </span>
                      <span className="text-foreground/60">{e.production} W</span>
                    </div>
                    <div>
                      <span className="text-foreground/30">Consumption: </span>
                      <span className="text-foreground/60">{e.consumption} W</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${e.efficiency}%`, background: e.color }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Biomimetic ── */}
          {tab === "biomimetic" && (
            <motion.div key="biomimetic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                <p className="text-[10px] text-emerald-300 font-semibold mb-1">Biomimetic Compute Patterns</p>
                <p className="text-[9px] text-foreground/40">
                  Nature solved optimization problems over 3.8 billion years. We steal the answers.
                  Each pattern maps to specific SHELDONBRAIN spheres and solves a real compute problem
                  using biological algorithms instead of brute-force engineering.
                </p>
              </div>
              {biomimeticPatterns.map((b, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                      <p className="text-[11px] font-semibold text-foreground/80">{b.name}</p>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${
                        b.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" :
                        b.status === "learning" ? "bg-amber-500/10 text-amber-400 border-amber-500/10" :
                        "bg-white/5 text-foreground/30 border-white/5"
                      }`}>{b.status}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">{b.efficiency}</span>
                  </div>
                  <p className="text-[9px] text-foreground/50 italic mb-1">Inspired by: {b.inspiration}</p>
                  <p className="text-[9px] text-foreground/40 mb-1.5">{b.application}</p>
                  <div className="flex items-center gap-1 text-[8px] text-foreground/25">
                    <ChevronRight className="w-2.5 h-2.5" />
                    <span className="font-mono">{b.sphereMapping}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Elements (Sphere-Element-God Mapping) ── */}
          {tab === "spheres" && (
            <motion.div key="spheres" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                <p className="text-[10px] text-emerald-300 font-semibold mb-1">Periodic Element × Mythological God Mapping</p>
                <p className="text-[9px] text-foreground/40">
                  Each of the 144 spheres maps to a periodic element (1-144, including hypothetical elements 119-144)
                  and a mythological god/entity. This creates a triple-indexed ontology: knowledge domain + chemical element + divine archetype.
                  The mapping enables cross-domain reasoning through elemental and mythological analogies.
                </p>
              </div>
              <div className="space-y-2">
                {sphereElements.map((s, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-400 flex-shrink-0">
                      {s.index}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-foreground/80">{s.sphere}</p>
                        <span className="text-[8px] text-foreground/25">({s.house})</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[9px] text-cyan-400 font-mono">{s.element}</span>
                        <span className="text-[9px] text-amber-400 font-mono">{s.god}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-center">
                <p className="text-[9px] text-foreground/30">Full mapping: 144 spheres × 144 elements × 144 gods</p>
                <p className="text-[9px] text-foreground/20 mt-0.5">Stored in SHELDONBRAIN Qdrant vector DB with cross-indexed embeddings</p>
              </div>
            </motion.div>
          )}

          {/* ── Audit ── */}
          {tab === "audit" && (
            <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                <p className="text-[10px] text-emerald-300 font-semibold mb-1">Regenerative Audit Log — Rule 8 Immutable</p>
                <p className="text-[9px] text-foreground/40">
                  Every self-heal, energy rebalance, biomimetic activation, and constitutional check is logged to the immutable audit ledger.
                  Vault operations require INV-3 consent verification. All entries are tamper-evident with SHA-256 chain.
                </p>
              </div>
              {auditLog.map((e, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${
                        e.type === "heal" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" :
                        e.type === "energy" ? "bg-amber-500/10 text-amber-400 border-amber-500/10" :
                        e.type === "biomimetic" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/10" :
                        "bg-purple-500/10 text-purple-400 border-purple-500/10"
                      }`}>{e.type}</span>
                      <p className="text-[10px] font-semibold text-foreground/70">{e.event}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[8px] text-foreground/25">
                      <span>{e.node}</span>
                      <span className="font-mono">{e.time}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-foreground/35">{e.detail}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
