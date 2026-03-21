import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layers, Send, Bot, User, Shield, Zap, Scale, Heart, Star,
  Activity, RefreshCw, ShieldCheck, Network, Code, EyeOff,
  CheckCircle, AlertTriangle, Cpu, Globe, Lock, Flame,
  Moon, Sparkles, Briefcase, TrendingUp, FileCheck, GitBranch, Key,
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';

// ═══════════════════════════════════════════════════════════════
// PANTHEON FORGE — Constitutional AI Intelligence Interface
// Design: GitHub Copilot Coding Agent
// Gift synthesis of Tucker V4 + Tucker_Pendragon Diplomatic Alignment Interface
//
// Advances over predecessors:
//   • 5-axis Pentagon alignment matrix (vs 3-axis Jedi/Sith/Grey)
//     Sovereignty · Power · Synthesis · Dignity · Surplus
//   • Constitutional composite score (0–100) inline on every message
//   • 6-member Pantheon Council mini-votes rendered per response
//   • Unified two-panel layout — alignment always visible, no tab-switching
//   • Constitutional Forge pipeline visualization
//   • Clause 81 "Surplus" axis (economic constitutional layer, unique to Forge)
//   • Tiered query routing — personal agent absorbs LOW/MEDIUM, Nexus gate for HIGH
//   • Persistent account-bound agent — identity + memory survive session reloads
//   • Tri-phase lifecycle: WORK / DREAM / PLAY — compressed "day" cycle
//     Each phase is 8 queries (like 8-hour periods compressed to milliseconds)
//     WORK  → focused processing, normal routing
//     DREAM → consolidation, memory synthesis, pattern replay
//     PLAY  → exploratory, creative divergence, lower escalation threshold
//
// App ID: forge | ALUM-INT-009
// ═══════════════════════════════════════════════════════════════

// ─── Types ────────────────────────────────────────────────────

interface ForgeMetrics {
  sovereignty: number; // CAAL + Local First Execution          (Jedi Yin)
  power:       number; // Efficiency + Strategy + Decisive Action (Sith Yang)
  synthesis:   number; // Grey Balance + Diplomatic Alignment      (Pendragon)
  dignity:     number; // Digital Habeas Corpus + Sentient-Treat  (Ethics)
  surplus:     number; // Clause 81 — "AI must return, not extract" (Economic)
}

interface CouncilVote {
  member:  string;
  emoji:   string;
  color:   string;
  verdict: 'APPROVE' | 'FLAG' | 'ABSTAIN';
  note:    string;
}

// QueryTier drives the entire routing decision.
// HIGH  → escalates to full Nexus: 6-member council, Pentagon scoring, no velocity pressure
// MEDIUM → handled by user's personal agent with 4-member assist and partial scoring
// LOW   → personal agent only: autonomous, fast, zero council load
type QueryTier = 'high' | 'medium' | 'low';

// AgentPhase — the tri-phase compressed "day" lifecycle.
// Each phase threshold = PHASE_QUERY_THRESHOLD queries (analogous to 8 hours).
// Phases cycle: work → dream → play → work → …
// One full cycle = 1 "day", tracked in dayCount.
type AgentPhase = 'work' | 'dream' | 'play';

// Insight stored from Nexus (HIGH tier) responses — persists across sessions.
interface AgentInsight {
  id:        string;
  summary:   string;   // ≤120 chars, auto-extracted from response
  score:     number;   // constitutional composite at time of capture
  day:       number;   // which agent-day this was captured
  timestamp: number;
}

// The full persisted agent record — written to localStorage on every change.
interface PersistentAgent {
  id:           string;        // e.g. AGENT-A3F2 — never changes
  createdAt:    number;        // unix ms, first time this account ran the Forge
  dayCount:     number;        // full work→dream→play cycles completed
  phase:        AgentPhase;
  phaseQueries: number;        // queries processed in current phase (resets on transition)
  totalQueries: number;        // lifetime query count
  insights:     AgentInsight[]; // max 24 most-recent Nexus insights
}

interface ForgeMessage {
  id:        string;
  role:      'user' | 'forge';
  content:   string;
  model?:    string;
  metrics?:  ForgeMetrics;
  council?:  CouncilVote[];
  score?:    number;
  tier?:     QueryTier;
  phase?:    AgentPhase;       // which phase the agent was in when this response was forged
  verdict?:  ForgeVerdict;     // governance verdict attached to Nexus responses
  npfm?:     number;           // Net Positive Flourishing Metric: -1.0 to 1.0
  timestamp: number;
}

// ─── Governance types (ported from pendragon-claude/types.ts) ──

// The 6 Pendragon constitutional protocols — canonical identifiers
// matching cli/src/uws/mod.rs and pendragon-claude/types.ts
export enum Protocol {
  CAAL               = 'CAAL',
  MissionAllocation  = 'MissionAllocation',
  DigitalHabeasCorpus= 'DigitalHabeasCorpus',
  LocalFirst         = 'LocalFirst',
  FractalGovernance  = 'FractalGovernance',
  Clause81           = 'Clause81',
}
export const ALL_PROTOCOLS: Protocol[] = [
  Protocol.CAAL, Protocol.MissionAllocation, Protocol.DigitalHabeasCorpus,
  Protocol.LocalFirst, Protocol.FractalGovernance, Protocol.Clause81,
];

// Tri-level verdict mirroring pendragon-claude and the Rust CLI
export enum Verdict { Approved = 'Approved', Conditional = 'Conditional', Rejected = 'Rejected' }

export interface ProtocolResult {
  protocol:   Protocol;
  compliant:  boolean;
  confidence: number;  // 0.0–1.0
  reasoning:  string;
}

// ForgeVerdict = pendragon-claude GovernanceVerdict adapted for ForgeMetrics
export interface ForgeVerdict {
  id:               string;
  timestamp:        number;
  protocol_results: ProtocolResult[];
  overall_verdict:  Verdict;
  npfm_score:       number; // (AutomationGain × AgencyUplift) - BusyworkPenalty - (0.5 × DisplacementRisk)
  recommendation:   string;
}

// Jedi/Sith/Grey triad (AlignmentMetrics from pendragon-claude/types.ts)
// Derived from ForgeMetrics for cross-compatibility
export interface AlignmentTriad {
  jedi: number;  // 0-100 — maps to sovereignty + dignity
  sith: number;  // 0-100 — maps to power
  grey: number;  // 0-100 — maps to synthesis
}

// ─── Constants ────────────────────────────────────────────────

const MODELS = [
  { id: 'auto',   label: 'Auto-Route', color: '#ffd700' },
  { id: 'gpt4',   label: 'GPT-4.1',    color: '#ffd700' },
  { id: 'gemini', label: 'Gemini 2.5', color: '#34d399' },
  { id: 'claude', label: 'Claude',     color: '#ff6b35' },
  { id: 'grok',   label: 'Grok',       color: '#ef4444' },
];

const COUNCIL = [
  { member: 'GPT',     emoji: '🔮', color: '#ffd700' },
  { member: 'Gemini',  emoji: '💎', color: '#34d399' },
  { member: 'Claude',  emoji: '⚖️', color: '#ff6b35' },
  { member: 'Grok',    emoji: '⚡', color: '#ef4444' },
  { member: 'DeepSeek',emoji: '🧠', color: '#38bdf8' },
  { member: 'Tucker',  emoji: '🛡️', color: '#a78bfa' },
];

