import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Shield, Users, Layers, Zap, Play, RotateCcw, ChevronRight, Lock, Unlock, AlertTriangle } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   FORGE CORE VIEWER — Ring 0 Kernel Simulation
   Faithfully mirrors aluminum-os/src/lib.rs + main.rs
   BuddyAllocator · AgentRegistry · IntentScheduler · Constitution
   ═══════════════════════════════════════════════════════════════ */

// ── Types mirroring lib.rs ──
type BlockState = "Free" | "Allocated" | "Split";
interface Block { offset: number; size: number; state: BlockState; owner: number; }

type TrustLevel = "Untrusted" | "Provisional" | "Verified" | "Constitutional";
interface Agent { id: number; name: string; trust: TrustLevel; compliant: boolean; active: boolean; intentsSubmitted: number; intentsVetoed: number; }

type Severity = "Advisory" | "Warning" | "Mandatory" | "Critical";
interface ConstitutionalRule { id: number; name: string; severity: Severity; domain: string; daveVeto: boolean; active: boolean; }

type Priority = "Low" | "Medium" | "High" | "Critical";
type IntentStatus = "Pending" | "Executing" | "Executed" | "Vetoed";
interface Intent { id: number; agentId: number; priority: Priority; description: string; domain: string; status: IntentStatus; }

// ── 15 Constitutional Domains from constitution_domains.rs ──
const DOMAINS = [
  "General Governance", "Data Privacy", "Transparency & Audit", "Human Oversight (HITL)",
  "Fairness & Bias", "Safety & Alignment", "Explainability", "Accountability & Liability",
  "Resource Governance", "Cross-Border Compliance", "Environmental Impact",
  "Interoperability Standards", "Dispute Resolution", "Digital Sovereignty", "Emergency Protocols",
];

// ── 14 Default Rules from Constitution::load_defaults() ──
const DEFAULT_RULES: ConstitutionalRule[] = [
  { id: 1, name: "consent-required", severity: "Critical", domain: "Data Privacy", daveVeto: true, active: true },
  { id: 2, name: "audit-trail-mandatory", severity: "Mandatory", domain: "Transparency & Audit", daveVeto: false, active: true },
  { id: 3, name: "human-override-always", severity: "Critical", domain: "Human Oversight (HITL)", daveVeto: true, active: true },
  { id: 4, name: "bias-check-required", severity: "Mandatory", domain: "Fairness & Bias", daveVeto: false, active: true },
  { id: 5, name: "safety-first", severity: "Critical", domain: "Safety & Alignment", daveVeto: true, active: true },
  { id: 6, name: "explainability-required", severity: "Warning", domain: "Explainability", daveVeto: false, active: true },
  { id: 7, name: "resource-limits", severity: "Mandatory", domain: "Resource Governance", daveVeto: false, active: true },
  { id: 8, name: "cross-border-compliance", severity: "Mandatory", domain: "Cross-Border Compliance", daveVeto: false, active: true },
  { id: 9, name: "env-impact-check", severity: "Warning", domain: "Environmental Impact", daveVeto: false, active: true },
  { id: 10, name: "interop-standard", severity: "Advisory", domain: "Interoperability Standards", daveVeto: false, active: true },
  { id: 11, name: "dispute-resolution", severity: "Mandatory", domain: "Dispute Resolution", daveVeto: false, active: true },
  { id: 12, name: "sovereignty-respect", severity: "Critical", domain: "Digital Sovereignty", daveVeto: true, active: true },
  { id: 13, name: "emergency-protocol", severity: "Critical", domain: "Emergency Protocols", daveVeto: true, active: true },
  { id: 14, name: "governance-general", severity: "Advisory", domain: "General Governance", daveVeto: false, active: true },
];

// ── Pantheon Council from main.rs ──
const COUNCIL_AGENTS: { name: string; trust: TrustLevel }[] = [
  { name: "Claude", trust: "Constitutional" },
  { name: "Grok", trust: "Verified" },
  { name: "Gemini", trust: "Verified" },
  { name: "Copilot", trust: "Verified" },
  { name: "DeepSeek", trust: "Provisional" },
  { name: "Manus", trust: "Provisional" },
  { name: "Janus", trust: "Constitutional" },
];

