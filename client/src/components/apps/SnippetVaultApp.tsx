import { useState, useMemo } from 'react';
import { Code2, Search, Copy, Check, Tag, Star, Plus, Filter, Hash } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// SNIPPET VAULT — Developer Code Snippet Manager
// ALUM-DEV-001 — Constitutional snippet storage with search,
// tagging, language filter, copy-to-clipboard, and star/pin.
//
// What vibe coders asked for:
//   • Instant search across titles, content, tags
//   • One-click copy with visual confirmation
//   • Language-aware organization
//   • Pin/star your most-used snippets
// ═══════════════════════════════════════════════════════════════

type Language = 'typescript' | 'rust' | 'python' | 'bash' | 'json' | 'css' | 'sql' | 'yaml';

interface Snippet {
  id: number;
  title: string;
  description: string;
  language: Language;
  tags: string[];
  code: string;
  starred: boolean;
  uses: number;
}

const LANG_COLORS: Record<Language, string> = {
  typescript: '#3178c6',
  rust:       '#ce422b',
  python:     '#3572A5',
  bash:       '#34d399',
  json:       '#fbbf24',
  css:        '#a78bfa',
  sql:        '#22d3ee',
  yaml:       '#fb923c',
};

const LANG_LABELS: Record<Language, string> = {
  typescript: 'TypeScript',
  rust:       'Rust',
  python:     'Python',
  bash:       'Bash',
  json:       'JSON',
  css:        'CSS',
  sql:        'SQL',
  yaml:       'YAML',
};

