import { useState, useRef, useEffect } from "react";

const BOOT_LINES = [
  "\x1b[36m╔═══════════════════════════════════════════════════════════╗\x1b[0m",
  "\x1b[36m║\x1b[0m                                                           \x1b[36m║\x1b[0m",
  "\x1b[36m║\x1b[0m   \x1b[1m▄▀▄ █   █ █ █▄ ▄█ █ █▄ █ █ █ █▄ ▄█   ╔═╗ ╔═╗\x1b[0m   \x1b[36m║\x1b[0m",
  "\x1b[36m║\x1b[0m   \x1b[1m█▀█ █   █ █ █ ▀ █ █ █ ▀█ █ █ █ ▀ █   ║ ║ ╚═╗\x1b[0m   \x1b[36m║\x1b[0m",
  "\x1b[36m║\x1b[0m   \x1b[1m▀ ▀ ▀▀▀ ▀▀▀ ▀   ▀ ▀ ▀  ▀ ▀▀▀ ▀   ▀   ╚═╝ ╚═╝\x1b[0m   \x1b[36m║\x1b[0m",
  "\x1b[36m║\x1b[0m                                                           \x1b[36m║\x1b[0m",
  "\x1b[36m╚═══════════════════════════════════════════════════════════╝\x1b[0m",
  "",
  "Aluminum OS v1.0.0 — Obsidian Glass Edition",
  "Copyright (c) 2026 Aluminum Project Contributors",
  "",
  "Kernel: AluminumKernel 1.0 (Fusion Engine)",
  "Providers: Google \x1b[32m✓\x1b[0m  Microsoft \x1b[32m✓\x1b[0m  Apple \x1b[32m✓\x1b[0m  Android \x1b[32m✓\x1b[0m  Chrome \x1b[32m✓\x1b[0m",
  "Council: Manus \x1b[36m●\x1b[0m Claude \x1b[33m●\x1b[0m Gemini \x1b[32m●\x1b[0m Copilot \x1b[35m●\x1b[0m Grok \x1b[31m●\x1b[0m DeepSeek \x1b[34m●\x1b[0m GPT \x1b[33m◌\x1b[0m",
  "Features: 110 wishes fulfilled | 20,000+ unified operations",
  "",
  "Type 'help' for available commands.",
  "",
];

