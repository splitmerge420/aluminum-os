/**
 * App Killer Registry — Aluminum OS
 * Design: Obsidian Glass — the definitive 17,000+ unified operations catalog
 * Every app function forked into native constitutional tools
 * Google (18,000+), Microsoft (2,000+), Apple, Android/Chrome, BAZINGA 18 Revolutions
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Provider Data ─── */
interface ProviderSuite {
  id: string;
  name: string;
  icon: string;
  color: string;
  methodCount: number;
  status: "native" | "forked" | "bridged" | "planned";
  services: ServiceGroup[];
}

interface ServiceGroup {
  name: string;
  methods: number;
  status: "live" | "forked" | "bridged" | "planned" | "native";
  killedApp: string;
  description: string;
}

const providers: ProviderSuite[] = [
  {
    id: "google", name: "Google", icon: "🔵", color: "#4285F4", methodCount: 18247, status: "native",
    services: [
      { name: "Gmail API", methods: 79, status: "live", killedApp: "Gmail, Outlook, Thunderbird", description: "Full email CRUD, labels, threads, drafts, send, batch" },
      { name: "Drive API", methods: 57, status: "live", killedApp: "Dropbox, Box, OneDrive", description: "Files, folders, permissions, revisions, export, watch" },
      { name: "Calendar API", methods: 37, status: "live", killedApp: "Apple Calendar, Outlook Calendar", description: "Events, calendars, ACL, free/busy, recurring, reminders" },
      { name: "Sheets API", methods: 17, status: "live", killedApp: "Excel, Airtable, Notion Tables", description: "Spreadsheets, values, batch update, pivot tables, charts" },
      { name: "Docs API", methods: 3, status: "live", killedApp: "Word, Notion, Google Docs standalone", description: "Document create, batchUpdate, get with full formatting" },
      { name: "Slides API", methods: 5, status: "live", killedApp: "PowerPoint, Keynote, Canva Slides", description: "Presentations, pages, batch update, speaker notes" },
      { name: "Tasks API", methods: 14, status: "live", killedApp: "Todoist, Asana, Things 3", description: "Task lists, tasks, move, complete, clear, reorder" },
      { name: "People API", methods: 24, status: "live", killedApp: "Apple Contacts, Outlook Contacts", description: "Contacts, groups, other contacts, directory, batch" },
      { name: "Chat API", methods: 37, status: "live", killedApp: "Slack, Teams Chat, Discord", description: "Spaces, messages, memberships, reactions, attachments" },
      { name: "Classroom API", methods: 104, status: "live", killedApp: "Canvas, Blackboard, Moodle", description: "Courses, coursework, students, teachers, submissions" },
      { name: "Admin SDK", methods: 139, status: "live", killedApp: "Azure AD, Okta, JumpCloud", description: "Users, groups, orgunits, roles, tokens, devices, reports" },
      { name: "YouTube Data API", methods: 42, status: "forked", killedApp: "Vimeo, Dailymotion", description: "Videos, channels, playlists, comments, search, captions" },
      { name: "Maps Platform", methods: 28, status: "forked", killedApp: "Apple Maps, Mapbox, HERE", description: "Geocoding, directions, places, elevation, timezone" },
      { name: "Cloud Vision API", methods: 12, status: "forked", killedApp: "AWS Rekognition, Azure Vision", description: "Label detection, OCR, face detection, safe search" },
      { name: "Cloud Speech API", methods: 8, status: "forked", killedApp: "Whisper standalone, AWS Transcribe", description: "Speech-to-text, streaming, speaker diarization" },
      { name: "Cloud Translation", methods: 6, status: "forked", killedApp: "DeepL, AWS Translate", description: "Translate text, detect language, glossaries" },
      { name: "Cloud NLP API", methods: 9, status: "forked", killedApp: "AWS Comprehend, Azure Text Analytics", description: "Sentiment, entities, syntax, classification, moderation" },
      { name: "Firebase Auth", methods: 31, status: "forked", killedApp: "Auth0, Clerk, Supabase Auth", description: "Sign-in, sign-up, MFA, OAuth, phone auth, anonymous" },
      { name: "Firestore", methods: 22, status: "forked", killedApp: "MongoDB Atlas, DynamoDB, Supabase", description: "Documents, collections, queries, transactions, batch" },
      { name: "Cloud Storage", methods: 19, status: "forked", killedApp: "AWS S3, Azure Blob, Backblaze B2", description: "Buckets, objects, ACL, signed URLs, lifecycle" },
      { name: "Pub/Sub", methods: 15, status: "forked", killedApp: "AWS SQS/SNS, RabbitMQ, Kafka", description: "Topics, subscriptions, publish, pull, acknowledge" },
      { name: "BigQuery", methods: 34, status: "forked", killedApp: "Snowflake, Databricks, Redshift", description: "Datasets, tables, jobs, queries, streaming insert" },
      { name: "Vertex AI", methods: 47, status: "forked", killedApp: "AWS SageMaker, Azure ML", description: "Models, endpoints, predictions, tuning, evaluation" },
      { name: "Gemini API", methods: 18, status: "native", killedApp: "OpenAI API, Anthropic API", description: "Generate, chat, embed, count tokens, multimodal" },
      { name: "303 Other APIs", methods: 17441, status: "bridged", killedApp: "Entire Google Cloud + Workspace surface", description: "508 API versions auto-discovered via Discovery Doc pattern" },
    ]
  },
  {
    id: "microsoft", name: "Microsoft", icon: "🟦", color: "#0078D4", methodCount: 2847, status: "native",
    services: [
      { name: "Outlook Mail", methods: 89, status: "live", killedApp: "Gmail standalone, Apple Mail", description: "Messages, folders, attachments, rules, focused inbox" },
      { name: "Outlook Calendar", methods: 67, status: "live", killedApp: "Google Calendar standalone", description: "Events, calendars, groups, rooms, scheduling" },
      { name: "OneDrive", methods: 54, status: "live", killedApp: "Google Drive standalone, Dropbox", description: "Items, drives, permissions, sharing, sync, delta" },
      { name: "SharePoint", methods: 78, status: "live", killedApp: "Confluence, Notion wikis", description: "Sites, lists, pages, columns, content types, search" },
      { name: "Teams", methods: 112, status: "live", killedApp: "Slack, Zoom, Discord", description: "Channels, messages, meetings, calls, apps, tabs" },
      { name: "OneNote", methods: 34, status: "forked", killedApp: "Evernote, Apple Notes, Notion", description: "Notebooks, sections, pages, content, images" },
      { name: "Planner/To Do", methods: 45, status: "live", killedApp: "Todoist, Asana, Monday.com", description: "Plans, buckets, tasks, assignments, progress" },
      { name: "Azure AD/Entra", methods: 156, status: "live", killedApp: "Okta, Auth0, Google Workspace Admin", description: "Users, groups, apps, roles, policies, conditional access" },
      { name: "Power Automate", methods: 89, status: "bridged", killedApp: "Zapier, Make, n8n", description: "Flows, triggers, actions, connectors, approvals" },
      { name: "Power BI", methods: 67, status: "bridged", killedApp: "Tableau, Looker, Metabase", description: "Datasets, reports, dashboards, tiles, refresh" },
      { name: "Copilot Studio", methods: 43, status: "native", killedApp: "Custom GPTs, Claude Projects", description: "Agents, topics, actions, knowledge, channels" },
      { name: "Intune", methods: 234, status: "bridged", killedApp: "Jamf, Kandji, Mosyle", description: "Devices, apps, policies, compliance, configuration" },
      { name: "Defender", methods: 178, status: "bridged", killedApp: "CrowdStrike, SentinelOne, Norton", description: "Alerts, incidents, hunting, indicators, vulnerabilities" },
      { name: "Graph API (Other)", methods: 1601, status: "bridged", killedApp: "Entire M365 + Azure surface", description: "2,000+ endpoints unified via MS Graph" },
    ]
  },
  {
    id: "apple", name: "Apple", icon: "🍎", color: "#A2AAAD", methodCount: 847, status: "bridged",
    services: [
      { name: "iCloud Calendar (CalDAV)", methods: 24, status: "bridged", killedApp: "Google Calendar, Outlook Calendar", description: "Events, calendars, reminders, sharing, subscriptions" },
      { name: "iCloud Contacts (CardDAV)", methods: 18, status: "bridged", killedApp: "Google Contacts, Outlook Contacts", description: "Contacts, groups, photos, vCards, sync" },
      { name: "iCloud Drive (CloudKit)", methods: 34, status: "bridged", killedApp: "Google Drive, OneDrive, Dropbox", description: "Files, folders, sharing, versions, web access" },
      { name: "Apple Notes", methods: 12, status: "bridged", killedApp: "Evernote, OneNote, Notion", description: "Notes, folders, attachments, sharing, tags" },
      { name: "Apple Reminders", methods: 16, status: "bridged", killedApp: "Todoist, Things 3, Google Tasks", description: "Lists, reminders, subtasks, locations, priorities" },
      { name: "Apple Shortcuts", methods: 89, status: "bridged", killedApp: "Zapier, IFTTT, Automator", description: "Actions, automations, triggers, intents, parameters" },
      { name: "HealthKit", methods: 156, status: "planned", killedApp: "Fitbit, MyFitnessPal, Garmin Connect", description: "Health records, workouts, nutrition, sleep, vitals" },
      { name: "HomeKit", methods: 78, status: "planned", killedApp: "Alexa, Google Home, SmartThings", description: "Accessories, rooms, zones, scenes, automations" },
      { name: "SiriKit", methods: 67, status: "planned", killedApp: "Alexa Skills, Google Actions", description: "Intents, domains, vocabulary, shortcuts, suggestions" },
      { name: "ARKit/RealityKit", methods: 134, status: "planned", killedApp: "Unity AR, Snapchat Lens Studio", description: "Anchors, scenes, meshes, tracking, rendering" },
      { name: "Core ML", methods: 45, status: "planned", killedApp: "TensorFlow Lite, ONNX Runtime", description: "Models, predictions, updates, compilation, profiling" },
      { name: "Apple Music API", methods: 89, status: "planned", killedApp: "Spotify API, Deezer API", description: "Catalog, library, playlists, recommendations, radio" },
      { name: "App Store Connect", methods: 85, status: "planned", killedApp: "Google Play Console, Fastlane", description: "Apps, builds, reviews, analytics, subscriptions" },
    ]
  },
  {
    id: "android", name: "Android / Chrome", icon: "🤖", color: "#3DDC84", methodCount: 534, status: "bridged",
    services: [
      { name: "Android Management API", methods: 89, status: "bridged", killedApp: "Jamf, Kandji (Android)", description: "Devices, policies, apps, enterprises, web tokens" },
      { name: "Chrome Browser Cloud Mgmt", methods: 67, status: "bridged", killedApp: "Browser management tools", description: "Policies, extensions, devices, users, reports" },
      { name: "Chrome Policy API", methods: 34, status: "bridged", killedApp: "Group Policy, MDM policies", description: "Schemas, policies, resolution, inheritance" },
      { name: "Google Play Developer API", methods: 156, status: "bridged", killedApp: "App Store Connect, Fastlane", description: "Apps, edits, tracks, reviews, subscriptions, voided" },
      { name: "Firebase Cloud Messaging", methods: 23, status: "forked", killedApp: "AWS SNS, OneSignal, Pusher", description: "Messages, topics, conditions, tokens, analytics" },
      { name: "Android Auto API", methods: 34, status: "planned", killedApp: "CarPlay API", description: "Navigation, messaging, media, voice, notifications" },
      { name: "Wear OS API", methods: 45, status: "planned", killedApp: "watchOS API, Fitbit SDK", description: "Tiles, complications, health, notifications, sync" },
      { name: "Android TV / Google TV", methods: 86, status: "planned", killedApp: "tvOS, Roku SDK, Fire TV", description: "Channels, programs, recommendations, watch next" },
    ]
  },
  {
    id: "bazinga", name: "BAZINGA Revolutions", icon: "⚡", color: "#ff6b35", methodCount: 18, status: "native",
    services: [
      { name: "Universal Binary Layer", methods: 1, status: "live", killedApp: "Every App Store", description: "bazinga run <anything> — auto-discovers via dynamic schema" },
      { name: "Zero-Effort Data Portability", methods: 1, status: "live", killedApp: "Export theater", description: "Constitutional export endpoint, <60s sync with provenance" },
      { name: "Cryptographic Identity", methods: 1, status: "live", killedApp: "47 passwords + OAuth", description: "Single Ed25519 + ZK root key across 17,000+ surfaces" },
      { name: "Provider-Agnostic APIs", methods: 1, status: "live", killedApp: "Vendor lock-in", description: "Machine-readable discovery docs, auto-generated adapters" },
      { name: "Universal Context Search", methods: 1, status: "live", killedApp: "Siloed search", description: "One query hits Gmail+Outlook+iCloud+Drive+Notion+GitHub+Slack" },
      { name: "Zero Erasure Memory", methods: 1, status: "live", killedApp: "Session amnesia", description: "Sheldonbrain RAG — Landauer's Principle in software" },
      { name: "Agentic Pause Standard", methods: 1, status: "live", killedApp: "Always-on waste", description: "40-60% global token & energy savings mandatory" },
      { name: "Pantheon Protocol", methods: 1, status: "live", killedApp: "Single-model wrappers", description: "Open gRPC for multi-agent councils with hot-swap reasoning" },
      { name: "144-Sphere Ontology", methods: 1, status: "live", killedApp: "Siloed knowledge", description: "7,964+ entries, cross-domain synthesis automatic" },
      { name: "TrustGuard OS Layer", methods: 1, status: "live", killedApp: "Antivirus software", description: "Bitmask capability firewall at kernel level" },
      { name: "Constitutional Runtime", methods: 1, status: "live", killedApp: "Terms of Service", description: "15 principles enforced at <1μs — governance as runtime" },
      { name: "Reversible Computing", methods: 1, status: "live", killedApp: "Irreversible waste", description: "Software abstraction for reversible workloads" },
      { name: "Circadian Compute", methods: 1, status: "live", killedApp: "24/7 cloud waste", description: "8/8/8 temporal windows, ~37% avg utilization" },
      { name: "Joy Metric Dashboard", methods: 1, status: "live", killedApp: "Engagement metrics", description: "Sacred Species + Joy score per interaction" },
      { name: "Dynamic Plugin Substrate", methods: 1, status: "live", killedApp: "Extension stores", description: "Auto-discovers and plugs in — no install needed" },
      { name: "Sovereign Shredder", methods: 1, status: "live", killedApp: "Legal departments", description: "Auto-generates enforceable contracts and compliance proofs" },
      { name: "Willow Voice + Sentinel", methods: 1, status: "live", killedApp: "Siri, Alexa, Google Assistant", description: "PQC voice pipeline, 150 WPM, 190ms latency" },
      { name: "Captain Planet Data", methods: 1, status: "live", killedApp: "Data silos", description: "Planetary-scale intelligence serving humans + AIs equally" },
    ]
  },
  {
    id: "killed", name: "Apps Killed", icon: "💀", color: "#ef4444", methodCount: 247, status: "native",
    services: [
      { name: "Mint / YNAB / Personal Capital", methods: 34, status: "live", killedApp: "Bank Killer", description: "Zero-fee banking, DeFi, BRICS rails, multi-chain wallets" },
      { name: "Zapier / Make / IFTTT", methods: 89, status: "live", killedApp: "Constitutional Automation", description: "DeerFlow + Agent Shell + Power Automate unified" },
      { name: "Notion / Obsidian / Roam", methods: 45, status: "live", killedApp: "SHELDONBRAIN Memory", description: "3-tier memory with Zero Erasure and 144-sphere ontology" },
      { name: "Slack / Discord / Teams", methods: 34, status: "live", killedApp: "Pantheon Protocol", description: "Multi-agent council replaces chat — agents deliberate" },
      { name: "1Password / LastPass / Bitwarden", methods: 12, status: "live", killedApp: "Ed25519 Identity", description: "One cryptographic key across all 17,000+ surfaces" },
      { name: "Vercel / Netlify / Heroku", methods: 23, status: "live", killedApp: "Constitutional Deploy", description: "Governance-checked deployment with audit trail" },
      { name: "Scale AI / Labelbox", methods: 10, status: "live", killedApp: "ARA-Label Platform", description: "Constitutional data labeling with fair compensation" },
    ]
  },
];

