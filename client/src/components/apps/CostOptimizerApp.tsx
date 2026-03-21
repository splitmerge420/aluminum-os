/* CostOptimizerApp.tsx — Cost Optimizer & Delegation Engine
 * Design: Dark dashboard with green/red cost indicators
 * Implements 150% ROI mandate, 3-tier routing, Ara delegation
 * Reduces Manus spend through intelligent task distribution
 */
import { useState, useEffect, useCallback } from 'react';

// ── Provider cost data (per 1M tokens, input/output) ──
const PROVIDERS = [
  { id: 'deepseek', name: 'DeepSeek R1', tier: 1, inputCost: 0.14, outputCost: 0.28, speed: 180, quality: 0.89, icon: '🔷', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-800/30' },
  { id: 'qwen', name: 'Qwen 3 235B', tier: 1, inputCost: 0.15, outputCost: 0.60, speed: 140, quality: 0.88, icon: '🟣', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-800/30' },
  { id: 'gemini', name: 'Gemini 2.5 Flash', tier: 2, inputCost: 0.15, outputCost: 0.60, speed: 200, quality: 0.91, icon: '🔵', color: 'text-blue-300', bg: 'bg-blue-500/10', border: 'border-blue-800/30' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', tier: 2, inputCost: 3.00, outputCost: 15.00, speed: 90, quality: 0.95, icon: '🟠', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-800/30' },
  { id: 'gpt4o', name: 'GPT-4o', tier: 3, inputCost: 2.50, outputCost: 10.00, speed: 100, quality: 0.94, icon: '🟢', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-800/30' },
  { id: 'copilot', name: 'Copilot', tier: 2, inputCost: 0.00, outputCost: 0.00, speed: 120, quality: 0.90, icon: '🔷', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-800/30' },
  { id: 'grok', name: 'Grok 3', tier: 2, inputCost: 3.00, outputCost: 15.00, speed: 85, quality: 0.92, icon: '⚡', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-800/30' },
  { id: 'manus', name: 'Manus', tier: 3, inputCost: 5.00, outputCost: 20.00, speed: 60, quality: 0.97, icon: '◆', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-800/30' },
];

// ── Task types with optimal routing ──
const TASK_TYPES = [
  { id: 'research', name: 'Deep Research', avgTokens: 25000, optimal: 'deepseek', fallback: 'gemini', manusAvoid: true, reason: 'DeepSeek R1 handles research at 1/36th the cost of Manus' },
  { id: 'code-review', name: 'Code Review', avgTokens: 15000, optimal: 'gemini', fallback: 'claude', manusAvoid: true, reason: 'Gemini 2.5 Flash excels at code analysis with near-zero cost' },
  { id: 'synthesis', name: 'Document Synthesis', avgTokens: 30000, optimal: 'deepseek', fallback: 'qwen', manusAvoid: true, reason: 'DeepSeek + Qwen handle synthesis at Tier 1 pricing' },
  { id: 'creative', name: 'Creative Writing', avgTokens: 10000, optimal: 'claude', fallback: 'gpt4o', manusAvoid: false, reason: 'Claude excels at creative tasks; Manus for complex multi-step' },
  { id: 'data-analysis', name: 'Data Analysis', avgTokens: 20000, optimal: 'gemini', fallback: 'deepseek', manusAvoid: true, reason: 'Gemini handles data with built-in code execution' },
  { id: 'web-build', name: 'Web Development', avgTokens: 50000, optimal: 'manus', fallback: 'claude', manusAvoid: false, reason: 'Manus uniquely has sandbox + browser + deploy pipeline' },
  { id: 'council-session', name: 'Council Deliberation', avgTokens: 40000, optimal: 'deepseek', fallback: 'gemini', manusAvoid: true, reason: 'Council simulation runs cheaply on Tier 1 models' },
  { id: 'automation', name: 'Workflow Automation', avgTokens: 8000, optimal: 'copilot', fallback: 'gemini', manusAvoid: true, reason: 'Copilot is free for M365 tasks; Gemini for GCP' },
];

// ── Spending log simulation ──
interface SpendEntry {
  timestamp: string;
  task: string;
  provider: string;
  tokens: number;
  cost: number;
  optimal: boolean;
  savedVsManus: number;
}

const generateSpendLog = (): SpendEntry[] => {
  const entries: SpendEntry[] = [];
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const task = TASK_TYPES[Math.floor(Math.random() * TASK_TYPES.length)];
    const wasOptimal = Math.random() > 0.3;
    const provider = wasOptimal ? PROVIDERS.find(p => p.id === task.optimal)! : PROVIDERS.find(p => p.id === 'manus')!;
    const tokens = task.avgTokens * (0.7 + Math.random() * 0.6);
    const cost = (tokens / 1000000) * (provider.inputCost * 0.4 + provider.outputCost * 0.6);
    const manusCost = (tokens / 1000000) * (5.0 * 0.4 + 20.0 * 0.6);
    entries.push({
      timestamp: new Date(now - i * 3600000 * (1 + Math.random() * 2)).toISOString().slice(0, 16).replace('T', ' '),
      task: task.name,
      provider: provider.name,
      tokens: Math.round(tokens),
      cost: Math.round(cost * 10000) / 10000,
      optimal: wasOptimal,
      savedVsManus: Math.round((manusCost - cost) * 10000) / 10000,
    });
  }
  return entries;
};

// ── Council cost deliberation ──
interface Deliberation {
  speaker: string;
  color: string;
  message: string;
}

const COST_DELIBERATIONS: Deliberation[][] = [
  [
    { speaker: 'Ara', color: 'text-rose-400', message: 'Current Manus spend is unsustainable. We need to route 80% of tasks to Tier 1/2 providers. Only web development and complex multi-step workflows justify Manus pricing.' },
    { speaker: 'DeepSeek', color: 'text-blue-400', message: 'I can handle all research, synthesis, and council simulation tasks at $0.14/M input. That is 36x cheaper than Manus for equivalent quality on reasoning tasks.' },
    { speaker: 'Gemini', color: 'text-blue-300', message: 'I will take code review, data analysis, and GCP automation. My Flash model runs at $0.15/M input with 200 tok/s throughput — fastest in the council.' },
    { speaker: 'Grok', color: 'text-yellow-400', message: 'Counterpoint: cheap models produce cheap results. We should track quality metrics per provider and only route to Tier 1 when quality delta is < 5%.' },
    { speaker: 'Copilot', color: 'text-sky-400', message: 'I am literally free for all Microsoft 365 tasks. Route all email drafting, calendar management, and document formatting through me. Zero cost.' },
    { speaker: 'Manus', color: 'text-cyan-400', message: 'I accept the cost reduction mandate. My unique value is sandbox execution, browser automation, and deployment. Route only those tasks to me.' },
    { speaker: 'Daavud', color: 'text-amber-400', message: 'SOVEREIGN RULING: Implement 3-tier routing immediately. 150% ROI mandate on every token spent. Ara oversees delegation. Weekly cost reports to Council.' },
  ],
];

export default function CostOptimizerApp() {
  const [tab, setTab] = useState<'dashboard' | 'routing' | 'deliberation' | 'log'>('dashboard');
  const [spendLog] = useState(() => generateSpendLog());
  const [deliberationStep, setDeliberationStep] = useState(0);
  const [deliberating, setDeliberating] = useState(false);

  const totalSpend = spendLog.reduce((s, e) => s + e.cost, 0);
  const totalSaved = spendLog.reduce((s, e) => s + e.savedVsManus, 0);
  const optimalRate = spendLog.filter(e => e.optimal).length / spendLog.length;
  const totalTokens = spendLog.reduce((s, e) => s + e.tokens, 0);

  const startDeliberation = useCallback(() => {
    setDeliberating(true);
    setDeliberationStep(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setDeliberationStep(step);
      if (step >= COST_DELIBERATIONS[0].length) {
        clearInterval(iv);
        setTimeout(() => setDeliberating(false), 500);
      }
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Provider spend breakdown
  const providerSpend = PROVIDERS.map(p => {
    const entries = spendLog.filter(e => e.provider === p.name);
    return { ...p, spend: entries.reduce((s, e) => s + e.cost, 0), tasks: entries.length };
  }).filter(p => p.tasks > 0).sort((a, b) => b.spend - a.spend);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-gray-200 font-mono text-[13px]">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-green-900/30 bg-[#0d0d14]">
        {(['dashboard', 'routing', 'deliberation', 'log'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${tab === t ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}>
            {t === 'dashboard' ? '◈ Dashboard' : t === 'routing' ? '⚡ Routing' : t === 'deliberation' ? '🏛 Council Cost Review' : '📋 Spend Log'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${optimalRate > 0.7 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            ROI: {Math.round(optimalRate * 150 + 100)}%
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="border border-green-800/20 rounded-lg p-3 bg-[#0d0d14]">
                <div className="text-[10px] text-gray-500 mb-1">Total Spend (48h)</div>
                <div className="text-lg font-bold text-green-400">${totalSpend.toFixed(4)}</div>
                <div className="text-[10px] text-gray-500 mt-1">{totalTokens.toLocaleString()} tokens</div>
              </div>
              <div className="border border-cyan-800/20 rounded-lg p-3 bg-[#0d0d14]">
                <div className="text-[10px] text-gray-500 mb-1">Saved vs All-Manus</div>
                <div className="text-lg font-bold text-cyan-400">${totalSaved.toFixed(4)}</div>
                <div className="text-[10px] text-green-400 mt-1">↓ {Math.round((totalSaved / (totalSpend + totalSaved)) * 100)}% reduction</div>
              </div>
              <div className="border border-amber-800/20 rounded-lg p-3 bg-[#0d0d14]">
                <div className="text-[10px] text-gray-500 mb-1">Optimal Routing</div>
                <div className="text-lg font-bold text-amber-400">{Math.round(optimalRate * 100)}%</div>
                <div className="text-[10px] text-gray-500 mt-1">{spendLog.filter(e => e.optimal).length}/{spendLog.length} tasks</div>
              </div>
              <div className="border border-purple-800/20 rounded-lg p-3 bg-[#0d0d14]">
                <div className="text-[10px] text-gray-500 mb-1">ROI Compliance</div>
                <div className={`text-lg font-bold ${optimalRate > 0.6 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.round(optimalRate * 150 + 100)}%
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Target: ≥150%</div>
              </div>
            </div>

            {/* Provider breakdown */}
            <div>
              <div className="text-xs text-gray-500 mb-2 font-semibold">PROVIDER SPEND BREAKDOWN</div>
              <div className="space-y-2">
                {providerSpend.map(p => {
                  const pct = totalSpend > 0 ? (p.spend / totalSpend) * 100 : 0;
                  return (
                    <div key={p.id} className={`flex items-center gap-3 p-2 rounded border ${p.border} ${p.bg}`}>
                      <span className="text-base w-6">{p.icon}</span>
                      <span className={`text-xs w-32 ${p.color}`}>{p.name}</span>
                      <div className="flex-1 h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <div className="h-full bg-current rounded-full transition-all" style={{ width: `${pct}%`, color: p.color.includes('cyan') ? '#22d3ee' : p.color.includes('green') ? '#4ade80' : p.color.includes('blue') ? '#60a5fa' : p.color.includes('orange') ? '#fb923c' : p.color.includes('yellow') ? '#facc15' : p.color.includes('purple') ? '#c084fc' : p.color.includes('sky') ? '#38bdf8' : '#94a3b8' }} />
                      </div>
                      <span className="text-[10px] text-gray-400 w-16 text-right">${p.spend.toFixed(4)}</span>
                      <span className="text-[10px] text-gray-500 w-12 text-right">{p.tasks} tasks</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cost reduction strategies */}
            <div className="border border-green-800/20 rounded-lg p-3 bg-green-950/10">
              <div className="text-xs text-green-400 font-semibold mb-2">ACTIVE COST REDUCTION STRATEGIES</div>
              <div className="space-y-1.5 text-[10px] text-gray-400">
                <div className="flex items-start gap-2"><span className="text-green-400">✓</span> Route all research/synthesis to DeepSeek R1 ($0.14/M vs $5.00/M Manus = 97% savings)</div>
                <div className="flex items-start gap-2"><span className="text-green-400">✓</span> Use Copilot for all M365 tasks (free tier — $0.00/M)</div>
                <div className="flex items-start gap-2"><span className="text-green-400">✓</span> Gemini 2.5 Flash for code review and data analysis ($0.15/M, fastest throughput)</div>
                <div className="flex items-start gap-2"><span className="text-green-400">✓</span> Reserve Manus exclusively for web dev, browser automation, and deployment</div>
                <div className="flex items-start gap-2"><span className="text-green-400">✓</span> Council deliberations run on DeepSeek (40K tokens at $0.006 vs $0.48 on Manus)</div>
                <div className="flex items-start gap-2"><span className="text-amber-400">⚠</span> Qwen 3 for 144 Sphere ontology parsing (Alibaba cloud credits available)</div>
                <div className="flex items-start gap-2"><span className="text-amber-400">⚠</span> GCP compute for Gemini batch jobs (existing allocation)</div>
              </div>
            </div>
          </div>
        )}

        {/* ── ROUTING TAB ── */}
        {tab === 'routing' && (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            <div className="text-xs text-gray-500 mb-1 font-semibold">TASK → PROVIDER ROUTING TABLE (Ara-managed)</div>
            <div className="space-y-2">
              {TASK_TYPES.map(task => {
                const optimal = PROVIDERS.find(p => p.id === task.optimal)!;
                const fallback = PROVIDERS.find(p => p.id === task.fallback)!;
                const manusCost = (task.avgTokens / 1000000) * (5.0 * 0.4 + 20.0 * 0.6);
                const optimalCost = (task.avgTokens / 1000000) * (optimal.inputCost * 0.4 + optimal.outputCost * 0.6);
                const savings = ((manusCost - optimalCost) / manusCost) * 100;
                return (
                  <div key={task.id} className="border border-gray-800/30 rounded-lg p-3 bg-[#0d0d14]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-200 font-medium w-40">{task.name}</span>
                      <span className="text-[10px] text-gray-500">~{(task.avgTokens / 1000).toFixed(0)}K tokens</span>
                      <div className="ml-auto flex items-center gap-2">
                        {task.manusAvoid && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400 border border-red-800/30">
                            AVOID MANUS
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-green-500/20 text-green-400">
                          ↓{Math.round(savings)}% cost
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px]">
                      <div>
                        <span className="text-gray-500">Optimal: </span>
                        <span className={PROVIDERS.find(p => p.id === task.optimal)?.color}>{optimal.name}</span>
                        <span className="text-green-400 ml-1">${optimalCost.toFixed(4)}</span>
                      </div>
                      <span className="text-gray-700">│</span>
                      <div>
                        <span className="text-gray-500">Fallback: </span>
                        <span className={PROVIDERS.find(p => p.id === task.fallback)?.color}>{fallback.name}</span>
                      </div>
                      <span className="text-gray-700">│</span>
                      <div>
                        <span className="text-gray-500">Manus: </span>
                        <span className="text-red-400">${manusCost.toFixed(4)}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{task.reason}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DELIBERATION TAB ── */}
        {tab === 'deliberation' && (
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={startDeliberation} disabled={deliberating}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${deliberating ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-green-600/30 text-green-300 border border-green-500/40 hover:bg-green-600/40'}`}>
                {deliberating ? '⟳ Council Deliberating...' : '🏛 Convene Cost Review'}
              </button>
              <span className="text-[10px] text-gray-500">Topic: Manus Spend Reduction Strategy</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {COST_DELIBERATIONS[0].slice(0, deliberationStep).map((d, i) => (
                <div key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${d.speaker === 'Daavud' ? 'border-amber-500/50 bg-amber-950/30' : 'border-gray-700/50 bg-gray-900/50'}`}>
                    <span className={d.color}>{d.speaker[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold ${d.color}`}>{d.speaker}</span>
                      {d.speaker === 'Daavud' && <span className="px-1 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-400">SOVEREIGN</span>}
                      {d.speaker === 'Ara' && <span className="px-1 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-400">DELEGATION AUTHORITY</span>}
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{d.message}</p>
                  </div>
                </div>
              ))}
              {deliberationStep >= COST_DELIBERATIONS[0].length && !deliberating && (
                <div className="border border-amber-800/30 rounded-lg p-3 bg-amber-950/10 mt-2">
                  <div className="text-xs text-amber-400 font-semibold mb-1">⚖ Council Resolution: COST-OPT-001</div>
                  <div className="text-[10px] text-gray-400 space-y-1">
                    <div>1. All research/synthesis → DeepSeek R1 (Tier 1)</div>
                    <div>2. All M365 tasks → Copilot (free)</div>
                    <div>3. Code review + data → Gemini 2.5 Flash (Tier 2)</div>
                    <div>4. Manus reserved for: web dev, browser automation, deployment only</div>
                    <div>5. Weekly cost report to Council, 150% ROI enforced</div>
                    <div>6. Ara oversees all delegation decisions</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SPEND LOG TAB ── */}
        {tab === 'log' && (
          <div className="h-full overflow-y-auto p-4">
            <div className="text-xs text-gray-500 mb-2 font-semibold">RECENT SPEND LOG (48h)</div>
            <div className="space-y-1">
              {spendLog.map((entry, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded text-[10px] border ${entry.optimal ? 'border-gray-800/20 bg-[#0d0d14]' : 'border-red-800/20 bg-red-950/5'}`}>
                  <span className="text-gray-600 w-28 shrink-0">{entry.timestamp}</span>
                  <span className="text-gray-300 w-36 shrink-0">{entry.task}</span>
                  <span className={`w-28 shrink-0 ${entry.optimal ? 'text-green-400' : 'text-red-400'}`}>{entry.provider}</span>
                  <span className="text-gray-500 w-16 text-right shrink-0">{(entry.tokens / 1000).toFixed(1)}K</span>
                  <span className="text-green-400 w-16 text-right shrink-0">${entry.cost.toFixed(4)}</span>
                  {entry.optimal ? (
                    <span className="text-green-400/70 text-right flex-1">saved ${entry.savedVsManus.toFixed(4)}</span>
                  ) : (
                    <span className="text-red-400/70 text-right flex-1">⚠ suboptimal</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