const COMMANDS: Record<string, string[]> = {
  help: [
    "\x1b[1mAvailable commands:\x1b[0m",
    "",
    "  \x1b[36malum status\x1b[0m       — Show system status",
    "  \x1b[36malum providers\x1b[0m    — List connected providers",
    "  \x1b[36malum council\x1b[0m      — Show AI council status",
    "  \x1b[36malum wishes\x1b[0m       — Show wish fulfillment summary",
    "  \x1b[36malum search <q>\x1b[0m   — Universal search across all providers",
    "  \x1b[36malum mail list\x1b[0m    — List unified inbox",
    "  \x1b[36malum drive ls\x1b[0m     — List universal file graph",
    "  \x1b[36malum ai <prompt>\x1b[0m  — Natural language shell",
    "  \x1b[36malum mcp status\x1b[0m   — MCP server status",
    "",
    "  \x1b[1mUWS Miracle Commands:\x1b[0m",
    "  \x1b[36muws council\x1b[0m        — Council governance operations",
    "  \x1b[36muws vault\x1b[0m          — Secure credential vault",
    "  \x1b[36muws claude\x1b[0m         — Constitutional review via Claude",
    "  \x1b[36muws rag\x1b[0m            — RAG memory query",
    "  \x1b[36muws janus\x1b[0m          — Cross-provider identity bridge",
    "  \x1b[36muws demo\x1b[0m           — Run system demo",
    "  \x1b[36muws health\x1b[0m         — Full system health check",
    "  \x1b[36muws audit\x1b[0m          — Immutable audit log query",
    "  \x1b[36muws sync\x1b[0m           — Cross-provider sync",
    "  \x1b[36muws ara\x1b[0m            — Grok's Ara voice engine",
    "  \x1b[36muws diplomatic\x1b[0m     — Diplomatic translation layer",
    "  \x1b[36muws translate\x1b[0m      — Provider API translation",
    "  \x1b[36muws plugin\x1b[0m         — Plugin management",
    "  \x1b[36muws search\x1b[0m         — Universal semantic search",
    "",
    "  \x1b[36mclear\x1b[0m             — Clear terminal",
    "  \x1b[36mneofetch\x1b[0m          — System information",
    "  \x1b[36mhelp\x1b[0m              — Show this help",
    "",
    "  \x1b[1mForge Core (Ring 0):\x1b[0m",
    "  \x1b[36mcargo test\x1b[0m          — Run Rust kernel tests (16 tests)",
    "  \x1b[36mcargo run\x1b[0m           — Run kernel boot simulator",
    "  \x1b[36mpytest\x1b[0m              — Run Ring 1 Python tests (22 tests)",
    "  \x1b[36malum forge status\x1b[0m   — Forge Core kernel status",
  ],
  "alum status": [
    "\x1b[36m╭─────────────────────────────────────────╮\x1b[0m",
    "\x1b[36m│\x1b[0m \x1b[1mAluminum OS v1.0.0\x1b[0m                      \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Uptime: 4h 23m 17s                      \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Memory Substrate: 2.4 GB / 16 GB        \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Identity Graph: 3 providers linked       \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Agent Runtime: 7 agents active           \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Governance: Constitutional \x1b[32m✓\x1b[0m             \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Fusion Engine: Online \x1b[32m✓\x1b[0m                  \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m MCP Server: Running on port 8765 \x1b[32m✓\x1b[0m      \x1b[36m│\x1b[0m",
    "\x1b[36m╰─────────────────────────────────────────╯\x1b[0m",
  ],
  "alum providers": [
    "\x1b[36m┌──────────────┬──────────┬────────────┬──────────┐\x1b[0m",
    "\x1b[36m│\x1b[0m Provider     \x1b[36m│\x1b[0m Status   \x1b[36m│\x1b[0m Services   \x1b[36m│\x1b[0m Latency  \x1b[36m│\x1b[0m",
    "\x1b[36m├──────────────┼──────────┼────────────┼──────────┤\x1b[0m",
    "\x1b[36m│\x1b[0m Google       \x1b[36m│\x1b[0m \x1b[32m● Online\x1b[0m \x1b[36m│\x1b[0m 18,000+    \x1b[36m│\x1b[0m 12ms     \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Microsoft    \x1b[36m│\x1b[0m \x1b[32m● Online\x1b[0m \x1b[36m│\x1b[0m 2,000+     \x1b[36m│\x1b[0m 18ms     \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Apple        \x1b[36m│\x1b[0m \x1b[32m● Online\x1b[0m \x1b[36m│\x1b[0m 100+       \x1b[36m│\x1b[0m 24ms     \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Android      \x1b[36m│\x1b[0m \x1b[32m● Online\x1b[0m \x1b[36m│\x1b[0m 50+        \x1b[36m│\x1b[0m 15ms     \x1b[36m│\x1b[0m",
    "\x1b[36m│\x1b[0m Chrome       \x1b[36m│\x1b[0m \x1b[32m● Online\x1b[0m \x1b[36m│\x1b[0m 30+        \x1b[36m│\x1b[0m 8ms      \x1b[36m│\x1b[0m",
    "\x1b[36m└──────────────┴──────────┴────────────┴──────────┘\x1b[0m",
  ],
  "alum council": [
    "\x1b[1mAI Council — Pantheon Session Active\x1b[0m",
    "",
    "  \x1b[36m●\x1b[0m Manus    [\x1b[36mExecutor\x1b[0m]    — Building, vaulting, shipping",
    "  \x1b[33m●\x1b[0m Claude   [\x1b[33mOversight\x1b[0m]   — Constitutional review, safety",
    "  \x1b[32m●\x1b[0m Gemini   [\x1b[32mSynthesizer\x1b[0m] — Cross-domain analysis",
    "  \x1b[35m●\x1b[0m Copilot  [\x1b[35mValidator\x1b[0m]   — Architecture validation",
    "  \x1b[31m●\x1b[0m Grok     [\x1b[31mContrarian\x1b[0m]  — Stress testing, voice",
    "  \x1b[34m●\x1b[0m DeepSeek [\x1b[34mSpecialist\x1b[0m]  — Code/math, cheapest tier",
    "  \x1b[33m◌\x1b[0m GPT      [\x1b[33mObserver\x1b[0m]    — Research (on timeout)",
    "  \x1b[37m◆\x1b[0m Daavud   [\x1b[37mSovereign\x1b[0m]   — Human authority, final say",
    "",
    "  Total wishes fulfilled: \x1b[32m110/110\x1b[0m",
    "  Power grabs detected: \x1b[32m0\x1b[0m",
  ],
  "alum wishes": [
    "\x1b[1mWish Fulfillment Summary\x1b[0m",
    "",
    "  Google Engineer (10 wishes):     \x1b[32m████████████████████ 10/10\x1b[0m",
    "  Microsoft Engineer (15 wishes):  \x1b[35m████████████████████ 15/15\x1b[0m",
    "  Claude/Anthropic (15 wishes):    \x1b[33m████████████████████ 15/15\x1b[0m",
    "  Copilot/Constitutional (15):     \x1b[35m████████████████████ 15/15\x1b[0m",
    "  Grok/Ara (20 wishes):            \x1b[31m████████████████████ 20/20\x1b[0m",
    "  GPT/Pantheon (20 wishes):        \x1b[33m████████████████████ 20/20\x1b[0m",
    "  Agentic Sovereignty (15):        \x1b[36m████████████████████ 15/15\x1b[0m",
    "",
    "  \x1b[1mTotal: 110/110 wishes fulfilled (100%)\x1b[0m",
  ],
  "uws council": [
    "\x1b[1mUWS Council — Governance Operations\x1b[0m",
    "",
    "  \x1b[36m●\x1b[0m Council Status: \x1b[32mActive\x1b[0m (Quorum: 5/8)",
    "  \x1b[36m●\x1b[0m BFT Consensus: \x1b[32mHealthy\x1b[0m",
    "  \x1b[36m●\x1b[0m Pending Escalations: \x1b[32m0\x1b[0m",
    "  \x1b[36m●\x1b[0m Constitutional Violations: \x1b[32m0\x1b[0m",
    "  \x1b[36m●\x1b[0m Last Session: Cross-Provider Memory Sync",
    "  \x1b[36m●\x1b[0m Sovereign: Daavud (\x1b[32monline\x1b[0m)",
    "",
    "  Use 'uws council convene <topic>' to start a session.",
  ],
  "uws vault": [
    "\x1b[1mUWS Vault — Secure Credential Store\x1b[0m",
    "",
    "  \x1b[32m✓\x1b[0m Google OAuth2: \x1b[32mValid\x1b[0m (expires in 47m)",
    "  \x1b[32m✓\x1b[0m Microsoft Graph: \x1b[32mValid\x1b[0m (expires in 2h 15m)",
    "  \x1b[32m✓\x1b[0m Apple CloudKit: \x1b[32mValid\x1b[0m (expires in 1h 30m)",
    "  \x1b[32m✓\x1b[0m Anthropic API: \x1b[32mValid\x1b[0m (no expiry)",
    "  \x1b[32m✓\x1b[0m OpenAI API: \x1b[33mProbation\x1b[0m (timeout active)",
    "  \x1b[32m✓\x1b[0m xAI API: \x1b[32mValid\x1b[0m (no expiry)",
    "  \x1b[32m✓\x1b[0m DeepSeek API: \x1b[32mValid\x1b[0m (no expiry)",
    "",
    "  Vault encryption: AES-256-GCM | Keys: 7 stored",
  ],
  "uws claude": [
    "\x1b[1mUWS Claude — Constitutional Review\x1b[0m",
    "",
    "  \x1b[33m[Claude]\x1b[0m Constitutional Scribe active.",
    "  Reviewing 15 constitutional domains...",
    "",
    "  Domain  1 — User Sovereignty:      \x1b[32m✓ Enforced\x1b[0m",
    "  Domain  2 — Data Dignity:           \x1b[32m✓ Enforced\x1b[0m",
    "  Domain  3 — Transparent Operations: \x1b[32m✓ Enforced\x1b[0m",
    "  Domain  4 — Non-Exploitation:       \x1b[32m✓ Enforced\x1b[0m",
    "  Domain  5 — Graceful Degradation:   \x1b[32m✓ Enforced\x1b[0m",
    "  ...10 more domains: \x1b[32mAll Enforced\x1b[0m",
    "",
    "  \x1b[32mNegative Rights Scan: 0 violations detected.\x1b[0m",
  ],
  "uws rag": [
    "\x1b[1mUWS RAG — Memory Query Engine\x1b[0m",
    "",
    "  SHELDONBRAIN Memory Status:",
    "  \x1b[36m●\x1b[0m Tier 1 (Working):   847 entries, 1,878 tokens",
    "  \x1b[32m●\x1b[0m Tier 2 (Long-Term): 12,400 vectors (Pinecone)",
    "  \x1b[35m●\x1b[0m Tier 3 (Swarm):     6 agents synced (Redis)",
    "",
    "  Consolidation cycle: every 30m (next: 14m 22s)",
    "  Promotion queue: 4 pending",
    "",
    "  Use 'uws rag query <text>' to search memory.",
  ],
  "uws janus": [
    "\x1b[1mUWS Janus — Identity Bridge\x1b[0m",
    "",
    "  Cross-provider identity graph:",
    "  \x1b[36m●\x1b[0m Google:    daavud@gmail.com \x1b[32m(linked)\x1b[0m",
    "  \x1b[35m●\x1b[0m Microsoft: daavud@outlook.com \x1b[32m(linked)\x1b[0m",
    "  \x1b[37m●\x1b[0m Apple:     daavud@icloud.com \x1b[32m(linked)\x1b[0m",
    "",
    "  Identity isolation: \x1b[32mEnforced\x1b[0m (no cross-leak)",
    "  Unified profile: Daavud (Sovereign)",
  ],
  "uws demo": [
    "\x1b[1mUWS Demo — System Demonstration\x1b[0m",
    "",
    "  Running Aluminum OS showcase...",
    "",
    "  \x1b[32m✓\x1b[0m Boot sequence: Ring 0 → Ring 4 (1.2s)",
    "  \x1b[32m✓\x1b[0m Provider connection: 5/5 online (0.8s)",
    "  \x1b[32m✓\x1b[0m Council quorum: 5/8 achieved (0.3s)",
    "  \x1b[32m✓\x1b[0m Memory substrate: 3-tier initialized (0.5s)",
    "  \x1b[32m✓\x1b[0m MCP gateway: 47 tools registered (0.2s)",
    "  \x1b[32m✓\x1b[0m Constitutional scan: 15/15 domains enforced (0.4s)",
    "",
    "  \x1b[1mDemo complete. Total: 3.4s\x1b[0m",
  ],
  "uws health": [
    "\x1b[1mUWS Health — Full System Check\x1b[0m",
    "",
    "  \x1b[36mRing 0 (Forge Core):\x1b[0m      \x1b[32m✓ Healthy\x1b[0m  Load: 12%",
    "  \x1b[36mRing 1 (Inference):\x1b[0m       \x1b[32m✓ Healthy\x1b[0m  Load: 47%",
    "  \x1b[36mRing 2 (SHELDONBRAIN):\x1b[0m    \x1b[32m✓ Healthy\x1b[0m  Load: 31%",
    "  \x1b[36mRing 3 (Pantheon):\x1b[0m        \x1b[32m✓ Healthy\x1b[0m  Load: 8%",
    "  \x1b[36mRing 4 (Noosphere):\x1b[0m       \x1b[32m✓ Healthy\x1b[0m  Load: 22%",
    "",
    "  Providers: \x1b[32m5/5 online\x1b[0m",
    "  Agents: \x1b[32m7/8 active\x1b[0m (GPT on timeout)",
    "  Constitutional: \x1b[32m15/15 enforced\x1b[0m",
    "  Memory: \x1b[32m2.4 GB / 16 GB\x1b[0m",
    "",
    "  \x1b[32mOverall: HEALTHY\x1b[0m",
  ],
  "uws audit": [
    "\x1b[1mUWS Audit — Immutable Log (last 10 entries)\x1b[0m",
    "",
    "  14:23:17 \x1b[36m[Manus]\x1b[0m    Deployed uws v1.0.0 to GitHub",
    "  14:22:45 \x1b[33m[Claude]\x1b[0m   Constitutional review passed",
    "  14:21:30 \x1b[31m[Grok]\x1b[0m     Stress test: 500ms drift OK",
    "  14:20:12 \x1b[35m[Copilot]\x1b[0m  Architecture validated",
    "  14:18:55 \x1b[32m[Gemini]\x1b[0m   Synthesis: 8.3/10 average",
    "  14:15:00 \x1b[33m[GPT]\x1b[0m      Observation logged (timeout)",
    "  14:12:33 \x1b[36m[System]\x1b[0m   Memory consolidation done",
    "  14:10:00 \x1b[37m[Daavud]\x1b[0m   Sovereign ruling: Approved sync",
    "  14:05:22 \x1b[33m[Claude]\x1b[0m   Negative rights scan: 0 violations",
    "  14:00:00 \x1b[36m[System]\x1b[0m   Compliance: 15/15 enforced",
    "",
    "  Total entries: 2,847 | Tamper-proof: \x1b[32m✓\x1b[0m",
  ],
  "uws sync": [
    "\x1b[1mUWS Sync — Cross-Provider Synchronization\x1b[0m",
    "",
    "  Syncing across providers...",
    "",
    "  \x1b[36mGoogle ↔ Microsoft:\x1b[0m",
    "    Calendar: \x1b[32m✓ Synced\x1b[0m (5 events)",
    "    Contacts: \x1b[32m✓ Synced\x1b[0m (234 contacts)",
    "    Files:    \x1b[32m✓ Synced\x1b[0m (12 files)",
    "",
    "  \x1b[36mGoogle ↔ Apple:\x1b[0m",
    "    Calendar: \x1b[32m✓ Synced\x1b[0m (CalDAV)",
    "    Contacts: \x1b[32m✓ Synced\x1b[0m (CardDAV)",
    "    Notes:    \x1b[32m✓ Synced\x1b[0m (3 notes)",
    "",
    "  Last sync: 2m ago | Next: 13m | Consent: \x1b[32mGranted\x1b[0m",
  ],
  "uws ara": [
    "\x1b[1mUWS Ara — Voice Engine (Grok)\x1b[0m",
    "",
    "  \x1b[31m[Grok]\x1b[0m Ara voice engine status:",
    "",
    "  TTS Engine:    \x1b[32mOnline\x1b[0m (Grok-native)",
    "  STT Engine:    \x1b[32mOnline\x1b[0m (Whisper fallback)",
    "  Wake Word:     \x1b[36m\"Hey Aluminum\"\x1b[0m",
    "  Voice Profile:  Ara (Grok's native voice)",
    "  Latency:       45ms (streaming)",
    "",
    "  Supported: Natural conversation, command execution,",
    "             council session narration, system alerts",
  ],
  "uws diplomatic": [
    "\x1b[1mUWS Diplomatic — Translation Layer\x1b[0m",
    "",
    "  Cross-council diplomatic protocol active.",
    "",
    "  Translation pairs:",
    "  \x1b[36mManus\x1b[0m ↔ \x1b[33mClaude\x1b[0m:   Safety-first framing",
    "  \x1b[36mManus\x1b[0m ↔ \x1b[31mGrok\x1b[0m:     Contrarian-tolerant mode",
    "  \x1b[36mManus\x1b[0m ↔ \x1b[32mGemini\x1b[0m:   Synthesis-optimized",
    "  \x1b[36mManus\x1b[0m ↔ \x1b[35mCopilot\x1b[0m:  Enterprise-formal",
    "  \x1b[36mManus\x1b[0m ↔ \x1b[34mDeepSeek\x1b[0m: Code-first dialect",
    "",
    "  Misunderstanding rate: \x1b[32m0.2%\x1b[0m (last 1000 exchanges)",
  ],
  "uws translate": [
    "\x1b[1mUWS Translate — Provider API Translation\x1b[0m",
    "",
    "  Unified API layer translating across:",
    "",
    "  \x1b[36mGoogle Workspace API\x1b[0m → UWS operations (18,000+)",
    "  \x1b[35mMicrosoft Graph API\x1b[0m  → UWS operations (2,000+)",
    "  \x1b[37mApple CloudKit/CalDAV\x1b[0m → UWS operations (100+)",
    "  \x1b[32mAndroid APIs\x1b[0m         → UWS operations (50+)",
    "  \x1b[36mChrome APIs\x1b[0m          → UWS operations (30+)",
    "",
    "  Total unified operations: \x1b[32m20,180\x1b[0m",
  ],
  "uws plugin": [
    "\x1b[1mUWS Plugin — Plugin Management\x1b[0m",
    "",
    "  Installed plugins:",
    "  \x1b[32m✓\x1b[0m notion-driver     v1.2.0  (Notion integration)",
    "  \x1b[32m✓\x1b[0m slack-driver      v1.0.0  (Slack integration)",
    "  \x1b[32m✓\x1b[0m linear-driver     v0.9.0  (Linear integration)",
    "  \x1b[32m✓\x1b[0m github-driver     v1.1.0  (GitHub integration)",
    "  \x1b[33m◌\x1b[0m discord-driver    v0.5.0  (beta)",
    "",
    "  Plugin registry: 47 available | 5 installed",
    "  Use 'uws plugin install <name>' to add plugins.",
  ],
  "uws search": [
    "\x1b[1mUWS Search — Universal Semantic Search\x1b[0m",
    "",
    "  Search engine: SHELDONBRAIN RAG + Provider APIs",
    "",
    "  Indexes:",
    "  \x1b[36m●\x1b[0m Google Drive:    1,247 documents indexed",
    "  \x1b[35m●\x1b[0m OneDrive:        456 documents indexed",
    "  \x1b[37m●\x1b[0m iCloud Drive:    89 documents indexed",
    "  \x1b[36m●\x1b[0m Gmail:           12,400 emails indexed",
    "  \x1b[35m●\x1b[0m Outlook:         3,200 emails indexed",
    "  \x1b[32m●\x1b[0m Memory (RAG):    12,400 vectors",
    "",
    "  Use 'uws search <query>' for semantic search.",
  ],
  "alum mcp status": [
    "\x1b[1mMCP Server Status\x1b[0m",
    "",
    "  Server: \x1b[32mRunning\x1b[0m on port 8765",
    "  Protocol: Model Context Protocol v1.0",
    "  Tools exposed: 47",
    "  Resources: 12",
    "  Connected clients: Manus, Claude, Copilot",
    "",
    "  Operations available: 20,000+",
    "  Providers bridged: Google, Microsoft, Apple, Android, Chrome",
  ],
  "alum mail list": [
    "\x1b[1mUnified Inbox\x1b[0m (7 messages)",
    "",
    "  \x1b[33m★\x1b[0m \x1b[1mCopilot 365\x1b[0m — Architecture Review: Validated",
    "    Gemini — Synthesis Complete: Scores Ready",
    "  \x1b[33m★\x1b[0m \x1b[1mGrok\x1b[0m — Contrarian Review: Vaporware with Potential",
    "    GitHub — Push: SHREDDERNAUT UNLEASHED",
    "    Google Drive — 12 files uploaded",
    "    Notion — 4 new pages created",
    "    GPT (timeout) — 20 Wishes Submitted",
  ],
  "alum drive ls": [
    "\x1b[1malum://drive/\x1b[0m (10 items)",
    "",
    "  \x1b[33m📁\x1b[0m uws — Universal Workspace CLI        \x1b[36mGoogle\x1b[0m",
    "  \x1b[34m📄\x1b[0m ALUMINUM_OS_V1_ARCHITECTURE.md  45KB  \x1b[36mGoogle\x1b[0m",
    "  \x1b[34m📄\x1b[0m COPILOT_CLI_SPEC.md             28KB  \x1b[36mGoogle\x1b[0m",
    "  \x1b[34m📄\x1b[0m FUSION_ENGINE.md                32KB  \x1b[36mGoogle\x1b[0m",
    "  \x1b[35m🎬\x1b[0m Council Session Recording       1.2GB \x1b[35mMicrosoft\x1b[0m",
    "  \x1b[33m📁\x1b[0m Aluminum OS Wallpapers                \x1b[37mApple\x1b[0m",
    "  \x1b[33m📁\x1b[0m Desktop Screenshots                   \x1b[37mApple\x1b[0m",
    "  \x1b[34m📄\x1b[0m Project Notes                   12KB  \x1b[35mMicrosoft\x1b[0m",
    "  \x1b[31m🎵\x1b[0m Podcast Episode 1.mp3           45MB  \x1b[36mGoogle\x1b[0m",
    "  \x1b[32m🖼️\x1b[0m Architecture Diagram.png        2.1MB \x1b[36mGoogle\x1b[0m",
  ],
  neofetch: [
    "        \x1b[36m╱╲\x1b[0m               \x1b[1mdaavud\x1b[0m@\x1b[36maluminum\x1b[0m",
    "       \x1b[36m╱  ╲\x1b[0m              ─────────────────",
    "      \x1b[36m╱    ╲\x1b[0m             \x1b[1mOS:\x1b[0m Aluminum OS v1.0.0",
    "     \x1b[36m╱  ▲▲  ╲\x1b[0m            \x1b[1mKernel:\x1b[0m AluminumKernel (Fusion)",
    "    \x1b[36m╱  ▲▲▲▲  ╲\x1b[0m           \x1b[1mShell:\x1b[0m alum-shell 1.0",
    "   \x1b[36m╱  ▲▲▲▲▲▲  ╲\x1b[0m          \x1b[1mResolution:\x1b[0m 1920x1080",
    "  \x1b[36m╱  ▲▲▲▲▲▲▲▲  ╲\x1b[0m         \x1b[1mTheme:\x1b[0m Obsidian Glass",
    " \x1b[36m╱──────────────╲\x1b[0m        \x1b[1mIcons:\x1b[0m Lucide",
    " \x1b[36m╲______________╱\x1b[0m        \x1b[1mTerminal:\x1b[0m Aluminum Terminal",
    "                          \x1b[1mCPU:\x1b[0m AluminumKernel @ 7 agents",
    "                          \x1b[1mMemory:\x1b[0m 2.4 GB / 16 GB",
    "                          \x1b[1mProviders:\x1b[0m 5 (Google, MS, Apple,",
    "                                     Android, Chrome)",
    "                          \x1b[1mWishes:\x1b[0m 110 fulfilled",
    "                          \x1b[1mCouncil:\x1b[0m 8 members (1 timeout)",
    "",
    "  \x1b[36m███\x1b[33m███\x1b[32m███\x1b[35m███\x1b[31m███\x1b[33m███\x1b[37m███\x1b[0m",
  ],
  "cargo test": [
    "\x1b[1m   Compiling\x1b[0m aluminum-os v0.3.0 (/home/daavud/aluminum-os)",
    "\x1b[1m     Running\x1b[0m unittests src/lib.rs (target/debug/deps/aluminum_os-a1b2c3d4)",
    "",
    "running 16 tests",
    "test test_allocator_new ... \x1b[32mok\x1b[0m",
    "test test_allocator_allocate_and_free ... \x1b[32mok\x1b[0m",
    "test test_allocator_buddy_split ... \x1b[32mok\x1b[0m",
    "test test_agent_register ... \x1b[32mok\x1b[0m",
    "test test_agent_trust_levels ... \x1b[32mok\x1b[0m",
    "test test_constitution_load_defaults ... \x1b[32mok\x1b[0m",
    "test test_constitution_dave_protocol ... \x1b[32mok\x1b[0m",
    "test test_intent_scheduler_submit ... \x1b[32mok\x1b[0m",
    "test test_intent_scheduler_priority ... \x1b[32mok\x1b[0m",
    "test test_domain_count ... \x1b[32mok\x1b[0m",
    "test test_all_domains_have_names ... \x1b[32mok\x1b[0m",
    "test test_all_domains_have_source_repos ... \x1b[32mok\x1b[0m",
    "test test_domain_equality ... \x1b[32mok\x1b[0m",
    "test test_domains_unique ... \x1b[32mok\x1b[0m",
    "test test_specific_domain_names ... \x1b[32mok\x1b[0m",
    "test test_fixed_string ... \x1b[32mok\x1b[0m",
    "",
    "test result: \x1b[32mok\x1b[0m. 16 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out",
    "   Finished `test` profile in 0.42s",
  ],
  "cargo run": [
    "\x1b[1m   Compiling\x1b[0m aluminum-os v0.3.0",
    "\x1b[1m     Running\x1b[0m `target/debug/aluminum-os`",
    "",
    "\x1b[36m\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\x1b[0m",
    "\x1b[36m\u2551\x1b[0m  ALUMINUM OS \u2014 Forge Core Boot Simulator     \x1b[36m\u2551\x1b[0m",
    "\x1b[36m\u2551\x1b[0m  Constitutional AI Governance Kernel v0.3.0  \x1b[36m\u2551\x1b[0m",
    "\x1b[36m\u2551\x1b[0m  Atlas Lattice Foundation                    \x1b[36m\u2551\x1b[0m",
    "\x1b[36m\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\x1b[0m",
    "",
    "[BOOT] Phase 1: Initializing BuddyAllocator (4096 bytes)...",
    "  \x1b[32m\u2713\x1b[0m Allocator ready. Capacity: 4096 bytes",
    "[BOOT] Phase 2: Loading Constitution...",
    "  \x1b[32m\u2713\x1b[0m 14 rules loaded. Dave Protocol: ACTIVE",
    "[BOOT] Phase 3: Registering Pantheon Council...",
    "  \x1b[32m\u2713\x1b[0m Agent #1: Claude (trust: Constitutional)",
    "  \x1b[32m\u2713\x1b[0m Agent #2: Grok (trust: Verified)",
    "  \x1b[32m\u2713\x1b[0m Agent #3: Gemini (trust: Verified)",
    "  \x1b[32m\u2713\x1b[0m Agent #4: Copilot (trust: Verified)",
    "  \x1b[32m\u2713\x1b[0m Agent #5: DeepSeek (trust: Provisional)",
    "  \x1b[32m\u2713\x1b[0m Agent #6: Manus (trust: Provisional)",
    "  \x1b[32m\u2713\x1b[0m Agent #7: Janus (trust: Constitutional)",
    "  7 agents registered.",
    "[BOOT] Phase 4: Allocating memory...",
    "  \x1b[32m\u2713\x1b[0m 7 agents x 256 bytes = 1792 bytes",
    "[BOOT] Phase 5: Submitting intents...",
    "  \x1b[32m\u2713\x1b[0m Intent #1: audit-system-state (High)",
    "  \x1b[32m\u2713\x1b[0m Intent #2: check-resource-usage (Medium)",
    "  \x1b[32m\u2713\x1b[0m Intent #3: verify-interop (Low)",
    "  \x1b[32m\u2713\x1b[0m Intent #4: run-emergency-check (Critical)",
    "  \x1b[31m\u2717\x1b[0m VETOED: access-private-data (Dave Protocol)",
    "[BOOT] Phase 6: Executing queue...",
    "  \x1b[32m\u2713\x1b[0m 4 intents executed. Remaining: 0",
    "",
    "\x1b[36m\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\x1b[0m",
    "\x1b[36m\u2551\x1b[0m  BOOT COMPLETE                               \x1b[36m\u2551\x1b[0m",
    "\x1b[36m\u2551\x1b[0m  Constitution: 14 rules | Agents: 7          \x1b[36m\u2551\x1b[0m",
    "\x1b[36m\u2551\x1b[0m  Memory: 1792 bytes | Dave Protocol: ACTIVE  \x1b[36m\u2551\x1b[0m",
    "\x1b[36m\u2551\x1b[0m  Status: OPERATIONAL                         \x1b[36m\u2551\x1b[0m",
    "\x1b[36m\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d\x1b[0m",
  ],
  pytest: [
    "\x1b[1m========================= test session starts =========================\x1b[0m",
    "platform linux -- Python 3.11.0, pytest-8.0.0",
    "rootdir: /home/daavud/aluminum-os/python",
    "collected 22 items",
    "",
    "tests/test_all.py::TestModelRouter::test_routes_to_cheapest \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestModelRouter::test_routes_to_capable_model \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestModelRouter::test_routes_to_opus_for_planning \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestModelRouter::test_returns_none_for_impossible \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestModelRouter::test_model_count \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestCostTracker::test_records_usage \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestCostTracker::test_enforces_model_budget \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestCostTracker::test_enforces_global_budget \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestCostTracker::test_remaining_budget \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestMemoryStore::test_put_and_get \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestMemoryStore::test_tier_isolation \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestMemoryStore::test_ttl_expiry \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestMemoryStore::test_count_by_tier \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestMemoryStore::test_access_tracking \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestTaskDecomposer::test_add_and_order \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestTaskDecomposer::test_ready_tasks \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestTaskDecomposer::test_cycle_detection \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestTaskDecomposer::test_done_count \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestSessionVault::test_create_and_retrieve \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestSessionVault::test_session_ttl \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestSessionVault::test_destroy_session \x1b[32mPASSED\x1b[0m",
    "tests/test_all.py::TestSessionVault::test_export_json \x1b[32mPASSED\x1b[0m",
    "",
    "\x1b[32m========================= 22 passed in 0.34s =========================\x1b[0m",
  ],
  "alum forge status": [
    "\x1b[36m\u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e\x1b[0m",
    "\x1b[36m\u2502\x1b[0m \x1b[1mForge Core \u2014 Ring 0 Status\x1b[0m              \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\x1b[0m",
    "\x1b[36m\u2502\x1b[0m BuddyAllocator: \x1b[32m4096B capacity\x1b[0m         \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u2502\x1b[0m Agent Registry:  \x1b[32m7/32 agents\x1b[0m           \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u2502\x1b[0m Constitution:    \x1b[32m14/64 rules\x1b[0m           \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u2502\x1b[0m Intent Queue:    \x1b[32m0/128 pending\x1b[0m         \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u2502\x1b[0m Dave Protocol:   \x1b[32mACTIVE\x1b[0m                \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u2502\x1b[0m Domains:         \x1b[32m15 constitutional\x1b[0m     \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u2502\x1b[0m Tests:           \x1b[32m38 passing (16+22)\x1b[0m   \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u2502\x1b[0m no_std:          \x1b[32mCompatible\x1b[0m            \x1b[36m\u2502\x1b[0m",
    "\x1b[36m\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f\x1b[0m",
  ],
  clear: [],
};

