/*
 * Aluminum Browser — Synthesized from Edge + Chrome + Safari
 * 
 * NOT a wrapper. A 4th browser that takes the best from each:
 * - Edge: Vertical tabs, AI sidebar, Collections, Split View
 * - Chrome: Tab groups, V8-class performance, Extensions ecosystem
 * - Safari: Privacy dashboard, Reader mode, Energy efficiency, Compact tabs
 * 
 * UNIQUE to Aluminum:
 * - Council AI Delegation: routes tasks to the right model per context
 * - Health-Aware Browsing: screen time, breaks, blue light, posture
 * - Constitutional Governance: browsing behavior governed by OS constitution
 * - Cross-Provider Synthesis: unified bookmarks/history across all providers
 */
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowLeft, ArrowRight, RotateCw, Lock, Star, Plus, X,
  PanelLeftOpen, PanelLeftClose, BookOpen, Shield, Eye,
  Brain, Sparkles, Heart, Clock, Sun, Moon, Zap,
  Search, ChevronDown, ChevronRight, Bookmark, Layout,
  SplitSquareHorizontal, Layers, Globe, FileText, Coffee,
  AlertTriangle, CheckCircle, Activity, Settings, MessageCircle,
  Folder, Hash, ExternalLink, Copy, Share2, Download,
} from "lucide-react";

/* ── Types ── */
interface Tab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  groupId?: string;
  isLoading: boolean;
  isPinned: boolean;
}

interface TabGroup {
  id: string;
  name: string;
  color: string;
  collapsed: boolean;
}

interface Collection {
  id: string;
  name: string;
  icon: string;
  items: { title: string; url: string; note?: string }[];
}

interface HealthStats {
  sessionMinutes: number;
  tabCount: number;
  breaksTaken: number;
  focusScore: number;
  blueLight: "low" | "medium" | "high";
  nextBreak: number; // minutes until next suggested break
}

/* ── Council Model Routing ── */
const councilModels = [
  { id: "claude", name: "Claude", color: "#ff6b35", specialty: "Research & Analysis", icon: "🔬" },
  { id: "gemini", name: "Gemini", color: "#00ff88", specialty: "Multimodal & Synthesis", icon: "💎" },
  { id: "gpt", name: "GPT", color: "#ffd700", specialty: "General & Creative", icon: "⚡" },
  { id: "copilot", name: "Copilot", color: "#9b59b6", specialty: "Code & GitHub", icon: "🤖" },
  { id: "grok", name: "Grok", color: "#ff4444", specialty: "Real-time & Social", icon: "🔥" },
  { id: "deepseek", name: "DeepSeek", color: "#4fc3f7", specialty: "Deep Technical", icon: "🔍" },
  { id: "qwen", name: "Qwen3", color: "#e040fb", specialty: "Multilingual & CJK", icon: "🌏" },
  { id: "llama", name: "LLaMA", color: "#8bc34a", specialty: "Open Source & Local", icon: "🦙" },
  { id: "mistral", name: "Mistral", color: "#ff9800", specialty: "European & Efficient", icon: "🌊" },
  { id: "amazon", name: "Nova", color: "#ff9900", specialty: "Commerce & Alexa", icon: "📦" },
];

/* ── Auto-route: which model handles which domain ── */
const domainRouting: Record<string, string> = {
  "github.com": "copilot",
  "stackoverflow.com": "copilot",
  "arxiv.org": "claude",
  "scholar.google.com": "claude",
  "pubmed.ncbi": "claude",
  "twitter.com": "grok",
  "x.com": "grok",
  "reddit.com": "grok",
  "youtube.com": "gemini",
  "docs.google.com": "gemini",
  "drive.google.com": "gemini",
  "amazon.com": "amazon",
  "aws.amazon.com": "amazon",
  "baidu.com": "qwen",
  "zhihu.com": "qwen",
  "notion.so": "gpt",
  "medium.com": "gpt",
  "huggingface.co": "deepseek",
  "pytorch.org": "deepseek",
};

