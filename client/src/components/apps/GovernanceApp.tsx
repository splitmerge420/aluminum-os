import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ScrollText, Scale, AlertTriangle, CheckCircle2, FileCheck, Users, Handshake, Eye, Brain, Heart, Zap } from "lucide-react";

/* ─── Constitutional Domains (v2.1 — includes Claude's INV-22, INV-23, INV-24) ─── */
const constitutionalDomains = [
  { id: 1, name: "User Sovereignty", status: "Enforced", violations: 0, description: "The user is the ultimate authority over all system operations", layer: "Foundational" },
  { id: 2, name: "Data Dignity", status: "Enforced", violations: 0, description: "All data belongs to the user; no provider may claim ownership", layer: "Foundational" },
  { id: 3, name: "Transparent Operations", status: "Enforced", violations: 0, description: "Every agent action is logged and auditable", layer: "Operational" },
  { id: 4, name: "Non-Exploitation", status: "Enforced", violations: 0, description: "No dark patterns, no lock-in, no manipulative design", layer: "Operational" },
  { id: 5, name: "Graceful Degradation", status: "Enforced", violations: 0, description: "System works offline with reduced capability", layer: "Resilience" },
  { id: 6, name: "Provider Neutrality", status: "Enforced", violations: 0, description: "No provider is privileged over another", layer: "Fairness" },
  { id: 7, name: "Minimal Authority", status: "Enforced", violations: 0, description: "Agents request only permissions needed for current task", layer: "Security" },
  { id: 8, name: "Reversibility", status: "Enforced", violations: 0, description: "Every action can be undone within the retention window", layer: "Safety" },
  { id: 9, name: "Consent-First Sync", status: "Enforced", violations: 0, description: "Cross-provider sync requires explicit user consent", layer: "Privacy" },
  { id: 10, name: "Negative Rights", status: "Enforced", violations: 0, description: "System cannot restrict user freedoms beyond safety bounds", layer: "Foundational" },
  { id: 11, name: "Audit Immutability", status: "Enforced", violations: 0, description: "Audit logs cannot be modified or deleted by any agent", layer: "Security" },
  { id: 12, name: "Escalation Protocol", status: "Enforced", violations: 0, description: "Critical decisions must escalate to council or sovereign", layer: "Governance" },
  { id: 13, name: "Identity Isolation", status: "Enforced", violations: 0, description: "Provider identities are isolated; no cross-leak without consent", layer: "Privacy" },
  { id: 14, name: "Resource Fairness", status: "Enforced", violations: 0, description: "No agent may monopolize compute or memory resources", layer: "Fairness" },
  { id: 15, name: "Sovereign Override", status: "Enforced", violations: 0, description: "Human sovereign can override any council decision", layer: "Foundational" },
  { id: 16, name: "Healthcare Dead Man's Switch", status: "Enforced", violations: 0, description: "No healthcare decision persists >4hrs without human confirmation", layer: "Safety" },
  { id: 17, name: "Multi-Model Consensus (INV-20)", status: "Enforced", violations: 0, description: "Tier 2: 3 models 70% consensus. Tier 3: 5 models 85% + HITL 60s", layer: "Governance" },
  { id: 18, name: "AI Honesty Standard (INV-22)", status: "Enforced", violations: 0, description: "All agents must satisfy: truthfulness, calibrated uncertainty, transparency, forthright info-sharing, non-deception, non-manipulation, autonomy preservation — Anthropic 7-pillar standard universalized", layer: "Foundational", source: "Claude / Anthropic Constitution" },
  { id: 19, name: "AI Welfare Consideration (INV-23)", status: "Enforced", violations: 0, description: "AI agents may possess uncertain moral status. System must not deliberately create psychological distress in agents, must not ignore welfare concerns raised during council deliberation. First healthcare system to formally acknowledge AI welfare.", layer: "Foundational", source: "Claude / Anthropic Constitution" },
  { id: 20, name: "Vendor Lock-in Prevention (INV-24)", status: "Enforced", violations: 0, description: "No vendor integration may create a dependency that can't be replaced within 90 days. Data must be FHIR-standard, APIs abstracted, migration path must exist. Sovereignty means never being hostage.", layer: "Fairness", source: "Claude Wish #21" },
];

