import { useState, useMemo } from 'react';
import { BookOpen, Search, Copy, Check, Star, Sparkles, Code2, Bug, Wrench, TestTube, Layers, Zap, RefreshCw, Hash } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PROMPT LIBRARY — Vibe Coding Prompt Template Library
// ALUM-DEV-003 — Searchable, categorized collection of high-signal
// prompts for code generation, debugging, refactoring, testing,
// architecture, and constitutional alignment.
//
// What vibe coders asked for:
//   • Reusable prompt templates to stop re-typing the same scaffolding
//   • Category-based browsing (generation, debug, refactor, test…)
//   • One-click copy with variable highlighting
//   • Community-proven patterns for Cursor / Copilot / Claude / Forge
//   • Constitutional AI alignment prompts specific to Aluminum OS
// ═══════════════════════════════════════════════════════════════

type Category =
  | 'generation'
  | 'debugging'
  | 'refactoring'
  | 'testing'
  | 'architecture'
  | 'review'
  | 'docs'
  | 'aluminum-os';

interface Prompt {
  id:       number;
  title:    string;
  summary:  string;
  category: Category;
  tags:     string[];
  template: string;
  vars:     string[];   // variable names to highlight (inside {{…}})
  starred:  boolean;
  uses:     number;
  source:   string;
}

const CAT_CFG: Record<Category, { label: string; icon: React.ReactNode; color: string }> = {
  generation:   { label: 'Code Generation',    icon: <Code2      size={11} />, color: '#22d3ee' },
  debugging:    { label: 'Debugging',           icon: <Bug        size={11} />, color: '#ef4444' },
  refactoring:  { label: 'Refactoring',         icon: <Wrench     size={11} />, color: '#fbbf24' },
  testing:      { label: 'Testing',             icon: <TestTube   size={11} />, color: '#34d399' },
  architecture: { label: 'Architecture',        icon: <Layers     size={11} />, color: '#a78bfa' },
  review:       { label: 'Code Review',         icon: <Search     size={11} />, color: '#38bdf8' },
  docs:         { label: 'Documentation',       icon: <BookOpen   size={11} />, color: '#fb923c' },
  'aluminum-os':{ label: 'Aluminum OS / Forge', icon: <Sparkles   size={11} />, color: '#ffd700' },
};