function getRouteModel(url: string): typeof councilModels[0] {
  for (const [domain, modelId] of Object.entries(domainRouting)) {
    if (url.includes(domain)) return councilModels.find(m => m.id === modelId) || councilModels[2];
  }
  return councilModels[2]; // default: GPT
}

/* ── Default Data ── */
const defaultTabs: Tab[] = [
  { id: "1", title: "splitmerge420/uws", url: "github.com/splitmerge420/uws", favicon: "🔧", isLoading: false, isPinned: true },
  { id: "2", title: "Aluminum OS — Notion", url: "notion.so/aluminum-os", favicon: "📝", isLoading: false, isPinned: false, groupId: "work" },
  { id: "3", title: "Google Drive", url: "drive.google.com", favicon: "📁", isLoading: false, isPinned: false, groupId: "work" },
];

const defaultGroups: TabGroup[] = [
  { id: "work", name: "Work", color: "#00d4ff", collapsed: false },
  { id: "research", name: "Research", color: "#00ff88", collapsed: true },
  { id: "health", name: "Health", color: "#ef4444", collapsed: true },
];

const defaultCollections: Collection[] = [
  {
    id: "1", name: "Aluminum OS Architecture", icon: "🏗️",
    items: [
      { title: "Constitutional AI Governance", url: "arxiv.org/abs/2310.xxxxx", note: "Core paper on constitutional constraints" },
      { title: "Multi-Agent Systems Survey", url: "scholar.google.com/multi-agent", note: "Foundational survey" },
      { title: "FHIR R4 Specification", url: "hl7.org/fhir/R4", note: "Healthcare interop standard" },
    ]
  },
  {
    id: "2", name: "Council Member Docs", icon: "🤝",
    items: [
      { title: "Claude API Reference", url: "docs.anthropic.com", note: "Anthropic API docs" },
      { title: "Gemini API", url: "ai.google.dev", note: "Google AI docs" },
      { title: "OpenAI Platform", url: "platform.openai.com", note: "GPT API docs" },
    ]
  },
];

