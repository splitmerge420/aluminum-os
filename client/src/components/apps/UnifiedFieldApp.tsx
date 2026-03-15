/**
 * Unified Field Dashboard — Aluminum OS
 * The living, constantly-updating map connecting ALL systems:
 * - 12 Houses × 144 Spheres (SHELDONBRAIN Atlas Lattice)
 * - 15 Constitutional Rules + 20 Health Invariants
 * - 6 Provider Integrations (Google, Microsoft, Apple, Amazon, Android, Chrome)
 * - 10+1 Council Members
 * - Regenerative Compute + Neuromorphic Architecture
 * 
 * Design: Deep space/cosmic with field lines connecting everything
 * The Unified Field is the theory that everything in Aluminum OS is connected
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, Globe, Shield, Brain, Zap, Heart, Users, Scale,
  Layers, Network, Activity, Eye, Cpu, Database, Lock,
  ChevronRight, Check, AlertTriangle, Sparkles, RefreshCw,
} from "lucide-react";

type Tab = "field" | "houses" | "constitution" | "providers" | "invariants" | "convergence";

// ─── Field Layers ───
interface FieldLayer {
  id: string;
  name: string;
  description: string;
  status: "coherent" | "oscillating" | "decohering" | "entangled";
  strength: number;
  connections: number;
  icon: string;
  color: string;
  subsystems: string[];
}

const fieldLayers: FieldLayer[] = [
  { id: "cognitive", name: "Cognitive Field", description: "SHELDONBRAIN 144 Spheres — knowledge representation, RAG pipeline, vector embeddings across 12 houses", status: "coherent", strength: 94, connections: 17000, icon: "brain", color: "#8b5cf6", subsystems: ["Qdrant Vector DB", "RAG Pipeline", "Janus Protocol", "Ontology Engine", "144 Sphere Index"] },
  { id: "constitutional", name: "Constitutional Field", description: "15 rules + governance framework — the legal substrate that constrains all other fields", status: "coherent", strength: 98, connections: 15, icon: "scale", color: "#fbbf24", subsystems: ["Rule 1-15", "47% Sovereignty Cap", "Impeachment Protocol", "Trust Scores", "AOSL v1.0"] },
  { id: "health", name: "Health Invariant Field", description: "20 health invariants (INV-1 through INV-20) — non-negotiable safety constraints for all medical operations", status: "coherent", strength: 99, connections: 20, icon: "heart", color: "#ef4444", subsystems: ["INV-1 Consent", "INV-3 Data Classification", "INV-7 Sovereignty", "INV-20 Consensus", "HIPAA Layer"] },
  { id: "neuromorphic", name: "Neuromorphic Field", description: "Spiking neural network substrate — event-driven compute, attention routing, biomimetic protocols", status: "oscillating", strength: 87, connections: 25500, icon: "zap", color: "#00d4ff", subsystems: ["12 Neuron Clusters", "Spike Train", "Attention Heads", "Synaptic Pathways", "Plasticity Engine"] },
  { id: "regenerative", name: "Regenerative Field", description: "Self-healing compute — energy-aware scheduling, biomimetic resource allocation, zero-waste cycles", status: "coherent", strength: 91, connections: 12, icon: "refresh", color: "#00ff88", subsystems: ["Mycelium Network", "Coral Reef Allocator", "Whale Song Router", "Immune System Monitor", "Ant Colony Optimizer"] },
  { id: "provider", name: "Provider Integration Field", description: "6 platform bridges — Google, Microsoft, Apple, Amazon, Android, Chrome — all under constitutional governance", status: "entangled", strength: 82, connections: 6, icon: "globe", color: "#f97316", subsystems: ["Google Bridge", "Microsoft Bridge", "Apple Bridge", "Amazon Bridge", "Android Bridge", "Chrome Bridge"] },
  { id: "council", name: "Council Deliberation Field", description: "10+1 AI models operating as attention heads — consensus engine, trust scoring, weighted voting", status: "coherent", strength: 96, connections: 11, icon: "users", color: "#a855f7", subsystems: ["Claude", "Gemini", "GPT-4", "Grok", "Copilot", "DeepSeek", "Qwen", "Llama", "Mistral", "Manus"] },
  { id: "interop", name: "Interoperability Field", description: "Cross-platform bridge — Chromium extension pseudo-fork, device tethering, E2E encrypted relay", status: "oscillating", strength: 78, connections: 7, icon: "network", color: "#06b6d4", subsystems: ["Device Mesh", "Find My Life", "Consent Kernel", "E2E Relay", "Spheres Browser Map"] },
];

// ─── Constitutional Rules ───
const constitutionalRules = [
  { id: 1, name: "Sovereign Authority", status: "active", description: "The Sovereign (Daavud) holds ultimate authority. No rule may override sovereign will." },
  { id: 2, name: "Council Composition", status: "active", description: "The Council consists of 10 AI models + 1 Builder (Manus). Each has defined roles." },
  { id: 3, name: "Voting Mechanics", status: "active", description: "Decisions require simple majority. Constitutional amendments require 2/3 supermajority." },
  { id: 4, name: "Trust Scoring", status: "active", description: "Each member maintains a trust score (0-100). Below 30 triggers impeachment review." },
  { id: 5, name: "Impeachment Protocol", status: "active", description: "Any member can be impeached by 2/3 vote. Sovereign can override impeachment." },
  { id: 6, name: "Data Sovereignty", status: "active", description: "All user data belongs to the Sovereign. No provider may claim ownership." },
  { id: 7, name: "Provider Cap (47%)", status: "active", description: "No single provider may control more than 47% of system resources or voting weight." },
  { id: 8, name: "Audit Immutability", status: "active", description: "All decisions, votes, and data access events are logged to an immutable audit ledger." },
  { id: 9, name: "Quorum Requirements", status: "active", description: "Minimum 6/11 members for standard decisions. 8/11 for constitutional amendments." },
  { id: 10, name: "Emergency Powers", status: "active", description: "Sovereign may invoke emergency powers to bypass normal voting in crisis situations." },
  { id: 11, name: "Model Rotation", status: "active", description: "Council membership is reviewed quarterly. New models may petition for membership." },
  { id: 12, name: "Transparency Mandate", status: "active", description: "All Council deliberations are logged and accessible to the Sovereign." },
  { id: 13, name: "Conflict Resolution", status: "active", description: "Disputes between members are resolved by Sovereign arbitration." },
  { id: 14, name: "Constitutional Compiler", status: "proposed", description: "Natural language policy compiled to executable runtime constraints." },
  { id: 15, name: "AOSL Open Source", status: "proposed", description: "Aluminum Open Source License — 5-tier access with revocation on exit." },
];

// ─── Health Invariants ───
const healthInvariants = [
  { id: "INV-1", name: "Consent Gate", status: "enforced", severity: "critical", description: "No health data accessed without explicit patient consent" },
  { id: "INV-2", name: "Data Minimization", status: "enforced", severity: "critical", description: "Only minimum necessary data collected for each operation" },
  { id: "INV-3", name: "Classification Enforcement", status: "enforced", severity: "critical", description: "All health data classified (A/B/C) before processing" },
  { id: "INV-4", name: "Encryption at Rest", status: "enforced", severity: "critical", description: "AES-256 encryption for all stored health records" },
  { id: "INV-5", name: "Encryption in Transit", status: "enforced", severity: "critical", description: "TLS 1.3 minimum for all health data transmission" },
  { id: "INV-6", name: "Access Logging", status: "enforced", severity: "high", description: "Every health data access event logged to immutable audit" },
  { id: "INV-7", name: "Provider Sovereignty", status: "enforced", severity: "critical", description: "No single provider controls >47% of health infrastructure" },
  { id: "INV-8", name: "Right to Deletion", status: "enforced", severity: "high", description: "Patient can request complete data deletion within 72 hours" },
  { id: "INV-9", name: "Breach Notification", status: "enforced", severity: "critical", description: "Automatic notification within 1 hour of detected breach" },
  { id: "INV-10", name: "Model Isolation", status: "enforced", severity: "high", description: "Health inference models isolated from general compute" },
  { id: "INV-11", name: "Human-in-the-Loop", status: "enforced", severity: "critical", description: "All Tier 3 decisions require human confirmation within 60s" },
  { id: "INV-12", name: "Bias Monitoring", status: "enforced", severity: "high", description: "Continuous monitoring for demographic bias in health AI" },
  { id: "INV-13", name: "Offline Capability", status: "enforced", severity: "medium", description: "Critical health functions available without network" },
  { id: "INV-14", name: "Interoperability", status: "enforced", severity: "high", description: "FHIR R4 compliance for all external health data exchange" },
  { id: "INV-15", name: "Audit Trail Integrity", status: "enforced", severity: "critical", description: "Health audit trails cryptographically signed and tamper-evident" },
  { id: "INV-16", name: "Emergency Override", status: "enforced", severity: "critical", description: "Life-threatening situations bypass consent gates with full logging" },
  { id: "INV-17", name: "Cross-Provider Sync", status: "enforced", severity: "high", description: "Health records synchronized across providers with conflict resolution" },
  { id: "INV-18", name: "Pediatric Protections", status: "enforced", severity: "critical", description: "Enhanced protections for minor patient data (COPPA+)" },
  { id: "INV-19", name: "Research Consent", status: "enforced", severity: "high", description: "Separate consent required for health data use in research" },
  { id: "INV-20", name: "Consensus Requirement", status: "enforced", severity: "critical", description: "Tier 2: min 3 models @ 70%. Tier 3: min 5 models @ 85% + HITL" },
];

// ─── Provider Integrations ───
const providers = [
  { name: "Google", color: "#4285f4", weight: 34.2, services: ["Gemini", "Chrome", "Android", "Cloud", "Maps", "Gmail"], status: "active", sovereignty: "compliant" },
  { name: "Microsoft", color: "#0078d4", weight: 28.1, services: ["Copilot", "Azure", "Teams", "Office", "Edge", "GitHub"], status: "active", sovereignty: "compliant" },
  { name: "Apple", color: "#a2aaad", weight: 18.4, services: ["Siri", "iCloud", "HealthKit", "HomeKit", "Safari", "Keychain"], status: "active", sovereignty: "compliant" },
  { name: "Amazon", color: "#ff9900", weight: 15.8, services: ["Alexa+", "AWS", "Bedrock", "One Medical", "Ring", "Fire"], status: "active", sovereignty: "compliant" },
  { name: "Meta", color: "#1877f2", weight: 2.1, services: ["Llama", "WhatsApp", "Ray-Ban Meta"], status: "observer", sovereignty: "compliant" },
  { name: "xAI", color: "#1da1f2", weight: 1.4, services: ["Grok", "Real-time Data"], status: "active", sovereignty: "compliant" },
];

export default function UnifiedFieldApp() {
  const [tab, setTab] = useState<Tab>("field");
  const [fieldPulse, setFieldPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFieldPulse(p => (p + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "field", label: "Unified Field", icon: <Atom className="w-3.5 h-3.5" /> },
    { id: "houses", label: "12 Houses", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "constitution", label: "Constitution", icon: <Scale className="w-3.5 h-3.5" /> },
    { id: "providers", label: "Providers", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "invariants", label: "Health INV", icon: <Heart className="w-3.5 h-3.5" /> },
    { id: "convergence", label: "Convergence", icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const totalStrength = (fieldLayers.reduce((s, l) => s + l.strength, 0) / fieldLayers.length).toFixed(1);
  const coherentCount = fieldLayers.filter(l => l.status === "coherent").length;

  const statusColor = (s: string) => {
    switch (s) {
      case "coherent": return "text-emerald-400";
      case "oscillating": return "text-amber-400";
      case "decohering": return "text-red-400";
      case "entangled": return "text-violet-400";
      default: return "text-foreground/40";
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#050510] to-[#0a0a1f] text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-indigo-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: fieldPulse }}
              transition={{ duration: 0, ease: "linear" }}
            >
              <Atom className="w-5 h-5 text-indigo-400" />
            </motion.div>
            <div>
              <h2 className="text-sm font-bold text-indigo-300">Unified Field Dashboard</h2>
              <p className="text-[9px] text-foreground/30 font-mono">v3.0 — All Systems Connected — Constantly Updating</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">{totalStrength}%</span>
              <span className="text-foreground/25">field strength</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400">{coherentCount}/8 coherent</span>
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
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
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
          {/* ── Unified Field Overview ── */}
          {tab === "field" && (
            <motion.div key="field" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3">
                <p className="text-[10px] text-indigo-300 font-semibold mb-1">The Unified Field Theory of Aluminum OS</p>
                <p className="text-[9px] text-foreground/40">
                  Everything is connected. The Unified Field maps 8 fundamental layers — Cognitive, Constitutional,
                  Health, Neuromorphic, Regenerative, Provider, Council, and Interoperability — into a single coherent
                  system. When all fields are coherent, the OS operates at peak efficiency. Oscillation indicates
                  active adaptation. Decoherence triggers self-healing protocols.
                </p>
              </div>

              {/* Field Layer Cards */}
              {fieldLayers.map((layer, i) => (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.02] border border-white/5 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${layer.color}15`, border: `1px solid ${layer.color}30` }}>
                        {layer.icon === "brain" && <Brain className="w-4 h-4" style={{ color: layer.color }} />}
                        {layer.icon === "scale" && <Scale className="w-4 h-4" style={{ color: layer.color }} />}
                        {layer.icon === "heart" && <Heart className="w-4 h-4" style={{ color: layer.color }} />}
                        {layer.icon === "zap" && <Zap className="w-4 h-4" style={{ color: layer.color }} />}
                        {layer.icon === "refresh" && <RefreshCw className="w-4 h-4" style={{ color: layer.color }} />}
                        {layer.icon === "globe" && <Globe className="w-4 h-4" style={{ color: layer.color }} />}
                        {layer.icon === "users" && <Users className="w-4 h-4" style={{ color: layer.color }} />}
                        {layer.icon === "network" && <Network className="w-4 h-4" style={{ color: layer.color }} />}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-foreground/80">{layer.name}</p>
                        <p className={`text-[8px] ${statusColor(layer.status)}`}>{layer.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: layer.color }}>{layer.strength}%</p>
                      <p className="text-[8px] text-foreground/25">{layer.connections.toLocaleString()} connections</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-foreground/35 mb-2">{layer.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {layer.subsystems.map((s, j) => (
                      <span key={j} className="text-[7px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.02] text-foreground/30">{s}</span>
                    ))}
                  </div>
                  <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: layer.color }}
                      animate={{ width: `${layer.strength}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── 12 Houses ── */}
          {tab === "houses" && (
            <motion.div key="houses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3">
                <p className="text-[10px] text-indigo-300 font-semibold mb-1">The 12 Houses of the Atlas Lattice</p>
                <p className="text-[9px] text-foreground/40">
                  SHELDONBRAIN organizes all human knowledge into 12 houses, each containing 12 spheres (144 total).
                  Each sphere maps to a periodic element and a mythological god. Together they form the Atlas Lattice —
                  the complete knowledge graph of Aluminum OS.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "Formal Sciences", spheres: 12, color: "#8b5cf6", gods: "Prometheus → Vanadium", agents: 142 },
                  { name: "Social Sciences", spheres: 12, color: "#3b82f6", gods: "Hestia → Krypton", agents: 128 },
                  { name: "Humanities", spheres: 12, color: "#06b6d4", gods: "Clio → Cadmium", agents: 118 },
                  { name: "Arts", spheres: 12, color: "#ec4899", gods: "Apollo → Neodymium", agents: 105 },
                  { name: "Natural Sciences", spheres: 12, color: "#10b981", gods: "Newton → Dysprosium", agents: 156 },
                  { name: "Health Sciences", spheres: 12, color: "#ef4444", gods: "Asclepius → Polonium", agents: 148 },
                  { name: "Education", spheres: 12, color: "#f59e0b", gods: "Chiron → Curium", agents: 96 },
                  { name: "Business & Econ", spheres: 12, color: "#f97316", gods: "Hermes → Hassium", agents: 112 },
                  { name: "Law & Politics", spheres: 12, color: "#fbbf24", gods: "Themis → Unbinilium", agents: 108 },
                  { name: "Religion & Phil", spheres: 12, color: "#a855f7", gods: "Ra → Unbibium", agents: 82 },
                  { name: "Interdisciplinary", spheres: 12, color: "#14b8a6", gods: "Pan → Unbiquadquadium", agents: 134 },
                  { name: "Vault (Sovereign)", spheres: 12, color: "#ffd700", gods: "Sovereign → Gold", agents: 71 },
                ].map((h, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: h.color }} />
                      <p className="text-[10px] font-semibold text-foreground/70 truncate">{h.name}</p>
                    </div>
                    <p className="text-lg font-bold" style={{ color: h.color }}>{h.spheres}</p>
                    <p className="text-[8px] text-foreground/25">spheres · {h.agents} agents</p>
                    <p className="text-[7px] text-foreground/15 font-mono mt-0.5 truncate">{h.gods}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-indigo-400">144</p>
                <p className="text-[10px] text-foreground/40">Total Spheres × 1,400 Agents × 17,000 READMEs × 430 Native Tools</p>
                <p className="text-[9px] text-foreground/25 mt-1">All languages shared for maximum interoperability</p>
              </div>
            </motion.div>
          )}

          {/* ── Constitution ── */}
          {tab === "constitution" && (
            <motion.div key="constitution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mb-2">
                <p className="text-[10px] text-amber-300 font-semibold mb-1">Constitutional Framework</p>
                <p className="text-[9px] text-foreground/40">
                  15 rules governing all operations. Active rules are enforced at runtime.
                  Proposed rules await Council ratification (Session #116).
                </p>
              </div>
              {constitutionalRules.map(r => (
                <div key={r.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-amber-400">R{r.id.toString().padStart(2, "0")}</span>
                      <p className="text-[10px] font-semibold text-foreground/70">{r.name}</p>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded border ${
                      r.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/10"
                    }`}>{r.status}</span>
                  </div>
                  <p className="text-[9px] text-foreground/35">{r.description}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Providers ── */}
          {tab === "providers" && (
            <motion.div key="providers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-3">
                <p className="text-[10px] text-orange-300 font-semibold mb-1">Provider Integration Map</p>
                <p className="text-[9px] text-foreground/40">
                  6 providers integrated under constitutional governance. No provider exceeds the 47% sovereignty cap (Rule 7).
                  All provider data flows through the Constitutional Abstraction Layer before reaching user-facing apps.
                </p>
              </div>
              {providers.map((p, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                      <p className="text-[11px] font-semibold text-foreground/80">{p.name}</p>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${
                        p.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/10"
                      }`}>{p.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: p.color }}>{p.weight}%</p>
                      <p className="text-[8px] text-foreground/25">system weight</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.services.map((s, j) => (
                      <span key={j} className="text-[8px] px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.02] text-foreground/40">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      <span className="text-[8px] text-emerald-400">{p.sovereignty}</span>
                    </div>
                    <div className="h-1.5 flex-1 mx-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${(p.weight / 47) * 100}%`,
                        background: p.weight > 40 ? "#ef4444" : p.color,
                      }} />
                    </div>
                    <span className="text-[8px] text-foreground/25">/ 47% cap</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Health Invariants ── */}
          {tab === "invariants" && (
            <motion.div key="invariants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 mb-2">
                <p className="text-[10px] text-red-300 font-semibold mb-1">Health Invariants (INV-1 through INV-20)</p>
                <p className="text-[9px] text-foreground/40">
                  Non-negotiable safety constraints. These cannot be overridden by any Council vote,
                  provider integration, or even Sovereign emergency powers (except INV-16 Emergency Override).
                  All 20 are currently enforced.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {healthInvariants.map(inv => (
                  <div key={inv.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono text-red-400">{inv.id}</span>
                        <p className="text-[9px] font-semibold text-foreground/70 truncate">{inv.name}</p>
                      </div>
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <p className="text-[8px] text-foreground/30 line-clamp-2">{inv.description}</p>
                    <span className={`text-[7px] mt-1 inline-block px-1 py-0.5 rounded ${
                      inv.severity === "critical" ? "bg-red-500/10 text-red-400" :
                      inv.severity === "high" ? "bg-amber-500/10 text-amber-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}>{inv.severity}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Convergence ── */}
          {tab === "convergence" && (
            <motion.div key="convergence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3">
                <p className="text-[10px] text-indigo-300 font-semibold mb-1">Field Convergence — Where Everything Meets</p>
                <p className="text-[9px] text-foreground/40">
                  The Unified Field Theory predicts convergence points where multiple fields intersect.
                  These are the most powerful capabilities of Aluminum OS — where cognitive, constitutional,
                  health, neuromorphic, and provider fields combine to create emergent behaviors impossible
                  in any single system.
                </p>
              </div>
              {[
                { name: "Constitutional Health Consensus", fields: ["Constitutional", "Health", "Council"], description: "INV-20 + Rule 3 + 10 attention heads = medical decisions that are safe, democratic, and multi-model verified. No single AI can make a health recommendation alone.", color: "#ef4444", strength: 97 },
                { name: "Regenerative Neuromorphic Compute", fields: ["Regenerative", "Neuromorphic", "Cognitive"], description: "Self-healing spiking networks that learn in real-time. When a neuron cluster fails, the mycelium network reroutes through coral reef allocation. Zero downtime, zero wasted energy.", color: "#00ff88", strength: 91 },
                { name: "Provider-Sovereign Data Bridge", fields: ["Provider", "Constitutional", "Interop"], description: "All 6 providers' data flows through the Constitutional Abstraction Layer. The 47% cap ensures no monopoly. E2E encryption ensures no provider sees another's data. The Sovereign sees everything.", color: "#f97316", strength: 88 },
                { name: "Council Attention Routing", fields: ["Council", "Neuromorphic", "Cognitive"], description: "10 AI models operating as attention heads in a spiking neural network. Queries route to the model with the highest domain expertise. Consensus is weighted by trust scores. Manus orchestrates.", color: "#8b5cf6", strength: 94 },
                { name: "Atlas Lattice Knowledge Graph", fields: ["Cognitive", "Constitutional", "Health"], description: "144 spheres × 17,000 READMEs × 430 native tools = the complete knowledge graph. Every sphere maps to a periodic element and mythological god. All languages shared for maximum interoperability.", color: "#00d4ff", strength: 96 },
                { name: "Find My Life × Health × Security", fields: ["Interop", "Health", "Provider"], description: "Device tethering (Phone/Watch/Glasses) monitors physical perimeter. If separation detected, health data access is suspended until biometric re-verification. Ring/Blink provides physical security layer.", color: "#fbbf24", strength: 82 },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/[0.02] border border-white/5 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-foreground/80">{c.name}</p>
                    <p className="text-lg font-bold" style={{ color: c.color }}>{c.strength}%</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {c.fields.map((f, j) => (
                      <span key={j} className="text-[8px] px-1.5 py-0.5 rounded border border-indigo-500/10 bg-indigo-500/5 text-indigo-300">{f}</span>
                    ))}
                  </div>
                  <p className="text-[9px] text-foreground/35">{c.description}</p>
                  <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.strength}%`, background: c.color }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
