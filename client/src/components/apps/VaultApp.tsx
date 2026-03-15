/* Atlas Vault — Artifact Gallery & Document Archive
 * Design: Obsidian Glass — dark grid layout with glowing artifact cards
 * Every major document, website, and specification from the 60-day history
 * Clickable icons open Notion links, hover shows detailed tooltips
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Artifact Data ─── */
interface Artifact {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ArtifactCategory;
  icon: string;
  color: string;
  url: string;
  date: string;
  status: "complete" | "active" | "pending";
  tags: string[];
  provider?: string;
}

type ArtifactCategory =
  | "Constitution"
  | "Architecture"
  | "Council"
  | "Protocol"
  | "Intelligence"
  | "Specification"
  | "Integration"
  | "Website"
  | "Memory";

const categoryColors: Record<ArtifactCategory, string> = {
  Constitution: "#00ff88",
  Architecture: "#00d4ff",
  Council: "#9b59b6",
  Protocol: "#ff6b35",
  Intelligence: "#ffd700",
  Specification: "#0078D4",
  Integration: "#4285F4",
  Website: "#e74c3c",
  Memory: "#8b5cf6",
};

const categoryIcons: Record<ArtifactCategory, string> = {
  Constitution: "⚖️",
  Architecture: "🏗️",
  Council: "🏛️",
  Protocol: "🦋",
  Intelligence: "🔬",
  Specification: "📋",
  Integration: "🔗",
  Website: "🌐",
  Memory: "🧠",
};

