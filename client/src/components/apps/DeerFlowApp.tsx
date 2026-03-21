/* DeerFlowApp.tsx — DeerFlow Research Agent
 * Design: Dark terminal aesthetic with cyan/amber accents
 * Integrates DeerFlow's 17 skills, sub-agent delegation, sandbox, memory
 * Forked from bytedance/deer-flow → splitmerge420/deer-flow
 */
import { useState, useRef, useEffect, useCallback } from 'react';

// ── Skill definitions from DeerFlow's skills/public/ ──
const SKILLS = [
  { id: 'deep-research', name: 'Deep Research', icon: '🔬', status: 'active' as const, desc: 'Multi-source research with synthesis and citations', tools: ['tavily_search', 'jina_fetch', 'firecrawl'], tier: 1 },
  { id: 'github-deep-research', name: 'GitHub Research', icon: '🐙', status: 'active' as const, desc: 'Repository analysis, code review, and PR synthesis', tools: ['gh_api', 'code_search'], tier: 1 },
  { id: 'data-analysis', name: 'Data Analysis', icon: '📊', status: 'active' as const, desc: 'Statistical analysis, visualization, and insight extraction', tools: ['python_sandbox', 'pandas', 'matplotlib'], tier: 2 },
  { id: 'chart-visualization', name: 'Chart Visualization', icon: '📈', status: 'active' as const, desc: '20+ chart types: area, bar, funnel, network, mind map, fishbone', tools: ['antv_g2', 'chart_renderer'], tier: 2 },
  { id: 'frontend-design', name: 'Frontend Design', icon: '🎨', status: 'active' as const, desc: 'UI/UX design with responsive layouts and component systems', tools: ['figma_api', 'tailwind', 'react'], tier: 2 },
  { id: 'web-design-guidelines', name: 'Web Design Guidelines', icon: '📐', status: 'active' as const, desc: 'Accessibility, performance, and design system standards', tools: ['lighthouse', 'wcag_checker'], tier: 3 },
  { id: 'consulting-analysis', name: 'Consulting Analysis', icon: '💼', status: 'active' as const, desc: 'Business strategy, market analysis, and competitive intelligence', tools: ['tavily_search', 'data_analysis'], tier: 2 },
  { id: 'image-generation', name: 'Image Generation', icon: '🖼️', status: 'active' as const, desc: 'AI image creation with style control and prompt engineering', tools: ['dalle', 'stable_diffusion'], tier: 2 },
  { id: 'video-generation', name: 'Video Generation', icon: '🎬', status: 'standby' as const, desc: 'AI video synthesis from text and image prompts', tools: ['runway', 'pika'], tier: 3 },
  { id: 'podcast-generation', name: 'Podcast Generation', icon: '🎙️', status: 'active' as const, desc: 'Script writing, voice synthesis, and audio production', tools: ['tts_engine', 'audio_mixer'], tier: 3 },
  { id: 'ppt-generation', name: 'PPT Generation', icon: '📑', status: 'active' as const, desc: 'Slide deck creation with data visualization and branding', tools: ['pptx_builder', 'chart_embed'], tier: 2 },
  { id: 'skill-creator', name: 'Skill Creator', icon: '🔧', status: 'active' as const, desc: 'Meta-skill: creates new skills from natural language specs', tools: ['file_system', 'yaml_parser'], tier: 1 },
  { id: 'bootstrap', name: 'Bootstrap', icon: '🚀', status: 'active' as const, desc: 'Project scaffolding with SOUL template and conversation guide', tools: ['file_system', 'git'], tier: 3 },
  { id: 'find-skills', name: 'Find Skills', icon: '🔍', status: 'active' as const, desc: 'Discover and install community skills from registry', tools: ['skill_registry', 'npm'], tier: 3 },
  { id: 'claude-to-deerflow', name: 'Claude Migration', icon: '🔄', status: 'active' as const, desc: 'Convert Claude Code projects to DeerFlow skill format', tools: ['ast_parser', 'converter'], tier: 3 },
  { id: 'surprise-me', name: 'Surprise Me', icon: '🎲', status: 'active' as const, desc: 'Random creative task generation with serendipity engine', tools: ['random_gen', 'creativity_engine'], tier: 3 },
  { id: 'vercel-deploy', name: 'Vercel Deploy', icon: '▲', status: 'standby' as const, desc: 'One-click deployment to Vercel with domain configuration', tools: ['vercel_cli', 'dns_config'], tier: 3 },
];