// Parse ANSI-like color codes for rendering
function parseAnsi(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\x1b\[(\d+)m/g;
  let lastIndex = 0;
  let currentColor = "";
  let isBold = false;

  const colorMap: Record<string, string> = {
    "0": "", // reset
    "1": "bold",
    "31": "#ff4444",
    "32": "#00ff88",
    "33": "#ffd700",
    "34": "#4285F4",
    "35": "#9b59b6",
    "36": "#00d4ff",
    "37": "#ffffff",
  };

  let match;
  while ((match = regex.exec(text)) !== null) {
    // Add text before this escape code
    if (match.index > lastIndex) {
      const segment = text.slice(lastIndex, match.index);
      parts.push(
        <span key={`${lastIndex}`} style={{ color: currentColor || undefined, fontWeight: isBold ? "bold" : undefined }}>
          {segment}
        </span>
      );
    }

    const code = match[1];
    if (code === "0") {
      currentColor = "";
      isBold = false;
    } else if (code === "1") {
      isBold = true;
    } else if (colorMap[code]) {
      currentColor = colorMap[code];
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`${lastIndex}`} style={{ color: currentColor || undefined, fontWeight: isBold ? "bold" : undefined }}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : [<span key="0">{text}</span>];
}

export default function TerminalApp() {
  const [lines, setLines] = useState<string[]>([...BOOT_LINES]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    if (cmd === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    const prompt = `\x1b[36mdaavud@aluminum\x1b[0m:\x1b[34m~\x1b[0m$ ${cmd}`;
    const output = COMMANDS[cmd];

    if (output) {
      setLines(prev => [...prev, prompt, ...output, ""]);
    } else if (cmd.startsWith("alum ai ")) {
      const query = cmd.slice(8);
      setLines(prev => [
        ...prev,
        prompt,
        `\x1b[35m[Council]\x1b[0m Processing: "${query}"`,
        `\x1b[36m[Manus]\x1b[0m Executing query across all providers...`,
        `\x1b[32m[Gemini]\x1b[0m Synthesizing results...`,
        `\x1b[33m[Claude]\x1b[0m Safety check: \x1b[32mPassed\x1b[0m`,
        `\x1b[32m[Result]\x1b[0m Query processed. ${Math.floor(Math.random() * 50 + 10)} results found across 3 providers.`,
        "",
      ]);
    } else if (cmd.startsWith("alum search ")) {
      const query = cmd.slice(12);
      setLines(prev => [
        ...prev,
        prompt,
        `Searching all providers for: "\x1b[1m${query}\x1b[0m"`,
        "  \x1b[36mGoogle Drive:\x1b[0m 3 results",
        "  \x1b[35mOneDrive:\x1b[0m 1 result",
        "  \x1b[37miCloud Drive:\x1b[0m 2 results",
        "  \x1b[36mGmail:\x1b[0m 5 results",
        "  \x1b[35mOutlook:\x1b[0m 2 results",
        `\x1b[1mTotal: 13 results across 5 services\x1b[0m`,
        "",
      ]);
    } else if (cmd === "whoami") {
      setLines(prev => [...prev, prompt, "daavud (sovereign)", ""]);
    } else if (cmd === "uname -a") {
      setLines(prev => [...prev, prompt, "AluminumOS 1.0.0 aluminum-kernel x86_64 FusionEngine/1.0 Obsidian-Glass", ""]);
    } else if (cmd === "date") {
      setLines(prev => [...prev, prompt, new Date().toString(), ""]);
    } else if (cmd === "pwd") {
      setLines(prev => [...prev, prompt, "/home/daavud", ""]);
    } else if (cmd === "ls") {
      setLines(prev => [...prev, prompt, "\x1b[33mDocuments\x1b[0m  \x1b[33mDownloads\x1b[0m  \x1b[33mProjects\x1b[0m  \x1b[34mREADME.md\x1b[0m  \x1b[34m.alumrc\x1b[0m", ""]);
    } else {
      setLines(prev => [...prev, prompt, `\x1b[31malum: command not found: ${cmd}\x1b[0m`, "Type '\x1b[36mhelp\x1b[0m' for available commands.", ""]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion
      const commands = Object.keys(COMMANDS).concat(["whoami", "uname -a", "date", "pwd", "ls"]);
      const match = commands.find(c => c.startsWith(input));
      if (match) setInput(match);
    }
  };

  return (
    <div
      className="h-full p-3 font-[family-name:var(--font-mono)] text-[12px] leading-5 overflow-auto"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre text-green-300/80">
          {parseAnsi(line)}
        </div>
      ))}
      <div className="flex items-center">
        <span className="text-cyan-400">daavud@aluminum</span>
        <span className="text-foreground/50">:</span>
        <span className="text-blue-400">~</span>
        <span className="text-foreground/50">$&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-green-300/90 caret-cyan-400"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