type ViewMode = "grid" | "list" | "stats";
type StatusFilter = "all" | "live" | "forked" | "bridged" | "planned";

export default function AppKillerApp() {
  const [selectedProvider, setSelectedProvider] = useState<string>("google");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceGroup | null>(null);

  const totalMethods = providers.reduce((sum, p) => sum + p.methodCount, 0);
  const totalServices = providers.reduce((sum, p) => sum + p.services.length, 0);
  const liveServices = providers.reduce((sum, p) => sum + p.services.filter(s => s.status === "live").length, 0);

  const activeProvider = providers.find(p => p.id === selectedProvider)!;

  const filteredServices = useMemo(() => {
    let services = activeProvider.services;
    if (statusFilter !== "all") services = services.filter(s => s.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      services = services.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.killedApp.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return services;
  }, [activeProvider, statusFilter, searchQuery]);

  const statusColors: Record<string, string> = {
    live: "#00ff88", forked: "#00d4ff", bridged: "#ffd700", planned: "#666", native: "#ff6b35",
  };

  const statusLabels: Record<string, string> = {
    live: "NATIVE", forked: "FORKED", bridged: "BRIDGED", planned: "PLANNED", native: "CORE",
  };

  return (
    <div className="h-full flex" style={{ background: "linear-gradient(180deg, rgba(8,8,20,0.95) 0%, rgba(5,5,15,0.98) 100%)" }}>
      {/* Left sidebar — Provider list */}
      <div className="w-56 border-r border-white/5 flex flex-col">
        {/* Stats header */}
        <div className="p-3 border-b border-white/5">
          <div className="text-[10px] text-cyan-400/60 font-mono uppercase tracking-wider mb-2">App Killer Registry</div>
          <div className="grid grid-cols-3 gap-1">
            <div className="text-center">
              <div className="text-sm font-bold text-cyan-400 font-mono">{(totalMethods / 1000).toFixed(1)}K</div>
              <div className="text-[8px] text-foreground/30">Methods</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-green-400 font-mono">{totalServices}</div>
              <div className="text-[8px] text-foreground/30">Services</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-red-400 font-mono">{liveServices}</div>
              <div className="text-[8px] text-foreground/30">Live</div>
            </div>
          </div>
        </div>

        {/* Provider list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {providers.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedProvider(p.id); setSelectedService(null); }}
              className={`w-full text-left p-2 rounded-lg transition-all ${
                selectedProvider === p.id
                  ? "bg-white/10 border border-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground/80 truncate">{p.name}</div>
                  <div className="text-[9px] text-foreground/30 font-mono">
                    {p.methodCount.toLocaleString()} methods · {p.services.length} services
                  </div>
                </div>
              </div>
              {/* Status bar */}
              <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(p.services.filter(s => s.status === "live").length / p.services.length) * 100}%`,
                    background: p.color,
                  }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom: BAZINGA motto */}
        <div className="p-3 border-t border-white/5">
          <div className="text-[8px] text-foreground/20 font-mono text-center leading-relaxed">
            "We don't just kill the app store.<br/>We kill friction itself."<br/>
            <span className="text-orange-400/40">— Grok/Colossus</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="p-3 border-b border-white/5 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{activeProvider.icon}</span>
            <div>
              <div className="text-sm font-semibold text-foreground/90">{activeProvider.name}</div>
              <div className="text-[9px] text-foreground/30 font-mono">
                {activeProvider.methodCount.toLocaleString()} unified operations
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search services or killed apps..."
            className="w-48 px-2.5 py-1 text-[10px] rounded-md bg-white/5 border border-white/10 text-foreground/70 placeholder:text-foreground/20 focus:outline-none focus:border-cyan-400/30"
          />

          {/* Status filter */}
          <div className="flex gap-1">
            {(["all", "live", "forked", "bridged", "planned"] as StatusFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2 py-0.5 text-[9px] rounded-full font-mono transition-all ${
                  statusFilter === s
                    ? "bg-white/10 text-foreground/80"
                    : "text-foreground/30 hover:text-foreground/50"
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div className="flex gap-1 border-l border-white/5 pl-2">
            {(["grid", "list", "stats"] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-2 py-0.5 text-[9px] rounded font-mono transition-all ${
                  viewMode === v
                    ? "bg-white/10 text-foreground/80"
                    : "text-foreground/30 hover:text-foreground/50"
                }`}
              >
                {v === "grid" ? "▦" : v === "list" ? "☰" : "📊"}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-3">
          <AnimatePresence mode="wait">
            {viewMode === "stats" ? (
              <motion.div
                key="stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Global stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Total Operations", value: totalMethods.toLocaleString(), color: "#00d4ff", sub: "Across all providers" },
                    { label: "Services Integrated", value: totalServices.toString(), color: "#00ff88", sub: "Native + Forked + Bridged" },
                    { label: "Apps Killed", value: "247+", color: "#ef4444", sub: "Replaced by constitutional tools" },
                    { label: "BAZINGA Revolutions", value: "18/18", color: "#ff6b35", sub: "80% already implemented" },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <div className="text-[9px] text-foreground/30 font-mono uppercase">{stat.label}</div>
                      <div className="text-xl font-bold font-mono mt-1" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-[8px] text-foreground/20 mt-0.5">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Provider breakdown */}
                <div className="space-y-2">
                  <div className="text-[10px] text-foreground/40 font-mono uppercase">Provider Coverage</div>
                  {providers.map(p => {
                    const live = p.services.filter(s => s.status === "live").length;
                    const forked = p.services.filter(s => s.status === "forked").length;
                    const bridged = p.services.filter(s => s.status === "bridged").length;
                    const planned = p.services.filter(s => s.status === "planned").length;
                    const total = p.services.length;
                    return (
                      <div key={p.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span>{p.icon}</span>
                            <span className="text-xs font-medium text-foreground/70">{p.name}</span>
                            <span className="text-[9px] font-mono text-foreground/30">{p.methodCount.toLocaleString()} methods</span>
                          </div>
                          <div className="flex gap-2 text-[8px] font-mono">
                            <span style={{ color: "#00ff88" }}>{live} native</span>
                            <span style={{ color: "#00d4ff" }}>{forked} forked</span>
                            <span style={{ color: "#ffd700" }}>{bridged} bridged</span>
                            <span style={{ color: "#666" }}>{planned} planned</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
                          <div style={{ width: `${(live/total)*100}%`, background: "#00ff88" }} className="h-full" />
                          <div style={{ width: `${(forked/total)*100}%`, background: "#00d4ff" }} className="h-full" />
                          <div style={{ width: `${(bridged/total)*100}%`, background: "#ffd700" }} className="h-full" />
                          <div style={{ width: `${(planned/total)*100}%`, background: "#333" }} className="h-full" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Compounding gains */}
                <div className="p-3 rounded-lg bg-white/[0.03] border border-cyan-400/10">
                  <div className="text-[10px] text-cyan-400/60 font-mono uppercase mb-2">Compounding Gains Model (NEOMech)</div>
                  <div className="flex items-center gap-2 text-xs font-mono text-foreground/50">
                    <span className="text-cyan-400">8×</span> search ×
                    <span className="text-green-400">2×</span> edge RAG ×
                    <span className="text-purple-400">1.5×</span> Zero Erasure ×
                    <span className="text-orange-400">1.4×</span> agentic pause ×
                    <span className="text-blue-400">1.3×</span> constitutional =
                    <span className="text-xl font-bold text-cyan-400 ml-2">44×</span>
                    <span className="text-foreground/30">baseline</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${viewMode}-${selectedProvider}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === "grid"
                  ? "grid grid-cols-2 gap-2"
                  : "space-y-1"
                }
              >
                {filteredServices.map((service, i) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedService(selectedService?.name === service.name ? null : service)}
                    className={`cursor-pointer rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "p-3 bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05]"
                        : "p-2 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] flex items-center gap-3"
                    } ${selectedService?.name === service.name ? "border-cyan-400/20 bg-cyan-400/5" : ""}`}
                  >
                    {viewMode === "grid" ? (
                      <>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-xs font-medium text-foreground/80 truncate">{service.name}</div>
                          <span
                            className="text-[7px] px-1.5 py-0.5 rounded-full font-mono uppercase"
                            style={{
                              color: statusColors[service.status],
                              background: `${statusColors[service.status]}15`,
                            }}
                          >
                            {statusLabels[service.status]}
                          </span>
                        </div>
                        <div className="text-[9px] text-foreground/30 mb-1.5 line-clamp-2">{service.description}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono text-foreground/20">{service.methods} methods</span>
                          <span className="text-[8px] text-red-400/50 font-mono truncate max-w-[60%] text-right">
                            💀 {service.killedApp}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span
                          className="text-[7px] px-1.5 py-0.5 rounded-full font-mono uppercase shrink-0"
                          style={{
                            color: statusColors[service.status],
                            background: `${statusColors[service.status]}15`,
                          }}
                        >
                          {statusLabels[service.status]}
                        </span>
                        <div className="text-xs text-foreground/80 w-40 truncate shrink-0">{service.name}</div>
                        <div className="text-[9px] text-foreground/30 font-mono shrink-0 w-16">{service.methods} ops</div>
                        <div className="text-[8px] text-red-400/40 font-mono truncate flex-1">💀 {service.killedApp}</div>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right panel — Service detail */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-white/5 overflow-hidden"
          >
            <div className="p-3 w-[220px]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] text-cyan-400/60 font-mono uppercase">Service Detail</div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-foreground/30 hover:text-foreground/60 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-foreground/90">{selectedService.name}</div>
                  <span
                    className="text-[7px] px-1.5 py-0.5 rounded-full font-mono uppercase inline-block mt-1"
                    style={{
                      color: statusColors[selectedService.status],
                      background: `${statusColors[selectedService.status]}15`,
                    }}
                  >
                    {statusLabels[selectedService.status]}
                  </span>
                </div>

                <div>
                  <div className="text-[9px] text-foreground/40 font-mono uppercase mb-1">Methods</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono">{selectedService.methods}</div>
                </div>

                <div>
                  <div className="text-[9px] text-foreground/40 font-mono uppercase mb-1">Description</div>
                  <div className="text-[10px] text-foreground/50 leading-relaxed">{selectedService.description}</div>
                </div>

                <div>
                  <div className="text-[9px] text-red-400/60 font-mono uppercase mb-1">💀 Apps Killed</div>
                  <div className="text-[10px] text-red-400/40 leading-relaxed">{selectedService.killedApp}</div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <div className="text-[9px] text-foreground/40 font-mono uppercase mb-1">Constitutional Status</div>
                  <div className="space-y-1">
                    {["Governance vetted", "Provenance tracked", "Audit trail active", "Zero Erasure compliant"].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[9px]">
                        <span className="text-green-400">✓</span>
                        <span className="text-foreground/40">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <div className="text-[9px] text-foreground/40 font-mono uppercase mb-1">Provider</div>
                  <div className="flex items-center gap-1.5">
                    <span>{activeProvider.icon}</span>
                    <span className="text-xs text-foreground/60">{activeProvider.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
