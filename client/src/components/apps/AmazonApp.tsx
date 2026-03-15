/**
 * AmazonApp — Amazon Strategic Integration Protocol
 * 
 * The Amazon integration layer for Aluminum OS. Not a wrapper around AWS Console —
 * a constitutional bridge that synthesizes Alexa+, AWS services, Bedrock model routing,
 * Fire device management, One Medical health, and Ring/Blink security into a unified
 * sovereign interface governed by the Aluminum Constitution.
 * 
 * Tabs: Alexa+ Bridge | AWS Dashboard | Bedrock Models | Fire Devices | Health (One Medical) | Security (Ring) | Audit
 * 
 * Constitutional compliance:
 * - INV-7: Amazon services capped at 47% sovereign weight
 * - INV-3: Consent before any data collection
 * - Rule 8: All API calls logged to immutable audit ledger
 * - INV-20: Health data requires multi-model consensus
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "alexa" | "aws" | "bedrock" | "fire" | "health" | "security" | "audit";

// ── Alexa+ Bridge ──────────────────────────────────────────────────
interface AlexaSkill {
  id: string;
  name: string;
  status: "active" | "pending" | "disabled";
  invocations: number;
  category: string;
  constitutionalClearance: boolean;
}

const alexaSkills: AlexaSkill[] = [
  { id: "alum-council", name: "Aluminum Council", status: "active", invocations: 1247, category: "AI Governance", constitutionalClearance: true },
  { id: "alum-health", name: "Health Check", status: "active", invocations: 892, category: "Healthcare", constitutionalClearance: true },
  { id: "alum-agent", name: "Agent Shell Voice", status: "active", invocations: 2341, category: "AI Assistant", constitutionalClearance: true },
  { id: "alum-home", name: "Smart Home Hub", status: "active", invocations: 5678, category: "IoT", constitutionalClearance: true },
  { id: "alum-security", name: "Ring Guardian", status: "active", invocations: 432, category: "Security", constitutionalClearance: true },
  { id: "alum-wellness", name: "Wellness Coach", status: "pending", invocations: 0, category: "Healthcare", constitutionalClearance: false },
  { id: "alum-shop", name: "Constitutional Shopping", status: "active", invocations: 156, category: "Commerce", constitutionalClearance: true },
  { id: "alum-music", name: "Music Synthesis", status: "active", invocations: 3421, category: "Media", constitutionalClearance: true },
  { id: "alum-drive", name: "Drive Navigator", status: "pending", invocations: 0, category: "Navigation", constitutionalClearance: false },
  { id: "alum-read", name: "Kindle Reader", status: "active", invocations: 789, category: "Media", constitutionalClearance: true },
];

// ── AWS Services ───────────────────────────────────────────────────
interface AWSService {
  name: string;
  region: string;
  status: "running" | "idle" | "error" | "provisioning";
  cost: number;
  category: string;
  constitutionalTier: number;
}

const awsServices: AWSService[] = [
  { name: "EC2 — Inference Cluster", region: "us-west-2", status: "running", cost: 847.20, category: "Compute", constitutionalTier: 1 },
  { name: "S3 — Vault Storage", region: "us-west-2", status: "running", cost: 23.45, category: "Storage", constitutionalTier: 2 },
  { name: "Lambda — Agent Functions", region: "us-west-2", status: "running", cost: 12.80, category: "Compute", constitutionalTier: 1 },
  { name: "DynamoDB — Session State", region: "us-west-2", status: "running", cost: 45.60, category: "Database", constitutionalTier: 2 },
  { name: "SageMaker — Model Training", region: "us-west-2", status: "idle", cost: 0, category: "ML", constitutionalTier: 1 },
  { name: "CloudWatch — Audit Logs", region: "us-west-2", status: "running", cost: 8.90, category: "Monitoring", constitutionalTier: 3 },
  { name: "IAM — Constitutional ACL", region: "global", status: "running", cost: 0, category: "Security", constitutionalTier: 3 },
  { name: "KMS — Encryption Keys", region: "us-west-2", status: "running", cost: 3.20, category: "Security", constitutionalTier: 3 },
  { name: "EKS — Agent Orchestration", region: "us-west-2", status: "running", cost: 156.40, category: "Containers", constitutionalTier: 1 },
  { name: "SNS — Notification Bus", region: "us-west-2", status: "running", cost: 1.20, category: "Messaging", constitutionalTier: 2 },
  { name: "Kinesis — Event Stream", region: "us-west-2", status: "running", cost: 34.50, category: "Streaming", constitutionalTier: 2 },
  { name: "HealthLake — FHIR Store", region: "us-west-2", status: "running", cost: 67.80, category: "Healthcare", constitutionalTier: 3 },
];

// ── Bedrock Models ─────────────────────────────────────────────────
interface BedrockModel {
  id: string;
  name: string;
  provider: string;
  tier: number;
  tokensPerSec: number;
  costPer1K: number;
  status: "available" | "throttled" | "unavailable";
  councilRole: string;
  trustScore: number;
}

const bedrockModels: BedrockModel[] = [
  { id: "anthropic.claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", tier: 1, tokensPerSec: 45, costPer1K: 0.015, status: "available", councilRole: "Constitutional Architect", trustScore: 94 },
  { id: "anthropic.claude-3-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", tier: 2, tokensPerSec: 82, costPer1K: 0.003, status: "available", councilRole: "Fast Reasoning", trustScore: 91 },
  { id: "amazon.titan-text-express", name: "Titan Text Express", provider: "Amazon", tier: 2, tokensPerSec: 120, costPer1K: 0.0008, status: "available", councilRole: "Bulk Processing", trustScore: 78 },
  { id: "amazon.titan-text-premier", name: "Titan Text Premier", provider: "Amazon", tier: 1, tokensPerSec: 65, costPer1K: 0.005, status: "available", councilRole: "Enterprise Tasks", trustScore: 82 },
  { id: "amazon.titan-embed-v2", name: "Titan Embeddings v2", provider: "Amazon", tier: 3, tokensPerSec: 200, costPer1K: 0.0002, status: "available", councilRole: "Vector Search", trustScore: 85 },
  { id: "amazon.nova-pro", name: "Nova Pro", provider: "Amazon", tier: 1, tokensPerSec: 95, costPer1K: 0.008, status: "available", councilRole: "Multimodal Analysis", trustScore: 80 },
  { id: "amazon.nova-lite", name: "Nova Lite", provider: "Amazon", tier: 3, tokensPerSec: 150, costPer1K: 0.0006, status: "available", councilRole: "Quick Tasks", trustScore: 76 },
  { id: "meta.llama3-70b", name: "Llama 3 70B", provider: "Meta", tier: 1, tokensPerSec: 55, costPer1K: 0.00265, status: "available", councilRole: "Open Research", trustScore: 87 },
  { id: "cohere.command-r-plus", name: "Command R+", provider: "Cohere", tier: 1, tokensPerSec: 60, costPer1K: 0.003, status: "available", councilRole: "RAG Specialist", trustScore: 84 },
  { id: "mistral.mistral-large", name: "Mistral Large", provider: "Mistral", tier: 1, tokensPerSec: 70, costPer1K: 0.004, status: "throttled", councilRole: "European Compliance", trustScore: 81 },
  { id: "stability.sd-xl-v1", name: "Stable Diffusion XL", provider: "Stability", tier: 2, tokensPerSec: 0, costPer1K: 0.04, status: "available", councilRole: "Image Generation", trustScore: 79 },
  { id: "ai21.jamba-instruct", name: "Jamba Instruct", provider: "AI21", tier: 2, tokensPerSec: 90, costPer1K: 0.002, status: "available", councilRole: "Long Context", trustScore: 77 },
];

// ── Fire Devices ───────────────────────────────────────────────────
interface FireDevice {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "sleeping" | "updating";
  battery?: number;
  firmware: string;
  alexaEnabled: boolean;
  constitutionalSync: boolean;
  lastSeen: string;
}

const fireDevices: FireDevice[] = [
  { id: "echo-show-15", name: "Echo Show 15 — Living Room", type: "Echo Show", status: "online", firmware: "v8.4.2", alexaEnabled: true, constitutionalSync: true, lastSeen: "Now" },
  { id: "echo-dot-5", name: "Echo Dot 5th Gen — Bedroom", type: "Echo Dot", status: "online", firmware: "v8.4.2", alexaEnabled: true, constitutionalSync: true, lastSeen: "Now" },
  { id: "echo-dot-office", name: "Echo Dot — Office", type: "Echo Dot", status: "sleeping", firmware: "v8.4.1", alexaEnabled: true, constitutionalSync: true, lastSeen: "2m ago" },
  { id: "fire-tv-stick-4k", name: "Fire TV Stick 4K Max", type: "Fire TV", status: "online", firmware: "v7.6.3.0", alexaEnabled: true, constitutionalSync: true, lastSeen: "Now" },
  { id: "fire-tablet-hd10", name: "Fire HD 10 Plus", type: "Fire Tablet", status: "online", battery: 78, firmware: "v14.3.1", alexaEnabled: true, constitutionalSync: true, lastSeen: "Now" },
  { id: "fire-tablet-hd8", name: "Fire HD 8 — Kitchen", type: "Fire Tablet", status: "sleeping", battery: 92, firmware: "v14.3.1", alexaEnabled: true, constitutionalSync: false, lastSeen: "15m ago" },
  { id: "echo-auto", name: "Echo Auto 2nd Gen", type: "Echo Auto", status: "offline", firmware: "v3.2.1", alexaEnabled: true, constitutionalSync: true, lastSeen: "3h ago" },
  { id: "echo-buds", name: "Echo Buds 2nd Gen", type: "Echo Buds", status: "online", battery: 65, firmware: "v5.1.0", alexaEnabled: true, constitutionalSync: true, lastSeen: "Now" },
  { id: "ring-doorbell-pro", name: "Ring Video Doorbell Pro 2", type: "Ring", status: "online", battery: 100, firmware: "v2.4.8", alexaEnabled: true, constitutionalSync: true, lastSeen: "Now" },
  { id: "blink-outdoor", name: "Blink Outdoor 4 — Backyard", type: "Blink", status: "online", battery: 87, firmware: "v10.2", alexaEnabled: true, constitutionalSync: true, lastSeen: "Now" },
];

// ── One Medical Health ─────────────────────────────────────────────
interface HealthRecord {
  id: string;
  type: string;
  date: string;
  provider: string;
  status: "completed" | "scheduled" | "pending";
  consentGranted: boolean;
  fhirSynced: boolean;
}

const healthRecords: HealthRecord[] = [
  { id: "h1", type: "Annual Physical", date: "2026-02-15", provider: "Dr. Sarah Chen — One Medical", status: "completed", consentGranted: true, fhirSynced: true },
  { id: "h2", type: "Blood Panel", date: "2026-02-15", provider: "Quest Diagnostics via One Medical", status: "completed", consentGranted: true, fhirSynced: true },
  { id: "h3", type: "Cardiology Follow-up", date: "2026-03-20", provider: "Dr. James Park — One Medical", status: "scheduled", consentGranted: true, fhirSynced: false },
  { id: "h4", type: "Mental Health Check-in", date: "2026-03-25", provider: "Dr. Lisa Wong — One Medical", status: "scheduled", consentGranted: true, fhirSynced: false },
  { id: "h5", type: "Prescription Renewal", date: "2026-03-10", provider: "Amazon Pharmacy", status: "completed", consentGranted: true, fhirSynced: true },
  { id: "h6", type: "Dental Cleaning", date: "2026-04-05", provider: "Partner Dental via One Medical", status: "pending", consentGranted: false, fhirSynced: false },
  { id: "h7", type: "Vision Screening", date: "2026-04-12", provider: "Partner Vision via One Medical", status: "pending", consentGranted: false, fhirSynced: false },
];

// ── Security (Ring/Blink) ──────────────────────────────────────────
interface SecurityEvent {
  id: string;
  device: string;
  type: "motion" | "doorbell" | "person" | "package" | "vehicle" | "animal";
  time: string;
  thumbnail: string;
  reviewed: boolean;
}

const securityEvents: SecurityEvent[] = [
  { id: "s1", device: "Ring Doorbell Pro 2", type: "person", time: "2 min ago", thumbnail: "👤", reviewed: false },
  { id: "s2", device: "Blink Outdoor — Backyard", type: "animal", time: "15 min ago", thumbnail: "🐕", reviewed: false },
  { id: "s3", device: "Ring Doorbell Pro 2", type: "package", time: "1h ago", thumbnail: "📦", reviewed: true },
  { id: "s4", device: "Blink Outdoor — Backyard", type: "motion", time: "2h ago", thumbnail: "🌿", reviewed: true },
  { id: "s5", device: "Ring Doorbell Pro 2", type: "vehicle", time: "3h ago", thumbnail: "🚗", reviewed: true },
  { id: "s6", device: "Ring Doorbell Pro 2", type: "doorbell", time: "5h ago", thumbnail: "🔔", reviewed: true },
  { id: "s7", device: "Blink Outdoor — Backyard", type: "person", time: "8h ago", thumbnail: "👤", reviewed: true },
];

// ── Audit Log ──────────────────────────────────────────────────────
interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  service: string;
  rule: string;
  result: "allowed" | "blocked" | "escalated";
  detail: string;
}

const auditLog: AuditEntry[] = [
  { id: "a1", timestamp: "2026-03-15 14:32:01", action: "Alexa Skill Invocation", service: "Alexa+", rule: "INV-7", result: "allowed", detail: "Council query via voice — sovereignty weight 31% (under 47% cap)" },
  { id: "a2", timestamp: "2026-03-15 14:28:15", action: "Bedrock API Call", service: "Bedrock", rule: "Rule 8", result: "allowed", detail: "Claude 3 Opus — constitutional analysis request, logged to audit trail" },
  { id: "a3", timestamp: "2026-03-15 14:15:42", action: "Health Data Sync", service: "HealthLake", rule: "INV-3 + INV-20", result: "allowed", detail: "FHIR R4 sync — consent verified, 3-model consensus achieved (85%)" },
  { id: "a4", timestamp: "2026-03-15 13:55:20", action: "Ring Motion Alert", service: "Ring", rule: "INV-3", result: "allowed", detail: "Person detected at front door — video stored with consent, 48h retention" },
  { id: "a5", timestamp: "2026-03-15 13:40:08", action: "Shopping Cart Review", service: "Alexa+", rule: "INV-7", result: "escalated", detail: "Purchase >$100 requires sovereign confirmation — escalated to Daavud" },
  { id: "a6", timestamp: "2026-03-15 13:22:33", action: "Device Firmware Update", service: "Fire Devices", rule: "Rule 12", result: "allowed", detail: "Echo Dot office — OTA update v8.4.1→v8.4.2, constitutional hash verified" },
  { id: "a7", timestamp: "2026-03-15 12:58:17", action: "Bedrock Model Switch", service: "Bedrock", rule: "Rule 5", result: "allowed", detail: "Auto-routed from Titan Express to Claude Sonnet — complexity threshold exceeded" },
  { id: "a8", timestamp: "2026-03-15 12:30:00", action: "Wellness Data Request", service: "One Medical", rule: "INV-3", result: "blocked", detail: "Third-party wellness app requested health data — no consent on file, blocked" },
  { id: "a9", timestamp: "2026-03-15 11:45:22", action: "Lambda Execution", service: "AWS Lambda", rule: "Rule 8", result: "allowed", detail: "Agent function: process-council-vote — 23ms execution, logged" },
  { id: "a10", timestamp: "2026-03-15 11:20:05", action: "Blink Recording Access", service: "Blink", rule: "INV-3", result: "allowed", detail: "Sovereign accessed backyard recording — consent inherent for owner" },
];

// ── Shared Helpers ─────────────────────────────────────────────────
const statusColor = (s: string) => {
  const map: Record<string, string> = {
    running: "text-green-400", active: "text-green-400", online: "text-green-400", available: "text-green-400",
    completed: "text-green-400", allowed: "text-green-400",
    idle: "text-yellow-400", sleeping: "text-yellow-400", pending: "text-yellow-400", throttled: "text-yellow-400",
    provisioning: "text-blue-400", updating: "text-blue-400", scheduled: "text-blue-400", escalated: "text-amber-400",
    error: "text-red-400", offline: "text-red-400/50", unavailable: "text-red-400", disabled: "text-red-400/50",
    blocked: "text-red-400",
  };
  return map[s] || "text-foreground/50";
};

const statusDot = (s: string) => {
  const map: Record<string, string> = {
    running: "bg-green-400", active: "bg-green-400", online: "bg-green-400", available: "bg-green-400",
    completed: "bg-green-400", allowed: "bg-green-400",
    idle: "bg-yellow-400", sleeping: "bg-yellow-400", pending: "bg-yellow-400", throttled: "bg-yellow-400",
    provisioning: "bg-blue-400", updating: "bg-blue-400", scheduled: "bg-blue-400", escalated: "bg-amber-400",
    error: "bg-red-400", offline: "bg-red-400/40", unavailable: "bg-red-400", disabled: "bg-red-400/40",
    blocked: "bg-red-400",
  };
  return map[s] || "bg-foreground/30";
};

// ── Main Component ─────────────────────────────────────────────────
export default function AmazonApp() {
  const [tab, setTab] = useState<Tab>("alexa");
  const [alexaListening, setAlexaListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Simulate Alexa listening animation
  useEffect(() => {
    if (alexaListening) {
      const t = setTimeout(() => setAlexaListening(false), 3000);
      return () => clearTimeout(t);
    }
  }, [alexaListening]);

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: "alexa", label: "Alexa+", badge: `${alexaSkills.filter(s => s.status === "active").length}` },
    { id: "aws", label: "AWS", badge: `$${awsServices.reduce((a, s) => a + s.cost, 0).toFixed(0)}` },
    { id: "bedrock", label: "Bedrock", badge: `${bedrockModels.filter(m => m.status === "available").length}` },
    { id: "fire", label: "Devices", badge: `${fireDevices.filter(d => d.status === "online").length}/${fireDevices.length}` },
    { id: "health", label: "Health" },
    { id: "security", label: "Security", badge: `${securityEvents.filter(e => !e.reviewed).length}` },
    { id: "audit", label: "Audit" },
  ];

  const totalCost = awsServices.reduce((a, s) => a + s.cost, 0);
  const sovereigntyWeight = 34.2; // Amazon's current weight in the constitutional framework

  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-foreground/90 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-[#FF9900]/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9900]/20 to-[#FF9900]/5 flex items-center justify-center border border-[#FF9900]/20">
              <span className="text-[#FF9900] text-sm font-bold">A</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground/90 font-[family-name:var(--font-display)]">
                Amazon Strategic Integration
              </h2>
              <p className="text-[9px] text-foreground/30 font-[family-name:var(--font-mono)]">
                Protocol v1.0 — Constitutional Bridge — INV-7 Compliant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-foreground/25">Sovereignty Weight</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#FF9900]/60" style={{ width: `${(sovereigntyWeight / 47) * 100}%` }} />
                </div>
                <span className="text-[10px] text-[#FF9900]/70 font-[family-name:var(--font-mono)]">
                  {sovereigntyWeight}% / 47%
                </span>
              </div>
            </div>
            <div className="w-px h-6 bg-white/5" />
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-foreground/25">Monthly Spend</span>
              <span className="text-[10px] text-green-400/70 font-[family-name:var(--font-mono)]">
                ${totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-0.5 overflow-x-auto scrollbar-none">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-all min-h-[32px] ${
                tab === t.id
                  ? "bg-[#FF9900]/15 text-[#FF9900] border border-[#FF9900]/20"
                  : "text-foreground/40 hover:text-foreground/60 hover:bg-white/3"
              }`}
            >
              {t.label}
              {t.badge && (
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                  tab === t.id ? "bg-[#FF9900]/20 text-[#FF9900]" : "bg-white/5 text-foreground/30"
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {/* ── Alexa+ Bridge ── */}
            {tab === "alexa" && (
              <div className="space-y-4">
                {/* Voice Interface */}
                <div className="rounded-xl border border-[#FF9900]/10 bg-[#FF9900]/[0.03] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xs font-semibold text-foreground/80">Alexa+ Voice Bridge</h3>
                      <p className="text-[9px] text-foreground/30">Constitutional voice interface — all commands logged to Rule 8 audit</p>
                    </div>
                    <button
                      onClick={() => setAlexaListening(true)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        alexaListening
                          ? "bg-[#00d4ff]/20 border-2 border-[#00d4ff]/40 shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                          : "bg-[#FF9900]/10 border border-[#FF9900]/20 hover:bg-[#FF9900]/20"
                      }`}
                    >
                      {alexaListening ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="flex gap-0.5"
                        >
                          {[0, 1, 2, 3, 4].map(i => (
                            <motion.div
                              key={i}
                              animate={{ height: [4, 16, 4] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className="w-0.5 bg-[#00d4ff] rounded-full"
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <svg className="w-6 h-6 text-[#FF9900]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="23" />
                          <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {alexaListening && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-[#00d4ff]/70 text-center font-[family-name:var(--font-mono)]"
                    >
                      Listening... Constitutional pre-screening active
                    </motion.p>
                  )}
                </div>

                {/* Skills Grid */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-foreground/25 mb-2 font-[family-name:var(--font-display)]">
                    Aluminum Skills ({alexaSkills.filter(s => s.status === "active").length} active)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {alexaSkills.map(skill => (
                      <div
                        key={skill.id}
                        className="rounded-lg border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-medium text-foreground/70">{skill.name}</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${statusDot(skill.status)}`} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-foreground/25">{skill.category}</span>
                          <span className="text-[8px] text-foreground/30 font-[family-name:var(--font-mono)]">
                            {skill.invocations.toLocaleString()} calls
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1">
                          <div className={`w-1 h-1 rounded-full ${skill.constitutionalClearance ? "bg-green-400" : "bg-yellow-400"}`} />
                          <span className="text-[7px] text-foreground/20">
                            {skill.constitutionalClearance ? "Constitutional clearance" : "Pending review"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alexa+ Features */}
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-foreground/25 mb-2 font-[family-name:var(--font-display)]">
                    Alexa+ Capabilities
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Multi-Room Audio", status: "active" },
                      { name: "Smart Home Control", status: "active" },
                      { name: "Council Voice Query", status: "active" },
                      { name: "Shopping by Voice", status: "active" },
                      { name: "Health Reminders", status: "active" },
                      { name: "Security Alerts", status: "active" },
                      { name: "Routine Automation", status: "active" },
                      { name: "Whisper Mode", status: "active" },
                      { name: "Proactive Hunches", status: "pending" },
                    ].map(cap => (
                      <div key={cap.name} className="flex items-center gap-1.5 py-1">
                        <div className={`w-1 h-1 rounded-full ${statusDot(cap.status)}`} />
                        <span className="text-[9px] text-foreground/40">{cap.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── AWS Dashboard ── */}
            {tab === "aws" && (
              <div className="space-y-3">
                {/* Cost Summary */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Compute", cost: awsServices.filter(s => s.category === "Compute").reduce((a, s) => a + s.cost, 0), color: "#FF9900" },
                    { label: "Storage", cost: awsServices.filter(s => s.category === "Storage" || s.category === "Database").reduce((a, s) => a + s.cost, 0), color: "#00d4ff" },
                    { label: "ML/AI", cost: awsServices.filter(s => s.category === "ML").reduce((a, s) => a + s.cost, 0), color: "#a855f7" },
                    { label: "Security", cost: awsServices.filter(s => s.category === "Security" || s.category === "Monitoring").reduce((a, s) => a + s.cost, 0), color: "#22c55e" },
                  ].map(cat => (
                    <div key={cat.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                      <p className="text-[8px] text-foreground/25 mb-1">{cat.label}</p>
                      <p className="text-sm font-semibold font-[family-name:var(--font-mono)]" style={{ color: cat.color }}>
                        ${cat.cost.toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Services List */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-foreground/25 mb-2 font-[family-name:var(--font-display)]">
                    Active Services ({awsServices.filter(s => s.status === "running").length}/{awsServices.length})
                  </h3>
                  <div className="space-y-1">
                    {awsServices.map(svc => (
                      <div
                        key={svc.name}
                        className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(svc.status)}`} />
                          <div className="min-w-0">
                            <p className="text-[10px] font-medium text-foreground/70 truncate">{svc.name}</p>
                            <p className="text-[8px] text-foreground/25">{svc.region} · Tier {svc.constitutionalTier}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-[9px] capitalize ${statusColor(svc.status)}`}>{svc.status}</span>
                          <span className="text-[10px] text-foreground/40 font-[family-name:var(--font-mono)] w-16 text-right">
                            ${svc.cost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constitutional Compliance */}
                <div className="rounded-lg border border-green-400/10 bg-green-400/[0.03] p-3">
                  <h3 className="text-[10px] text-green-400/60 font-semibold mb-2">Constitutional Compliance</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { rule: "INV-7", desc: "Sovereignty cap", status: "34.2% / 47%", ok: true },
                      { rule: "Rule 8", desc: "Audit logging", status: "All API calls logged", ok: true },
                      { rule: "INV-3", desc: "Consent gates", status: "12/12 services consented", ok: true },
                      { rule: "Rule 12", desc: "Firmware integrity", status: "All hashes verified", ok: true },
                    ].map(c => (
                      <div key={c.rule} className="flex items-center gap-2 py-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.ok ? "bg-green-400" : "bg-red-400"}`} />
                        <div>
                          <span className="text-[9px] text-foreground/50">{c.rule}: {c.desc}</span>
                          <p className="text-[8px] text-foreground/25">{c.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Bedrock Models ── */}
            {tab === "bedrock" && (
              <div className="space-y-3">
                {/* Model Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Available</p>
                    <p className="text-lg font-bold text-green-400 font-[family-name:var(--font-mono)]">
                      {bedrockModels.filter(m => m.status === "available").length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Avg Trust</p>
                    <p className="text-lg font-bold text-[#FF9900] font-[family-name:var(--font-mono)]">
                      {Math.round(bedrockModels.reduce((a, m) => a + m.trustScore, 0) / bedrockModels.length)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Providers</p>
                    <p className="text-lg font-bold text-cyan-400 font-[family-name:var(--font-mono)]">
                      {new Set(bedrockModels.map(m => m.provider)).size}
                    </p>
                  </div>
                </div>

                {/* Model List */}
                <div className="space-y-1.5">
                  {bedrockModels.map(model => (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                      className={`rounded-lg border p-3 cursor-pointer transition-all ${
                        selectedModel === model.id
                          ? "border-[#FF9900]/30 bg-[#FF9900]/[0.05]"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusDot(model.status)}`} />
                          <span className="text-[10px] font-medium text-foreground/70">{model.name}</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-foreground/30">{model.provider}</span>
                        </div>
                        <span className="text-[8px] text-foreground/25">Tier {model.tier}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-foreground/25">{model.councilRole}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] text-foreground/25 font-[family-name:var(--font-mono)]">
                            {model.tokensPerSec > 0 ? `${model.tokensPerSec} tok/s` : "Image"}
                          </span>
                          <span className="text-[8px] text-foreground/25 font-[family-name:var(--font-mono)]">
                            ${model.costPer1K}/1K
                          </span>
                        </div>
                      </div>

                      {/* Trust Score Bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[7px] text-foreground/20 w-8">Trust</span>
                        <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${model.trustScore}%`,
                              background: model.trustScore >= 90 ? "#22c55e" : model.trustScore >= 80 ? "#FF9900" : "#eab308",
                            }}
                          />
                        </div>
                        <span className="text-[8px] text-foreground/30 font-[family-name:var(--font-mono)] w-6 text-right">
                          {model.trustScore}
                        </span>
                      </div>

                      {/* Expanded Detail */}
                      <AnimatePresence>
                        {selectedModel === model.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-[7px] text-foreground/20">Model ID</p>
                                <p className="text-[9px] text-foreground/40 font-[family-name:var(--font-mono)]">{model.id}</p>
                              </div>
                              <div>
                                <p className="text-[7px] text-foreground/20">Constitutional Tier</p>
                                <p className="text-[9px] text-foreground/40">
                                  {model.tier === 1 ? "Critical — Full audit" : model.tier === 2 ? "Standard — Sampled audit" : "Utility — Log only"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[7px] text-foreground/20">Council Integration</p>
                                <p className="text-[9px] text-foreground/40">
                                  {model.provider === "Amazon" ? "Native Bedrock" : "Cross-provider bridge"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[7px] text-foreground/20">INV-7 Weight</p>
                                <p className="text-[9px] text-foreground/40">
                                  {model.provider === "Amazon" ? "Counts toward 47% cap" : "External — no cap impact"}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Fire Devices ── */}
            {tab === "fire" && (
              <div className="space-y-3">
                {/* Device Summary */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Online</p>
                    <p className="text-lg font-bold text-green-400 font-[family-name:var(--font-mono)]">
                      {fireDevices.filter(d => d.status === "online").length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Alexa Enabled</p>
                    <p className="text-lg font-bold text-[#FF9900] font-[family-name:var(--font-mono)]">
                      {fireDevices.filter(d => d.alexaEnabled).length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Synced</p>
                    <p className="text-lg font-bold text-cyan-400 font-[family-name:var(--font-mono)]">
                      {fireDevices.filter(d => d.constitutionalSync).length}
                    </p>
                  </div>
                </div>

                {/* Device List */}
                <div className="space-y-1.5">
                  {fireDevices.map(device => (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
                      className={`rounded-lg border p-3 cursor-pointer transition-all ${
                        selectedDevice === device.id
                          ? "border-[#FF9900]/30 bg-[#FF9900]/[0.05]"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${statusDot(device.status)}`} />
                          <div>
                            <p className="text-[10px] font-medium text-foreground/70">{device.name}</p>
                            <p className="text-[8px] text-foreground/25">{device.type} · {device.firmware}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {device.battery !== undefined && (
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-2.5 rounded-sm border border-foreground/20 p-px">
                                <div
                                  className={`h-full rounded-[1px] ${
                                    device.battery > 50 ? "bg-green-400" : device.battery > 20 ? "bg-yellow-400" : "bg-red-400"
                                  }`}
                                  style={{ width: `${device.battery}%` }}
                                />
                              </div>
                              <span className="text-[8px] text-foreground/30">{device.battery}%</span>
                            </div>
                          )}
                          <span className={`text-[8px] ${statusColor(device.status)} capitalize`}>{device.status}</span>
                        </div>
                      </div>

                      {/* Expanded */}
                      <AnimatePresence>
                        {selectedDevice === device.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2.5 pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-[7px] text-foreground/20">Last Seen</p>
                                <p className="text-[9px] text-foreground/40">{device.lastSeen}</p>
                              </div>
                              <div>
                                <p className="text-[7px] text-foreground/20">Alexa</p>
                                <p className="text-[9px] text-foreground/40">{device.alexaEnabled ? "Enabled" : "Disabled"}</p>
                              </div>
                              <div>
                                <p className="text-[7px] text-foreground/20">Constitutional Sync</p>
                                <p className={`text-[9px] ${device.constitutionalSync ? "text-green-400/60" : "text-yellow-400/60"}`}>
                                  {device.constitutionalSync ? "Synced — INV-7 compliant" : "Pending sync"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[7px] text-foreground/20">Firmware</p>
                                <p className="text-[9px] text-foreground/40">{device.firmware} — Hash verified</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Health (One Medical) ── */}
            {tab === "health" && (
              <div className="space-y-3">
                {/* One Medical Header */}
                <div className="rounded-xl border border-[#FF9900]/10 bg-[#FF9900]/[0.03] p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9900]/20 to-red-500/10 flex items-center justify-center border border-[#FF9900]/15">
                      <span className="text-lg">🏥</span>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-foreground/80">One Medical by Amazon</h3>
                      <p className="text-[9px] text-foreground/30">Integrated with Unified Medical Shell — Layer 5 Pandora Flow</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-[8px] text-foreground/25">Records</p>
                      <p className="text-sm font-bold text-foreground/60">{healthRecords.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-foreground/25">FHIR Synced</p>
                      <p className="text-sm font-bold text-green-400">{healthRecords.filter(r => r.fhirSynced).length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-foreground/25">Consent</p>
                      <p className="text-sm font-bold text-cyan-400">{healthRecords.filter(r => r.consentGranted).length}/{healthRecords.length}</p>
                    </div>
                  </div>
                </div>

                {/* Health Records */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-foreground/25 mb-2 font-[family-name:var(--font-display)]">
                    Health Records
                  </h3>
                  <div className="space-y-1.5">
                    {healthRecords.map(record => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/5 bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusDot(record.status)}`} />
                          <div>
                            <p className="text-[10px] font-medium text-foreground/70">{record.type}</p>
                            <p className="text-[8px] text-foreground/25">{record.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {record.consentGranted && <span className="text-[7px] px-1 py-0.5 rounded bg-green-400/10 text-green-400/60">INV-3 ✓</span>}
                            {record.fhirSynced && <span className="text-[7px] px-1 py-0.5 rounded bg-cyan-400/10 text-cyan-400/60">FHIR</span>}
                          </div>
                          <span className={`text-[9px] capitalize ${statusColor(record.status)}`}>{record.status}</span>
                          <span className="text-[9px] text-foreground/30 font-[family-name:var(--font-mono)]">{record.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amazon Pharmacy */}
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-foreground/25 mb-2 font-[family-name:var(--font-display)]">
                    Amazon Pharmacy
                  </h3>
                  <div className="space-y-1.5">
                    {[
                      { name: "Prescription Auto-Refill", status: "active", next: "Mar 28, 2026" },
                      { name: "Insurance Sync", status: "active", next: "Verified" },
                      { name: "Delivery Tracking", status: "active", next: "No pending" },
                    ].map(rx => (
                      <div key={rx.name} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusDot(rx.status)}`} />
                          <span className="text-[9px] text-foreground/50">{rx.name}</span>
                        </div>
                        <span className="text-[8px] text-foreground/30">{rx.next}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Security (Ring/Blink) ── */}
            {tab === "security" && (
              <div className="space-y-3">
                {/* Security Status */}
                <div className="rounded-xl border border-green-400/10 bg-green-400/[0.03] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-semibold text-green-400/80">Home Security — Armed</h3>
                      <p className="text-[9px] text-foreground/30">Ring + Blink integrated — Constitutional video retention (48h default)</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center border border-green-400/20">
                      <span className="text-lg">🛡️</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <p className="text-[8px] text-foreground/25">Cameras</p>
                      <p className="text-sm font-bold text-green-400">2</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-foreground/25">Events Today</p>
                      <p className="text-sm font-bold text-foreground/60">{securityEvents.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-foreground/25">Unreviewed</p>
                      <p className="text-sm font-bold text-amber-400">{securityEvents.filter(e => !e.reviewed).length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] text-foreground/25">Retention</p>
                      <p className="text-sm font-bold text-cyan-400">48h</p>
                    </div>
                  </div>
                </div>

                {/* Event Feed */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-foreground/25 mb-2 font-[family-name:var(--font-display)]">
                    Recent Events
                  </h3>
                  <div className="space-y-1.5">
                    {securityEvents.map(event => (
                      <div
                        key={event.id}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${
                          !event.reviewed
                            ? "border-amber-400/15 bg-amber-400/[0.03]"
                            : "border-white/5 bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{event.thumbnail}</span>
                          <div>
                            <p className="text-[10px] font-medium text-foreground/70 capitalize">{event.type} Detected</p>
                            <p className="text-[8px] text-foreground/25">{event.device}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!event.reviewed && (
                            <span className="text-[7px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400/60">New</span>
                          )}
                          <span className="text-[9px] text-foreground/30">{event.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yale Lock Integration */}
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-foreground/25 mb-2 font-[family-name:var(--font-display)]">
                    Smart Lock (Yale via Ring)
                  </h3>
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🔒</span>
                      <div>
                        <p className="text-[10px] text-foreground/60">Front Door — Locked</p>
                        <p className="text-[8px] text-foreground/25">Last unlocked: 2h ago by Daavud (biometric)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-[8px] text-green-400/60">Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Audit Log ── */}
            {tab === "audit" && (
              <div className="space-y-3">
                {/* Audit Summary */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Allowed</p>
                    <p className="text-lg font-bold text-green-400 font-[family-name:var(--font-mono)]">
                      {auditLog.filter(a => a.result === "allowed").length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Escalated</p>
                    <p className="text-lg font-bold text-amber-400 font-[family-name:var(--font-mono)]">
                      {auditLog.filter(a => a.result === "escalated").length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
                    <p className="text-[8px] text-foreground/25 mb-1">Blocked</p>
                    <p className="text-lg font-bold text-red-400 font-[family-name:var(--font-mono)]">
                      {auditLog.filter(a => a.result === "blocked").length}
                    </p>
                  </div>
                </div>

                {/* Audit Entries */}
                <div className="space-y-1">
                  {auditLog.map(entry => (
                    <div
                      key={entry.id}
                      className={`px-3 py-2.5 rounded-lg border ${
                        entry.result === "blocked"
                          ? "border-red-400/15 bg-red-400/[0.03]"
                          : entry.result === "escalated"
                          ? "border-amber-400/15 bg-amber-400/[0.03]"
                          : "border-white/5 bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusDot(entry.result)}`} />
                          <span className="text-[10px] font-medium text-foreground/70">{entry.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-foreground/30">{entry.rule}</span>
                          <span className={`text-[8px] capitalize ${statusColor(entry.result)}`}>{entry.result}</span>
                        </div>
                      </div>
                      <p className="text-[8px] text-foreground/30 leading-relaxed">{entry.detail}</p>
                      <p className="text-[7px] text-foreground/15 mt-1 font-[family-name:var(--font-mono)]">
                        {entry.timestamp} · {entry.service}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Immutability Notice */}
                <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] p-3 text-center">
                  <p className="text-[9px] text-cyan-400/50">
                    All entries are append-only and cryptographically signed per Rule 8.
                    Tampering triggers automatic Council alert and sovereign notification.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[8px] text-foreground/25 font-[family-name:var(--font-mono)]">
            Amazon Bridge Active — {fireDevices.filter(d => d.status === "online").length} devices online — INV-7: {sovereigntyWeight}%
          </span>
        </div>
        <span className="text-[8px] text-foreground/15 font-[family-name:var(--font-mono)]">
          ASIP v1.0 — Constitutional
        </span>
      </div>
    </div>
  );
}