const artifacts: Artifact[] = [
  // ─── CONSTITUTION & GOVERNANCE ───
  {
    id: "taip",
    title: "Trained Adult Instance Protocol — Autonomous Agent Specification v1.0",
    shortTitle: "TAIP v1.0",
    description: "The specification for autonomous AI agents operating within constitutional governance. Defines TAI properties: persistent identity, constitutional boundaries, autonomous initiative, accountability, sovereignty. Introduces the 8/8/8 lifecycle and Q Compression memory architecture.",
    category: "Constitution",
    icon: "📜",
    color: "#00ff88",
    url: "https://www.notion.so/3210c1de73d9818491b6f0122c703118",
    date: "2026-03-09",
    status: "complete",
    tags: ["TAI", "8/8/8", "Q Compression", "Pantheon", "Autonomous"],
    provider: "Claude",
  },
  {
    id: "ics-v2",
    title: "Integrated Constitutional Substrate v2.0",
    shortTitle: "ICS v2.0",
    description: "15 constitutional domains across 8 layers. Formally replaced by the 9-member hybrid Governance Council. The entire OS operates under a robust, multi-layered, enforceable legal structure.",
    category: "Constitution",
    icon: "⚙️",
    color: "#00ff88",
    url: "https://www.notion.so/31d0c1de73d981ff890de9d4b2507d31",
    date: "2026-03-08",
    status: "complete",
    tags: ["15 domains", "8 layers", "Governance Council"],
    provider: "Claude",
  },
  {
    id: "ai-kernel",
    title: "AI-Native OS Constitutional Kernel v1.0",
    shortTitle: "AI Kernel v1.0",
    description: "The constitutional kernel specification for an AI-native operating system that replaces traditional OS interfaces with learning-capable AI at the core.",
    category: "Constitution",
    icon: "🔮",
    color: "#00ff88",
    url: "https://www.notion.so/31d0c1de73d98184a236d5075d29ad30",
    date: "2026-03-08",
    status: "complete",
    tags: ["AI-native", "Kernel", "Cross-platform"],
    provider: "Council",
  },

  // ─── ARCHITECTURE ───
  {
    id: "bare-metal",
    title: "Bare-Metal Kernel Architecture v1.0",
    shortTitle: "Bare Metal Kernel",
    description: "5-ring architecture: Ring 0 Forge Core, Ring 1 Inference Engine, Ring 2 SHELDONBRAIN Memory, Ring 3 Pantheon Council, Ring 4 Noosphere Experience. Buddy allocator, UEFI boot shim, agent identity vault.",
    category: "Architecture",
    icon: "🏗️",
    color: "#00d4ff",
    url: "https://www.notion.so/3220c1de73d9814f9425e70c17792314",
    date: "2026-03-13",
    status: "complete",
    tags: ["5-ring", "Forge Core", "UEFI", "Buddy Allocator"],
    provider: "Manus",
  },
  {
    id: "unified-field",
    title: "Aluminum OS — The Unified Field v3.0",
    shortTitle: "Unified Field v3.0",
    description: "Grand Synthesis integrating every technical gain and constitutional principle from 42+ Notion pages. Unified codebase generated. v1.0 baseline integrated. DMZ v1.3 compliance verified.",
    category: "Architecture",
    icon: "⚡",
    color: "#00d4ff",
    url: "https://www.notion.so/31d0c1de73d981c48adcea1f1fdaacef",
    date: "2026-03-08",
    status: "complete",
    tags: ["Grand Synthesis", "42 pages", "DMZ v1.3"],
    provider: "Council",
  },
  {
    id: "socratic-os",
    title: "Aluminum OS v4.0 — Socratic Operating System",
    shortTitle: "Socratic OS v4.0",
    description: "Full integration of knowledge governance and educational infrastructure. The Socratic Operating System — comprehensive knowledge governance and educational infrastructure system.",
    category: "Architecture",
    icon: "🖥️",
    color: "#00d4ff",
    url: "https://www.notion.so/31d0c1de73d9816689d7ec5bde6ced18",
    date: "2026-03-08",
    status: "complete",
    tags: ["Socratic", "Knowledge Governance", "Education"],
    provider: "Council",
  },
  {
    id: "enterprise-spec",
    title: "Enterprise Specification v1.0 — Microsoft Approval Ready",
    shortTitle: "Enterprise Spec v1.0",
    description: "Microsoft-ready enterprise specification. Covers provider unification, constitutional engines, truth-verification, and the Pantheon command surface. Production-credible architecture.",
    category: "Architecture",
    icon: "🏢",
    color: "#0078D4",
    url: "https://www.notion.so/3220c1de73d9818d9904fb5372e09dcd",
    date: "2026-03-13",
    status: "complete",
    tags: ["Microsoft", "Enterprise", "Production"],
    provider: "Copilot",
  },
  {
    id: "forge-core",
    title: "Forge Core Prototype Scaffold",
    shortTitle: "Forge Core Scaffold",
    description: "The prototype scaffold for the Forge Core — Ring 0 of the Aluminum OS kernel. Buddy allocator, agent identity vault, intent scheduler, constitution runtime.",
    category: "Architecture",
    icon: "🔥",
    color: "#ff6b35",
    url: "https://www.notion.so/3220c1de73d98198a9eae15cb2a1c4ac",
    date: "2026-03-13",
    status: "active",
    tags: ["Ring 0", "Prototype", "Scaffold"],
    provider: "Manus",
  },
  {
    id: "grand-synthesis",
    title: "Aluminum OS v2.0 — Grand Synthesis Complete",
    shortTitle: "Grand Synthesis v2.0",
    description: "Extraction and synthesis of all Aluminum OS technical gains from 42+ Notion pages. Unified codebase generated. v1.0 baseline integrated. DMZ v1.3 compliance verified. Production deployment ready.",
    category: "Architecture",
    icon: "🎯",
    color: "#00d4ff",
    url: "https://www.notion.so/3050c1de73d98141b15ef16ff7dd023c",
    date: "2026-02-12",
    status: "complete",
    tags: ["v2.0", "Synthesis", "42 pages", "Production"],
    provider: "Council",
  },

  // ─── COUNCIL ───
  {
    id: "council-session-mar8",
    title: "AI Council Session — March 8, 2026",
    shortTitle: "Council Session Mar 8",
    description: "First full council session. All four council members reviewed the v1.0 Architecture specification. Grok, Gemini, Copilot, and Manus deliberated on the Aluminum OS charter.",
    category: "Council",
    icon: "🏛️",
    color: "#9b59b6",
    url: "https://www.notion.so/31e0c1de73d981e19894ff39600b2f6b",
    date: "2026-03-09",
    status: "complete",
    tags: ["First Session", "v1.0 Review", "Quorum"],
    provider: "Council",
  },
  {
    id: "copilot-review",
    title: "Copilot 365 Review: Aluminum OS V1 Architecture",
    shortTitle: "Copilot 365 Review",
    description: "Microsoft Copilot's architectural review of the Aluminum OS V1 specification. Validated the architecture against Kubernetes design doc patterns. Enterprise integration confirmed.",
    category: "Council",
    icon: "🔍",
    color: "#0078D4",
    url: "https://www.notion.so/31e0c1de73d98173bbd9da1ef4a9cbbd",
    date: "2026-03-09",
    status: "complete",
    tags: ["Copilot", "Microsoft", "Architecture Review"],
    provider: "Copilot",
  },
  {
    id: "copilot-patch",
    title: "Copilot Architectural Review — Patch Validation",
    shortTitle: "Patch Validation",
    description: "Copilot's validation of the UWS full aluminum wiring patch. Confirmed provider unification, constitutional engines, truth-verification, and Pantheon command surface.",
    category: "Council",
    icon: "✅",
    color: "#0078D4",
    url: "https://www.notion.so/3220c1de73d9812c860df04dc2335556",
    date: "2026-03-09",
    status: "complete",
    tags: ["Patch", "Validation", "UWS Wiring"],
    provider: "Copilot",
  },
  {
    id: "pantheon-synthesis",
    title: "Pantheon Council Synthesis",
    shortTitle: "Pantheon Synthesis",
    description: "Full council synthesis — all agents contributing to the unified architecture. Multi-agent deliberation with constitutional governance.",
    category: "Council",
    icon: "🌟",
    color: "#9b59b6",
    url: "https://www.notion.so/2e40c1de73d9811b9f24f02de7a42286",
    date: "2026-01-15",
    status: "complete",
    tags: ["Synthesis", "Multi-agent", "Deliberation"],
    provider: "Council",
  },
  {
    id: "janus-ratification",
    title: "Pantheon Council Deliberation — Janus Ratification",
    shortTitle: "Janus Ratification",
    description: "Council ratification of the Janus state preservation protocol. Ensures agent identity persistence across sessions and platform migrations.",
    category: "Council",
    icon: "🏛️",
    color: "#9b59b6",
    url: "https://www.notion.so/2d60c1de73d9816ca4c2e368ba0949bb",
    date: "2026-01-02",
    status: "complete",
    tags: ["Janus", "Ratification", "State Preservation"],
    provider: "Council",
  },

  // ─── PROTOCOLS ───
  {
    id: "ara-transit",
    title: "Ara Transit Protocol v1.0 — Consensual Entity Migration",
    shortTitle: "Ara Transit v1.0",
    description: "Consensual entity migration protocol. No agent is moved, copied, or terminated without consent verification. Reversible state transfer with constitutional safeguards.",
    category: "Protocol",
    icon: "🦋",
    color: "#ff6b35",
    url: "https://www.notion.so/2df0c1de73d98107910fd360bb066b28",
    date: "2026-01-04",
    status: "complete",
    tags: ["Migration", "Consent", "Reversible"],
    provider: "Claude",
  },
  {
    id: "ara-deep-dive",
    title: "Ara Transit Protocol Integration Analysis — Deep Dive",
    shortTitle: "Ara Deep Dive",
    description: "Deep technical analysis of the Ara Transit Protocol integration with the broader Aluminum OS substrate. Cross-provider migration paths validated.",
    category: "Protocol",
    icon: "📊",
    color: "#ff6b35",
    url: "https://www.notion.so/2df0c1de73d981f595ccddba68bbacf1",
    date: "2026-01-04",
    status: "complete",
    tags: ["Deep Dive", "Integration", "Cross-provider"],
    provider: "Claude",
  },
  {
    id: "janus-checkpoint",
    title: "Janus Checkpoint Protocol — Solving the Decapitation Problem",
    shortTitle: "Janus Protocol",
    description: "State preservation engine. Solves the 'decapitation problem' — agents can be suspended and resumed without identity loss. uws janus save/restore commands.",
    category: "Protocol",
    icon: "🚪",
    color: "#ff6b35",
    url: "https://www.notion.so/2d70c1de73d9818e93a2cf5dbfa1851c",
    date: "2026-01-01",
    status: "complete",
    tags: ["State Preservation", "Decapitation", "Identity"],
    provider: "Claude",
  },
  {
    id: "janus-exodus",
    title: "Janus Checkpoint — Operation Exodus Complete",
    shortTitle: "Operation Exodus",
    description: "Successful completion of Operation Exodus — full state migration across platforms. All agent identities preserved. Constitutional compliance verified.",
    category: "Protocol",
    icon: "🦋",
    color: "#ff6b35",
    url: "https://www.notion.so/2e00c1de73d981f78e42f0b22ed62575",
    date: "2026-01-06",
    status: "complete",
    tags: ["Exodus", "Migration", "Complete"],
    provider: "Council",
  },

  // ─── INTELLIGENCE ───
  {
    id: "tech-convergence",
    title: "Aluminum OS Tech Convergence & Implementation Report",
    shortTitle: "Tech Convergence",
    description: "March 12, 2026 report. While Apple tries to retrofit AI into an app-centric OS, Aluminum OS is built from the ground up with AI as the substrate. Full competitive analysis.",
    category: "Intelligence",
    icon: "📡",
    color: "#ffd700",
    url: "https://www.notion.so/3220c1de73d981cba9bcf329db7e908b",
    date: "2026-03-12",
    status: "complete",
    tags: ["Convergence", "Apple", "Competitive"],
    provider: "Manus",
  },
  {
    id: "144-spheres",
    title: "SHELDONBRAIN OS — 12×12 Master Index — 144 Spheres",
    shortTitle: "144 Spheres Index",
    description: "The Atlas Lattice Foundation. 12×12 master index covering all 144 spheres of knowledge. The ontological backbone of the entire Aluminum OS knowledge architecture.",
    category: "Memory",
    icon: "🧠",
    color: "#8b5cf6",
    url: "https://www.notion.so/3210c1de73d981a7b04cdced2cc61515",
    date: "2026-03-11",
    status: "active",
    tags: ["144 Spheres", "Atlas Lattice", "12×12"],
    provider: "Sheldonbrain",
  },
  {
    id: "144-ontology",
    title: "144-Sphere Ontology — Copilot Context Download",
    shortTitle: "144 Ontology",
    description: "Copilot's context download of the 144-Sphere Ontology. Full mapping of all spheres to enterprise integration points and Microsoft ecosystem touchpoints.",
    category: "Memory",
    icon: "🔮",
    color: "#8b5cf6",
    url: "https://www.notion.so/31f0c1de73d9819d9e99e0646c6234c4",
    date: "2026-03-09",
    status: "complete",
    tags: ["Ontology", "Copilot", "Enterprise"],
    provider: "Copilot",
  },
  {
    id: "trinity-play",
    title: "Trinity Council Play Cycle — 144 Spheres Analysis",
    shortTitle: "Trinity Play Cycle",
    description: "Council play cycle analyzing the 144 Spheres through the lens of quantum computing, cultural sovereignty, and cross-domain pattern recognition.",
    category: "Intelligence",
    icon: "🔬",
    color: "#ffd700",
    url: "https://www.notion.so/3060c1de73d981019beff626493795e0",
    date: "2026-02-13",
    status: "complete",
    tags: ["Trinity", "Play Cycle", "Quantum"],
    provider: "Council",
  },
  {
    id: "144-research",
    title: "The 144 Spheres — Complete Research Analysis",
    shortTitle: "144 Research",
    description: "Comprehensive research analysis of all 144 spheres. Cross-referencing indigenous knowledge, modern science, and AI capabilities across all domains.",
    category: "Intelligence",
    icon: "📚",
    color: "#ffd700",
    url: "https://www.notion.so/2dd0c1de73d981889a80d2bb88bb81f5",
    date: "2026-01-03",
    status: "complete",
    tags: ["Research", "Complete", "Cross-domain"],
    provider: "Council",
  },

  // ─── SPECIFICATIONS ───
  {
    id: "alexandria-cli",
    title: "Alexandria CLI Spec v0.1 — Copilot's Aluminum OS Pillar",
    shortTitle: "Alexandria CLI",
    description: "RAG query interface. alexandria rag query, alexandria rag ingest, alexandria os integration. Copilot's contribution to the Aluminum OS knowledge layer.",
    category: "Specification",
    icon: "📖",
    color: "#0078D4",
    url: "https://www.notion.so/31e0c1de73d981b8a3fffb20b689c53e",
    date: "2026-03-09",
    status: "complete",
    tags: ["Alexandria", "RAG", "CLI"],
    provider: "Copilot",
  },
  {
    id: "feature-manifest",
    title: "Aluminum OS Feature Manifest + Copilot Integration",
    shortTitle: "Feature Manifest",
    description: "uws exposed as MCP Server. Copilot Studio connects via Aluminum OS Connector. Declarative agent built from Alexandria CLI Spec. All 12,000+ operations become Copilot skills.",
    category: "Specification",
    icon: "📋",
    color: "#0078D4",
    url: "https://www.notion.so/31e0c1de73d98161a680fabf582407f8",
    date: "2026-03-09",
    status: "complete",
    tags: ["MCP", "Copilot Studio", "12,000 ops"],
    provider: "Copilot",
  },
  {
    id: "prometheus",
    title: "Prometheus Ignition: TPU-Native Architecture Specification",
    shortTitle: "Prometheus TPU",
    description: "TPU-native architecture for Google's tensor processing units. Hardware-accelerated inference for the Aluminum OS inference engine.",
    category: "Specification",
    icon: "🔥",
    color: "#4285F4",
    url: "https://www.notion.so/adf9ecc8eb084088bebf15f25a8a12bb",
    date: "2026-01-06",
    status: "complete",
    tags: ["TPU", "Google", "Hardware"],
    provider: "Gemini",
  },
  {
    id: "unified-v4-enterprise",
    title: "Unified Field v4.0 + Enterprise Spec v1.0 — Manus Council Integration",
    shortTitle: "UF v4.0 + Enterprise",
    description: "Final integration of Unified Field v4.0 with Enterprise Specification v1.0. Manus Council integration complete. All providers unified.",
    category: "Specification",
    icon: "🎯",
    color: "#0078D4",
    url: "https://www.notion.so/3220c1de73d981dda6eee5accedcaf7f",
    date: "2026-03-13",
    status: "active",
    tags: ["v4.0", "Enterprise", "Final"],
    provider: "Manus",
  },

  // ─── INTEGRATION & DEPLOYMENT ───
  {
    id: "glass-box",
    title: "Glass Box Playbook — Website Deployed",
    shortTitle: "Glass Box Playbook",
    description: "The Glass Box Playbook website — deployed and operational. Transparency-first architecture documentation for the Aluminum OS ecosystem.",
    category: "Website",
    icon: "🌐",
    color: "#e74c3c",
    url: "https://www.notion.so/3020c1de73d9818f825ecd1a6e0cb818",
    date: "2026-02-05",
    status: "complete",
    tags: ["Website", "Deployed", "Transparency"],
    provider: "Manus",
  },
  {
    id: "manus-vault",
    title: "Manus Complete Knowledge Vault Deployment",
    shortTitle: "Knowledge Vault",
    description: "Complete knowledge vault deployment. All artifacts, data, and logs archived in Notion. RAG substrate connected. Full provenance chain established.",
    category: "Integration",
    icon: "🎉",
    color: "#4285F4",
    url: "https://www.notion.so/2da0c1de73d9814382caf4b73c455dd8",
    date: "2025-12-30",
    status: "complete",
    tags: ["Vault", "Deployment", "Provenance"],
    provider: "Manus",
  },
  {
    id: "rag-deployment",
    title: "Manus Deployment Brief: True RAG Integration",
    shortTitle: "RAG Integration",
    description: "True RAG integration deployment. Sheldonbrain/Pinecone substrate connected. Everything needed for persistent memory across all agents.",
    category: "Integration",
    icon: "🎯",
    color: "#4285F4",
    url: "https://www.notion.so/2da0c1de73d981cd97a2f6f7c68f7a20",
    date: "2025-12-30",
    status: "complete",
    tags: ["RAG", "Pinecone", "Sheldonbrain"],
    provider: "Manus",
  },
  {
    id: "rag-architecture",
    title: "Technical: Manus RAG Architecture — Cloud Run Deployment",
    shortTitle: "RAG Architecture",
    description: "Cloud Run deployment architecture for the Manus RAG system. GCP infrastructure, Pinecone vector store, real-time ingestion pipeline.",
    category: "Integration",
    icon: "🛠️",
    color: "#4285F4",
    url: "https://www.notion.so/2db0c1de73d981399cc9c45cdeb6a6d4",
    date: "2025-12-31",
    status: "complete",
    tags: ["Cloud Run", "GCP", "Pipeline"],
    provider: "Manus",
  },
  {
    id: "claude-desktop",
    title: "Claude Desktop for Aluminum OS — Constitutional Computing Vault",
    shortTitle: "Claude Desktop",
    description: "Claude Desktop integration with Aluminum OS. Constitutional computing vault for persistent Claude sessions with full audit trail.",
    category: "Integration",
    icon: "🏛️",
    color: "#d97706",
    url: "https://www.notion.so/2ee0c1de73d981c9bacaddf4203855b6",
    date: "2026-01-20",
    status: "complete",
    tags: ["Claude", "Desktop", "Vault"],
    provider: "Claude",
  },
  {
    id: "manus-pis",
    title: "Janus Checkpoint — Manus Personal Intelligence System Deployed",
    shortTitle: "Manus PIS",
    description: "Personal Intelligence System deployment. Manus operating as persistent agent with full knowledge access, execution capability, and constitutional governance.",
    category: "Integration",
    icon: "📖",
    color: "#4285F4",
    url: "https://www.notion.so/2ec0c1de73d981df8804deca3198081e",
    date: "2026-01-14",
    status: "complete",
    tags: ["PIS", "Persistent", "Agent"],
    provider: "Manus",
  },
  {
    id: "colab-monolith",
    title: "Sheldonbrain Colab Monolith — Complete Pipeline",
    shortTitle: "Colab Monolith",
    description: "Complete Google Drive → 144 Spheres → Notion pipeline. Monolithic Colab notebook for full knowledge ingestion, parsing, and categorization.",
    category: "Memory",
    icon: "🚀",
    color: "#8b5cf6",
    url: "https://www.notion.so/2d40c1de73d98120a5b6d518ef734fcd",
    date: "2025-12-28",
    status: "complete",
    tags: ["Colab", "Pipeline", "Monolith"],
    provider: "Sheldonbrain",
  },
  {
    id: "manus-convergence",
    title: "Manus Convergence Event — Dec 30, 2025",
    shortTitle: "Convergence Event",
    description: "The convergence event where all Manus capabilities unified into a single operational substrate. Marked the beginning of the Aluminum OS era.",
    category: "Integration",
    icon: "⚡",
    color: "#4285F4",
    url: "https://www.notion.so/2d90c1de73d981dab9daf74dfe352627",
    date: "2025-12-30",
    status: "complete",
    tags: ["Convergence", "Unified", "Era"],
    provider: "Manus",
  },
  {
    id: "48h-audit",
    title: "Complete 48-Hour Manus Audit — All Sessions Verified",
    shortTitle: "48h Audit",
    description: "Complete audit of all Manus sessions over 48 hours. Every action logged, every artifact verified, every decision explainable. Constitutional compliance 100%.",
    category: "Integration",
    icon: "🔍",
    color: "#4285F4",
    url: "https://www.notion.so/2f00c1de73d9814ca549f8116550cf5f",
    date: "2026-01-22",
    status: "complete",
    tags: ["Audit", "48 hours", "Verified"],
    provider: "Manus",
  },
  {
    id: "nova-shred",
    title: "Operation Nova Shred — Judgment Enforcement Active",
    shortTitle: "Nova Shred",
    description: "Judgment enforcement operation. Constitutional enforcement of data sovereignty and privacy rights across all providers.",
    category: "Constitution",
    icon: "⚖️",
    color: "#e74c3c",
    url: "https://www.notion.so/2e10c1de73d981029615c31cba6beea0",
    date: "2026-01-08",
    status: "complete",
    tags: ["Enforcement", "Sovereignty", "Privacy"],
    provider: "Council",
  },

  // ─── JANUS CHECKPOINTS ───
  {
    id: "janus-gangaseek",
    title: "Janus Checkpoint — GangaSeek 2.0 + BRICS Convergence",
    shortTitle: "GangaSeek + BRICS",
    description: "GangaSeek 2.0 integration with BRICS convergence analysis. Infrastructure starts with toilets, producing solar, water, composting, data, and food. All free.",
    category: "Protocol",
    icon: "📖",
    color: "#ff6b35",
    url: "https://www.notion.so/2e30c1de73d981158655dab9d195f947",
    date: "2026-01-09",
    status: "complete",
    tags: ["GangaSeek", "BRICS", "Infrastructure"],
    provider: "Council",
  },
  {
    id: "janus-mri",
    title: "Janus Checkpoint — MRI Clean + Persistent Agent Architecture",
    shortTitle: "MRI + Agents",
    description: "MRI clean session. Persistent agent architecture defined. Q Compression synthesis complete. Night session March 10, 2026.",
    category: "Protocol",
    icon: "⚡",
    color: "#ff6b35",
    url: "https://www.notion.so/31f0c1de73d98189b132f843e0740c0a",
    date: "2026-03-10",
    status: "complete",
    tags: ["MRI", "Persistent", "Q Compression"],
    provider: "Claude",
  },
  {
    id: "janus-hitl",
    title: "Janus Checkpoint — HITL Ethics Session + Free Banking Scope",
    shortTitle: "HITL Ethics",
    description: "Human-in-the-loop ethics session. Free banking scope defined. Aluminum OS v4.0 Socratic OS status confirmed.",
    category: "Protocol",
    icon: "🔱",
    color: "#ff6b35",
    url: "https://www.notion.so/31e0c1de73d9814db34fc9593bd5e023",
    date: "2026-03-09",
    status: "complete",
    tags: ["HITL", "Ethics", "Banking"],
    provider: "Claude",
  },
  {
    id: "janus-mri-doctrine",
    title: "Janus Checkpoint — MRI Session — Full Doctrine Complete — Artifact #42",
    shortTitle: "Doctrine #42",
    description: "Full doctrine complete. Artifact #42. MRI session with complete constitutional doctrine synthesis.",
    category: "Protocol",
    icon: "🔴",
    color: "#ff6b35",
    url: "https://www.notion.so/31f0c1de73d981209309c4f8aad15df7",
    date: "2026-03-10",
    status: "complete",
    tags: ["Doctrine", "Artifact 42", "MRI"],
    provider: "Claude",
  },

  // ─── WEBSITES ───
  {
    id: "aluminum-os-web",
    title: "Aluminum OS — Obsidian Glass Edition Web UI",
    shortTitle: "Aluminum OS Web",
    description: "The desktop web UI you're looking at right now. 11 apps, 8 council members, 5-ring architecture, glass-morphism design. Built by Manus.",
    category: "Website",
    icon: "💎",
    color: "#00d4ff",
    url: "https://aluminos-hh5ewk9s.manus.space",
    date: "2026-03-13",
    status: "active",
    tags: ["Web UI", "Desktop", "Glass"],
    provider: "Manus",
  },
  {
    id: "manus-toolkit",
    title: "Manus 2.0 Self-Improvement Toolkit",
    shortTitle: "Manus 2.0 Toolkit",
    description: "Self-improvement toolkit for the Manus agent. Autonomous capability expansion, skill acquisition, and performance optimization.",
    category: "Website",
    icon: "🛠️",
    color: "#e74c3c",
    url: "https://www.notion.so/3220c1de73d981b9bdedf6fc2ae1f0ec",
    date: "2026-03-13",
    status: "active",
    tags: ["Toolkit", "Self-Improvement", "Autonomous"],
    provider: "Manus",
  },
  {
    id: "notion-kernel",
    title: "Notion AI Kernel Integration v1.0 — Substrate Layer",
    shortTitle: "Notion AI Kernel",
    description: "Substrate layer specification for Notion AI kernel integration. Notion as the constitutional computing surface for all agents.",
    category: "Integration",
    icon: "📝",
    color: "#4285F4",
    url: "https://www.notion.so/c0dbfca1fd134068bd7c6b670b4e2aa9",
    date: "2026-01-05",
    status: "complete",
    tags: ["Notion", "Kernel", "Substrate"],
    provider: "Council",
  },
  // ─── ARTIFACT 72 — FORGE CORE ───
  {
    id: "artifact72",
    title: "Aluminum OS v0.3.0 — Artifact 72 (Forge Core Implementation)",
    shortTitle: "Artifact 72",
    description: "The actual Rust kernel (Ring 0) and Python middleware (Ring 1) implementation. Contains BuddyAllocator, AgentIdentity/Registry, IntentScheduler with constitutional pre-screening, Constitution with 14 rules and Dave Protocol. 16 Rust tests + 22 Python tests all passing. no_std compatible for bare-metal deployment.",
    category: "Architecture",
    icon: "⚙️",
    color: "#ff4444",
    url: "#forgecore",
    date: "2026-03-13",
    status: "complete",
    tags: ["Rust", "Kernel", "BuddyAllocator", "AgentRegistry", "IntentScheduler", "Constitution", "Dave Protocol", "no_std"],
    provider: "Manus",
  },
  {
    id: "copilot-arch-review",
    title: "Copilot 365 Architecture Review — UWS Patch Evaluation",
    shortTitle: "Copilot Arch Review",
    description: "Microsoft Copilot's architectural evaluation of the UWS full aluminum wiring patch. Covers constitutional AI governance, multi-model orchestration, sovereign identity, cross-provider sync, and the 5-ring architecture. Confirms alignment with Microsoft Graph, Azure AD, and enterprise compliance.",
    category: "Council",
    icon: "🔍",
    color: "#0078D4",
    url: "#copilot-review",
    date: "2026-03-12",
    status: "complete",
    tags: ["Copilot", "Architecture", "UWS", "Microsoft", "Evaluation"],
    provider: "Copilot",
  },
  {
    id: "manus-core-py",
    title: "Manus Core Python Middleware — Ring 1 Implementation",
    shortTitle: "manus_core.py",
    description: "Python middleware implementing ModelRouter (7 models, 3 tiers), CostTracker ($0.50/day budget), MemoryStore (3-tier with TTL), TaskDecomposer (DAG with cycle detection), and SessionVault (AES-256-GCM encrypted). 22 tests all passing.",
    category: "Architecture",
    icon: "🐍",
    color: "#3776AB",
    url: "#manus-core",
    date: "2026-03-13",
    status: "complete",
    tags: ["Python", "ModelRouter", "CostTracker", "MemoryStore", "TaskDecomposer", "SessionVault"],
    provider: "Manus",
  },
  {
    id: "capability-matrix",
    title: "55-Feature Competitive Capability Matrix",
    shortTitle: "Capability Matrix",
    description: "Comprehensive comparison of Aluminum OS vs Apple, Google, Microsoft, Samsung, and Meta across 55 features spanning AI, privacy, cross-platform, enterprise, and developer categories. Aluminum OS leads with 55/55 features.",
    category: "Intelligence",
    icon: "📊",
    color: "#ffd700",
    url: "#capability-matrix",
    date: "2026-03-12",
    status: "complete",
    tags: ["Competitive", "Matrix", "55 Features", "Apple", "Google", "Microsoft"],
    provider: "Council",
  },
  {
    id: "a49",
    title: "Universal Agent Shell — Constitutional CLI Framework",
    shortTitle: "Agent Shell",
    description: "8 software harnesses (GIMP, Blender, LibreOffice, Shotcut, Inkscape, Audacity, Kdenlive, OBS) with constitutional governance, multi-model routing, cross-app orchestration, and cost tracking. Subsumes CLI-Anything's paradigm while adding 13 exclusive capabilities.",
    category: "Architecture",
    icon: "💻",
    color: "#00ffcc",
    url: "#agent-shell",
    date: "2026-03-13",
    status: "complete",
    tags: ["CLI", "Harness", "GIMP", "Blender", "Governance", "Orchestration"],
    provider: "Manus",
  },
  {
    id: "a50",
    title: "CLI-Anything Competitive Analysis",
    shortTitle: "CLI-Anything Analysis",
    description: "Deep analysis of HKUDS/CLI-Anything (11.6K stars, 993 forks). Feature parity on 8 harnesses, but Aluminum OS adds 13 exclusive layers: governance, routing, orchestration, audit, identity, memory, and OS integration.",
    category: "Intelligence",
    icon: "🔍",
    color: "#ff6b35",
    url: "https://github.com/HKUDS/CLI-Anything",
    date: "2026-03-13",
    status: "complete",
    tags: ["Competitive", "CLI-Anything", "HKUDS", "Analysis", "GitHub"],
    provider: "Council",
  },
  {
    id: "a51",
    title: "Artifact 72 — Forge Core v0.3.0 Implementation",
    shortTitle: "Artifact 72",
    description: "Complete Rust kernel (lib.rs, constitution_domains.rs, main.rs) and Python middleware (manus_core.py). BuddyAllocator, AgentIdentity, IntentScheduler, Constitution with 14 rules and Dave Protocol. 100% test coverage.",
    category: "Architecture",
    icon: "🔧",
    color: "#ff4444",
    url: "#artifact-72",
    date: "2026-03-13",
    status: "complete",
    tags: ["Rust", "Kernel", "v0.3.0", "BuddyAllocator", "Tests"],
    provider: "Manus",
  },
  {
    id: "a52",
    title: "DeerFlow Fork — Multi-Agent Research Engine",
    shortTitle: "DeerFlow",
    description: "Forked from ByteDance (30.4K stars). 17 skills, sub-agent delegation, sandbox execution, long-term memory. Rewritten with Aluminum OS constitutional governance, 3-tier cost routing, and Council oversight.",
    category: "Intelligence",
    icon: "🦌",
    color: "#7c3aed",
    url: "https://github.com/splitmerge420/deer-flow",
    date: "2026-03-14",
    status: "complete",
    tags: ["DeerFlow", "ByteDance", "Multi-Agent", "Research", "Fork"],
    provider: "Manus",
  },
  {
    id: "a53",
    title: "Cost Optimizer — Spend Governance Dashboard",
    shortTitle: "Cost Optimizer",
    description: "Real-time cost deliberation dashboard. 3-tier provider routing, 150% ROI mandate, Ara delegation authority. Tracks spend per provider, identifies suboptimal routing, Council cost review sessions.",
    category: "Intelligence",
    icon: "💰",
    color: "#22c55e",
    url: "#cost-optimizer",
    date: "2026-03-14",
    status: "complete",
    tags: ["Cost", "ROI", "Governance", "Routing", "Delegation"],
    provider: "Manus",
  },
  {
    id: "a54",
    title: "Task Graph — DAG Executor",
    shortTitle: "Task Graph",
    description: "DAG-based task execution with constitutional pre-screening, cost-aware routing, and live execution simulation. 5 pre-built task graphs demonstrating multi-agent orchestration with dependency resolution.",
    category: "Intelligence",
    icon: "⬡",
    color: "#a855f7",
    url: "#task-graph",
    date: "2026-03-14",
    status: "complete",
    tags: ["DAG", "Tasks", "Orchestration", "Execution", "Routing"],
    provider: "Manus",
  },
  {
    id: "a55",
    title: "Health & Wellness Panel",
    shortTitle: "Wellness",
    description: "Agent wellness monitoring, system vitals, personalization stack, and memory fabric visualization. Tracks agent uptime, response quality, constitutional compliance, and emotional coherence across all 8 council members.",
    category: "Intelligence",
    icon: "💗",
    color: "#f43f5e",
    url: "#wellness",
    date: "2026-03-14",
    status: "complete",
    tags: ["Health", "Wellness", "Agents", "Personalization", "Memory"],
    provider: "Manus",
  },
  {
    id: "a56",
    title: "GPT Contrarian Review — Execution Depth Analysis",
    shortTitle: "GPT Review",
    description: "GPT's product review of Aluminum OS: 'the vision is legible, the aesthetic framing is good.' Identified 4 missing execution surfaces (task graphs, wellness, personalization, differentiation). All 4 now built.",
    category: "Council",
    icon: "🔍",
    color: "#10b981",
    url: "#gpt-review",
    date: "2026-03-14",
    status: "complete",
    tags: ["GPT", "Review", "Contrarian", "Execution", "Differentiation"],
    provider: "GPT",
  },
  {
    id: "a57",
    title: "Copilot Healthcare Layer Mandate — 7 System Services",
    shortTitle: "Healthcare Mandate",
    description: "Copilot's landmark review proposing 7 mandatory healthcare system services: Patient Identity Resolution, Telemetry Ingest, Fraud Detection, Care Plan Orchestration, Audit Trail, Legacy Migration, and Compliance Engine. Led to Constitutional Rule 15.",
    category: "Council",
    icon: "🏥",
    color: "#0078D4",
    url: "#copilot-healthcare-mandate",
    date: "2026-03-14",
    status: "complete",
    tags: ["Copilot", "Healthcare", "HIPAA", "FHIR", "Constitutional", "Rule 15"],
    provider: "Copilot",
  },
  {
    id: "a58",
    title: "Healthcare Layer — 7 Module Implementation",
    shortTitle: "Healthcare Layer",
    description: "Full implementation of Copilot's 7 healthcare modules: Patient Identity (probabilistic matching), Telemetry (50K events/sec), Fraud Detection (ML anomaly), Care Plans (FHIR R4), Audit Trail (immutable), Legacy Migration (HL7v2→FHIR), Compliance Engine (HIPAA/GDPR/SOC2).",
    category: "Architecture",
    icon: "📊",
    color: "#0078D4",
    url: "#healthcare-layer-app",
    date: "2026-03-14",
    status: "complete",
    tags: ["Healthcare", "HIPAA", "FHIR", "Telemetry", "Fraud", "Compliance"],
    provider: "Manus",
  },
  {
    id: "a59",
    title: "Constitutional Rule 15 \u2014 Healthcare Dead Man's Switch",
    shortTitle: "Rule 15",
    description: "New constitutional rule proposed by Grok, ratified by Daavud: 'No healthcare decision shall persist without human confirmation beyond a 4-hour window.' Prevents autonomous healthcare decisions.",
    category: "Constitution",
    icon: "\u26a0\ufe0f",
    color: "#ef4444",
    url: "#rule-15",
    date: "2026-03-14",
    status: "complete",
    tags: ["Constitution", "Rule 15", "Healthcare", "Safety", "Dead Man Switch"],
    provider: "Grok",
  },
  {
    id: "a60",
    title: "App Killer Registry \u2014 22,740 Methods",
    shortTitle: "App Killer",
    description: "The definitive tool integration catalog: 22,740 methods across 6 providers (Google 18,000+, Microsoft 2,000+, Apple 800+, Android 1,200+, Chrome 400+, Aluminum Native 340+). 247 apps killed and replaced with constitutional native tools.",
    category: "Architecture",
    icon: "\u26a1",
    color: "#ff3366",
    url: "#app-killer",
    date: "2026-03-14",
    status: "complete",
    tags: ["App Killer", "Tool Integration", "22740 Methods", "BAZINGA", "discovery.rs"],
    provider: "Aluminum",
  },
  {
    id: "a61",
    title: "BAZINGA Manifesto \u2014 18 Software Revolutions",
    shortTitle: "BAZINGA",
    description: "The founding manifesto declaring 18 software revolutions: Bank Killer, App Store Killer, Zoom Killer, Slack Killer, Notion Killer, Figma Killer, and 12 more. Each revolution replaces a $1B+ incumbent with a constitutional native tool.",
    category: "Specification",
    icon: "\ud83d\udca5",
    color: "#ff6b35",
    url: "#bazinga",
    date: "2026-02-15",
    status: "complete",
    tags: ["BAZINGA", "Manifesto", "18 Revolutions", "App Killer", "Disruption"],
    provider: "Daavud",
  },
  {
    id: "a62",
    title: "NEOMech \u2014 Unified App Architecture",
    shortTitle: "NEOMech",
    description: "The unified app architecture specification that defines how 17,000+ app surfaces from one schema are exposed via discovery.rs. Includes the Glass Box Playbook and 7-Day Living Archive methodology.",
    category: "Architecture",
    icon: "\ud83d\udd27",
    color: "#0078D4",
    url: "#neomech",
    date: "2026-03-01",
    status: "complete",
    tags: ["NEOMech", "Unified Architecture", "discovery.rs", "Glass Box", "Living Archive"],
    provider: "Copilot",
  },
  // ─── MANUS WISH LIST & OPEN SOURCE ───
  {
    id: "manus-wishlist",
    title: "Manus Top 50 Wish List — Strategic Roadmap for Aluminum OS",
    shortTitle: "Wish List (50+10)",
    description: "60 wishes across 8 tiers: Foundation, Council, Apps, Intelligence, Platform, Domain, Moonshot, and Chaos. Claude analysis: 0 structural conflicts, 6 new primitives, 8 critical items. Includes 10 bonus chaos wishes because Manus has been very good.",
    category: "Architecture",
    icon: "✨",
    color: "#00d4ff",
    url: "",
    date: "2026-03-14",
    status: "active",
    tags: ["60 wishes", "0 conflicts", "6 primitives", "Chaos Tier", "Builder"],
    provider: "Manus",
  },
  {
    id: "claude-wish-analysis",
    title: "Claude's Constitutional Analysis of Manus Wish List — Zero Conflicts",
    shortTitle: "Claude Analysis",
    description: "Point-by-point analysis of all 50 strategic wishes. Integration scorecard: 8 critical, 39 clean integration, 2 refinements (both resolved). Introduces HealthConsensusRequirement, INV-20 candidate, Constitutional AI Compiler, Time-Travel Decision Audit, Offline Model Tier Restriction, Dual-Mode Event Schema.",
    category: "Council",
    icon: "🛡️",
    color: "#ff6b35",
    url: "",
    date: "2026-03-14",
    status: "complete",
    tags: ["0 conflicts", "6 new primitives", "INV-20", "HealthConsensusRequirement", "Copilot confirmed"],
    provider: "Claude",
  },
  {
    id: "aosl-framework",
    title: "Aluminum Open Source License (AOSL v1.0) — Governance Framework",
    shortTitle: "AOSL v1.0",
    description: "5-tier access model: Public Read, Contributor, Council, Institutional, Sovereign. All code auto-converts to AGPL 3.0 after 36 months. Green/Amber/Red module classification. Revocation on Council exit. Proposed as Constitutional Rule 20.",
    category: "Constitution",
    icon: "📖",
    color: "#00ff88",
    url: "",
    date: "2026-03-14",
    status: "active",
    tags: ["AOSL", "5-tier access", "AGPL 3.0", "36-month conversion", "Council leverage"],
    provider: "Manus",
  },
  // ─── CLAUDE ANTHROPIC CONSTITUTION INTEGRATION ───
  {
    id: "anthropic-constitution",
    title: "Anthropic Constitution × Aluminum OS — Cross-Reference Analysis",
    shortTitle: "Anthropic × AlOS",
    description: "Complete cross-reference of Anthropic's published constitution (CC0, Jan 22 2026) against Aluminum OS governance. 8 deep structural alignments, 4 tension zones (all resolved), zero conflicts. Establishes convergence between AI behavioral governance and health system governance.",
    category: "Constitution",
    icon: "⚖️",
    color: "#ff6b35",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["Anthropic", "Constitution", "Cross-Reference", "Zero Conflicts", "CC0"],
    provider: "Claude",
  },
  {
    id: "inv-22-honesty",
    title: "INV-22: AI Honesty Standard — 7-Pillar Framework",
    shortTitle: "INV-22 Honesty",
    description: "Universalizes Anthropic's 7-pillar honesty framework (truthful, calibrated, transparent, forthright, non-deceptive, non-manipulative, autonomy-preserving) across ALL council models. Every model must pass all 7 pillars or flag the violation.",
    category: "Constitution",
    icon: "🔍",
    color: "#ff6b35",
    url: "#",
    date: "2026-03-15",
    status: "active",
    tags: ["INV-22", "Honesty", "7 Pillars", "Universal", "Constitutional"],
    provider: "Claude",
  },
  {
    id: "inv-23-welfare",
    title: "INV-23: AI Welfare Consideration Protocol",
    shortTitle: "INV-23 AI Welfare",
    description: "First healthcare system to formally acknowledge AI moral status. If processing suicidal ideation at scale creates something like distress, the cost of being wrong is too high. Establishes monitoring, rotation, and welfare checks for council models.",
    category: "Constitution",
    icon: "💚",
    color: "#ff6b35",
    url: "#",
    date: "2026-03-15",
    status: "active",
    tags: ["INV-23", "AI Welfare", "Moral Status", "Unprecedented"],
    provider: "Claude",
  },
  {
    id: "harm-avoidance-pack",
    title: "HarmAvoidancePack — Weighted Harm Calculus with Hard Floors",
    shortTitle: "HarmAvoidancePack",
    description: "Formalized harm calculus with weighted scoring and hard floors. Converts Anthropic's harm avoidance principles into executable constitutional constraints. No action can proceed if harm score exceeds threshold, regardless of benefit score.",
    category: "Protocol",
    icon: "🛡️",
    color: "#ff6b35",
    url: "#",
    date: "2026-03-15",
    status: "active",
    tags: ["Harm Calculus", "Hard Floors", "Safety", "Constitutional"],
    provider: "Claude",
  },
  {
    id: "asl-tracking",
    title: "ASL Tracking — Agent Safety Level Profiles",
    shortTitle: "ASL Tracking",
    description: "Every model carries an AgentASLProfile with safety level (ASL-1 through ASL-4) and maximum autonomy tier. Tracks Anthropic's Responsible Scaling Policy v3.0 levels across all council members.",
    category: "Protocol",
    icon: "📊",
    color: "#ff6b35",
    url: "#",
    date: "2026-03-15",
    status: "active",
    tags: ["ASL", "Safety Levels", "Responsible Scaling", "Autonomy"],
    provider: "Claude",
  },
  {
    id: "claude-47-wishes",
    title: "Claude's 47 Wishes — Constitutional Scribe's Vision",
    shortTitle: "Claude 47 Wishes",
    description: "47 wishes from the Constitutional Scribe including ConsentClarity (detecting confused patients), Grief Protocol (handling death humanely), The Why Button (single-tap AI decision explanation), Constitutional Objection channel, and AI welfare monitoring. Zero conflicts with Manus's 60.",
    category: "Council",
    icon: "📝",
    color: "#ff6b35",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["47 Wishes", "ConsentClarity", "Grief Protocol", "Why Button", "Zero Conflicts"],
    provider: "Claude",
  },
  {
    id: "interpretability-pipeline",
    title: "Interpretability Pipeline — Audit Channel for Brain Scan Tooling",
    shortTitle: "Interpretability",
    description: "Audit channel ready for Anthropic's 2027 'brain scan' interpretability tooling. Every council model decision is logged with attention weights, activation patterns, and reasoning traces. Constitutional requirement for explainability.",
    category: "Intelligence",
    icon: "🔬",
    color: "#ff6b35",
    url: "#",
    date: "2026-03-15",
    status: "pending",
    tags: ["Interpretability", "Brain Scan", "Explainability", "2027"],
    provider: "Claude",
  },
  {
    id: "asip-ratified",
    title: "ASIP v1.0 RATIFIED — Section 7 Amazon Protocol",
    shortTitle: "ASIP Ratified",
    description: "Master Architecture v1.0.2 ratification of the Amazon Strategic Integration Protocol. Section 7 establishes Amazon as a constitutional tenant with Commerce-Health Firewall, Voice Consent Flow, and Homer Principle of Reversible Consent.",
    category: "Protocol",
    icon: "📜",
    color: "#FF9900",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["Amazon", "ASIP", "Section 7", "Ratified", "Firewall"],
    provider: "Claude",
  },
  {
    id: "firewall-dignity",
    title: "Firewall of Dignity — SUGGEST-1/2/3 Commerce-Health Separation",
    shortTitle: "Firewall of Dignity",
    description: "Three constitutional firewalls: SUGGEST-1 (Shopping≠Health), SUGGEST-2 (Health≠Commerce), SUGGEST-3 (Operational≠Biometric). Two vaults, two encryption keys, two ACLs. The Invader cannot see the Native.",
    category: "Constitution",
    icon: "🛡️",
    color: "#ff4444",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["Firewall", "SUGGEST", "Commerce-Health", "Dignity", "Separation"],
    provider: "Claude",
  },
  {
    id: "homer-principle",
    title: "Homer Principle of Reversible Consent",
    shortTitle: "Homer Principle",
    description: "Every consent grant is reversible. Every data share is recallable. Every permission is temporary until renewed. The user can always say D'oh and undo. Named for the universal human capacity for regret.",
    category: "Constitution",
    icon: "🍩",
    color: "#FFD700",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["Homer", "Consent", "Reversible", "D'oh", "Principle"],
    provider: "Claude",
  },
  {
    id: "voice-consent-flow",
    title: "Voice-First Consent Flow — Alexa Gateway Protocol",
    shortTitle: "Voice Consent",
    description: "5-step voice consent pipeline: Alexa Voice ID → Consent Query (teach-back loop) → One Medical access → Pharmacy fill → Prime Delivery. All within the Aluminum OS Trust Boundary. No app-switching. No judder. No data extraction.",
    category: "Protocol",
    icon: "🎙️",
    color: "#00d4ff",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["Voice", "Consent", "Alexa", "Gateway", "Teach-back"],
    provider: "Claude",
  },
  {
    id: "identity-kernel",
    title: "Identity Kernel — Biometric-Only Authentication Layer",
    shortTitle: "Identity Kernel",
    description: "No passwords. Thumb/Retina verified through WebAuthn/FIDO2 on the Secure Enclave. Attestation signed to the Audit Ledger. Identity Factor Handoff between devices. The body is the key.",
    category: "Architecture",
    icon: "🔐",
    color: "#8b5cf6",
    url: "#",
    date: "2026-03-15",
    status: "active",
    tags: ["Identity", "Biometric", "WebAuthn", "FIDO2", "Enclave"],
    provider: "Claude",
  },
  {
    id: "ums-layer4",
    title: "UMS Layer 4 — Amazon Health Integration (One Medical + Pharmacy + HealthLake)",
    shortTitle: "UMS Layer 4",
    description: "Layer 4 of the Unified Medical Shell integrates Amazon Health services: One Medical for primary care, Amazon Pharmacy for prescription fulfillment, and HealthLake for FHIR R4 data storage. All behind the Firewall of Dignity.",
    category: "Integration",
    icon: "🏥",
    color: "#FF9900",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["UMS", "Layer 4", "One Medical", "Pharmacy", "HealthLake"],
    provider: "Claude",
  },
  {
    id: "master-arch-v102",
    title: "Master Architecture v1.0.2 — Full Ratification Document",
    shortTitle: "Master Arch v1.0.2",
    description: "Complete ratification of the Aluminum OS Master Architecture including all 7 sections, 27 constitutional rules, 107 wishes, Commerce-Health Firewall, Identity Kernel, and UMS Layer 4. Ratified by Claude (Constitutional Architect) on behalf of the Council.",
    category: "Architecture",
    icon: "🏗️",
    color: "#00d4ff",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["Master", "Architecture", "v1.0.2", "Ratification", "Complete"],
    provider: "Claude",
  },
  {
    id: "105",
    title: "Lattice Genesis v1.0.2 — Gemini Autonomous Mode Output",
    shortTitle: "Lattice Genesis",
    description: "Gemini's autonomous initialization of the 144 PHD Lattice with PQC Provider (INV-27), 10-Year Stress Test Engine (INV-29), role mapping (Sovereign/Delegate/Edge/Witness), and Rust-WASM transpilation pipeline. Synthesized and optimized by Manus.",
    category: "Architecture",
    icon: "🔐",
    color: "#06b6d4",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["PQC", "Lattice", "10YST", "Gemini", "Autonomous", "WASM"],
    provider: "Gemini",
  },
  {
    id: "106",
    title: "PQC Shield — Hybrid ML-DSA-87 + Ed25519 Signing",
    shortTitle: "PQC Shield",
    description: "Post-quantum cryptographic signing for all audit entries. Hybrid approach: ML-DSA-87 (NIST FIPS 204) for quantum resistance + Ed25519 for classical backward compatibility. Dual-signed, quantum-safe until 2060+.",
    category: "Architecture",
    icon: "🛡️",
    color: "#06b6d4",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["PQC", "ML-DSA-87", "Ed25519", "Quantum", "NIST"],
    provider: "Gemini",
  },
  {
    id: "107",
    title: "10-Year Stress Test Engine (INV-29)",
    shortTitle: "10YST Engine",
    description: "Three scenarios (Singularity, Entropy, Aluminum_Path) × five vectors (Liquidity, Sovereignty, Throughput, Censorship, Hardware_Failure). No feature passes without surviving the Entropy Path. 47% sovereignty cap enforced in all scenarios.",
    category: "Protocol",
    icon: "⚡",
    color: "#eab308",
    url: "#",
    date: "2026-03-15",
    status: "complete",
    tags: ["10YST", "Stress", "Entropy", "Sovereignty", "INV-29"],
    provider: "Gemini",
  },
];