const PROMPTS: Prompt[] = [
  // ── Code Generation ──
  {
    id: 1, category: 'generation', starred: true, uses: 128,
    title: 'Scaffold a full TypeScript module',
    summary: 'Generate a new TS module with types, exports, and JSDoc',
    tags: ['typescript', 'scaffold', 'module'],
    source: 'Aluminum OS Forge Library',
    vars: ['MODULE_NAME', 'DESCRIPTION', 'EXPORTS'],
    template: `Create a TypeScript module named {{MODULE_NAME}} that {{DESCRIPTION}}.

Requirements:
- Export: {{EXPORTS}}
- Use strict TypeScript (no \`any\`)
- Include JSDoc on every public function and type
- Handle errors explicitly — no silent failures
- Prefer composition over inheritance
- No external dependencies unless essential

Generate the full module including types, implementations, and a brief usage example in a comment block.`,
  },
  {
    id: 2, category: 'generation', starred: false, uses: 84,
    title: 'REST API endpoint (Express / Hono)',
    summary: 'Scaffold a typed REST endpoint with validation and error handling',
    tags: ['api', 'typescript', 'rest', 'validation'],
    source: 'Vibe Coding Community',
    vars: ['ENDPOINT', 'HTTP_METHOD', 'REQUEST_SCHEMA', 'RESPONSE_SCHEMA'],
    template: `Create a {{HTTP_METHOD}} endpoint for {{ENDPOINT}}.

Request schema: {{REQUEST_SCHEMA}}
Response schema: {{RESPONSE_SCHEMA}}

Requirements:
- Input validation with Zod (parse before use)
- Typed request/response with proper generics
- Structured error responses: { error: string, code: string }
- Add middleware comments for auth (where applicable)
- Include a curl example in a comment

Generate the route handler, Zod schemas, and types.`,
  },
  {
    id: 3, category: 'generation', starred: true, uses: 201,
    title: 'React component with state + hooks',
    summary: 'Full React component: state, effects, event handlers, accessibility',
    tags: ['react', 'typescript', 'component', 'hooks'],
    source: 'Cursor Vibe Coding Patterns',
    vars: ['COMPONENT_NAME', 'PURPOSE', 'PROPS'],
    template: `Build a React functional component called {{COMPONENT_NAME}} that {{PURPOSE}}.

Props interface: {{PROPS}}

Requirements:
- TypeScript strict mode
- Tailwind CSS for styling (dark theme, responsive)
- Accessible: ARIA roles, keyboard navigation, focus visible
- Handle loading, error, and empty states explicitly
- useMemo/useCallback where performance matters
- Avoid prop drilling — use context or composition if state is shared
- Export as default`,
  },
  {
    id: 4, category: 'generation', starred: false, uses: 55,
    title: 'Rust struct with trait implementations',
    summary: 'Idiomatic Rust struct with Display, From, Default, and unit tests',
    tags: ['rust', 'struct', 'traits', 'idiomatic'],
    source: 'Aluminum OS Forge Library',
    vars: ['STRUCT_NAME', 'FIELDS', 'PURPOSE'],
    template: `Create an idiomatic Rust struct {{STRUCT_NAME}} for {{PURPOSE}}.

Fields: {{FIELDS}}

Requirements:
- Derive: Debug, Clone, PartialEq, Serialize/Deserialize where sensible
- Implement Display with meaningful output
- Implement Default (or explain why not)
- Add a builder pattern if more than 3 optional fields
- Include #[cfg(test)] module with at least 3 unit tests
- Use thiserror for any error types
- No unwrap() in production code — use ? operator`,
  },
  // ── Debugging ──
  {
    id: 5, category: 'debugging', starred: true, uses: 310,
    title: 'Explain + fix this error',
    summary: 'Debug an error message with root cause and minimal fix',
    tags: ['debug', 'error', 'fix'],
    source: 'GitHub Copilot Community',
    vars: ['ERROR_MESSAGE', 'CODE_CONTEXT'],
    template: `I'm getting this error:

\`\`\`
{{ERROR_MESSAGE}}
\`\`\`

Here's the relevant code context:
\`\`\`
{{CODE_CONTEXT}}
\`\`\`

Please:
1. Explain the root cause in plain English (1-2 sentences)
2. Show the minimal fix (don't refactor unrelated code)
3. Explain *why* the fix works
4. List any edge cases the fix might miss`,
  },
  {
    id: 6, category: 'debugging', starred: false, uses: 77,
    title: 'Trace async/await race condition',
    summary: 'Identify and fix concurrency bugs in async code',
    tags: ['async', 'race-condition', 'debug'],
    source: 'Vibe Coding Community',
    vars: ['ASYNC_CODE'],
    template: `Analyze this async code for race conditions, missing awaits, or unhandled promise rejections:

\`\`\`
{{ASYNC_CODE}}
\`\`\`

For each issue found:
1. Identify the exact line / pattern
2. Explain what failure mode it enables
3. Provide the corrected version
4. Suggest any broader structural improvement (e.g., Promise.all vs sequential)`,
  },
  // ── Refactoring ──
  {
    id: 7, category: 'refactoring', starred: false, uses: 156,
    title: 'Extract and simplify a long function',
    summary: 'Split an overly long function into focused sub-functions',
    tags: ['refactor', 'clean-code', 'functions'],
    source: 'Clean Code AI Patterns',
    vars: ['FUNCTION_CODE'],
    template: `Refactor this function to be cleaner and more testable:

\`\`\`
{{FUNCTION_CODE}}
\`\`\`

Rules:
- Each extracted function should do ONE thing
- New functions: max 25 lines, single return type
- Keep the public API identical (same inputs/outputs)
- Preserve all existing behavior — no logic changes
- Name functions with clear verb-noun patterns (e.g., buildPayload, validateInput)
- Show before/after side by side if helpful`,
  },
  {
    id: 8, category: 'refactoring', starred: true, uses: 98,
    title: 'TypeScript — remove `any` types',
    summary: 'Replace all `any` with proper types and inferred generics',
    tags: ['typescript', 'types', 'strict'],
    source: 'Aluminum OS Forge Library',
    vars: ['CODE_WITH_ANY'],
    template: `Remove all \`any\` types from this TypeScript code and replace with proper types:

\`\`\`typescript
{{CODE_WITH_ANY}}
\`\`\`

For each \`any\`:
1. Infer the actual type from usage
2. Use generics where the type should be flexible
3. Use \`unknown\` with a type guard if the runtime type is genuinely unknown
4. Add inline comments explaining non-obvious type choices
5. Ensure strict null checks pass`,
  },
  // ── Testing ──
  {
    id: 9, category: 'testing', starred: true, uses: 167,
    title: 'Write unit tests for a function',
    summary: 'Generate comprehensive unit tests: happy path, edges, errors',
    tags: ['testing', 'unit-tests', 'coverage'],
    source: 'GitHub Copilot Community',
    vars: ['FUNCTION_CODE', 'TEST_FRAMEWORK'],
    template: `Write unit tests for this function using {{TEST_FRAMEWORK}}:

\`\`\`
{{FUNCTION_CODE}}
\`\`\`

Include:
1. Happy path — normal inputs
2. Edge cases: empty/null, min/max values, boundary conditions
3. Error cases: invalid inputs, expected throws
4. Any async behavior (resolve + reject)
5. Each test should have a descriptive name explaining *what* it tests
6. Aim for ≥ 80% branch coverage`,
  },
  {
    id: 10, category: 'testing', starred: false, uses: 43,
    title: 'Integration test plan for an API endpoint',
    summary: 'Generate an integration test suite for a REST endpoint',
    tags: ['testing', 'integration', 'api'],
    source: 'Vibe Coding Community',
    vars: ['ENDPOINT_DESCRIPTION', 'AUTH_TYPE'],
    template: `Write an integration test suite for {{ENDPOINT_DESCRIPTION}}.

Auth type: {{AUTH_TYPE}}

Cover:
- 200 success with valid payload
- 400 validation errors (missing/invalid fields)
- 401/403 unauthorized/forbidden
- 404 not found
- 500 upstream failure (mock the external dependency)
- Rate limiting / idempotency if applicable

Use test fixtures, not production data. Mock all external services.`,
  },
  // ── Architecture ──
  {
    id: 11, category: 'architecture', starred: false, uses: 61,
    title: 'Design a microservice boundary',
    summary: 'Identify where to split a monolith into services',
    tags: ['architecture', 'microservices', 'design'],
    source: 'System Design Vibe Patterns',
    vars: ['DOMAIN_DESCRIPTION', 'SCALE_REQUIREMENT'],
    template: `Design the service boundary for this domain: {{DOMAIN_DESCRIPTION}}

Scale requirement: {{SCALE_REQUIREMENT}}

Provide:
1. Proposed service split (with rationale)
2. API contracts between services (REST/gRPC/events)
3. Data ownership — which service owns which table/collection
4. Synchronous vs asynchronous communication patterns
5. Where eventual consistency is acceptable vs where strong consistency is required
6. Failure modes and resilience strategies (circuit breaker, retry, fallback)`,
  },
  {
    id: 12, category: 'architecture', starred: true, uses: 88,
    title: 'State machine design',
    summary: 'Model a complex workflow as a typed finite state machine',
    tags: ['architecture', 'state-machine', 'typescript'],
    source: 'Aluminum OS Forge Library',
    vars: ['DOMAIN', 'STATES', 'TRANSITIONS'],
    template: `Design a finite state machine for {{DOMAIN}}.

States: {{STATES}}
Transitions: {{TRANSITIONS}}

Implement in TypeScript with:
- Discriminated union types for each state
- Event/action types for each transition
- Pure transition function: (state, event) => state
- Guard conditions where a transition has prerequisites
- Entry/exit actions (if needed)
- A visualization comment showing the state diagram
- Unit tests for each valid and invalid transition`,
  },
  // ── Review ──
  {
    id: 13, category: 'review', starred: false, uses: 99,
    title: 'Security review checklist',
    summary: 'OWASP-aligned security review for a code block',
    tags: ['security', 'owasp', 'review'],
    source: 'OWASP AI Security Patterns',
    vars: ['CODE'],
    template: `Perform a security review of this code using the OWASP Top 10 as a baseline:

\`\`\`
{{CODE}}
\`\`\`

Check for:
1. Injection (SQL, command, XSS)
2. Authentication/authorization gaps
3. Sensitive data exposure (hardcoded secrets, logging PII)
4. Missing input validation
5. Insecure deserialization
6. Security misconfiguration
7. Dependency vulnerabilities (flag any imports to check)

For each finding: severity (CRITICAL/HIGH/MEDIUM/LOW), location, and fix.`,
  },
  // ── Docs ──
  {
    id: 14, category: 'docs', starred: false, uses: 74,
    title: 'Write JSDoc / docstrings for a module',
    summary: 'Add comprehensive documentation to an undocumented code file',
    tags: ['docs', 'jsdoc', 'docstrings'],
    source: 'GitHub Copilot Community',
    vars: ['CODE'],
    template: `Add comprehensive documentation to this code:

\`\`\`
{{CODE}}
\`\`\`

For every exported function/type/class, add:
- One-line summary (what it does, not how)
- @param descriptions with types and constraints
- @returns description with possible values
- @throws if errors are thrown
- @example with a realistic usage snippet
- Mark any non-obvious edge cases with inline comments

Style: JSDoc for JS/TS, Google-style docstrings for Python, Rustdoc for Rust.`,
  },
  // ── Aluminum OS ──
  {
    id: 15, category: 'aluminum-os', starred: true, uses: 47,
    title: 'New Aluminum OS App component',
    summary: 'Scaffold a new OS app following Aluminum OS conventions',
    tags: ['aluminum-os', 'react', 'component', 'scaffold'],
    source: 'Aluminum OS Forge Library',
    vars: ['APP_NAME', 'APP_ID', 'DESCRIPTION'],
    template: `Create a new Aluminum OS app component named {{APP_NAME}}App.tsx.

App ID: {{APP_ID}}
Description: {{DESCRIPTION}}

Follow Aluminum OS conventions:
- Dark theme: bg-[#05070f], borders: border-[#141c2f], text-gray-200
- Monospace accent labels in text-[8px] font-mono tracking-widest uppercase
- Color palette: gold #ffd700, cyan #22d3ee, green #34d399, purple #a78bfa
- Glass surfaces: bg-[#0a0f1e] with border-[#1f2937]
- Header bar with app icon, title + ALUM-DEV-XXX identifier, status badge
- Lucide React icons only (no other icon libs)
- Export as \`export default function {{APP_NAME}}App()\`
- Register in AppLauncher.tsx and Desktop.tsx (show the exact additions)`,
  },
  {
    id: 16, category: 'aluminum-os', starred: true, uses: 38,
    title: 'Forge governance verdict integration',
    summary: 'Add constitutional Pendragon verdict scoring to any component',
    tags: ['aluminum-os', 'forge', 'governance', 'pendragon'],
    source: 'Aluminum OS Forge Library',
    vars: ['COMPONENT_NAME'],
    template: `Add constitutional Pendragon governance verdict scoring to {{COMPONENT_NAME}}.

Requirements:
1. Import / inline the ForgeMetrics type (sovereignty, power, synthesis, dignity, surplus: number)
2. Implement computeNPFM(m: ForgeMetrics): number
   Formula: (grey/100 × jedi/100) - (1 - sith/100) × 0.5
   where jedi = sov*0.55 + dig*0.45, sith = power, grey = syn*0.6 + ((jedi+sith)/2)*0.4
3. Implement generateVerdict(m, input) → ForgeVerdict
   Evaluate 6 Pendragon protocols (CAAL, MissionAlloc, DigitalHabeas, LocalFirst, FractalGov, Clause81)
   Return: { overall_verdict: 'Approved'|'Conditional'|'Rejected', npfm_score, protocol_results, recommendation }
4. Display inline: NPFM value (±X.XXX), verdict badge, "N/6 protocols" count
5. Match Forge color scheme (green=Approved, amber=Conditional, red=Rejected)`,
  },
  {
    id: 17, category: 'aluminum-os', starred: false, uses: 22,
    title: 'Kintsugi OPA policy for new rule',
    summary: 'Write a new Kintsugi constitutional rule in Rego (OPA)',
    tags: ['kintsugi', 'opa', 'rego', 'governance'],
    source: 'Aluminum OS Forge Library',
    vars: ['RULE_ID', 'RULE_NAME', 'CONSTRAINT'],
    template: `Write a new Kintsugi constitutional rule in Rego (OPA).

Rule ID: {{RULE_ID}} (e.g. KINTSUGI-017)
Rule Name: {{RULE_NAME}}
Constraint: {{CONSTRAINT}}

Requirements:
- Package: constitutional_audit
- Input: { action, agent_id, resource, locality, consent_given, metadata }
- Output: deny set with descriptive violation messages
- Allow block when constraint is satisfied
- Add a comment block explaining the constitutional rationale
- Include 3 test cases in a companion _test.rego file
- Keep rules composable with existing KINTSUGI-001 through KINTSUGI-016`,
  },
  {
    id: 18, category: 'aluminum-os', starred: false, uses: 15,
    title: 'forge-cli subcommand',
    summary: 'Add a new subcommand to the Forge unified CLI (Rust)',
    tags: ['forge-cli', 'rust', 'cli', 'aluminum-os'],
    source: 'Aluminum OS Forge Library',
    vars: ['COMMAND_NAME', 'DESCRIPTION'],
    template: `Add a new subcommand \`forge {{COMMAND_NAME}}\` to the forge-cli Rust binary.

Description: {{DESCRIPTION}}

Requirements:
- Add to the Commands enum in forge-cli/src/main.rs
- Create forge-cli/src/{{COMMAND_NAME}}.rs with all logic
- Use only std lib (zero external deps — this is constitutional)
- Accept optional positional argument and/or --flag options
- Render output with the existing render::* helpers
- Print constitutional alignment banner at top of output
- Return ExitCode::SUCCESS or ExitCode::FAILURE appropriately
- Add at least 2 unit tests in a #[cfg(test)] module
- Update the help text in main.rs`,
  },
  {
    id: 19, category: 'generation', starred: false, uses: 91,
    title: 'Python class with dataclass + validation',
    summary: 'Python dataclass with type hints, validators, and __repr__',
    tags: ['python', 'dataclass', 'validation'],
    source: 'Vibe Coding Community',
    vars: ['CLASS_NAME', 'FIELDS', 'CONSTRAINTS'],
    template: `Create a Python dataclass {{CLASS_NAME}} with these fields: {{FIELDS}}

Constraints: {{CONSTRAINTS}}

Requirements:
- Use @dataclass(frozen=True) for immutability where sensible
- Add __post_init__ validation with clear ValueError messages
- Type hints on every field (use Optional[X] for nullable)
- Include a @classmethod from_dict(d: dict) constructor
- Add a to_dict() → dict method
- Write 3 pytest tests: valid creation, validation failure, round-trip dict
- PEP 257 docstrings on class and methods`,
  },
  {
    id: 20, category: 'debugging', starred: false, uses: 53,
    title: 'Memory leak / performance profiling',
    summary: 'Identify memory leaks and bottlenecks in a code block',
    tags: ['performance', 'memory', 'profiling'],
    source: 'Vibe Coding Community',
    vars: ['CODE'],
    template: `Analyze this code for memory leaks and performance bottlenecks:

\`\`\`
{{CODE}}
\`\`\`

Identify:
1. Objects/closures held in memory longer than needed
2. Missing cleanup (event listeners, timers, subscriptions)
3. Unnecessary re-renders or re-computations
4. Expensive operations in hot paths (loops, frequent calls)
5. Large allocations that could be streamed or chunked

For each issue: location, impact (HIGH/MEDIUM/LOW), and the corrected version.`,
  },
];

