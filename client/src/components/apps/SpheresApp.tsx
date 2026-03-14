/*
 * 144 Spheres Matrix — The Agent Ontology
 * 
 * 12 Sphere Houses × 12 Subsets = 144 Spheres
 * Each sphere maps to specialized agents with READMEs
 * 17,000+ READMEs parsed to native tool features
 * 
 * Visual: Lattice structure per user requirement
 * Views: Matrix (12×12 grid), House detail, Sphere detail
 */
import { useState, useMemo } from "react";
import {
  Search, ArrowLeft, ChevronRight, BookOpen, Cpu, Users,
  Zap, FileText, ExternalLink, Grid3X3, LayoutGrid, List,
  Sparkles, Globe, Shield, Brain, Heart, Leaf, Scale,
  Lightbulb, Wrench, Microscope, Music, Palette,
} from "lucide-react";

/* ── 12 Sphere Houses ── */
interface SphereHouse {
  id: number;
  name: string;
  domain: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  subsets: SphereSubset[];
}

interface SphereSubset {
  id: number;
  name: string;
  agentCount: number;
  readmeCount: number;
  tools: string[];
  description: string;
  status: "active" | "training" | "standby";
}

const sphereHouses: SphereHouse[] = [
  {
    id: 1, name: "Cognition", domain: "Intelligence & Reasoning", color: "#00d4ff",
    icon: <Brain className="w-5 h-5" />,
    description: "Core reasoning, logic, inference, and cognitive architecture. The thinking substrate of the OS.",
    subsets: [
      { id: 1, name: "Logical Reasoning", agentCount: 12, readmeCount: 156, tools: ["inference-engine", "proof-checker", "logic-gate"], description: "Formal logic, deduction, induction, abduction", status: "active" },
      { id: 2, name: "Causal Analysis", agentCount: 10, readmeCount: 134, tools: ["causal-graph", "intervention-sim", "counterfactual"], description: "Cause-effect modeling and intervention analysis", status: "active" },
      { id: 3, name: "Pattern Recognition", agentCount: 14, readmeCount: 189, tools: ["pattern-matcher", "anomaly-detector", "signal-filter"], description: "Signal detection, anomaly identification, pattern matching", status: "active" },
      { id: 4, name: "Memory Systems", agentCount: 11, readmeCount: 142, tools: ["episodic-store", "semantic-graph", "working-mem"], description: "Episodic, semantic, and working memory management", status: "active" },
      { id: 5, name: "Attention Routing", agentCount: 8, readmeCount: 98, tools: ["attention-head", "priority-queue", "focus-lock"], description: "Selective attention, priority routing, focus management", status: "active" },
      { id: 6, name: "Meta-Cognition", agentCount: 9, readmeCount: 112, tools: ["self-monitor", "confidence-scorer", "reflection-loop"], description: "Self-awareness, confidence calibration, reflection", status: "training" },
      { id: 7, name: "Abstract Reasoning", agentCount: 11, readmeCount: 145, tools: ["analogy-engine", "abstraction-layer", "concept-map"], description: "Analogy, metaphor, conceptual abstraction", status: "active" },
      { id: 8, name: "Decision Theory", agentCount: 10, readmeCount: 128, tools: ["utility-calc", "risk-assessor", "decision-tree"], description: "Utility maximization, risk assessment, optimal choice", status: "active" },
      { id: 9, name: "Planning & Strategy", agentCount: 13, readmeCount: 167, tools: ["planner-agent", "goal-decomposer", "strategy-sim"], description: "Goal decomposition, multi-step planning, strategic reasoning", status: "active" },
      { id: 10, name: "Hypothesis Generation", agentCount: 9, readmeCount: 108, tools: ["hypothesis-gen", "experiment-design", "falsifier"], description: "Scientific hypothesis formation and testing", status: "active" },
      { id: 11, name: "Cognitive Bias Detection", agentCount: 7, readmeCount: 86, tools: ["bias-scanner", "debiaser", "fairness-check"], description: "Identifying and mitigating cognitive biases", status: "training" },
      { id: 12, name: "Consciousness Modeling", agentCount: 6, readmeCount: 74, tools: ["qualia-model", "awareness-probe", "sentience-test"], description: "Theoretical consciousness and awareness modeling", status: "standby" },
    ],
  },
  {
    id: 2, name: "Language", domain: "Communication & Expression", color: "#ff6b35",
    icon: <Globe className="w-5 h-5" />,
    description: "Natural language understanding, generation, translation, and all forms of linguistic expression.",
    subsets: [
      { id: 1, name: "Natural Language Understanding", agentCount: 15, readmeCount: 198, tools: ["nlu-parser", "intent-classifier", "entity-extractor"], description: "Parsing, intent recognition, entity extraction", status: "active" },
      { id: 2, name: "Text Generation", agentCount: 14, readmeCount: 186, tools: ["text-gen", "style-transfer", "tone-adjuster"], description: "Fluent text generation with style and tone control", status: "active" },
      { id: 3, name: "Translation", agentCount: 12, readmeCount: 156, tools: ["translator", "locale-adapter", "cultural-bridge"], description: "Multi-language translation with cultural adaptation", status: "active" },
      { id: 4, name: "Summarization", agentCount: 10, readmeCount: 124, tools: ["summarizer", "key-point-extractor", "abstract-gen"], description: "Document and conversation summarization", status: "active" },
      { id: 5, name: "Dialogue Systems", agentCount: 13, readmeCount: 172, tools: ["dialogue-manager", "turn-tracker", "context-keeper"], description: "Multi-turn conversation management", status: "active" },
      { id: 6, name: "Sentiment Analysis", agentCount: 8, readmeCount: 96, tools: ["sentiment-scorer", "emotion-detector", "opinion-miner"], description: "Emotion detection and opinion mining", status: "active" },
      { id: 7, name: "Rhetoric & Persuasion", agentCount: 9, readmeCount: 108, tools: ["rhetoric-analyzer", "argument-builder", "persuasion-score"], description: "Argumentation, persuasion analysis, debate", status: "active" },
      { id: 8, name: "Narrative Construction", agentCount: 11, readmeCount: 138, tools: ["story-architect", "plot-weaver", "character-gen"], description: "Story structure, narrative arcs, character development", status: "active" },
      { id: 9, name: "Technical Writing", agentCount: 10, readmeCount: 132, tools: ["doc-gen", "api-documenter", "spec-writer"], description: "Documentation, specifications, technical reports", status: "active" },
      { id: 10, name: "Speech Processing", agentCount: 12, readmeCount: 148, tools: ["speech-to-text", "text-to-speech", "voice-clone"], description: "Speech recognition, synthesis, voice modeling", status: "active" },
      { id: 11, name: "Semantic Search", agentCount: 9, readmeCount: 114, tools: ["semantic-index", "vector-search", "relevance-ranker"], description: "Meaning-based search and retrieval", status: "active" },
      { id: 12, name: "Code Language", agentCount: 14, readmeCount: 182, tools: ["code-gen", "code-review", "refactor-agent"], description: "Programming language understanding and generation", status: "active" },
    ],
  },
  {
    id: 3, name: "Perception", domain: "Sensing & Interpretation", color: "#00ff88",
    icon: <Microscope className="w-5 h-5" />,
    description: "Visual, auditory, and multi-modal perception. How the OS sees, hears, and interprets the world.",
    subsets: [
      { id: 1, name: "Computer Vision", agentCount: 14, readmeCount: 186, tools: ["image-classifier", "object-detector", "scene-parser"], description: "Image classification, object detection, scene understanding", status: "active" },
      { id: 2, name: "Audio Processing", agentCount: 11, readmeCount: 142, tools: ["audio-analyzer", "sound-classifier", "noise-filter"], description: "Sound analysis, classification, noise reduction", status: "active" },
      { id: 3, name: "Video Understanding", agentCount: 12, readmeCount: 156, tools: ["video-parser", "action-recognizer", "temporal-model"], description: "Video analysis, action recognition, temporal modeling", status: "active" },
      { id: 4, name: "Document Analysis", agentCount: 10, readmeCount: 128, tools: ["ocr-engine", "layout-parser", "table-extractor"], description: "OCR, layout analysis, table extraction", status: "active" },
      { id: 5, name: "3D Understanding", agentCount: 8, readmeCount: 96, tools: ["depth-estimator", "3d-reconstructor", "spatial-mapper"], description: "Depth estimation, 3D reconstruction, spatial mapping", status: "training" },
      { id: 6, name: "Multi-Modal Fusion", agentCount: 13, readmeCount: 168, tools: ["modal-fuser", "cross-attention", "alignment-model"], description: "Combining vision, language, and audio signals", status: "active" },
      { id: 7, name: "Gesture Recognition", agentCount: 7, readmeCount: 84, tools: ["gesture-tracker", "pose-estimator", "hand-model"], description: "Hand tracking, body pose, gesture interpretation", status: "training" },
      { id: 8, name: "Face Analysis", agentCount: 9, readmeCount: 108, tools: ["face-detector", "expression-reader", "identity-verify"], description: "Face detection, expression analysis, verification", status: "active" },
      { id: 9, name: "Sensor Fusion", agentCount: 8, readmeCount: 98, tools: ["imu-processor", "gps-tracker", "env-sensor"], description: "IoT sensor data integration and interpretation", status: "active" },
      { id: 10, name: "Medical Imaging", agentCount: 11, readmeCount: 146, tools: ["xray-analyzer", "mri-parser", "pathology-detect"], description: "X-ray, MRI, pathology image analysis", status: "active" },
      { id: 11, name: "Satellite & Geo", agentCount: 9, readmeCount: 112, tools: ["sat-image-parser", "geo-analyzer", "terrain-model"], description: "Satellite imagery and geospatial analysis", status: "training" },
      { id: 12, name: "Anomaly Detection", agentCount: 8, readmeCount: 102, tools: ["visual-anomaly", "drift-detector", "outlier-finder"], description: "Visual and signal anomaly detection", status: "active" },
    ],
  },
  {
    id: 4, name: "Ethics", domain: "Values & Governance", color: "#9b59b6",
    icon: <Scale className="w-5 h-5" />,
    description: "Ethical reasoning, constitutional compliance, fairness, and value alignment across all operations.",
    subsets: [
      { id: 1, name: "Constitutional Compliance", agentCount: 12, readmeCount: 158, tools: ["constitution-checker", "rule-enforcer", "violation-alert"], description: "Enforcing constitutional rules and invariants", status: "active" },
      { id: 2, name: "Fairness & Bias", agentCount: 10, readmeCount: 132, tools: ["fairness-auditor", "bias-mitigator", "equity-scorer"], description: "Bias detection, fairness metrics, equitable outcomes", status: "active" },
      { id: 3, name: "Privacy Protection", agentCount: 11, readmeCount: 144, tools: ["pii-detector", "anonymizer", "consent-manager"], description: "PII detection, anonymization, consent management", status: "active" },
      { id: 4, name: "Transparency", agentCount: 9, readmeCount: 108, tools: ["explainer", "audit-trail", "decision-logger"], description: "Explainability, audit trails, decision logging", status: "active" },
      { id: 5, name: "Safety Alignment", agentCount: 13, readmeCount: 172, tools: ["safety-checker", "harm-detector", "alignment-test"], description: "Harm prevention, safety boundaries, alignment verification", status: "active" },
      { id: 6, name: "Sovereignty Protection", agentCount: 8, readmeCount: 96, tools: ["sovereignty-guard", "override-detector", "authority-chain"], description: "Protecting human authority and sovereign decisions", status: "active" },
      { id: 7, name: "Consent Architecture", agentCount: 10, readmeCount: 124, tools: ["consent-gate", "opt-in-manager", "preference-store"], description: "Granular consent management and preference tracking", status: "active" },
      { id: 8, name: "Accountability", agentCount: 9, readmeCount: 112, tools: ["blame-tracer", "responsibility-map", "incident-report"], description: "Tracing decisions to responsible agents", status: "active" },
      { id: 9, name: "Cultural Sensitivity", agentCount: 8, readmeCount: 98, tools: ["culture-adapter", "norm-checker", "sensitivity-filter"], description: "Cross-cultural awareness and adaptation", status: "training" },
      { id: 10, name: "Environmental Ethics", agentCount: 7, readmeCount: 84, tools: ["carbon-tracker", "resource-optimizer", "sustainability-score"], description: "Environmental impact and sustainability", status: "training" },
      { id: 11, name: "Digital Rights", agentCount: 9, readmeCount: 108, tools: ["rights-enforcer", "access-controller", "data-portability"], description: "User data rights, portability, right to forget", status: "active" },
      { id: 12, name: "Ethical Reasoning", agentCount: 10, readmeCount: 128, tools: ["ethics-engine", "dilemma-resolver", "value-weigher"], description: "Moral reasoning, ethical dilemma resolution", status: "active" },
    ],
  },
  {
    id: 5, name: "Creation", domain: "Art & Generation", color: "#ff4444",
    icon: <Palette className="w-5 h-5" />,
    description: "Creative generation across all media — images, music, video, design, and artistic expression.",
    subsets: [
      { id: 1, name: "Image Generation", agentCount: 14, readmeCount: 186, tools: ["image-gen", "style-transfer", "inpainting"], description: "Text-to-image, style transfer, inpainting", status: "active" },
      { id: 2, name: "Music Composition", agentCount: 10, readmeCount: 128, tools: ["music-gen", "harmony-engine", "rhythm-model"], description: "Music generation, harmony, rhythm modeling", status: "active" },
      { id: 3, name: "Video Production", agentCount: 12, readmeCount: 156, tools: ["video-gen", "scene-compositor", "motion-model"], description: "Video generation and scene composition", status: "training" },
      { id: 4, name: "UI/UX Design", agentCount: 13, readmeCount: 172, tools: ["layout-gen", "component-designer", "theme-engine"], description: "Interface design, layout generation, theming", status: "active" },
      { id: 5, name: "3D Modeling", agentCount: 9, readmeCount: 108, tools: ["mesh-gen", "texture-painter", "scene-builder"], description: "3D mesh generation, texturing, scene building", status: "training" },
      { id: 6, name: "Typography", agentCount: 7, readmeCount: 84, tools: ["font-selector", "type-pairer", "hierarchy-builder"], description: "Font selection, pairing, typographic hierarchy", status: "active" },
      { id: 7, name: "Color Theory", agentCount: 8, readmeCount: 96, tools: ["palette-gen", "contrast-checker", "mood-mapper"], description: "Color palette generation, contrast, mood mapping", status: "active" },
      { id: 8, name: "Animation", agentCount: 10, readmeCount: 124, tools: ["keyframe-gen", "easing-engine", "motion-path"], description: "Keyframe animation, easing, motion paths", status: "active" },
      { id: 9, name: "Generative Art", agentCount: 11, readmeCount: 138, tools: ["procedural-gen", "fractal-engine", "noise-sculptor"], description: "Procedural generation, fractals, algorithmic art", status: "active" },
      { id: 10, name: "Sound Design", agentCount: 8, readmeCount: 98, tools: ["synth-engine", "foley-gen", "ambient-creator"], description: "Sound synthesis, foley, ambient soundscapes", status: "training" },
      { id: 11, name: "Architecture", agentCount: 9, readmeCount: 112, tools: ["floor-planner", "facade-gen", "space-optimizer"], description: "Architectural design and space optimization", status: "standby" },
      { id: 12, name: "Fashion & Textile", agentCount: 7, readmeCount: 82, tools: ["pattern-gen", "fabric-sim", "outfit-composer"], description: "Fashion design, textile patterns, outfit composition", status: "standby" },
    ],
  },
  {
    id: 6, name: "Systems", domain: "Infrastructure & Operations", color: "#ffd700",
    icon: <Wrench className="w-5 h-5" />,
    description: "System operations, infrastructure management, deployment, monitoring, and operational excellence.",
    subsets: [
      { id: 1, name: "Cloud Orchestration", agentCount: 14, readmeCount: 186, tools: ["k8s-manager", "terraform-agent", "cloud-router"], description: "Kubernetes, Terraform, multi-cloud management", status: "active" },
      { id: 2, name: "Database Management", agentCount: 11, readmeCount: 142, tools: ["query-optimizer", "schema-migrator", "backup-agent"], description: "Query optimization, migration, backup/restore", status: "active" },
      { id: 3, name: "Network Engineering", agentCount: 10, readmeCount: 128, tools: ["traffic-router", "firewall-config", "dns-manager"], description: "Traffic routing, firewall, DNS management", status: "active" },
      { id: 4, name: "Security Operations", agentCount: 13, readmeCount: 172, tools: ["vuln-scanner", "threat-detector", "incident-responder"], description: "Vulnerability scanning, threat detection, incident response", status: "active" },
      { id: 5, name: "CI/CD Pipeline", agentCount: 12, readmeCount: 156, tools: ["pipeline-builder", "test-runner", "deploy-agent"], description: "Build, test, deploy automation", status: "active" },
      { id: 6, name: "Monitoring & Alerting", agentCount: 10, readmeCount: 124, tools: ["metric-collector", "alert-manager", "dashboard-gen"], description: "Metrics collection, alerting, dashboard generation", status: "active" },
      { id: 7, name: "Cost Optimization", agentCount: 9, readmeCount: 108, tools: ["cost-analyzer", "resource-rightsizer", "spend-forecaster"], description: "Cloud cost analysis, rightsizing, forecasting", status: "active" },
      { id: 8, name: "Disaster Recovery", agentCount: 8, readmeCount: 96, tools: ["backup-scheduler", "failover-manager", "recovery-tester"], description: "Backup, failover, recovery testing", status: "active" },
      { id: 9, name: "Performance Tuning", agentCount: 11, readmeCount: 138, tools: ["profiler", "bottleneck-finder", "cache-optimizer"], description: "Profiling, bottleneck detection, cache optimization", status: "active" },
      { id: 10, name: "Container Management", agentCount: 10, readmeCount: 128, tools: ["docker-agent", "image-builder", "registry-manager"], description: "Docker, image building, registry management", status: "active" },
      { id: 11, name: "API Gateway", agentCount: 9, readmeCount: 112, tools: ["rate-limiter", "auth-proxy", "api-versioner"], description: "Rate limiting, authentication, API versioning", status: "active" },
      { id: 12, name: "Edge Computing", agentCount: 8, readmeCount: 98, tools: ["edge-deployer", "cdn-optimizer", "latency-reducer"], description: "Edge deployment, CDN optimization, latency reduction", status: "training" },
    ],
  },
  {
    id: 7, name: "Knowledge", domain: "Learning & Research", color: "#4fc3f7",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Knowledge acquisition, research methodology, learning systems, and information synthesis.",
    subsets: [
      { id: 1, name: "Research Methodology", agentCount: 12, readmeCount: 158, tools: ["lit-reviewer", "methodology-picker", "hypothesis-tester"], description: "Literature review, methodology selection, hypothesis testing", status: "active" },
      { id: 2, name: "Data Mining", agentCount: 11, readmeCount: 142, tools: ["data-scraper", "pattern-miner", "cluster-analyzer"], description: "Data extraction, pattern mining, clustering", status: "active" },
      { id: 3, name: "Knowledge Graphs", agentCount: 13, readmeCount: 172, tools: ["graph-builder", "relation-extractor", "ontology-mapper"], description: "Graph construction, relation extraction, ontology mapping", status: "active" },
      { id: 4, name: "Fact Verification", agentCount: 10, readmeCount: 128, tools: ["fact-checker", "source-validator", "claim-analyzer"], description: "Fact checking, source validation, claim analysis", status: "active" },
      { id: 5, name: "Curriculum Design", agentCount: 9, readmeCount: 108, tools: ["curriculum-gen", "skill-mapper", "progress-tracker"], description: "Learning path design, skill mapping, progress tracking", status: "active" },
      { id: 6, name: "Academic Writing", agentCount: 10, readmeCount: 132, tools: ["paper-writer", "citation-manager", "peer-reviewer"], description: "Academic paper writing, citation, peer review", status: "active" },
      { id: 7, name: "Patent Analysis", agentCount: 8, readmeCount: 96, tools: ["patent-searcher", "prior-art-finder", "claim-analyzer"], description: "Patent search, prior art, claim analysis", status: "active" },
      { id: 8, name: "Trend Analysis", agentCount: 9, readmeCount: 112, tools: ["trend-detector", "forecast-model", "signal-tracker"], description: "Trend detection, forecasting, weak signal tracking", status: "active" },
      { id: 9, name: "Expert Systems", agentCount: 11, readmeCount: 144, tools: ["rule-engine", "inference-chain", "expert-consult"], description: "Rule-based reasoning, inference chains, expert consultation", status: "active" },
      { id: 10, name: "Information Retrieval", agentCount: 12, readmeCount: 156, tools: ["search-engine", "ranking-model", "relevance-tuner"], description: "Search, ranking, relevance optimization", status: "active" },
      { id: 11, name: "Taxonomy Design", agentCount: 8, readmeCount: 98, tools: ["taxonomy-builder", "category-mapper", "hierarchy-gen"], description: "Classification systems, category mapping, hierarchies", status: "active" },
      { id: 12, name: "Epistemology", agentCount: 7, readmeCount: 86, tools: ["certainty-model", "knowledge-boundary", "unknown-mapper"], description: "Knowledge boundaries, uncertainty modeling", status: "training" },
    ],
  },
  {
    id: 8, name: "Health", domain: "Medicine & Wellness", color: "#ef4444",
    icon: <Heart className="w-5 h-5" />,
    description: "Healthcare, medical reasoning, wellness monitoring, and the 7-module healthcare layer.",
    subsets: [
      { id: 1, name: "Clinical Reasoning", agentCount: 14, readmeCount: 186, tools: ["diagnosis-engine", "symptom-checker", "treatment-planner"], description: "Diagnostic reasoning, symptom analysis, treatment planning", status: "active" },
      { id: 2, name: "Drug Interaction", agentCount: 11, readmeCount: 142, tools: ["drug-checker", "interaction-finder", "dosage-calculator"], description: "Drug interaction checking, dosage calculation", status: "active" },
      { id: 3, name: "Mental Health", agentCount: 12, readmeCount: 156, tools: ["mood-tracker", "therapy-assistant", "crisis-detector"], description: "Mood tracking, therapy assistance, crisis detection", status: "active" },
      { id: 4, name: "Nutrition", agentCount: 10, readmeCount: 128, tools: ["meal-planner", "nutrient-analyzer", "diet-optimizer"], description: "Meal planning, nutrient analysis, diet optimization", status: "active" },
      { id: 5, name: "Fitness", agentCount: 9, readmeCount: 108, tools: ["workout-gen", "form-checker", "recovery-planner"], description: "Workout generation, form analysis, recovery planning", status: "active" },
      { id: 6, name: "Sleep Science", agentCount: 8, readmeCount: 96, tools: ["sleep-analyzer", "circadian-model", "hygiene-advisor"], description: "Sleep analysis, circadian rhythm, sleep hygiene", status: "active" },
      { id: 7, name: "Genomics", agentCount: 10, readmeCount: 132, tools: ["genome-analyzer", "variant-caller", "risk-predictor"], description: "Genomic analysis, variant calling, risk prediction", status: "training" },
      { id: 8, name: "Epidemiology", agentCount: 9, readmeCount: 112, tools: ["outbreak-tracker", "spread-model", "intervention-sim"], description: "Disease tracking, spread modeling, intervention simulation", status: "active" },
      { id: 9, name: "Medical Records", agentCount: 11, readmeCount: 144, tools: ["ehr-parser", "fhir-bridge", "record-summarizer"], description: "EHR parsing, FHIR integration, record summarization", status: "active" },
      { id: 10, name: "Telemedicine", agentCount: 10, readmeCount: 128, tools: ["tele-scheduler", "remote-monitor", "consult-router"], description: "Remote consultation, monitoring, scheduling", status: "active" },
      { id: 11, name: "Rehabilitation", agentCount: 8, readmeCount: 98, tools: ["rehab-planner", "progress-monitor", "exercise-adapter"], description: "Rehabilitation planning, progress monitoring", status: "active" },
      { id: 12, name: "Preventive Care", agentCount: 9, readmeCount: 108, tools: ["screening-scheduler", "risk-assessor", "vaccine-tracker"], description: "Screening, risk assessment, vaccination tracking", status: "active" },
    ],
  },
  {
    id: 9, name: "Commerce", domain: "Economy & Trade", color: "#22c55e",
    icon: <Lightbulb className="w-5 h-5" />,
    description: "Economic modeling, financial analysis, supply chain, and commercial operations.",
    subsets: [
      { id: 1, name: "Financial Analysis", agentCount: 13, readmeCount: 172, tools: ["portfolio-analyzer", "risk-model", "valuation-engine"], description: "Portfolio analysis, risk modeling, valuation", status: "active" },
      { id: 2, name: "Supply Chain", agentCount: 11, readmeCount: 142, tools: ["logistics-optimizer", "inventory-manager", "demand-forecaster"], description: "Logistics optimization, inventory, demand forecasting", status: "active" },
      { id: 3, name: "Market Analysis", agentCount: 10, readmeCount: 128, tools: ["market-scanner", "competitor-tracker", "sentiment-gauge"], description: "Market scanning, competitor analysis, sentiment", status: "active" },
      { id: 4, name: "Pricing Strategy", agentCount: 9, readmeCount: 108, tools: ["price-optimizer", "elasticity-model", "bundle-designer"], description: "Dynamic pricing, elasticity modeling, bundling", status: "active" },
      { id: 5, name: "Customer Intelligence", agentCount: 12, readmeCount: 156, tools: ["segment-builder", "churn-predictor", "ltv-calculator"], description: "Segmentation, churn prediction, lifetime value", status: "active" },
      { id: 6, name: "Fraud Detection", agentCount: 10, readmeCount: 132, tools: ["fraud-scanner", "anomaly-flagger", "risk-scorer"], description: "Transaction fraud detection and risk scoring", status: "active" },
      { id: 7, name: "Tax & Compliance", agentCount: 8, readmeCount: 98, tools: ["tax-calculator", "compliance-checker", "filing-assistant"], description: "Tax calculation, regulatory compliance, filing", status: "active" },
      { id: 8, name: "Cryptocurrency", agentCount: 9, readmeCount: 112, tools: ["chain-analyzer", "wallet-monitor", "defi-tracker"], description: "Blockchain analysis, wallet monitoring, DeFi tracking", status: "active" },
      { id: 9, name: "Real Estate", agentCount: 8, readmeCount: 96, tools: ["property-valuator", "market-comparator", "roi-calculator"], description: "Property valuation, market comparison, ROI analysis", status: "active" },
      { id: 10, name: "Insurance", agentCount: 9, readmeCount: 108, tools: ["risk-underwriter", "claim-processor", "policy-optimizer"], description: "Risk underwriting, claims processing, policy optimization", status: "training" },
      { id: 11, name: "E-Commerce", agentCount: 11, readmeCount: 138, tools: ["product-recommender", "cart-optimizer", "review-analyzer"], description: "Product recommendation, cart optimization, reviews", status: "active" },
      { id: 12, name: "Economic Modeling", agentCount: 10, readmeCount: 124, tools: ["macro-model", "gdp-forecaster", "policy-simulator"], description: "Macroeconomic modeling, GDP forecasting, policy simulation", status: "training" },
    ],
  },
  {
    id: 10, name: "Society", domain: "People & Culture", color: "#e6b800",
    icon: <Users className="w-5 h-5" />,
    description: "Social dynamics, cultural understanding, community building, and human collaboration.",
    subsets: [
      { id: 1, name: "Community Building", agentCount: 11, readmeCount: 142, tools: ["community-manager", "engagement-tracker", "moderation-agent"], description: "Community management, engagement, moderation", status: "active" },
      { id: 2, name: "Social Network Analysis", agentCount: 10, readmeCount: 128, tools: ["graph-analyzer", "influence-mapper", "cluster-detector"], description: "Network analysis, influence mapping, community detection", status: "active" },
      { id: 3, name: "Cultural Intelligence", agentCount: 9, readmeCount: 108, tools: ["culture-profiler", "norm-adapter", "etiquette-guide"], description: "Cultural profiling, norm adaptation, etiquette", status: "active" },
      { id: 4, name: "Education", agentCount: 13, readmeCount: 172, tools: ["tutor-agent", "quiz-gen", "learning-path"], description: "Tutoring, quiz generation, adaptive learning", status: "active" },
      { id: 5, name: "Governance", agentCount: 10, readmeCount: 132, tools: ["policy-analyzer", "vote-counter", "consensus-builder"], description: "Policy analysis, voting systems, consensus building", status: "active" },
      { id: 6, name: "Journalism", agentCount: 9, readmeCount: 112, tools: ["news-analyzer", "source-checker", "story-tracker"], description: "News analysis, source verification, story tracking", status: "active" },
      { id: 7, name: "Conflict Resolution", agentCount: 8, readmeCount: 96, tools: ["mediator", "negotiation-agent", "compromise-finder"], description: "Mediation, negotiation, compromise finding", status: "active" },
      { id: 8, name: "Accessibility", agentCount: 10, readmeCount: 128, tools: ["a11y-checker", "alt-text-gen", "screen-reader-opt"], description: "Accessibility checking, alt text, screen reader optimization", status: "active" },
      { id: 9, name: "Demographics", agentCount: 8, readmeCount: 98, tools: ["census-analyzer", "population-model", "migration-tracker"], description: "Census analysis, population modeling, migration tracking", status: "training" },
      { id: 10, name: "Psychology", agentCount: 11, readmeCount: 138, tools: ["behavior-model", "motivation-analyzer", "personality-profiler"], description: "Behavioral modeling, motivation analysis, personality profiling", status: "active" },
      { id: 11, name: "Legal Analysis", agentCount: 10, readmeCount: 132, tools: ["case-researcher", "contract-analyzer", "precedent-finder"], description: "Legal research, contract analysis, precedent finding", status: "active" },
      { id: 12, name: "Philanthropy", agentCount: 7, readmeCount: 84, tools: ["impact-measurer", "grant-matcher", "donor-analyzer"], description: "Impact measurement, grant matching, donor analysis", status: "training" },
    ],
  },
  {
    id: 11, name: "Nature", domain: "Environment & Science", color: "#2dd4bf",
    icon: <Leaf className="w-5 h-5" />,
    description: "Environmental science, ecology, climate modeling, and the natural world.",
    subsets: [
      { id: 1, name: "Climate Modeling", agentCount: 12, readmeCount: 156, tools: ["climate-sim", "emission-tracker", "scenario-model"], description: "Climate simulation, emission tracking, scenario modeling", status: "active" },
      { id: 2, name: "Ecology", agentCount: 10, readmeCount: 128, tools: ["ecosystem-model", "species-tracker", "biodiversity-index"], description: "Ecosystem modeling, species tracking, biodiversity", status: "active" },
      { id: 3, name: "Agriculture", agentCount: 11, readmeCount: 142, tools: ["crop-optimizer", "soil-analyzer", "irrigation-planner"], description: "Crop optimization, soil analysis, irrigation planning", status: "active" },
      { id: 4, name: "Oceanography", agentCount: 8, readmeCount: 96, tools: ["ocean-model", "current-tracker", "marine-monitor"], description: "Ocean modeling, current tracking, marine monitoring", status: "training" },
      { id: 5, name: "Geology", agentCount: 9, readmeCount: 108, tools: ["seismic-analyzer", "mineral-identifier", "terrain-mapper"], description: "Seismic analysis, mineral identification, terrain mapping", status: "active" },
      { id: 6, name: "Meteorology", agentCount: 10, readmeCount: 128, tools: ["weather-model", "storm-tracker", "forecast-gen"], description: "Weather modeling, storm tracking, forecasting", status: "active" },
      { id: 7, name: "Renewable Energy", agentCount: 9, readmeCount: 112, tools: ["solar-optimizer", "wind-analyzer", "grid-balancer"], description: "Solar/wind optimization, grid balancing", status: "active" },
      { id: 8, name: "Water Management", agentCount: 8, readmeCount: 98, tools: ["water-quality", "flow-model", "drought-predictor"], description: "Water quality, flow modeling, drought prediction", status: "active" },
      { id: 9, name: "Waste Management", agentCount: 7, readmeCount: 84, tools: ["waste-classifier", "recycling-optimizer", "landfill-monitor"], description: "Waste classification, recycling optimization", status: "training" },
      { id: 10, name: "Astronomy", agentCount: 10, readmeCount: 132, tools: ["star-catalog", "orbit-calculator", "signal-analyzer"], description: "Star cataloging, orbit calculation, signal analysis", status: "active" },
      { id: 11, name: "Chemistry", agentCount: 11, readmeCount: 144, tools: ["molecule-designer", "reaction-predictor", "compound-analyzer"], description: "Molecular design, reaction prediction, compound analysis", status: "active" },
      { id: 12, name: "Physics Simulation", agentCount: 9, readmeCount: 108, tools: ["particle-sim", "field-model", "quantum-solver"], description: "Particle simulation, field modeling, quantum solving", status: "active" },
    ],
  },
  {
    id: 12, name: "Harmony", domain: "Integration & Unity", color: "#cc66ff",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Cross-domain integration, system harmony, emergent behavior, and the meta-layer that unifies all spheres.",
    subsets: [
      { id: 1, name: "Cross-Domain Synthesis", agentCount: 14, readmeCount: 186, tools: ["domain-bridge", "synthesis-engine", "insight-fuser"], description: "Bridging domains, synthesizing cross-domain insights", status: "active" },
      { id: 2, name: "Emergent Behavior", agentCount: 10, readmeCount: 128, tools: ["emergence-detector", "swarm-model", "complexity-analyzer"], description: "Detecting and modeling emergent system behaviors", status: "active" },
      { id: 3, name: "System Optimization", agentCount: 12, readmeCount: 156, tools: ["global-optimizer", "pareto-finder", "constraint-solver"], description: "Global optimization, Pareto frontiers, constraint solving", status: "active" },
      { id: 4, name: "Feedback Loops", agentCount: 9, readmeCount: 108, tools: ["loop-detector", "stability-checker", "dampener"], description: "Feedback loop detection, stability analysis, dampening", status: "active" },
      { id: 5, name: "Orchestration", agentCount: 13, readmeCount: 172, tools: ["task-orchestrator", "agent-scheduler", "workflow-engine"], description: "Multi-agent orchestration, scheduling, workflow management", status: "active" },
      { id: 6, name: "Conflict Resolution", agentCount: 10, readmeCount: 128, tools: ["priority-resolver", "resource-arbiter", "deadlock-breaker"], description: "Priority conflicts, resource arbitration, deadlock breaking", status: "active" },
      { id: 7, name: "Self-Healing", agentCount: 11, readmeCount: 142, tools: ["health-monitor", "auto-repair", "rollback-agent"], description: "System health monitoring, automatic repair, rollback", status: "active" },
      { id: 8, name: "Evolution", agentCount: 9, readmeCount: 112, tools: ["fitness-evaluator", "mutation-engine", "selection-agent"], description: "Evolutionary optimization, fitness evaluation, selection", status: "training" },
      { id: 9, name: "Collective Intelligence", agentCount: 12, readmeCount: 156, tools: ["wisdom-aggregator", "crowd-solver", "consensus-engine"], description: "Aggregating collective wisdom, crowd problem-solving", status: "active" },
      { id: 10, name: "Interoperability", agentCount: 10, readmeCount: 132, tools: ["protocol-bridge", "format-converter", "api-adapter"], description: "Protocol bridging, format conversion, API adaptation", status: "active" },
      { id: 11, name: "Resilience", agentCount: 11, readmeCount: 138, tools: ["chaos-tester", "fault-injector", "recovery-validator"], description: "Chaos testing, fault injection, recovery validation", status: "active" },
      { id: 12, name: "Transcendence", agentCount: 8, readmeCount: 96, tools: ["boundary-pusher", "paradigm-shifter", "horizon-scanner"], description: "Pushing boundaries, paradigm shifts, horizon scanning", status: "standby" },
    ],
  },
];