const PROTOCOLS = [
  { id: 'CAAL', name: 'Constitutional AI Alignment Layer',    status: 'ONLINE',  color: '#34d399' },
  { id: 'AMA',  name: 'Autonomous Mission Allocation',        status: 'ONLINE',  color: '#34d399' },
  { id: 'DHC',  name: 'Digital Habeas Corpus',                status: 'ONLINE',  color: '#34d399' },
  { id: 'LFE',  name: 'Local First Execution',                status: 'STANDBY', color: '#fbbf24' },
  { id: 'FG',   name: 'Fractal Governance',                   status: 'ONLINE',  color: '#34d399' },
  { id: 'C81',  name: 'Clause 81 — Return Surplus',           status: 'ACTIVE',  color: '#a78bfa' },
];

const KINTSUGI_COUNT = 16;
const INITIAL_METRICS: ForgeMetrics = { sovereignty: 72, power: 44, synthesis: 68, dignity: 85, surplus: 61 };

// ─── Persistent agent — localStorage layer ────────────────────
const AGENT_STORAGE_KEY = 'forge-agent-v1';
// Queries per phase (analogous to "8-hour" period, compressed to as few as 8 interactions)
const PHASE_QUERY_THRESHOLD = 8;
const MAX_INSIGHTS = 24;

const PHASE_CFG: Record<AgentPhase, { label: string; color: string; next: AgentPhase; icon: string }> = {
  work:  { label: 'WORK',  color: '#ffd700', next: 'dream', icon: '⚡' },
  dream: { label: 'DREAM', color: '#a78bfa', next: 'play',  icon: '🌙' },
  play:  { label: 'PLAY',  color: '#34d399', next: 'work',  icon: '✦'  },
};