const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 1,
    title: 'Aluminum OS — Forge Query (High Tier)',
    description: 'Route a constitutional query through the Pantheon Forge Nexus',
    language: 'typescript',
    tags: ['forge', 'nexus', 'aluminum-os'],
    starred: true, uses: 47,
    code: `// Classify and send a HIGH-tier Nexus query
const tier = classifyTier(input); // 'high' | 'medium' | 'low'
const delay = tier === 'high' ? 1400 + Math.random() * 1000 : 250;

await new Promise(r => setTimeout(r, delay));
const metrics = evolveMetrics(currentMetrics);
const verdict = generateVerdict(metrics, input);
const response: ForgeMessage = {
  id:      crypto.randomUUID(),
  role:    'forge',
  tier:    'high',
  content: forgeResponse(input, metrics, agent.insights),
  score:   compositeScore(metrics),
  verdict, npfm: computeNPFM(metrics),
  timestamp: Date.now(),
};`,
  },
  {
    id: 2,
    title: 'Rust — BuddyAllocator ring-0 alloc',
    description: 'Allocate a block from the Ring-0 buddy system',
    language: 'rust',
    tags: ['ring0', 'kernel', 'aluminum-os', 'allocator'],
    starred: true, uses: 31,
    code: `use crate::kernel::buddy::BuddyAllocator;

fn allocate_block(order: u8) -> Option<usize> {
    let mut alloc = BuddyAllocator::new(64 * 1024 * 1024); // 64 MB
    alloc.allocate(order)
}

fn main() {
    if let Some(addr) = allocate_block(12) {
        println!("Allocated 4096 bytes at 0x{:x}", addr);
    } else {
        eprintln!("Out of memory at order 12");
    }
}`,
  },
  {
    id: 3,
    title: 'Python — Governance NPFM scorer',
    description: 'Compute Net Positive Flourishing Metric from pentagon axes',
    language: 'python',
    tags: ['governance', 'npfm', 'kintsugi', 'aluminum-os'],
    starred: false, uses: 22,
    code: `def compute_npfm(sovereignty: float, power: float,
                  synthesis: float, dignity: float,
                  surplus: float) -> float:
    """NPFM = (grey/100 × jedi/100) - (1 - sith/100) × 0.5
    Mirrors forge-cli/src/govern.rs logic.
    """
    jedi = sovereignty * 0.55 + dignity * 0.45
    sith = power
    grey = synthesis * 0.6 + ((jedi + sith) / 2.0) * 0.4
    return (grey / 100.0) * (jedi / 100.0) - (1 - sith / 100.0) * 0.5

# Example
score = compute_npfm(72, 44, 68, 85, 61)
print(f"NPFM: {score:+.3f}")  # → NPFM: +0.221`,
  },
  {
    id: 4,
    title: 'Bash — Forge CLI govern check',
    description: 'Run a constitutional governance check from the CLI',
    language: 'bash',
    tags: ['cli', 'forge', 'governance'],
    starred: false, uses: 18,
    code: `#!/usr/bin/env bash
# Run constitutional governance analysis via forge CLI
# Requires: cargo build -p forge --release

TEXT="your query or commit message here"
forge govern "$TEXT"

# Expected output:
# ┌─ Constitutional Analysis ──────────────┐
# │ NPFM Score:  +0.247                   │
# │ Verdict:     Approved                 │
# │ Protocols:   6/6 compliant            │
# └────────────────────────────────────────┘`,
  },
  {
    id: 5,
    title: 'TypeScript — localStorage persistent agent',
    description: 'Load/save a persistent agent identity across browser sessions',
    language: 'typescript',
    tags: ['storage', 'agent', 'persistence'],
    starred: true, uses: 39,
    code: `const AGENT_KEY = 'forge-agent-v1';

interface Agent {
  id:           string;
  createdAt:    number;
  dayCount:     number;
  phase:        'work' | 'dream' | 'play';
  phaseQueries: number;
  totalQueries: number;
  insights:     { id: string; summary: string; score: number }[];
}

function loadAgent(): Agent {
  try {
    const raw = localStorage.getItem(AGENT_KEY);
    if (raw) return JSON.parse(raw) as Agent;
  } catch { /* ignore */ }
  const fresh: Agent = {
    id:           \`AGENT-\${Math.random().toString(36).slice(2,6).toUpperCase()}\`,
    createdAt:    Date.now(),
    dayCount:     0,
    phase:        'work',
    phaseQueries: 0,
    totalQueries: 0,
    insights:     [],
  };
  localStorage.setItem(AGENT_KEY, JSON.stringify(fresh));
  return fresh;
}`,
  },
  {
    id: 6,
    title: 'JSON — Kintsugi policy input',
    description: 'OPA input payload for Kintsugi constitutional audit',
    language: 'json',
    tags: ['kintsugi', 'opa', 'governance', 'json'],
    starred: false, uses: 11,
    code: `{
  "input": {
    "action": "data_access",
    "agent_id": "AGENT-A3F2",
    "resource": "health_records",
    "locality": "local",
    "consent_given": true,
    "timestamp": 1742547054,
    "metadata": {
      "provider": "fhir_r4",
      "purpose": "care_plan",
      "retention_days": 30
    }
  }
}`,
  },
  {
    id: 7,
    title: 'YAML — GitHub Actions CI with Rust + Python',
    description: 'CI workflow: cargo test + python unittest in one job',
    language: 'yaml',
    tags: ['ci', 'github-actions', 'rust', 'python', 'testing'],
    starred: false, uses: 14,
    code: `name: Aluminum OS CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - name: Rust tests
        run: cargo test --workspace
      - name: Python tests
        run: |
          cd python
          python3 -m unittest tests.test_all -v`,
  },
  {
    id: 8,
    title: 'Rust — Governance verdict scoring',
    description: 'Score 6 Pendragon protocols from ForgeMetrics',
    language: 'rust',
    tags: ['governance', 'forge', 'pendragon', 'verdict'],
    starred: false, uses: 9,
    code: `#[derive(Debug)]
pub enum Verdict { Approved, Conditional, Rejected }

pub fn score_verdict(
    sovereignty: f32, power: f32, synthesis: f32,
    dignity: f32, surplus: f32,
) -> (Verdict, u8) {
    let violations: u8 = [
        synthesis  < 40.0,
        power      < 20.0,
        dignity    < 30.0,
        sovereignty < 35.0,
        (synthesis * 0.6 + (sovereignty * 0.55 + dignity * 0.45 + power) / 2.0 * 0.4) < 35.0,
        !(surplus  >= 45.0 && dignity >= 30.0),
    ].iter().filter(|&&v| v).count() as u8;

    let verdict = if violations == 0 { Verdict::Approved }
        else if violations <= 2 { Verdict::Conditional }
        else { Verdict::Rejected };
    (verdict, 6 - violations)
}`,
  },
  {
    id: 9,
    title: 'SQL — Audit log query (immutable trail)',
    description: 'Query constitutional audit events with time range filter',
    language: 'sql',
    tags: ['audit', 'sql', 'compliance', 'kintsugi'],
    starred: false, uses: 7,
    code: `-- Query constitutional audit log for recent violations
SELECT
  event_id,
  agent_id,
  protocol,
  verdict,
  npfm_score,
  recommendation,
  created_at
FROM constitutional_audit
WHERE
  created_at >= NOW() - INTERVAL '24 hours'
  AND verdict IN ('Conditional', 'Rejected')
ORDER BY created_at DESC
LIMIT 50;`,
  },
  {
    id: 10,
    title: 'Python — PQC-signed audit entry',
    description: 'Create a post-quantum cryptography signed audit event',
    language: 'python',
    tags: ['pqc', 'audit', 'security', 'kintsugi'],
    starred: true, uses: 19,
    code: `import hashlib, json, time

def create_audit_entry(
    agent_id: str,
    action: str,
    protocol: str,
    verdict: str,
    npfm_score: float,
) -> dict:
    """
    Simulates a PQC-signed (ML-DSA-87 placeholder) audit entry.
    In production: use liboqs or dilithium bindings.
    """
    payload = {
        "agent_id":   agent_id,
        "action":     action,
        "protocol":   protocol,
        "verdict":    verdict,
        "npfm_score": npfm_score,
        "timestamp":  int(time.time()),
    }
    canonical = json.dumps(payload, sort_keys=True).encode()
    signature = hashlib.sha3_256(canonical).hexdigest()  # replace with ML-DSA-87
    return {**payload, "sig": signature, "alg": "SHA3-256-STUB"}`,
  },
  {
    id: 11,
    title: 'CSS — Obsidian Glass UI variables',
    description: 'CSS custom properties for Aluminum OS dark glass aesthetic',
    language: 'css',
    tags: ['design', 'tokens', 'dark-mode', 'glass'],
    starred: false, uses: 25,
    code: `:root {
  /* Aluminum OS — Obsidian Glass Design Tokens */
  --alum-bg:           #05070f;
  --alum-surface:      #080c18;
  --alum-border:       #141c2f;
  --alum-border-soft:  #1f2937;
  --alum-gold:         #ffd700;
  --alum-cyan:         #22d3ee;
  --alum-green:        #34d399;
  --alum-purple:       #a78bfa;
  --alum-red:          #ef4444;
  --alum-text:         #e5e7eb;
  --alum-muted:        #4b5563;
  --alum-dim:          #374151;

  /* Glass overlay layers */
  --glass-1: rgba(255,255,255,0.03);
  --glass-2: rgba(255,255,255,0.06);
  --glass-3: rgba(255,255,255,0.10);
}`,
  },
  {
    id: 12,
    title: 'Bash — Quick vibe-coding project scaffold',
    description: 'Scaffold a new TypeScript + Vite project with one command',
    language: 'bash',
    tags: ['vibe-coding', 'scaffold', 'vite', 'typescript'],
    starred: true, uses: 64,
    code: `#!/usr/bin/env bash
# One-shot vibe-coding project scaffold
# Usage: ./scaffold.sh my-app

APP_NAME=\${1:-my-app}
npm create vite@latest "\$APP_NAME" -- --template react-ts
cd "\$APP_NAME"
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "✓ \$APP_NAME ready — start hacking:"
echo "  cd \$APP_NAME && npm run dev"`,
  },
];