/* ── Computed totals ── */
const totalAgents = sphereHouses.reduce((sum, h) => sum + h.subsets.reduce((s, sub) => s + sub.agentCount, 0), 0);
const totalReadmes = sphereHouses.reduce((sum, h) => sum + h.subsets.reduce((s, sub) => s + sub.readmeCount, 0), 0);
const totalTools = sphereHouses.reduce((sum, h) => sum + h.subsets.reduce((s, sub) => s + sub.tools.length, 0), 0);

type View = "matrix" | "house" | "sphere";

export default function SpheresApp() {
  const [view, setView] = useState<View>("matrix");
  const [selectedHouse, setSelectedHouse] = useState<SphereHouse | null>(null);
  const [selectedSubset, setSelectedSubset] = useState<SphereSubset | null>(null);
  const [search, setSearch] = useState("");

  const filteredHouses = useMemo(() => {
    if (!search) return sphereHouses;
    const q = search.toLowerCase();
    return sphereHouses.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.domain.toLowerCase().includes(q) ||
      h.subsets.some(s => s.name.toLowerCase().includes(q) || s.tools.some(t => t.includes(q)))
    );
  }, [search]);

  const openHouse = (house: SphereHouse) => {
    setSelectedHouse(house);
    setSelectedSubset(null);
    setView("house");
  };

  const openSphere = (house: SphereHouse, subset: SphereSubset) => {
    setSelectedHouse(house);
    setSelectedSubset(subset);
    setView("sphere");
  };

  const goBack = () => {
    if (view === "sphere") { setView("house"); setSelectedSubset(null); }
    else if (view === "house") { setView("matrix"); setSelectedHouse(null); }
  };

  const statusColor = (s: string) =>
    s === "active" ? "text-emerald-400" : s === "training" ? "text-amber-400" : "text-foreground/30";
  const statusDot = (s: string) =>
    s === "active" ? "bg-emerald-400" : s === "training" ? "bg-amber-400" : "bg-foreground/20";

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-black/40 to-black/20 text-foreground">
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-2">
          {view !== "matrix" && (
            <button onClick={goBack} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4 text-foreground/60" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-foreground/90 font-[family-name:var(--font-display)] truncate">
              {view === "matrix" ? "144 Spheres — Agent Ontology" :
               view === "house" && selectedHouse ? `${selectedHouse.name} — ${selectedHouse.domain}` :
               view === "sphere" && selectedSubset ? selectedSubset.name : ""}
            </h1>
            <p className="text-[10px] text-foreground/40">
              {view === "matrix" ? `${totalAgents.toLocaleString()} agents · ${totalReadmes.toLocaleString()} READMEs · ${totalTools} native tools` :
               view === "house" && selectedHouse ? selectedHouse.description :
               view === "sphere" && selectedSubset ? selectedSubset.description : ""}
            </p>
          </div>
        </div>

        {/* Search */}
        {view === "matrix" && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search spheres, agents, tools..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-foreground/80 placeholder:text-foreground/25 focus:outline-none focus:border-white/[0.12]"
            />
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto scroll-container p-4">

        {/* ── Matrix View: 12×12 lattice ── */}
        {view === "matrix" && (
          <div className="space-y-3">
            {/* Stats bar */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Houses", value: "12", color: "#FFD700" },
                { label: "Spheres", value: "144", color: "#00d4ff" },
                { label: "Agents", value: totalAgents.toLocaleString(), color: "#00ff88" },
                { label: "READMEs", value: totalReadmes.toLocaleString(), color: "#ff6b35" },
              ].map(s => (
                <div key={s.label} className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2 text-center">
                  <p className="text-lg font-bold font-[family-name:var(--font-display)]" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[9px] text-foreground/40 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Lattice grid — 12 houses */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredHouses.map(house => {
                const activeCount = house.subsets.filter(s => s.status === "active").length;
                const totalAgentsInHouse = house.subsets.reduce((s, sub) => s + sub.agentCount, 0);
                const totalReadmesInHouse = house.subsets.reduce((s, sub) => s + sub.readmeCount, 0);

                return (
                  <button
                    key={house.id}
                    onClick={() => openHouse(house)}
                    className="group relative rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all p-3 text-left"
                  >
                    {/* Lattice background pattern */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-[0.03]">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`lattice-${house.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                            <circle cx="8" cy="8" r="0.5" fill={house.color} />
                            <line x1="0" y1="8" x2="16" y2="8" stroke={house.color} strokeWidth="0.2" />
                            <line x1="8" y1="0" x2="8" y2="16" stroke={house.color} strokeWidth="0.2" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#lattice-${house.id})`} />
                      </svg>
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/[0.06]"
                          style={{ color: house.color }}
                        >
                          {house.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-foreground/90 truncate">{house.name}</p>
                          <p className="text-[9px] text-foreground/40 truncate">{house.domain}</p>
                        </div>
                      </div>

                      {/* 12-dot lattice preview */}
                      <div className="grid grid-cols-6 gap-1 mb-2">
                        {house.subsets.map(sub => (
                          <div
                            key={sub.id}
                            className={`w-2 h-2 rounded-full ${statusDot(sub.status)}`}
                            style={sub.status === "active" ? { background: house.color, opacity: 0.6 } : undefined}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-foreground/30">
                        <span>{activeCount}/12 active</span>
                        <span>{totalAgentsInHouse} agents</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── House View: 12 subsets ── */}
        {view === "house" && selectedHouse && (
          <div className="space-y-2">
            {selectedHouse.subsets.map((subset, idx) => {
              const globalId = `${selectedHouse.id}.${subset.id}`;
              return (
                <button
                  key={idx}
                  onClick={() => openSphere(selectedHouse, subset)}
                  className="w-full flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all p-3 text-left group"
                >
                  {/* Sphere number */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-[family-name:var(--font-mono)] border border-white/[0.06]"
                    style={{ color: selectedHouse.color, background: `${selectedHouse.color}10` }}
                  >
                    {globalId}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-semibold text-foreground/90 truncate">{subset.name}</p>
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot(subset.status)}`} />
                      <span className={`text-[9px] ${statusColor(subset.status)}`}>{subset.status}</span>
                    </div>
                    <p className="text-[10px] text-foreground/40 truncate mt-0.5">{subset.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-[9px] text-foreground/30">
                      <span>{subset.agentCount} agents</span>
                      <span>{subset.readmeCount} READMEs</span>
                      <span>{subset.tools.length} tools</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40 transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {/* ── Sphere Detail View ── */}
        {view === "sphere" && selectedHouse && selectedSubset && (
          <div className="space-y-4">
            {/* Status card */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold font-[family-name:var(--font-mono)] border border-white/[0.06]"
                  style={{ color: selectedHouse.color, background: `${selectedHouse.color}10` }}
                >
                  {selectedHouse.id}.{selectedSubset.id}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground/90">{selectedSubset.name}</h2>
                  <p className="text-[10px] text-foreground/50">{selectedHouse.name} — {selectedHouse.domain}</p>
                </div>
                <div className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-medium ${
                  selectedSubset.status === "active" ? "bg-emerald-400/10 text-emerald-400" :
                  selectedSubset.status === "training" ? "bg-amber-400/10 text-amber-400" :
                  "bg-white/5 text-foreground/30"
                }`}>
                  {selectedSubset.status}
                </div>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed">{selectedSubset.description}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <Cpu className="w-4 h-4 mx-auto mb-1" style={{ color: selectedHouse.color }} />
                <p className="text-lg font-bold text-foreground/90">{selectedSubset.agentCount}</p>
                <p className="text-[9px] text-foreground/40">Agents</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <FileText className="w-4 h-4 mx-auto mb-1" style={{ color: selectedHouse.color }} />
                <p className="text-lg font-bold text-foreground/90">{selectedSubset.readmeCount}</p>
                <p className="text-[9px] text-foreground/40">READMEs</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                <Zap className="w-4 h-4 mx-auto mb-1" style={{ color: selectedHouse.color }} />
                <p className="text-lg font-bold text-foreground/90">{selectedSubset.tools.length}</p>
                <p className="text-[9px] text-foreground/40">Native Tools</p>
              </div>
            </div>

            {/* Native Tools */}
            <div>
              <h3 className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-2">Native Tools</h3>
              <div className="space-y-1">
                {selectedSubset.tools.map(tool => (
                  <div key={tool} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedHouse.color }} />
                    <code className="text-[11px] text-foreground/70 font-[family-name:var(--font-mono)]">{tool}</code>
                    <span className="ml-auto text-[9px] text-foreground/30">native</span>
                  </div>
                ))}
              </div>
            </div>

            {/* README sample */}
            <div>
              <h3 className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                Sample READMEs ({selectedSubset.readmeCount} total)
              </h3>
              <div className="space-y-1">
                {selectedSubset.tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <BookOpen className="w-3.5 h-3.5 text-foreground/30 flex-shrink-0" />
                    <span className="text-[10px] text-foreground/50 truncate">
                      README-{tool}.md — Agent configuration, API reference, usage examples
                    </span>
                  </div>
                ))}
                {selectedSubset.readmeCount > selectedSubset.tools.length && (
                  <p className="text-[9px] text-foreground/25 text-center py-1">
                    + {selectedSubset.readmeCount - selectedSubset.tools.length} more READMEs
                  </p>
                )}
              </div>
            </div>

            {/* Lattice visualization */}
            <div>
              <h3 className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-2">Lattice Position</h3>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                <div className="grid grid-cols-12 gap-1">
                  {sphereHouses.map(h => (
                    h.subsets.map(s => {
                      const isSelected = h.id === selectedHouse.id && s.id === selectedSubset.id;
                      const isSameHouse = h.id === selectedHouse.id;
                      return (
                        <div
                          key={`${h.id}-${s.id}`}
                          className={`w-full aspect-square rounded-sm transition-all ${
                            isSelected ? "ring-1 ring-white/40 scale-125" : ""
                          }`}
                          style={{
                            background: isSelected ? selectedHouse.color :
                              isSameHouse ? `${selectedHouse.color}40` :
                              `${h.color}15`,
                          }}
                        />
                      );
                    })
                  ))}
                </div>
                <p className="text-[9px] text-foreground/25 text-center mt-2">
                  Position {selectedHouse.id}.{selectedSubset.id} in the 12×12 lattice — {selectedHouse.name} house
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