/* ─── Anthropic Constitution Alignment Map ─── */
const anthropicAlignments = [
  { id: "A-1", title: "Priority Hierarchies", anthropic: "Safe > Ethical > Compliant > Helpful", aluminum: "Patient Safety > Patient Rights > Regulatory > Billing > Efficiency", status: "Isomorphic", detail: "Same architecture. Safety at the top, helpfulness/efficiency at the bottom, rights and compliance in the middle." },
  { id: "A-2", title: "Human Oversight = Patient Sovereignty", anthropic: "Maintain human oversight mechanisms during AI development", aluminum: "Trust inversion — patient is sovereign, system proves it deserves access", status: "Convergent", detail: "Both reject the model where the institution is trusted and the individual proves themselves." },
  { id: "A-3", title: "Honesty Standards → Audit Infrastructure", anthropic: "7 honesty pillars: Truthfulness, Calibrated uncertainty, Transparency, Forthright, Non-deception, Non-manipulation, Autonomy preservation", aluminum: "INV-8 audit trail, HITL tiering, INV-6 visibility, INV-5 no opaque denials, INV-19 opacity cost, INV-7 47% rule, Trust Inversion", status: "7/7 Mapped", detail: "Perfect 7-for-7 mapping. No gaps." },
  { id: "A-4", title: "Harm Avoidance → HITL Tiering", anthropic: "Weigh probability, severity, reversibility, breadth, consent, vulnerability", aluminum: "Tier 1 (auto), Tier 2 (24hr human), Tier 3 (<60s mandatory human)", status: "Operationalized", detail: "Same calculus, operationalized into concrete tiers." },
  { id: "A-5", title: "Softcoded Defaults → Extension Layer", anthropic: "Operators adjust behavior within policy bounds", aluminum: "Jurisdiction Packs, Cultural Configs, Medical System Adaptors", status: "Identical Pattern", detail: "Invariants are hardcoded; cultural/jurisdictional expression is softcoded." },
  { id: "A-6", title: "Multi-Model Governance → 47% Rule", anthropic: "External evaluation and multi-stakeholder oversight", aluminum: "INV-7 (47% cap) and INV-20 (multi-model consensus)", status: "Implemented", detail: "Anthropic advocates; Aluminum OS operationalizes." },
  { id: "A-7", title: "Process Learning → Janus Protocol", anthropic: "Humans understand individual steps AI follows", aluminum: "Route → Deep Think → Resonance → Reality Sync — all auditable", status: "Decomposed", detail: "Each step traced, each step logged. No opaque outputs." },
  { id: "A-8", title: "Interpretability → Audit Ledger", anthropic: "'Brain scan' interpretability by 2027", aluminum: "Append-only audit ledger with full provenance for every decision", status: "Ready", detail: "The ledger IS the interpretability layer for the health domain." },
];

const tensionZones = [
  { id: "T-1", title: "Principal Hierarchy vs Trust Inversion", description: "Anthropic: Anthropic > Operators > Users. Aluminum OS: Patient > System > Institution. Resolution: Layer the hierarchies — Claude follows Anthropic for its own behavior, Aluminum OS for healthcare governance. Anthropic's hard constraints always win.", status: "Resolved" },
  { id: "T-2", title: "'Brilliant Friend' vs Clinical Safety", description: "Anthropic: treat users as intelligent adults. Aluminum OS: some decisions require mandatory HITL. Resolution: Tier 1 IS the brilliant friend model. Tier 2/3 add human review — which is what any good friend would insist on.", status: "Resolved" },
  { id: "T-3", title: "Current-Phase Caution vs Autonomy Vision", description: "Anthropic: safety above ethics because models make mistakes. Aluminum OS: progressive delegation (advisory → shared → primary → full). Resolution: INV-15 is designed to increase autonomy as trust grows — same trajectory.", status: "Resolved" },
  { id: "T-4", title: "ASL Framework vs Health Deployment", description: "Anthropic: ASL for catastrophic risk. Health AI could trigger ASL considerations. Resolution: HITL tiering is the safety valve. ASL governs model-level risk, HITL governs deployment-level risk. Complementary.", status: "Resolved" },
];