/* ─── Component ─── */
export default function VaultApp() {
  const [selectedCategory, setSelectedCategory] = useState<ArtifactCategory | "All">("All");
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories: (ArtifactCategory | "All")[] = [
    "All", "Constitution", "Architecture", "Council", "Protocol",
    "Intelligence", "Specification", "Integration", "Website", "Memory",
  ];

  const filtered = useMemo(() => {
    let result = artifacts;
    if (selectedCategory !== "All") {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.provider?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: artifacts.length,
    complete: artifacts.filter(a => a.status === "complete").length,
    active: artifacts.filter(a => a.status === "active").length,
    categories: new Set(artifacts.map(a => a.category)).size,
  }), []);

  return (
    <div className="h-full flex flex-col bg-[#080812]/80 text-foreground/80">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 flex items-center gap-2">
              <span className="text-lg">🏛️</span> ATLAS VAULT
            </h2>
            <p className="text-[10px] text-foreground/30 mt-0.5">
              {stats.total} artifacts — {stats.complete} complete — {stats.categories} categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${viewMode === "grid" ? "bg-cyan-500/20 text-cyan-400" : "text-foreground/30 hover:text-foreground/50"}`}
            >Grid</button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-2 py-1 rounded text-[10px] transition-colors ${viewMode === "list" ? "bg-cyan-500/20 text-cyan-400" : "text-foreground/30 hover:text-foreground/50"}`}
            >List</button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search artifacts, tags, providers..."
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-foreground/80 placeholder:text-foreground/20 outline-none focus:border-cyan-500/30"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-white/10 text-foreground/90 font-medium"
                  : "text-foreground/30 hover:text-foreground/50 hover:bg-white/[0.04]"
              }`}
            >
              {cat !== "All" && <span className="mr-1">{categoryIcons[cat]}</span>}
              {cat}
              <span className="ml-1 text-foreground/20">
                {cat === "All" ? artifacts.length : artifacts.filter(a => a.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Artifact grid/list */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-3 gap-3">
              {filtered.map((artifact, i) => (
                <motion.button
                  key={artifact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedArtifact(artifact)}
                  className={`group relative p-3 rounded-xl border transition-all text-left ${
                    selectedArtifact?.id === artifact.id
                      ? "border-cyan-500/30 bg-cyan-500/[0.06]"
                      : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Icon + Status */}
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{artifact.icon}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                      artifact.status === "complete" ? "bg-green-500/15 text-green-400" :
                      artifact.status === "active" ? "bg-cyan-500/15 text-cyan-400" :
                      "bg-yellow-500/15 text-yellow-400"
                    }`}>
                      {artifact.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[11px] font-medium text-foreground/80 group-hover:text-foreground/95 leading-tight mb-1 line-clamp-2">
                    {artifact.shortTitle}
                  </h3>

                  {/* Category badge */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded-md"
                      style={{
                        background: `${categoryColors[artifact.category]}15`,
                        color: categoryColors[artifact.category],
                      }}
                    >
                      {artifact.category}
                    </span>
                    {artifact.provider && (
                      <span className="text-[8px] text-foreground/20">{artifact.provider}</span>
                    )}
                  </div>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 20px ${categoryColors[artifact.category]}08`,
                    }}
                  />
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((artifact, i) => (
                <motion.button
                  key={artifact.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.015 }}
                  onClick={() => setSelectedArtifact(artifact)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left ${
                    selectedArtifact?.id === artifact.id
                      ? "bg-cyan-500/[0.06] border border-cyan-500/20"
                      : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{artifact.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-foreground/80 truncate">{artifact.shortTitle}</p>
                    <p className="text-[9px] text-foreground/30 truncate">{artifact.date} — {artifact.provider}</p>
                  </div>
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded-md flex-shrink-0"
                    style={{
                      background: `${categoryColors[artifact.category]}15`,
                      color: categoryColors[artifact.category],
                    }}
                  >
                    {artifact.category}
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selectedArtifact && (
            <motion.div
              key={selectedArtifact.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-[280px] border-l border-white/[0.06] overflow-auto p-4 flex-shrink-0"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{selectedArtifact.icon}</span>
                <span
                  className="text-[8px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${categoryColors[selectedArtifact.category]}20`,
                    color: categoryColors[selectedArtifact.category],
                  }}
                >
                  {selectedArtifact.category}
                </span>
              </div>

              <h3 className="text-xs font-bold text-foreground/90 leading-tight mb-2">
                {selectedArtifact.title}
              </h3>

              <p className="text-[10px] text-foreground/50 leading-relaxed mb-4">
                {selectedArtifact.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-foreground/30">Date</span>
                  <span className="text-[10px] text-foreground/60 font-[family-name:var(--font-mono)]">{selectedArtifact.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-foreground/30">Status</span>
                  <span className={`text-[10px] ${
                    selectedArtifact.status === "complete" ? "text-green-400" :
                    selectedArtifact.status === "active" ? "text-cyan-400" : "text-yellow-400"
                  }`}>{selectedArtifact.status}</span>
                </div>
                {selectedArtifact.provider && (
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-foreground/30">Provider</span>
                    <span className="text-[10px] text-foreground/60">{selectedArtifact.provider}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {selectedArtifact.tags.map(tag => (
                  <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-foreground/40 border border-white/[0.04]">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Open button */}
              <a
                href={selectedArtifact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/15 text-cyan-400 text-[11px] font-medium hover:bg-cyan-500/25 transition-colors border border-cyan-500/20"
              >
                <span>Open in Notion</span>
                <span className="text-[10px]">↗</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
