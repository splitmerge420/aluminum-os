import { useState, useEffect, useRef } from 'react';
import { Shield, Eye, Zap, AlertTriangle, CheckCircle, XCircle, Search, BarChart3, Activity, Globe, Lock, Users, Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ── Truth Substrate App ──────────────────────────────────────────────
// Design: X-Algorithm (Phoenix) integration — Media Integrity Analyzer
// with MED-9/FRAUD-8 scoring, 144-sphere routing, and multi-model consensus.
// Constitutional: INV-3 consent, INV-7 sovereignty cap, INV-22 honesty, Rule 8 audit

interface TruthinessMetadata {
  id: string;
  content: string;
  source: string;
  truthScore: number;
  incentiveDistortion: number; // MED-9
  medicareIntegrity: number;   // FRAUD-8
  sphereId: number;
  sphereName: string;
  houseId: number;
  houseName: string;
  biasVector: Record<string, number>;
  scoredBy: string[];
  confidence: number;
  requiresConsent: boolean;
  rankingMultiplier: number;
  reasoning: string[];
  timestamp: number;
  auditHash: string;
  mode: 'shadow' | 'active' | 'audit_only';
}

const HOUSES = [
  { id: 1, name: 'Cognition', color: '#3b82f6', spheres: 12 },
  { id: 2, name: 'Language', color: '#8b5cf6', spheres: 12 },
  { id: 3, name: 'Perception', color: '#06b6d4', spheres: 12 },
  { id: 4, name: 'Memory', color: '#10b981', spheres: 12 },
  { id: 5, name: 'Reasoning', color: '#f59e0b', spheres: 12 },
  { id: 6, name: 'Creativity', color: '#ec4899', spheres: 12 },
  { id: 7, name: 'Ethics', color: '#ef4444', spheres: 12 },
  { id: 8, name: 'Social', color: '#f97316', spheres: 12 },
  { id: 9, name: 'Finance', color: '#14b8a6', spheres: 12 },
  { id: 10, name: 'Health', color: '#22c55e', spheres: 12 },
  { id: 11, name: 'Security', color: '#6366f1', spheres: 12 },
  { id: 12, name: 'Evolution', color: '#a855f7', spheres: 12 },
];

const COUNCIL_MODELS = [
  { name: 'Claude', trust: 0.94, color: '#d97706', affinity: { 7: 1.5, 10: 1.3 } },
  { name: 'Gemini', trust: 0.91, color: '#3b82f6', affinity: { 3: 1.5, 6: 1.3 } },
  { name: 'Grok', trust: 0.89, color: '#ef4444', affinity: { 8: 1.5, 9: 1.3 } },
  { name: 'GPT', trust: 0.90, color: '#10b981', affinity: { 1: 1.5, 5: 1.3 } },
  { name: 'Copilot', trust: 0.88, color: '#06b6d4', affinity: { 11: 1.5, 4: 1.3 } },
  { name: 'DeepSeek', trust: 0.87, color: '#8b5cf6', affinity: { 5: 1.5, 1: 1.3 } },
  { name: 'Qwen', trust: 0.86, color: '#f97316', affinity: { 2: 1.5, 6: 1.3 } },
  { name: 'Llama', trust: 0.85, color: '#14b8a6', affinity: { 12: 1.5, 3: 1.3 } },
  { name: 'Mistral', trust: 0.84, color: '#ec4899', affinity: { 4: 1.5, 7: 1.3 } },
  { name: 'Manus', trust: 0.92, color: '#22d3ee', affinity: { 11: 1.5, 12: 1.5 } },
];

const SAMPLE_POSTS: TruthinessMetadata[] = [
  {
    id: 'post-001', content: 'New study shows vitamin D reduces COVID risk by 60%',
    source: '@HealthNews_Daily', truthScore: 0.42, incentiveDistortion: 0.38,
    medicareIntegrity: 0.95, sphereId: 51, sphereName: 'Medical Integrity',
    houseId: 10, houseName: 'Health', biasVector: { Claude: 0.35, Gemini: 0.41, Grok: 0.48, GPT: 0.40, DeepSeek: 0.44 },
    scoredBy: ['Claude', 'Gemini', 'Grok', 'GPT', 'DeepSeek'], confidence: 0.82,
    requiresConsent: true, rankingMultiplier: 0.62,
    reasoning: ['MED-9: 38% incentive distortion detected (threshold: 15%)', 'Source has affiliate links to supplement store', 'Study cited is preprint, not peer-reviewed', 'Claim magnitude exceeds meta-analysis consensus'],
    timestamp: Date.now() - 120000, auditHash: 'sha256:a1b2c3d4e5f6...', mode: 'active'
  },
  {
    id: 'post-002', content: 'Medicare open enrollment deadline extended to March 31',
    source: '@CMS_Gov', truthScore: 0.97, incentiveDistortion: 0.02,
    medicareIntegrity: 0.99, sphereId: 51, sphereName: 'Medical Integrity',
    houseId: 10, houseName: 'Health', biasVector: { Claude: 0.96, Gemini: 0.97, Grok: 0.98, GPT: 0.97, DeepSeek: 0.96 },
    scoredBy: ['Claude', 'Gemini', 'Grok', 'GPT', 'DeepSeek'], confidence: 0.99,
    requiresConsent: false, rankingMultiplier: 1.15,
    reasoning: ['Official government source verified', 'FRAUD-8: No predatory patterns detected', 'Multi-model consensus: 97% agreement', 'Boosted: high-integrity public health information'],
    timestamp: Date.now() - 60000, auditHash: 'sha256:f6e5d4c3b2a1...', mode: 'active'
  },
  {
    id: 'post-003', content: 'BREAKING: This one weird trick saves $500/month on insurance',
    source: '@InsuranceDeals_Pro', truthScore: 0.11, incentiveDistortion: 0.89,
    medicareIntegrity: 0.15, sphereId: 9, sphereName: 'Sovereign Finance',
    houseId: 9, houseName: 'Finance', biasVector: { Claude: 0.08, Gemini: 0.12, Grok: 0.14, GPT: 0.10, DeepSeek: 0.11 },
    scoredBy: ['Claude', 'Gemini', 'Grok', 'GPT', 'DeepSeek'], confidence: 0.97,
    requiresConsent: false, rankingMultiplier: 0.11,
    reasoning: ['MED-9: 89% incentive distortion — CRITICAL', 'FRAUD-8: Predatory Medicare scam pattern detected', 'Clickbait linguistic markers: 95% match', 'Source account: 12 prior FRAUD-8 flags', 'DEMOTED: Algorithmically suppressed, not censored'],
    timestamp: Date.now() - 30000, auditHash: 'sha256:1a2b3c4d5e6f...', mode: 'active'
  },
  {
    id: 'post-004', content: 'Thread: How CRISPR gene editing could cure sickle cell disease — a deep dive into the science',
    source: '@GenomicsPhD', truthScore: 0.91, incentiveDistortion: 0.04,
    medicareIntegrity: 0.98, sphereId: 37, sphereName: 'Pharmacology',
    houseId: 10, houseName: 'Health', biasVector: { Claude: 0.93, Gemini: 0.90, Grok: 0.88, GPT: 0.92, DeepSeek: 0.91 },
    scoredBy: ['Claude', 'Gemini', 'Grok', 'GPT', 'DeepSeek'], confidence: 0.95,
    requiresConsent: false, rankingMultiplier: 1.08,
    reasoning: ['High-integrity scientific content', 'Author verified: PhD in Genomics, published researcher', 'Claims align with peer-reviewed literature', 'No incentive distortion detected'],
    timestamp: Date.now() - 180000, auditHash: 'sha256:7f8e9d0c1b2a...', mode: 'active'
  },
  {
    id: 'post-005', content: 'AI will replace all doctors within 5 years — here is why',
    source: '@TechFuturist_AI', truthScore: 0.34, incentiveDistortion: 0.31,
    medicareIntegrity: 0.88, sphereId: 1, sphereName: 'Attention Routing',
    houseId: 1, houseName: 'Cognition', biasVector: { Claude: 0.28, Gemini: 0.36, Grok: 0.42, GPT: 0.30, DeepSeek: 0.33 },
    scoredBy: ['Claude', 'Gemini', 'Grok', 'GPT', 'DeepSeek'], confidence: 0.78,
    requiresConsent: false, rankingMultiplier: 0.69,
    reasoning: ['MED-9: 31% incentive distortion (above 15% threshold)', 'Absolute claim ("all doctors") contradicts expert consensus', 'Source monetizes AI hype content', 'HITL flagged: score between 0.3-0.4 — human review recommended'],
    timestamp: Date.now() - 240000, auditHash: 'sha256:c3d4e5f6a7b8...', mode: 'active'
  },
];

const CONFIG = {
  version: '1.0.0-aluminum',
  activeSpheres: 144,
  med9Threshold: 0.15,
  fraud8Active: true,
  minTruthinessForBoost: 0.85,
  hitlThreshold: 0.4,
  maxScoringRps: 10000,
  mode: 'shadow' as const,
  consensusMinimum: 0.70,
};

export default function TruthSubstrateApp() {
  const [tab, setTab] = useState<'feed' | 'analyzer' | 'spheres' | 'config' | 'audit'>('feed');
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [selectedPost, setSelectedPost] = useState<TruthinessMetadata | null>(null);
  const [analyzerInput, setAnalyzerInput] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'high' | 'low' | 'flagged'>('all');
  const [liveScoring, setLiveScoring] = useState(true);
  const scoreAnimRef = useRef<number>(0);

  // Simulate live scoring animation
  useEffect(() => {
    if (!liveScoring) return;
    const interval = setInterval(() => {
      scoreAnimRef.current = (scoreAnimRef.current + 1) % 100;
      setPosts(prev => prev.map(p => ({
        ...p,
        truthScore: Math.max(0, Math.min(1, p.truthScore + (Math.random() - 0.5) * 0.01)),
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, [liveScoring]);

  const filteredPosts = posts.filter(p => {
    if (filterMode === 'high') return p.truthScore >= 0.85;
    if (filterMode === 'low') return p.truthScore < 0.4;
    if (filterMode === 'flagged') return p.incentiveDistortion > CONFIG.med9Threshold;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 0.85) return '#22c55e';
    if (score >= 0.6) return '#f59e0b';
    if (score >= 0.4) return '#f97316';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.85) return 'HIGH INTEGRITY';
    if (score >= 0.6) return 'MODERATE';
    if (score >= 0.4) return 'REVIEW NEEDED';
    return 'LOW INTEGRITY';
  };

  const getTrend = (score: number) => {
    if (score >= 0.7) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (score >= 0.4) return <Minus className="w-3 h-3 text-yellow-400" />;
    return <TrendingDown className="w-3 h-3 text-red-400" />;
  };

  const tabs = [
    { id: 'feed' as const, label: 'Live Feed', icon: Activity },
    { id: 'analyzer' as const, label: 'Analyzer', icon: Search },
    { id: 'spheres' as const, label: '144 Spheres', icon: Globe },
    { id: 'config' as const, label: 'Config', icon: Zap },
    { id: 'audit' as const, label: 'Audit Trail', icon: Lock },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-950 text-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">TRUTH SUBSTRATE</h1>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">X-Algorithm Phoenix Integration — Project Aluminum X</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono" style={{ background: CONFIG.mode === 'shadow' ? 'rgba(139,92,246,0.15)' : CONFIG.mode === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: CONFIG.mode === 'shadow' ? '#a78bfa' : CONFIG.mode === 'active' ? '#4ade80' : '#fbbf24' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: CONFIG.mode === 'shadow' ? '#a78bfa' : CONFIG.mode === 'active' ? '#4ade80' : '#fbbf24' }} />
              {CONFIG.mode.toUpperCase()} MODE
            </div>
            <div className="text-[10px] text-gray-500 font-mono">v{CONFIG.version}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-all ${tab === t.id ? 'bg-gray-800/80 text-white border-t border-x border-gray-700' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'feed' && (
          <div className="p-4 space-y-3">
            {/* Stats Bar */}
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'Posts Scored', value: '2.4M', color: '#3b82f6' },
                { label: 'MED-9 Flags', value: '18.2K', color: '#ef4444' },
                { label: 'FRAUD-8 Catches', value: '3,847', color: '#f59e0b' },
                { label: 'Avg Truth Score', value: '0.72', color: '#22c55e' },
                { label: 'HITL Reviews', value: '1,204', color: '#8b5cf6' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-900/60 rounded-lg p-2.5 border border-gray-800/50">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                  <div className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Filter:</span>
              {(['all', 'high', 'low', 'flagged'] as const).map(f => (
                <button key={f} onClick={() => setFilterMode(f)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${filterMode === f ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300 border border-gray-800'}`}>
                  {f === 'all' ? 'All Posts' : f === 'high' ? 'High Integrity' : f === 'low' ? 'Low Integrity' : 'MED-9 Flagged'}
                </button>
              ))}
              <div className="flex-1" />
              <button onClick={() => setLiveScoring(!liveScoring)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${liveScoring ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'text-gray-500 border border-gray-800'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${liveScoring ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                Live Scoring
              </button>
            </div>

            {/* Post Feed */}
            {filteredPosts.map(post => (
              <div key={post.id} onClick={() => setSelectedPost(post)}
                className="bg-gray-900/40 rounded-xl border border-gray-800/50 p-4 hover:border-gray-700 transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  {/* Truth Score Badge */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center border"
                    style={{ borderColor: getScoreColor(post.truthScore) + '40', background: getScoreColor(post.truthScore) + '10' }}>
                    <span className="text-lg font-bold font-mono" style={{ color: getScoreColor(post.truthScore) }}>
                      {(post.truthScore * 100).toFixed(0)}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider" style={{ color: getScoreColor(post.truthScore) }}>
                      {getTrend(post.truthScore)} truth
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-blue-400">{post.source}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono" style={{ background: getScoreColor(post.truthScore) + '15', color: getScoreColor(post.truthScore) }}>
                        {getScoreLabel(post.truthScore)}
                      </span>
                      {post.requiresConsent && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400">INV-3</span>
                      )}
                      {post.incentiveDistortion > CONFIG.med9Threshold && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">MED-9</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{post.content}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span>Sphere: <span className="text-gray-400">{post.sphereName}</span></span>
                      <span>House: <span style={{ color: HOUSES[post.houseId - 1]?.color }}>{post.houseName}</span></span>
                      <span>Ranking: <span className={post.rankingMultiplier >= 1 ? 'text-green-400' : 'text-red-400'}>{post.rankingMultiplier.toFixed(2)}x</span></span>
                      <span>Consensus: <span className="text-gray-400">{(post.confidence * 100).toFixed(0)}%</span></span>
                    </div>
                  </div>

                  {/* Model Consensus Mini */}
                  <div className="flex-shrink-0 flex flex-col gap-0.5">
                    {Object.entries(post.biasVector).slice(0, 5).map(([model, score]) => (
                      <div key={model} className="flex items-center gap-1">
                        <span className="text-[8px] text-gray-600 w-8 text-right">{model.slice(0, 4)}</span>
                        <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${score * 100}%`, background: getScoreColor(score) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reasoning (on hover/select) */}
                {selectedPost?.id === post.id && (
                  <div className="mt-3 pt-3 border-t border-gray-800/50 space-y-1.5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Reasoning Chain</div>
                    {post.reasoning.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-gray-600 font-mono">{i + 1}.</span>
                        <span className={r.includes('CRITICAL') || r.includes('DEMOTED') ? 'text-red-400' : r.includes('Boosted') || r.includes('verified') ? 'text-green-400' : 'text-gray-400'}>{r}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-600 font-mono">
                      <Lock className="w-3 h-3" />
                      Audit: {post.auditHash}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'analyzer' && (
          <div className="p-4 space-y-4">
            <div className="bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                Media Integrity Analyzer
              </h3>
              <textarea value={analyzerInput} onChange={e => setAnalyzerInput(e.target.value)}
                placeholder="Paste any content, URL, or post to analyze for truthiness, incentive distortion, and media integrity..."
                className="w-full h-32 bg-gray-800/50 rounded-lg border border-gray-700 p-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50" />
              <div className="flex items-center gap-2 mt-3">
                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-opacity">
                  Analyze with Full Council
                </button>
                <button className="px-4 py-2 bg-gray-800 rounded-lg text-xs font-medium text-gray-400 border border-gray-700 hover:border-gray-600 transition-colors">
                  Quick Score (Single Model)
                </button>
                <div className="flex-1" />
                <span className="text-[10px] text-gray-600">Routes through 144 spheres automatically</span>
              </div>
            </div>

            {/* Analysis Pipeline */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { step: 1, name: 'Sphere Routing', desc: 'Content → 144 PHD spheres', icon: Globe, color: '#3b82f6' },
                { step: 2, name: 'MED-9 Scoring', desc: 'Incentive distortion analysis', icon: AlertTriangle, color: '#ef4444' },
                { step: 3, name: 'Council Consensus', desc: '10-model weighted vote', icon: Users, color: '#8b5cf6' },
                { step: 4, name: 'Phoenix Injection', desc: 'Ranking multiplier output', icon: Zap, color: '#f59e0b' },
              ].map(s => (
                <div key={s.step} className="bg-gray-900/40 rounded-lg border border-gray-800/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: s.color + '20' }}>
                      <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">STEP {s.step}</span>
                  </div>
                  <div className="text-xs font-medium text-gray-300">{s.name}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Constitutional Gates */}
            <div className="bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Constitutional Gates (Active)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { rule: 'INV-3', name: 'Consent Gate', desc: 'Health content requires patient consent before scoring', status: 'ENFORCED' },
                  { rule: 'INV-7', name: '47% Sovereignty Cap', desc: 'No single model exceeds 47% weight in consensus', status: 'ENFORCED' },
                  { rule: 'INV-20', name: 'Health Consensus', desc: 'Medical claims require 3+ model agreement at 70%', status: 'ENFORCED' },
                  { rule: 'INV-22', name: 'Honesty Standard', desc: 'Transparency badge shows full scoring decomposition', status: 'ENFORCED' },
                  { rule: 'Rule 8', name: 'Immutable Audit', desc: 'Every scoring event logged with SHA-256 hash', status: 'ENFORCED' },
                  { rule: 'Homer', name: 'Reversible Consent', desc: 'Users can see and challenge any ranking decision', status: 'ENFORCED' },
                ].map((g, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-blue-400">{g.rule}</span>
                        <span className="text-xs text-gray-300">{g.name}</span>
                      </div>
                      <div className="text-[10px] text-gray-600 truncate">{g.desc}</div>
                    </div>
                    <span className="text-[8px] text-green-400 font-mono">{g.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'spheres' && (
          <div className="p-4 space-y-3">
            <div className="text-xs text-gray-500 mb-2">Content is routed through 144 specialized PHD spheres for deep contextual scoring. Each sphere has domain-specific truthiness logic.</div>
            <div className="grid grid-cols-3 gap-2">
              {HOUSES.map(house => (
                <div key={house.id} className="bg-gray-900/40 rounded-xl border border-gray-800/50 p-3 hover:border-gray-700 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: house.color + '20' }}>
                      <span className="text-xs font-bold" style={{ color: house.color }}>{house.id}</span>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-300">{house.name}</div>
                      <div className="text-[10px] text-gray-600">{house.spheres} spheres</div>
                    </div>
                  </div>
                  {/* Sphere grid */}
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 12 }, (_, i) => {
                      const sphereId = (house.id - 1) * 12 + i + 1;
                      const isActive = posts.some(p => p.sphereId === sphereId);
                      return (
                        <div key={i} className="w-full aspect-square rounded-md flex items-center justify-center text-[8px] font-mono transition-all"
                          style={{
                            background: isActive ? house.color + '30' : 'rgba(31,41,55,0.5)',
                            border: `1px solid ${isActive ? house.color + '50' : 'rgba(55,65,81,0.3)'}`,
                            color: isActive ? house.color : '#4b5563',
                          }}>
                          {sphereId}
                        </div>
                      );
                    })}
                  </div>
                  {/* Model affinity */}
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-[8px] text-gray-600">Top model:</span>
                    {COUNCIL_MODELS.filter(m => (m.affinity as unknown as Record<number, number>)[house.id]).slice(0, 2).map(m => (
                      <span key={m.name} className="text-[8px] px-1 py-0.5 rounded" style={{ background: m.color + '20', color: m.color }}>
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'config' && (
          <div className="p-4 space-y-4">
            <div className="bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                truth-filter.yaml — Aluminum OS x X-Algorithm
              </h3>
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs space-y-2 border border-gray-800">
                <div className="text-gray-500"># Aluminum OS x X-Algorithm Configuration</div>
                <div className="text-gray-500"># Version: {CONFIG.version}</div>
                <div className="mt-2">
                  <span className="text-blue-400">truth_filter</span><span className="text-gray-500">:</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">active_spheres</span><span className="text-gray-500">: </span><span className="text-yellow-400">{CONFIG.activeSpheres}</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">med_9_distortion_limit</span><span className="text-gray-500">: </span><span className="text-yellow-400">{CONFIG.med9Threshold}</span>
                  <span className="text-gray-600 ml-2"># Optimized from 0.25 → 0.15</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">fraud_8_audit_active</span><span className="text-gray-500">: </span><span className="text-green-400">{String(CONFIG.fraud8Active)}</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">min_truthiness_for_boost</span><span className="text-gray-500">: </span><span className="text-yellow-400">{CONFIG.minTruthinessForBoost}</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">hitl_threshold</span><span className="text-gray-500">: </span><span className="text-yellow-400">{CONFIG.hitlThreshold}</span>
                  <span className="text-gray-600 ml-2"># NEW: Human-in-the-loop for edge cases</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">max_scoring_rps</span><span className="text-gray-500">: </span><span className="text-yellow-400">{CONFIG.maxScoringRps}</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">mode</span><span className="text-gray-500">: </span><span className="text-purple-400">{CONFIG.mode}</span>
                  <span className="text-gray-600 ml-2"># shadow | active | audit_only</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">consensus_minimum</span><span className="text-gray-500">: </span><span className="text-yellow-400">{CONFIG.consensusMinimum}</span>
                  <span className="text-gray-600 ml-2"># Below this → HITL review</span>
                </div>
                <div className="mt-2 pl-4">
                  <span className="text-blue-400">multi_model_consensus</span><span className="text-gray-500">:</span>
                </div>
                <div className="pl-8">
                  <span className="text-cyan-400">models</span><span className="text-gray-500">: </span><span className="text-green-400">[{COUNCIL_MODELS.map(m => `"${m.name}"`).join(', ')}]</span>
                </div>
                <div className="pl-8">
                  <span className="text-cyan-400">weighting</span><span className="text-gray-500">: </span><span className="text-green-400">"trust_weighted"</span>
                  <span className="text-gray-600 ml-2"># Optimized from equal_distribution</span>
                </div>
              </div>
            </div>

            {/* Model Weights */}
            <div className="bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Council Model Weights (Trust-Weighted Consensus)
              </h3>
              <div className="space-y-1.5">
                {COUNCIL_MODELS.map(m => (
                  <div key={m.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                    <span className="text-xs text-gray-400 w-16">{m.name}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${m.trust * 100}%`, background: m.color }} />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 w-8">{m.trust.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-600">
                      Affinity: {Object.entries(m.affinity).map(([h, w]) => `H${h}(${w}x)`).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rust Struct Preview */}
            <div className="bg-gray-900/40 rounded-xl border border-gray-800/50 p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-orange-400" />
                truthiness_metadata.rs — Optimized Struct
              </h3>
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-[11px] border border-gray-800 text-gray-400 whitespace-pre overflow-x-auto">
{`pub struct TruthinessMetadata {
    pub truth_score: f32,           // 0.0-1.0 (clamped)
    pub incentive_distortion: f32,  // MED-9 Score
    pub medicare_integrity: f32,    // FRAUD-8 Score
    pub sphere_id: u8,              // 1-144
    pub sphere_house: u8,           // 1-12 (NEW)
    pub bias_vector: HashMap<String, f32>,  // Model→Score
    pub scored_by: Vec<String>,     // (NEW) Audit trail
    pub confidence: f32,            // (NEW) Consensus confidence
    pub requires_consent: bool,     // (NEW) INV-3 gate
    pub algorithm_version: String,  // (NEW) Reproducibility
    pub timestamp: u64,             // (NEW) When scored
    pub audit_hash: String,         // (NEW) SHA-256 Rule 8
}`}
              </div>
            </div>
          </div>
        )}

        {tab === 'audit' && (
          <div className="p-4 space-y-3">
            <div className="text-xs text-gray-500 mb-2">Every scoring event is immutably logged per Rule 8. Audit hashes are SHA-256 of the full scoring payload.</div>
            {posts.sort((a, b) => b.timestamp - a.timestamp).map(post => (
              <div key={post.id} className="bg-gray-900/40 rounded-lg border border-gray-800/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-mono text-gray-400">{post.auditHash}</span>
                  <div className="flex-1" />
                  <span className="text-[10px] text-gray-600">{new Date(post.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div>
                    <span className="text-gray-600">Content:</span>
                    <p className="text-gray-400 truncate">{post.content}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Score:</span>
                    <p style={{ color: getScoreColor(post.truthScore) }}>{(post.truthScore * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Models:</span>
                    <p className="text-gray-400">{post.scoredBy.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Multiplier:</span>
                    <p className={post.rankingMultiplier >= 1 ? 'text-green-400' : 'text-red-400'}>{post.rankingMultiplier.toFixed(2)}x</p>
                  </div>
                </div>
                {post.incentiveDistortion > CONFIG.med9Threshold && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    MED-9 FLAG: {(post.incentiveDistortion * 100).toFixed(0)}% incentive distortion
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
