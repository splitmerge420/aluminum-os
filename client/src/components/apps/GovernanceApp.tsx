import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ScrollText, Scale, AlertTriangle, CheckCircle2, Clock, FileCheck, Users } from "lucide-react";

/* ─── Constitutional Domains (from Integrated_Constitutional_Substrate_v2.0) ─── */
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
];

const auditLog = [
  { time: "14:23:17", agent: "Manus", action: "Deployed uws v1.0.0 to GitHub", level: "info", domain: "Transparent Operations" },
  { time: "14:22:45", agent: "Claude", action: "Constitutional review passed for cross-provider sync", level: "info", domain: "Consent-First Sync" },
  { time: "14:21:30", agent: "Grok", action: "Stress test completed: 500ms drift threshold validated", level: "info", domain: "Graceful Degradation" },
  { time: "14:20:12", agent: "Copilot", action: "Architecture validation: 3 edge cases resolved", level: "info", domain: "Provider Neutrality" },
  { time: "14:18:55", agent: "Gemini", action: "Synthesis report generated: 8.3/10 average score", level: "info", domain: "Transparent Operations" },
  { time: "14:15:00", agent: "GPT", action: "Observation logged: workflow pattern detected", level: "warn", domain: "Minimal Authority" },
  { time: "14:12:33", agent: "System", action: "Memory consolidation cycle completed", level: "info", domain: "Data Dignity" },
  { time: "14:10:00", agent: "Daavud", action: "Sovereign ruling: Approved cross-provider memory sync", level: "info", domain: "Sovereign Override" },
  { time: "14:05:22", agent: "Claude", action: "Negative rights scan: 0 violations detected", level: "info", domain: "Negative Rights" },
  { time: "14:00:00", agent: "System", action: "Compliance daemon: All 15 domains enforced", level: "info", domain: "Audit Immutability" },
  { time: "13:55:11", agent: "Manus", action: "MCP tool registry updated: 47 tools registered", level: "info", domain: "Transparent Operations" },
  { time: "13:50:00", agent: "Grok", action: "Contrarian review submitted for Wish #111", level: "info", domain: "Escalation Protocol" },
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
];

type Tab = "domains" | "audit" | "policy" | "escalation";

export default function GovernanceApp() {
  const [tab, setTab] = useState<Tab>("domains");
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "domains", label: "Domains", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "audit", label: "Audit Log", icon: <ScrollText className="w-3.5 h-3.5" /> },
    { id: "policy", label: "Policy Engine", icon: <Scale className="w-3.5 h-3.5" /> },
    { id: "escalation", label: "Escalation", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  ];

  const layerColors: Record<string, string> = {
    Foundational: "#ff6b35",
    Operational: "#00d4ff",
    Resilience: "#00ff88",
    Fairness: "#ffd700",
    Security: "#ff4444",
    Safety: "#9b59b6",
    Privacy: "#4fc3f7",
    Governance: "#ffffff",
  };

  const agentColors: Record<string, string> = {
    Manus: "#00d4ff", Claude: "#ff6b35", Gemini: "#00ff88", Copilot: "#9b59b6",
    Grok: "#ff4444", GPT: "#ffd700", Daavud: "#ffffff", System: "#8899aa", DeepSeek: "#4fc3f7",
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

        <div className="mt-auto pt-3 border-t border-white/5 px-2 py-2">
          <div className="glass rounded-lg p-2.5 text-center">
            <p className="text-[9px] text-foreground/30 mb-1">Compliance Score</p>
            <p className="text-2xl font-bold font-[family-name:var(--font-mono)] text-green-400">100%</p>
            <p className="text-[8px] text-green-400/50">15/15 domains enforced</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        {tab === "domains" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Constitutional Domains</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Integrated Constitutional Substrate v2.0 — 15 domains across 8 layers</p>

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

        {tab === "audit" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Immutable Audit Log</h2>
            <p className="text-[10px] text-foreground/35 mb-4">W3C PROV-compliant provenance tracking — 2,847 total entries</p>

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
            <p className="text-[10px] text-foreground/35 mb-4">OPA/Rego + BFT Governance + Constitutional Runtime — 8 active policies</p>

            <div className="space-y-2">
              {policyRules.map((rule, i) => (
                <motion.div
                  key={rule.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/3 transition-colors"
                >
                  <FileCheck className="w-4 h-4 text-cyan-400/50 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-foreground/80 font-medium">{rule.name}</p>
                    <p className="text-[9px] text-foreground/35 mt-0.5">{rule.value}</p>
                  </div>
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-foreground/30">{rule.engine}</span>
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "escalation" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Escalation Queue</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Three-tier autonomy escalation — Council → Sovereign</p>

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
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 font-[family-name:var(--font-display)] mb-2">Autonomy Tiers</p>
                <div className="space-y-1.5">
                  {[
                    { tier: "Tier 1 — Autonomous", desc: "Routine operations (file access, search, sync)", color: "#00ff88", count: "18,400 ops" },
                    { tier: "Tier 2 — Council Review", desc: "Cross-provider actions, policy changes", color: "#ffd700", count: "1,200 ops" },
                    { tier: "Tier 3 — Sovereign Approval", desc: "Data deletion, identity changes, agent termination", color: "#ff4444", count: "47 ops" },
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
