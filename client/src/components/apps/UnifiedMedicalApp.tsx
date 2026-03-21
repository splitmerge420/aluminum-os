/* Layer 5: Unified UI Synthesis — "The Pandora Flow"
 * Design: Obsidian Glass — single medical interface wrapping:
 *   - Amazon Health / One Medical
 *   - Epic / MyChart
 *   - Microsoft / Teams Health
 * Constitutional Abstraction Layer: every cross-provider data access
 * is logged to the Audit Ledger with patient consent verification.
 * Gemini spec: "One medical interface that wraps One Medical, MyChart,
 * and Teams into a single, clean Pandora-style flow."
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Provider Definitions ─── */
interface Provider {
  id: string;
  name: string;
  parent: string;
  color: string;
  icon: string;
  status: "connected" | "syncing" | "pending" | "error";
  lastSync: string;
  records: number;
  features: string[];
}

interface PatientRecord {
  id: string;
  type: "vitals" | "appointment" | "medication" | "lab" | "message" | "imaging" | "procedure" | "note";
  provider: string;
  title: string;
  timestamp: string;
  priority: "routine" | "urgent" | "critical";
  data: Record<string, string>;
  consentVerified: boolean;
  auditHash: string;
}

interface ConsentGate {
  id: string;
  provider: string;
  dataType: string;
  granted: boolean;
  grantedAt: string;
  expiresAt: string;
  constitutionalRule: string;
}

const providers: Provider[] = [
  {
    id: "amazon",
    name: "One Medical",
    parent: "Amazon Health",
    color: "#ff9900",
    icon: "🏥",
    status: "connected",
    lastSync: "2 min ago",
    records: 847,
    features: ["Primary Care", "Virtual Visits", "Rx Management", "Lab Orders", "Alexa+ Health"],
  },
  {
    id: "epic",
    name: "MyChart",
    parent: "Epic Systems",
    color: "#7b2d8e",
    icon: "📋",
    status: "connected",
    lastSync: "5 min ago",
    records: 2341,
    features: ["EHR Records", "Specialist Notes", "Imaging", "Procedures", "Care Plans"],
  },
  {
    id: "microsoft",
    name: "Teams Health",
    parent: "Microsoft Health",
    color: "#0078d4",
    icon: "💬",
    status: "connected",
    lastSync: "1 min ago",
    records: 156,
    features: ["Telehealth", "Care Team Chat", "Copilot Clinical", "Scheduling", "Secure Messaging"],
  },
];