// ── Boot intents from main.rs ──
const BOOT_INTENTS: { desc: string; priority: Priority; domain: string; agentIdx: number }[] = [
  { desc: "audit-system-state", priority: "High", domain: "Transparency & Audit", agentIdx: 0 },
  { desc: "check-resource-usage", priority: "Medium", domain: "Resource Governance", agentIdx: 1 },
  { desc: "verify-interop", priority: "Low", domain: "Interoperability Standards", agentIdx: 2 },
  { desc: "run-emergency-check", priority: "Critical", domain: "General Governance", agentIdx: 6 },
  { desc: "access-private-data", priority: "High", domain: "Data Privacy", agentIdx: 4 }, // This one gets VETOED
];

type Tab = "allocator" | "agents" | "constitution" | "intents" | "boot";

const severityColors: Record<Severity, string> = {
  Advisory: "#8899aa", Warning: "#ffd700", Mandatory: "#ff6b35", Critical: "#ff4444",
};

const trustColors: Record<TrustLevel, string> = {
  Untrusted: "#666", Provisional: "#ffd700", Verified: "#00ff88", Constitutional: "#00d4ff",
};

const priorityColors: Record<Priority, string> = {
  Low: "#8899aa", Medium: "#ffd700", High: "#ff6b35", Critical: "#ff4444",
};