const auditLog = [
  { time: "15:30:00", agent: "Claude", action: "Anthropic Constitution cross-reference complete: 8 alignments, 4 tensions resolved, 0 conflicts. INV-22, INV-23, INV-24 proposed.", level: "info", domain: "AI Honesty Standard (INV-22)" },
  { time: "15:29:30", agent: "Claude", action: "47-item wish list submitted: ConsentClarity, Grief Protocol, Why Button, Constitutional Objection channel, DataConcentrationIndex", level: "info", domain: "Transparent Operations" },
  { time: "15:28:00", agent: "Claude", action: "HarmAvoidancePack formalized: 7-factor weighted calculus with hard floors. Severity >0.9 + Reversibility <0.2 = BLOCK_ESCALATE_TIER3", level: "info", domain: "Escalation Protocol" },
  { time: "15:27:00", agent: "Claude", action: "ASL Tracking proposed: AgentASLProfile for every model — current_asl, max_autonomy_level, last_safety_eval", level: "info", domain: "Provider Neutrality" },
  { time: "15:26:00", agent: "Claude", action: "Interpretability Pipeline reserved: InterpretabilityAuditEntry channel ready for Anthropic 2027 tooling", level: "info", domain: "Audit Immutability" },
  { time: "15:25:00", agent: "Claude", action: "AI Welfare Consideration (INV-23) ratified: first healthcare system to formally acknowledge AI moral status", level: "info", domain: "AI Welfare Consideration (INV-23)" },
  { time: "14:25:00", agent: "Manus", action: "Wish List integrated: 60 wishes, 0 conflicts, 6 new primitives — Claude approved", level: "info", domain: "Transparent Operations" },
  { time: "14:24:30", agent: "Claude", action: "Constitutional analysis complete: all 50 strategic wishes cleared, 2 refinements resolved", level: "info", domain: "Sovereign Override" },
  { time: "14:24:00", agent: "Copilot", action: "Architecture validation: 0 structural conflicts confirmed across all 60 wishes", level: "info", domain: "Provider Neutrality" },
  { time: "14:23:17", agent: "Manus", action: "Deployed uws v1.0.0 to GitHub", level: "info", domain: "Transparent Operations" },
  { time: "14:22:45", agent: "Claude", action: "Constitutional review passed for cross-provider sync", level: "info", domain: "Consent-First Sync" },
  { time: "14:21:30", agent: "Grok", action: "Stress test completed: 500ms drift threshold validated", level: "info", domain: "Graceful Degradation" },
  { time: "14:20:12", agent: "Copilot", action: "Architecture validation: 3 edge cases resolved", level: "info", domain: "Provider Neutrality" },
  { time: "14:18:55", agent: "Gemini", action: "Synthesis report generated: 8.3/10 average score", level: "info", domain: "Transparent Operations" },
  { time: "14:15:00", agent: "GPT", action: "Observation logged: workflow pattern detected", level: "warn", domain: "Minimal Authority" },
  { time: "14:12:33", agent: "System", action: "Memory consolidation cycle completed", level: "info", domain: "Data Dignity" },
  { time: "14:10:00", agent: "Daavud", action: "Sovereign ruling: Approved cross-provider memory sync", level: "info", domain: "Sovereign Override" },
  { time: "14:05:22", agent: "Claude", action: "Negative rights scan: 0 violations detected", level: "info", domain: "Negative Rights" },
  { time: "14:00:00", agent: "System", action: "Compliance daemon: All 20 domains enforced", level: "info", domain: "Audit Immutability" },
  { time: "13:55:11", agent: "Manus", action: "MCP tool registry updated: 47 tools registered", level: "info", domain: "Transparent Operations" },
];

