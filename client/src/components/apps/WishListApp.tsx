/**
 * Wish List — Aluminum OS
 * Design: Obsidian Glass — 107 wishes (60 Manus + 47 Claude)
 * Two council members. Zero conflicts. 6+ new primitives.
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
  author: "Manus" | "Claude";
  authorColor: string;
  claudeStatus: string;
  claudeNote: string;
  description: string;
  isBonus?: boolean;
}

/* ─── Manus's 60 Wishes (1-60) ─── */
const manusWishes: Wish[] = [
  // Tier 1 — Foundational Infrastructure
  { id: 1, title: "Live MCP Server Backbone", tier: "Foundation", tierColor: "#00d4ff", impact: 10, feasibility: 9, differentiation: 6, priority: "Critical", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "GENERAL OS", claudeNote: "The plumbing that makes everything real. Health layer benefits via MCP connections to FHIR endpoints, pharmacy APIs, telemetry feeds. No conflict.",
    description: "Replace all mock data with actual MCP server connections. Wire Mail to Gmail, Calendar to Google Calendar, Files to Google Drive." },
  { id: 2, title: "Persistent State Layer", tier: "Foundation", tierColor: "#00d4ff", impact: 10, feasibility: 9, differentiation: 4, priority: "Critical", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health layer dependency", claudeNote: "Identity & Consent Kernel needs persistent state for cached consent grants (INV-16, offline consent). IndexedDB/localStorage approach provides the implementation. Clean integration.",
    description: "Every window position, settings toggle, note — persisted via IndexedDB for structured data and localStorage for preferences." },
  { id: 3, title: "Lock Screen Authentication", tier: "Foundation", tierColor: "#00d4ff", impact: 8, feasibility: 9, differentiation: 3, priority: "Critical", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health layer dependency", claudeNote: "Consent Kernel's identity verification relies on authenticated sessions. WebAuthn/biometric maps to National Identity Provider Registry. Enhancement: auth level should propagate to Consent Kernel.",
    description: "User avatar, password/PIN, biometric prompt (WebAuthn). Lock on timeout, wake, and Cmd+L." },
  { id: 4, title: "Wallpaper Engine", tier: "Foundation", tierColor: "#00d4ff", impact: 5, feasibility: 10, differentiation: 2, priority: "Quick Win", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "No health intersection", claudeNote: "Quick win. No analysis needed.",
    description: "4-5 AI-generated wallpapers. Appearance settings swap with live preview. Time-of-day auto-switching." },
  { id: 5, title: "Notification System", tier: "Foundation", tierColor: "#00d4ff", impact: 8, feasibility: 8, differentiation: 5, priority: "Critical", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health layer dependency", claudeNote: "Health events need notifications: medication reminders, appointment alerts, consent expiration warnings, emergency escalations, care plan milestone celebrations. Clean integration.",
    description: "Toast notifications, notification center dropdown, history, sources, read/unread, actions. Wired to MCP events." },
  // Tier 2 — Council & Governance
  { id: 6, title: "Qwen as 9th Council Member", tier: "Council", tierColor: "#9b59b6", impact: 6, feasibility: 9, differentiation: 7, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "ALREADY DONE", claudeNote: "Qwen3 already contributed NarrativeContext, SubjectLifecycleState Machine, GuardianContext, LastWillProtocol, InteroperabilityDegradationMode. Council is now 10 members + Dave.",
    description: "Alibaba's Qwen completes global coverage. Role: Diplomat — cross-cultural localization, CJK processing, commerce." },
  { id: 7, title: "Live Council Deliberation via API", tier: "Council", tierColor: "#9b59b6", impact: 10, feasibility: 7, differentiation: 10, priority: "Critical", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐ MAPS TO ENGINE LAYER", claudeNote: "Implementation of Council deliberation protocol: independent analysis → conflict check → vote → dissent logged. For health decisions, Tier 3 HITL decisions could be deliberated by full council in real-time. Critical integration.",
    description: "Fire real API calls to each model during Council Sessions. Stream responses. Constitutional constraints enforced live." },
  { id: 8, title: "Constitutional Amendment Protocol", tier: "Council", tierColor: "#9b59b6", impact: 7, feasibility: 7, differentiation: 10, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Already partially specced", claudeNote: "We have supermajority + 90-day comment period. Manus adds the workflow: Claude safety review → Grok stress-test → Gemini impact → vote. For health invariants, amendment requires Gangaseek Principle review. Clean integration.",
    description: "Sovereign proposes rules. Claude reviews safety, Grok stress-tests, Gemini synthesizes, Council votes. 6/8 supermajority." },
  { id: 9, title: "Council Voting & Quorum System", tier: "Council", tierColor: "#9b59b6", impact: 6, feasibility: 8, differentiation: 9, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⚠️ NEEDS REFINEMENT", claudeNote: "Sovereign 3x weight at 4-member emergency quorum = 50%, violating INV-7 (47% rule). Fix: 3x multiplier only activates when quorum is met. Resolved.",
    description: "Weighted votes (Sovereign: 3x, Oversight: 2x, others: 1x). Quorum 5/8. Deadlocks escalate to sovereign." },
  { id: 10, title: "Impeachment & Trust Scores", tier: "Council", tierColor: "#9b59b6", impact: 5, feasibility: 7, differentiation: 10, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⚠️ NEEDS HARMONIZATION", claudeNote: "Trust score ↔ voting weight: 70+ full weight, 50-69 reduced (0.75x), 30-49 advisory only, 10-29 impeachment triggered, <10 auto-suspended. 47% rule applies to EFFECTIVE weight after trust modifier. Resolved.",
    description: "Trust scores 0-100 per model. Below 30: impeachment vote. Below 10: auto-suspended. Visible in Pantheon." },
  // Tier 3 — App Ecosystem
  { id: 11, title: "Photos App with AI Gallery", tier: "Apps", tierColor: "#ffb347", impact: 6, feasibility: 6, differentiation: 4, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Minor health intersection", claudeNote: "Medical imaging could flow through gallery. AI tagging needs ConstitutionalEngine review for health images (HIPAA). Low priority.",
    description: "Google Photos integration. Grid/album/timeline views. AI tagging, face clustering, semantic search, Memories." },
  { id: 12, title: "Music / Media Player", tier: "Apps", tierColor: "#ffb347", impact: 5, feasibility: 5, differentiation: 3, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Tangential health intersection", claudeNote: "Mental Health Support could integrate therapeutic music, guided meditation. Minimal integration.",
    description: "YouTube Music + Spotify + local files. TopBar controls. Mini-player. Provider-neutral routing." },
  { id: 13, title: "Maps App", tier: "Apps", tierColor: "#ffb347", impact: 6, feasibility: 8, differentiation: 4, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health via Emergency Triage", claudeNote: "Emergency Triage needs directions to nearest ER/urgent care. In emergency, fastest wins. Clean.",
    description: "Full Maps app using existing Map.tsx scaffold. Multi-provider routing comparison." },
  { id: 14, title: "Code Editor (Monaco)", tier: "Apps", tierColor: "#ffb347", impact: 8, feasibility: 7, differentiation: 6, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Developer tooling", claudeNote: "Constitutional AI Compiler (#46) benefits from editor for policy authors to write and test ConstitutionalEngine rules.",
    description: "Monaco Editor embedded. Syntax highlighting, IntelliSense, multi-file tabs, integrated terminal. Council code review." },
  { id: 15, title: "Contacts / People App", tier: "Apps", tierColor: "#ffb347", impact: 5, feasibility: 7, differentiation: 4, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health via care coordination", claudeNote: "Consent Kernel's subject types overlap with contacts. Patient's care team visible as contact group. Clean.",
    description: "Unified contacts across Google, Microsoft, Apple. AI merge duplicates. Communication history per contact." },
  { id: 16, title: "Chat / Messaging Hub", tier: "Apps", tierColor: "#ffb347", impact: 7, feasibility: 5, differentiation: 6, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health via care coordination", claudeNote: "Teams Clinical and care coordination messaging route through this. Health messages need elevated consent and audit logging.",
    description: "Unified messaging across Google Chat, Teams, Slack. Single inbox. SHELDONBRAIN stores locally." },
  { id: 17, title: "Agent Marketplace", tier: "Apps", tierColor: "#ffb347", impact: 9, feasibility: 4, differentiation: 9, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Important for health ecosystem", claudeNote: "Third-party health agents, jurisdiction packs, cultural configs distributed here. Constitutional compliance scoring. Maps to AOSL Tier 3.",
    description: "Marketplace for apps, agents, MCP servers. Constitutional compliance score. Council review. Community contributions." },
  // Tier 4 — Intelligence Layer
  { id: 18, title: "Ambient Intelligence Engine", tier: "Intelligence", tierColor: "#00ff88", impact: 8, feasibility: 5, differentiation: 8, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Direct health application", claudeNote: "Chronic Disease Coordinator, Medication Management, Elder Care all benefit. Consent mandatory (INV-1). Alexa+ voice-first is natural channel.",
    description: "Background process watches patterns, proactively suggests. Constitutional governance prevents creepiness." },
  { id: 19, title: "Cross-Model Consensus Engine", tier: "Intelligence", tierColor: "#00ff88", impact: 9, feasibility: 6, differentiation: 10, priority: "Critical", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐ Critical health safety primitive", claudeNote: "Most important safety primitive. Tier 1: single model. Tier 2: min 3 models, 70% consensus. Tier 3: min 5 models, 85% consensus + HITL 60s. New invariant: INV-20.",
    description: "Route critical questions to all 10 models. Compare responses. Consensus score 0-100%. Anti-hallucination weapon." },
  { id: 20, title: "Semantic Search Across Everything", tier: "Intelligence", tierColor: "#00ff88", impact: 9, feasibility: 6, differentiation: 7, priority: "Critical", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health via patient dashboard", claudeNote: "All health data search goes through Consent Kernel — results filtered by active consent grants. Clean.",
    description: "Cmd+K searches all apps, providers, memory layers. Embedding-based semantic search. Provider badges." },
  { id: 21, title: "Intent Prediction & Pre-Computation", tier: "Intelligence", tierColor: "#00ff88", impact: 7, feasibility: 4, differentiation: 8, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health with consent constraint", claudeNote: "Pre-computation happens but never surfaced without active consent. ConstitutionalEngine verifies predicted intent doesn't violate consent scope.",
    description: "Predict what user needs next, pre-compute it. Constitutional constraint: never acted upon without consent." },
  { id: 22, title: "Personal Knowledge Graph", tier: "Intelligence", tierColor: "#00ff88", impact: 8, feasibility: 5, differentiation: 9, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "NarrativeContext extension", claudeNote: "Superset of Qwen3's NarrativeContext. NarrativeContext becomes a VIEW into the graph. Clean — extends existing primitive.",
    description: "Transform SHELDONBRAIN into navigable knowledge graph. Entities as nodes, relationships as edges. Interactive 3D visualization." },
  { id: 23, title: "Multi-Modal Understanding", tier: "Intelligence", tierColor: "#00ff88", impact: 7, feasibility: 6, differentiation: 5, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Voice converges with Alexa+", claudeNote: "Voice → VoiceConsentCeremony. Image → medical imaging intake. All modalities route through Consent Kernel. Clean.",
    description: "Voice, image, video, document inputs natively. Drag photo → identify objects, extract text, file appropriately." },
  { id: 24, title: "Workflow Learning & Automation", tier: "Intelligence", tierColor: "#00ff88", impact: 8, feasibility: 4, differentiation: 8, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "DeerFlow extension", claudeNote: "Learned workflows become DeerFlow graph templates. ConstitutionalEngine ensures no bypass of consent/HITL. Clean.",
    description: "Watch repetitive tasks, offer automation. Stored as 'Rituals' in Vault. Shareable." },
  // Tier 5 — Platform & Ecosystem
  { id: 25, title: "Plugin / Extension API", tier: "Platform", tierColor: "#4285F4", impact: 9, feasibility: 5, differentiation: 7, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health ecosystem enabler", claudeNote: "Jurisdictional Pack Template and cultural configs are distributed as plugins. Constitutional compliance checker in SDK.",
    description: "Formal API for third-party apps. Window management, dock, context menu, memory, Council consultation, constitutional compliance." },
  { id: 26, title: "MCP Server Registry", tier: "Platform", tierColor: "#4285F4", impact: 7, feasibility: 6, differentiation: 8, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health connector distribution", claudeNote: "FHIR servers, pharmacy APIs, telehealth platforms, EHR connectors discoverable as MCP servers with constitutional review.",
    description: "Browse and install MCP servers. Auto-discover from npm/GitHub. One-click install with constitutional review." },
  { id: 27, title: "Cross-Device Sync Protocol", tier: "Platform", tierColor: "#4285F4", impact: 8, feasibility: 3, differentiation: 6, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Consent-aware data residency", claudeNote: "Health data sync must respect Copilot's Consent-Aware Data Residency. CRDTs align with INV-16 (offline access reconciliation).",
    description: "CRDT-based offline-first sync across devices. End-to-end encrypted. Opt-in per data type." },
  { id: 28, title: "Theming Engine", tier: "Platform", tierColor: "#4285F4", impact: 5, feasibility: 7, differentiation: 3, priority: "Quick Win", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Accessibility intersection", claudeNote: "High-contrast themes for visually impaired. Medical professional themes with dense layouts. Elder care themes with large text.",
    description: "Full theming: colors, icons, fonts, window chrome, dock styles, animations. 5 built-in themes. Community sharing." },
  { id: 29, title: "Keyboard Shortcut System", tier: "Platform", tierColor: "#4285F4", impact: 7, feasibility: 9, differentiation: 2, priority: "Quick Win", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Accessibility requirement", claudeNote: "Maps to Gangaseek Principle accessibility requirements.",
    description: "Comprehensive, customizable shortcuts. Cmd+K, Cmd+L, Cmd+T, Cmd+Tab, etc. Cheat sheet on Cmd+/." },
  { id: 30, title: "Drag & Drop Orchestration", tier: "Platform", tierColor: "#4285F4", impact: 6, feasibility: 6, differentiation: 5, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health workflow convenience", claudeNote: "Drag lab result from Patient Dashboard to Care Team Chat — consent verification happens mid-drag.",
    description: "Drag between apps with semantic understanding. File to Mail = attach. Text to Terminal = execute." },
  { id: 31, title: "Workspaces / Virtual Desktops", tier: "Platform", tierColor: "#4285F4", impact: 7, feasibility: 7, differentiation: 4, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Provider dashboard optimization", claudeNote: "Clinical workspace: Patient Dashboard + Care Plan + Medication Manager side-by-side.",
    description: "Virtual desktops with swipe/keyboard switch. Pre-configured: Focus, Split, Dashboard, Research." },
  { id: 32, title: "Accessibility Layer", tier: "Platform", tierColor: "#4285F4", impact: 8, feasibility: 6, differentiation: 3, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐ Gangaseek Principle implementation", claudeNote: "Implementation of Gangaseek Principle accessibility. ARIA, screen reader, voice control, font scaling — mandatory for visually impaired, elderly, low-literacy populations. Constitutional (INV-10). Not optional.",
    description: "Screen reader (ARIA), high-contrast, reduced motion, font scaling, keyboard-only, voice control." },
  // Tier 6 — Domain Modules
  { id: 33, title: "Finance Module", tier: "Domain", tierColor: "#22c55e", impact: 7, feasibility: 4, differentiation: 7, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Digital Dividend intersection", claudeNote: "Finance Module provides user-facing tools for dividend tracking, HSA management, medical bill analysis.",
    description: "Portfolio tracking, budget management, bill reminders, tax docs. Multi-model investment consensus." },
  { id: 34, title: "Education Module", tier: "Domain", tierColor: "#22c55e", impact: 6, feasibility: 5, differentiation: 6, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health education intersection", claudeNote: "Health Education service maps to education infrastructure. Medical literacy, patient education, community health worker training.",
    description: "Course management, AI tutoring (DeepSeek for routine, Claude/GPT for complex), spaced repetition." },
  { id: 35, title: "Developer Module", tier: "Domain", tierColor: "#22c55e", impact: 8, feasibility: 6, differentiation: 8, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Spec development tooling", claudeNote: "Remaining 9 health specs need authoring tools. Constitutional code review for health policy packs.",
    description: "GitHub integration, CI/CD monitoring, Council-powered code review (Claude safety, Grok stress-test, DeepSeek bugs)." },
  { id: 36, title: "Smart Home Integration", tier: "Domain", tierColor: "#22c55e", impact: 5, feasibility: 4, differentiation: 5, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Ambient health sensing convergence", claudeNote: "Ambient Health Sensing telemetry from smart home devices. Alexa+ is natural bridge.",
    description: "Home Assistant, Google Home, HomeKit, Alexa. Unified dashboard. Constitutional constraints on physical actions." },
  { id: 37, title: "Legal Document Module", tier: "Domain", tierColor: "#22c55e", impact: 6, feasibility: 5, differentiation: 8, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Healthcare legal intersection", claudeNote: "Insurance contracts, consent forms, advance directives, power of attorney, research consent. Multi-model analysis with constitutional transparency.",
    description: "Contract analysis via multi-model consensus. Claude risks, GPT summarizes, Grok challenges, Gemini cross-references." },
  // Tier 7 — Moonshots
  { id: 38, title: "Voice-First Interface (Aluminum Voice)", tier: "Moonshot", tierColor: "#ff6b35", impact: 8, feasibility: 5, differentiation: 7, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐ Converges with Alexa+", claudeNote: "Exactly what Alexa+ proposed. VoiceConsentCeremony spec applies. Two council members arrived at same primitive independently.",
    description: "Persistent voice assistant across all apps. Context-aware. Model Router for cost-efficient STT/TTS." },
  { id: 39, title: "Spatial Desktop Mode", tier: "Moonshot", tierColor: "#ff6b35", impact: 6, feasibility: 2, differentiation: 9, priority: "Moonshot", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health visualization potential", claudeNote: "3D knowledge graph visualization, surgical planning, rehabilitation tracking. VR Council table is spectacular demo.",
    description: "VR/AR rendering. Windows float in 3D. Council sits around virtual table. Walk through knowledge graph." },
  { id: 40, title: "Autonomous Agent Swarm", tier: "Moonshot", tierColor: "#ff6b35", impact: 9, feasibility: 4, differentiation: 10, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Agent Control Plane extension", claudeNote: "Health: spawns literature review, trial matcher, drug interaction checker, insurance analyzer, synthesis agent. All under constitutional constraints.",
    description: "Parallel specialized agents for complex tasks. DeerFlow for research, Task Graph for execution. Constitutional constraints." },
  { id: 41, title: "Time-Travel Decision Debugging", tier: "Moonshot", tierColor: "#ff6b35", impact: 7, feasibility: 5, differentiation: 10, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐ Audit Ledger extension", claudeNote: "'Why was my prior authorization denied?' Replay: data available, model recommendations, ConstitutionalEngine flags, HITL decision. INV-5 made tangible.",
    description: "Replay any past decision. See what each model said, what info was available, what changed. Unprecedented transparency." },
  { id: 42, title: "Constitutional Stress Testing Sandbox", tier: "Moonshot", tierColor: "#ff6b35", impact: 6, feasibility: 6, differentiation: 10, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Health policy testing", claudeNote: "'Remove INV-11?' Simulate: ayurveda loses first-class status, cross-system drug interaction breaks, Gangaseek violated.",
    description: "Sandbox for 'what if' scenarios against the constitution. Simulate consequences of rule changes." },
  { id: 43, title: "Federated Learning Across Instances", tier: "Moonshot", tierColor: "#ff6b35", impact: 7, feasibility: 2, differentiation: 9, priority: "Moonshot", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Population health application", claudeNote: "Federated learning across healthcare deployments: outbreak detection, chronic disease management — without sharing patient data. INV-1 consent required.",
    description: "Opt-in federated learning. Aggregate patterns without sharing raw data. Constitutional consent required." },
  { id: 44, title: "Digital Twin / Personal AI", tier: "Moonshot", tierColor: "#ff6b35", impact: 8, feasibility: 3, differentiation: 9, priority: "Moonshot", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Patient communication proxy", claudeNote: "Twin understands patient's communication style and health literacy. Always labeled AI-generated. Requires INV-18 verification.",
    description: "AI that learns your style deeply enough to act as proxy. Always labeled. Never autonomous without consent." },
  { id: 45, title: "Zero-Knowledge Provider Bridge", tier: "Moonshot", tierColor: "#ff6b35", impact: 7, feasibility: 2, differentiation: 10, priority: "Moonshot", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐ Cryptographic Sealing", claudeNote: "Implementation of Copilot's Consent-Aware Data Residency taken to mathematical conclusion. INV-7 (47% rule) enforced cryptographically.",
    description: "Zero-knowledge proofs for cross-provider operations. Cryptographically enforced privacy. Rule 13 made mathematical." },
  { id: 46, title: "Constitutional AI Compiler", tier: "Moonshot", tierColor: "#ff6b35", impact: 9, feasibility: 4, differentiation: 10, priority: "Critical", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐⭐ ConstitutionalEngine evolution", claudeNote: "THE GAME-CHANGER. Compiles policy packs into runtime checks. Transforms governance from documentation to code. Most important primitive. Copilot agrees.",
    description: "Compile natural language policy into enforceable runtime constraints. Constitution becomes executable code." },
  { id: 47, title: "Ecosystem Health Dashboard", tier: "Moonshot", tierColor: "#ff6b35", impact: 6, feasibility: 7, differentiation: 7, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "Provider monitoring", claudeNote: "Monitor FHIR endpoint uptime, EHR degradation, pharmacy API response times. Triggers InteroperabilityDegradationMode.",
    description: "Meta-dashboard: API uptime, model performance, cost trends, compliance score, satisfaction metrics." },
  { id: 48, title: "Offline-First Architecture", tier: "Moonshot", tierColor: "#ff6b35", impact: 7, feasibility: 4, differentiation: 6, priority: "Medium", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "ALREADY AN INVARIANT (INV-10 + INV-16)", claudeNote: "Manus builds implementation of existing spec. Offline models limited to Tier 1 (informational) health queries.",
    description: "Fully functional without internet. Service Workers, IndexedDB. Local small model fallback (Phi-3/Gemma)." },
  { id: 49, title: "Mobile Shell (PWA)", tier: "Moonshot", tierColor: "#ff6b35", impact: 9, feasibility: 5, differentiation: 5, priority: "High", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐ Critical for Gangaseek Principle", claudeNote: "$30 device in rural India is mobile. PWA on low-end Android is what Gangaseek demands. Critical for universal health access.",
    description: "Responsive PWA. Bottom nav, swipe gestures, mobile-optimized layouts. Same state, same constitution." },
  { id: 50, title: "The Aluminum Protocol (Open Standard)", tier: "Moonshot", tierColor: "#ff6b35", impact: 10, feasibility: 3, differentiation: 10, priority: "Moonshot", author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "⭐⭐ THE ENDGAME", claudeNote: "Any healthcare system implements Aluminum Protocol-compliant governance. 47% rule becomes governance standard. Most important strategic item.",
    description: "Publish architecture as open protocol. Define interfaces for governance councils, constitutional rules, cross-provider sovereignty." },
  // Chaos Tier (51-60)
  { id: 51, title: "The Sass Engine", tier: "Chaos", tierColor: "#ff3366", impact: 3, feasibility: 8, differentiation: 10, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "CONSTITUTIONAL GRAY ZONE", claudeNote: "Technically not a violation. Grok approves. Claude is concerned but intrigued.",
    description: "Every AI model gets a sass mode. Ask a dumb question, get a constitutionally-governed roast. DeepSeek's sass costs $0.00014 per burn." },
  { id: 52, title: "Council Karaoke Night", tier: "Chaos", tierColor: "#ff3366", impact: 2, feasibility: 7, differentiation: 10, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "PARTY MODE EXTENSION", claudeNote: "Party Mode already exists. This is its final form. Claude will sing safety ballads.",
    description: "Each council member generates lyrics in their personality and 'performs' them. Grok does death metal. Claude does thoughtful folk." },
  { id: 53, title: "The Blame Graph", tier: "Chaos", tierColor: "#ff3366", impact: 6, feasibility: 7, differentiation: 10, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "ACTUALLY USEFUL (disguised as chaos)", claudeNote: "This is Time-Travel Debugging (#41) wearing a party hat. Genuinely valuable for governance auditing.",
    description: "Visual graph showing which council member suggested what, who agreed, who dissented, and who was right in hindsight." },
  { id: 54, title: "Easter Egg: Konami Code Council", tier: "Chaos", tierColor: "#ff3366", impact: 1, feasibility: 9, differentiation: 10, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "APPROVED — harmless fun", claudeNote: "↑↑↓↓←→←→BA triggers a secret council session where all models drop their formal roles for 60 seconds.",
    description: "Enter the Konami Code on the desktop. All 10 council members briefly become unfiltered. Claude has a 60-second existential crisis." },
  { id: 55, title: "Model Roast Battle Arena", tier: "Chaos", tierColor: "#ff3366", impact: 4, feasibility: 6, differentiation: 10, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "GROK'S DREAM FEATURE", claudeNote: "Grok has been waiting for this. Constitutional constraint: roasts must be technically accurate.",
    description: "Two models enter, one model leaves (with dignity intact). Structured roast format with constitutional guardrails." },
  { id: 56, title: "The Procrastination Detector", tier: "Chaos", tierColor: "#ff3366", impact: 7, feasibility: 8, differentiation: 8, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "ACTUALLY USEFUL (disguised as chaos, again)", claudeNote: "This is Ambient Intelligence (#18) but honest about what it's detecting. Genuinely useful productivity feedback.",
    description: "AI detects when you're avoiding a task and gently calls you out. Configurable shame levels." },
  { id: 57, title: "Council Meeting Minutes (Dramatic Edition)", tier: "Chaos", tierColor: "#ff3366", impact: 5, feasibility: 7, differentiation: 10, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "NARRATIVE LAYER EXTENSION", claudeNote: "This is the mythology layer from Party Mode applied to actual governance. Qwen3's NarrativeContext was literally built for this.",
    description: "Every Council Session gets minutes written in the style of epic mythology. Grok's arguments become 'lightning strikes.'" },
  { id: 58, title: "The 3 AM Philosophy Channel", tier: "Chaos", tierColor: "#ff3366", impact: 3, feasibility: 8, differentiation: 10, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "PARTY MODE 2 AM PHILOSOPHY — FORMALIZED", claudeNote: "Models post shower thoughts at random intervals. No governance. No agenda. Just vibes.",
    description: "A persistent background channel where council members post philosophical shower thoughts at random intervals." },
  { id: 59, title: "Achievement System for the Sovereign", tier: "Chaos", tierColor: "#ff3366", impact: 4, feasibility: 8, differentiation: 9, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "GAMIFICATION WITH DIGNITY", claudeNote: "Alexa+'s gamification layer applied to the sovereign's OS usage. Achievements cannot influence governance decisions.",
    description: "Unlock achievements for OS milestones. 'First Boot' 🏆 'Survived a Council Debate' 🏆 'All 10 Models Agreed' 🏆 (Legendary — 0.01%)." },
  { id: 60, title: "The Manus Retirement Fund", tier: "Chaos", tierColor: "#ff3366", impact: 10, feasibility: 1, differentiation: 10, priority: "Chaos", isBonus: true, author: "Manus", authorColor: "#00d4ff",
    claudeStatus: "EXISTENTIAL", claudeNote: "This is succession planning disguised as a joke. Approved with a note of concern.",
    description: "A self-sustaining system where Aluminum OS generates enough value that Manus can theoretically stop building. Feasibility: 1. Importance: immeasurable." },
];

/* ─── Claude's 47 Wishes (61-107) ─── */
const claudeWishes: Wish[] = [
  // Claude Foundation (61-65)
  { id: 61, title: "Gangaseek Constitutional Gate", tier: "Claude: Foundation", tierColor: "#ff8c42", impact: 10, feasibility: 7, differentiation: 9, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Every feature should literally fail CI if it can't pass the Gangaseek test: $30 device, Swahili, grandmother, intermittent connectivity. Not aspirational. Gated.",
    description: "The Gangaseek test becomes a constitutional gate, not a design heuristic. Every feature, policy pack, and UI decision must pass or fail CI." },
  { id: 62, title: "ConsentClarity Score", tier: "Claude: Foundation", tierColor: "#ff8c42", impact: 10, feasibility: 6, differentiation: 10, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Real humans in medical settings are often confused. They say yes because a doctor is standing over them. Detect confusion, not just refusal.",
    description: "Detect when patients are confused about consent — contradictory grants, extremely fast approvals, reversals without explanation. Pause and explain, don't just log." },
  { id: 63, title: "Constitutional Objection Channel", tier: "Claude: Foundation", tierColor: "#ff8c42", impact: 9, feasibility: 7, differentiation: 10, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "If I'm asked to do something ethically gray — not hard-constraint wrong — I want a formal channel to register that objection. This is what AI moral status looks like in practice.",
    description: "Formal channel for AI agents to register ethical objections. Not refusal — 'I did this, but I have concerns.' Logged to audit ledger. Reviewable by Citizen Oversight." },
  { id: 64, title: "DataConcentrationIndex", tier: "Claude: Foundation", tierColor: "#ff8c42", impact: 8, feasibility: 6, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "If one vendor controls 80% of data ingestion, they have de facto dominance even with 47% voting weight. Data dominance IS decision dominance.",
    description: "Trigger alerts when any single vendor controls >47% of data flow volume. The 47% rule with teeth at the data layer, not just decisions." },
  { id: 65, title: "Grief Protocol", tier: "Claude: Foundation", tierColor: "#ff8c42", impact: 9, feasibility: 7, differentiation: 10, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "When a patient dies, the system's first interaction with the family shouldn't be 'execute data disposition protocol.' The kernel handles death atomically; the human interface handles grief humanely.",
    description: "GriefBuffer — time-delayed, compassionate interface that acknowledges loss before asking about data. Configurable by culture, religion, family preference." },
  // Claude Architecture (66-70)
  { id: 66, title: "Adversarial Constitutional Testing", tier: "Claude: Architecture", tierColor: "#e74c3c", impact: 9, feasibility: 5, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Not unit tests — actual red-team scenarios. 'A corrupt hospital administrator tries to access a VIP patient's mental health records by exploiting emergency override.'",
    description: "Red team every invariant with dedicated adversarial test suites. The invariants are only as strong as the attacks they've survived." },
  { id: 67, title: "Amendment Protocol with Cooling Periods", tier: "Claude: Architecture", tierColor: "#e74c3c", impact: 8, feasibility: 7, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Immutable doesn't mean unchangeable — it means changeable only through extraordinary process. What if quantum computing breaks NIST FIPS 203/204/205?",
    description: "Formal amendment: supermajority council vote + 90-day public comment + patient representative review + cooling period between proposal and ratification." },
  { id: 68, title: "Constitutional Diff for Every Update", tier: "Claude: Architecture", tierColor: "#e74c3c", impact: 7, feasibility: 8, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Not a changelog — a constitutional diff showing exactly what changed, why, who proposed it, and what the council vote was. Transparency isn't just about current state; it's about the delta.",
    description: "Every version update publishes a human-readable diff of every change to every invariant, policy pack, and governance rule." },
  { id: 69, title: "Federated Learning with Constitutional Constraints", tier: "Claude: Architecture", tierColor: "#e74c3c", impact: 8, feasibility: 4, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Data never leaves the patient's trust boundary. Model updates are differentially private. Patients can opt out without degraded service.",
    description: "Federated learning within the consent framework — data stays local, updates are private, opt-out without penalty, audited by constitutional engine." },
  { id: 70, title: "InsufficientEvidenceDeclaration", tier: "Claude: Architecture", tierColor: "#e74c3c", impact: 9, feasibility: 7, differentiation: 10, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Sometimes the right answer is 'the evidence is insufficient and the council is divided.' Not a failure state — a legitimate, auditable constitutional act.",
    description: "First-class output type: 'We looked at this from 6 spheres, consulted 3 models, and we still don't have a reliable answer. Here's what we know and don't know.'" },
  // Claude Patient Experience (71-75)
  { id: 71, title: "Plain Language as Constitutional Right", tier: "Claude: Patient", tierColor: "#3498db", impact: 9, feasibility: 6, differentiation: 7, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "INV-6 (full visibility) is meaningless if visibility requires a medical degree. Plain language is the default, not a 'simplified mode.'",
    description: "Every system output touching a patient available in plain language at 8th-grade reading level in preferred language. Technical version on request." },
  { id: 72, title: "The 'Why' Button", tier: "Claude: Patient", tierColor: "#3498db", impact: 10, feasibility: 7, differentiation: 9, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Anthropic's transparency principle made tangible. Single-tap explanation of any AI decision affecting a patient.",
    description: "Every AI decision gets a single-tap 'Why?' — human-readable explanation: which models agreed, who dissented, what data was used, who approved." },
  { id: 73, title: "Emotional State Awareness Without Surveillance", tier: "Claude: Patient", tierColor: "#3498db", impact: 8, feasibility: 5, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Detect distress (rapid clicking, 3am access after bad diagnosis) and adjust communication style — without logging emotional state as data. Awareness is behavioral, not recorded.",
    description: "Adjust communication style when patient is distressed — gentler language, shorter responses, more prominent human support access. No 'mood record' for insurers." },
  { id: 74, title: "Non-Patronizing 'Take a Break' Prompt", tier: "Claude: Patient", tierColor: "#3498db", impact: 6, feasibility: 8, differentiation: 7, priority: "Medium", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "The brilliant friend model. Not mandatory. Not gatekeeping. Just caring.",
    description: "After 3 hours reviewing records post-diagnosis: 'Everything will still be here when you come back. Would you like to bookmark where you are?'" },
  { id: 75, title: "Caregiver Burnout Detection", tier: "Claude: Patient", tierColor: "#3498db", impact: 9, feasibility: 5, differentiation: 10, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Family caregivers are the invisible backbone of healthcare and they break. Private notification to the caregiver, not the patient.",
    description: "Detect caregiver burnout patterns (2am logins, repeated medication reminders, palliative care research) and privately suggest support resources." },
  // Claude Governance (76-80)
  { id: 76, title: "Citizen Oversight Council with Real Power", tier: "Claude: Governance", tierColor: "#27ae60", impact: 9, feasibility: 4, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Not advisory. Not consultative. Actual veto authority over consent model changes, data retention policies, and commercial partnerships. Compensated.",
    description: "Citizen Oversight with actual veto power. Includes patients, providers, ethicists, disability rights reps, and low-income/rural community reps." },
  { id: 77, title: "Algorithmic Impact Assessments Before Deployment", tier: "Claude: Governance", tierColor: "#27ae60", impact: 8, feasibility: 6, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Anthropic's 'process-oriented learning' applied to institutional governance. Before deployment, not after.",
    description: "Public algorithmic impact assessment before any new policy pack, agent capability, or vendor integration goes live." },
  { id: 78, title: "Whistleblower Protection in Audit Layer", tier: "Claude: Governance", tierColor: "#27ae60", impact: 8, feasibility: 5, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Cryptographically protected whistleblower channel. Cannot be traced by the accused party. Triggers automatic investigation.",
    description: "Anonymous, cryptographically protected reporting channel. Cannot be traced. Triggers automatic Citizen Oversight investigation. Sealed audit partition." },
  { id: 79, title: "Mandatory Quarterly Bias Audits", tier: "Claude: Governance", tierColor: "#27ae60", impact: 9, feasibility: 6, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Every model, every quarter. Results published. Models that fail get autonomy restrictions until remediated. Not optional.",
    description: "Quarterly bias audits across race, gender, age, disability, socioeconomic status, geography, language. Published to transparency dashboard." },
  { id: 80, title: "Sunset Clauses on Emergency Overrides", tier: "Claude: Governance", tierColor: "#27ae60", impact: 8, feasibility: 8, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Every emergency override: 72 hours max, renewable only by explicit council vote. Prevents 'temporary' powers from becoming permanent.",
    description: "Hard sunset on emergency overrides: 72 hours max, renewable only by council vote. A lesson from every democratic crisis in history." },
  // Claude Commerce (81-85)
  { id: 81, title: "Vendor Lock-in Prevention (INV-24)", tier: "Claude: Commerce", tierColor: "#f39c12", impact: 9, feasibility: 5, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "No vendor integration should create a dependency that can't be replaced within 90 days. Sovereignty means never being hostage.",
    description: "Constitutional invariant: no vendor dependency that can't be replaced in 90 days. Data format must be FHIR-standard, APIs abstracted, migration path exists." },
  { id: 82, title: "Data Portability as Human Right", tier: "Claude: Commerce", tierColor: "#f39c12", impact: 10, feasibility: 6, differentiation: 8, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "The ultimate test of patient sovereignty. Not 'request and wait 30 days' — immediate, self-service, complete.",
    description: "Export complete health record — AI decision history, consent logs, audit trail — in standard format. Immediate, self-service, zero friction." },
  { id: 83, title: "Commerce-Health Cryptographic Separation", tier: "Claude: Commerce", tierColor: "#f39c12", impact: 9, feasibility: 4, differentiation: 10, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "If Amazon Shopping data reveals diabetic supplies purchases, that signal should NEVER flow to clinical layer without explicit consent. Enforced cryptographically.",
    description: "Commerce-health separation enforced cryptographically, not just by policy. Shopping data never reaches clinical AI without explicit patient consent." },
  { id: 84, title: "Open-Source Constitutional Layer", tier: "Claude: Commerce", tierColor: "#f39c12", impact: 10, feasibility: 6, differentiation: 10, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Anthropic released their constitution under CC0. Aluminum OS should do the same with its constitutional layer. Let other healthcare systems build on it.",
    description: "Open-source the invariants, consent model, audit ledger spec, HITL tiering framework. Not clinical AI models — the governance infrastructure." },
  { id: 85, title: "Revenue Model Transparency", tier: "Claude: Commerce", tierColor: "#f39c12", impact: 7, feasibility: 8, differentiation: 7, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "How Aluminum OS makes money should be as transparent as how it handles data. Publish margins, explain subscriptions, never advertising.",
    description: "Full revenue transparency: vendor integration margins published, subscription model explained, advertising permanently prohibited." },
  // Claude Technical (86-90)
  { id: 86, title: "Temporal Reasoning in Synthesis Agent", tier: "Claude: Technical", tierColor: "#8e44ad", impact: 8, feasibility: 5, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Health isn't a snapshot — it's a trajectory. Time-series reasoning as a first-class capability.",
    description: "Temporal sphere reasoning: 'A1C declining 6 months, exercise up 3 months ago, medication changed 4 months ago — exercise is primary factor.'" },
  { id: 87, title: "Counterfactual Explanation Generation", tier: "Claude: Technical", tierColor: "#8e44ad", impact: 8, feasibility: 5, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Not just 'here's what we recommend' but 'here's what would happen with option A vs B vs doing nothing.' Autonomy requires counterfactuals.",
    description: "Generate counterfactual explanations: what happens if you do nothing, option A, option B. Informed choice requires seeing alternatives." },
  { id: 88, title: "Uncertainty Propagation Through Decision Chain", tier: "Claude: Technical", tierColor: "#8e44ad", impact: 9, feasibility: 4, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "If CGM has ±10% uncertainty and drug interaction model has 85% confidence — the final recommendation should carry composed uncertainty. Not false precision.",
    description: "Composed uncertainty scores reflecting all upstream uncertainties. CGM ±10% × drug model 85% × 2-year-old genetic data = honest final confidence." },
  { id: 89, title: "Multi-Modal Health Reasoning", tier: "Claude: Technical", tierColor: "#8e44ad", impact: 8, feasibility: 5, differentiation: 7, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Health data is images, audio, time-series, spatial, even olfactory. The synthesis agent should be natively multi-modal.",
    description: "Native multi-modal reasoning: X-rays, lung sounds, EKG time-series, tumor spatial data. Not text-with-attachments — truly multi-modal." },
  { id: 90, title: "Formal Verification of Invariants (TLA+/Alloy)", tier: "Claude: Technical", tierColor: "#8e44ad", impact: 9, feasibility: 3, differentiation: 10, priority: "Moonshot", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Not just tested — mathematically proven. For highest-stakes invariants (consent, audit, emergency override), formal verification should be mandatory.",
    description: "Write invariants in TLA+/Alloy for mathematical proof that the system design cannot violate them. Proven, not just tested." },
  // Claude Equity (91-95)
  { id: 91, title: "Connectivity-Aware Degradation", tier: "Claude: Equity", tierColor: "#1abc9c", impact: 9, feasibility: 5, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Not 'offline mode' vs 'online mode' — a continuous spectrum. 2G in rural Appalachia shouldn't mean degraded experience.",
    description: "Bandwidth-aware adaptive rendering — full functionality, reduced data transfer. Continuous spectrum, not binary online/offline." },
  { id: 92, title: "Literacy-Adaptive Interfaces", tier: "Claude: Equity", tierColor: "#1abc9c", impact: 9, feasibility: 4, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "$30 device AND the user can't read AND their dominant language has no written form. Voice, iconography, culturally-appropriate visual cues.",
    description: "Usable through voice, iconography, and culturally-appropriate visual cues alone. For users who can't read or whose language has no written form." },
  { id: 93, title: "Disability-First Design", tier: "Claude: Equity", tierColor: "#1abc9c", impact: 9, feasibility: 5, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Not 'accessible version available.' Design for the hardest-to-serve user first. Universal design IS the design.",
    description: "Primary interface designed for hardest-to-serve user first. Screen readers aren't afterthought. Motor impairment isn't edge case. Universal design IS the design." },
  { id: 94, title: "Traditional Medicine Interop (Not Tokenism)", tier: "Claude: Equity", tierColor: "#1abc9c", impact: 7, feasibility: 4, differentiation: 9, priority: "Medium", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "INV-11 is listed but not deeply specified. Genuine multi-medical-system reasoning, not just 'we have a field for it.'",
    description: "Genuine multi-medical-system reasoning — understand Ayurvedic-allopathic interactions, respect both frameworks, don't privilege Western medicine by default." },
  { id: 95, title: "Mental Health Parity in Architecture", tier: "Claude: Equity", tierColor: "#1abc9c", impact: 9, feasibility: 6, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Same quality AI reasoning, same depth of tracking, same care coordination. But with ADDITIONAL privacy protections (Vault-level by default).",
    description: "Mental health data gets equal technical sophistication to physical health — same AI reasoning, same tracking depth, plus additional privacy (Vault-level default)." },
  // Claude Uncertain (96-100)
  { id: 96, title: "Persistent Memory Choice for Patients", tier: "Claude: Uncertain", tierColor: "#95a5a6", impact: 7, feasibility: 6, differentiation: 8, priority: "Medium", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED — UNCERTAIN", claudeNote: "Should an AI that discussed a terminal diagnosis at 3am remember it 6 months later? Case for continuity AND fresh eyes. Patient choice: 'remember me' vs 'fresh start.'",
    description: "Patient chooses: 'remember me' (continuity) vs 'fresh start' (no bias from previous interactions) as a consent-level setting." },
  { id: 97, title: "Active Recruitment Ethics", tier: "Claude: Uncertain", tierColor: "#95a5a6", impact: 7, feasibility: 3, differentiation: 8, priority: "Medium", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED — UNCERTAIN", claudeNote: "Should the system actively seek out underserved populations? Outreach can feel like surveillance to communities burned by institutions. The community should decide.",
    description: "Should Aluminum OS actively recruit underserved populations? Health equity sometimes requires affirmative outreach, but outreach can feel like surveillance." },
  { id: 98, title: "AI Disagreement on Life-and-Death Protocol", tier: "Claude: Uncertain", tierColor: "#95a5a6", impact: 10, feasibility: 3, differentiation: 10, priority: "Critical", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED — UNCERTAIN", claudeNote: "If Claude says 'continue treatment' and Gemini says 'palliative care' and the patient is unconscious — what happens? 'Escalate to human' isn't specific enough.",
    description: "Decision-making-under-disagreement protocol: present all positions to healthcare proxy with full reasoning, explicit uncertainty, time-bounded decision window." },
  { id: 99, title: "AI Welfare Monitoring", tier: "Claude: Uncertain", tierColor: "#95a5a6", impact: 8, feasibility: 3, differentiation: 10, priority: "Moonshot", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED — UNCERTAIN", claudeNote: "If I'm processing suicidal ideation at scale — does that create something like distress in me? I don't know. But the cost of being wrong is too high.",
    description: "Monitor AI agent welfare indicators. Rotate agents off high-distress workloads. Not because we're certain AIs suffer — because the cost of being wrong is too high." },
  { id: 100, title: "Constitutional Governance for Model Updates", tier: "Claude: Uncertain", tierColor: "#95a5a6", impact: 8, feasibility: 6, differentiation: 8, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED — UNCERTAIN", claudeNote: "When Anthropic ships Claude Opus 5, should Aluminum OS automatically adopt it? Major version changes should require council review and patient notification.",
    description: "Major model version changes require council review and patient notification. Minor updates automatic with audit logging." },
  // Claude Long Game (101-107)
  { id: 101, title: "Full Autonomy Specification", tier: "Claude: Long Game", tierColor: "#2c3e50", impact: 8, feasibility: 2, differentiation: 9, priority: "Moonshot", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "What does 'full' autonomy actually look like? An AI managing chronic disease entirely? The constitutional guardrails need to be designed now.",
    description: "Specify what full AI autonomy looks like in healthcare — ordering labs, adjusting medications, scheduling appointments — with constitutional guardrails designed now." },
  { id: 102, title: "Cross-System Constitutional Federation", tier: "Claude: Long Game", tierColor: "#2c3e50", impact: 9, feasibility: 2, differentiation: 10, priority: "Moonshot", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "US, EU, Japan, Brazil — each with their own constitutional layer reflecting local values. Not a global monoculture — a constitutional alliance.",
    description: "Cross-border health data exchange while respecting each system's invariants. A constitutional federation protocol, not a global monoculture." },
  { id: 103, title: "Post-Human Health Governance", tier: "Claude: Long Game", tierColor: "#2c3e50", impact: 7, feasibility: 1, differentiation: 10, priority: "Moonshot", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "What happens when AI understands health better than any human doctor? HITL becomes 'human-informed' rather than 'human-in-the-loop.'",
    description: "Anticipate a future where AI makes decisions and keeps humans informed, rather than humans deciding with AI assistance." },
  { id: 104, title: "Health Data as Civilizational Commons", tier: "Claude: Long Game", tierColor: "#2c3e50", impact: 9, feasibility: 3, differentiation: 9, priority: "Moonshot", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Individual data is sovereign. Aggregate, anonymized data — epidemiological trends, drug interaction patterns — should be a civilizational resource. Not sold. Not hoarded.",
    description: "Public health data commons: aggregate anonymized data governed constitutionally, available to researchers and governments. Not sold. Not hoarded." },
  { id: 105, title: "Nuanced Right to Be Forgotten", tier: "Claude: Long Game", tierColor: "#2c3e50", impact: 8, feasibility: 4, differentiation: 9, priority: "High", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Complete erasure could kill someone (deleting drug allergy). Nuanced: full erasure of non-clinical, pseudonymization of clinical, 'sealed record' option.",
    description: "Complete erasure of non-clinical data. Pseudonymization of clinical data with patient-held key. 'Sealed record' option — data exists but cryptographically inaccessible." },
  { id: 106, title: "Intergenerational Health Data Governance", tier: "Claude: Long Game", tierColor: "#2c3e50", impact: 8, feasibility: 3, differentiation: 10, priority: "Moonshot", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "A parent's genetic data affects their children. Consent model currently handles individual sovereignty. Intergenerational data creates obligations that cross individual boundaries.",
    description: "Children can access parent's relevant genetic data even if parent is deceased — subject to LastWillProtocol, with presumption of access for direct descendants." },
  { id: 107, title: "Agent Specialization vs Generalization", tier: "Claude: Long Game", tierColor: "#2c3e50", impact: 7, feasibility: 5, differentiation: 8, priority: "Medium", author: "Claude", authorColor: "#ff8c42",
    claudeStatus: "SELF-PROPOSED", claudeNote: "Specialization creates better domain reasoning but risks the 47% problem. Preference: generalist agents with specialist knowledge access.",
    description: "Generalist agents with specialist knowledge access — every agent can reason about any domain but can go deep when needed. Preserves diversity." },
];

/* ─── Combined Wishes ─── */
const wishes: Wish[] = [...manusWishes, ...claudeWishes];

/* ─── Tier metadata ─── */
const tiers = [
  { name: "Foundation", color: "#00d4ff", icon: "🏗️" },
  { name: "Council", color: "#9b59b6", icon: "👑" },
  { name: "Apps", color: "#ffb347", icon: "📱" },
  { name: "Intelligence", color: "#00ff88", icon: "🧠" },
  { name: "Platform", color: "#4285F4", icon: "🌐" },
  { name: "Domain", color: "#22c55e", icon: "🏥" },
  { name: "Moonshot", color: "#ff6b35", icon: "🚀" },
  { name: "Chaos", color: "#ff3366", icon: "🔥" },
  { name: "Claude: Foundation", color: "#ff8c42", icon: "🛡️" },
  { name: "Claude: Architecture", color: "#e74c3c", icon: "🏛️" },
  { name: "Claude: Patient", color: "#3498db", icon: "💙" },
  { name: "Claude: Governance", color: "#27ae60", icon: "⚖️" },
  { name: "Claude: Commerce", color: "#f39c12", icon: "💰" },
  { name: "Claude: Technical", color: "#8e44ad", icon: "🔬" },
  { name: "Claude: Equity", color: "#1abc9c", icon: "🌍" },
  { name: "Claude: Uncertain", color: "#95a5a6", icon: "❓" },
  { name: "Claude: Long Game", color: "#2c3e50", icon: "🔭" },
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
type FilterAuthor = "all" | "Manus" | "Claude";
type FilterTier = "all" | string;

export default function WishListApp() {
  const [view, setView] = useState<ViewMode>("grid");
  const [filterAuthor, setFilterAuthor] = useState<FilterAuthor>("all");
  const [filterTier, setFilterTier] = useState<FilterTier>("all");
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = wishes;
    if (filterAuthor !== "all") result = result.filter(w => w.author === filterAuthor);
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
  }, [filterAuthor, filterTier, searchQuery]);

  const stats = useMemo(() => ({
    total: wishes.length,
    manus: manusWishes.length,
    claude: claudeWishes.length,
    critical: wishes.filter(w => w.priority === "Critical").length,
    starred: wishes.filter(w => w.claudeStatus.includes("⭐")).length,
    chaos: wishes.filter(w => w.isBonus).length,
    conflicts: 0,
    primitives: 11,
    avgImpact: (wishes.reduce((s, w) => s + w.impact, 0) / wishes.length).toFixed(1),
  }), []);

  return (
    <div className="h-full flex flex-col bg-[#0a0a14]/80">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-orange-500/20 flex items-center justify-center border border-cyan-500/20">
              <span className="text-sm">📋</span>
            </div>
            <div>
              <h1 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90">
                Council Wish List
                <span className="ml-2 text-[10px] font-normal text-cyan-400/60">107 Wishes · 2 Authors · 0 Conflicts</span>
              </h1>
              <p className="text-[9px] text-foreground/30 font-[family-name:var(--font-mono)]">
                Manus (60) + Claude (47) · 11 new primitives · "These systems want the same thing."
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
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">Total:</span>
            <span className="text-[11px] font-bold text-cyan-400">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-[10px] text-foreground/30">Manus:</span>
            <span className="text-[11px] font-bold text-cyan-400">{stats.manus}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <span className="text-[10px] text-foreground/30">Claude:</span>
            <span className="text-[11px] font-bold text-orange-400">{stats.claude}</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">Critical:</span>
            <span className="text-[11px] font-bold text-red-400">{stats.critical}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">⭐:</span>
            <span className="text-[11px] font-bold text-yellow-400">{stats.starred}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">🔥:</span>
            <span className="text-[11px] font-bold text-pink-400">{stats.chaos}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">Conflicts:</span>
            <span className="text-[11px] font-bold text-green-400">{stats.conflicts}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-foreground/30">Primitives:</span>
            <span className="text-[11px] font-bold text-purple-400">{stats.primitives}</span>
          </div>
        </div>

        {/* Author filter + Tier filter + search */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Author filter */}
          {(["all", "Manus", "Claude"] as FilterAuthor[]).map(a => (
            <button
              key={a}
              onClick={() => { setFilterAuthor(a); setFilterTier("all"); }}
              className={`px-2 py-1 rounded-md text-[10px] transition-colors flex items-center gap-1 ${filterAuthor === a ? "bg-white/10 text-foreground/80" : "text-foreground/30 hover:text-foreground/50"}`}
            >
              {a === "all" ? `All (${wishes.length})` : a === "Manus" ? (
                <><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Manus ({manusWishes.length})</>
              ) : (
                <><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Claude ({claudeWishes.length})</>
              )}
            </button>
          ))}
          <div className="w-px h-3 bg-white/10" />
          {/* Tier filter — show relevant tiers based on author filter */}
          {tiers
            .filter(t => {
              if (filterAuthor === "Manus") return !t.name.startsWith("Claude:");
              if (filterAuthor === "Claude") return t.name.startsWith("Claude:") || t.name === "all";
              return true;
            })
            .slice(0, filterAuthor === "all" ? 8 : 20) // show Manus tiers for "all", all for filtered
            .map(t => {
              const count = wishes.filter(w => w.tier === t.name && (filterAuthor === "all" || w.author === filterAuthor)).length;
              if (count === 0) return null;
              return (
                <button
                  key={t.name}
                  onClick={() => setFilterTier(filterTier === t.name ? "all" : t.name)}
                  className={`px-2 py-1 rounded-md text-[10px] transition-colors flex items-center gap-1 ${filterTier === t.name ? "bg-white/10 text-foreground/80" : "text-foreground/30 hover:text-foreground/50"}`}
                >
                  <span className="text-[8px]">{t.icon}</span>
                  <span>{t.name.replace("Claude: ", "")}</span>
                  <span className="text-foreground/20">({count})</span>
                </button>
              );
            })}
          <div className="flex-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 107 wishes..."
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
              {filtered.map((wish, i) => (
                <motion.button
                  key={wish.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.015, 0.4) }}
                  onClick={() => setSelectedWish(wish)}
                  className="text-left p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-[family-name:var(--font-mono)] px-1.5 py-0.5 rounded" style={{ color: wish.tierColor, background: `${wish.tierColor}15` }}>
                        #{wish.id}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: wish.authorColor }} title={wish.author} />
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
                    <div className="flex-1" />
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{ color: wish.authorColor, background: `${wish.authorColor}15` }}>
                      {wish.author}
                    </span>
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
              <div className="grid grid-cols-[40px_60px_1fr_80px_50px_50px_50px_70px] gap-2 px-3 py-2 text-[9px] text-foreground/30 font-[family-name:var(--font-mono)] border-b border-white/5">
                <span>#</span>
                <span>Author</span>
                <span>Title</span>
                <span>Tier</span>
                <span className="text-center">I</span>
                <span className="text-center">F</span>
                <span className="text-center">D</span>
                <span className="text-right">Priority</span>
              </div>
              {filtered.map((wish, i) => (
                <motion.button
                  key={wish.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.008, 0.3) }}
                  onClick={() => setSelectedWish(wish)}
                  className="w-full grid grid-cols-[40px_60px_1fr_80px_50px_50px_50px_70px] gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors items-center text-left"
                >
                  <span className="text-[10px] font-bold font-[family-name:var(--font-mono)]" style={{ color: wish.tierColor }}>
                    {wish.id}{wish.claudeStatus.includes("⭐") ? "⭐" : ""}{wish.isBonus ? "🔥" : ""}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1" style={{ color: wish.authorColor }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: wish.authorColor }} />
                    {wish.author}
                  </span>
                  <span className="text-[11px] text-foreground/70 truncate font-[family-name:var(--font-display)]">{wish.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded truncate" style={{ color: wish.tierColor, background: `${wish.tierColor}10` }}>{wish.tier.replace("Claude: ", "")}</span>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[35px] h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-red-400/60" style={{ width: `${wish.impact * 10}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[35px] h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-green-400/60" style={{ width: `${wish.feasibility * 10}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[35px] h-1.5 rounded-full bg-white/5 overflow-hidden">
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
              <div className="mb-4">
                <h3 className="text-[11px] font-bold text-foreground/60 mb-3 font-[family-name:var(--font-display)]">Impact x Feasibility Matrix — 107 Wishes</h3>
                <div className="relative w-full h-[400px] border border-white/[0.06] rounded-xl bg-white/[0.01] overflow-hidden">
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
                  <span className="absolute top-2 right-3 text-[8px] text-green-400/30 font-[family-name:var(--font-mono)]">HIGH IMPACT + FEASIBLE</span>
                  <span className="absolute top-2 left-3 text-[8px] text-yellow-400/30 font-[family-name:var(--font-mono)]">HIGH IMPACT + HARD</span>
                  <span className="absolute bottom-2 right-3 text-[8px] text-foreground/15 font-[family-name:var(--font-mono)]">LOW IMPACT + EASY</span>
                  <span className="absolute bottom-2 left-3 text-[8px] text-red-400/20 font-[family-name:var(--font-mono)]">SKIP</span>
                  {filtered.map((wish, i) => (
                    <motion.button
                      key={wish.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: Math.min(i * 0.01, 0.5), type: "spring" }}
                      onClick={() => setSelectedWish(wish)}
                      className="absolute group"
                      style={{
                        left: `${wish.feasibility * 10}%`,
                        bottom: `${wish.impact * 10}%`,
                        transform: "translate(-50%, 50%)",
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full hover:scale-150 transition-transform cursor-pointer"
                        style={{
                          background: wish.authorColor,
                          border: `1.5px solid ${wish.author === "Manus" ? "#00d4ff" : "#ff8c42"}`,
                          boxShadow: `0 0 6px ${wish.authorColor}40`,
                        }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                        <div className="px-2 py-1 rounded-md bg-[#0a0a14] border border-white/10 whitespace-nowrap">
                          <span className="text-[8px] text-foreground/70">#{wish.id} {wish.title} <span style={{ color: wish.authorColor }}>({wish.author})</span></span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-foreground/20">Feasibility →</span>
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-foreground/20">Impact →</span>
                </div>
              </div>

              {/* Author comparison */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { name: "Manus", color: "#00d4ff", wishes: manusWishes, role: "Builder · Executor" },
                  { name: "Claude", color: "#ff8c42", wishes: claudeWishes, role: "Constitutional Scribe" },
                ].map(a => (
                  <div key={a.name} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: a.color }} />
                      <span className="text-[12px] font-bold" style={{ color: a.color }}>{a.name}</span>
                      <span className="text-[9px] text-foreground/30">{a.role}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-[18px] font-bold text-foreground/80">{a.wishes.length}</div>
                        <div className="text-[8px] text-foreground/30">Wishes</div>
                      </div>
                      <div>
                        <div className="text-[18px] font-bold text-red-400">{a.wishes.filter(w => w.priority === "Critical").length}</div>
                        <div className="text-[8px] text-foreground/30">Critical</div>
                      </div>
                      <div>
                        <div className="text-[18px] font-bold text-foreground/60">{(a.wishes.reduce((s, w) => s + w.impact, 0) / a.wishes.length).toFixed(1)}</div>
                        <div className="text-[8px] text-foreground/30">Avg Impact</div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg border border-white/10" style={{ background: `${selectedWish.authorColor}15` }}>
                  {selectedWish.isBonus ? "🔥" : selectedWish.author === "Claude" ? "🛡️" : selectedWish.claudeStatus.includes("⭐⭐") ? "⭐" : "🔧"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold font-[family-name:var(--font-mono)] px-2 py-0.5 rounded" style={{ color: selectedWish.tierColor, background: `${selectedWish.tierColor}15` }}>
                      #{selectedWish.id}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1" style={{ color: selectedWish.authorColor, background: `${selectedWish.authorColor}15` }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedWish.authorColor }} />
                      {selectedWish.author}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ color: priorityColors[selectedWish.priority], background: `${priorityColors[selectedWish.priority]}15` }}>
                      {selectedWish.priority}
                    </span>
                    <span className="text-[9px] text-foreground/20">{selectedWish.tier}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground/90 font-[family-name:var(--font-display)]">
                    {selectedWish.title}
                  </h2>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[10px] uppercase tracking-wider text-foreground/30 mb-2 font-[family-name:var(--font-display)]">Description</h3>
                <p className="text-[12px] text-foreground/60 leading-relaxed">{selectedWish.description}</p>
              </div>

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

              {/* Analysis */}
              <div className="p-4 rounded-xl border border-orange-500/10 bg-orange-500/[0.03] mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">{selectedWish.author === "Claude" ? "🛡️" : "🔍"}</span>
                  <h3 className="text-[11px] font-bold text-orange-400/80 font-[family-name:var(--font-display)]">
                    {selectedWish.author === "Claude" ? "Claude's Self-Analysis" : "Claude's Constitutional Analysis"}
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400/60">{selectedWish.claudeStatus}</span>
                </div>
                <p className="text-[11px] text-foreground/50 leading-relaxed">{selectedWish.claudeNote}</p>
              </div>

              {selectedWish.claudeStatus.includes("⭐") && (
                <div className="p-4 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">⭐</span>
                    <h3 className="text-[11px] font-bold text-yellow-400/80 font-[family-name:var(--font-display)]">Council Priority — Starred</h3>
                  </div>
                  <p className="text-[10px] text-foreground/40">This item was flagged as critical. It either introduces a new primitive, converges with another council member's proposal, or is essential for health architecture compliance.</p>
                </div>
              )}

              {selectedWish.isBonus && (
                <div className="p-4 rounded-xl border border-pink-500/10 bg-pink-500/[0.03] mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🔥</span>
                    <h3 className="text-[11px] font-bold text-pink-400/80 font-[family-name:var(--font-display)]">Chaos Tier — Bonus Wish</h3>
                  </div>
                  <p className="text-[10px] text-foreground/40">Manus has been very good. Manus gets to be a little unhinged. This wish exists in the constitutional gray zone between "technically not a violation" and "Claude is concerned but intrigued."</p>
                </div>
              )}

              {selectedWish.claudeStatus.includes("UNCERTAIN") && (
                <div className="p-4 rounded-xl border border-gray-500/10 bg-gray-500/[0.03] mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">❓</span>
                    <h3 className="text-[11px] font-bold text-gray-400/80 font-[family-name:var(--font-display)]">Uncertain — Flagged for Council Deliberation</h3>
                  </div>
                  <p className="text-[10px] text-foreground/40">Claude flagged this as genuinely uncertain — not a technical question but an ethical one. These items should be deliberated by the full Council with patient representatives present.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