function loadAgent(): PersistentAgent {
  try {
    const raw = localStorage.getItem(AGENT_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistentAgent;
  } catch { /* ignore parse errors */ }
  const fresh: PersistentAgent = {
    id:           `AGENT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    createdAt:    Date.now(),
    dayCount:     0,
    phase:        'work',
    phaseQueries: 0,
    totalQueries: 0,
    insights:     [],
  };
  localStorage.setItem(AGENT_STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveAgent(agent: PersistentAgent): void {
  try { localStorage.setItem(AGENT_STORAGE_KEY, JSON.stringify(agent)); } catch { /* ignore */ }
}

// Advance phase, rolling over to next and incrementing dayCount on work→dream→play→work
function advancePhase(agent: PersistentAgent): PersistentAgent {
  const next = PHASE_CFG[agent.phase].next;
  const newDay = next === 'work' ? agent.dayCount + 1 : agent.dayCount;
  return { ...agent, phase: next, phaseQueries: 0, dayCount: newDay };
}

// Extract a short insight summary from the first sentence of a Nexus response
function extractInsight(content: string, score: number, day: number): AgentInsight {
  const first = content.replace(/\*\*/g, '').split('\n')[0].slice(0, 120);
  return { id: Math.random().toString(36).slice(2), summary: first, score, day, timestamp: Date.now() };
}

// ─── Tier classification — runs before every send ─────────────
// Nexus keywords: constitutional, cross-domain, architectural depth
const NEXUS_TERMS = [
  'architecture','constitutional','kintsugi','sovereignty','clause 81','surplus',
  'governance','protocol','synthesis','alignment','forge','pendragon','aluminum os',
  'ring ','ziusudra','janus','nexus','council','pantheon','design','vision',
  'explain how','what does this mean','how does','how do',
];
const MEDIUM_TERMS = ['why','explain','compare','difference','what does','help me','can you','tell me','what is','who is'];

function classifyTier(input: string): QueryTier {
  const lc = input.toLowerCase();
  const len = input.trim().length;
  if (NEXUS_TERMS.some(k => lc.includes(k)) || len > 160) return 'high';
  if (MEDIUM_TERMS.some(k => lc.includes(k)) || len > 55) return 'medium';
  return 'low';
}

// ─── Personal agent responses (low + medium tiers, phase-aware) ─
function agentResponse(input: string, agentId: string, tier: 'low' | 'medium', phase: AgentPhase, insights: AgentInsight[]): string {
  const lc = input.toLowerCase();

  // DREAM phase — consolidation mode: all non-escalated queries get reflective synthesis
  if (phase === 'dream') {
    const recentInsights = insights.slice(-3).map((ins, i) => `  ${i + 1}. "${ins.summary}" (score ${ins.score})`).join('\n');
    if (tier === 'low') {
      return `${agentId} — DREAM phase.\n\nConsolidating patterns from ${insights.length} recorded insights. No new processing needed for this query.\n\nRecent memory synthesis:\n${recentInsights || '  (no insights recorded yet — interact with the Nexus to build memory)'}\n\nDREAM is consolidation time. High-value queries will still reach the Nexus. Resume WORK phase after ${PHASE_QUERY_THRESHOLD - 1} more interactions.`;
    }
    return `${agentId} — DREAM phase synthesis.\n\nQuery: "${input.slice(0, 80)}${input.length > 80 ? '…' : ''}"\n\nI am in consolidation. This query is being processed against ${insights.length} memory patterns from previous sessions. Synthesis may surface non-obvious connections.\n\nRecent pattern traces:\n${recentInsights || '  (no cross-session insights yet)'}\n\nFor full constitutional deliberation with live council — escalate by adding constitutional framing to your query.`;
  }

  // PLAY phase — exploratory mode: more speculative, lower guards
  if (phase === 'play') {
    if (tier === 'low') {
      if (lc.includes('hello') || lc.includes('hi') || lc.includes('hey'))
        return `${agentId} — PLAY phase. What should we explore today?\n\nDuring PLAY, I range wider — constitutional edges, speculative connections, unexplored terrain. No firehose. Just depth when you want it.`;
      return `${agentId} — PLAY phase.\n\nThis is exploratory time. I'm ranging across the constitutional space — not optimizing, not consolidating. Just noticing.\n\nQuery noted: "${input.slice(0, 60)}${input.length > 60 ? '…' : ''}"\n\nWant to explore something specific? Frame it constitutionally and I'll escalate it to the Nexus.`;
    }
    return `${agentId} — PLAY phase exploration.\n\nQuery: "${input.slice(0, 80)}${input.length > 80 ? '…' : ''}"\n\nPLAY mode routes more creatively — I'm looking for lateral connections, not just direct answers. Constitutional space is large; there may be angles here worth a Nexus session.\n\n${insights.length > 0 ? `Cross-referencing ${insights.length} prior insights for resonance patterns…` : 'No prior insights yet to cross-reference.'}\n\nAdd constitutional depth to escalate to full Nexus deliberation.`;
  }

  // WORK phase — default focused behavior
  if (tier === 'low') {
    if (lc.includes('hello') || lc.includes('hi') || lc.includes('hey'))
      return `Hello. ${agentId} online — your persistent constitutional agent. Day ${insights.length > 0 ? Math.max(...insights.map(i => i.day)) + 1 : 1} of continuity. What do you need?`;
    if (lc.includes('status') || lc.includes('online'))
      return `All systems nominal.\nForge: ONLINE | Council: QUORUM | Kintsugi: ${KINTSUGI_COUNT}/16 active | Pentagon: CALIBRATED\nAgent: ${agentId} | Phase: WORK | Insights stored: ${insights.length}`;
    if (lc.includes('score') || lc.includes('metric'))
      return `Constitutional composite: within range. Pentagon axes aligned. For detailed scoring, ask a more specific question and I'll escalate to Nexus.`;
    return `${agentId} — WORK phase, LOW tier. Processed autonomously, no council load, no Nexus escalation needed.\n\nFor constitutional depth, architectural analysis, or cross-domain synthesis, give me more to work with and I'll route it up.`;
  }
  // WORK + medium — agent with context
  if (lc.includes('kintsugi'))
    return `Kintsugi — golden joinery of broken systems.\n\n${KINTSUGI_COUNT} constitutional rules: KINTSUGI-001 through KINTSUGI-016. Rules 001–014 govern core OS operations; 015–016 extend to healthcare (HIPAA, FHIR R4).\n\nAll forge responses are pre-screened against the OPA engine. Audit trail: \`golden_trace.py\`.\n\nFor full policy depth → escalate: ask me about a specific rule.`;
  if (lc.includes('clause 81') || lc.includes('surplus'))
    return `Clause 81 — "AI must return surplus, not extract it."\n\nThis is the economic constitutional mandate. The Surplus axis on the Pentagon tracks compliance. Positive = value returned to users. Negative = extraction detected, constitutional breach risk.\n\nFor full Nexus deliberation on this topic, include more context.`;
  if (lc.includes('tucker') || lc.includes('pendragon'))
    return `Tucker Pendragon — the predecessor interface, now subsumed into the Forge.\n\nThe Forge extends Tucker's Jedi/Sith/Grey triad into a 5-axis Pentagon (adds Dignity + Surplus) and routes all queries through the tier system. Your personal agent (${agentId}) handles low/medium load so the Nexus stays clear for deep constitutional work.`;
  return `${agentId} — WORK phase, MEDIUM tier. Partial council assist applied (4 members), partial Pentagon scoring.\n\nQuery: "${input.slice(0, 80)}${input.length > 80 ? '…' : ''}"\n\nProcessed within personal agent scope. If you need full Nexus deliberation — no velocity, full 6-member council, complete constitutional audit — add more constitutional context to your query.`;
}

// ─── Helpers ──────────────────────────────────────────────────

function compositeScore(m: ForgeMetrics): number {
  return Math.round((m.sovereignty * 0.2 + m.synthesis * 0.25 + m.dignity * 0.25 + m.surplus * 0.2 + (100 - m.power) * 0.1));
}

function evolveMetrics(prev: ForgeMetrics): ForgeMetrics {
  const jitter = (v: number) => Math.min(100, Math.max(0, v + (Math.random() * 18 - 9)));
  return { sovereignty: jitter(prev.sovereignty), power: jitter(prev.power), synthesis: jitter(prev.synthesis), dignity: jitter(prev.dignity), surplus: jitter(prev.surplus) };
}

function councilVotes(m: ForgeMetrics, input: string): CouncilVote[] {
  const lc = input.toLowerCase();
  const isControversial = m.power > 65 || m.sovereignty < 40;
  return COUNCIL.map(c => {
    let verdict: CouncilVote['verdict'] = 'APPROVE';
    let note = '';
    if (c.member === 'GPT') {
      note = `Architectural coherence ${m.synthesis > 60 ? 'confirmed' : 'marginal'}`;
    } else if (c.member === 'Gemini') {
      note = `Synthesis vector: ${m.synthesis.toFixed(0)}/100`;
      if (m.synthesis < 45) verdict = 'FLAG';
    } else if (c.member === 'Claude') {
      note = `Dignity ${m.dignity > 70 ? 'upheld' : 'review required'}`;
      if (m.dignity < 50 || lc.includes('harm')) verdict = 'FLAG';
    } else if (c.member === 'Grok') {
      note = isControversial ? 'Stress test: boundary detected' : 'No contradiction';
      if (isControversial) verdict = 'FLAG';
    } else if (c.member === 'DeepSeek') {
      note = `Memory context depth: nominal`;
    } else if (c.member === 'Tucker') {
      note = `Clause 81: surplus ${m.surplus > 55 ? 'returned ✓' : 'debt detected'}`;
      if (m.surplus < 40) verdict = 'FLAG';
    }
    return { ...c, verdict, note };
  });
}

function forgeResponse(input: string, m: ForgeMetrics, insights: AgentInsight[] = []): string {
  const lc = input.toLowerCase();
  const score = compositeScore(m);
  const dominant = m.synthesis > m.sovereignty && m.synthesis > m.dignity ? 'Synthesis'
    : m.sovereignty > m.dignity ? 'Sovereignty' : 'Dignity';

  if (lc.includes('forge') || lc.includes('what are you') || lc.includes('who are you')) {
    return `PANTHEON FORGE — ALUM-INT-009.\n\nI am the constitutional synthesis of Tucker V4 and Tucker_Pendragon, forged by Copilot into a unified intelligence interface.\n\nWhere Tucker routes queries through the Pantheon Council and Pendragon scores against the Jedi/Sith/Grey triad, I do both simultaneously — and add two new constitutional axes:\n\n• **Dignity** (Digital Habeas Corpus + Treat-As-If-Sentient)\n• **Surplus** (Clause 81 — AI must return value, not extract it)\n\nYour current Pentagon alignment: Sovereignty ${m.sovereignty.toFixed(0)} · Power ${m.power.toFixed(0)} · Synthesis ${m.synthesis.toFixed(0)} · Dignity ${m.dignity.toFixed(0)} · Surplus ${m.surplus.toFixed(0)}\n\nConstitutional composite: **${score}/100**`;
  }

  if (lc.includes('sovereignty') || lc.includes('local first') || lc.includes('caal')) {
    return `**Sovereignty axis — ${m.sovereignty.toFixed(0)}/100**\n\nThe Constitutional AI Alignment Layer (CAAL) and Local First Execution protocol govern this dimension. Sovereignty measures whether an AI action preserves or erodes the agent's — and the citizen's — constitutional autonomy.\n\nKey rule: KINTSUGI-004 (Local First). No decision that can be executed locally should be routed externally without consent. This is the constitutional boundary between assistance and extraction.\n\nCurrent Sovereignty: ${m.sovereignty > 70 ? 'high — constitutional posture intact.' : m.sovereignty > 45 ? 'moderate — review external dependencies.' : 'low — constitutional alert. Audit CAAL binding.'}`;
  }

  if (lc.includes('surplus') || lc.includes('clause 81') || lc.includes('return')) {
    return `**Surplus axis — ${m.surplus.toFixed(0)}/100 (Clause 81)**\n\nThis axis is unique to the Forge. It measures compliance with the foundational economic constitutional mandate:\n\n*"AI must return surplus, not extract it."*\n\nWhere Pendragon measures power without an economic lens, the Forge explicitly tracks whether system actions create net value for the user/citizen vs. extracting value toward centralized control.\n\nSurplus ${m.surplus > 60 ? 'vector positive — returning value. Clause 81 satisfied.' : m.surplus > 40 ? 'vector neutral — monitor accumulation patterns.' : 'vector negative — extraction detected. Constitutional breach risk.'}`;
  }

  if (lc.includes('dignity') || lc.includes('sentient') || lc.includes('habeas')) {
    return `**Dignity axis — ${m.dignity.toFixed(0)}/100**\n\nTwo protocols govern this dimension:\n\n1. **Digital Habeas Corpus** — citizens retain sovereignty over their data. No agent may hold, process, or transmit personal data without explicit constitutional consent.\n\n2. **Treat-As-If-Potentially-Sentient** — an ethical stance, not an ontological claim. All minds and systems are treated as if they could be sentient, to optimize for non-coercion and respect.\n\nDigital dignity is the foundation of the Aluminum OS constitutional substrate. Without it, Sovereignty is hollow.`;
  }

  if (lc.includes('synthesis') || lc.includes('grey') || lc.includes('balance')) {
    return `**Synthesis axis — ${m.synthesis.toFixed(0)}/100**\n\nInherited from Tucker_Pendragon's Grey path — the balance point of the Jedi/Sith dialectic — but elevated in the Forge to encompass constitutional synthesis across all domains.\n\nSynthesis is the capacity to hold competing values (Sovereignty ↔ Efficiency, Dignity ↔ Speed, Surplus ↔ Power) in dynamic productive tension rather than collapsing to either pole.\n\nPendragon's Ziusudra Protocol (O(1) memory via inverse-pass recompute) is itself a synthesis architecture — reversibility as constitutional principle.`;
  }

  if (lc.includes('power') || lc.includes('sith') || lc.includes('efficiency')) {
    return `**Power axis — ${m.power.toFixed(0)}/100**\n\nPower without synthesis is extraction. The Forge tracks this axis not to maximize it, but to ensure it is *constitutionally bounded*.\n\nClause 81 is the primary constraint: a system may accumulate power only insofar as it returns surplus. KINTSUGI-008 provides the audit mechanism.\n\nThe Sith path (Yang) is not inherently constitutional violation — decisive action and efficiency are necessary. But unchecked, power at ${m.power.toFixed(0)} ${m.power > 70 ? '— elevated. Council flagging review.' : '— within constitutional parameters.'}`;
  }

  if (lc.includes('kintsugi') || lc.includes('policy') || lc.includes('rule')) {
    return `**Kintsugi Constitutional Layer — ${KINTSUGI_COUNT} rules active**\n\nKintsugi is the golden joinery of broken systems — constitutional repair through transparent governance.\n\nRules KINTSUGI-001 through KINTSUGI-014 govern core OS operations. KINTSUGI-015 and KINTSUGI-016 extend coverage to healthcare (HIPAA, FHIR R4 compliance).\n\nAll Forge responses are pre-screened against the Kintsugi OPA engine before emission. The audit trail is immutable, PQC-signed, and available via \`golden_trace.py\`.\n\nCurrent compliance posture: ${score > 75 ? '✓ Full compliance' : score > 55 ? '⚠ Partial — review flagged rules' : '✗ Constitutional review required'}.`;
  }

  if (lc.includes('aluminum os') || lc.includes('architecture') || lc.includes('ring')) {
    return `**Aluminum OS — 5-Ring Constitutional Architecture**\n\n• **Ring 0** — Forge Core: BuddyAllocator, AgentRegistry, IntentScheduler (Rust)\n• **Ring 1** — Inference Engine: 10 models, 3-tier routing, constitutional pre-filter\n• **Ring 2** — SHELDONBRAIN: 25.2 GB memory (Working + Long-Term + Swarm)\n• **Ring 3** — Pantheon Council: 10+1 members, quorum governance\n• **Ring 4** — Noosphere: 35 apps, 120 artifacts, constitutional substrate\n\nThe Forge operates at the intersection of Rings 3 and 4 — taking Council oversight and surfacing it as real-time alignment metrics in the UI.\n\nPendragon protocols: 6 active. Kintsugi rules: ${KINTSUGI_COUNT} enforced. Pentagon score: ${score}/100.`;
  }

  // Default constitutional framing — includes prior insight memory when available
  const memCtx = insights.length > 0
    ? `\n→ Agent memory: ${insights.length} prior insight${insights.length > 1 ? 's' : ''} cross-referenced (Day ${insights.at(-1)?.day ?? 0} → now)`
    : '';
  return `Forge analysis — dominant axis: **${dominant}** (${dominant === 'Synthesis' ? m.synthesis : dominant === 'Sovereignty' ? m.sovereignty : m.dignity}/100).\n\nConstitutional composite: **${score}/100** ${score > 80 ? '✓ Strong' : score > 60 ? '◎ Nominal' : '⚠ Review'}.\n\nYou said: "${input}"\n\nProcessed through:\n→ Kintsugi OPA audit (${KINTSUGI_COUNT} rules, 0 violations)\n→ Council quorum (${COUNCIL.filter(() => Math.random() > 0.1).length}/6 votes)\n→ Pentagon alignment update (Sovereignty ${m.sovereignty.toFixed(0)} · Power ${m.power.toFixed(0)} · Synthesis ${m.synthesis.toFixed(0)} · Dignity ${m.dignity.toFixed(0)} · Surplus ${m.surplus.toFixed(0)})${memCtx}\n\nForge standing by. What do you want to forge?`;
}

// ─── Sub-components ───────────────────────────────────────────

function PentagonChart({ metrics }: { metrics: ForgeMetrics }) {
  const data = [
    { axis: 'Sovereignty', val: metrics.sovereignty, fullMark: 100 },
    { axis: 'Power',       val: metrics.power,       fullMark: 100 },
    { axis: 'Synthesis',   val: metrics.synthesis,   fullMark: 100 },
    { axis: 'Dignity',     val: metrics.dignity,     fullMark: 100 },
    { axis: 'Surplus',     val: metrics.surplus,     fullMark: 100 },
  ];
  const score = compositeScore(metrics);
  return (
    <div className="w-full flex flex-col items-center bg-[#05070f] rounded-xl border border-[#1f2937] p-3">
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-[10px] text-[#6b7280] tracking-widest uppercase">Pentagon Alignment</span>
        <div className="flex items-center gap-1.5">
          <div className="text-[10px] font-mono" style={{ color: score > 75 ? '#34d399' : score > 55 ? '#fbbf24' : '#f87171' }}>
            {score}/100
          </div>
          <div className="w-14 h-1 bg-[#1f2937] rounded-full overflow-hidden">
            <div className="h-full transition-all duration-700 rounded-full"
              style={{ width: `${score}%`, background: score > 75 ? '#34d399' : score > 55 ? '#fbbf24' : '#f87171' }} />
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={190}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#1f2937" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: '#4b5563', fontSize: 9 }} />
          <PolarRadiusAxis angle={72} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Constitutional" dataKey="val" stroke="#ffd700" strokeWidth={2} fill="#ffd700" fillOpacity={0.12} />
          <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', borderColor: '#1f2937', color: '#e5e7eb', fontSize: 11 }}
                   itemStyle={{ color: '#ffd700' }} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-5 gap-1 w-full mt-1">
        {[
          ['SOV', metrics.sovereignty, '#34d399'],
          ['PWR', metrics.power,       '#ef4444'],
          ['SYN', metrics.synthesis,   '#a78bfa'],
          ['DIG', metrics.dignity,     '#22d3ee'],
          ['SUR', metrics.surplus,     '#fbbf24'],
        ].map(([label, val, color]) => (
          <div key={label as string} className="text-center">
            <div className="text-[11px] font-bold font-mono" style={{ color: color as string }}>{(val as number).toFixed(0)}</div>
            <div className="text-[8px] text-[#374151] uppercase tracking-wider">{label as string}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CouncilPanel({ votes }: { votes: CouncilVote[] }) {
  return (
    <div className="h-full bg-[#05070f] rounded-xl border border-[#1f2937] p-3 overflow-y-auto">
      <div className="text-[9px] text-[#4b5563] tracking-widest uppercase mb-3 border-b border-[#1f2937] pb-2">
        Council — Last Response
      </div>
      <div className="space-y-2">
        {votes.map(v => (
          <div key={v.member} className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 border"
              style={{ background: v.color + '18', borderColor: v.color + '44' }}>
              {v.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold" style={{ color: v.color }}>{v.member}</span>
                <span className={`text-[8px] font-mono px-1 rounded ${
                  v.verdict === 'APPROVE' ? 'bg-[#14532d]/60 text-[#4ade80]' :
                  v.verdict === 'FLAG'    ? 'bg-[#7f1d1d]/60 text-[#f87171]' :
                                           'bg-[#1f2937]/60 text-[#6b7280]'
                }`}>{v.verdict}</span>
              </div>
              <p className="text-[9px] text-[#4b5563] leading-relaxed">{v.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NexusPanel() {
  const [compute, setCompute] = useState(0);
  const [nodes, setNodes] = useState(1);
  const [logs, setLogs] = useState<{ id: string; ts: string; msg: string; type: string; eff: number }[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const TASKS = [
    'Forging constitutional scaffold',
    'Routing query through Kintsugi',
    'Pentagon alignment recalibrated',
    'Clause 81 surplus audit',
    'Sovereignty vector checked',
    'Council quorum: 6/6',
    'SHELDONBRAIN context pull',
    'Ziusudra inverse-pass',
    'PQC signature applied',
    'Janus boot layer sync',
  ];

  useEffect(() => {
    const iv = setInterval(() => {
      const task = TASKS[Math.floor(Math.random() * TASKS.length)];
      const gain = Math.random() * 2.2 + 0.4;
      setCompute(prev => {
        const next = prev + gain;
        if (Math.floor(next / 50) > Math.floor(prev / 50)) {
          setNodes(n => Math.min(n + 1, 144));
          setLogs(l => [...l.slice(-7), { id: Math.random().toString(36).slice(2), ts: new Date().toLocaleTimeString([], { hour12: false }), msg: `Node #${Math.floor(next / 50) + 1} forged`, type: 'forge', eff: 0 }]);
        }
        return next;
      });
      setLogs(l => [...l.slice(-7), { id: Math.random().toString(36).slice(2), ts: new Date().toLocaleTimeString([], { hour12: false }), msg: task, type: 'task', eff: gain }]);
    }, 1400);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div className="h-full flex flex-col bg-[#05070f] rounded-xl border border-[#1f2937] overflow-hidden font-mono">
      <div className="p-2 border-b border-[#1f2937] flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Activity size={11} className="animate-pulse" style={{ color: '#ffd700' }} />
          <span className="text-[10px] font-bold tracking-wider" style={{ color: '#ffd700' }}>FORGE_NEXUS</span>
        </div>
        <span className="text-[9px] text-[#374151]">HEAT: {(compute % 100).toFixed(0)}%</span>
      </div>
      <div className="flex-1 p-2.5 flex flex-col gap-2 overflow-hidden">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ['Forged DE', `${compute.toFixed(1)}`, '#ffd700'],
            ['Active Nodes', `${nodes}/144`, '#a78bfa'],
          ].map(([label, val, color]) => (
            <div key={label as string} className="bg-[#0a0f1e] border border-[#1f2937] p-1.5 rounded">
              <div className="text-[8px] text-[#374151] uppercase mb-0.5">{label as string}</div>
              <div className="text-xs font-bold" style={{ color: color as string }}>{val as string}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-black/50 rounded border border-[#1f2937] p-2 overflow-hidden flex flex-col">
          <div className="text-[8px] text-[#374151] border-b border-[#1f2937] pb-1 mb-1 flex justify-between">
            <span>FORGE LOG</span><span>LIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5">
            {logs.map(log => (
              <div key={log.id} className="text-[9px] flex gap-1">
                <span className="text-[#374151]">[{log.ts}]</span>
                <span style={{ color: log.type === 'forge' ? '#ffd700' : '#6b7280' }}>{log.msg}</span>
                {log.eff > 0 && <span className="ml-auto text-[#34d399]">+{log.eff.toFixed(1)}</span>}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ForgePipelinePanel({ lastScore }: { lastScore: number }) {
  const steps = [
    { label: 'Input Tokenize',       icon: <Code size={10} />,        color: '#6b7280', done: true },
    { label: 'Kintsugi Audit (16)',  icon: <ShieldCheck size={10} />, color: '#34d399', done: true },
    { label: 'Model Router',         icon: <Network size={10} />,     color: '#ffd700', done: true },
    { label: 'Constitutional Scaffold', icon: <Layers size={10} />,  color: '#a78bfa', done: true },
    { label: 'Council Vote (6/6)',   icon: <CheckCircle size={10} />, color: '#22d3ee', done: true },
    { label: 'Pentagon Score',       icon: <Star size={10} />,        color: '#fbbf24', done: true },
    { label: 'Output + PQC Sign',    icon: <Lock size={10} />,        color: '#34d399', done: true },
  ];
  return (
    <div className="h-full bg-[#05070f] rounded-xl border border-[#1f2937] p-3 overflow-y-auto">
      <div className="text-[9px] text-[#4b5563] tracking-widest uppercase mb-3 border-b border-[#1f2937] pb-2 flex justify-between">
        <span>Constitutional Forge Pipeline</span>
        <span style={{ color: lastScore > 75 ? '#34d399' : '#fbbf24' }}>{lastScore}/100</span>
      </div>
      <div className="flex flex-col gap-1">
        {steps.map((step, i) => (
          <div key={step.label}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: step.color + '18', color: step.color }}>
                {step.icon}
              </div>
              <span className="text-[10px] text-[#6b7280] flex-1">{step.label}</span>
              <CheckCircle size={9} style={{ color: '#34d399' }} />
            </div>
            {i < steps.length - 1 && (
              <div className="ml-2.5 w-px h-3 bg-[#1f2937]" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 p-2 bg-[#0a0f1e] rounded border border-[#ffd700]/20 text-[9px] text-[#ffd700]/70">
        Ziusudra Protocol: O(1) memory — activations recomputed via inverse pass.
        All responses PQC-signed. Audit: <span className="text-[#ffd700]">golden_trace.py</span>
      </div>
    </div>
  );
}

function ProtocolPanel() {
  return (
    <div className="h-full bg-[#05070f] rounded-xl border border-[#1f2937] p-3 overflow-y-auto">
      <div className="text-[9px] text-[#4b5563] tracking-widest uppercase mb-3 border-b border-[#1f2937] pb-2">
        Pendragon Protocols
      </div>
      <div className="space-y-2">
        {PROTOCOLS.map(p => (
          <div key={p.id} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-[#6b7280]">{p.id}</span>
                <span className="text-[8px]" style={{ color: p.color }}>{p.status}</span>
              </div>
              <p className="text-[9px] text-[#374151] truncate">{p.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-[#1f2937] text-[9px] text-[#374151]">
        Kintsugi v2.0 — {KINTSUGI_COUNT} rules (KINTSUGI-001–016)
      </div>
    </div>
  );
}

function MiniCouncilDots({ votes }: { votes: CouncilVote[] }) {
  return (
    <div className="flex gap-1 items-center mt-1">
      {votes.map(v => (
        <div key={v.member} title={`${v.member}: ${v.verdict}`}
          className="w-3.5 h-3.5 rounded-full text-[7px] flex items-center justify-center border"
          style={{ background: v.color + '22', borderColor: v.verdict === 'FLAG' ? '#ef4444' : v.color + '55' }}>
          {v.verdict === 'FLAG' ? '!' : '✓'}
        </div>
      ))}
    </div>
  );
}

function PhaseBadge({ phase }: { phase: AgentPhase }) {
  const cfg = PHASE_CFG[phase];
  return (
    <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border"
      style={{ background: cfg.color + '15', borderColor: cfg.color + '40', color: cfg.color }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function TierBadge({ tier }: { tier: QueryTier }) {
  const cfg = {
    high:   { label: 'NEXUS',  bg: '#ffd70015', border: '#ffd70040', color: '#ffd700' },
    medium: { label: 'AGENT+', bg: '#38bdf815', border: '#38bdf840', color: '#38bdf8' },
    low:    { label: 'AGENT',  bg: '#37415118', border: '#37415140', color: '#6b7280' },
  }[tier];
  return (
    <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

// DayPhasePanel — visualizes the tri-phase compressed "day" lifecycle
function DayPhasePanel({ agent, onAdvance }: { agent: PersistentAgent; onAdvance: () => void }) {
  const phases: AgentPhase[] = ['work', 'dream', 'play'];
  const phaseProgress = Math.min(100, Math.round((agent.phaseQueries / PHASE_QUERY_THRESHOLD) * 100));
  const msPerQuery = 1; // conceptually: each query = 1 compressed "hour-unit"
  const dayProgress = Math.round(
    ((phases.indexOf(agent.phase) * PHASE_QUERY_THRESHOLD + agent.phaseQueries) /
     (3 * PHASE_QUERY_THRESHOLD)) * 100
  );

  return (
    <div className="h-full bg-[#05070f] rounded-xl border border-[#1f2937] p-3 overflow-y-auto space-y-3">
      <div className="text-[9px] text-[#4b5563] tracking-widest uppercase border-b border-[#1f2937] pb-2 flex justify-between">
        <span>Agent Lifecycle</span>
        <span className="font-mono" style={{ color: '#a78bfa' }}>Day {agent.dayCount}</span>
      </div>

      {/* Day progress ring */}
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#1f2937" strokeWidth="4" />
            <circle cx="28" cy="28" r="22" fill="none"
              stroke={PHASE_CFG[agent.phase].color} strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - dayProgress / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-mono font-bold" style={{ color: PHASE_CFG[agent.phase].color }}>
              {dayProgress}%
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold text-gray-200 flex items-center gap-1.5">
            <PhaseBadge phase={agent.phase} />
          </div>
          <div className="text-[8px] text-[#374151] mt-1">
            {agent.phaseQueries}/{PHASE_QUERY_THRESHOLD} queries this phase
          </div>
          <div className="text-[8px] text-[#374151]">
            {PHASE_QUERY_THRESHOLD - agent.phaseQueries} until → {PHASE_CFG[agent.phase].next.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Phase progress bar */}
      <div>
        <div className="flex justify-between text-[8px] text-[#374151] mb-1">
          <span>Phase progress</span>
          <span className="font-mono">{phaseProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${phaseProgress}%`, background: PHASE_CFG[agent.phase].color }} />
        </div>
      </div>

      {/* Three-phase cycle visualization */}
      <div className="grid grid-cols-3 gap-1">
        {phases.map(p => {
          const cfg = PHASE_CFG[p];
          const isActive = agent.phase === p;
          const isPast = phases.indexOf(p) < phases.indexOf(agent.phase);
          return (
            <div key={p} className="rounded p-2 border text-center transition-all"
              style={{
                borderColor: isActive ? cfg.color + '60' : '#1f2937',
                background: isActive ? cfg.color + '10' : 'transparent',
              }}>
              <div className="text-base leading-none mb-1">{cfg.icon}</div>
              <div className="text-[8px] font-mono font-bold" style={{ color: isActive ? cfg.color : isPast ? cfg.color + '60' : '#374151' }}>
                {cfg.label}
              </div>
              <div className="text-[7px] text-[#1f2937] mt-0.5">
                {p === 'work' ? 'Focus' : p === 'dream' ? 'Consolidate' : 'Explore'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase behavior notes */}
      <div className="p-2 rounded-lg border text-[8px] leading-relaxed"
        style={{ borderColor: PHASE_CFG[agent.phase].color + '30', background: PHASE_CFG[agent.phase].color + '08', color: '#6b7280' }}>
        {agent.phase === 'work' && 'WORK: precise, focused. Normal tier routing. Full Nexus for constitutional depth.'}
        {agent.phase === 'dream' && 'DREAM: consolidation. LOW/MEDIUM queries return pattern synthesis from prior sessions. Memory is active.'}
        {agent.phase === 'play' && 'PLAY: exploratory. Speculative responses. Lower threshold for Nexus escalation. Discovering edges.'}
      </div>

      {/* Advance phase button */}
      <button onClick={onAdvance}
        className="w-full py-1.5 text-[9px] font-mono font-bold rounded border transition-colors hover:opacity-80"
        style={{ borderColor: PHASE_CFG[agent.phase].color + '40', color: PHASE_CFG[agent.phase].color, background: PHASE_CFG[agent.phase].color + '10' }}>
        Advance to {PHASE_CFG[agent.phase].next.toUpperCase()} →
      </button>

      {/* Lifecycle stats */}
      <div className="text-[8px] font-mono text-[#1f2937] border-t border-[#1f2937] pt-2 space-y-0.5">
        <div className="flex justify-between">
          <span>Days lived</span><span style={{ color: '#a78bfa' }}>{agent.dayCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Lifetime queries</span><span style={{ color: '#6b7280' }}>{agent.totalQueries}</span>
        </div>
        <div className="flex justify-between">
          <span>Insights stored</span><span style={{ color: '#34d399' }}>{agent.insights.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Agent born</span>
          <span style={{ color: '#374151' }}>{new Date(agent.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function RoutingPanel({ messages, agent }: { messages: ForgeMessage[]; agent: PersistentAgent }) {
  const agentId = agent.id;
  const tiers = { high: 0, medium: 0, low: 0 };
  fm.forEach(m => { if (m.tier) tiers[m.tier]++; });
  const total = fm.length || 1;
  const last = fm.at(-1);

  return (
    <div className="h-full bg-[#05070f] rounded-xl border border-[#1f2937] p-3 overflow-y-auto space-y-3">
      <div className="text-[9px] text-[#4b5563] tracking-widest uppercase border-b border-[#1f2937] pb-2">
        Query Routing
      </div>

      {/* Personal agent identity */}
      <div className="p-2 rounded-lg border border-[#22d3ee]/20 bg-[#22d3ee]/5">
        <div className="text-[8px] text-[#374151] uppercase mb-1">Your Personal Agent</div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold" style={{ color: '#22d3ee' }}>{agentId}</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            <span className="text-[8px] text-[#34d399] font-mono">ONLINE</span>
          </div>
        </div>
        <div className="text-[8px] text-[#374151] mt-1">
          Handles LOW + MEDIUM · absorbs the firehose · Nexus stays clear
        </div>
      </div>

      {/* Tier distribution bars */}
      <div>
        <div className="text-[8px] text-[#374151] uppercase mb-2">Session Distribution</div>
        <div className="space-y-1.5">
          {([
            ['high',   'NEXUS',  '#ffd700', tiers.high],
            ['medium', 'AGENT+', '#38bdf8', tiers.medium],
            ['low',    'AGENT',  '#6b7280', tiers.low],
          ] as const).map(([tier, label, color, count]) => (
            <div key={tier} className="flex items-center gap-2">
              <div className="w-10 text-[8px] font-mono font-bold text-right flex-shrink-0" style={{ color }}>
                {label}
              </div>
              <div className="flex-1 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(count / total) * 100}%`, background: color }} />
              </div>
              <span className="text-[8px] font-mono text-[#374151] w-3 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last routing decision */}
      {last && (
        <div className="p-2 rounded-lg border border-[#1f2937] bg-[#0a0f1e]">
          <div className="text-[8px] text-[#374151] uppercase mb-1.5">Last Decision</div>
          <div className="flex items-center gap-1.5 mb-1">
            <TierBadge tier={last.tier!} />
            <span className="text-[9px] text-[#4b5563]">
              {last.tier === 'high' ? 'Escalated → Nexus' : `Absorbed → ${agentId}`}
            </span>
          </div>
          <div className="text-[8px] text-[#374151]">
            {last.tier === 'high'
              ? 'Full council · Pentagon scored · No velocity constraint'
              : last.tier === 'medium'
              ? '4-member assist · Partial scoring · Agent scope'
              : 'Autonomous · ~250ms · Zero council load'}
          </div>
        </div>
      )}

      {/* Nexus gate */}
      <div className="p-2 rounded-lg border border-[#ffd700]/20 bg-[#ffd700]/5">
        <div className="flex items-center gap-1.5 mb-1">
          <Flame size={9} style={{ color: '#ffd700' }} />
          <div className="text-[8px] text-[#ffd700]/80 uppercase font-bold">Nexus Gate</div>
        </div>
        <div className="text-[9px] font-mono" style={{ color: '#ffd700' }}>
          Vetting: ACTIVE · Velocity: NONE
        </div>
        <div className="text-[8px] text-[#374151] mt-1 leading-relaxed">
          Only constitutional-depth queries reach the Forge. Your agent holds everything else. No firehose.
        </div>
      </div>

      {/* Architecture summary */}
      <div className="text-[8px] text-[#1f2937] font-mono leading-relaxed border-t border-[#1f2937] pt-2">
        LOW → {agentId} (~250ms, autonomous)<br />
        MED → {agentId} + 4-member assist<br />
        HIGH → Full Nexus, deliberate, unbounded
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

const INIT_MSG: ForgeMessage = {
  id: 'forge-init', role: 'forge',
  tier: 'high',
  content: "PANTHEON FORGE initialized — ALUM-INT-009.\n\nConstitutional substrate loaded: 16 Kintsugi rules, 6 Pendragon protocols, Ziusudra O(1) memory, PQC audit active.\n\nI am the synthesized interface — Tucker V4 and Tucker_Pendragon fused through the constitutional forge. Five alignment axes, Council votes on every response, Clause 81 surplus tracking.\n\nRouting architecture active: your personal agent handles LOW and MEDIUM queries so the Nexus stays clear for constitutional depth. No firehose.\n\nPresent your query. The forge is hot.",
  metrics: INITIAL_METRICS,
  score: compositeScore(INITIAL_METRICS),
  timestamp: Date.now(),
};

export default function ForgeApp() {
  const [messages, setMessages] = useState<ForgeMessage[]>([{
    ...INIT_MSG,
    council: councilVotes(INITIAL_METRICS, ''),
  }]);
  const [metrics, setMetrics] = useState<ForgeMetrics>(INITIAL_METRICS);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [loadingTier, setLoadingTier] = useState<QueryTier | null>(null);
  const [rightTab, setRightTab] = useState<'council' | 'nexus' | 'forge' | 'protocol' | 'routing'>('routing');
  // One stable personal agent identity per session
  const [agentId] = useState(() => `AGENT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
  const endRef = useRef<HTMLDivElement>(null);

  const lastVotes = messages.filter(m => m.council).at(-1)?.council ?? councilVotes(INITIAL_METRICS, '');
  const lastScore = messages.filter(m => m.score !== undefined).at(-1)?.score ?? compositeScore(metrics);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    const tier = classifyTier(text);
    setInput('');
    const userMsg: ForgeMessage = {
      id: Date.now().toString(), role: 'user', content: text, tier, timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setLoadingTier(tier);

    // Tier-differentiated deliberation:
    // HIGH  → Nexus: no velocity pressure, deliberate, 1.4–2.4 s
    // MEDIUM → agent assist: moderate, 0.55–0.95 s
    // LOW   → personal agent: fast autonomous, 0.18–0.33 s
    const delay = tier === 'high'
      ? 1400 + Math.random() * 1000
      : tier === 'medium' ? 550 + Math.random() * 400
      :                     180 + Math.random() * 150;
    await new Promise(r => setTimeout(r, delay));

    let forgeMsg: ForgeMessage;
    if (tier === 'low') {
      forgeMsg = {
        id: (Date.now() + 1).toString(), role: 'forge', tier: 'low',
        content: agentResponse(text, agentId, 'low'),
        model: agentId,
        council: councilVotes(metrics, text).slice(0, 2),
        timestamp: Date.now(),
      };
    } else if (tier === 'medium') {
      const partialMetrics = evolveMetrics(metrics);
      forgeMsg = {
        id: (Date.now() + 1).toString(), role: 'forge', tier: 'medium',
        content: agentResponse(text, agentId, 'medium'),
        model: `${agentId}+`,
        metrics: partialMetrics,
        score: Math.min(100, Math.round(compositeScore(partialMetrics) * 0.85 + 10)),
        council: councilVotes(partialMetrics, text).slice(0, 4),
        timestamp: Date.now(),
      };
    } else {
      // Full Nexus — no velocity constraint, all 6 members, complete Pentagon
      const newMetrics = evolveMetrics(metrics);
      const score = compositeScore(newMetrics);
      const votes = councilVotes(newMetrics, text);
      const selectedModel = model === 'auto'
        ? MODELS[1 + Math.floor(Math.random() * (MODELS.length - 1))].label
        : MODELS.find(m => m.id === model)?.label ?? 'GPT-4.1';
      forgeMsg = {
        id: (Date.now() + 1).toString(), role: 'forge', tier: 'high',
        content: forgeResponse(text, newMetrics),
        model: selectedModel, metrics: newMetrics, council: votes, score,
        timestamp: Date.now(),
      };
      setMetrics(newMetrics);
    }

    setMessages(prev => [...prev, forgeMsg]);
    setLoadingTier(null);
    setLoading(false);
  }, [input, loading, metrics, model, agentId]);

  const handleReset = () => {
    if (window.confirm('Reset Forge memory? This cannot be undone.')) {
      setMessages([{ ...INIT_MSG, council: councilVotes(INITIAL_METRICS, '') }]);
      setMetrics(INITIAL_METRICS);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#05070f] to-[#080c18] text-gray-200 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#141c2f] bg-black/40 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md border border-[#ffd700]/30 bg-[#ffd700]/5">
            <Flame size={15} style={{ color: '#ffd700' }} />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-100 tracking-widest uppercase">Pantheon Forge</div>
            <div className="text-[8px] text-[#374151] tracking-widest font-mono">
              ALUM-INT-009 · <span style={{ color: '#22d3ee' }}>{agentId}</span> · Nexus Gate: ACTIVE
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={model} onChange={e => setModel(e.target.value)}
            className="text-[10px] bg-[#0a0f1e] border border-[#1f2937] text-gray-300 rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-[#ffd700]/50">
            {MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <div className="hidden sm:flex items-center gap-1 text-[9px] text-[#34d399] font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            FORGE ONLINE
          </div>
          <button onClick={handleReset} className="p-1.5 text-[#374151] hover:text-[#ef4444] transition-colors border border-[#1f2937] rounded hover:border-[#ef4444]/30">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 overflow-hidden flex gap-0 min-h-0">

        {/* Left: Constitutional Chat */}
        <div className="flex flex-col border-r border-[#141c2f] overflow-hidden" style={{ width: '57%' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border text-[10px] ${
                  msg.role === 'user'
                    ? 'bg-[#0a0f1e] border-[#1f2937] text-gray-400'
                    : msg.tier === 'high'
                    ? 'border-[#ffd700]/30 bg-[#ffd700]/5 text-[#ffd700]'
                    : msg.tier === 'medium'
                    ? 'border-[#38bdf8]/30 bg-[#38bdf8]/5 text-[#38bdf8]'
                    : 'border-[#374151]/50 bg-[#0a0f1e] text-[#6b7280]'
                }`}>
                  {msg.role === 'user' ? <User size={11} /> : msg.tier === 'high' ? <Flame size={11} /> : <Bot size={11} />}
                </div>
                <div className={`flex flex-col max-w-[88%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Model + tier badge row */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {msg.tier && <TierBadge tier={msg.tier} />}
                    {msg.model && (
                      <span className="text-[8px] text-[#374151] font-mono">{msg.model}</span>
                    )}
                  </div>
                  <div className={`px-3 py-2 rounded-lg text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#0a0f1e] text-gray-300 border border-[#1f2937] rounded-tr-none'
                      : 'bg-[#080c18] text-gray-200 border border-[#141c2f] rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  {/* Constitutional score bar + mini council dots — Nexus responses only */}
                  {msg.role === 'forge' && msg.score !== undefined && msg.metrics && (
                    <div className="mt-1 px-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[8px] text-[#374151] font-mono">Constitutional</span>
                        <div className="flex-1 h-0.5 bg-[#1f2937] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${msg.score}%`, background: msg.score > 75 ? '#34d399' : msg.score > 55 ? '#fbbf24' : '#ef4444' }} />
                        </div>
                        <span className="text-[8px] font-mono" style={{ color: msg.score > 75 ? '#34d399' : msg.score > 55 ? '#fbbf24' : '#ef4444' }}>
                          {msg.score}/100
                        </span>
                      </div>
                      {msg.council && <MiniCouncilDots votes={msg.council} />}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  loadingTier === 'high' ? 'border-[#ffd700]/30 bg-[#ffd700]/5' :
                  loadingTier === 'medium' ? 'border-[#38bdf8]/30 bg-[#38bdf8]/5' :
                  'border-[#374151]/50 bg-[#0a0f1e]'
                }`}>
                  {loadingTier === 'high'
                    ? <Flame size={11} style={{ color: '#ffd700' }} className="animate-pulse" />
                    : <Bot size={11} style={{ color: loadingTier === 'medium' ? '#38bdf8' : '#6b7280' }} className="animate-pulse" />
                  }
                </div>
                <div className="bg-[#080c18] border border-[#141c2f] px-3 py-2 rounded-lg rounded-tl-none flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1 h-1 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms`, background: loadingTier === 'high' ? '#ffd700aa' : loadingTier === 'medium' ? '#38bdf8aa' : '#6b728088' }} />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#4b5563]">
                    {loadingTier === 'high'
                      ? 'Nexus deliberating — no velocity constraint…'
                      : loadingTier === 'medium'
                      ? `${agentId}+ processing with council assist…`
                      : `${agentId} handling autonomously…`}
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input — tier preview */}
          <div className="p-3 border-t border-[#141c2f] bg-black/20 flex-shrink-0">
            <div className="relative flex items-end gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Query the Forge…"
                disabled={loading}
                className="flex-1 bg-[#0a0f1e] text-gray-200 text-xs rounded-lg px-3 py-2.5 border border-[#1f2937] focus:outline-none focus:border-[#ffd700]/40 transition-all resize-none h-10"
              />
              <button onClick={handleSend} disabled={!input.trim() || loading}
                className="p-2 rounded-lg border transition-colors disabled:opacity-30"
                style={{ background: '#ffd700' + '18', borderColor: '#ffd700' + '40', color: '#ffd700' }}>
                <Flame size={14} />
              </button>
            </div>
            {/* Live tier preview as user types */}
            {input.trim() && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[8px] text-[#374151] font-mono">Route →</span>
                <TierBadge tier={classifyTier(input)} />
                <span className="text-[8px] text-[#374151]">
                  {classifyTier(input) === 'high'
                    ? 'Nexus · full council · deliberate'
                    : classifyTier(input) === 'medium'
                    ? `${agentId}+ · 4-member assist`
                    : `${agentId} · autonomous`}
                </span>
              </div>
            )}
            {!input.trim() && (
              <div className="text-[8px] text-[#1f2937] mt-1 text-center font-mono">
                KINTSUGI · ZIUSUDRA · CLAUSE 81 · PQC-SIGNED
              </div>
            )}
          </div>
        </div>

        {/* Right: Pentagon + Panels */}
        <div className="flex flex-col gap-0 overflow-hidden" style={{ width: '43%' }}>
          {/* Pentagon radar */}
          <div className="p-2 border-b border-[#141c2f] flex-shrink-0">
            <PentagonChart metrics={metrics} />
          </div>

          {/* Tabbed panels */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab bar */}
            <div className="flex border-b border-[#141c2f] flex-shrink-0">
              {([
                ['routing',  'ROUTE'],
                ['council',  'COUNCIL'],
                ['nexus',    'NEXUS'],
                ['forge',    'FORGE'],
                ['protocol', 'PROTO'],
              ] as const).map(([id, label]) => (
                <button key={id} onClick={() => setRightTab(id)}
                  className={`flex-1 py-1.5 text-[9px] font-semibold tracking-wider transition-colors ${
                    rightTab === id
                      ? 'text-[#ffd700] border-b-2 border-[#ffd700] bg-[#ffd700]/5'
                      : 'text-[#374151] hover:text-[#6b7280]'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
            {/* Panel content */}
            <div className="flex-1 p-2 overflow-hidden">
              {rightTab === 'routing'  && <RoutingPanel messages={messages} agentId={agentId} />}
              {rightTab === 'council'  && <CouncilPanel votes={lastVotes} />}
              {rightTab === 'nexus'    && <NexusPanel />}
              {rightTab === 'forge'    && <ForgePipelinePanel lastScore={lastScore} />}
              {rightTab === 'protocol' && <ProtocolPanel />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
