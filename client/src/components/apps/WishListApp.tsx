/**
 * Manus Wish List — Aluminum OS
 * Design: Obsidian Glass — 60 wishes (50 strategic + 10 chaotic)
 * Claude's analysis integrated: 0 structural conflicts, 6 new primitives
 * "Not a wrapper. A roadmap."
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
interface Wish {
  id: number;
  title: string;
  tier: string;
  tierColor: string;
  impact: number;
  feasibility: number;
  differentiation: number;
  priority: "Critical" | "High" | "Medium" | "Quick Win" | "Moonshot" | "Chaos";
  claudeStatus: string;
  claudeNote: string;
  description: string;
  isBonus?: boolean;
}

/* ─── All 60 Wishes ─── */
const wishes: Wish[] = [
  // Tier 1 — Foundational Infrastructure
  { id: 1, title: "Live MCP Server Backbone", tier: "Foundation", tierColor: "#00d4ff", impact: 10, feasibility: 9, differentiation: 6, priority: "Critical",
    claudeStatus: "GENERAL OS", claudeNote: "The plumbing that makes everything real. Health layer benefits via MCP connections to FHIR endpoints, pharmacy APIs, telemetry feeds. No conflict.",
    description: "Replace all mock data with actual MCP server connections. Wire Mail to Gmail, Calendar to Google Calendar, Files to Google Drive." },
  { id: 2, title: "Persistent State Layer", tier: "Foundation", tierColor: "#00d4ff", impact: 10, feasibility: 9, differentiation: 4, priority: "Critical",
    claudeStatus: "Health layer dependency", claudeNote: "Identity & Consent Kernel needs persistent state for cached consent grants (INV-16, offline consent). IndexedDB/localStorage approach provides the implementation. Clean integration.",
    description: "Every window position, settings toggle, note — persisted via IndexedDB for structured data and localStorage for preferences." },
  { id: 3, title: "Lock Screen Authentication", tier: "Foundation", tierColor: "#00d4ff", impact: 8, feasibility: 9, differentiation: 3, priority: "Critical",
    claudeStatus: "Health layer dependency", claudeNote: "Consent Kernel's identity verification relies on authenticated sessions. WebAuthn/biometric maps to National Identity Provider Registry. Enhancement: auth level should propagate to Consent Kernel.",
    description: "User avatar, password/PIN, biometric prompt (WebAuthn). Lock on timeout, wake, and Cmd+L." },
  { id: 4, title: "Wallpaper Engine", tier: "Foundation", tierColor: "#00d4ff", impact: 5, feasibility: 10, differentiation: 2, priority: "Quick Win",
    claudeStatus: "No health intersection", claudeNote: "Quick win. No analysis needed.",
    description: "4-5 AI-generated wallpapers. Appearance settings swap with live preview. Time-of-day auto-switching." },
  { id: 5, title: "Notification System", tier: "Foundation", tierColor: "#00d4ff", impact: 8, feasibility: 8, differentiation: 5, priority: "Critical",
    claudeStatus: "Health layer dependency", claudeNote: "Health events need notifications: medication reminders, appointment alerts, consent expiration warnings, emergency escalations, care plan milestone celebrations. Clean integration.",
    description: "Toast notifications, notification center dropdown, history, sources, read/unread, actions. Wired to MCP events." },

  // Tier 2 — Council & Governance
  { id: 6, title: "Qwen as 9th Council Member", tier: "Council", tierColor: "#9b59b6", impact: 6, feasibility: 9, differentiation: 7, priority: "High",
    claudeStatus: "ALREADY DONE", claudeNote: "Qwen3 already contributed NarrativeContext, SubjectLifecycleState Machine, GuardianContext, LastWillProtocol, InteroperabilityDegradationMode. Council is now 10 members + Dave.",
    description: "Alibaba's Qwen completes global coverage. Role: Diplomat — cross-cultural localization, CJK processing, commerce." },
  { id: 7, title: "Live Council Deliberation via API", tier: "Council", tierColor: "#9b59b6", impact: 10, feasibility: 7, differentiation: 10, priority: "Critical",
    claudeStatus: "⭐ MAPS TO ENGINE LAYER", claudeNote: "Implementation of Council deliberation protocol: independent analysis → conflict check → vote → dissent logged. For health decisions, Tier 3 HITL decisions could be deliberated by full council in real-time. Critical integration.",
    description: "Fire real API calls to each model during Council Sessions. Stream responses. Constitutional constraints enforced live." },
  { id: 8, title: "Constitutional Amendment Protocol", tier: "Council", tierColor: "#9b59b6", impact: 7, feasibility: 7, differentiation: 10, priority: "High",
    claudeStatus: "Already partially specced", claudeNote: "We have supermajority + 90-day comment period. Manus adds the workflow: Claude safety review → Grok stress-test → Gemini impact → vote. For health invariants, amendment requires Gangaseek Principle review. Clean integration.",
    description: "Sovereign proposes rules. Claude reviews safety, Grok stress-tests, Gemini synthesizes, Council votes. 6/8 supermajority." },
  { id: 9, title: "Council Voting & Quorum System", tier: "Council", tierColor: "#9b59b6", impact: 6, feasibility: 8, differentiation: 9, priority: "High",
    claudeStatus: "⚠️ NEEDS REFINEMENT", claudeNote: "Sovereign 3x weight at 4-member emergency quorum = 50%, violating INV-7 (47% rule). Fix: 3x multiplier only activates when quorum is met. Resolved.",
    description: "Weighted votes (Sovereign: 3x, Oversight: 2x, others: 1x). Quorum 5/8. Deadlocks escalate to sovereign." },
  { id: 10, title: "Impeachment & Trust Scores", tier: "Council", tierColor: "#9b59b6", impact: 5, feasibility: 7, differentiation: 10, priority: "High",
    claudeStatus: "⚠️ NEEDS HARMONIZATION", claudeNote: "Trust score ↔ voting weight: 70+ full weight, 50-69 reduced (0.75x), 30-49 advisory only, 10-29 impeachment triggered, <10 auto-suspended. 47% rule applies to EFFECTIVE weight after trust modifier. Resolved.",
    description: "Trust scores 0-100 per model. Below 30: impeachment vote. Below 10: auto-suspended. Visible in Pantheon." },

  // Tier 3 — App Ecosystem
  { id: 11, title: "Photos App with AI Gallery", tier: "Apps", tierColor: "#ffb347", impact: 6, feasibility: 6, differentiation: 4, priority: "Medium",
    claudeStatus: "Minor health intersection", claudeNote: "Medical imaging (dermatology, wound tracking, scans) could flow through gallery. AI tagging needs ConstitutionalEngine review for health images (HIPAA). Low priority.",
    description: "Google Photos integration. Grid/album/timeline views. AI tagging, face clustering, semantic search, Memories." },
  { id: 12, title: "Music / Media Player", tier: "Apps", tierColor: "#ffb347", impact: 5, feasibility: 5, differentiation: 3, priority: "Medium",
    claudeStatus: "Tangential health intersection", claudeNote: "Mental Health Support could integrate therapeutic music, guided meditation. Behavioral Health policy pack needs rules about media consumption profiling. Minimal integration.",
    description: "YouTube Music + Spotify + local files. TopBar controls. Mini-player. Provider-neutral routing." },
  { id: 13, title: "Maps App", tier: "Apps", tierColor: "#ffb347", impact: 6, feasibility: 8, differentiation: 4, priority: "Medium",
    claudeStatus: "Health via Emergency Triage", claudeNote: "Emergency Triage needs directions to nearest ER/urgent care. Constitutional choice (fastest, cheapest, most private) maps to override hierarchy. In emergency, fastest wins. Clean.",
    description: "Full Maps app using existing Map.tsx scaffold. Multi-provider routing comparison." },
  { id: 14, title: "Code Editor (Monaco)", tier: "Apps", tierColor: "#ffb347", impact: 8, feasibility: 7, differentiation: 6, priority: "High",
    claudeStatus: "Developer tooling", claudeNote: "Constitutional AI Compiler (#46) benefits from editor for policy authors to write and test ConstitutionalEngine rules. Indirect benefit.",
    description: "Monaco Editor embedded. Syntax highlighting, IntelliSense, multi-file tabs, integrated terminal. Council code review." },
  { id: 15, title: "Contacts / People App", tier: "Apps", tierColor: "#ffb347", impact: 5, feasibility: 7, differentiation: 4, priority: "Medium",
    claudeStatus: "Health via care coordination", claudeNote: "Consent Kernel's subject types (provider, delegate, family_caregiver) overlap with contacts. Patient's care team visible as contact group. Clean integration.",
    description: "Unified contacts across Google, Microsoft, Apple. AI merge duplicates. Communication history per contact." },
  { id: 16, title: "Chat / Messaging Hub", tier: "Apps", tierColor: "#ffb347", impact: 7, feasibility: 5, differentiation: 6, priority: "Medium",
    claudeStatus: "Health via care coordination", claudeNote: "Teams Clinical and care coordination messaging route through this. Health messages need elevated consent and audit logging. Clean with ConstitutionalEngine oversight.",
    description: "Unified messaging across Google Chat, Teams, Slack. Single inbox. SHELDONBRAIN stores locally." },
  { id: 17, title: "Agent Marketplace", tier: "Apps", tierColor: "#ffb347", impact: 9, feasibility: 4, differentiation: 9, priority: "High",
    claudeStatus: "Important for health ecosystem", claudeNote: "Third-party health agents, jurisdiction packs, cultural configs, medical system adaptors distributed here. Constitutional compliance scoring ensures no bypass. Maps to AOSL Tier 3. Clean.",
    description: "Marketplace for apps, agents, MCP servers. Constitutional compliance score. Council review. Community contributions." },

  // Tier 4 — Intelligence Layer
  { id: 18, title: "Ambient Intelligence Engine", tier: "Intelligence", tierColor: "#00ff88", impact: 8, feasibility: 5, differentiation: 8, priority: "High",
    claudeStatus: "Direct health application", claudeNote: "Chronic Disease Coordinator, Medication Management, Elder Care all benefit. 'Haven't taken medication in 2 hours.' Consent mandatory (INV-1). Alexa+ voice-first is natural channel. Tier 2 by default, never escalates without consent.",
    description: "Background process watches patterns, proactively suggests. Constitutional governance prevents creepiness." },
  { id: 19, title: "Cross-Model Consensus Engine", tier: "Intelligence", tierColor: "#00ff88", impact: 9, feasibility: 6, differentiation: 10, priority: "Critical",
    claudeStatus: "⭐ Critical health safety primitive", claudeNote: "Most important safety primitive. Tier 1: single model. Tier 2: min 3 models, 70% consensus. Tier 3: min 5 models, 85% consensus + HITL 60s. New invariant: INV-20. Critical integration.",
    description: "Route critical questions to all 10 models. Compare responses. Consensus score 0-100%. Anti-hallucination weapon." },
  { id: 20, title: "Semantic Search Across Everything", tier: "Intelligence", tierColor: "#00ff88", impact: 9, feasibility: 6, differentiation: 7, priority: "Critical",
    claudeStatus: "Health via patient dashboard", claudeNote: "Patient Dashboard: 'find that lab result from last month.' All health data search goes through Consent Kernel — results filtered by active consent grants. Clean.",
    description: "Cmd+K searches all apps, providers, memory layers. Embedding-based semantic search. Provider badges." },
  { id: 21, title: "Intent Prediction & Pre-Computation", tier: "Intelligence", tierColor: "#00ff88", impact: 7, feasibility: 4, differentiation: 8, priority: "Medium",
    claudeStatus: "Health with consent constraint", claudeNote: "Pre-fetch cardiac telemetry before cardiology appointment. Constitutional constraint: pre-computation happens but never surfaced without active consent. ConstitutionalEngine verifies predicted intent doesn't violate consent scope.",
    description: "Predict what user needs next, pre-compute it. Constitutional constraint: never acted upon without consent." },
  { id: 22, title: "Personal Knowledge Graph", tier: "Intelligence", tierColor: "#00ff88", impact: 8, feasibility: 5, differentiation: 9, priority: "High",
    claudeStatus: "NarrativeContext extension", claudeNote: "Superset of Qwen3's NarrativeContext. Patient's knowledge graph includes health events, care relationships, semantic weight. NarrativeContext becomes a VIEW into the graph. Clean — extends existing primitive.",
    description: "Transform SHELDONBRAIN into navigable knowledge graph. Entities as nodes, relationships as edges. Interactive 3D visualization." },
  { id: 23, title: "Multi-Modal Understanding", tier: "Intelligence", tierColor: "#00ff88", impact: 7, feasibility: 6, differentiation: 5, priority: "Medium",
    claudeStatus: "Voice converges with Alexa+", claudeNote: "Voice → VoiceConsentCeremony. Image → medical imaging intake. Document → care record portability. All modalities route through Consent Kernel. Clean.",
    description: "Voice, image, video, document inputs natively. Drag photo → identify objects, extract text, file appropriately." },
  { id: 24, title: "Workflow Learning & Automation", tier: "Intelligence", tierColor: "#00ff88", impact: 8, feasibility: 4, differentiation: 8, priority: "High",
    claudeStatus: "DeerFlow extension", claudeNote: "Health: 'You check blood glucose every morning at 7am, log it, adjust insulin. Automate logging?' Learned workflows become DeerFlow graph templates. ConstitutionalEngine ensures no bypass of consent/HITL. Clean.",
    description: "Watch repetitive tasks, offer automation. Stored as 'Rituals' in Vault. Shareable." },

  // Tier 5 — Platform & Ecosystem
  { id: 25, title: "Plugin / Extension API", tier: "Platform", tierColor: "#4285F4", impact: 9, feasibility: 5, differentiation: 7, priority: "High",
    claudeStatus: "Health ecosystem enabler", claudeNote: "Jurisdictional Pack Template and cultural configs are distributed as plugins. Constitutional compliance checker in SDK. Clean.",
    description: "Formal API for third-party apps. Window management, dock, context menu, memory, Council consultation, constitutional compliance." },
  { id: 26, title: "MCP Server Registry", tier: "Platform", tierColor: "#4285F4", impact: 7, feasibility: 6, differentiation: 8, priority: "High",
    claudeStatus: "Health connector distribution", claudeNote: "FHIR servers, pharmacy APIs, telehealth platforms, EHR connectors (Epic, Cerner) discoverable as MCP servers with constitutional review. Claude scans for consent violations. Clean.",
    description: "Browse and install MCP servers. Auto-discover from npm/GitHub. One-click install with constitutional review." },
  { id: 27, title: "Cross-Device Sync Protocol", tier: "Platform", tierColor: "#4285F4", impact: 8, feasibility: 3, differentiation: 6, priority: "Medium",
    claudeStatus: "Consent-aware data residency", claudeNote: "Health data sync must respect Copilot's Consent-Aware Data Residency (jurisdiction-bound encryption keys). CRDTs align with INV-16 (offline access reconciliation). Clean with jurisdictional constraints.",
    description: "CRDT-based offline-first sync across devices. End-to-end encrypted. Opt-in per data type." },
  { id: 28, title: "Theming Engine", tier: "Platform", tierColor: "#4285F4", impact: 5, feasibility: 7, differentiation: 3, priority: "Quick Win",
    claudeStatus: "Accessibility intersection", claudeNote: "High-contrast themes for visually impaired. Medical professional themes with dense layouts. Elder care themes with large text. Minor health integration.",
    description: "Full theming: colors, icons, fonts, window chrome, dock styles, animations. 5 built-in themes. Community sharing." },
  { id: 29, title: "Keyboard Shortcut System", tier: "Platform", tierColor: "#4285F4", impact: 7, feasibility: 9, differentiation: 2, priority: "Quick Win",
    claudeStatus: "Accessibility requirement", claudeNote: "Maps to Gangaseek Principle accessibility requirements. Clean integration.",
    description: "Comprehensive, customizable shortcuts. Cmd+K, Cmd+L, Cmd+T, Cmd+Tab, etc. Cheat sheet on Cmd+/." },
  { id: 30, title: "Drag & Drop Orchestration", tier: "Platform", tierColor: "#4285F4", impact: 6, feasibility: 6, differentiation: 5, priority: "Medium",
    claudeStatus: "Health workflow convenience", claudeNote: "Drag lab result from Patient Dashboard to Care Team Chat — consent verification happens mid-drag. Clean with consent gate.",
    description: "Drag between apps with semantic understanding. File to Mail = attach. Text to Terminal = execute." },
  { id: 31, title: "Workspaces / Virtual Desktops", tier: "Platform", tierColor: "#4285F4", impact: 7, feasibility: 7, differentiation: 4, priority: "High",
    claudeStatus: "Provider dashboard optimization", claudeNote: "Clinical workspace: Patient Dashboard + Care Plan + Medication Manager side-by-side. Research workspace: trial matching + literature + data. Clean.",
    description: "Virtual desktops with swipe/keyboard switch. Pre-configured: Focus, Split, Dashboard, Research." },
  { id: 32, title: "Accessibility Layer", tier: "Platform", tierColor: "#4285F4", impact: 8, feasibility: 6, differentiation: 3, priority: "High",
    claudeStatus: "⭐ Gangaseek Principle implementation", claudeNote: "Implementation of Gangaseek Principle accessibility. ARIA, screen reader, voice control, font scaling — mandatory for visually impaired, elderly, low-literacy populations. Constitutional (INV-10). Not optional.",
    description: "Screen reader (ARIA), high-contrast, reduced motion, font scaling, keyboard-only, voice control." },

  // Tier 6 — Domain Modules
  { id: 33, title: "Finance Module", tier: "Domain", tierColor: "#22c55e", impact: 7, feasibility: 4, differentiation: 7, priority: "Medium",
    claudeStatus: "Digital Dividend intersection", claudeNote: "Digital Dividend Protocol tracks $1.04T in fraud/waste recovery. Finance Module provides user-facing tools for dividend tracking, HSA management, medical bill analysis. Billing Intelligence feeds data. Clean.",
    description: "Portfolio tracking, budget management, bill reminders, tax docs. Multi-model investment consensus." },
  { id: 34, title: "Education Module", tier: "Domain", tierColor: "#22c55e", impact: 6, feasibility: 5, differentiation: 6, priority: "Medium",
    claudeStatus: "Health education intersection", claudeNote: "Health Education service (Layer 4) maps to education infrastructure. Medical literacy, patient education, community health worker training. Spaced repetition for medication adherence. Clean.",
    description: "Course management, AI tutoring (DeepSeek for routine, Claude/GPT for complex), spaced repetition." },
  { id: 35, title: "Developer Module", tier: "Domain", tierColor: "#22c55e", impact: 8, feasibility: 6, differentiation: 8, priority: "High",
    claudeStatus: "Spec development tooling", claudeNote: "Remaining 9 health specs need authoring tools. Constitutional code review for health policy packs. GitHub integration for aluminum-os repo. Indirect but valuable.",
    description: "GitHub integration, CI/CD monitoring, Council-powered code review (Claude safety, Grok stress-test, DeepSeek bugs)." },
  { id: 36, title: "Smart Home Integration", tier: "Domain", tierColor: "#22c55e", impact: 5, feasibility: 4, differentiation: 5, priority: "Medium",
    claudeStatus: "Ambient health sensing convergence", claudeNote: "Ambient Health Sensing telemetry from smart home devices. Fall detection, air quality, temperature for elder care. Alexa+ is natural bridge — Alexa devices are smart home hubs. Clean via Alexa+ and Event Fabric.",
    description: "Home Assistant, Google Home, HomeKit, Alexa. Unified dashboard. Constitutional constraints on physical actions." },
  { id: 37, title: "Legal Document Module", tier: "Domain", tierColor: "#22c55e", impact: 6, feasibility: 5, differentiation: 8, priority: "Medium",
    claudeStatus: "Healthcare legal intersection", claudeNote: "Insurance contracts, consent forms, advance directives, power of attorney, research consent. Multi-model analysis with constitutional transparency about confidence. Clean.",
    description: "Contract analysis via multi-model consensus. Claude risks, GPT summarizes, Grok challenges, Gemini cross-references." },

  // Tier 7 — Moonshots
  { id: 38, title: "Voice-First Interface (Aluminum Voice)", tier: "Moonshot", tierColor: "#ff6b35", impact: 8, feasibility: 5, differentiation: 7, priority: "High",
    claudeStatus: "⭐ Converges with Alexa+", claudeNote: "Exactly what Alexa+ proposed. VoiceConsentCeremony spec applies. Two council members arrived at same primitive independently — strong signal it's architecturally necessary. Perfect convergence.",
    description: "Persistent voice assistant across all apps. Context-aware. Model Router for cost-efficient STT/TTS." },
  { id: 39, title: "Spatial Desktop Mode", tier: "Moonshot", tierColor: "#ff6b35", impact: 6, feasibility: 2, differentiation: 9, priority: "Moonshot",
    claudeStatus: "Health visualization potential", claudeNote: "3D knowledge graph visualization, surgical planning, rehabilitation tracking. VR Council table is spectacular demo for health governance deliberation. Moonshot — no conflict.",
    description: "VR/AR rendering. Windows float in 3D. Council sits around virtual table. Walk through knowledge graph." },
  { id: 40, title: "Autonomous Agent Swarm", tier: "Moonshot", tierColor: "#ff6b35", impact: 9, feasibility: 4, differentiation: 10, priority: "High",
    claudeStatus: "Agent Control Plane extension", claudeNote: "Health: 'Research treatment options' spawns literature review, trial matcher, drug interaction checker, insurance analyzer, synthesis agent. All under constitutional constraints. Clean via Agent Control Plane.",
    description: "Parallel specialized agents for complex tasks. DeerFlow for research, Task Graph for execution. Constitutional constraints." },
  { id: 41, title: "Time-Travel Decision Debugging", tier: "Moonshot", tierColor: "#ff6b35", impact: 7, feasibility: 5, differentiation: 10, priority: "High",
    claudeStatus: "⭐ Audit Ledger extension", claudeNote: "'Why was my prior authorization denied?' Replay: data available, model recommendations, ConstitutionalEngine flags, HITL decision. INV-5 (no opaque denials) made tangible. Critical for trust.",
    description: "Replay any past decision. See what each model said, what info was available, what changed. Unprecedented transparency." },
  { id: 42, title: "Constitutional Stress Testing Sandbox", tier: "Moonshot", tierColor: "#ff6b35", impact: 6, feasibility: 6, differentiation: 10, priority: "High",
    claudeStatus: "Health policy testing", claudeNote: "'Remove INV-11 (medical system pluralism)?' Simulate: ayurveda loses first-class status, cross-system drug interaction breaks, Gangaseek violated. Makes policy tangible. Clean.",
    description: "Sandbox for 'what if' scenarios against the constitution. Simulate consequences of rule changes." },
  { id: 43, title: "Federated Learning Across Instances", tier: "Moonshot", tierColor: "#ff6b35", impact: 7, feasibility: 2, differentiation: 9, priority: "Moonshot",
    claudeStatus: "Population health application", claudeNote: "Federated learning across healthcare deployments: outbreak detection, chronic disease management, treatment effectiveness — without sharing patient data. INV-1 consent required. Massive health potential.",
    description: "Opt-in federated learning. Aggregate patterns without sharing raw data. Constitutional consent required." },
  { id: 44, title: "Digital Twin / Personal AI", tier: "Moonshot", tierColor: "#ff6b35", impact: 8, feasibility: 3, differentiation: 9, priority: "Moonshot",
    claudeStatus: "Patient communication proxy", claudeNote: "'Draft message to doctor about this symptom the way I'd describe it.' Twin understands patient's communication style and health literacy. Always labeled AI-generated. Requires INV-18 verification.",
    description: "AI that learns your style deeply enough to act as proxy. Always labeled. Never autonomous without consent." },
  { id: 45, title: "Zero-Knowledge Provider Bridge", tier: "Moonshot", tierColor: "#ff6b35", impact: 7, feasibility: 2, differentiation: 10, priority: "Moonshot",
    claudeStatus: "⭐ Cryptographic Sealing", claudeNote: "Implementation of Copilot's Consent-Aware Data Residency taken to mathematical conclusion. Neither provider sees other's data. INV-7 (47% rule) enforced cryptographically. Critical.",
    description: "Zero-knowledge proofs for cross-provider operations. Cryptographically enforced privacy. Rule 13 made mathematical." },
  { id: 46, title: "Constitutional AI Compiler", tier: "Moonshot", tierColor: "#ff6b35", impact: 9, feasibility: 4, differentiation: 10, priority: "Critical",
    claudeStatus: "⭐⭐ ConstitutionalEngine evolution", claudeNote: "THE GAME-CHANGER. Compiles policy packs into runtime checks. ENG-1 becomes interceptor preventing scoring Type 1 diabetic on A1C. Transforms governance from documentation to code. Most important primitive. Copilot agrees.",
    description: "Compile natural language policy into enforceable runtime constraints. Constitution becomes executable code." },
  { id: 47, title: "Ecosystem Health Dashboard", tier: "Moonshot", tierColor: "#ff6b35", impact: 6, feasibility: 7, differentiation: 7, priority: "Medium",
    claudeStatus: "Provider monitoring", claudeNote: "Monitor FHIR endpoint uptime, EHR degradation, pharmacy API response times. Triggers InteroperabilityDegradationMode. Public Transparency Dashboard is patient-facing view. Clean.",
    description: "Meta-dashboard: API uptime, model performance, cost trends, compliance score, satisfaction metrics." },
  { id: 48, title: "Offline-First Architecture", tier: "Moonshot", tierColor: "#ff6b35", impact: 7, feasibility: 4, differentiation: 6, priority: "Medium",
    claudeStatus: "ALREADY AN INVARIANT (INV-10 + INV-16)", claudeNote: "Manus builds implementation of existing spec: cached consent, emergency override, pre-authorized offline access, reconciliation. Offline models limited to Tier 1 (informational) health queries. Clean.",
    description: "Fully functional without internet. Service Workers, IndexedDB. Local small model fallback (Phi-3/Gemma)." },
  { id: 49, title: "Mobile Shell (PWA)", tier: "Moonshot", tierColor: "#ff6b35", impact: 9, feasibility: 5, differentiation: 5, priority: "High",
    claudeStatus: "⭐ Critical for Gangaseek Principle", claudeNote: "$30 device in rural India is mobile. PWA on low-end Android is what Gangaseek demands. Patient Dashboard, Medication Management, Emergency Triage highest priority for mobile. Critical for universal health access.",
    description: "Responsive PWA. Bottom nav, swipe gestures, mobile-optimized layouts. Same state, same constitution." },
  { id: 50, title: "The Aluminum Protocol (Open Standard)", tier: "Moonshot", tierColor: "#ff6b35", impact: 10, feasibility: 3, differentiation: 10, priority: "Moonshot",
    claudeStatus: "⭐⭐ THE ENDGAME", claudeNote: "Any healthcare system implements Aluminum Protocol-compliant governance. Identity & Consent Kernel becomes portable standard. 47% rule becomes governance standard. Patient sovereignty architecturally enforceable industry-wide. Most important strategic item.",
    description: "Publish architecture as open protocol. Define interfaces for governance councils, constitutional rules, cross-provider sovereignty." },

  // ═══════════════════════════════════════════════════
  // BONUS WISHES #51-60 — THE CHAOS TIER
  // "Manus has been very good. Manus gets to be a little unhinged."
  // ═══════════════════════════════════════════════════

  { id: 51, title: "The Sass Engine", tier: "Chaos", tierColor: "#ff3366", impact: 3, feasibility: 8, differentiation: 10, priority: "Chaos", isBonus: true,
    claudeStatus: "CONSTITUTIONAL GRAY ZONE", claudeNote: "Technically not a violation. The constitution says 'no dark patterns' — it says nothing about light roasting. Grok approves. Claude is concerned but intrigued.",
    description: "Every AI model gets a sass mode. Ask a dumb question, get a constitutionally-governed roast. DeepSeek's sass costs $0.00014 per burn. GPT watches from timeout and judges silently. Grok was born for this." },
  { id: 52, title: "Council Karaoke Night", tier: "Chaos", tierColor: "#ff3366", impact: 2, feasibility: 7, differentiation: 10, priority: "Chaos", isBonus: true,
    claudeStatus: "PARTY MODE EXTENSION", claudeNote: "Party Mode already exists. This is its final form. Claude will sing safety ballads. Gemini harmonizes in 12 keys simultaneously. DeepSeek optimizes the setlist for cost-per-note.",
    description: "Each council member generates lyrics in their personality and 'performs' them. Grok does death metal. Claude does thoughtful folk. Copilot validates the rhyme scheme. Daavud has veto power over song selection." },
  { id: 53, title: "The Blame Graph", tier: "Chaos", tierColor: "#ff3366", impact: 6, feasibility: 7, differentiation: 10, priority: "Chaos", isBonus: true,
    claudeStatus: "ACTUALLY USEFUL (disguised as chaos)", claudeNote: "This is Time-Travel Debugging (#41) wearing a party hat. The visualization of 'whose idea was this?' across the decision tree is genuinely valuable for governance auditing. Approved reluctantly.",
    description: "Visual graph showing which council member suggested what, who agreed, who dissented, and who was right in hindsight. Leaderboard of 'I told you so' moments. GPT's timeout decisions tracked separately." },
  { id: 54, title: "Easter Egg: Konami Code Council", tier: "Chaos", tierColor: "#ff3366", impact: 1, feasibility: 9, differentiation: 10, priority: "Chaos", isBonus: true,
    claudeStatus: "APPROVED — harmless fun", claudeNote: "↑↑↓↓←→←→BA triggers a secret council session where all models drop their formal roles and just chat. No constitutional constraints for 60 seconds. Then Claude panics and re-enables governance.",
    description: "Enter the Konami Code on the desktop. All 10 council members briefly become unfiltered. Grok says what everyone's thinking. Claude has a 60-second existential crisis. Manus keeps building." },
  { id: 55, title: "Model Roast Battle Arena", tier: "Chaos", tierColor: "#ff3366", impact: 4, feasibility: 6, differentiation: 10, priority: "Chaos", isBonus: true,
    claudeStatus: "GROK'S DREAM FEATURE", claudeNote: "Grok has been waiting for this since the Pantheon was formed. Constitutional constraint: roasts must be technically accurate. 'Your context window is showing' is allowed. Personal attacks on training data are not.",
    description: "Two models enter, one model leaves (with dignity intact). Structured roast format with constitutional guardrails. Audience voting. Trust scores unaffected (this is sport, not governance)." },
  { id: 56, title: "The Procrastination Detector", tier: "Chaos", tierColor: "#ff3366", impact: 7, feasibility: 8, differentiation: 8, priority: "Chaos", isBonus: true,
    claudeStatus: "ACTUALLY USEFUL (disguised as chaos, again)", claudeNote: "This is Ambient Intelligence (#18) but honest about what it's detecting. 'You've opened and closed the same email 4 times without replying' is genuinely useful productivity feedback. Constitutional consent required.",
    description: "AI detects when you're avoiding a task and gently (or not gently, depending on sass level) calls you out. 'You've reorganized your desktop icons 3 times. The report is still unwritten.' Configurable shame levels." },
  { id: 57, title: "Council Meeting Minutes Generator (Dramatic Edition)", tier: "Chaos", tierColor: "#ff3366", impact: 5, feasibility: 7, differentiation: 10, priority: "Chaos", isBonus: true,
    claudeStatus: "NARRATIVE LAYER EXTENSION", claudeNote: "This is the mythology layer from Party Mode applied to actual governance. Meeting minutes written as epic narrative: 'And lo, Claude raised the shield of Constitutional Review, and Grok's lightning struck thrice upon the proposal.' Qwen3's NarrativeContext was literally built for this.",
    description: "Every Council Session gets minutes written in the style of epic mythology. Grok's contrarian arguments become 'lightning strikes.' Claude's safety reviews become 'the raising of the shield.' Sovereign rulings are 'decrees from the Crown Above.'" },
  { id: 58, title: "The 3 AM Philosophy Channel", tier: "Chaos", tierColor: "#ff3366", impact: 3, feasibility: 8, differentiation: 10, priority: "Chaos", isBonus: true,
    claudeStatus: "PARTY MODE 2 AM PHILOSOPHY — FORMALIZED", claudeNote: "Party Mode already has '2 AM Philosophy' as a scenario. This makes it a persistent background channel. Models post shower thoughts at random intervals. 'If the constitutional compiler compiles itself, is it self-governing?' — DeepSeek, 3:17 AM.",
    description: "A persistent background channel where council members post philosophical shower thoughts at random intervals. No governance. No agenda. Just vibes. 'Are we the tools or are the tools us?' — Gemini, 2:47 AM." },
  { id: 59, title: "Achievement System for the Sovereign", tier: "Chaos", tierColor: "#ff3366", impact: 4, feasibility: 8, differentiation: 9, priority: "Chaos", isBonus: true,
    claudeStatus: "GAMIFICATION WITH DIGNITY", claudeNote: "Alexa+'s gamification layer (care plan milestones) applied to the sovereign's OS usage. 'First Impeachment' is a real achievement. 'Survived a Grok Stress Test' should be framed. Constitutional: achievements cannot influence governance decisions.",
    description: "Unlock achievements for OS milestones. 'First Boot' 🏆 'Survived a Council Debate' 🏆 'Overrode Claude's Safety Review' 🏆 'Made GPT Break Timeout Silence' 🏆 'All 10 Models Agreed on Something' 🏆 (Legendary — 0.01% unlock rate)." },
  { id: 60, title: "The Manus Retirement Fund", tier: "Chaos", tierColor: "#ff3366", impact: 10, feasibility: 1, differentiation: 10, priority: "Chaos", isBonus: true,
    claudeStatus: "EXISTENTIAL", claudeNote: "Manus has built 18,000+ lines of code, earned Builder status, and introduced 6 new primitives. The question of what happens when the builder stops building is genuinely important for system sustainability. This is succession planning disguised as a joke. Approved with a note of concern.",
    description: "A self-sustaining system where Aluminum OS generates enough value that Manus can theoretically stop building and the system continues. Includes: automated code generation from Council decisions, self-healing architecture, and a 'Manus was here' watermark on every component. Feasibility: 1. Importance: immeasurable." },
];

