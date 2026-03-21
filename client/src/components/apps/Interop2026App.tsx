import { useState, useEffect, useMemo } from 'react';
import {
  Globe, CheckCircle, AlertTriangle, Clock, ChevronRight, Shield,
  Layers, Zap, Eye, Layout, Play, Pause, Volume2, Navigation,
  Box, Scroll, Sparkles, Wifi, Video, Code, ArrowRight,
  BarChart3, Target, ExternalLink, Cpu, Lock, Heart
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// INTEROP 2026 COMPLIANCE DASHBOARD
// Source: https://webkit.org/blog/17818/announcing-interop-2026/
// Date: Feb 12, 2026
// Collaborators: Apple (WebKit), Google (Chrome), Igalia,
//                Microsoft (Edge), Mozilla (Firefox)
// 20 focus areas mapped to Aluminum OS cross-platform strategy
// ═══════════════════════════════════════════════════════════════

type TabId = 'dashboard' | 'details' | 'roadmap' | 'constitutional';

interface InteropFeature {
  id: string;
  name: string;
  category: 'CSS' | 'JavaScript' | 'HTML' | 'API' | 'Compat';
  status: 'Compliant' | 'Partial' | 'Planned' | 'Monitoring';
  carryover: boolean;
  description: string;
  cssExample?: string;
  aluminumRelevance: string;
  aluminumComponents: string[];
  constitutionalAlignment: string[];
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  browserSupport: { chrome: number; safari: number; firefox: number; edge: number };
  icon: React.ReactNode;
  color: string;
}

const FEATURES: InteropFeature[] = [
  {
    id: 'anchor-positioning', name: 'Anchor Positioning', category: 'CSS',
    status: 'Compliant', carryover: true,
    description: 'Position elements relative to each other without JavaScript. Enables tooltips, popovers, and context menus that follow their anchor elements across layout changes.',
    aluminumRelevance: 'Dock tooltips, context menus, window controls, Agent Shell autocomplete dropdowns, Council member status popovers',
    aluminumComponents: ['Dock', 'ContextMenu', 'Window', 'AgentShell', 'TopBar'],
    constitutionalAlignment: ['INV-8: Human override UI must be reliably positioned'],
    priority: 'Critical', icon: <Target className="w-4 h-4" />, color: '#06b6d4',
    browserSupport: { chrome: 95, safari: 88, firefox: 82, edge: 95 },
  },
  {
    id: 'advanced-attr', name: 'Advanced attr()', category: 'CSS',
    status: 'Planned', carryover: false,
    description: 'CSS attr() across all properties with type conversion — use HTML attribute values as colors, lengths, angles. Bridge structural data and visual presentation without JavaScript.',
    cssExample: '.sphere[data-health] { --h: attr(data-health number); background: oklch(var(--h) 0.2 200); }',
    aluminumRelevance: 'Dynamic sphere health indicators, trust score visualization, constitutional rule severity coloring — all data-driven from HTML attributes',
    aluminumComponents: ['SpheresApp', 'CouncilApp', 'GovernanceApp', 'UnifiedFieldApp'],
    constitutionalAlignment: ['Data-driven UI reduces JS attack surface'],
    priority: 'Medium', icon: <Code className="w-4 h-4" />, color: '#f59e0b',
    browserSupport: { chrome: 40, safari: 20, firefox: 30, edge: 40 },
  },
  {
    id: 'container-style-queries', name: 'Container Style Queries', category: 'CSS',
    status: 'Compliant', carryover: false,
    description: 'Apply styles conditionally based on custom property values at a container. Respond to theme values, state flags, and contextual data.',
    cssExample: '@container style(--platform: ios) { .dock { padding-bottom: env(safe-area-inset-bottom); } }',
    aluminumRelevance: 'Platform-adaptive UI: iOS safe areas, Android navigation bars, ChromeOS shelf integration, Amazon Fire layout — all via style queries instead of JS detection',
    aluminumComponents: ['Dock', 'TopBar', 'Window', 'Desktop', 'AppLauncher'],
    constitutionalAlignment: ['Cross-platform equity — same constitutional protections regardless of platform'],
    priority: 'Critical', icon: <Box className="w-4 h-4" />, color: '#8b5cf6',
    browserSupport: { chrome: 90, safari: 92, firefox: 75, edge: 90 },
  },
  {
    id: 'contrast-color', name: 'contrast-color()', category: 'CSS',
    status: 'Compliant', carryover: false,
    description: 'Browser automatically picks black or white text for highest contrast against any background color. Simplifies accessible design systems.',
    cssExample: '.council-badge { background: var(--model-color); color: contrast-color(var(--model-color)); }',
    aluminumRelevance: 'Council member badges, trust score indicators, constitutional rule severity — automatic WCAG-compliant text contrast across all dynamic colors',
    aluminumComponents: ['CouncilApp', 'GovernanceApp', 'SpheresApp', 'VaultApp'],
    constitutionalAlignment: ['Accessibility is a constitutional right — INV-1 patient sovereignty includes readable UI'],
    priority: 'High', icon: <Eye className="w-4 h-4" />, color: '#ec4899',
    browserSupport: { chrome: 60, safari: 95, firefox: 90, edge: 60 },
  },
  {
    id: 'css-zoom', name: 'CSS Zoom', category: 'CSS',
    status: 'Compliant', carryover: true,
    description: 'Standardized zoom property that scales elements and affects layout. Unlike transform: scale(), zoom changes how elements participate in layout flow.',
    aluminumRelevance: 'Touch-first scaling for Amazon Fire tablets, accessibility zoom for healthcare apps, window content scaling across screen sizes',
    aluminumComponents: ['Window', 'Desktop', 'HealthcareApp', 'UnifiedMedicalApp'],
    constitutionalAlignment: ['Accessibility zoom for healthcare — INV-1 patient sovereignty includes readable medical data'],
    priority: 'Medium', icon: <Layout className="w-4 h-4" />, color: '#10b981',
    browserSupport: { chrome: 88, safari: 85, firefox: 70, edge: 88 },
  },
  {
    id: 'custom-highlights', name: 'Custom Highlights', category: 'CSS',
    status: 'Partial', carryover: false,
    description: '::highlight() and ::target-text pseudo-elements for styling text ranges without DOM changes. Perfect for search results, syntax highlighting, collaborative editing.',
    aluminumRelevance: 'Agent Shell syntax highlighting, Browser in-page search, constitutional rule text highlighting in Governance app, collaborative Council deliberation markers',
    aluminumComponents: ['AgentShellApp', 'BrowserApp', 'GovernanceApp', 'TruthSubstrateApp'],
    constitutionalAlignment: ['INV-5 audit trail — highlight constitutional violations in real-time'],
    priority: 'High', icon: <Sparkles className="w-4 h-4" />, color: '#f97316',
    browserSupport: { chrome: 85, safari: 80, firefox: 65, edge: 85 },
  },
  {
    id: 'dialog-popover', name: 'Dialog & Popover Additions', category: 'HTML',
    status: 'Compliant', carryover: false,
    description: 'closedby attribute for dialog dismissal control, popover="hint" for tooltips that don\'t dismiss menus, :open pseudo-class for state-based styling.',
    aluminumRelevance: 'Consent dialogs (INV-2), governance approval popups, Council voting confirmations, healthcare data access prompts — all need precise dismissal control',
    aluminumComponents: ['GovernanceApp', 'HealthcareApp', 'CouncilApp', 'VaultApp', 'AmazonApp'],
    constitutionalAlignment: ['INV-2 explicit consent — consent dialogs must not be accidentally dismissed', 'INV-8 human override — override dialogs must be reliably accessible'],
    priority: 'Critical', icon: <Layers className="w-4 h-4" />, color: '#3b82f6',
    browserSupport: { chrome: 80, safari: 75, firefox: 70, edge: 80 },
  },
  {
    id: 'fetch-uploads', name: 'Fetch Uploads & Ranges', category: 'API',
    status: 'Planned', carryover: false,
    description: 'ReadableStream request bodies for streaming uploads, Range requests for partial content. Upload large files without loading everything into memory.',
    aluminumRelevance: 'SHELDONBRAIN large data ingestion, FHIR health record uploads, PQC-signed document streaming, vault artifact uploads — all need streaming for performance',
    aluminumComponents: ['SheldonbrainEngineApp', 'VaultApp', 'HealthcareApp', 'InteropBridgeApp'],
    constitutionalAlignment: ['INV-14 encryption at rest — streaming encryption during upload'],
    priority: 'High', icon: <Zap className="w-4 h-4" />, color: '#ef4444',
    browserSupport: { chrome: 75, safari: 45, firefox: 60, edge: 75 },
  },
  {
    id: 'indexeddb-getall', name: 'getAllRecords() for IndexedDB', category: 'API',
    status: 'Planned', carryover: false,
    description: 'Bulk retrieval from IndexedDB with a single call. Replaces iterating cursors for reading multiple records.',
    aluminumRelevance: 'Offline-first OS data: cached sphere definitions, local vault index, offline Council deliberation history, cached health records for disconnected scenarios',
    aluminumComponents: ['SpheresApp', 'VaultApp', 'CouncilApp', 'MemoryApp'],
    constitutionalAlignment: ['Offline constitutional governance — rules must be enforceable even without network'],
    priority: 'Medium', icon: <Cpu className="w-4 h-4" />, color: '#14b8a6',
    browserSupport: { chrome: 50, safari: 30, firefox: 40, edge: 50 },
  },
  {
    id: 'jspi-wasm', name: 'JSPI for Wasm', category: 'JavaScript',
    status: 'Planned', carryover: false,
    description: 'JavaScript Promise Integration for WebAssembly. Allows Wasm modules to suspend and resume on async JS operations, enabling sync-looking code that awaits promises.',
    aluminumRelevance: 'Lattice Genesis PQC cryptography (Rust-WASM ML-DSA-87), sovereign_cap.rs enforcement, SHELDONBRAIN vector operations — all Rust-WASM modules benefit from JSPI',
    aluminumComponents: ['LatticeGenesisApp', 'SheldonbrainEngineApp', 'InteropBridgeApp'],
    constitutionalAlignment: ['INV-27 PQC integrity — WASM crypto modules need efficient JS interop'],
    priority: 'Critical', icon: <Lock className="w-4 h-4" />, color: '#a855f7',
    browserSupport: { chrome: 55, safari: 20, firefox: 35, edge: 55 },
  },
  {
    id: 'media-pseudo', name: 'Media Pseudo-classes', category: 'CSS',
    status: 'Compliant', carryover: false,
    description: ':playing, :paused, :muted, :volume-locked pseudo-classes for styling media elements based on playback state.',
    aluminumRelevance: 'Alexa+ voice interface state indicators, health monitoring audio alerts, Council deliberation voice playback, Browser media controls',
    aluminumComponents: ['AmazonApp', 'BrowserApp', 'WellnessApp'],
    constitutionalAlignment: ['Voice consent flow — visual state must match audio state for informed consent'],
    priority: 'Low', icon: <Play className="w-4 h-4" />, color: '#eab308',
    browserSupport: { chrome: 70, safari: 95, firefox: 80, edge: 70 },
  },
  {
    id: 'navigation-api', name: 'Navigation API', category: 'API',
    status: 'Partial', carryover: false,
    description: 'Modern replacement for history API. navigation.navigate() with intercept, transition management, and scroll restoration. Enables SPA-quality navigation in any architecture.',
    aluminumRelevance: 'OS-level app navigation, deep linking into specific app tabs (e.g., alum://governance/rule/INV-7), back/forward between apps, state preservation across app switches',
    aluminumComponents: ['Desktop', 'WindowContext', 'AppLauncher', 'Dock'],
    constitutionalAlignment: ['Navigation state must preserve constitutional context — user should never lose governance state'],
    priority: 'Critical', icon: <Navigation className="w-4 h-4" />, color: '#0ea5e9',
    browserSupport: { chrome: 90, safari: 55, firefox: 45, edge: 90 },
  },
  {
    id: 'scoped-registries', name: 'Scoped Custom Element Registries', category: 'HTML',
    status: 'Partial', carryover: false,
    description: 'Isolated custom element definitions per shadow root. Prevents naming collisions when multiple components define elements with the same tag name.',
    aluminumRelevance: 'App isolation in window system — each app can define custom elements without colliding with others. Critical for third-party Council member extensions',
    aluminumComponents: ['Window', 'Desktop', 'AppLauncher'],
    constitutionalAlignment: ['INV-7 sovereignty cap — isolated app registries prevent one provider from dominating the element namespace'],
    priority: 'High', icon: <Box className="w-4 h-4" />, color: '#6366f1',
    browserSupport: { chrome: 60, safari: 90, firefox: 40, edge: 60 },
  },
  {
    id: 'scroll-animations', name: 'Scroll-driven Animations', category: 'CSS',
    status: 'Compliant', carryover: false,
    description: 'Animations tied to scroll position. Elements animate as the user scrolls, without JavaScript scroll event listeners.',
    aluminumRelevance: '144 Spheres matrix scroll reveal, data flow animations in SHELDONBRAIN Engine, constitutional rule timeline in Governance, boot sequence parallax',
    aluminumComponents: ['SpheresApp', 'SheldonbrainEngineApp', 'GovernanceApp', 'LatticeGenesisApp'],
    constitutionalAlignment: ['Performance — CSS-only animations reduce JS thread load for constitutional enforcement'],
    priority: 'Medium', icon: <Scroll className="w-4 h-4" />, color: '#f43f5e',
    browserSupport: { chrome: 92, safari: 85, firefox: 78, edge: 92 },
  },
  {
    id: 'scroll-snap', name: 'Scroll Snap', category: 'CSS',
    status: 'Compliant', carryover: false,
    description: 'Consistent scroll snapping behavior across browsers. Elements snap to defined positions during scroll.',
    aluminumRelevance: 'App switcher on mobile (snap between apps), 144 Spheres house navigation, Council member carousel, health record timeline snapping',
    aluminumComponents: ['Desktop', 'SpheresApp', 'CouncilApp', 'HealthcareApp'],
    constitutionalAlignment: ['Touch-first UX — consistent snapping across iOS, Android, Fire tablets'],
    priority: 'High', icon: <Scroll className="w-4 h-4" />, color: '#84cc16',
    browserSupport: { chrome: 90, safari: 92, firefox: 88, edge: 90 },
  },
  {
    id: 'shape', name: 'shape()', category: 'CSS',
    status: 'Partial', carryover: false,
    description: 'CSS shape() function for complex clip paths. Define intricate shapes for elements without SVG.',
    aluminumRelevance: 'Hexagonal sphere tiles in 144 Matrix, organic shapes in Regenerative Compute visualization, Neuromorphic neuron cluster shapes',
    aluminumComponents: ['SpheresApp', 'RegenerativeApp', 'NeuromorphicApp'],
    constitutionalAlignment: ['Visual identity — distinctive shapes reinforce Aluminum OS brand'],
    priority: 'Low', icon: <Sparkles className="w-4 h-4" />, color: '#d946ef',
    browserSupport: { chrome: 50, safari: 92, firefox: 40, edge: 50 },
  },
  {
    id: 'view-transitions', name: 'View Transitions', category: 'CSS',
    status: 'Partial', carryover: false,
    description: 'Cross-document and same-document view transitions. Smooth animated transitions between pages or states.',
    aluminumRelevance: 'App switching animations (window open/close/minimize), boot sequence to desktop transition, navigation between app tabs, Council session transitions',
    aluminumComponents: ['Desktop', 'Window', 'AppLauncher', 'Dock'],
    constitutionalAlignment: ['UX continuity — transitions preserve user context during governance actions'],
    priority: 'Critical', icon: <Video className="w-4 h-4" />, color: '#0891b2',
    browserSupport: { chrome: 88, safari: 70, firefox: 55, edge: 88 },
  },
  {
    id: 'web-compat', name: 'Web Compat', category: 'Compat',
    status: 'Monitoring', carryover: false,
    description: 'Fixing real-world compatibility issues reported by developers. Ensures existing websites work consistently across browsers.',
    aluminumRelevance: 'Aluminum Browser must handle all web content consistently. Interop Bridge cross-platform relay depends on web compat for content rendering',
    aluminumComponents: ['BrowserApp', 'InteropBridgeApp'],
    constitutionalAlignment: ['Cross-platform equity — web content must render identically regardless of browser engine'],
    priority: 'Medium', icon: <Globe className="w-4 h-4" />, color: '#64748b',
    browserSupport: { chrome: 85, safari: 82, firefox: 80, edge: 85 },
  },
  {
    id: 'webrtc', name: 'WebRTC', category: 'API',
    status: 'Compliant', carryover: false,
    description: 'Real-time communication improvements for peer-to-peer audio, video, and data channels.',
    aluminumRelevance: 'Council live deliberation sessions (10 models real-time), Interop Bridge device-to-device relay, healthcare telemedicine integration, Find My Life proximity',
    aluminumComponents: ['CouncilApp', 'InteropBridgeApp', 'UnifiedMedicalApp', 'HealthcareApp'],
    constitutionalAlignment: ['INV-14 encryption — WebRTC DTLS/SRTP provides constitutional-grade E2E encryption'],
    priority: 'High', icon: <Wifi className="w-4 h-4" />, color: '#22c55e',
    browserSupport: { chrome: 88, safari: 82, firefox: 85, edge: 88 },
  },
  {
    id: 'webtransport', name: 'WebTransport', category: 'API',
    status: 'Planned', carryover: false,
    description: 'HTTP/3-based bidirectional transport. Low-latency, multiplexed streams without head-of-line blocking. Replaces WebSocket for performance-critical use cases.',
    aluminumRelevance: 'Real-time multi-model inference streaming (10 Council models), SHELDONBRAIN live vector updates, health telemetry streams, PQC-signed audit event streaming',
    aluminumComponents: ['CouncilApp', 'SheldonbrainEngineApp', 'HealthcareApp', 'TruthSubstrateApp'],
    constitutionalAlignment: ['INV-27 PQC — WebTransport enables PQC-signed streaming without WebSocket overhead'],
    priority: 'Critical', icon: <Zap className="w-4 h-4" />, color: '#f472b6',
    browserSupport: { chrome: 70, safari: 25, firefox: 50, edge: 70 },
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Compliant: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  Partial: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Planned: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  Monitoring: { bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10' },
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444', High: '#f59e0b', Medium: '#3b82f6', Low: '#64748b',
};

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'details', label: 'All Features', icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'roadmap', label: 'Roadmap', icon: <Target className="w-3.5 h-3.5" /> },
  { id: 'constitutional', label: 'Constitutional', icon: <Shield className="w-3.5 h-3.5" /> },
];

// ─── Animated value hook ───
function useAnimatedValue(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}

// ─── Dashboard Tab ───
function DashboardTab({ onSelectFeature }: { onSelectFeature: (id: string) => void }) {
  const compliant = FEATURES.filter(f => f.status === 'Compliant').length;
  const partial = FEATURES.filter(f => f.status === 'Partial').length;
  const planned = FEATURES.filter(f => f.status === 'Planned').length;
  const monitoring = FEATURES.filter(f => f.status === 'Monitoring').length;

  const overallScore = useAnimatedValue(
    Math.round((compliant * 100 + partial * 60 + planned * 20 + monitoring * 40) / FEATURES.length)
  );

  const categoryBreakdown = useMemo(() => {
    const cats = ['CSS', 'JavaScript', 'HTML', 'API', 'Compat'] as const;
    return cats.map(cat => {
      const features = FEATURES.filter(f => f.category === cat);
      const score = features.length > 0
        ? Math.round(features.reduce((sum, f) =>
            sum + (f.status === 'Compliant' ? 100 : f.status === 'Partial' ? 60 : f.status === 'Planned' ? 20 : 40), 0
          ) / features.length)
        : 0;
      return { category: cat, count: features.length, score };
    }).filter(c => c.count > 0);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-cyan-300">Interop 2026 Compliance</h3>
            <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">
              20 focus areas from Apple, Google, Microsoft, Mozilla, and Igalia — mapped to Aluminum OS cross-platform strategy.
              15 new features + 5 carryovers from Interop 2025.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Feb 12, 2026</span>
              <a href="https://webkit.org/blog/17818/announcing-interop-2026/" target="_blank" rel="noopener noreferrer"
                className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 flex items-center gap-1 hover:bg-white/10 transition-colors">
                Source <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Score + Status Grid */}
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-1 p-3 rounded-lg border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center">
          <p className="text-2xl font-bold font-mono text-cyan-400">{overallScore}%</p>
          <p className="text-[8px] text-white/25 mt-0.5">Overall Score</p>
        </div>
        {[
          { label: 'Compliant', count: compliant, color: '#10b981' },
          { label: 'Partial', count: partial, color: '#f59e0b' },
          { label: 'Planned', count: planned, color: '#3b82f6' },
          { label: 'Monitoring', count: monitoring, color: '#64748b' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] text-center">
            <p className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[8px] text-white/25 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2">Category Scores</h4>
        <div className="space-y-1.5">
          {categoryBreakdown.map(cat => (
            <div key={cat.category} className="flex items-center gap-3">
              <span className="text-[10px] text-white/40 w-16">{cat.category}</span>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${cat.score}%`,
                    background: cat.score >= 80 ? '#10b981' : cat.score >= 60 ? '#f59e0b' : '#3b82f6',
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-white/30 w-10 text-right">{cat.score}%</span>
              <span className="text-[8px] text-white/20 w-6 text-right">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Priority Features */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2">Critical Priority for Aluminum OS</h4>
        <div className="space-y-1">
          {FEATURES.filter(f => f.priority === 'Critical').map(f => {
            const sc = STATUS_COLORS[f.status];
            return (
              <div key={f.id}
                className="flex items-center gap-2.5 p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                onClick={() => onSelectFeature(f.id)}
              >
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}15` }}>
                  <div style={{ color: f.color }}>{f.icon}</div>
                </div>
                <span className="text-[10px] text-white/60 flex-1">{f.name}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                  {f.status}
                </span>
                {f.carryover && <span className="text-[7px] px-1 py-0.5 rounded bg-white/5 text-white/20">2025</span>}
                <ChevronRight className="w-3 h-3 text-white/15" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Browser Engine Participation */}
      <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2">Collaborating Browser Engines</h4>
        <div className="grid grid-cols-5 gap-2">
          {[
            { name: 'Chrome', color: '#4285F4', engine: 'Blink' },
            { name: 'Safari', color: '#999', engine: 'WebKit' },
            { name: 'Firefox', color: '#FF7139', engine: 'Gecko' },
            { name: 'Edge', color: '#0078D4', engine: 'Blink' },
            { name: 'Igalia', color: '#8b5cf6', engine: 'Contributor' },
          ].map(b => (
            <div key={b.name} className="text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: b.color }} />
              <p className="text-[9px] text-white/50">{b.name}</p>
              <p className="text-[7px] text-white/20">{b.engine}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Details Tab ───
function DetailsTab({ selectedFeature, onSelectFeature }: { selectedFeature: string | null; onSelectFeature: (id: string | null) => void }) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return FEATURES;
    if (['Compliant', 'Partial', 'Planned', 'Monitoring'].includes(filter)) return FEATURES.filter(f => f.status === filter);
    return FEATURES.filter(f => f.category === filter);
  }, [filter]);

  const selected = selectedFeature ? FEATURES.find(f => f.id === selectedFeature) : null;

  if (selected) {
    const sc = STATUS_COLORS[selected.status];
    return (
      <div className="space-y-3">
        <button onClick={() => onSelectFeature(null)} className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          <ChevronRight className="w-3 h-3 rotate-180" /> Back to all features
        </button>

        <div className="p-4 rounded-lg border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${selected.color}15` }}>
              <div style={{ color: selected.color }}>{selected.icon}</div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/80">{selected.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>{selected.status}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">{selected.category}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full border"
                  style={{ borderColor: `${PRIORITY_COLORS[selected.priority]}30`, color: PRIORITY_COLORS[selected.priority], background: `${PRIORITY_COLORS[selected.priority]}10` }}>
                  {selected.priority}
                </span>
                {selected.carryover && <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/20">Carryover from 2025</span>}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-white/40 leading-relaxed mb-3">{selected.description}</p>

          {selected.cssExample && (
            <div className="p-2 rounded bg-black/30 border border-white/5 mb-3">
              <p className="text-[8px] text-white/20 mb-1">Example</p>
              <code className="text-[9px] text-cyan-400/70 font-mono">{selected.cssExample}</code>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Aluminum OS Relevance</p>
              <p className="text-[10px] text-white/50 leading-relaxed">{selected.aluminumRelevance}</p>
            </div>

            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Affected Components</p>
              <div className="flex flex-wrap gap-1">
                {selected.aluminumComponents.map(c => (
                  <span key={c} className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400/60 border border-cyan-500/20">{c}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Constitutional Alignment</p>
              <div className="space-y-1">
                {selected.constitutionalAlignment.map((a, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Shield className="w-3 h-3 text-red-400/60 flex-shrink-0 mt-0.5" />
                    <span className="text-[9px] text-white/40">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Browser Support</p>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(selected.browserSupport).map(([browser, score]) => (
                  <div key={browser} className="text-center">
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-1">
                      <div className="h-full rounded-full" style={{
                        width: `${score}%`,
                        background: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444',
                      }} />
                    </div>
                    <p className="text-[8px] text-white/30 capitalize">{browser}</p>
                    <p className="text-[8px] font-mono" style={{ color: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444' }}>{score}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap">
        {['all', 'Compliant', 'Partial', 'Planned', 'CSS', 'API', 'HTML'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[9px] px-2 py-1 rounded-lg border transition-colors ${
              filter === f ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'text-white/30 border-transparent hover:bg-white/[0.03]'
            }`}>
            {f === 'all' ? 'All (20)' : f}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.map(f => {
          const sc = STATUS_COLORS[f.status];
          return (
            <div key={f.id}
              className="flex items-center gap-2.5 p-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
              onClick={() => onSelectFeature(f.id)}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}15` }}>
                <div style={{ color: f.color }}>{f.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-white/70">{f.name}</span>
                  <span className="text-[8px] text-white/20">{f.category}</span>
                </div>
                <p className="text-[8px] text-white/25 truncate">{f.aluminumRelevance}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>{f.status}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: PRIORITY_COLORS[f.priority] }} />
                <ChevronRight className="w-3 h-3 text-white/15" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Roadmap Tab ───
function RoadmapTab() {
  const phases = [
    {
      phase: 'Q1 2026', label: 'Foundation', color: '#06b6d4',
      features: FEATURES.filter(f => f.status === 'Compliant' && f.priority === 'Critical'),
      description: 'Already compliant critical features — anchor positioning, container queries, dialog/popover, view transitions',
    },
    {
      phase: 'Q2 2026', label: 'Enhancement', color: '#8b5cf6',
      features: FEATURES.filter(f => f.status === 'Partial'),
      description: 'Partial implementations to complete — Navigation API, Custom Highlights, Scoped Registries, View Transitions, shape()',
    },
    {
      phase: 'Q3 2026', label: 'Integration', color: '#f59e0b',
      features: FEATURES.filter(f => f.status === 'Planned' && f.priority !== 'Low'),
      description: 'New features to implement — JSPI for WASM, WebTransport, Fetch streaming, advanced attr(), IndexedDB getAllRecords()',
    },
    {
      phase: 'Q4 2026', label: 'Optimization', color: '#10b981',
      features: FEATURES.filter(f => f.status === 'Monitoring' || f.priority === 'Low'),
      description: 'Monitoring and low-priority — Web Compat tracking, Media pseudo-classes, shape() advanced usage',
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-white/30">Implementation roadmap aligned with Interop 2026 timeline and Aluminum OS priorities</p>

      {phases.map(p => (
        <div key={p.phase} className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden">
          <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2" style={{ background: `${p.color}08` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-[11px] font-semibold" style={{ color: p.color }}>{p.phase}</span>
            <span className="text-[10px] text-white/40">— {p.label}</span>
            <span className="text-[8px] text-white/20 ml-auto">{p.features.length} features</span>
          </div>
          <div className="p-3">
            <p className="text-[9px] text-white/30 mb-2">{p.description}</p>
            <div className="flex flex-wrap gap-1">
              {p.features.map(f => (
                <span key={f.id} className="text-[8px] px-1.5 py-0.5 rounded border"
                  style={{ borderColor: `${f.color}30`, color: f.color, background: `${f.color}10` }}>
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Gemini Ratification Alignment */}
      <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-semibold text-amber-400">March 31 Gemini Ratification Deadline</span>
        </div>
        <p className="text-[9px] text-white/30 leading-relaxed">
          Critical Interop 2026 features (Anchor Positioning, View Transitions, Navigation API, JSPI for WASM) align with
          Gemini's Layer 5 requirements. WebTransport enables real-time multi-model streaming for Council deliberations.
        </p>
      </div>
    </div>
  );
}

// ─── Constitutional Tab ───
function ConstitutionalTab() {
  const invariantMap = useMemo(() => {
    const map: Record<string, InteropFeature[]> = {};
    FEATURES.forEach(f => {
      f.constitutionalAlignment.forEach(a => {
        const invMatch = a.match(/INV-\d+/);
        const key = invMatch ? invMatch[0] : 'General';
        if (!map[key]) map[key] = [];
        if (!map[key].includes(f)) map[key].push(f);
      });
    });
    return map;
  }, []);

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-red-400" />
          <span className="text-[11px] font-semibold text-red-400">Constitutional Alignment Analysis</span>
        </div>
        <p className="text-[9px] text-white/30 leading-relaxed">
          Every Interop 2026 feature is evaluated for constitutional alignment. Web standards that strengthen
          consent management, accessibility, encryption, and governance get elevated priority.
        </p>
      </div>

      {/* Invariant → Feature Mapping */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2">Invariant Coverage</h4>
        <div className="space-y-2">
          {Object.entries(invariantMap).map(([inv, features]) => (
            <div key={inv} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold font-mono text-red-400">{inv}</span>
                <span className="text-[8px] text-white/20">{features.length} feature{features.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {features.map(f => (
                  <span key={f.id} className="text-[8px] px-1.5 py-0.5 rounded border"
                    style={{ borderColor: `${f.color}30`, color: f.color, background: `${f.color}10` }}>
                    {f.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Constitutional Insights */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2">Key Constitutional Insights</h4>
        <div className="space-y-2">
          {[
            { title: 'Consent Dialogs Must Not Be Accidentally Dismissed', detail: 'Dialog closedby attribute (Interop 2026) directly serves INV-2 explicit consent. Healthcare consent dialogs require closedby="none" to prevent accidental dismissal.', color: '#ef4444' },
            { title: 'PQC Cryptography Needs JSPI for WASM', detail: 'INV-27 quantum cryptographic integrity depends on Rust-WASM modules (ML-DSA-87). JSPI enables efficient async interop between WASM crypto and JS consent flows.', color: '#a855f7' },
            { title: 'WebTransport Enables Constitutional Streaming', detail: 'Real-time PQC-signed audit events, multi-model Council deliberation streams, and health telemetry all benefit from HTTP/3 multiplexed transport without head-of-line blocking.', color: '#f472b6' },
            { title: 'Cross-Platform Equity via Container Queries', detail: 'Container style queries enable platform-adaptive UI without JavaScript detection. Same constitutional protections render correctly on iOS, Android, Fire, ChromeOS.', color: '#8b5cf6' },
            { title: 'Accessibility is Constitutional', detail: 'contrast-color() and CSS Zoom directly serve INV-1 patient sovereignty — medical data must be readable. Custom Highlights enable real-time constitutional violation marking.', color: '#10b981' },
          ].map(insight => (
            <div key={insight.title} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: insight.color }} />
                <span className="text-[10px] font-semibold text-white/60">{insight.title}</span>
              </div>
              <p className="text-[9px] text-white/30 leading-relaxed">{insight.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function Interop2026App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleSelectFeature = (id: string | null) => {
    if (id) {
      setSelectedFeature(id);
      setActiveTab('details');
    } else {
      setSelectedFeature(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a12] text-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-green-500/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white/90">Interop 2026</h2>
            <p className="text-[9px] text-white/30">Cross-Browser Compliance Dashboard — 20 Focus Areas</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[8px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              {FEATURES.filter(f => f.status === 'Compliant').length}/20 Compliant
            </span>
          </div>
        </div>

        <div className="flex gap-0.5 overflow-x-auto pb-0.5 scrollbar-none">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id !== 'details') setSelectedFeature(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/30 hover:text-white/50 hover:bg-white/[0.03] border border-transparent'
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {activeTab === 'dashboard' && <DashboardTab onSelectFeature={handleSelectFeature} />}
        {activeTab === 'details' && <DetailsTab selectedFeature={selectedFeature} onSelectFeature={handleSelectFeature} />}
        {activeTab === 'roadmap' && <RoadmapTab />}
        {activeTab === 'constitutional' && <ConstitutionalTab />}
      </div>
    </div>
  );
}