/* ─── Unified Patient Timeline ─── */
const unifiedTimeline: PatientRecord[] = [
  {
    id: "r1", type: "vitals", provider: "amazon", title: "Morning Vitals Check",
    timestamp: "Today, 8:15 AM", priority: "routine",
    data: { heartRate: "72 bpm", bp: "118/76", spO2: "98%", temp: "98.4°F", glucose: "94 mg/dL" },
    consentVerified: true, auditHash: "0xa3f7...c912",
  },
  {
    id: "r2", type: "message", provider: "microsoft", title: "Dr. Chen — Follow-up on Lab Results",
    timestamp: "Today, 9:30 AM", priority: "urgent",
    data: { from: "Dr. Sarah Chen, MD", preview: "Your lipid panel results are in. LDL is slightly elevated at 142. Let's discuss adjustments to your care plan...", channel: "Teams Health Secure" },
    consentVerified: true, auditHash: "0xb8e2...d447",
  },
  {
    id: "r3", type: "lab", provider: "epic", title: "Comprehensive Metabolic Panel",
    timestamp: "Yesterday, 2:00 PM", priority: "routine",
    data: { glucose: "94 mg/dL ✓", bun: "15 mg/dL ✓", creatinine: "0.9 mg/dL ✓", sodium: "140 mEq/L ✓", potassium: "4.2 mEq/L ✓", calcium: "9.5 mg/dL ✓", totalProtein: "7.1 g/dL ✓", albumin: "4.3 g/dL ✓" },
    consentVerified: true, auditHash: "0xc1d9...e883",
  },
  {
    id: "r4", type: "appointment", provider: "amazon", title: "Annual Physical — Dr. Patel",
    timestamp: "Mar 22, 10:00 AM", priority: "routine",
    data: { provider: "Dr. Raj Patel, DO", location: "One Medical — Downtown", type: "In-Person", duration: "45 min", prep: "Fasting 12hr, bring medication list" },
    consentVerified: true, auditHash: "0xd4a6...f221",
  },
  {
    id: "r5", type: "medication", provider: "epic", title: "Medication Reconciliation",
    timestamp: "Mar 14, 11:00 AM", priority: "routine",
    data: { med1: "Atorvastatin 20mg — daily (active)", med2: "Lisinopril 10mg — daily (active)", med3: "Vitamin D3 2000IU — daily (OTC)", med4: "Metformin 500mg — discontinued Mar 1", interactions: "None detected", nextRefill: "Mar 28" },
    consentVerified: true, auditHash: "0xe5b3...a667",
  },
  {
    id: "r6", type: "imaging", provider: "epic", title: "Chest X-Ray — PA & Lateral",
    timestamp: "Mar 10, 3:30 PM", priority: "routine",
    data: { facility: "Regional Medical Center", radiologist: "Dr. Kim, MD", finding: "No acute cardiopulmonary abnormality", comparison: "Prior study Dec 2025 — unchanged", recommendation: "Routine follow-up" },
    consentVerified: true, auditHash: "0xf6c4...b998",
  },
  {
    id: "r7", type: "procedure", provider: "epic", title: "Colonoscopy — Screening",
    timestamp: "Feb 28, 7:00 AM", priority: "routine",
    data: { surgeon: "Dr. Williams, MD", facility: "GI Associates", finding: "Normal — no polyps", nextScreening: "10 years (2036)", anesthesia: "Propofol — no complications" },
    consentVerified: true, auditHash: "0xa7d5...c119",
  },
  {
    id: "r8", type: "note", provider: "microsoft", title: "Care Team Huddle — Wellness Plan",
    timestamp: "Feb 25, 4:00 PM", priority: "routine",
    data: { participants: "Dr. Chen, Dr. Patel, Nutritionist Kim, PT Johnson", summary: "Patient progressing well on cardiovascular wellness plan. LDL trending down. Exercise compliance at 85%. Recommend continuing current regimen with quarterly check-ins.", nextReview: "May 2026" },
    consentVerified: true, auditHash: "0xb8e6...d220",
  },
];

/* ─── Consent Gates ─── */
const consentGates: ConsentGate[] = [
  { id: "c1", provider: "amazon", dataType: "Vitals & Biometrics", granted: true, grantedAt: "Jan 15, 2026", expiresAt: "Jan 15, 2027", constitutionalRule: "Rule #1: Patient Primacy" },
  { id: "c2", provider: "epic", dataType: "EHR Records & Labs", granted: true, grantedAt: "Jan 15, 2026", expiresAt: "Jan 15, 2027", constitutionalRule: "Rule #1: Patient Primacy" },
  { id: "c3", provider: "microsoft", dataType: "Telehealth & Messages", granted: true, grantedAt: "Jan 15, 2026", expiresAt: "Jan 15, 2027", constitutionalRule: "Rule #1: Patient Primacy" },
  { id: "c4", provider: "amazon", dataType: "Alexa+ Health Voice Data", granted: false, grantedAt: "—", expiresAt: "—", constitutionalRule: "Rule #3: Explicit Consent Required" },
  { id: "c5", provider: "epic", dataType: "Research Data Sharing", granted: false, grantedAt: "—", expiresAt: "—", constitutionalRule: "Rule #3: Explicit Consent Required" },
  { id: "c6", provider: "microsoft", dataType: "Copilot Clinical Analysis", granted: true, grantedAt: "Feb 1, 2026", expiresAt: "Aug 1, 2026", constitutionalRule: "Rule #7: AI Advisory Only" },
];