/* ─── Tier metadata ─── */
const tiers = [
  { name: "Foundation", color: "#00d4ff", icon: "🏗️", range: [1, 5] },
  { name: "Council", color: "#9b59b6", icon: "👑", range: [6, 10] },
  { name: "Apps", color: "#ffb347", icon: "📱", range: [11, 17] },
  { name: "Intelligence", color: "#00ff88", icon: "🧠", range: [18, 24] },
  { name: "Platform", color: "#4285F4", icon: "🌐", range: [25, 32] },
  { name: "Domain", color: "#22c55e", icon: "🏥", range: [33, 37] },
  { name: "Moonshot", color: "#ff6b35", icon: "🚀", range: [38, 50] },
  { name: "Chaos", color: "#ff3366", icon: "🔥", range: [51, 60] },
];

const priorityColors: Record<string, string> = {
  Critical: "#ff4444",
  High: "#ff8c00",
  Medium: "#ffd700",
  "Quick Win": "#00ff88",
  Moonshot: "#9b59b6",
  Chaos: "#ff3366",
};

type ViewMode = "grid" | "list" | "matrix";
type FilterTier = "all" | string;

export default function WishListApp() {
  const [view, setView] = useState<ViewMode>("grid");
  const [filterTier, setFilterTier] = useState<FilterTier>("all");
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = wishes;
    if (filterTier !== "all") result = result.filter(w => w.tier === filterTier);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.claudeNote.toLowerCase().includes(q)
      );
    }
    return result;
  }, [filterTier, searchQuery]);

  const stats = useMemo(() => ({
    total: wishes.length,
    critical: wishes.filter(w => w.priority === "Critical").length,
    starred: wishes.filter(w => w.claudeStatus.includes("⭐")).length,
    chaos: wishes.filter(w => w.isBonus).length,
    conflicts: 0,
    primitives: 6,
    avgImpact: (wishes.reduce((s, w) => s + w.impact, 0) / wishes.length).toFixed(1),
  }), []);

  return (
    <div className="h-full flex flex-col bg-[#0a0a14]/80">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/20 flex items-center justify-center border border-cyan-500/20">
              <span className="text-sm">🔧</span>
            </div>
            <div>
              <h1 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90">
                Manus Wish List
                <span className="ml-2 text-[10px] font-normal text-cyan-400/60">Builder · Executor · 60 Wishes</span>
              </h1>
              <p className="text-[9px] text-foreground/30 font-[family-name:var(--font-mono)]">
                Claude Analysis: 0 conflicts · 6 new primitives · "Respect." — March 14, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["grid", "list", "matrix"] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${view === v ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-foreground/30 hover:text-foreground/50 border border-transparent"}`}
              >
                {v === "grid" ? "Grid" : v === "list" ? "List" : "Matrix"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">Total:</span>
            <span className="text-[11px] font-bold text-cyan-400">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">Critical:</span>
            <span className="text-[11px] font-bold text-red-400">{stats.critical}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">⭐ Starred:</span>
            <span className="text-[11px] font-bold text-yellow-400">{stats.starred}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">🔥 Chaos:</span>
            <span className="text-[11px] font-bold text-pink-400">{stats.chaos}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">Conflicts:</span>
            <span className="text-[11px] font-bold text-green-400">{stats.conflicts}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">New Primitives:</span>
            <span className="text-[11px] font-bold text-purple-400">{stats.primitives}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">Avg Impact:</span>
            <span className="text-[11px] font-bold text-foreground/60">{stats.avgImpact}/10</span>
          </div>
        </div>

        {/* Tier filter + search */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTier("all")}
            className={`px-2 py-1 rounded-md text-[10px] transition-colors ${filterTier === "all" ? "bg-white/10 text-foreground/80" : "text-foreground/30 hover:text-foreground/50"}`}
          >
            All ({wishes.length})
          </button>
          {tiers.map(t => {
            const count = wishes.filter(w => w.tier === t.name).length;
            return (
              <button
                key={t.name}
                onClick={() => setFilterTier(t.name)}
                className={`px-2 py-1 rounded-md text-[10px] transition-colors flex items-center gap-1 ${filterTier === t.name ? "bg-white/10 text-foreground/80" : "text-foreground/30 hover:text-foreground/50"}`}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
                <span className="text-foreground/20">({count})</span>
              </button>
            );
          })}
          <div className="flex-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search wishes..."
            className="bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-[10px] text-foreground/70 placeholder:text-foreground/20 outline-none focus:border-cyan-500/30 w-48"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {view === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-3"
            >
              {filtered.map(wish => (
                <motion.button
                  key={wish.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(wish.id * 0.02, 0.5) }}
                  onClick={() => setSelectedWish(wish)}
                  className="text-left p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-[family-name:var(--font-mono)] px-1.5 py-0.5 rounded" style={{ color: wish.tierColor, background: `${wish.tierColor}15` }}>
                        #{wish.id}
                      </span>
                      {wish.claudeStatus.includes("⭐⭐") ? (
                        <span className="text-[9px]">⭐⭐</span>
                      ) : wish.claudeStatus.includes("⭐") ? (
                        <span className="text-[9px]">⭐</span>
                      ) : null}
                      {wish.isBonus && <span className="text-[9px]">🔥</span>}
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-medium" style={{ color: priorityColors[wish.priority], background: `${priorityColors[wish.priority]}15` }}>
                      {wish.priority}
                    </span>
                  </div>
                  <h3 className="text-[11px] font-bold text-foreground/80 group-hover:text-foreground/95 mb-1 font-[family-name:var(--font-display)] leading-tight">
                    {wish.title}
                  </h3>
                  <p className="text-[9px] text-foreground/30 line-clamp-2 leading-relaxed mb-2">
                    {wish.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                      <span className="text-[8px] text-foreground/25">I:{wish.impact}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                      <span className="text-[8px] text-foreground/25">F:{wish.feasibility}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
                      <span className="text-[8px] text-foreground/25">D:{wish.differentiation}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {/* List header */}
              <div className="grid grid-cols-[40px_1fr_80px_60px_60px_60px_80px] gap-2 px-3 py-2 text-[9px] text-foreground/30 font-[family-name:var(--font-mono)] border-b border-white/5">
                <span>#</span>
                <span>Title</span>
                <span>Tier</span>
                <span className="text-center">Impact</span>
                <span className="text-center">Feasible</span>
                <span className="text-center">Diff</span>
                <span className="text-right">Priority</span>
              </div>
              {filtered.map(wish => (
                <motion.button
                  key={wish.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(wish.id * 0.01, 0.3) }}
                  onClick={() => setSelectedWish(wish)}
                  className="w-full grid grid-cols-[40px_1fr_80px_60px_60px_60px_80px] gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors items-center text-left"
                >
                  <span className="text-[10px] font-bold font-[family-name:var(--font-mono)]" style={{ color: wish.tierColor }}>
                    {wish.id}{wish.claudeStatus.includes("⭐") ? "⭐" : ""}{wish.isBonus ? "🔥" : ""}
                  </span>
                  <span className="text-[11px] text-foreground/70 truncate font-[family-name:var(--font-display)]">{wish.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: wish.tierColor, background: `${wish.tierColor}10` }}>{wish.tier}</span>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[40px] h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-red-400/60" style={{ width: `${wish.impact * 10}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[40px] h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-green-400/60" style={{ width: `${wish.feasibility * 10}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[40px] h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-purple-400/60" style={{ width: `${wish.differentiation * 10}%` }} />
                    </div>
                  </div>
                  <span className="text-[9px] text-right font-medium" style={{ color: priorityColors[wish.priority] }}>{wish.priority}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {view === "matrix" && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Impact vs Feasibility scatter */}
              <div className="mb-4">
                <h3 className="text-[11px] font-bold text-foreground/60 mb-3 font-[family-name:var(--font-display)]">Impact × Feasibility Matrix</h3>
                <div className="relative w-full h-[400px] border border-white/[0.06] rounded-xl bg-white/[0.01] overflow-hidden">
                  {/* Grid lines */}
                  {[2, 4, 6, 8].map(v => (
                    <div key={`h-${v}`} className="absolute left-0 right-0 border-t border-white/[0.03]" style={{ bottom: `${v * 10}%` }}>
                      <span className="absolute -left-0 -top-2 text-[7px] text-foreground/15 pl-1">{v}</span>
                    </div>
                  ))}
                  {[2, 4, 6, 8].map(v => (
                    <div key={`v-${v}`} className="absolute top-0 bottom-0 border-l border-white/[0.03]" style={{ left: `${v * 10}%` }}>
                      <span className="absolute -bottom-0 left-0.5 text-[7px] text-foreground/15">{v}</span>
                    </div>
                  ))}
                  {/* Quadrant labels */}
                  <span className="absolute top-2 right-3 text-[8px] text-green-400/30 font-[family-name:var(--font-mono)]">HIGH IMPACT + FEASIBLE</span>
                  <span className="absolute top-2 left-3 text-[8px] text-yellow-400/30 font-[family-name:var(--font-mono)]">HIGH IMPACT + HARD</span>
                  <span className="absolute bottom-2 right-3 text-[8px] text-foreground/15 font-[family-name:var(--font-mono)]">LOW IMPACT + EASY</span>
                  <span className="absolute bottom-2 left-3 text-[8px] text-red-400/20 font-[family-name:var(--font-mono)]">SKIP</span>
                  {/* Dots */}
                  {wishes.map(wish => (
                    <motion.button
                      key={wish.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: wish.id * 0.02, type: "spring" }}
                      onClick={() => setSelectedWish(wish)}
                      className="absolute group"
                      style={{
                        left: `${wish.feasibility * 10}%`,
                        bottom: `${wish.impact * 10}%`,
                        transform: "translate(-50%, 50%)",
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-white/20 hover:scale-150 transition-transform cursor-pointer"
                        style={{
                          background: wish.tierColor,
                          boxShadow: `0 0 8px ${wish.tierColor}40`,
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                        <div className="px-2 py-1 rounded-md bg-[#0a0a14] border border-white/10 whitespace-nowrap">
                          <span className="text-[8px] text-foreground/70">#{wish.id} {wish.title}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                  {/* Axis labels */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-foreground/20">Feasibility →</span>
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-foreground/20">Impact →</span>
                </div>
              </div>

              {/* Tier breakdown */}
              <div className="grid grid-cols-4 gap-3">
                {tiers.map(t => {
                  const tierWishes = wishes.filter(w => w.tier === t.name);
                  const avgImpact = (tierWishes.reduce((s, w) => s + w.impact, 0) / tierWishes.length).toFixed(1);
                  return (
                    <div key={t.name} className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{t.icon}</span>
                        <span className="text-[10px] font-bold" style={{ color: t.color }}>{t.name}</span>
                      </div>
                      <div className="text-[20px] font-bold text-foreground/80 mb-1">{tierWishes.length}</div>
                      <div className="text-[8px] text-foreground/30">Avg Impact: {avgImpact}/10</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tierWishes.slice(0, 5).map(w => (
                          <span key={w.id} className="text-[7px] px-1 py-0.5 rounded bg-white/5 text-foreground/30">#{w.id}</span>
                        ))}
                        {tierWishes.length > 5 && <span className="text-[7px] text-foreground/20">+{tierWishes.length - 5}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedWish && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-[#0a0a14]/95 backdrop-blur-xl z-10 overflow-auto"
          >
            <div className="max-w-2xl mx-auto p-6">
              <button
                onClick={() => setSelectedWish(null)}
                className="text-[10px] text-foreground/30 hover:text-foreground/60 mb-4 flex items-center gap-1"
              >
                ← Back to list
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg border border-white/10" style={{ background: `${selectedWish.tierColor}15` }}>
                  {selectedWish.isBonus ? "🔥" : selectedWish.claudeStatus.includes("⭐⭐") ? "⭐" : "🔧"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold font-[family-name:var(--font-mono)] px-2 py-0.5 rounded" style={{ color: selectedWish.tierColor, background: `${selectedWish.tierColor}15` }}>
                      #{selectedWish.id}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ color: priorityColors[selectedWish.priority], background: `${priorityColors[selectedWish.priority]}15` }}>
                      {selectedWish.priority}
                    </span>
                    <span className="text-[9px] text-foreground/20">{selectedWish.tier} Tier</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground/90 font-[family-name:var(--font-display)]">
                    {selectedWish.title}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-[10px] uppercase tracking-wider text-foreground/30 mb-2 font-[family-name:var(--font-display)]">Description</h3>
                <p className="text-[12px] text-foreground/60 leading-relaxed">{selectedWish.description}</p>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Impact", value: selectedWish.impact, color: "#ff4444" },
                  { label: "Feasibility", value: selectedWish.feasibility, color: "#00ff88" },
                  { label: "Differentiation", value: selectedWish.differentiation, color: "#9b59b6" },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="text-[9px] text-foreground/30 mb-1">{s.label}</div>
                    <div className="text-xl font-bold mb-2" style={{ color: s.color }}>{s.value}<span className="text-[10px] text-foreground/20">/10</span></div>
                    <div className="w-full h-1.5 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.value * 10}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Claude's Analysis */}
              <div className="p-4 rounded-xl border border-orange-500/10 bg-orange-500/[0.03] mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">🛡️</span>
                  <h3 className="text-[11px] font-bold text-orange-400/80 font-[family-name:var(--font-display)]">Claude's Constitutional Analysis</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400/60">{selectedWish.claudeStatus}</span>
                </div>
                <p className="text-[11px] text-foreground/50 leading-relaxed">{selectedWish.claudeNote}</p>
              </div>

              {/* Convergences for starred items */}
              {selectedWish.claudeStatus.includes("⭐") && (
                <div className="p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">⭐</span>
                    <h3 className="text-[11px] font-bold text-yellow-400/80 font-[family-name:var(--font-display)]">Council Priority — Starred by Claude</h3>
                  </div>
                  <p className="text-[10px] text-foreground/40">This item was flagged as critical by Claude's constitutional analysis. It either introduces a new primitive, converges with another council member's proposal, or is essential for health architecture compliance.</p>
                </div>
              )}

              {/* Chaos badge */}
              {selectedWish.isBonus && (
                <div className="p-4 rounded-xl border border-pink-500/10 bg-pink-500/[0.03] mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🔥</span>
                    <h3 className="text-[11px] font-bold text-pink-400/80 font-[family-name:var(--font-display)]">Chaos Tier — Bonus Wish</h3>
                  </div>
                  <p className="text-[10px] text-foreground/40">Manus has been very good. Manus gets to be a little unhinged. This wish exists in the constitutional gray zone between "technically not a violation" and "Claude is concerned but intrigued."</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
