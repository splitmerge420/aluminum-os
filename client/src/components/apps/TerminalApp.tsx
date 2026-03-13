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
  "Council: Manus \x1b[36m●\x1b[0m Claude \x1b[33m●\x1b[0m Gemini \x1b[32m●\x1b[0m Copilot \x1b[35m●\x1b[0m Grok \x1b[31m●\x1b[0m GPT \x1b[33m◌\x1b[0m",
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
    "  \x1b[36mclear\x1b[0m             — Clear terminal",
    "  \x1b[36mneofetch\x1b[0m          — System information",
    "  \x1b[36mhelp\x1b[0m              — Show this help",
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
    "                          \x1b[1mCouncil:\x1b[0m 7 members (1 timeout)",
    "",
    "  \x1b[36m███\x1b[33m███\x1b[32m███\x1b[35m███\x1b[31m███\x1b[33m███\x1b[37m███\x1b[0m",
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