// ── Sub-agent types from DeerFlow's subagent system ──
const SUBAGENTS = [
  { id: 'general-purpose', name: 'General Purpose', status: 'running', tasks: 3, maxTurns: 25, desc: 'All tools except task delegation' },
  { id: 'bash-specialist', name: 'Bash Specialist', status: 'running', tasks: 1, maxTurns: 15, desc: 'Command-line and system operations' },
  { id: 'research-agent', name: 'Research Agent', status: 'idle', tasks: 0, maxTurns: 20, desc: 'Web search, fetch, and synthesis' },
];

// ── Middleware chain from DeerFlow's lead agent ──
const MIDDLEWARES = [
  { id: 1, name: 'ThreadData', status: 'active', desc: 'Per-thread directory isolation' },
  { id: 2, name: 'Uploads', status: 'active', desc: 'File tracking and injection' },
  { id: 3, name: 'Sandbox', status: 'active', desc: 'Sandbox acquisition and lifecycle' },
  { id: 4, name: 'DanglingToolCall', status: 'active', desc: 'Orphan tool call recovery' },
  { id: 5, name: 'Summarization', status: 'standby', desc: 'Context reduction at token limits' },
  { id: 6, name: 'TodoList', status: 'active', desc: 'Plan mode task tracking' },
  { id: 7, name: 'Title', status: 'active', desc: 'Auto-generate thread titles' },
  { id: 8, name: 'Memory', status: 'active', desc: 'Async memory extraction and queue' },
  { id: 9, name: 'ViewImage', status: 'active', desc: 'Vision model image injection' },
  { id: 10, name: 'SubagentLimit', status: 'active', desc: 'Enforce MAX_CONCURRENT=3' },
  { id: 11, name: 'Clarification', status: 'active', desc: 'User interrupt via ask_clarification' },
];

// ── Research session simulation ──
interface ResearchStep {
  agent: string;
  action: string;
  detail: string;
  cost: number;
  tokens: number;
  status: 'pending' | 'running' | 'done' | 'failed';
}

const SAMPLE_RESEARCH: ResearchStep[] = [
  { agent: 'Lead Agent', action: 'Plan decomposition', detail: 'Breaking query into 4 sub-tasks via TodoList middleware', cost: 0.002, tokens: 1200, status: 'done' },
  { agent: 'Research Agent', action: 'Web search', detail: 'Tavily search: "DeerFlow vs Manus agent architecture comparison"', cost: 0.001, tokens: 800, status: 'done' },
  { agent: 'Research Agent', action: 'Deep fetch', detail: 'Jina AI readability extraction from 6 sources', cost: 0.003, tokens: 4200, status: 'done' },
  { agent: 'Bash Specialist', action: 'Code analysis', detail: 'Cloning repo, running wc -l, analyzing file structure', cost: 0.001, tokens: 600, status: 'done' },
  { agent: 'General Purpose', action: 'Synthesis', detail: 'Cross-referencing findings with memory context', cost: 0.008, tokens: 6400, status: 'done' },
  { agent: 'Memory', action: 'Fact extraction', detail: 'Extracted 8 new facts, confidence > 0.7, queued for persistence', cost: 0.002, tokens: 1100, status: 'done' },
  { agent: 'Lead Agent', action: 'Final report', detail: 'Generating structured report with citations and artifacts', cost: 0.012, tokens: 8200, status: 'done' },
];