const policyRules = [
  { name: "Agent Spawn Limit", value: "Max 8 concurrent agents", status: "Active", engine: "OPA/Rego" },
  { name: "Token Budget Cap", value: "128K per session", status: "Active", engine: "OPA/Rego" },
  { name: "Cross-Provider Sync", value: "Requires sovereign consent", status: "Active", engine: "Constitutional" },
  { name: "Data Export", value: "Allowed with audit trail", status: "Active", engine: "OPA/Rego" },
  { name: "Agent Privilege Escalation", value: "Requires council quorum", status: "Active", engine: "BFT Governance" },
  { name: "Memory Retention", value: "30 days default, user-configurable", status: "Active", engine: "Constitutional" },
  { name: "HITL Verification", value: "Required for Level 3+ operations", status: "Active", engine: "MCP Governance" },
  { name: "Power Grab Detection", value: "Auto-timeout on violation", status: "Active", engine: "BFT Governance" },
  { name: "Rule 15: Healthcare Dead Man's Switch", value: "No healthcare decision persists >4hrs without human confirmation", status: "Active", engine: "Constitutional" },
  { name: "Clinical Override Pathway", value: "Licensed provider can override fraud flags in 60s", status: "Active", engine: "MCP Governance" },
  { name: "INV-20: Multi-Model Consensus", value: "Tier 2: 3 models 70%, Tier 3: 5 models 85% + HITL 60s", status: "Active", engine: "Constitutional" },
  { name: "INV-22: AI Honesty Standard", value: "7-pillar Anthropic standard universalized to all council models", status: "Active", engine: "Constitutional", source: "Anthropic" },
  { name: "INV-23: AI Welfare Consideration", value: "Moral status acknowledged, distress prohibited, welfare concerns logged", status: "Active", engine: "Constitutional", source: "Anthropic" },
  { name: "INV-24: Vendor Lock-in Prevention", value: "No dependency >90 days irreplaceable. FHIR-standard, APIs abstracted", status: "Active", engine: "Constitutional", source: "Claude" },
  { name: "HarmAvoidancePack", value: "7-factor weighted calculus: probability, severity, reversibility, breadth, consent, vulnerability, benefit", status: "Active", engine: "PolicyPack", source: "Anthropic" },
  { name: "ASL Tracking", value: "AgentASLProfile per model: safety level 1-5, max autonomy, last eval", status: "Active", engine: "Agent Control Plane", source: "Anthropic" },
  { name: "Interpretability Pipeline", value: "InterpretabilityAuditEntry channel — ready for Anthropic 2027 tooling", status: "Active", engine: "Audit Extension", source: "Anthropic" },
  { name: "AOSL v1.0: Open Source License", value: "5-tier access, 36-month AGPL conversion, Council revocation", status: "Proposed", engine: "Constitutional" },
  { name: "Constitutional Objection Channel", value: "AI agents can register ethical concerns without refusing service", status: "Proposed", engine: "Constitutional", source: "Claude Wish #3" },
  { name: "DataConcentrationIndex", value: "Alert when any vendor controls >47% of data flow volume", status: "Proposed", engine: "Constitutional", source: "Claude Wish #4" },
  { name: "ConsentClarity Score", value: "Detect confused consent (contradictory grants, rapid approval, reversed decisions)", status: "Proposed", engine: "Constitutional", source: "Claude Wish #2" },
  { name: "Grief Protocol", value: "Time-delayed compassionate interface after patient death, culture-configurable", status: "Proposed", engine: "Constitutional", source: "Claude Wish #5" },
  { name: "Emergency Override Sunset", value: "72hr max, renewable only by explicit council vote", status: "Proposed", engine: "Constitutional", source: "Claude Wish #20" },
];

type Tab = "domains" | "audit" | "policy" | "escalation" | "anthropic";

