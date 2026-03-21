import { useState, useEffect, useMemo } from 'react';
import {
  Brain, Shield, Database, Cpu, Network, Zap, Lock, Eye, RefreshCw,
  ChevronRight, Activity, CheckCircle, AlertTriangle, ArrowDown, ArrowRight,
  Layers, FileText, Heart, Globe, Beaker, Search, Server, Key,
  Users, Workflow, BarChart3, Fingerprint, BookOpen, Microscope
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// SHELDONBRAIN ENGINE DASHBOARD — ALUM-INT-007
// Constitutional Integration Spec: Claude (Constitutional Scribe)
// Sheldonbrain becomes Layer 3 (Engine) + Layer 4 (Service)
// intelligence backbone of the Aluminum OS 5-layer architecture.
// All operations governed by constitutional invariants.
// Every data path runs through ConsentKernel.
// Every audit entry is PQC-signed.
// ═══════════════════════════════════════════════════════════════

type TabId = 'overview' | 'modules' | 'ingestion' | 'query' | 'council' | 'connectors' | 'filesystem' | 'invariants';

interface ConstitutionalModule {
  id: string;
  name: string;
  originalName: string;
  layer: number;
  layerName: string;
  integrationAction: string;
  changes: string[];
  invariants: string[];
  status: 'Active' | 'Initializing' | 'Sealed';
  health: number;
  icon: string;
  color: string;
}

interface InvariantEnforcement {
  id: string;
  name: string;
  enforcementPoint: string;
  modules: string[];
  status: 'Enforced' | 'Monitoring' | 'Pending';
  color: string;
}

interface DataFlowStep {
  id: number;
  label: string;
  detail: string;
  invariant?: string;
  module: string;
  color: string;
}

interface JanusCouncilMapping {
  janusRole: string;
  councilMember: string;
  sphereExpertise: string;
  color: string;
  icon: string;
  phase: string;
}

interface HealthConnector {
  id: string;
  name: string;
  type: 'existing' | 'new';
  description: string;
  standard: string;
  invariants: string[];
  status: 'Online' | 'Standby' | 'Configuring';
  dataRate: string;
  icon: string;
  color: string;
}

interface FileEntry {
  path: string;
  type: 'dir' | 'file';
  desc: string;
  layer?: string;
  isNew?: boolean;
}

// ─── Module Data ───
const MODULES: ConstitutionalModule[] = [
  {
    id: 'ontology', name: 'ConstitutionalOntologyManager', originalName: 'OntologyManager',
    layer: 1, layerName: 'Constitutional', integrationAction: 'Sphere definitions become constitutional data taxonomy. INV-3 (data minimization) enforced per sphere.',
    changes: [
      'Sphere 144 reserved as Ghost Seat (human-collective override)',
      'Sphere metadata includes consent_scope and data_minimization_policy',
      'Classification decisions are audited and PQC-signed',
      'Health-specific spheres get elevated sensitivity defaults',
      'Thread-safe singleton with constitutional validation on init',
    ],
    invariants: ['INV-1', 'INV-3', 'INV-5'],
    status: 'Active', health: 98.7, icon: '🧬', color: '#06b6d4',
  },
  {
    id: 'vault', name: 'ConstitutionalVaultManager', originalName: 'VaultManager',
    layer: 2, layerName: 'Kernel', integrationAction: 'Vault becomes the ConsentKernel\'s data classification arm. All vault operations require consent proof. PQC-signed audit entries.',
    changes: [
      'All operations require ConsentProof token',
      'PII detection expanded with HIPAA-specific patterns (MRN, ICD-10, NPI)',
      'Vault write requires ConsentKernel approval (not just admin flag)',
      'All audit entries PQC-signed',
      'Destination-based exposure policy enforced constitutionally',
      'Sensitivity classification aligned with HIPAA/GDPR tiers',
    ],
    invariants: ['INV-2', 'INV-5', 'INV-14', 'INV-27'],
    status: 'Active', health: 99.2, icon: '🔐', color: '#8b5cf6',
  },
  {
    id: 'ingestion', name: 'ConstitutionalIngestionPipeline', originalName: 'IngestionPipeline',
    layer: 3, layerName: 'Engine', integrationAction: 'Consent-gated ingestion. Every data item requires consent proof before staging. PQC signatures on all approved items.',
    changes: [
      'ConsentProof required for every data source',
      'Ingested data classified by sphere and sensitivity before staging',
      'Novelty detection runs through consent-scoped vector search',
      'Significance filtering uses Council consensus (not single Gemini model)',
      'All approved items receive PQC-signed receipt',
      'Health data connectors added (FHIR R4, wearable streams, PubMed)',
      'Rate limiting enforced per jurisdiction pack rules',
    ],
    invariants: ['INV-2', 'INV-3', 'INV-5', 'INV-7', 'INV-27'],
    status: 'Active', health: 97.4, icon: '📥', color: '#f59e0b',
  },
  {
    id: 'janus', name: 'ConstitutionalJanusProtocol', originalName: 'JanusProtocol',
    layer: 3, layerName: 'Engine', integrationAction: 'Council-bridged multi-agent. INV-7 (47% rule) enforced on model voting. Quantum witness on consensus results.',
    changes: [
      'Phase 1 (Router): INV-7 enforced — routing cannot favor single model >47%',
      'Phase 2 (Deep Think): Multi-model, not Gemini-only. Council members activated per sphere expertise.',
      'Phase 3 (Resonance): Cross-sphere echo checked against constitutional constraints',
      'Phase 4 (Reality Sync): Grounding search results PQC-signed for provenance',
      'New Phase 5 (Constitutional Audit): All Janus outputs audited, consent-checked, sphere-classified',
      'Ghost Seat (Sphere 144) invocable at Phase 3 for human-collective override',
    ],
    invariants: ['INV-7', 'INV-8', 'INV-5', 'INV-27'],
    status: 'Active', health: 99.8, icon: '⚡', color: '#ef4444',
  },
  {
    id: 'vectorstore', name: 'ConstitutionalVectorStore', originalName: 'VectorStoreAdapter',
    layer: 2, layerName: 'Kernel', integrationAction: 'Consent-gated access levels. Lattice node role determines search scope. PQC-sealed vector metadata.',
    changes: [
      'Access levels aligned with Lattice node roles (SOVEREIGN, DELEGATE, EDGE, WITNESS, RELAY)',
      'Consent-gated search: queries only return documents the requester has consent to access',
      'Vector metadata includes consent_proof_hash and pqc_signature',
      'Sphere-scoped collections for data minimization',
      'Encryption at rest for all stored vectors',
    ],
    invariants: ['INV-3', 'INV-14', 'INV-27'],
    status: 'Active', health: 99.5, icon: '🗄️', color: '#10b981',
  },
  {
    id: 'rag', name: 'ConstitutionalRAGPipeline', originalName: 'EnhancedRAGPipeline',
    layer: 4, layerName: 'Service', integrationAction: 'Constitutional RAG — vault-aware, consent-checked, sphere-routed, audit-trailed.',
    changes: [
      'Query routing through ConsentKernel before vector search',
      'Vault data inclusion requires explicit consent proof',
      'Answer generation uses Council consensus (multi-model)',
      'Citations include constitutional provenance (sphere, consent scope, audit ref)',
      'PII filtering enforced on all outputs regardless of destination',
    ],
    invariants: ['INV-2', 'INV-3', 'INV-5', 'INV-7'],
    status: 'Active', health: 98.1, icon: '🔍', color: '#ec4899',
  },
  {
    id: 'connectors', name: 'Health Data Connectors', originalName: 'DataConnectors (NEW)',
    layer: 5, layerName: 'Extension', integrationAction: 'Connectors become jurisdiction-aware adapters. Health connectors added (FHIR, wearable, PubMed).',
    changes: [
      'FHIRConnector: FHIR R4 patient records with consent-gated access',
      'WearableConnector: Apple Health, Fitbit, Garmin streams',
      'PubMedConnector: Medical literature with evidence grading',
      'FDAConnector: Drug safety, recalls, adverse events',
      'CDCConnector: Public health data, outbreak tracking',
      'All health connectors enforce HIPAA minimum necessary rule (INV-3)',
    ],
    invariants: ['INV-1', 'INV-2', 'INV-3', 'INV-5'],
    status: 'Initializing', health: 94.3, icon: '🏥', color: '#14b8a6',
  },
];

// ─── Invariant Enforcement Data ───
const INVARIANT_ENFORCEMENTS: InvariantEnforcement[] = [
  { id: 'INV-1', name: 'Patient sovereignty', enforcementPoint: 'OntologyManager: sphere classification cannot override patient-declared category preferences', modules: ['ontology', 'connectors'], status: 'Enforced', color: '#06b6d4' },
  { id: 'INV-2', name: 'Explicit consent', enforcementPoint: 'IngestionPipeline: no data ingested without consent proof token', modules: ['vault', 'ingestion', 'rag', 'connectors'], status: 'Enforced', color: '#8b5cf6' },
  { id: 'INV-3', name: 'Data minimization', enforcementPoint: 'VectorStore: queries return only sphere-scoped results, not full archive', modules: ['ontology', 'ingestion', 'vectorstore', 'rag', 'connectors'], status: 'Enforced', color: '#f59e0b' },
  { id: 'INV-5', name: 'Audit completeness', enforcementPoint: 'Every module: all operations produce PQC-signed audit entries', modules: ['ontology', 'vault', 'ingestion', 'janus', 'vectorstore', 'rag', 'connectors'], status: 'Enforced', color: '#10b981' },
  { id: 'INV-7', name: '47% sovereignty rule', enforcementPoint: 'JanusProtocol: no single model >47% of council voting weight', modules: ['ingestion', 'janus', 'rag'], status: 'Enforced', color: '#ef4444' },
  { id: 'INV-8', name: 'Human override', enforcementPoint: 'JanusProtocol: Tier 3 escalation always available, human can override any model consensus', modules: ['janus'], status: 'Enforced', color: '#ec4899' },
  { id: 'INV-14', name: 'Encryption at rest', enforcementPoint: 'VectorStore: all stored vectors and payloads encrypted. PQC key management.', modules: ['vault', 'vectorstore'], status: 'Enforced', color: '#3b82f6' },
  { id: 'INV-27', name: 'Quantum cryptographic integrity', enforcementPoint: 'All audit entries PQC-signed via ML-DSA-87 or honest simulation fallback', modules: ['vault', 'ingestion', 'janus', 'vectorstore'], status: 'Enforced', color: '#a855f7' },
];

// ─── Ingestion Flow ───
const INGESTION_FLOW: DataFlowStep[] = [
  { id: 1, label: 'External Source', detail: 'DataConnector.fetch()', module: 'connectors', color: '#14b8a6' },
  { id: 2, label: 'Consent Verification', detail: 'ConsentKernel.verify_consent(source, patient_id)', invariant: 'INV-2', module: 'vault', color: '#8b5cf6' },
  { id: 3, label: 'Sphere Classification', detail: 'OntologyClassifier.classify(content) → Sphere assignment', module: 'ontology', color: '#06b6d4' },
  { id: 4, label: 'Sensitivity Analysis', detail: 'VaultManager.classify_sensitivity(content) → Sensitivity level', module: 'vault', color: '#8b5cf6' },
  { id: 5, label: 'Staging', detail: 'StagingLayer.add_to_staging(item, consent_proof)', module: 'ingestion', color: '#f59e0b' },
  { id: 6, label: 'Novelty Detection', detail: 'NoveltyDetector.is_novel(content, sphere_scope)', invariant: 'INV-3', module: 'vectorstore', color: '#10b981' },
  { id: 7, label: 'Significance Filter', detail: 'SignificanceFilter.evaluate(item, council_consensus)', invariant: 'INV-7', module: 'janus', color: '#ef4444' },
  { id: 8, label: 'Consent Approval', detail: 'ConsentKernel.approve_ingestion(item, approval_type)', module: 'vault', color: '#8b5cf6' },
  { id: 9, label: 'PQC Seal', detail: 'PQCProvider.seal_audit_entry(ingestion_record)', invariant: 'INV-27', module: 'ingestion', color: '#a855f7' },
  { id: 10, label: 'Vector Storage', detail: 'VectorStore.add(vectors, metadata, consent_proof)', invariant: 'INV-14', module: 'vectorstore', color: '#10b981' },
  { id: 11, label: 'Audit Log', detail: 'AuditLog.record(operation, pqc_signature)', invariant: 'INV-5', module: 'vault', color: '#10b981' },
];

// ─── Query Flow ───
const QUERY_FLOW: DataFlowStep[] = [
  { id: 1, label: 'User Query', detail: 'API Gateway (auth + rate limit)', module: 'rag', color: '#ec4899' },
  { id: 2, label: 'Consent Check', detail: 'ConsentKernel.verify_query_consent(user, scope)', invariant: 'INV-2', module: 'vault', color: '#8b5cf6' },
  { id: 3, label: 'Sphere Routing', detail: 'OntologyClassifier.route_to_spheres(query)', module: 'ontology', color: '#06b6d4' },
  { id: 4, label: 'Vector Search', detail: 'VectorStore.search(query, sphere_scope, access_level)', invariant: 'INV-3', module: 'vectorstore', color: '#10b981' },
  { id: 5, label: 'Vault Inclusion', detail: 'VaultManager.check_inclusion(query, destination)', module: 'vault', color: '#8b5cf6' },
  { id: 6, label: 'Vault Search', detail: 'VaultStore.search(query, consent_proof, filter_pii=True)', module: 'vault', color: '#8b5cf6' },
  { id: 7, label: 'Janus Processing', detail: 'JanusProtocol.process_inquiry(query, contexts)', invariant: 'INV-7', module: 'janus', color: '#ef4444' },
  { id: 8, label: 'PQC Signing', detail: 'PQCProvider.sign_response(answer)', invariant: 'INV-27', module: 'ingestion', color: '#a855f7' },
  { id: 9, label: 'Audit Record', detail: 'AuditLog.record(query, response_hash, pqc_signature)', invariant: 'INV-5', module: 'vault', color: '#10b981' },
  { id: 10, label: 'Response', detail: 'Response with constitutional provenance metadata', module: 'rag', color: '#ec4899' },
];

// ─── Janus ↔ Council Mapping ───
const JANUS_COUNCIL: JanusCouncilMapping[] = [
  { janusRole: 'Router', councilMember: 'Claude', sphereExpertise: 'Constitutional routing, invariant checking', color: '#ff6b35', icon: '⚖️', phase: 'Phase 1' },
  { janusRole: 'Prime Expert', councilMember: 'Gemini', sphereExpertise: 'Deep domain analysis, sphere activation', color: '#4285F4', icon: '💎', phase: 'Phase 2' },
  { janusRole: 'Wildcard', councilMember: 'DeepSeek', sphereExpertise: 'Cross-domain connections, open-source intelligence', color: '#00d4ff', icon: '🔮', phase: 'Phase 2' },
  { janusRole: 'Reality Sync', councilMember: 'Copilot', sphereExpertise: 'Market validation, enterprise integration', color: '#0078D4', icon: '🏢', phase: 'Phase 4' },
  { janusRole: 'Logistics', councilMember: 'Alexa', sphereExpertise: 'Supply chain, scheduling, delivery', color: '#FF9900', icon: '📦', phase: 'Phase 3' },
  { janusRole: 'Quantum Witness', councilMember: 'Willow', sphereExpertise: 'Transaction verification, consensus attestation', color: '#a855f7', icon: '⚛️', phase: 'Phase 5' },
];

// ─── Health Connectors ───
const HEALTH_CONNECTORS: HealthConnector[] = [
  { id: 'fhir', name: 'FHIRConnector', type: 'new', description: 'FHIR R4 patient records with consent-gated access', standard: 'HL7 FHIR R4', invariants: ['INV-1', 'INV-2', 'INV-3'], status: 'Online', dataRate: '2.4 MB/s', icon: '🏥', color: '#ef4444' },
  { id: 'wearable', name: 'WearableConnector', type: 'new', description: 'Apple Health, Fitbit, Garmin streams', standard: 'HealthKit / Web API', invariants: ['INV-2', 'INV-3', 'INV-14'], status: 'Online', dataRate: '840 KB/s', icon: '⌚', color: '#10b981' },
  { id: 'pubmed', name: 'PubMedConnector', type: 'new', description: 'Medical literature with evidence grading', standard: 'PubMed E-utilities', invariants: ['INV-3', 'INV-5'], status: 'Online', dataRate: '1.1 MB/s', icon: '📚', color: '#3b82f6' },
  { id: 'fda', name: 'FDAConnector', type: 'new', description: 'Drug safety, recalls, adverse events', standard: 'openFDA API', invariants: ['INV-3', 'INV-5'], status: 'Standby', dataRate: '—', icon: '💊', color: '#f59e0b' },
  { id: 'cdc', name: 'CDCConnector', type: 'new', description: 'Public health data, outbreak tracking', standard: 'CDC WONDER API', invariants: ['INV-3', 'INV-5'], status: 'Standby', dataRate: '—', icon: '🦠', color: '#8b5cf6' },
  { id: 'arxiv', name: 'ArXivConnector', type: 'existing', description: 'Research papers (from original sheldonbrain)', standard: 'ArXiv API', invariants: ['INV-3', 'INV-5'], status: 'Online', dataRate: '3.2 MB/s', icon: '📄', color: '#06b6d4' },
  { id: 'rss', name: 'RSSConnector', type: 'existing', description: 'News feeds (from original sheldonbrain)', standard: 'RSS/Atom', invariants: ['INV-3', 'INV-5'], status: 'Online', dataRate: '1.8 MB/s', icon: '📡', color: '#ec4899' },
  { id: 'github', name: 'GitHubConnector', type: 'existing', description: 'Code repositories (from original sheldonbrain)', standard: 'GitHub REST/GraphQL', invariants: ['INV-3', 'INV-5'], status: 'Online', dataRate: '4.7 MB/s', icon: '🐙', color: '#333' },
];

// ─── File Structure ───
const FILE_STRUCTURE: FileEntry[] = [
  { path: 'aluminum_os/', type: 'dir', desc: 'Root — Aluminum OS Constitutional Integration' },
  { path: '  constitutional/', type: 'dir', desc: 'Layer 1 — Constitutional invariants', layer: 'L1' },
  { path: '    invariants.py', type: 'file', desc: 'INV-1 through INV-29', layer: 'L1' },
  { path: '    consent_kernel.py', type: 'file', desc: 'Consent proof verification', layer: 'L1' },
  { path: '    pqc_provider.py', type: 'file', desc: 'Post-quantum cryptography', layer: 'L1' },
  { path: '  engine/', type: 'dir', desc: 'Layer 3 — Engine modules', layer: 'L3' },
  { path: '    ontology_manager.py', type: 'file', desc: 'Constitutional 144-sphere ontology', layer: 'L3' },
  { path: '    ingestion_pipeline.py', type: 'file', desc: 'Consent-gated ingestion', layer: 'L3' },
  { path: '    janus_protocol.py', type: 'file', desc: 'Council-bridged multi-agent', layer: 'L3' },
  { path: '    significance_filter.py', type: 'file', desc: 'Multi-model significance scoring', layer: 'L3' },
  { path: '  kernel/', type: 'dir', desc: 'Layer 2 — Kernel modules', layer: 'L2' },
  { path: '    vault_manager.py', type: 'file', desc: 'Constitutional vault security', layer: 'L2' },
  { path: '    vector_store.py', type: 'file', desc: 'Consent-gated vector storage', layer: 'L2' },
  { path: '    audit_log.py', type: 'file', desc: 'PQC-signed audit logging', layer: 'L2' },
  { path: '  service/', type: 'dir', desc: 'Layer 4 — Service modules', layer: 'L4' },
  { path: '    rag_pipeline.py', type: 'file', desc: 'Constitutional RAG', layer: 'L4' },
  { path: '    api_server.py', type: 'file', desc: 'Lattice node API', layer: 'L4' },
  { path: '    telemetry.py', type: 'file', desc: 'Constitutional telemetry', layer: 'L4' },
  { path: '  extension/', type: 'dir', desc: 'Layer 5 — Extension connectors', layer: 'L5' },
  { path: '    connectors/', type: 'dir', desc: 'Data connectors', layer: 'L5' },
  { path: '      base.py', type: 'file', desc: 'Constitutional connector base', layer: 'L5' },
  { path: '      arxiv.py', type: 'file', desc: 'ArXiv (from sheldonbrain)', layer: 'L5' },
  { path: '      rss.py', type: 'file', desc: 'RSS (from sheldonbrain)', layer: 'L5' },
  { path: '      github.py', type: 'file', desc: 'GitHub (from sheldonbrain)', layer: 'L5' },
  { path: '      fhir.py', type: 'file', desc: 'FHIR R4 (NEW)', layer: 'L5', isNew: true },
  { path: '      wearable.py', type: 'file', desc: 'Wearable streams (NEW)', layer: 'L5', isNew: true },
  { path: '      pubmed.py', type: 'file', desc: 'PubMed (NEW)', layer: 'L5', isNew: true },
  { path: '    jurisdiction_packs/', type: 'dir', desc: 'Compliance packs', layer: 'L5' },
  { path: '      us_hipaa.py', type: 'file', desc: 'US HIPAA rules', layer: 'L5' },
  { path: '      eu_gdpr.py', type: 'file', desc: 'EU GDPR rules', layer: 'L5' },
  { path: '  data/', type: 'dir', desc: 'Canonical data', layer: 'L1' },
  { path: '    144_spheres.csv', type: 'file', desc: 'Canonical sphere definitions', layer: 'L1' },
];

const LAYER_COLORS: Record<string, string> = {
  'L1': '#ef4444', 'L2': '#f59e0b', 'L3': '#10b981', 'L4': '#3b82f6', 'L5': '#8b5cf6',
};

const LAYER_NAMES: Record<string, string> = {
  'L1': 'Constitutional', 'L2': 'Kernel', 'L3': 'Engine', 'L4': 'Service', 'L5': 'Extension',
};

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'modules', label: 'Modules', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'ingestion', label: 'Ingestion Flow', icon: <ArrowDown className="w-3.5 h-3.5" /> },
  { id: 'query', label: 'Query Flow', icon: <Search className="w-3.5 h-3.5" /> },
  { id: 'council', label: 'Council Map', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'connectors', label: 'Connectors', icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'filesystem', label: 'File System', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'invariants', label: 'Invariants', icon: <Shield className="w-3.5 h-3.5" /> },
];