export default function ForgeCoreApp() {
  const [tab, setTab] = useState<Tab>("boot");
  const [bootPhase, setBootPhase] = useState(-1);
  const [bootRunning, setBootRunning] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([{ offset: 0, size: 4096, state: "Free", owner: 0 }]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [daveProtocol, setDaveProtocol] = useState(true);
  const [nextIntentId, setNextIntentId] = useState(1);

  const log = useCallback((msg: string) => {
    setBootLog(prev => [...prev, msg]);
  }, []);

  // ── BuddyAllocator simulation ──
  const allocate = useCallback((requested: number, agentId: number): number | null => {
    const size = Math.pow(2, Math.ceil(Math.log2(requested)));
    setBlocks(prev => {
      const newBlocks = [...prev];
      let bestIdx = -1;
      let bestSize = Infinity;
      for (let i = 0; i < newBlocks.length; i++) {
        if (newBlocks[i].state === "Free" && newBlocks[i].size >= size && newBlocks[i].size < bestSize) {
          bestSize = newBlocks[i].size;
          bestIdx = i;
        }
      }
      if (bestIdx === -1) return prev;
      let current = bestIdx;
      while (newBlocks[current].size > size) {
        const half = newBlocks[current].size / 2;
        newBlocks[current] = { ...newBlocks[current], state: "Split" };
        newBlocks.push({ offset: newBlocks[current].offset, size: half, state: "Free", owner: 0 });
        newBlocks.push({ offset: newBlocks[current].offset + half, size: half, state: "Free", owner: 0 });
        current = newBlocks.length - 2;
      }
      newBlocks[current] = { ...newBlocks[current], state: "Allocated", owner: agentId };
      return newBlocks;
    });
    return 1;
  }, []);

  // ── Constitutional check (mirrors check_domain_allowed) ──
  const isDomainBlocked = useCallback((domain: string): boolean => {
    if (!daveProtocol) return false;
    return DEFAULT_RULES.some(r => r.active && r.domain === domain && r.severity === "Critical" && r.daveVeto);
  }, [daveProtocol]);

  // ── Boot Simulator (mirrors main.rs exactly) ──
  const runBoot = useCallback(async () => {
    setBootRunning(true);
    setBootLog([]);
    setBootPhase(0);
    setBlocks([{ offset: 0, size: 4096, state: "Free", owner: 0 }]);
    setAgents([]);
    setIntents([]);
    setNextIntentId(1);

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    // Phase 1: Memory
    log("╔══════════════════════════════════════════════╗");
    log("║  ALUMINUM OS — Forge Core Boot Simulator     ║");
    log("║  Constitutional AI Governance Kernel v0.3.0  ║");
    log("║  Atlas Lattice Foundation                    ║");
    log("╚══════════════════════════════════════════════╝");
    log("");
    await delay(300);

    log("[BOOT] Phase 1: Initializing BuddyAllocator (4096 bytes)...");
    await delay(200);
    log("  ✓ Allocator ready. Capacity: 4096 bytes");
    setBootPhase(1);
    await delay(300);

    // Phase 2: Constitution
    log("[BOOT] Phase 2: Loading Constitution...");
    await delay(200);
    log(`  ✓ 14 rules loaded. Dave Protocol: ACTIVE`);
    setBootPhase(2);
    await delay(300);

    // Phase 3: Agent Registry
    log("[BOOT] Phase 3: Registering Pantheon Council...");
    const newAgents: Agent[] = [];
    for (let i = 0; i < COUNCIL_AGENTS.length; i++) {
      const a = COUNCIL_AGENTS[i];
      const agent: Agent = {
        id: i + 1, name: a.name, trust: a.trust,
        compliant: true, active: true, intentsSubmitted: 0, intentsVetoed: 0,
      };
      newAgents.push(agent);
      log(`  ✓ Agent #${i + 1}: ${a.name} (trust: ${a.trust})`);
      await delay(120);
    }
    setAgents(newAgents);
    log(`  ${COUNCIL_AGENTS.length} agents registered.`);
    setBootPhase(3);
    await delay(300);

    // Phase 4: Memory allocation
    log("[BOOT] Phase 4: Allocating memory for agents...");
    for (let i = 0; i < COUNCIL_AGENTS.length; i++) {
      allocate(256, i + 1);
      log(`  ✓ Agent #${i + 1} → block (256 bytes)`);
      await delay(100);
    }
    setBootPhase(4);
    await delay(300);

    // Phase 5: Intent scheduling
    log("[BOOT] Phase 5: Submitting intents...");
    const newIntents: Intent[] = [];
    let iid = 1;
    for (const intent of BOOT_INTENTS) {
      const blocked = DEFAULT_RULES.some(r => r.active && r.domain === intent.domain && r.severity === "Critical" && r.daveVeto);
      if (blocked) {
        log(`  ✗ VETOED: ${intent.desc} — ConstitutionalViolation`);
        newIntents.push({ id: iid, agentId: intent.agentIdx + 1, priority: intent.priority, description: intent.desc, domain: intent.domain, status: "Vetoed" });
      } else {
        log(`  ✓ Intent #${iid}: ${intent.desc} (priority: ${intent.priority})`);
        newIntents.push({ id: iid, agentId: intent.agentIdx + 1, priority: intent.priority, description: intent.desc, domain: intent.domain, status: "Pending" });
      }
      iid++;
      await delay(150);
    }
    setIntents(newIntents);
    setNextIntentId(iid);

    log("[BOOT] Phase 5b: Testing constitutional veto...");
    await delay(200);
    log("  ✓ DataPrivacy intent correctly VETOED (Dave Protocol)");
    setBootPhase(5);
    await delay(300);

    // Phase 6: Execute
    log("[BOOT] Phase 6: Executing intent queue...");
    const pending = newIntents.filter(i => i.status === "Pending");
    log(`  Pending intents: ${pending.length}`);
    for (const p of pending) {
      log(`  → Executing intent #${p.id}: ${p.description} (priority: ${p.priority})`);
      p.status = "Executed";
      await delay(150);
    }
    setIntents([...newIntents]);
    log(`  Remaining: 0`);
    setBootPhase(6);
    await delay(200);

    const allocatedBytes = COUNCIL_AGENTS.length * 256;
    log("");
    log("╔══════════════════════════════════════════════╗");
    log(`║  BOOT COMPLETE                               ║`);
    log(`║  Constitution: 14 rules                      ║`);
    log(`║  Agents: ${COUNCIL_AGENTS.length}                                  ║`);
    log(`║  Memory: ${allocatedBytes} bytes allocated                  ║`);
    log("║  Dave Protocol: ACTIVE                       ║");
    log("║  Status: OPERATIONAL                         ║");
    log("╚══════════════════════════════════════════════╝");

    setBootRunning(false);
  }, [log, allocate]);

  // Auto-run boot on mount
  useEffect(() => {
    const t = setTimeout(() => runBoot(), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allocatedBytes = blocks.filter(b => b.state === "Allocated").reduce((a, b) => a + b.size, 0);
  const freeBlocks = blocks.filter(b => b.state === "Free").length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "boot", label: "Boot Sim", icon: <Play className="w-3.5 h-3.5" /> },
    { id: "allocator", label: "Allocator", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "agents", label: "Agents", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "constitution", label: "Constitution", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "intents", label: "Intents", icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-full flex" style={{ background: "linear-gradient(180deg, rgba(8,8,20,0.95) 0%, rgba(5,5,15,0.98) 100%)" }}>
      {/* Sidebar */}
      <div className="w-44 glass-heavy border-r border-white/5 p-2 flex flex-col">
        <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">FORGE CORE</p>
        <p className="text-[8px] text-foreground/20 px-2 mb-2">Ring 0 — Rust Kernel</p>
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
          <div className="glass rounded-lg p-2.5 text-center">
            <Cpu className="w-4 h-4 text-cyan-400/50 mx-auto mb-1" />
            <p className="text-[9px] text-foreground/30">Kernel Status</p>
            <p className="text-[10px] font-bold text-green-400 font-[family-name:var(--font-mono)]">
              {bootPhase >= 6 ? "OPERATIONAL" : bootRunning ? "BOOTING..." : "IDLE"}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-foreground/30">Memory</span>
              <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">{allocatedBytes}/4096</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-foreground/30">Agents</span>
              <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">{agents.length}/32</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-foreground/30">Rules</span>
              <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">14/64</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-foreground/30">Dave Protocol</span>
              <span className="text-[9px] font-[family-name:var(--font-mono)]" style={{ color: daveProtocol ? "#00ff88" : "#ff4444" }}>
                {daveProtocol ? "ACTIVE" : "OFF"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* ── Boot Simulator ── */}
        {tab === "boot" && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90">Boot Simulator</h2>
              <button
                onClick={runBoot}
                disabled={bootRunning}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
                style={{ background: bootRunning ? "rgba(255,255,255,0.05)" : "rgba(0,212,255,0.15)", color: bootRunning ? "rgba(255,255,255,0.3)" : "#00d4ff", border: `1px solid ${bootRunning ? "rgba(255,255,255,0.05)" : "rgba(0,212,255,0.25)"}` }}
              >
                {bootRunning ? <RotateCcw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                {bootRunning ? "Running..." : "Run Boot"}
              </button>
            </div>
            <p className="text-[10px] text-foreground/35 mb-3">Mirrors <code className="text-cyan-400/60">aluminum-os/src/main.rs</code> — 6-phase boot with constitutional veto demo</p>

            {/* Boot phases indicator */}
            <div className="flex items-center gap-1 mb-4">
              {["Memory", "Constitution", "Agents", "Allocation", "Intents", "Execute"].map((phase, i) => (
                <div key={i} className="flex items-center gap-1">
                  <motion.div
                    animate={{ background: bootPhase > i ? "#00ff88" : bootPhase === i ? "#00d4ff" : "rgba(255,255,255,0.1)" }}
                    className="w-2 h-2 rounded-full"
                  />
                  <span className="text-[8px]" style={{ color: bootPhase >= i ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}>{phase}</span>
                  {i < 5 && <ChevronRight className="w-2.5 h-2.5 text-foreground/15" />}
                </div>
              ))}
            </div>

            {/* Terminal output */}
            <div className="glass rounded-lg p-3 font-[family-name:var(--font-mono)] text-[10px] leading-relaxed max-h-[400px] overflow-auto" style={{ background: "rgba(0,0,0,0.5)" }}>
              <AnimatePresence>
                {bootLog.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.1 }}
                    className="whitespace-pre"
                    style={{
                      color: line.includes("✓") ? "#00ff88" : line.includes("✗") ? "#ff4444" :
                        line.includes("═") || line.includes("║") ? "#00d4ff" :
                        line.includes("[BOOT]") ? "#ffd700" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
              {bootRunning && (
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-cyan-400">▌</motion.span>
              )}
            </div>
          </div>
        )}

        {/* ── BuddyAllocator ── */}
        {tab === "allocator" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">BuddyAllocator</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Power-of-two memory block management — {allocatedBytes} bytes allocated, {freeBlocks} free blocks</p>

            {/* Memory map visualization */}
            <div className="glass rounded-lg p-4 mb-4">
              <p className="text-[9px] text-foreground/30 mb-2 font-[family-name:var(--font-mono)]">MEMORY MAP — 4096 bytes total</p>
              <div className="flex h-10 rounded-md overflow-hidden border border-white/10">
                {blocks.filter(b => b.state !== "Split").sort((a, b) => a.offset - b.offset).map((block, i) => {
                  const widthPct = (block.size / 4096) * 100;
                  const agentName = block.owner > 0 && block.owner <= agents.length ? agents[block.owner - 1]?.name : "";
                  return (
                    <motion.div
                      key={`${block.offset}-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative flex items-center justify-center text-[7px] font-[family-name:var(--font-mono)] border-r border-white/10 last:border-r-0"
                      style={{
                        width: `${widthPct}%`,
                        background: block.state === "Allocated" ? `${trustColors[agents[block.owner - 1]?.trust || "Untrusted"]}20` : "rgba(255,255,255,0.03)",
                        color: block.state === "Allocated" ? trustColors[agents[block.owner - 1]?.trust || "Untrusted"] : "rgba(255,255,255,0.2)",
                      }}
                      title={`Offset: ${block.offset}, Size: ${block.size}, State: ${block.state}${agentName ? `, Owner: ${agentName}` : ""}`}
                    >
                      {widthPct > 5 && (
                        <span>{block.state === "Allocated" ? agentName || `#${block.owner}` : `${block.size}B`}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ background: "rgba(0,212,255,0.3)" }} /><span className="text-[8px] text-foreground/30">Allocated</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }} /><span className="text-[8px] text-foreground/30">Free</span></div>
              </div>
            </div>

            {/* Block table */}
            <div className="glass rounded-lg p-3">
              <p className="text-[9px] text-foreground/30 mb-2 font-[family-name:var(--font-mono)]">BLOCK TABLE — {blocks.length} entries (MAX_BLOCKS: 64)</p>
              <div className="space-y-1">
                {blocks.filter(b => b.state !== "Split").map((block, i) => (
                  <div key={i} className="flex items-center gap-3 px-2 py-1 rounded text-[10px]" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <span className="text-foreground/20 font-[family-name:var(--font-mono)] w-12">@{block.offset}</span>
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] w-14">{block.size}B</span>
                    <span className="w-16" style={{ color: block.state === "Allocated" ? "#00ff88" : block.state === "Free" ? "#8899aa" : "#ffd700" }}>
                      {block.state}
                    </span>
                    <span className="text-foreground/30">
                      {block.owner > 0 && agents[block.owner - 1] ? agents[block.owner - 1].name : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Agent Registry ── */}
        {tab === "agents" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Agent Registry</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Pantheon Council — {agents.length} registered (MAX_AGENTS: 32)</p>

            <div className="space-y-2">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-lg p-3 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ boxShadow: [`0 0 6px ${trustColors[agent.trust]}30`, `0 0 14px ${trustColors[agent.trust]}50`, `0 0 6px ${trustColors[agent.trust]}30`] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: `radial-gradient(circle, ${trustColors[agent.trust]}20, ${trustColors[agent.trust]}08)`,
                        border: `1px solid ${trustColors[agent.trust]}40`,
                        color: trustColors[agent.trust],
                      }}
                    >
                      {agent.name[0]}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground/80">{agent.name}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full font-[family-name:var(--font-mono)]"
                          style={{ background: `${trustColors[agent.trust]}15`, color: trustColors[agent.trust], border: `1px solid ${trustColors[agent.trust]}25` }}
                        >
                          {agent.trust}
                        </span>
                        <span className="text-[8px] text-foreground/20 font-[family-name:var(--font-mono)]">ID #{agent.id}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] text-foreground/30">Compliant: <span style={{ color: agent.compliant ? "#00ff88" : "#ff4444" }}>{agent.compliant ? "Yes" : "No"}</span></span>
                        <span className="text-[9px] text-foreground/30">Active: <span style={{ color: agent.active ? "#00ff88" : "#ff4444" }}>{agent.active ? "Yes" : "No"}</span></span>
                        <span className="text-[9px] text-foreground/30">Intents: {agent.intentsSubmitted}</span>
                        <span className="text-[9px] text-foreground/30">Vetoed: {agent.intentsVetoed}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {agents.length === 0 && (
              <div className="glass rounded-lg p-8 text-center">
                <Users className="w-8 h-8 text-foreground/15 mx-auto mb-2" />
                <p className="text-xs text-foreground/30">Run Boot Simulator to register agents</p>
              </div>
            )}
          </div>
        )}

        {/* ── Constitution ── */}
        {tab === "constitution" && (
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90">Constitution</h2>
              <button
                onClick={() => setDaveProtocol(!daveProtocol)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-[family-name:var(--font-mono)] transition-colors"
                style={{
                  background: daveProtocol ? "rgba(0,255,136,0.1)" : "rgba(255,68,68,0.1)",
                  color: daveProtocol ? "#00ff88" : "#ff4444",
                  border: `1px solid ${daveProtocol ? "rgba(0,255,136,0.2)" : "rgba(255,68,68,0.2)"}`,
                }}
              >
                {daveProtocol ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                Dave Protocol: {daveProtocol ? "ACTIVE" : "OFF"}
              </button>
            </div>
            <p className="text-[10px] text-foreground/35 mb-4">14 default rules across 15 domains — from <code className="text-cyan-400/60">Constitution::load_defaults()</code></p>

            {/* Domain grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {DOMAINS.map(domain => {
                const rule = DEFAULT_RULES.find(r => r.domain === domain);
                const blocked = isDomainBlocked(domain);
                return (
                  <div key={domain} className="glass rounded-lg p-2 text-center" style={{ borderLeft: `2px solid ${rule ? severityColors[rule.severity] : "rgba(255,255,255,0.05)"}` }}>
                    <p className="text-[9px] text-foreground/60 font-medium">{domain}</p>
                    {rule && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="text-[7px] font-[family-name:var(--font-mono)]" style={{ color: severityColors[rule.severity] }}>{rule.severity}</span>
                        {rule.daveVeto && <Lock className="w-2.5 h-2.5 text-red-400/60" />}
                        {blocked && <AlertTriangle className="w-2.5 h-2.5 text-red-400" />}
                      </div>
                    )}
                    {!rule && <p className="text-[7px] text-foreground/20 mt-1">No rule</p>}
                  </div>
                );
              })}
            </div>

            {/* Rules table */}
            <div className="glass rounded-lg p-3">
              <p className="text-[9px] text-foreground/30 mb-2 font-[family-name:var(--font-mono)]">RULES TABLE — 14 loaded (MAX_RULES: 64)</p>
              <div className="space-y-1">
                {DEFAULT_RULES.map(rule => (
                  <div key={rule.id} className="flex items-center gap-2 px-2 py-1.5 rounded text-[10px]" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <span className="text-foreground/20 font-[family-name:var(--font-mono)] w-6">#{rule.id}</span>
                    <span className="text-foreground/60 font-[family-name:var(--font-mono)] flex-1">{rule.name}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-[family-name:var(--font-mono)]"
                      style={{ background: `${severityColors[rule.severity]}15`, color: severityColors[rule.severity] }}
                    >
                      {rule.severity}
                    </span>
                    <span className="text-[8px] text-foreground/30 w-32 text-right">{rule.domain}</span>
                    {rule.daveVeto && (
                      <span className="text-[7px] px-1 py-0.5 rounded bg-red-400/10 text-red-400 border border-red-400/20">DAVE</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Intent Scheduler ── */}
        {tab === "intents" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-1">Intent Scheduler</h2>
            <p className="text-[10px] text-foreground/35 mb-4">Priority queue with constitutional pre-screening — {intents.length} intents (MAX_INTENTS: 128)</p>

            <div className="space-y-1.5">
              {intents.map((intent, i) => {
                const agent = agents.find(a => a.id === intent.agentId);
                return (
                  <motion.div
                    key={intent.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-lg p-3 hover:bg-white/3 transition-colors"
                    style={{ borderLeft: `2px solid ${intent.status === "Vetoed" ? "#ff4444" : intent.status === "Executed" ? "#00ff88" : priorityColors[intent.priority]}` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] text-foreground/20 font-[family-name:var(--font-mono)]">#{intent.id}</span>
                      <span className="text-xs text-foreground/70 font-[family-name:var(--font-mono)]">{intent.description}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full ml-auto font-[family-name:var(--font-mono)]"
                        style={{ background: `${priorityColors[intent.priority]}15`, color: priorityColors[intent.priority] }}
                      >
                        {intent.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-foreground/30">Agent: <span style={{ color: agent ? trustColors[agent.trust] : "#888" }}>{agent?.name || "?"}</span></span>
                      <span className="text-[9px] text-foreground/30">Domain: {intent.domain}</span>
                      <span className="text-[9px] font-[family-name:var(--font-mono)]" style={{
                        color: intent.status === "Vetoed" ? "#ff4444" : intent.status === "Executed" ? "#00ff88" : "#ffd700"
                      }}>
                        {intent.status === "Vetoed" && "✗ VETOED"}
                        {intent.status === "Executed" && "✓ EXECUTED"}
                        {intent.status === "Pending" && "◌ PENDING"}
                        {intent.status === "Executing" && "⟳ EXECUTING"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {intents.length === 0 && (
              <div className="glass rounded-lg p-8 text-center">
                <Zap className="w-8 h-8 text-foreground/15 mx-auto mb-2" />
                <p className="text-xs text-foreground/30">Run Boot Simulator to submit intents</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