// ── DeerFlow vs Aluminum OS comparison ──
const COMPARISON = [
  { feature: 'Architecture', deerflow: 'LangGraph + FastAPI + Next.js', aluminum: 'Ring 0-4 Kernel + Constitutional Governance', winner: 'aluminum' },
  { feature: 'Agent System', deerflow: 'Lead Agent + 2 Sub-agents', aluminum: '8-Member Council + 144 Sphere Agents', winner: 'aluminum' },
  { feature: 'Skills', deerflow: '17 public skills', aluminum: '17 DeerFlow + 8 CLI-Anything + Native', winner: 'aluminum' },
  { feature: 'Memory', deerflow: 'JSON file, LLM extraction', aluminum: 'SHELDONBRAIN 3-tier + Swarm', winner: 'aluminum' },
  { feature: 'Sandbox', deerflow: 'Local + Docker (AioSandbox)', aluminum: 'Constitutional sandbox + Ring isolation', winner: 'aluminum' },
  { feature: 'Cost Governance', deerflow: 'None', aluminum: '3-tier routing, 150% ROI mandate', winner: 'aluminum' },
  { feature: 'Constitutional Layer', deerflow: 'None', aluminum: '14 rules, 15 domains, Dave Protocol', winner: 'aluminum' },
  { feature: 'Multi-Model', deerflow: 'Single model per thread', aluminum: '8 providers, dynamic routing', winner: 'aluminum' },
  { feature: 'IM Channels', deerflow: 'Feishu, Slack, Telegram', aluminum: 'All channels + Council bridge', winner: 'tie' },
  { feature: 'MCP Integration', deerflow: 'Multi-server with OAuth', aluminum: 'UWS MCP Governance Layer', winner: 'aluminum' },
  { feature: 'Plan Mode', deerflow: 'TodoList middleware', aluminum: 'Ara delegation + Council deliberation', winner: 'aluminum' },
  { feature: 'Vision', deerflow: 'ViewImage middleware', aluminum: 'Multi-modal across all providers', winner: 'aluminum' },
  { feature: 'Community', deerflow: '30.4K stars, ByteDance', aluminum: 'Sovereign OS, provider-neutral', winner: 'aluminum' },
  { feature: 'Deployment', deerflow: 'Docker + Vercel skill', aluminum: 'Manus hosting + custom domains', winner: 'tie' },
];