const ALL_LANGS: Language[] = ['typescript', 'rust', 'python', 'bash', 'json', 'css', 'sql', 'yaml'];
const ALL_TAGS = Array.from(new Set(INITIAL_SNIPPETS.flatMap(s => s.tags))).sort();

export default function SnippetVaultApp() {
  const [snippets, setSnippets] = useState<Snippet[]>(INITIAL_SNIPPETS);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState<Language | 'all'>('all');
  const [tagFilter, setTagFilter]   = useState<string>('');
  const [starOnly, setStarOnly]     = useState(false);
  const [copied, setCopied]         = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return snippets.filter(s => {
      if (starOnly && !s.starred) return false;
      if (langFilter !== 'all' && s.language !== langFilter) return false;
      if (tagFilter && !s.tags.includes(tagFilter)) return false;
      if (q && !s.title.toLowerCase().includes(q) &&
               !s.description.toLowerCase().includes(q) &&
               !s.code.toLowerCase().includes(q) &&
               !s.tags.some(t => t.includes(q))) return false;
      return true;
    });
  }, [snippets, search, langFilter, tagFilter, starOnly]);

  const selected = snippets.find(s => s.id === selectedId) ?? snippets[0];

  function handleCopy() {
    navigator.clipboard.writeText(selected.code).catch(() => {});
    setSnippets(prev => prev.map(s => s.id === selected.id ? { ...s, uses: s.uses + 1 } : s));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function toggleStar(id: number) {
    setSnippets(prev => prev.map(s => s.id === id ? { ...s, starred: !s.starred } : s));
  }

  return (
    <div className="flex h-full bg-[#05070f] text-gray-200 overflow-hidden">
      {/* ── Left sidebar ── */}
      <div className="flex flex-col w-64 border-r border-[#141c2f] flex-shrink-0">
        {/* Header */}
        <div className="p-3 border-b border-[#141c2f] bg-black/30">
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={14} style={{ color: '#22d3ee' }} />
            <span className="text-xs font-bold tracking-widest text-gray-100 uppercase">Snippet Vault</span>
            <span className="ml-auto text-[9px] font-mono" style={{ color: '#22d3ee' }}>ALUM-DEV-001</span>
          </div>
          {/* Search */}
          <div className="flex items-center gap-1.5 bg-[#0a0f1e] border border-[#1f2937] rounded px-2 py-1.5">
            <Search size={10} className="text-[#4b5563] flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search snippets…"
              className="flex-1 bg-transparent text-[10px] text-gray-300 outline-none placeholder:text-[#374151]"
            />
          </div>
          {/* Filter row */}
          <div className="flex items-center gap-1 mt-1.5">
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${showFilters ? 'border-[#22d3ee]/40 text-[#22d3ee] bg-[#22d3ee]/10' : 'border-[#1f2937] text-[#4b5563] hover:text-[#6b7280]'}`}>
              <Filter size={8} />FILTER
            </button>
            <button
              onClick={() => setStarOnly(s => !s)}
              className={`flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${starOnly ? 'border-[#fbbf24]/40 text-[#fbbf24] bg-[#fbbf24]/10' : 'border-[#1f2937] text-[#4b5563] hover:text-[#6b7280]'}`}>
              <Star size={8} />STARRED
            </button>
            <span className="ml-auto text-[8px] text-[#374151] font-mono">{filtered.length}/{snippets.length}</span>
          </div>
          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-2 space-y-1.5">
              <select
                value={langFilter}
                onChange={e => setLangFilter(e.target.value as Language | 'all')}
                className="w-full text-[9px] bg-[#0a0f1e] border border-[#1f2937] text-gray-300 rounded px-2 py-1 cursor-pointer outline-none">
                <option value="all">All languages</option>
                {ALL_LANGS.map(l => <option key={l} value={l}>{LANG_LABELS[l]}</option>)}
              </select>
              <select
                value={tagFilter}
                onChange={e => setTagFilter(e.target.value)}
                className="w-full text-[9px] bg-[#0a0f1e] border border-[#1f2937] text-gray-300 rounded px-2 py-1 cursor-pointer outline-none">
                <option value="">All tags</option>
                {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Snippet list */}
        <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-[10px] text-[#374151]">No snippets match your filters</div>
          )}
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors ${selectedId === s.id ? 'bg-[#0a0f1e] border border-[#1f2937]' : 'hover:bg-white/[0.02] border border-transparent'}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[8px] font-mono font-bold px-1 rounded"
                  style={{ background: LANG_COLORS[s.language] + '22', color: LANG_COLORS[s.language] }}>
                  {s.language.toUpperCase().slice(0, 2)}
                </span>
                {s.starred && <Star size={8} fill="#fbbf24" className="text-[#fbbf24] flex-shrink-0" />}
                <span className="text-[10px] font-medium text-gray-300 truncate flex-1">{s.title}</span>
              </div>
              <p className="text-[8px] text-[#4b5563] truncate">{s.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[7px] font-mono text-[#374151]">{s.uses} uses</span>
                <span className="ml-auto text-[7px] text-[#1f2937] truncate max-w-[80px]">
                  {s.tags.slice(0, 2).join(' · ')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main detail ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Detail header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#141c2f] bg-black/20 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-mono font-bold px-1.5 rounded-sm"
                style={{ background: LANG_COLORS[selected.language] + '22', color: LANG_COLORS[selected.language] }}>
                {LANG_LABELS[selected.language]}
              </span>
              <h2 className="text-sm font-semibold text-gray-100 truncate">{selected.title}</h2>
            </div>
            <p className="text-[10px] text-[#4b5563] truncate">{selected.description}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => toggleStar(selected.id)}
              className={`p-1.5 rounded border transition-colors ${selected.starred ? 'border-[#fbbf24]/40 bg-[#fbbf24]/10 text-[#fbbf24]' : 'border-[#1f2937] text-[#374151] hover:text-[#fbbf24]'}`}>
              <Star size={12} fill={selected.starred ? '#fbbf24' : 'none'} />
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[10px] font-mono font-bold transition-all ${copied ? 'border-[#34d399]/40 bg-[#34d399]/10 text-[#34d399]' : 'border-[#22d3ee]/30 bg-[#22d3ee]/5 text-[#22d3ee] hover:bg-[#22d3ee]/10'}`}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#141c2f] bg-black/10 flex-shrink-0">
          <Hash size={9} className="text-[#374151]" />
          {selected.tags.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              className={`text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${tagFilter === tag ? 'border-[#a78bfa]/40 bg-[#a78bfa]/10 text-[#a78bfa]' : 'border-[#1f2937] text-[#4b5563] hover:text-[#6b7280]'}`}>
              {tag}
            </button>
          ))}
          <span className="ml-auto text-[8px] font-mono text-[#374151]">{selected.uses} uses</span>
        </div>

        {/* Code display */}
        <div className="flex-1 overflow-auto p-4">
          <pre
            className="font-mono text-[11px] leading-relaxed text-gray-300 whitespace-pre overflow-x-auto p-4 rounded-xl border border-[#1f2937] bg-[#030508]"
            style={{ tabSize: 2 }}>
            <code>{selected.code}</code>
          </pre>
        </div>

        {/* Footer stats */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[#141c2f] bg-black/20 text-[8px] font-mono text-[#374151] flex-shrink-0">
          <span>{selected.code.split('\n').length} lines</span>
          <span>{selected.code.length} chars</span>
          <span style={{ color: LANG_COLORS[selected.language] }}>{LANG_LABELS[selected.language]}</span>
          <span className="ml-auto flex items-center gap-1 text-[#1f2937]">
            <Tag size={8} />{selected.tags.length} tags · {selected.uses} uses
          </span>
        </div>
      </div>
    </div>
  );
}