export default function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
  const [activeTabId, setActiveTabId] = useState("1");
  const [groups, setGroups] = useState<TabGroup[]>(defaultGroups);
  const [collections] = useState<Collection[]>(defaultCollections);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarPanel, setSidebarPanel] = useState<"tabs" | "ai" | "collections" | "privacy" | "health">("tabs");
  const [showReader, setShowReader] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string; model?: string }[]>([]);
  const [healthStats] = useState<HealthStats>({
    sessionMinutes: 47,
    tabCount: tabs.length,
    breaksTaken: 2,
    focusScore: 82,
    blueLight: "medium",
    nextBreak: 13,
  });
  const aiInputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const routedModel = getRouteModel(activeTab?.url || "");

  useEffect(() => {
    setUrlInput(activeTab?.url || "");
  }, [activeTabId, activeTab?.url]);

  const addTab = useCallback(() => {
    const id = Date.now().toString();
    setTabs(prev => [...prev, { id, title: "New Tab", url: "aluminum://newtab", favicon: "✨", isLoading: false, isPinned: false }]);
    setActiveTabId(id);
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== tabId);
      if (tabId === activeTabId && next.length > 0) {
        setActiveTabId(next[next.length - 1].id);
      }
      return next.length > 0 ? next : [{ id: "new", title: "New Tab", url: "aluminum://newtab", favicon: "✨", isLoading: false, isPinned: false }];
    });
  }, [activeTabId]);

  const navigate = useCallback((url: string) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url, title: url.split("/").pop() || url, isLoading: true } : t));
    setUrlInput(url);
    setTimeout(() => {
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isLoading: false } : t));
    }, 800);
  }, [activeTabId]);

  const handleAiSend = useCallback(() => {
    if (!aiQuery.trim()) return;
    const model = routedModel;
    setAiMessages(prev => [
      ...prev,
      { role: "user", text: aiQuery },
      { role: "ai", text: `[${model.name}] Analyzing "${activeTab?.url}" — ${model.specialty} mode active. Constitutional constraints verified. Processing with ${model.name} inference tier...`, model: model.id },
    ]);
    setAiQuery("");
  }, [aiQuery, routedModel, activeTab?.url]);

  /* ── Privacy Stats ── */
  const privacyStats = {
    trackersBlocked: 147,
    cookiesManaged: 89,
    fingerprintShield: true,
    httpsUpgrades: 34,
    dataLeaksPrevented: 3,
    privacyScore: 94,
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0e14]">
      {/* ═══ Top Chrome: URL Bar + Controls ═══ */}
      <div className="flex items-center gap-2 px-3 py-2 bg-black/30 border-b border-white/[0.06]">
        {/* Nav buttons */}
        <div className="flex items-center gap-0.5">
          <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground/40" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
            <ArrowRight className="w-4 h-4 text-foreground/40" />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors">
            <RotateCw className={`w-4 h-4 text-foreground/40 ${activeTab?.isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* URL Bar — Omnibox with AI routing indicator */}
        <div className="flex-1 flex items-center gap-2 glass rounded-xl px-3 py-1.5 border border-white/[0.06] group">
          <Lock className="w-3.5 h-3.5 text-green-400/60 flex-shrink-0" />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(urlInput); }}
            className="flex-1 bg-transparent text-xs text-foreground/70 outline-none placeholder:text-foreground/20"
            placeholder="Search or enter URL — AI-routed"
          />
          {/* Model routing badge */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0"
            style={{ background: `${routedModel.color}15`, color: routedModel.color }}
          >
            <span>{routedModel.icon}</span>
            <span>{routedModel.name}</span>
          </div>
          <Star className="w-3.5 h-3.5 text-foreground/20 hover:text-amber-400 cursor-pointer flex-shrink-0 transition-colors" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setShowReader(!showReader)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showReader ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-white/5 text-foreground/40"}`}
            title="Reader Mode (Safari)"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSplitView(!splitView)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${splitView ? "bg-purple-500/20 text-purple-400" : "hover:bg-white/5 text-foreground/40"}`}
            title="Split View (Edge)"
          >
            <SplitSquareHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setShowSidebar(true); setSidebarPanel("ai"); }}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-foreground/40 transition-colors"
            title="AI Council Sidebar"
          >
            <Brain className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setShowSidebar(true); setSidebarPanel("health"); }}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-foreground/40 transition-colors"
            title="Health Monitor"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-foreground/40 transition-colors"
          >
            {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ═══ Main Content Area ═══ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left Sidebar: Vertical Tabs (Edge) + Panels ── */}
        {showSidebar && (
          <div className="w-72 flex-shrink-0 border-r border-white/[0.06] flex flex-col bg-black/20">
            {/* Sidebar nav */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.06]">
              {[
                { id: "tabs" as const, icon: <Layers className="w-3.5 h-3.5" />, label: "Tabs" },
                { id: "ai" as const, icon: <Brain className="w-3.5 h-3.5" />, label: "AI" },
                { id: "collections" as const, icon: <Bookmark className="w-3.5 h-3.5" />, label: "Collections" },
                { id: "privacy" as const, icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy" },
                { id: "health" as const, icon: <Heart className="w-3.5 h-3.5" />, label: "Health" },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSidebarPanel(p.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-medium transition-colors ${
                    sidebarPanel === p.id
                      ? "bg-white/[0.08] text-foreground/80"
                      : "text-foreground/30 hover:text-foreground/50"
                  }`}
                  title={p.label}
                >
                  {p.icon}
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-auto scroll-container">

              {/* ── TABS PANEL (Edge vertical tabs + Chrome groups) ── */}
              {sidebarPanel === "tabs" && (
                <div className="p-2 space-y-1">
                  {/* Pinned tabs */}
                  {tabs.filter(t => t.isPinned).length > 0 && (
                    <div className="mb-2">
                      <p className="text-[9px] text-foreground/25 font-medium px-2 mb-1 uppercase tracking-wider">Pinned</p>
                      {tabs.filter(t => t.isPinned).map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTabId(tab.id)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                            tab.id === activeTabId ? "bg-white/[0.08] text-foreground/80" : "text-foreground/40 hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="text-xs flex-shrink-0">{tab.favicon}</span>
                          <span className="text-[10px] truncate flex-1">{tab.title}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tab groups (Chrome-style) */}
                  {groups.map(group => {
                    const groupTabs = tabs.filter(t => t.groupId === group.id && !t.isPinned);
                    if (groupTabs.length === 0) return null;
                    return (
                      <div key={group.id} className="mb-1">
                        <button
                          onClick={() => setGroups(prev => prev.map(g => g.id === group.id ? { ...g, collapsed: !g.collapsed } : g))}
                          className="w-full flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: group.color }} />
                          <span className="text-[10px] font-medium flex-1 text-left" style={{ color: group.color }}>{group.name}</span>
                          <span className="text-[9px] text-foreground/20">{groupTabs.length}</span>
                          <ChevronRight className={`w-3 h-3 text-foreground/20 transition-transform ${group.collapsed ? "" : "rotate-90"}`} />
                        </button>
                        {!group.collapsed && groupTabs.map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`w-full flex items-center gap-2 pl-5 pr-2 py-1.5 rounded-lg text-left transition-colors group ${
                              tab.id === activeTabId ? "bg-white/[0.08] text-foreground/80" : "text-foreground/40 hover:bg-white/[0.04]"
                            }`}
                          >
                            <span className="text-xs flex-shrink-0">{tab.favicon}</span>
                            <span className="text-[10px] truncate flex-1">{tab.title}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                              className="w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </button>
                        ))}
                      </div>
                    );
                  })}

                  {/* Ungrouped tabs */}
                  {tabs.filter(t => !t.groupId && !t.isPinned).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTabId(tab.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors group ${
                        tab.id === activeTabId ? "bg-white/[0.08] text-foreground/80" : "text-foreground/40 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-xs flex-shrink-0">{tab.favicon}</span>
                      <span className="text-[10px] truncate flex-1">{tab.title}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                        className="w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </button>
                  ))}

                  {/* New tab button */}
                  <button
                    onClick={addTab}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-foreground/20 hover:text-foreground/40 hover:bg-white/[0.04] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-[10px]">New Tab</span>
                  </button>
                </div>
              )}

              {/* ── AI COUNCIL PANEL ── */}
              {sidebarPanel === "ai" && (
                <div className="flex flex-col h-full">
                  {/* Active model indicator */}
                  <div className="px-3 py-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: `${routedModel.color}20` }}
                      >
                        {routedModel.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold" style={{ color: routedModel.color }}>{routedModel.name}</p>
                        <p className="text-[9px] text-foreground/30">{routedModel.specialty}</p>
                      </div>
                      <div className="text-[8px] text-foreground/20 px-1.5 py-0.5 rounded bg-white/[0.04]">Auto-routed</div>
                    </div>
                    <p className="text-[9px] text-foreground/25">
                      Routing based on: <span className="text-foreground/40">{activeTab?.url?.split("/")[0] || "domain"}</span>
                    </p>
                  </div>

                  {/* All models quick-switch */}
                  <div className="px-3 py-2 border-b border-white/[0.06]">
                    <p className="text-[9px] text-foreground/25 mb-1.5 uppercase tracking-wider">Council Models</p>
                    <div className="flex flex-wrap gap-1">
                      {councilModels.map(m => (
                        <button
                          key={m.id}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] transition-colors ${
                            m.id === routedModel.id
                              ? "border border-current"
                              : "bg-white/[0.03] hover:bg-white/[0.06]"
                          }`}
                          style={{ color: m.color }}
                          title={`${m.name}: ${m.specialty}`}
                        >
                          <span>{m.icon}</span>
                          <span>{m.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Chat */}
                  <div className="flex-1 overflow-auto scroll-container p-3 space-y-2">
                    {aiMessages.length === 0 && (
                      <div className="text-center py-6">
                        <Brain className="w-8 h-8 text-foreground/10 mx-auto mb-2" />
                        <p className="text-[10px] text-foreground/25">Ask the Council about this page</p>
                        <p className="text-[9px] text-foreground/15 mt-1">Auto-routed to {routedModel.name}</p>
                        <div className="mt-3 space-y-1">
                          {["Summarize this page", "Find related research", "Check for bias", "Extract key data"].map(q => (
                            <button
                              key={q}
                              onClick={() => { setAiQuery(q); }}
                              className="block w-full text-[9px] text-foreground/30 hover:text-foreground/50 py-1 px-2 rounded-md hover:bg-white/[0.04] transition-colors text-left"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {aiMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[90%] px-2.5 py-1.5 rounded-lg text-[10px] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-cyan-500/15 text-foreground/70"
                            : "bg-white/[0.04] text-foreground/60 border border-white/[0.06]"
                        }`}>
                          {msg.model && (
                            <p className="text-[8px] font-medium mb-0.5" style={{ color: councilModels.find(m => m.id === msg.model)?.color }}>
                              {councilModels.find(m => m.id === msg.model)?.icon} {councilModels.find(m => m.id === msg.model)?.name}
                            </p>
                          )}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Input */}
                  <div className="p-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 glass rounded-lg px-2.5 py-1.5">
                      <input
                        ref={aiInputRef}
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAiSend(); }}
                        placeholder={`Ask ${routedModel.name}...`}
                        className="flex-1 bg-transparent text-[10px] text-foreground/60 outline-none placeholder:text-foreground/20"
                      />
                      <button
                        onClick={handleAiSend}
                        className="w-6 h-6 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 flex items-center justify-center transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── COLLECTIONS PANEL (Edge) ── */}
              {sidebarPanel === "collections" && (
                <div className="p-3 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-semibold text-foreground/60 font-[family-name:var(--font-display)]">Collections</p>
                    <button className="text-[9px] text-cyan-400/60 hover:text-cyan-400 transition-colors">+ New</button>
                  </div>
                  {collections.map(col => (
                    <div key={col.id} className="glass rounded-lg p-2.5 border border-white/[0.04]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{col.icon}</span>
                        <p className="text-[10px] font-medium text-foreground/70 flex-1">{col.name}</p>
                        <span className="text-[9px] text-foreground/20">{col.items.length}</span>
                      </div>
                      {col.items.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => navigate(item.url)}
                          className="w-full flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.04] text-left transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-foreground/15 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-foreground/50 truncate">{item.title}</p>
                            {item.note && <p className="text-[8px] text-foreground/20 truncate">{item.note}</p>}
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* ── PRIVACY PANEL (Safari) ── */}
              {sidebarPanel === "privacy" && (
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-green-400" />
                    <p className="text-[10px] font-semibold text-foreground/60 font-[family-name:var(--font-display)]">Privacy Dashboard</p>
                  </div>

                  {/* Privacy score */}
                  <div className="glass rounded-xl p-3 border border-green-500/10 text-center">
                    <div className="text-3xl font-bold text-green-400 font-[family-name:var(--font-display)]">{privacyStats.privacyScore}</div>
                    <p className="text-[9px] text-foreground/30 mt-0.5">Privacy Score</p>
                    <div className="w-full bg-white/[0.04] rounded-full h-1.5 mt-2">
                      <div className="bg-green-400/60 h-1.5 rounded-full" style={{ width: `${privacyStats.privacyScore}%` }} />
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Trackers Blocked", value: privacyStats.trackersBlocked, icon: <Shield className="w-3.5 h-3.5" />, color: "text-red-400" },
                      { label: "Cookies Managed", value: privacyStats.cookiesManaged, icon: <Eye className="w-3.5 h-3.5" />, color: "text-amber-400" },
                      { label: "HTTPS Upgrades", value: privacyStats.httpsUpgrades, icon: <Lock className="w-3.5 h-3.5" />, color: "text-green-400" },
                      { label: "Leaks Prevented", value: privacyStats.dataLeaksPrevented, icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-orange-400" },
                    ].map(s => (
                      <div key={s.label} className="glass rounded-lg p-2 border border-white/[0.04]">
                        <div className={`${s.color} mb-1`}>{s.icon}</div>
                        <p className="text-lg font-bold text-foreground/70 font-[family-name:var(--font-display)]">{s.value}</p>
                        <p className="text-[8px] text-foreground/25">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Fingerprint shield */}
                  <div className="glass rounded-lg p-2.5 border border-white/[0.04] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-foreground/60">Fingerprint Shield</p>
                      <p className="text-[8px] text-foreground/25">Active — Canvas, WebGL, Audio randomized</p>
                    </div>
                  </div>

                  <p className="text-[8px] text-foreground/15 text-center">Governed by Constitutional Rule 11: Privacy Sovereignty</p>
                </div>
              )}

              {/* ── HEALTH PANEL ── */}
              {sidebarPanel === "health" && (
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <p className="text-[10px] font-semibold text-foreground/60 font-[family-name:var(--font-display)]">Health-Aware Browsing</p>
                  </div>

                  {/* Focus score */}
                  <div className="glass rounded-xl p-3 border border-cyan-500/10 text-center">
                    <div className="text-3xl font-bold text-cyan-400 font-[family-name:var(--font-display)]">{healthStats.focusScore}</div>
                    <p className="text-[9px] text-foreground/30 mt-0.5">Focus Score</p>
                    <div className="w-full bg-white/[0.04] rounded-full h-1.5 mt-2">
                      <div className="bg-cyan-400/60 h-1.5 rounded-full" style={{ width: `${healthStats.focusScore}%` }} />
                    </div>
                  </div>

                  {/* Health metrics */}
                  <div className="space-y-2">
                    {[
                      { label: "Session Time", value: `${healthStats.sessionMinutes}m`, icon: <Clock className="w-3.5 h-3.5" />, color: "text-blue-400", detail: "Recommended: 50m then break" },
                      { label: "Open Tabs", value: healthStats.tabCount.toString(), icon: <Layers className="w-3.5 h-3.5" />, color: "text-purple-400", detail: "Cognitive load: Low" },
                      { label: "Breaks Taken", value: healthStats.breaksTaken.toString(), icon: <Coffee className="w-3.5 h-3.5" />, color: "text-amber-400", detail: "Target: 3 per session" },
                      { label: "Blue Light", value: healthStats.blueLight, icon: <Sun className="w-3.5 h-3.5" />, color: "text-yellow-400", detail: "Night filter available" },
                    ].map(m => (
                      <div key={m.label} className="glass rounded-lg p-2.5 border border-white/[0.04] flex items-center gap-3">
                        <div className={`${m.color} flex-shrink-0`}>{m.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-foreground/50">{m.label}</p>
                            <p className="text-[11px] font-semibold text-foreground/70">{m.value}</p>
                          </div>
                          <p className="text-[8px] text-foreground/20">{m.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Next break reminder */}
                  <div className="glass rounded-lg p-3 border border-green-500/10 text-center">
                    <Coffee className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-[10px] text-foreground/50">Next break in</p>
                    <p className="text-xl font-bold text-green-400 font-[family-name:var(--font-display)]">{healthStats.nextBreak}m</p>
                    <button className="mt-2 text-[9px] text-cyan-400/60 hover:text-cyan-400 transition-colors">
                      Take a break now
                    </button>
                  </div>

                  <p className="text-[8px] text-foreground/15 text-center">Governed by INV-20: Wellness Monitoring</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Main Browser Content ── */}
        <div className={`flex-1 flex ${splitView ? "divide-x divide-white/[0.06]" : ""} overflow-hidden`}>
          {/* Primary pane */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Compact tab strip (Safari-style, for when sidebar is hidden) */}
            {!showSidebar && (
              <div className="flex items-center gap-0.5 px-2 py-1 bg-black/20 border-b border-white/[0.06] overflow-x-auto scroll-container">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap transition-colors flex-shrink-0 group ${
                      tab.id === activeTabId ? "bg-white/[0.08] text-foreground/70" : "text-foreground/30 hover:text-foreground/50"
                    }`}
                  >
                    <span className="text-xs">{tab.favicon}</span>
                    <span className="max-w-[100px] truncate">{tab.title}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                      className="w-3.5 h-3.5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </button>
                ))}
                <button onClick={addTab} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/5 flex-shrink-0">
                  <Plus className="w-3 h-3 text-foreground/30" />
                </button>
              </div>
            )}

            {/* Page content */}
            <div className="flex-1 overflow-auto scroll-container">
              {activeTab?.url === "aluminum://newtab" ? (
                /* ── New Tab Page ── */
                <div className="h-full flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4 border border-cyan-500/10">
                    <Globe className="w-8 h-8 text-cyan-400/40" />
                  </div>
                  <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-foreground/60 mb-1">Aluminum Browser</h2>
                  <p className="text-[10px] text-foreground/25 mb-6">Synthesized from Edge + Chrome + Safari — Council-delegated AI</p>

                  {/* Search bar */}
                  <div className="w-full max-w-md flex items-center gap-2 glass rounded-xl px-4 py-2.5 border border-white/[0.06] mb-8">
                    <Search className="w-4 h-4 text-foreground/20" />
                    <input
                      placeholder="Search the web or ask the Council..."
                      className="flex-1 bg-transparent text-sm text-foreground/60 outline-none placeholder:text-foreground/20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = (e.target as HTMLInputElement).value;
                          if (val) navigate(val.includes(".") ? val : `search.aluminum.os/q=${val}`);
                        }
                      }}
                    />
                  </div>

                  {/* Quick links */}
                  <div className="grid grid-cols-4 gap-4 max-w-md">
                    {[
                      { name: "GitHub", url: "github.com", icon: "🐙", color: "#f0f0f0" },
                      { name: "Notion", url: "notion.so", icon: "📝", color: "#ffffff" },
                      { name: "Google", url: "google.com", icon: "🔍", color: "#4285f4" },
                      { name: "YouTube", url: "youtube.com", icon: "▶️", color: "#ff0000" },
                      { name: "arXiv", url: "arxiv.org", icon: "📄", color: "#b31b1b" },
                      { name: "Drive", url: "drive.google.com", icon: "📁", color: "#0066da" },
                      { name: "AWS", url: "aws.amazon.com", icon: "☁️", color: "#ff9900" },
                      { name: "HuggingFace", url: "huggingface.co", icon: "🤗", color: "#ffd21e" },
                    ].map(link => (
                      <button
                        key={link.name}
                        onClick={() => navigate(link.url)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-lg border border-white/[0.06]">
                          {link.icon}
                        </div>
                        <span className="text-[9px] text-foreground/35">{link.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Council status */}
                  <div className="mt-8 flex items-center gap-1.5">
                    {councilModels.slice(0, 5).map(m => (
                      <div
                        key={m.id}
                        className="w-2 h-2 rounded-full"
                        style={{ background: m.color, boxShadow: `0 0 4px ${m.color}40` }}
                        title={`${m.name}: Online`}
                      />
                    ))}
                    <span className="text-[8px] text-foreground/15 ml-1">10 models online — Council ready</span>
                  </div>
                </div>
              ) : showReader ? (
                /* ── Reader Mode (Safari) ── */
                <div className="max-w-2xl mx-auto p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-amber-400/60" />
                    <span className="text-[9px] text-foreground/25 uppercase tracking-wider">Reader Mode</span>
                  </div>
                  <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-foreground/80 mb-2 leading-tight">
                    {activeTab?.title}
                  </h1>
                  <p className="text-[10px] text-foreground/25 mb-6">{activeTab?.url}</p>
                  <div className="text-sm text-foreground/60 leading-relaxed space-y-4">
                    <p>Reader mode strips away distractions and presents content in a clean, readable format. Inspired by Safari's reader view, optimized for Aluminum OS with constitutional wellness monitoring.</p>
                    <p>The Council AI can summarize, translate, or analyze this content. Use the AI sidebar to interact with the page through your preferred model.</p>
                    <p className="text-foreground/30 text-xs italic">Content extracted and rendered by Aluminum Browser's reader engine. Blue light filter: {healthStats.blueLight}. Session: {healthStats.sessionMinutes}m.</p>
                  </div>
                </div>
              ) : (
                /* ── Normal page render ── */
                <div className="p-6">
                  <div className="max-w-3xl mx-auto">
                    {/* GitHub-style page for the default tab */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/10">
                        <span className="text-xl">{activeTab?.favicon}</span>
                      </div>
                      <div>
                        <h1 className="text-base font-bold font-[family-name:var(--font-display)] text-foreground/90">{activeTab?.title}</h1>
                        <p className="text-[10px] text-foreground/35">{activeTab?.url}</p>
                      </div>
                    </div>

                    {/* Model routing banner */}
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 border"
                      style={{ background: `${routedModel.color}08`, borderColor: `${routedModel.color}20` }}
                    >
                      <span className="text-sm">{routedModel.icon}</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-medium" style={{ color: routedModel.color }}>
                          {routedModel.name} — {routedModel.specialty}
                        </p>
                        <p className="text-[8px] text-foreground/25">Auto-routed for this domain. Constitutional constraints active.</p>
                      </div>
                      <button
                        onClick={() => { setShowSidebar(true); setSidebarPanel("ai"); }}
                        className="text-[9px] px-2 py-1 rounded-md hover:bg-white/5 transition-colors"
                        style={{ color: routedModel.color }}
                      >
                        Ask AI
                      </button>
                    </div>

                    {activeTab?.url?.includes("github.com") && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">Public</span>
                          <span className="text-[10px] text-foreground/30">237 files</span>
                          <span className="text-[10px] text-foreground/30">47,624 lines</span>
                          <span className="text-[10px] text-foreground/30">11 commits</span>
                        </div>
                        <div className="glass rounded-xl p-4 border border-white/[0.04]">
                          <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/80 mb-2">README.md</h2>
                          <div className="text-xs text-foreground/50 space-y-2 leading-relaxed">
                            <p className="font-bold text-foreground/70">uws — Universal Workspace CLI</p>
                            <p>One CLI to rule Google Workspace, Microsoft 365, Apple iCloud, Android, and Chrome. Built in Rust. Designed for AI agents.</p>
                            <p>110 wishes fulfilled from 7 council members. 20,000+ unified operations. Constitutional governance baked in.</p>
                            <p className="text-cyan-400/60 font-[family-name:var(--font-mono)]">$ cargo install uws</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!activeTab?.url?.includes("github.com") && (
                      <div className="glass rounded-xl p-6 border border-white/[0.04] text-center">
                        <Globe className="w-8 h-8 text-foreground/10 mx-auto mb-2" />
                        <p className="text-[11px] text-foreground/40">{activeTab?.url}</p>
                        <p className="text-[9px] text-foreground/20 mt-1">Page rendered by Aluminum Browser engine</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Split view pane (Edge) */}
          {splitView && (
            <div className="flex-1 flex items-center justify-center bg-black/20 p-6">
              <div className="text-center">
                <SplitSquareHorizontal className="w-8 h-8 text-foreground/10 mx-auto mb-2" />
                <p className="text-[10px] text-foreground/30">Split View</p>
                <p className="text-[9px] text-foreground/15 mt-1">Drag a tab here or click a link</p>
                <p className="text-[8px] text-foreground/10 mt-2">Inspired by Microsoft Edge</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Bottom Status Bar ═══ */}
      <div className="flex items-center justify-between px-3 py-1 bg-black/30 border-t border-white/[0.06] text-[9px] text-foreground/25">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Secure
          </span>
          <span>{tabs.length} tabs</span>
          <span className="flex items-center gap-1">
            <Shield className="w-2.5 h-2.5" />
            {privacyStats.trackersBlocked} blocked
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" style={{ color: routedModel.color }}>
            {routedModel.icon} {routedModel.name}
          </span>
          <span className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5" />
            Focus: {healthStats.focusScore}%
          </span>
          <span className="flex items-center gap-1">
            <Coffee className="w-2.5 h-2.5" />
            Break in {healthStats.nextBreak}m
          </span>
        </div>
      </div>
    </div>
  );
}