export default function DeerFlowApp() {
  const [tab, setTab] = useState<'overview' | 'skills' | 'research' | 'compare'>('overview');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [researchRunning, setResearchRunning] = useState(false);
  const [researchStep, setResearchStep] = useState(0);
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const runResearch = useCallback(() => {
    setResearchRunning(true);
    setResearchStep(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setResearchStep(step);
      if (step >= SAMPLE_RESEARCH.length) {
        clearInterval(iv);
        setTimeout(() => setResearchRunning(false), 1000);
      }
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [researchStep]);

  const filteredSkills = filter === 'all' ? SKILLS : SKILLS.filter(s => s.tier === filter);
  const totalCost = SAMPLE_RESEARCH.slice(0, researchStep).reduce((s, r) => s + r.cost, 0);
  const totalTokens = SAMPLE_RESEARCH.slice(0, researchStep).reduce((s, r) => s + r.tokens, 0);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-gray-200 font-mono text-[13px]">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-cyan-900/30 bg-[#0d0d14]">
        {(['overview', 'skills', 'research', 'compare'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${tab === t ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}>
            {t === 'overview' ? '◈ Overview' : t === 'skills' ? `⚡ Skills (${SKILLS.length})` : t === 'research' ? '🔬 Research' : '⚔ vs DeerFlow'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-gray-600">Fork: splitmerge420/deer-flow</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">30.4K ★</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {/* Header */}
            <div className="border border-cyan-800/30 rounded-lg p-4 bg-gradient-to-r from-cyan-950/20 to-transparent">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🦌</span>
                <div>
                  <h2 className="text-lg font-bold text-cyan-300">DeerFlow Research Agent</h2>
                  <p className="text-xs text-gray-500">Forked from ByteDance · Integrated into Aluminum OS Ring 2</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-gray-500">Middleware Chain</div>
                  <div className="text-sm text-cyan-400">{MIDDLEWARES.filter(m => m.status === 'active').length}/{MIDDLEWARES.length} active</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                LangGraph-based super agent with sandbox execution, persistent memory, sub-agent delegation, and 17 extensible skills.
                Now operating under Aluminum OS constitutional governance with cost-optimized routing through the Council.
              </p>
            </div>

            {/* Architecture diagram */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-cyan-800/20 rounded-lg p-3 bg-[#0d0d14]">
                <div className="text-xs text-cyan-400 mb-2 font-semibold">⬡ LangGraph Server</div>
                <div className="text-[10px] text-gray-500 space-y-1">
                  <div className="flex justify-between"><span>Port</span><span className="text-cyan-300">2024</span></div>
                  <div className="flex justify-between"><span>State</span><span className="text-green-400">Integrated</span></div>
                  <div className="flex justify-between"><span>Threads</span><span className="text-gray-300">Per-session isolated</span></div>
                  <div className="flex justify-between"><span>Checkpointer</span><span className="text-gray-300">SQLite</span></div>
                </div>
              </div>
              <div className="border border-amber-800/20 rounded-lg p-3 bg-[#0d0d14]">
                <div className="text-xs text-amber-400 mb-2 font-semibold">⬡ Gateway API</div>
                <div className="text-[10px] text-gray-500 space-y-1">
                  <div className="flex justify-between"><span>Port</span><span className="text-amber-300">8001</span></div>
                  <div className="flex justify-between"><span>Routes</span><span className="text-gray-300">7 modules</span></div>
                  <div className="flex justify-between"><span>Models</span><span className="text-gray-300">Dynamic factory</span></div>
                  <div className="flex justify-between"><span>MCP</span><span className="text-gray-300">Multi-server + OAuth</span></div>
                </div>
              </div>
              <div className="border border-purple-800/20 rounded-lg p-3 bg-[#0d0d14]">
                <div className="text-xs text-purple-400 mb-2 font-semibold">⬡ Aluminum Bridge</div>
                <div className="text-[10px] text-gray-500 space-y-1">
                  <div className="flex justify-between"><span>Ring</span><span className="text-purple-300">2 (Services)</span></div>
                  <div className="flex justify-between"><span>Gov</span><span className="text-green-400">Constitutional</span></div>
                  <div className="flex justify-between"><span>Router</span><span className="text-gray-300">3-tier cost</span></div>
                  <div className="flex justify-between"><span>Council</span><span className="text-gray-300">Full access</span></div>
                </div>
              </div>
            </div>

            {/* Sub-agents */}
            <div>
              <div className="text-xs text-gray-500 mb-2 font-semibold">SUB-AGENT POOL (MAX_CONCURRENT=3)</div>
              <div className="space-y-2">
                {SUBAGENTS.map(sa => (
                  <div key={sa.id} className="flex items-center gap-3 border border-gray-800/50 rounded p-2 bg-[#0d0d14]">
                    <span className={`w-2 h-2 rounded-full ${sa.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                    <span className="text-xs text-gray-300 w-32">{sa.name}</span>
                    <span className="text-[10px] text-gray-500 flex-1">{sa.desc}</span>
                    <span className="text-[10px] text-gray-500">Tasks: <span className="text-cyan-300">{sa.tasks}</span></span>
                    <span className="text-[10px] text-gray-500">Max: <span className="text-gray-300">{sa.maxTurns}</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Middleware chain */}
            <div>
              <div className="text-xs text-gray-500 mb-2 font-semibold">MIDDLEWARE CHAIN (strict order)</div>
              <div className="flex flex-wrap gap-1">
                {MIDDLEWARES.map((mw, i) => (
                  <div key={mw.id} className="group relative">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] border ${mw.status === 'active' ? 'border-cyan-800/30 bg-cyan-950/20 text-cyan-300' : 'border-gray-800/30 bg-gray-900/20 text-gray-500'}`}>
                      <span className="text-gray-600">{mw.id}.</span>
                      <span>{mw.name}</span>
                      {i < MIDDLEWARES.length - 1 && <span className="text-gray-700 ml-1">→</span>}
                    </div>
                    <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-[10px] text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                      {mw.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory system */}
            <div className="border border-purple-800/20 rounded-lg p-3 bg-[#0d0d14]">
              <div className="text-xs text-purple-400 mb-2 font-semibold">MEMORY SYSTEM (DeerFlow + SHELDONBRAIN)</div>
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="space-y-1">
                  <div className="text-gray-500 font-semibold">DeerFlow Native</div>
                  <div className="text-gray-400">• User Context (work, personal, topOfMind)</div>
                  <div className="text-gray-400">• History (recent, earlier, longTerm)</div>
                  <div className="text-gray-400">• Facts (id, content, category, confidence)</div>
                  <div className="text-gray-400">• Debounce: 30s, Max: 100 facts</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500 font-semibold">SHELDONBRAIN Bridge</div>
                  <div className="text-gray-400">• Working Memory → DeerFlow topOfMind</div>
                  <div className="text-gray-400">• Long-term → DeerFlow longTermBackground</div>
                  <div className="text-gray-400">• Swarm Consensus → Fact confidence boost</div>
                  <div className="text-gray-400">• Council decisions → Memory injection</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ── */}
        {tab === 'skills' && (
          <div className="h-full flex">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500">Filter by tier:</span>
                {(['all', 1, 2, 3] as const).map(f => (
                  <button key={String(f)} onClick={() => setFilter(f)}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-all ${filter === f ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'text-gray-500 border-gray-800/30 hover:text-gray-300'}`}>
                    {f === 'all' ? 'All' : `Tier ${f}`}
                  </button>
                ))}
                <span className="ml-auto text-[10px] text-gray-600">{filteredSkills.length} skills</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredSkills.map(skill => (
                  <button key={skill.id} onClick={() => setSelectedSkill(skill.id)}
                    className={`text-left p-3 rounded-lg border transition-all ${selectedSkill === skill.id ? 'border-cyan-500/50 bg-cyan-950/20' : 'border-gray-800/30 bg-[#0d0d14] hover:border-gray-700/50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{skill.icon}</span>
                      <span className="text-xs text-gray-200 font-medium">{skill.name}</span>
                      <span className={`ml-auto px-1.5 py-0.5 rounded text-[9px] ${skill.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {skill.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{skill.desc}</p>
                    <div className="flex gap-1 mt-2">
                      {skill.tools.map(t => (
                        <span key={t} className="px-1 py-0.5 rounded text-[9px] bg-gray-800/50 text-gray-500">{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {selectedSkill && (() => {
              const skill = SKILLS.find(s => s.id === selectedSkill)!;
              return (
                <div className="w-64 border-l border-gray-800/30 p-4 bg-[#0d0d14] overflow-y-auto">
                  <div className="text-2xl mb-2">{skill.icon}</div>
                  <h3 className="text-sm font-bold text-cyan-300 mb-1">{skill.name}</h3>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] mb-3 ${skill.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {skill.status} · Tier {skill.tier}
                  </span>
                  <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">{skill.desc}</p>
                  <div className="text-[10px] text-gray-500 mb-1 font-semibold">TOOLS</div>
                  <div className="space-y-1 mb-3">
                    {skill.tools.map(t => (
                      <div key={t} className="px-2 py-1 rounded bg-gray-800/30 text-gray-400 text-[10px]">{t}</div>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-500 mb-1 font-semibold">COST ROUTING</div>
                  <div className="text-[10px] text-gray-400">
                    <div>Preferred: <span className="text-cyan-300">{skill.tier === 1 ? 'DeepSeek R1' : skill.tier === 2 ? 'Gemini 2.5' : 'Qwen 3'}</span></div>
                    <div>Fallback: <span className="text-gray-300">{skill.tier === 1 ? 'Claude 3.5' : skill.tier === 2 ? 'GPT-4o' : 'Claude Haiku'}</span></div>
                    <div>Est. cost: <span className="text-green-400">${skill.tier === 1 ? '0.008' : skill.tier === 2 ? '0.015' : '0.003'}/run</span></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── RESEARCH TAB ── */}
        {tab === 'research' && (
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={runResearch} disabled={researchRunning}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${researchRunning ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/40'}`}>
                {researchRunning ? '⟳ Running...' : '▶ Run Sample Research'}
              </button>
              <div className="ml-auto flex items-center gap-4 text-[10px]">
                <div><span className="text-gray-500">Cost:</span> <span className="text-green-400">${totalCost.toFixed(4)}</span></div>
                <div><span className="text-gray-500">Tokens:</span> <span className="text-cyan-300">{totalTokens.toLocaleString()}</span></div>
                <div><span className="text-gray-500">Steps:</span> <span className="text-gray-300">{researchStep}/{SAMPLE_RESEARCH.length}</span></div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2">
              {SAMPLE_RESEARCH.map((step, i) => {
                const isActive = i < researchStep;
                const isCurrent = i === researchStep - 1 && researchRunning;
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-500 ${isCurrent ? 'border-cyan-500/50 bg-cyan-950/20' : isActive ? 'border-gray-800/30 bg-[#0d0d14]' : 'border-gray-800/10 bg-[#0a0a0f] opacity-30'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isCurrent ? 'bg-cyan-500/30 text-cyan-300 animate-pulse' : isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-800/30 text-gray-600'}`}>
                      {isActive ? '✓' : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-cyan-400 font-medium">{step.agent}</span>
                        <span className="text-[10px] text-gray-500">→</span>
                        <span className="text-xs text-gray-300">{step.action}</span>
                        <span className="ml-auto text-[10px] text-green-400/70">${step.cost.toFixed(4)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
              {researchStep >= SAMPLE_RESEARCH.length && !researchRunning && (
                <div className="border border-green-800/30 rounded-lg p-3 bg-green-950/10 mt-2">
                  <div className="text-xs text-green-400 font-semibold mb-1">✓ Research Complete</div>
                  <div className="text-[10px] text-gray-400">
                    Total cost: <span className="text-green-300">${totalCost.toFixed(4)}</span> · 
                    Tokens: <span className="text-cyan-300">{totalTokens.toLocaleString()}</span> · 
                    ROI estimate: <span className="text-green-300">~340%</span> (vs manual research)
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Cost savings vs GPT-4o only: <span className="text-green-300">67%</span> via 3-tier routing (DeepSeek for decomposition, Gemini for synthesis, GPT-4o for final report only)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── COMPARE TAB ── */}
        {tab === 'compare' && (
          <div className="h-full overflow-y-auto p-4">
            <div className="border border-cyan-800/20 rounded-lg p-3 bg-[#0d0d14] mb-4">
              <h3 className="text-sm font-bold text-cyan-300 mb-1">DeerFlow → Aluminum OS Integration</h3>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                DeerFlow (ByteDance, 30.4K ★) is a powerful LangGraph-based super agent. We forked it to splitmerge420/deer-flow
                and integrated its capabilities into Ring 2 of Aluminum OS. Every DeerFlow skill now operates under constitutional
                governance with cost-optimized routing through the Council's 3-tier model system.
              </p>
            </div>

            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-gray-800/30">
                  <th className="text-left py-2 text-gray-500 font-medium">Feature</th>
                  <th className="text-left py-2 text-gray-500 font-medium">DeerFlow</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Aluminum OS</th>
                  <th className="text-center py-2 text-gray-500 font-medium w-8"></th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-gray-800/10">
                    <td className="py-2 text-gray-400 font-medium">{row.feature}</td>
                    <td className="py-2 text-gray-500">{row.deerflow}</td>
                    <td className={`py-2 ${row.winner === 'aluminum' ? 'text-cyan-300' : 'text-gray-300'}`}>{row.aluminum}</td>
                    <td className="py-2 text-center">
                      {row.winner === 'aluminum' ? <span className="text-cyan-400">◆</span> : <span className="text-gray-600">═</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 border border-cyan-800/20 rounded-lg p-3 bg-cyan-950/10">
              <div className="text-xs text-cyan-300 font-semibold mb-1">Verdict</div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                DeerFlow is an excellent research agent framework. Aluminum OS absorbs its capabilities while adding
                constitutional governance, multi-provider cost optimization, and sovereign council deliberation.
                DeerFlow becomes a powerful Ring 2 service — its 17 skills now operate under the 150% ROI mandate
                with Ara overseeing delegation authority.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