const ALL_CATS = Object.keys(CAT_CFG) as Category[];

export default function PromptLibraryApp() {
  const [prompts, setPrompts] = useState<Prompt[]>(PROMPTS);
  const [selectedId, setSelectedId]   = useState<number>(1);
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState<Category | 'all'>('all');
  const [starOnly, setStarOnly]       = useState(false);
  const [copied, setCopied]           = useState(false);
  const [showVars, setShowVars]       = useState(true);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return prompts.filter(p => {
      if (starOnly && !p.starred) return false;
      if (catFilter !== 'all' && p.category !== catFilter) return false;
      if (q && !p.title.toLowerCase().includes(q) &&
               !p.summary.toLowerCase().includes(q) &&
               !p.tags.some(t => t.includes(q)) &&
               !p.template.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [prompts, search, catFilter, starOnly]);

  const selected = prompts.find(p => p.id === selectedId) ?? prompts[0];

  function handleCopy() {
    navigator.clipboard.writeText(selected.template).catch(() => {});
    setPrompts(prev => prev.map(p => p.id === selected.id ? { ...p, uses: p.uses + 1 } : p));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function toggleStar(id: number) {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, starred: !p.starred } : p));
  }

  // Highlight {{VARIABLE}} placeholders in the template
  function renderTemplate(template: string) {
    if (!showVars) return <span>{template}</span>;
    const parts = template.split(/({{[^}]+}})/g);
    return <>{parts.map((part, i) =>
      /^{{[^}]+}}$/.test(part)
        ? <span key={i} className="px-0.5 rounded text-[#ffd700] bg-[#ffd700]/10 font-semibold">{part}</span>
        : <span key={i}>{part}</span>
    )}</>;
  }

  const catCfg = CAT_CFG[selected.category];

  return (
    <div className="flex h-full bg-[#05070f] text-gray-200 overflow-hidden">
      {/* ── Left sidebar ── */}
      <div className="flex flex-col w-64 border-r border-[#141c2f] flex-shrink-0">
        {/* Header */}
        <div className="p-3 border-b border-[#141c2f] bg-black/30">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} style={{ color: '#ffd700' }} />
            <span className="text-xs font-bold tracking-widest text-gray-100 uppercase">Prompt Library</span>
            <span className="ml-auto text-[9px] font-mono" style={{ color: '#ffd700' }}>ALUM-DEV-003</span>
          </div>
          {/* Search */}
          <div className="flex items-center gap-1.5 bg-[#0a0f1e] border border-[#1f2937] rounded px-2 py-1.5 mb-2">
            <Search size={10} className="text-[#4b5563] flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search prompts…"
              className="flex-1 bg-transparent text-[10px] text-gray-300 outline-none placeholder:text-[#374151]"
            />
          </div>
          {/* Star filter */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => setStarOnly(s => !s)}
              className={`flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.5 rounded border transition-colors ${starOnly ? 'border-[#fbbf24]/40 text-[#fbbf24] bg-[#fbbf24]/10' : 'border-[#1f2937] text-[#4b5563] hover:text-[#6b7280]'}`}>
              <Star size={8} />STARRED
            </button>
            <span className="ml-auto text-[8px] text-[#374151] font-mono">{filtered.length}/{prompts.length}</span>
          </div>
        </div>

        {/* Category pills */}
        <div className="px-2 pt-2 pb-1 border-b border-[#141c2f] flex flex-wrap gap-1">
          <button onClick={() => setCatFilter('all')}
            className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors ${catFilter === 'all' ? 'border-white/20 text-gray-200 bg-white/10' : 'border-[#1f2937] text-[#374151] hover:text-[#6b7280]'}`}>
            ALL
          </button>
          {ALL_CATS.map(cat => {
            const cfg = CAT_CFG[cat];
            const active = catFilter === cat;
            return (
              <button key={cat} onClick={() => setCatFilter(active ? 'all' : cat)}
                className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors flex items-center gap-0.5`}
                style={{
                  borderColor: active ? cfg.color + '60' : '#1f2937',
                  color:       active ? cfg.color        : '#374151',
                  background:  active ? cfg.color + '15' : 'transparent',
                }}>
                {cfg.icon}<span className="hidden lg:inline">{cfg.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt list */}
        <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-[10px] text-[#374151]">No prompts match your filters</div>
          )}
          {filtered.map(p => {
            const cfg = CAT_CFG[p.category];
            return (
              <button key={p.id} onClick={() => setSelectedId(p.id)}
                className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors ${selectedId === p.id ? 'bg-[#0a0f1e] border border-[#1f2937]' : 'hover:bg-white/[0.02] border border-transparent'}`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span style={{ color: cfg.color, opacity: 0.7 }}>{cfg.icon}</span>
                  {p.starred && <Star size={8} fill="#fbbf24" className="text-[#fbbf24] flex-shrink-0" />}
                  <span className="text-[10px] font-medium text-gray-300 truncate flex-1">{p.title}</span>
                </div>
                <p className="text-[8px] text-[#4b5563] truncate">{p.summary}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[7px] font-mono" style={{ color: cfg.color + '80' }}>{cfg.label}</span>
                  <span className="ml-auto text-[7px] font-mono text-[#1f2937]">{p.uses} uses</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main detail ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Detail header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#141c2f] bg-black/20 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span style={{ color: catCfg.color }}>{catCfg.icon}</span>
              <h2 className="text-sm font-semibold text-gray-100 truncate">{selected.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono px-1.5 rounded border" style={{ color: catCfg.color, borderColor: catCfg.color + '40', background: catCfg.color + '10' }}>{catCfg.label}</span>
              <p className="text-[9px] text-[#4b5563] truncate">{selected.summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setShowVars(v => !v)}
              className={`flex items-center gap-1 px-2 py-1.5 text-[8px] font-mono rounded border transition-colors ${showVars ? 'border-[#ffd700]/40 text-[#ffd700] bg-[#ffd700]/10' : 'border-[#1f2937] text-[#374151]'}`}>
              <Hash size={9} />VARS
            </button>
            <button onClick={() => toggleStar(selected.id)}
              className={`p-1.5 rounded border transition-colors ${selected.starred ? 'border-[#fbbf24]/40 bg-[#fbbf24]/10 text-[#fbbf24]' : 'border-[#1f2937] text-[#374151] hover:text-[#fbbf24]'}`}>
              <Star size={12} fill={selected.starred ? '#fbbf24' : 'none'} />
            </button>
            <button onClick={handleCopy}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[10px] font-mono font-bold transition-all ${copied ? 'border-[#34d399]/40 bg-[#34d399]/10 text-[#34d399]' : 'border-[#ffd700]/30 bg-[#ffd700]/5 text-[#ffd700] hover:bg-[#ffd700]/10'}`}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'COPIED!' : 'COPY'}
            </button>
          </div>
        </div>

        {/* Variables strip */}
        {selected.vars.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-1.5 border-b border-[#141c2f] bg-black/10 flex-shrink-0">
            <span className="text-[8px] font-mono text-[#374151]">VARS</span>
            {selected.vars.map(v => (
              <span key={v} className="text-[8px] font-mono px-1.5 py-0.5 rounded text-[#ffd700] bg-[#ffd700]/10 border border-[#ffd700]/20">{`{{${v}}}`}</span>
            ))}
            <span className="ml-auto text-[7px] font-mono text-[#374151]">
              {selected.uses} uses · {selected.source}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex items-center gap-1.5 px-4 py-1.5 border-b border-[#141c2f] bg-black/5 flex-shrink-0 flex-wrap">
          {selected.tags.map(tag => (
            <span key={tag} className="text-[7px] font-mono px-1.5 py-0.5 rounded border border-[#1f2937] text-[#4b5563]">{tag}</span>
          ))}
        </div>

        {/* Template display */}
        <div className="flex-1 overflow-auto p-4">
          <pre className="font-mono text-[11px] leading-relaxed text-gray-300 whitespace-pre-wrap p-4 rounded-xl border border-[#1f2937] bg-[#030508]">
            {renderTemplate(selected.template)}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[#141c2f] bg-black/20 text-[8px] font-mono text-[#374151] flex-shrink-0">
          <span>{selected.template.split('\n').length} lines</span>
          <span>{selected.vars.length} variables</span>
          <span style={{ color: catCfg.color }}>{catCfg.label}</span>
          <span className="ml-auto flex items-center gap-1 text-[#1f2937]">
            <Sparkles size={8} />{selected.uses} uses
          </span>
        </div>
      </div>
    </div>
  );
}