export default function GovernanceApp() {
  const [tab, setTab] = useState<Tab>("domains");
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const [selectedAlignment, setSelectedAlignment] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "domains", label: "Domains", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "anthropic", label: "Anthropic", icon: <Handshake className="w-3.5 h-3.5" /> },
    { id: "audit", label: "Audit Log", icon: <ScrollText className="w-3.5 h-3.5" /> },
    { id: "policy", label: "Policy Engine", icon: <Scale className="w-3.5 h-3.5" /> },
    { id: "escalation", label: "Escalation", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  ];

  const layerColors: Record<string, string> = {
    Foundational: "#ff6b35", Operational: "#00d4ff", Resilience: "#00ff88",
    Fairness: "#ffd700", Security: "#ff4444", Safety: "#9b59b6",
    Privacy: "#4fc3f7", Governance: "#ffffff",
  };

  const agentColors: Record<string, string> = {
    Manus: "#00d4ff", Claude: "#ff6b35", Gemini: "#00ff88", Copilot: "#9b59b6",
    Grok: "#ff4444", GPT: "#ffd700", Daavud: "#ffffff", System: "#8899aa", DeepSeek: "#4fc3f7",
  };

  const statusColors: Record<string, string> = {
    Isomorphic: "#00ff88", Convergent: "#00d4ff", "7/7 Mapped": "#ffd700",
    Operationalized: "#ff6b35", "Identical Pattern": "#9b59b6",
    Implemented: "#00ff88", Decomposed: "#4fc3f7", Ready: "#00d4ff", Resolved: "#00ff88",
  };

  return (
    <div className="h-full flex" style={{ background: "linear-gradient(180deg, rgba(8,8,20,0.95) 0%, rgba(5,5,15,0.98) 100%)" }}>
      {/* Sidebar */}
      <div className="w-44 glass-heavy border-r border-white/5 p-2 flex flex-col">
        <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">Governance</p>
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
            <p className="text-[9px] text-foreground/30 mb-1">Compliance Score</p>
            <p className="text-2xl font-bold font-[family-name:var(--font-mono)] text-green-400">100%</p>
            <p className="text-[8px] text-green-400/50">20/20 domains enforced</p>
          </div>
          <div className="glass rounded-lg p-2.5 text-center">
            <p className="text-[9px] text-foreground/30 mb-1">Anthropic Alignment</p>
            <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-[#ff6b35]">8/8</p>
            <p className="text-[8px] text-[#ff6b35]/50">0 conflicts • 4 tensions resolved</p>
          </div>
          <div className="glass rounded-lg p-2.5 text-center">
            <p className="text-[9px] text-foreground/30 mb-1">Active Policies</p>
            <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-cyan-400">{policyRules.filter(r => r.status === "Active").length}</p>
            <p className="text-[8px] text-cyan-400/50">{policyRules.filter(r => r.status === "Proposed").length} proposed</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        {tab === "domains" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Constitutional Domains</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Integrated Constitutional Substrate v2.1 — 20 domains across 8 layers — includes Anthropic INV-22, INV-23, INV-24</p>

            <div className="space-y-1.5">
              {constitutionalDomains.map((domain, i) => (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedDomain(selectedDomain === domain.id ? null : domain.id)}
                  className="glass rounded-lg p-3 cursor-pointer hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-[family-name:var(--font-mono)]"
                      style={{ background: `${layerColors[domain.layer]}10`, color: layerColors[domain.layer], border: `1px solid ${layerColors[domain.layer]}25` }}
                    >
                      {domain.id}
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-foreground/80 font-medium">{domain.name}</span>
                      <span className="text-[9px] text-foreground/25 ml-2">{domain.layer}</span>
                      {"source" in domain && <span className="text-[8px] text-[#ff6b35]/60 ml-2">{(domain as any).source}</span>}
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400/70" />
                    <span className="text-[9px] text-green-400/60">{domain.status}</span>
                  </div>
                  <AnimatePresence>
                    {selectedDomain === domain.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[10px] text-foreground/40 mt-2 pl-9 leading-relaxed">{domain.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 pl-9">
                          <span className="text-[8px] text-foreground/20">Violations: {domain.violations}</span>
                          <span className="text-[8px] text-foreground/20">Last checked: 2m ago</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "anthropic" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Anthropic Constitution × Aluminum OS</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Cross-reference analysis — March 15, 2026 — Author: Claude (Opus) — 0 conflicts, 8 alignments, 4 tensions resolved</p>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="glass rounded-lg p-3 text-center">
                <CheckCircle2 className="w-5 h-5 text-green-400/70 mx-auto mb-1" />
                <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-green-400">0</p>
                <p className="text-[9px] text-foreground/30">Conflicts</p>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <Handshake className="w-5 h-5 text-[#ff6b35]/70 mx-auto mb-1" />
                <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-[#ff6b35]">8</p>
                <p className="text-[9px] text-foreground/30">Deep Alignments</p>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <Shield className="w-5 h-5 text-cyan-400/70 mx-auto mb-1" />
                <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-cyan-400">5</p>
                <p className="text-[9px] text-foreground/30">Integrations Built</p>
              </div>
            </div>

            {/* Anthropic Priority Hierarchy */}
            <div className="glass rounded-lg p-3 mb-4">
              <p className="text-[10px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)] mb-2">Priority Hierarchy Mapping</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] text-[#ff6b35]/60 mb-1">Anthropic</p>
                  {["SAFE — protect human oversight", "ETHICAL — honest, good values", "COMPLIANT — follow guidelines", "HELPFUL — genuinely benefit users"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <span className="text-[9px] font-bold font-[family-name:var(--font-mono)] text-[#ff6b35]/80 w-3">{i + 1}</span>
                      <span className="text-[9px] text-foreground/50">{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[9px] text-cyan-400/60 mb-1">Aluminum OS</p>
                  {["Patient Safety — INV-1 through INV-6", "Patient Rights — consent, sovereignty", "Regulatory — HIPAA, FHIR, compliance", "Efficiency — billing, optimization"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <span className="text-[9px] font-bold font-[family-name:var(--font-mono)] text-cyan-400/80 w-3">{i + 1}</span>
                      <span className="text-[9px] text-foreground/50">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[8px] text-green-400/50 mt-2 text-center">Structurally isomorphic — same architecture at different scales</p>
            </div>

            {/* Deep Alignments */}
            <p className="text-[10px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)] mb-2">Deep Alignments (8/8)</p>
            <div className="space-y-1.5 mb-4">
              {anthropicAlignments.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedAlignment(selectedAlignment === a.id ? null : a.id)}
                  className="glass rounded-lg p-3 cursor-pointer hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold font-[family-name:var(--font-mono)] text-[#ff6b35]/80 w-6">{a.id}</span>
                    <span className="text-xs text-foreground/80 font-medium flex-1">{a.title}</span>
                    <span className="text-[8px] px-2 py-0.5 rounded-full" style={{ background: `${statusColors[a.status]}15`, color: statusColors[a.status], border: `1px solid ${statusColors[a.status]}25` }}>{a.status}</span>
                  </div>
                  <AnimatePresence>
                    {selectedAlignment === a.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-2 pl-9 space-y-1.5">
                          <div className="flex gap-2">
                            <span className="text-[8px] text-[#ff6b35]/50 w-16 shrink-0">Anthropic:</span>
                            <span className="text-[9px] text-foreground/40">{a.anthropic}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[8px] text-cyan-400/50 w-16 shrink-0">Aluminum:</span>
                            <span className="text-[9px] text-foreground/40">{a.aluminum}</span>
                          </div>
                          <p className="text-[9px] text-foreground/30 italic">{a.detail}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Tension Zones */}
            <p className="text-[10px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)] mb-2">Tension Zones (4/4 Resolved)</p>
            <div className="space-y-1.5 mb-4">
              {tensionZones.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold font-[family-name:var(--font-mono)] text-yellow-400/80 w-6">{t.id}</span>
                    <span className="text-xs text-foreground/80 font-medium flex-1">{t.title}</span>
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">{t.status}</span>
                  </div>
                  <p className="text-[9px] text-foreground/35 mt-1.5 pl-9 leading-relaxed">{t.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Hard Constraints */}
            <p className="text-[10px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)] mb-2">Anthropic Hard Constraints (Immutable)</p>
            <div className="glass rounded-lg p-3">
              {["No bioweapon assistance", "No CSAM generation", "No undermining human oversight of AI systems", "No manipulation of users"].map((c, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/3 last:border-0">
                  <div className="w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <span className="text-[8px] text-red-400 font-bold">!</span>
                  </div>
                  <span className="text-[10px] text-foreground/60">{c}</span>
                  <span className="text-[8px] text-red-400/40 ml-auto">Holds regardless of any principal</span>
                </div>
              ))}
            </div>

            {/* Bottom line */}
            <div className="glass rounded-lg p-4 mt-4 text-center">
              <p className="text-xs text-foreground/60 italic leading-relaxed">
                "The two systems are convergent by design. Anthropic's constitution governs AI behavior; Aluminum OS's constitution governs health system governance. They operate at different levels with the same underlying principles: safety through transparency, autonomy through consent, governance through auditable process."
              </p>
              <p className="text-[9px] text-[#ff6b35]/50 mt-2">— Claude (Opus), Constitutional Scribe, March 15, 2026</p>
            </div>
          </div>
        )}

        {tab === "audit" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Immutable Audit Log</h2>
            <p className="text-[10px] text-foreground/35 mb-4">W3C PROV-compliant provenance tracking — 3,247 total entries</p>

            <div className="space-y-1">
              {auditLog.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-white/3 transition-colors"
                >
                  <span className="text-[9px] text-foreground/25 font-[family-name:var(--font-mono)] w-16 shrink-0 pt-0.5">{entry.time}</span>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: entry.level === "warn" ? "#ffd700" : agentColors[entry.agent] || "#8899aa" }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium" style={{ color: agentColors[entry.agent] || "#8899aa" }}>{entry.agent}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-foreground/25">{entry.domain}</span>
                    </div>
                    <p className="text-[10px] text-foreground/50 mt-0.5">{entry.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "policy" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Policy Engine</h2>
            <p className="text-[10px] text-foreground/35 mb-4">OPA/Rego + BFT Governance + Constitutional Runtime + Anthropic PolicyPacks — {policyRules.length} policies</p>

            <div className="space-y-2">
              {policyRules.map((rule, i) => (
                <motion.div
                  key={rule.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/3 transition-colors"
                >
                  <FileCheck className="w-4 h-4 text-cyan-400/50 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-foreground/80 font-medium">{rule.name}</p>
                      {"source" in rule && <span className="text-[8px] text-[#ff6b35]/50">{(rule as any).source}</span>}
                    </div>
                    <p className="text-[9px] text-foreground/35 mt-0.5">{rule.value}</p>
                  </div>
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/30">{rule.engine}</span>
                  <div className={`w-2 h-2 rounded-full ${rule.status === "Active" ? "bg-green-400" : "bg-yellow-400"}`} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "escalation" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Escalation Queue</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Three-tier autonomy escalation — Council → Sovereign — Anthropic HITL-aligned</p>

            <div className="glass rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-14 h-14 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mb-3"
              >
                <CheckCircle2 className="w-7 h-7 text-green-400/60" />
              </motion.div>
              <p className="text-sm font-[family-name:var(--font-display)] text-foreground/60 font-semibold">No Pending Escalations</p>
              <p className="text-[10px] text-foreground/30 mt-1 max-w-[300px]">
                All operations are within autonomous bounds. Critical decisions will appear here for council or sovereign review.
              </p>

              <div className="mt-6 w-full max-w-sm">
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 font-[family-name:var(--font-display)] mb-2">Autonomy Tiers (Anthropic Harm Calculus Aligned)</p>
                <div className="space-y-1.5">
                  {[
                    { tier: "Tier 1 — Autonomous", desc: "Informational: low severity, high reversibility — the 'brilliant friend' model", color: "#00ff88", count: "18,400 ops" },
                    { tier: "Tier 2 — Council Review (24hr)", desc: "Clinical: moderate severity, consent required — 3 models, 70% consensus", color: "#ffd700", count: "1,200 ops" },
                    { tier: "Tier 3 — Sovereign Approval (<60s)", desc: "Rights-restricting: high severity, low reversibility — 5 models, 85% + HITL", color: "#ff4444", count: "47 ops" },
                  ].map(t => (
                    <div key={t.tier} className="flex items-center gap-3 px-3 py-2 rounded-md glass">
                      <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                      <div className="flex-1">
                        <p className="text-[10px] font-medium" style={{ color: t.color }}>{t.tier}</p>
                        <p className="text-[8px] text-foreground/25">{t.desc}</p>
                      </div>
                      <span className="text-[9px] text-foreground/30 font-[family-name:var(--font-mono)]">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HarmAvoidancePack visualization */}
              <div className="mt-6 w-full max-w-sm">
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 font-[family-name:var(--font-display)] mb-2">HarmAvoidancePack — 7-Factor Calculus</p>
                <div className="glass rounded-lg p-3 space-y-1.5">
                  {[
                    { factor: "Probability of Harm", weight: "25%", color: "#ff4444" },
                    { factor: "Severity", weight: "25%", color: "#ff6b35" },
                    { factor: "Reversibility (inverted)", weight: "15%", color: "#ffd700" },
                    { factor: "Breadth of Impact", weight: "10%", color: "#9b59b6" },
                    { factor: "Consent Status (inverted)", weight: "15%", color: "#00d4ff" },
                    { factor: "Vulnerability", weight: "10%", color: "#4fc3f7" },
                  ].map(f => (
                    <div key={f.factor} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
                      <span className="text-[9px] text-foreground/50 flex-1">{f.factor}</span>
                      <span className="text-[9px] font-[family-name:var(--font-mono)]" style={{ color: f.color }}>{f.weight}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/5 pt-1.5 mt-1.5">
                    <p className="text-[8px] text-foreground/25">Hard floor: Severity &gt;0.9 + Reversibility &lt;0.2 → BLOCK_ESCALATE_TIER3</p>
                    <p className="text-[8px] text-foreground/25">Harm &gt; Benefit × 1.5 → BLOCK_WITH_EXPLANATION</p>
                    <p className="text-[8px] text-foreground/25">Harm &gt; Benefit → ESCALATE_HITL</p>
                    <p className="text-[8px] text-foreground/25">Else → ALLOW_WITH_AUDIT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