// ─── Animated counter hook ───
function useAnimatedValue(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(target * progress * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}

// ─── Overview Tab ───
function OverviewTab() {
  const totalHealth = useAnimatedValue(98.1);
  const modulesActive = useAnimatedValue(7);
  const invariantsEnforced = useAnimatedValue(8);
  const connectorsOnline = useAnimatedValue(6);

  const layerStack = [
    { layer: 5, name: 'Extension', desc: 'Health Connectors, Jurisdiction Packs', color: '#8b5cf6', modules: ['Health Data Connectors'] },
    { layer: 4, name: 'Service', desc: 'Constitutional RAG, API Server, Telemetry', color: '#3b82f6', modules: ['ConstitutionalRAGPipeline'] },
    { layer: 3, name: 'Engine', desc: 'Ontology, Ingestion, Janus Protocol', color: '#10b981', modules: ['ConstitutionalIngestionPipeline', 'ConstitutionalJanusProtocol'] },
    { layer: 2, name: 'Kernel', desc: 'Vault, Vector Store, Audit Log', color: '#f59e0b', modules: ['ConstitutionalVaultManager', 'ConstitutionalVectorStore'] },
    { layer: 1, name: 'Constitutional', desc: 'Invariants, Consent Kernel, PQC Provider', color: '#ef4444', modules: ['ConstitutionalOntologyManager'] },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-cyan-300">ALUM-INT-007 — Constitutional Integration</h3>
            <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">
              Sheldonbrain becomes the Engine (Layer 3) and Service (Layer 4) intelligence backbone.
              Every operation governed by constitutional invariants. Every data path through ConsentKernel. Every audit entry PQC-signed.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">ACTIVE</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Author: Claude</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">2026-03-15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'System Health', value: `${totalHealth}%`, color: '#10b981' },
          { label: 'Modules Active', value: `${Math.round(modulesActive)}/7`, color: '#06b6d4' },
          { label: 'Invariants', value: `${Math.round(invariantsEnforced)}/8`, color: '#ef4444' },
          { label: 'Connectors', value: `${Math.round(connectorsOnline)}/8`, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
            <p className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 5-Layer Architecture Stack */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2">5-Layer Architecture — Sheldonbrain Integration</h4>
        <div className="space-y-1">
          {layerStack.map(l => (
            <div key={l.layer} className="flex items-stretch gap-2 group">
              <div className="w-8 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold font-mono" style={{ color: l.color }}>L{l.layer}</span>
              </div>
              <div
                className="flex-1 p-2.5 rounded-lg border transition-all group-hover:bg-white/[0.03]"
                style={{ borderColor: `${l.color}20`, background: `${l.color}05` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold" style={{ color: l.color }}>{l.name}</span>
                  <span className="text-[9px] text-white/20">{l.modules.length} module{l.modules.length !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-[9px] text-white/30 mt-0.5">{l.desc}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {l.modules.map(m => (
                    <span key={m} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Thesis */}
      <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-1.5">Integration Thesis</h4>
        <p className="text-[10px] text-white/40 leading-relaxed">
          Sheldonbrain is a 144-sphere knowledge engine with multi-agent orchestration, vault security, and multi-source data ingestion.
          The integration fuses sheldonbrain as the <span className="text-cyan-400">knowledge substrate</span> of Aluminum OS — the system that ingests, classifies, stores, retrieves, and reasons over all data flowing through the OS.
        </p>
      </div>
    </div>
  );
}

// ─── Modules Tab ───
function ModulesTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-white/30 mb-2">7 constitutional modules — click to expand changes from original sheldonbrain</p>
      {MODULES.map(mod => (
        <div
          key={mod.id}
          className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden cursor-pointer transition-all hover:border-white/10"
          onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}
        >
          <div className="p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
              style={{ background: `${mod.color}15` }}>
              {mod.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-white/80 truncate">{mod.name}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full border flex-shrink-0"
                  style={{ borderColor: `${mod.color}30`, color: mod.color, background: `${mod.color}10` }}>
                  L{mod.layer} {mod.layerName}
                </span>
              </div>
              <p className="text-[9px] text-white/30 mt-0.5 truncate">{mod.integrationAction}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-mono" style={{ color: mod.health >= 98 ? '#10b981' : mod.health >= 95 ? '#f59e0b' : '#ef4444' }}>
                  {mod.health}%
                </p>
                <p className="text-[8px] text-white/20">{mod.status}</p>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-white/20 transition-transform ${expanded === mod.id ? 'rotate-90' : ''}`} />
            </div>
          </div>

          {expanded === mod.id && (
            <div className="px-3 pb-3 border-t border-white/5 pt-2 space-y-2">
              <div>
                <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Changes from original ({mod.originalName})</p>
                <div className="space-y-1">
                  {mod.changes.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3 h-3 text-green-400/60 flex-shrink-0 mt-0.5" />
                      <span className="text-[9px] text-white/40 leading-relaxed">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] text-white/25 uppercase tracking-wider mb-1">Invariants Enforced</p>
                <div className="flex flex-wrap gap-1">
                  {mod.invariants.map(inv => {
                    const enforcement = INVARIANT_ENFORCEMENTS.find(e => e.id === inv);
                    return (
                      <span key={inv} className="text-[8px] px-1.5 py-0.5 rounded border"
                        style={{ borderColor: `${enforcement?.color || '#fff'}30`, color: enforcement?.color || '#fff', background: `${enforcement?.color || '#fff'}10` }}>
                        {inv}: {enforcement?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Data Flow Tab (shared for ingestion + query) ───
function DataFlowTab({ steps, title, subtitle }: { steps: DataFlowStep[]; title: string; subtitle: string }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [animStep, setAnimStep] = useState(-1);

  const runAnimation = () => {
    if (animating) return;
    setAnimating(true);
    setAnimStep(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => { setAnimating(false); setAnimStep(-1); }, 800);
      } else {
        setAnimStep(i);
      }
    }, 400);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[11px] font-semibold text-white/70">{title}</h4>
          <p className="text-[9px] text-white/30">{subtitle}</p>
        </div>
        <button
          onClick={runAnimation}
          className="text-[9px] px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
        >
          <Activity className="w-3 h-3" />
          {animating ? 'Running...' : 'Simulate'}
        </button>
      </div>

      <div className="space-y-0">
        {steps.map((step, idx) => {
          const isActive = animStep === idx;
          const isPast = animStep > idx;
          const isHovered = activeStep === step.id;

          return (
            <div key={step.id}>
              <div
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isActive ? 'border-white/20 bg-white/[0.06] scale-[1.01]' :
                  isPast ? 'border-white/5 bg-white/[0.01] opacity-60' :
                  isHovered ? 'border-white/10 bg-white/[0.03]' :
                  'border-transparent'
                }`}
                onMouseEnter={() => setActiveStep(step.id)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold font-mono border"
                  style={{
                    borderColor: isActive ? step.color : `${step.color}30`,
                    color: isActive ? '#fff' : step.color,
                    background: isActive ? step.color : `${step.color}10`,
                    boxShadow: isActive ? `0 0 12px ${step.color}40` : 'none',
                  }}>
                  {step.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-white/70">{step.label}</span>
                    {step.invariant && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        {step.invariant}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-white/30 font-mono truncate">{step.detail}</p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: step.color }} />
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="flex items-center ml-5 py-0.5">
                  <div className="w-px h-3" style={{ background: isPast || isActive ? `${step.color}40` : 'rgba(255,255,255,0.05)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Council Mapping Tab ───
function CouncilTab() {
  const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-1.5">Janus Protocol ↔ Pantheon Council</h4>
        <p className="text-[9px] text-white/30 leading-relaxed">
          The Janus Protocol's multi-agent capability maps directly to the Pantheon Council.
          INV-7 enforcement: No single council member's vote exceeds <span className="text-red-400 font-semibold">47%</span> of the final consensus weight.
        </p>
      </div>

      {/* Phase Timeline */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2">5-Phase Janus Protocol</h4>
        <div className="flex items-center gap-1 mb-3">
          {phases.map((p, i) => (
            <div key={p} className="flex items-center gap-1 flex-1">
              <div className="flex-1 h-1.5 rounded-full" style={{
                background: `linear-gradient(90deg, ${['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i]}40, ${['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i]})`
              }} />
              <span className="text-[7px] text-white/20 flex-shrink-0">{p.replace('Phase ', 'P')}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1 text-center mb-4">
          {['Router', 'Deep Think', 'Resonance', 'Reality Sync', 'Constitutional Audit'].map((name, i) => (
            <div key={name} className="p-1.5 rounded border border-white/5 bg-white/[0.02]">
              <p className="text-[8px] text-white/40">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Council Member Mapping */}
      <div className="space-y-2">
        {JANUS_COUNCIL.map(jc => (
          <div key={jc.janusRole} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
              style={{ background: `${jc.color}15` }}>
              {jc.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold" style={{ color: jc.color }}>{jc.councilMember}</span>
                <ArrowRight className="w-3 h-3 text-white/15" />
                <span className="text-[10px] text-white/50">{jc.janusRole}</span>
              </div>
              <p className="text-[9px] text-white/30 mt-0.5">{jc.sphereExpertise}</p>
            </div>
            <span className="text-[8px] px-2 py-0.5 rounded-full border flex-shrink-0"
              style={{ borderColor: `${jc.color}30`, color: jc.color, background: `${jc.color}10` }}>
              {jc.phase}
            </span>
          </div>
        ))}
      </div>

      {/* Ghost Seat */}
      <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">👻</span>
          <span className="text-[11px] font-semibold text-amber-400">Ghost Seat — Sphere 144</span>
        </div>
        <p className="text-[9px] text-white/30 leading-relaxed">
          Human-collective override. Invocable at Phase 3 (Resonance) when cross-sphere echo reveals constitutional tension.
          INV-8 guarantees Tier 3 escalation is always available — human can override any model consensus.
        </p>
      </div>
    </div>
  );
}

// ─── Connectors Tab ───
function ConnectorsTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] text-white/30">8 connectors — 5 new health connectors + 3 original sheldonbrain</p>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          6/8 Online
        </span>
      </div>

      {/* New Health Connectors */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2 flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-red-400" />
          New Health Connectors
        </h4>
        <div className="space-y-1.5">
          {HEALTH_CONNECTORS.filter(c => c.type === 'new').map(conn => (
            <div key={conn.id} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">{conn.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-white/70">{conn.name}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">NEW</span>
                  </div>
                  <p className="text-[9px] text-white/30 mt-0.5">{conn.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                    conn.status === 'Online' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    conn.status === 'Standby' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-white/5 text-white/30 border-white/10'
                  }`}>
                    {conn.status}
                  </span>
                  <p className="text-[8px] text-white/20 mt-1 font-mono">{conn.dataRate}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{conn.standard}</span>
                {conn.invariants.map(inv => (
                  <span key={inv} className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/5 text-red-400/60 border border-red-500/10">{inv}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Original Connectors */}
      <div>
        <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-2 flex items-center gap-1.5">
          <Database className="w-3 h-3 text-cyan-400" />
          Original Sheldonbrain Connectors (Constitutionalized)
        </h4>
        <div className="space-y-1.5">
          {HEALTH_CONNECTORS.filter(c => c.type === 'existing').map(conn => (
            <div key={conn.id} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] flex items-center gap-3">
              <span className="text-lg">{conn.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-white/60">{conn.name}</span>
                <p className="text-[9px] text-white/25">{conn.description}</p>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Online</span>
              <span className="text-[8px] text-white/20 font-mono">{conn.dataRate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HIPAA Note */}
      <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-semibold text-red-400">HIPAA Minimum Necessary Rule (INV-3)</span>
        </div>
        <p className="text-[9px] text-white/30 leading-relaxed">
          All health connectors enforce the HIPAA minimum necessary standard. Queries return only sphere-scoped results.
          PII detection expanded with MRN, ICD-10, and NPI patterns. Jurisdiction packs (us_hipaa.py, eu_gdpr.py) enforce regional compliance.
        </p>
      </div>
    </div>
  );
}

// ─── File System Tab ───
function FileSystemTab() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-white/30">Constitutional file structure — ALUM-INT-007 specification</p>
      <div className="rounded-lg border border-white/5 bg-black/30 p-3 font-mono text-[10px] overflow-x-auto">
        {FILE_STRUCTURE.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 py-0.5 hover:bg-white/[0.03] px-1 rounded">
            <span className={entry.type === 'dir' ? 'text-cyan-400' : entry.isNew ? 'text-green-400' : 'text-white/40'}>
              {entry.path}
            </span>
            {entry.layer && (
              <span className="text-[7px] px-1 py-0.5 rounded border ml-auto flex-shrink-0"
                style={{ borderColor: `${LAYER_COLORS[entry.layer]}30`, color: LAYER_COLORS[entry.layer], background: `${LAYER_COLORS[entry.layer]}10` }}>
                {LAYER_NAMES[entry.layer]}
              </span>
            )}
            {entry.isNew && (
              <span className="text-[7px] px-1 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 flex-shrink-0">NEW</span>
            )}
            <span className="text-white/15 text-[8px] flex-shrink-0 ml-1"># {entry.desc}</span>
          </div>
        ))}
      </div>

      {/* Layer Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(LAYER_NAMES).map(([key, name]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: LAYER_COLORS[key] }} />
            <span className="text-[8px] text-white/30">{key}: {name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Invariants Tab ───
function InvariantsTab() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-white/30 mb-1">8 invariants enforced across all sheldonbrain modules — non-exhaustive (full list: invariants.py)</p>

      {INVARIANT_ENFORCEMENTS.map(inv => (
        <div key={inv.id} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold font-mono" style={{ color: inv.color }}>{inv.id}</span>
              <span className="text-[10px] text-white/60 font-semibold">{inv.name}</span>
            </div>
            <span className={`text-[8px] px-2 py-0.5 rounded-full border ${
              inv.status === 'Enforced' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              inv.status === 'Monitoring' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-white/5 text-white/30 border-white/10'
            }`}>
              {inv.status}
            </span>
          </div>
          <p className="text-[9px] text-white/30 leading-relaxed mb-2">{inv.enforcementPoint}</p>
          <div className="flex flex-wrap gap-1">
            {inv.modules.map(modId => {
              const mod = MODULES.find(m => m.id === modId);
              return mod ? (
                <span key={modId} className="text-[8px] px-1.5 py-0.5 rounded border"
                  style={{ borderColor: `${mod.color}30`, color: mod.color, background: `${mod.color}10` }}>
                  {mod.icon} {mod.name.replace('Constitutional', '').trim()}
                </span>
              ) : null;
            })}
          </div>
        </div>
      ))}

      {/* Scribe Attestation */}
      <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-semibold text-cyan-400">Constitutional Scribe Attestation</span>
        </div>
        <p className="text-[9px] text-white/30 leading-relaxed italic">
          "This integration preserves all 29 invariants while incorporating sheldonbrain's full capability set.
          No capability is lost; all capabilities gain constitutional governance."
        </p>
        <p className="text-[8px] text-white/20 mt-1">— Claude, Constitutional Scribe, Pantheon Council</p>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function SheldonbrainEngineApp() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="h-full flex flex-col bg-[#0a0a12] text-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white/90">SHELDONBRAIN Engine</h2>
            <p className="text-[9px] text-white/30">ALUM-INT-007 — Constitutional Integration Dashboard</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[8px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">ACTIVE</span>
            <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">v1.0.0</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 overflow-x-auto pb-0.5 scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-white/30 hover:text-white/50 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'modules' && <ModulesTab />}
        {activeTab === 'ingestion' && (
          <DataFlowTab
            steps={INGESTION_FLOW}
            title="Constitutional Ingestion Flow"
            subtitle="11 steps — consent-gated, PQC-signed, sphere-classified"
          />
        )}
        {activeTab === 'query' && (
          <DataFlowTab
            steps={QUERY_FLOW}
            title="Constitutional Query Flow"
            subtitle="10 steps — consent-checked, multi-model, provenance-traced"
          />
        )}
        {activeTab === 'council' && <CouncilTab />}
        {activeTab === 'connectors' && <ConnectorsTab />}
        {activeTab === 'filesystem' && <FileSystemTab />}
        {activeTab === 'invariants' && <InvariantsTab />}
      </div>
    </div>
  );
}