/* ─── Council Delegation Map ─── */
const councilDelegation = [
  { model: "Claude", role: "Clinical Reasoning", color: "#cc785c", task: "Synthesizes cross-provider records into unified clinical narrative" },
  { model: "Gemini", role: "Pattern Recognition", color: "#4285f4", task: "Detects anomalies across provider data streams, flags inconsistencies" },
  { model: "Copilot", role: "EHR Integration", color: "#0078d4", task: "Manages Epic/MyChart FHIR queries and Microsoft Health interop" },
  { model: "Grok", role: "Fraud Detection", color: "#1da1f2", task: "Real-time billing-vs-clinical reconciliation across all providers" },
  { model: "DeepSeek", role: "Data Normalization", color: "#00d4aa", task: "Normalizes disparate data formats into Aluminum OS schema" },
];

/* ─── Component ─── */
type Tab = "timeline" | "providers" | "consent" | "council" | "insights";
type RecordFilter = "all" | "vitals" | "appointment" | "medication" | "lab" | "message" | "imaging" | "procedure" | "note";

export default function UnifiedMedicalApp() {
  const [tab, setTab] = useState<Tab>("timeline");
  const [filter, setFilter] = useState<RecordFilter>("all");
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [consentModal, setConsentModal] = useState<ConsentGate | null>(null);
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate audit logging
  useEffect(() => {
    const entry = `[${new Date().toISOString()}] Layer 5 session started — Constitutional Abstraction Layer active`;
    setAuditLog(prev => [entry, ...prev].slice(0, 50));
  }, []);

  const logAudit = (action: string) => {
    const entry = `[${new Date().toISOString()}] ${action}`;
    setAuditLog(prev => [entry, ...prev].slice(0, 50));
  };

  const filteredRecords = unifiedTimeline.filter(r => {
    if (filter !== "all" && r.type !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q) ||
        Object.values(r.data).some(v => v.toLowerCase().includes(q));
    }
    return true;
  });

  const getProviderColor = (id: string) => providers.find(p => p.id === id)?.color ?? "#666";
  const getProviderName = (id: string) => providers.find(p => p.id === id)?.name ?? id;

  const typeIcons: Record<string, string> = {
    vitals: "❤️", appointment: "📅", medication: "💊", lab: "🧪",
    message: "💬", imaging: "📷", procedure: "🔬", note: "📝",
  };

  const priorityColors: Record<string, string> = {
    routine: "text-emerald-400", urgent: "text-amber-400", critical: "text-red-400",
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "timeline", label: "Timeline", icon: "📊" },
    { id: "providers", label: "Providers", icon: "🏥" },
    { id: "consent", label: "Consent", icon: "🔐" },
    { id: "council", label: "AI Council", icon: "🧠" },
    { id: "insights", label: "Insights", icon: "💡" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] text-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-sm">
              🌐
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide">Layer 5 — Unified Medical Shell</h1>
              <p className="text-[10px] text-white/40 font-mono">Constitutional Abstraction Layer • Pandora Flow</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {providers.map(p => (
              <div key={p.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono"
                style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, color: p.color }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {p.name}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                tab === t.id
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}>
              <span className="mr-1">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {tab === "timeline" && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              {/* Search + Filter */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <input type="text" placeholder="Search across all providers..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xs">⌘K</span>
                </div>
                <select value={filter} onChange={e => setFilter(e.target.value as RecordFilter)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/70 focus:outline-none">
                  <option value="all">All Types</option>
                  <option value="vitals">Vitals</option>
                  <option value="appointment">Appointments</option>
                  <option value="medication">Medications</option>
                  <option value="lab">Labs</option>
                  <option value="message">Messages</option>
                  <option value="imaging">Imaging</option>
                  <option value="procedure">Procedures</option>
                  <option value="note">Notes</option>
                </select>
              </div>

              {/* Provider Summary Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {providers.map(p => (
                  <div key={p.id} className="rounded-lg p-3 border transition-all hover:scale-[1.02] cursor-pointer"
                    style={{ background: `${p.color}08`, borderColor: `${p.color}20` }}
                    onClick={() => { setTab("providers"); logAudit(`Viewed provider: ${p.name}`); }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{p.icon}</span>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: p.color }} />
                    </div>
                    <p className="text-xs font-semibold" style={{ color: p.color }}>{p.name}</p>
                    <p className="text-[10px] text-white/30">{p.parent}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-white/40">{p.records.toLocaleString()} records</span>
                      <span className="text-[10px] text-white/30">Synced {p.lastSync}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unified Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Unified Patient Timeline</h2>
                  <span className="text-[10px] text-white/30 font-mono">{filteredRecords.length} records</span>
                </div>
                {filteredRecords.map((record, i) => (
                  <motion.div key={record.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { setSelectedRecord(record); logAudit(`Accessed record: ${record.title} [${record.auditHash}]`); }}
                    className="group rounded-lg p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-all">
                    <div className="flex items-start gap-3">
                      {/* Provider indicator */}
                      <div className="flex-shrink-0 w-1 h-full rounded-full self-stretch" style={{ background: getProviderColor(record.provider) }} />
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                        {typeIcons[record.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-white/90 truncate">{record.title}</span>
                          <span className={`text-[9px] font-mono ${priorityColors[record.priority]}`}>
                            {record.priority !== "routine" && `● ${record.priority.toUpperCase()}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40">
                          <span style={{ color: getProviderColor(record.provider) }}>{getProviderName(record.provider)}</span>
                          <span>•</span>
                          <span>{record.timestamp}</span>
                          <span>•</span>
                          <span className="font-mono text-emerald-400/60">✓ Consent verified</span>
                        </div>
                        {/* Quick data preview */}
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {Object.entries(record.data).slice(0, 3).map(([k, v]) => (
                            <span key={k} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-white/50 font-mono">
                              {v.length > 40 ? v.slice(0, 40) + "..." : v}
                            </span>
                          ))}
                          {Object.keys(record.data).length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-white/30">
                              +{Object.keys(record.data).length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-[9px] font-mono text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        {record.auditHash}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "providers" && (
            <motion.div key="providers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="space-y-4">
                {providers.map(p => (
                  <div key={p.id} className="rounded-xl p-4 border" style={{ background: `${p.color}05`, borderColor: `${p.color}15` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                          {p.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold" style={{ color: p.color }}>{p.name}</h3>
                          <p className="text-[10px] text-white/40">{p.parent} • {p.records.toLocaleString()} records</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono"
                          style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>
                          ● {p.status}
                        </span>
                        <span className="text-[10px] text-white/30">Synced {p.lastSync}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.features.map(f => (
                        <span key={f} className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-white/50 border border-white/5">
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Connection Health */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Latency", value: `${Math.floor(Math.random() * 50 + 20)}ms`, ok: true },
                        { label: "Uptime", value: "99.97%", ok: true },
                        { label: "FHIR R4", value: "Compliant", ok: true },
                        { label: "Consent", value: "Active", ok: true },
                      ].map(m => (
                        <div key={m.label} className="rounded-lg p-2 bg-white/[0.03] border border-white/5 text-center">
                          <p className="text-[9px] text-white/30 mb-0.5">{m.label}</p>
                          <p className={`text-xs font-mono ${m.ok ? "text-emerald-400" : "text-red-400"}`}>{m.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Data Flow Diagram */}
                    <div className="mt-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <p className="text-[9px] text-white/30 mb-1 font-mono">DATA FLOW</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
                        <span style={{ color: p.color }}>{p.name}</span>
                        <span className="text-white/20">→</span>
                        <span className="text-cyan-400/60">FHIR R4</span>
                        <span className="text-white/20">→</span>
                        <span className="text-emerald-400/60">Consent Gate</span>
                        <span className="text-white/20">→</span>
                        <span className="text-purple-400/60">Normalizer</span>
                        <span className="text-white/20">→</span>
                        <span className="text-amber-400/60">Audit Ledger</span>
                        <span className="text-white/20">→</span>
                        <span className="text-white/70">Unified Timeline</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Constitutional Abstraction Layer */}
                <div className="rounded-xl p-4 border border-cyan-500/15 bg-cyan-500/[0.03]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">🛡️</span>
                    <h3 className="text-sm font-semibold text-cyan-400">Constitutional Abstraction Layer</h3>
                  </div>
                  <p className="text-[11px] text-white/50 mb-3">
                    Every data access between providers passes through the Constitutional Abstraction Layer.
                    No provider can see another provider's raw data. The patient sees a unified view.
                    The Audit Ledger records every cross-provider query with cryptographic proof.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Cross-Provider Queries Today", value: "1,247", color: "#00d4ff" },
                      { label: "Consent Verifications", value: "1,247", color: "#00ff88" },
                      { label: "Audit Entries", value: "3,741", color: "#ffd700" },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg p-2 bg-white/[0.03] border border-white/5 text-center">
                        <p className="text-[9px] text-white/30 mb-0.5">{s.label}</p>
                        <p className="text-sm font-mono font-semibold" style={{ color: s.color }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "consent" && (
            <motion.div key="consent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <span>🔐</span>
                  <h3 className="text-xs font-semibold text-emerald-400">Patient Consent Dashboard</h3>
                </div>
                <p className="text-[10px] text-white/40">
                  Constitutional Rule #1: Patient Primacy — You control exactly what data each provider can access.
                  Every consent is revocable in real-time. Revocation propagates within 500ms.
                </p>
              </div>

              <div className="space-y-2">
                {consentGates.map(gate => (
                  <div key={gate.id} className="rounded-lg p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full" style={{ background: gate.granted ? "#00ff88" : "#ff4444" }} />
                        <div>
                          <p className="text-xs font-medium text-white/80">{gate.dataType}</p>
                          <p className="text-[10px] text-white/40">
                            <span style={{ color: getProviderColor(gate.provider) }}>{getProviderName(gate.provider)}</span>
                            {" • "}{gate.constitutionalRule}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[10px] text-white/30">
                            {gate.granted ? `Granted ${gate.grantedAt}` : "Not granted"}
                          </p>
                          {gate.granted && (
                            <p className="text-[9px] text-white/20">Expires {gate.expiresAt}</p>
                          )}
                        </div>
                        <button
                          onClick={() => { setConsentModal(gate); logAudit(`Consent review: ${gate.dataType} [${gate.provider}]`); }}
                          className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all ${
                            gate.granted
                              ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                          }`}>
                          {gate.granted ? "Revoke" : "Grant"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Audit Trail */}
              <div className="mt-4 rounded-lg p-3 border border-white/5 bg-white/[0.02]">
                <h3 className="text-xs font-semibold text-white/60 mb-2">Recent Consent Audit Trail</h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {auditLog.slice(0, 10).map((entry, i) => (
                    <p key={i} className="text-[9px] font-mono text-white/30">{entry}</p>
                  ))}
                  {auditLog.length === 0 && (
                    <p className="text-[9px] text-white/20 italic">No audit entries this session</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "council" && (
            <motion.div key="council" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="mb-4 p-3 rounded-lg bg-purple-500/[0.05] border border-purple-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <span>🧠</span>
                  <h3 className="text-xs font-semibold text-purple-400">AI Council Medical Delegation</h3>
                </div>
                <p className="text-[10px] text-white/40">
                  Each Council member has a specialized role in the Unified Medical Shell.
                  INV-20: Clinical recommendations require minimum 3 models at 70% consensus.
                  Rights-restricting decisions require 5 models at 85% + human-in-the-loop.
                </p>
              </div>

              <div className="space-y-3">
                {councilDelegation.map((member, i) => (
                  <motion.div key={member.model}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-lg p-3 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: `${member.color}20`, border: `2px solid ${member.color}40`, color: member.color }}>
                        {member.model[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: member.color }}>{member.model}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-white/40">{member.role}</span>
                        </div>
                        <p className="text-[10px] text-white/40 mt-0.5">{member.task}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ● Active
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Consensus Tiers */}
              <div className="mt-4 rounded-lg p-3 border border-amber-500/15 bg-amber-500/[0.03]">
                <h3 className="text-xs font-semibold text-amber-400 mb-2">HealthConsensusRequirement Tiers (INV-20)</h3>
                <div className="space-y-2">
                  {[
                    { tier: "Tier 1", label: "Informational", req: "Single model", threshold: "N/A", color: "#22c55e" },
                    { tier: "Tier 2", label: "Clinical Recommendation", req: "Min 3 models", threshold: "70% consensus", color: "#f59e0b" },
                    { tier: "Tier 3", label: "Rights-Restricting", req: "Min 5 models", threshold: "85% + HITL 60s", color: "#ef4444" },
                  ].map(t => (
                    <div key={t.tier} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                      <div className="w-1.5 h-8 rounded-full" style={{ background: t.color }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold" style={{ color: t.color }}>{t.tier}</span>
                          <span className="text-[10px] text-white/50">{t.label}</span>
                        </div>
                        <p className="text-[9px] text-white/30">{t.req} • {t.threshold}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "insights" && (
            <motion.div key="insights" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              {/* Health Score */}
              <div className="rounded-xl p-4 border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.05] to-purple-500/[0.05] mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white/80">Unified Health Score</h3>
                    <p className="text-[10px] text-white/40">Synthesized across all 3 providers by Council consensus</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-cyan-400 font-mono">87</p>
                    <p className="text-[9px] text-emerald-400">↑ 3 from last month</p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: "Cardiac", score: 91, color: "#ef4444" },
                    { label: "Metabolic", score: 84, color: "#f59e0b" },
                    { label: "Musculoskeletal", score: 88, color: "#22c55e" },
                    { label: "Mental", score: 82, color: "#a855f7" },
                    { label: "Preventive", score: 92, color: "#00d4ff" },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="w-full h-1 rounded-full bg-white/5 mb-1">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.score}%`, background: s.color }} />
                      </div>
                      <p className="text-[9px] text-white/40">{s.label}</p>
                      <p className="text-xs font-mono" style={{ color: s.color }}>{s.score}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Council-Generated Insights</h3>
                {[
                  {
                    model: "Claude", color: "#cc785c", icon: "📊",
                    insight: "Cross-provider analysis shows LDL trending downward over 6 months (168 → 142 mg/dL). Current statin dosage is effective. Recommend maintaining Atorvastatin 20mg and rechecking in 3 months.",
                    confidence: "92%", tier: "Tier 2",
                  },
                  {
                    model: "Gemini", color: "#4285f4", icon: "🔍",
                    insight: "Pattern detected: Your One Medical vitals show morning BP readings 8-12 points lower than MyChart clinic readings. This is consistent with white-coat hypertension. Home monitoring data from Pixel Watch confirms lower baseline.",
                    confidence: "87%", tier: "Tier 1",
                  },
                  {
                    model: "Grok", color: "#1da1f2", icon: "💰",
                    insight: "Billing audit: Your last colonoscopy was billed at $4,200 (CPT 45378). Regional average is $2,800. The facility charge ($1,900) exceeds the 90th percentile. Flagged for review — potential overbilling.",
                    confidence: "94%", tier: "Tier 1",
                  },
                  {
                    model: "Copilot", color: "#0078d4", icon: "📅",
                    insight: "Care plan coordination: Your annual physical with Dr. Patel (Mar 22) should include lipid panel follow-up per Dr. Chen's recommendation. I've pre-populated the lab order in MyChart pending your approval.",
                    confidence: "96%", tier: "Tier 2",
                  },
                  {
                    model: "DeepSeek", color: "#00d4aa", icon: "🧬",
                    insight: "Data normalization complete: Merged 3,344 records across 3 providers. 47 duplicate entries resolved. 12 conflicting medication records reconciled (all resolved to current active list). Schema parity: 99.6%.",
                    confidence: "99%", tier: "Tier 1",
                  },
                ].map((item, i) => (
                  <motion.div key={item.model}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-lg p-3 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ background: `${item.color}20`, color: item.color }}>
                        {item.model[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold" style={{ color: item.color }}>{item.model}</span>
                          <span className="px-1 py-0.5 rounded text-[8px] bg-white/5 text-white/30">{item.tier}</span>
                          <span className="text-[9px] font-mono text-emerald-400/60">{item.confidence} confidence</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">{item.insight}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Record Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRecord(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-xl bg-[#0d1117] border border-white/10 p-4 max-h-[80%] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{typeIcons[selectedRecord.type]}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white/90">{selectedRecord.title}</h3>
                    <p className="text-[10px] text-white/40">
                      <span style={{ color: getProviderColor(selectedRecord.provider) }}>{getProviderName(selectedRecord.provider)}</span>
                      {" • "}{selectedRecord.timestamp}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-white/40 hover:text-white/60 text-xs">✕</button>
              </div>

              {/* Record Data */}
              <div className="space-y-1.5 mb-3">
                {Object.entries(selectedRecord.data).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-[10px] text-white/30 font-mono min-w-[100px] capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <span className="text-[11px] text-white/70">{value}</span>
                  </div>
                ))}
              </div>

              {/* Audit Info */}
              <div className="p-2 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-emerald-400 font-mono">✓ Constitutional Audit</span>
                  <span className="text-[9px] text-white/20 font-mono">{selectedRecord.auditHash}</span>
                </div>
                <p className="text-[9px] text-white/30 mt-0.5">Consent verified • Logged to immutable ledger • Patient-queryable</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consent Modal */}
      <AnimatePresence>
        {consentModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setConsentModal(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-xl bg-[#0d1117] border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔐</span>
                <h3 className="text-sm font-semibold text-white/90">
                  {consentModal.granted ? "Revoke" : "Grant"} Consent
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 mb-3">
                <p className="text-xs text-white/70 mb-1"><strong>Data Type:</strong> {consentModal.dataType}</p>
                <p className="text-xs text-white/70 mb-1">
                  <strong>Provider:</strong>{" "}
                  <span style={{ color: getProviderColor(consentModal.provider) }}>{getProviderName(consentModal.provider)}</span>
                </p>
                <p className="text-xs text-white/70"><strong>Rule:</strong> {consentModal.constitutionalRule}</p>
              </div>
              <p className="text-[10px] text-white/40 mb-3">
                {consentModal.granted
                  ? "Revoking consent will immediately stop this provider from accessing this data type. Propagation: < 500ms. This action is logged to the Audit Ledger."
                  : "Granting consent allows this provider to access this data type under constitutional governance. All access is logged. You can revoke at any time."}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConsentModal(null)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs bg-white/5 text-white/50 hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={() => {
                  logAudit(`Consent ${consentModal.granted ? "REVOKED" : "GRANTED"}: ${consentModal.dataType} [${consentModal.provider}]`);
                  setConsentModal(null);
                }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    consentModal.granted
                      ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                  }`}>
                  {consentModal.granted ? "Revoke Access" : "Grant Access"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Status */}
      <div className="flex-shrink-0 px-4 py-1.5 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[9px] font-mono text-white/25">
          <span>LAYER 5 ACTIVE</span>
          <span>•</span>
          <span>3 PROVIDERS</span>
          <span>•</span>
          <span>3,344 RECORDS</span>
          <span>•</span>
          <span className="text-emerald-400/50">HIPAA 100%</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-white/25">
          <span className="text-cyan-400/50">CONSTITUTIONAL ABSTRACTION LAYER</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
