# 144-Sphere Ontology — Plugin Ecosystem Taxonomy

## Overview

The **144-Sphere Ontology** classifies all knowledge and capability within the aluminum-os plugin ecosystem into **12 Houses × 12 Spheres = 144 categories**. Each plugin, tool, or capability is assigned a tag in the format `H{house}.S{sphere}` to enable precise classification, discovery, and cross-referencing.

**Current deployment status:** Only 2 of 144 sphere tags are currently applied (H7.S3 and H7.S9). This taxonomy defines the full ontology for complete deployment across the ecosystem.

---

## The 12 Houses

Houses represent **domains of concern** — the broad area of knowledge or capability a plugin operates within.

| House | Name | Domain |
|-------|------|--------|
| **H1** | Foundation | Infrastructure, OS, hardware, runtime environments |
| **H2** | Logic | Computation, algorithms, math, reasoning |
| **H3** | Communication | Messaging, protocols, APIs, data exchange |
| **H4** | Memory | Storage, databases, caching, state management |
| **H5** | Perception | Sensors, input, recognition, understanding |
| **H6** | Creation | Generation, synthesis, building, authoring |
| **H7** | Knowledge | Search, retrieval, classification, organization |
| **H8** | Governance | Rules, policies, compliance, orchestration |
| **H9** | Security | Authentication, encryption, defense, trust |
| **H10** | Commerce | Transactions, markets, exchange, value |
| **H11** | Community | Social, collaboration, sharing, networking |
| **H12** | Transcendence | Meta-cognition, emergence, evolution, self-improvement |

---

## The 12 Spheres

Spheres represent **functional roles** — the type of work a plugin performs within any given house. Every sphere applies within every house, creating the full 144-cell matrix.

| Sphere | Name | Function |
|--------|------|----------|
| **S1** | Core | Fundamental primitives, essential building blocks |
| **S2** | Interface | Boundaries, APIs, contracts, entry/exit points |
| **S3** | Engine | Processing, transformation, execution |
| **S4** | Store | Persistence, state management, retention |
| **S5** | Flow | Routing, orchestration, pipelines, sequencing |
| **S6** | Guard | Validation, filtering, protection, quality gates |
| **S7** | Bridge | Integration, translation, adapters, connectors |
| **S8** | Mirror | Monitoring, reflection, observability, introspection |
| **S9** | Index | Cataloging, discovery, search, enumeration |
| **S10** | Forge | Creation, generation, synthesis, fabrication |
| **S11** | Weave | Composition, aggregation, merging, blending |
| **S12** | Oracle | Prediction, inference, wisdom, foresight |

---

## Plugin Tag Assignments

The following maps major plugin categories to their sphere tags. Tags marked with ✅ are already deployed; all others are pending deployment.

### Primary Category Mappings

| Plugin Category | Sphere Tag | Classification | Status |
|----------------|------------|----------------|--------|
| MCP Servers | **H3.S2** | Communication.Interface | 🔲 Pending |
| Plugin Loaders | **H1.S3** | Foundation.Engine | 🔲 Pending |
| Security Scanners | **H9.S6** | Security.Guard | 🔲 Pending |
| Code Review | **H2.S8** | Logic.Mirror | 🔲 Pending |
| Search / RAG | **H7.S9** | Knowledge.Index | ✅ Deployed |
| Memory / Context | **H4.S4** | Memory.Store | 🔲 Pending |
| AI Orchestrators | **H8.S5** | Governance.Flow | 🔲 Pending |
| Content Generation | **H6.S10** | Creation.Forge | 🔲 Pending |
| Auth / Identity | **H9.S1** | Security.Core | 🔲 Pending |
| Monitoring / Analytics | **H8.S8** | Governance.Mirror | 🔲 Pending |
| CLI Tools | **H1.S2** | Foundation.Interface | 🔲 Pending |
| Documentation | **H7.S3** | Knowledge.Engine | ✅ Deployed |
| Testing | **H2.S6** | Logic.Guard | 🔲 Pending |
| Git / DevOps | **H1.S5** | Foundation.Flow | 🔲 Pending |
| Database Connectors | **H4.S7** | Memory.Bridge | 🔲 Pending |
| API Gateways | **H3.S6** | Communication.Guard | 🔲 Pending |
| Image / Media | **H5.S3** | Perception.Engine | 🔲 Pending |
| Marketplace | **H10.S9** | Commerce.Index | 🔲 Pending |
| Collaboration | **H11.S2** | Community.Interface | 🔲 Pending |
| Meta / Self-Improvement | **H12.S12** | Transcendence.Oracle | 🔲 Pending |

### Extended Category Mappings

| Plugin Category | Sphere Tag | Classification |
|----------------|------------|----------------|
| Config Management | **H1.S4** | Foundation.Store |
| Schema Validators | **H2.S6** | Logic.Guard |
| Webhooks | **H3.S5** | Communication.Flow |
| Message Queues | **H3.S4** | Communication.Store |
| Protocol Adapters | **H3.S7** | Communication.Bridge |
| Cache Layers | **H4.S3** | Memory.Engine |
| Data Migration | **H4.S5** | Memory.Flow |
| OCR / Vision | **H5.S3** | Perception.Engine |
| NLP / Language | **H5.S10** | Perception.Forge |
| Template Engines | **H6.S3** | Creation.Engine |
| Code Generators | **H6.S10** | Creation.Forge |
| Linters / Formatters | **H2.S6** | Logic.Guard |
| Knowledge Graphs | **H7.S11** | Knowledge.Weave |
| Taxonomy Managers | **H7.S4** | Knowledge.Store |
| Policy Engines | **H8.S3** | Governance.Engine |
| Rate Limiters | **H8.S6** | Governance.Guard |
| Encryption Libraries | **H9.S3** | Security.Engine |
| Vulnerability Scanners | **H9.S9** | Security.Index |
| Payment Processors | **H10.S3** | Commerce.Engine |
| Pricing Engines | **H10.S12** | Commerce.Oracle |
| Chat / Messaging | **H11.S3** | Community.Engine |
| Notification Systems | **H11.S5** | Community.Flow |
| Self-Healing Systems | **H12.S3** | Transcendence.Engine |
| Evolution Trackers | **H12.S8** | Transcendence.Mirror |

---

## Cross-Reference: Forked Repos × Sphere Tags

The following table maps plugins from each of the 10 forked repositories in the aluminum-os ecosystem to their corresponding sphere tags.

| # | Repository | Primary Focus | Sphere Tags |
|---|-----------|---------------|-------------|
| 1 | **mcp-servers** | MCP protocol server implementations | H3.S2, H3.S5, H3.S7 |
| 2 | **plugin-loader** | Plugin discovery, loading, and lifecycle | H1.S3, H1.S5, H7.S9 |
| 3 | **security-suite** | Security scanning, auth, vulnerability analysis | H9.S1, H9.S3, H9.S6, H9.S9 |
| 4 | **code-review-tools** | Static analysis, code quality, review automation | H2.S6, H2.S8, H8.S8 |
| 5 | **search-rag** | Search, retrieval-augmented generation, indexing | H7.S3, H7.S9, H7.S11 |
| 6 | **memory-context** | Context management, state persistence, caching | H4.S3, H4.S4, H4.S5 |
| 7 | **ai-orchestrator** | Agent orchestration, workflow management | H8.S3, H8.S5, H12.S12 |
| 8 | **content-gen** | Content generation, templates, synthesis | H6.S3, H6.S10, H5.S10 |
| 9 | **devops-tools** | Git integration, CI/CD, deployment | H1.S2, H1.S5, H8.S6 |
| 10 | **marketplace** | Plugin marketplace, discovery, distribution | H10.S3, H10.S9, H11.S2 |

### Detailed Breakdown by Repository

#### 1. mcp-servers
- `mcp-core-server` → **H3.S2** (Communication.Interface) — Primary MCP protocol endpoint
- `mcp-router` → **H3.S5** (Communication.Flow) — Message routing and dispatch
- `mcp-translator` → **H3.S7** (Communication.Bridge) — Protocol translation layer
- `mcp-monitor` → **H3.S8** (Communication.Mirror) — Connection monitoring

#### 2. plugin-loader
- `loader-core` → **H1.S3** (Foundation.Engine) — Plugin loading and initialization
- `loader-registry` → **H7.S9** (Knowledge.Index) — Plugin discovery and catalog
- `loader-pipeline` → **H1.S5** (Foundation.Flow) — Plugin lifecycle orchestration
- `loader-config` → **H1.S4** (Foundation.Store) — Plugin configuration management

#### 3. security-suite
- `auth-provider` → **H9.S1** (Security.Core) — Authentication primitives
- `crypto-engine` → **H9.S3** (Security.Engine) — Encryption and key management
- `vuln-scanner` → **H9.S6** (Security.Guard) — Vulnerability detection
- `threat-index` → **H9.S9** (Security.Index) — Threat intelligence catalog

#### 4. code-review-tools
- `static-analyzer` → **H2.S3** (Logic.Engine) — Code analysis engine
- `review-mirror` → **H2.S8** (Logic.Mirror) — Review observability dashboard
- `lint-guard` → **H2.S6** (Logic.Guard) — Linting and validation
- `quality-oracle` → **H2.S12** (Logic.Oracle) — Code quality predictions

#### 5. search-rag
- `search-engine` → **H7.S3** (Knowledge.Engine) — Core search processing ✅
- `rag-index` → **H7.S9** (Knowledge.Index) — RAG document indexing ✅
- `knowledge-weave` → **H7.S11** (Knowledge.Weave) — Knowledge graph composition
- `query-bridge` → **H7.S7** (Knowledge.Bridge) — Cross-source query translation

#### 6. memory-context
- `context-store` → **H4.S4** (Memory.Store) — Context state persistence
- `cache-engine` → **H4.S3** (Memory.Engine) — Cache processing layer
- `state-flow` → **H4.S5** (Memory.Flow) — State migration pipelines
- `memory-bridge` → **H4.S7** (Memory.Bridge) — External storage connectors

#### 7. ai-orchestrator
- `agent-flow` → **H8.S5** (Governance.Flow) — Agent workflow orchestration
- `policy-engine` → **H8.S3** (Governance.Engine) — Policy evaluation
- `compliance-guard` → **H8.S6** (Governance.Guard) — Compliance enforcement
- `meta-oracle` → **H12.S12** (Transcendence.Oracle) — Meta-cognitive reasoning

#### 8. content-gen
- `template-engine` → **H6.S3** (Creation.Engine) — Template processing
- `content-forge` → **H6.S10** (Creation.Forge) — Content synthesis
- `media-weave` → **H6.S11** (Creation.Weave) — Multi-modal composition
- `nlp-perception` → **H5.S10** (Perception.Forge) — Language understanding

#### 9. devops-tools
- `git-interface` → **H1.S2** (Foundation.Interface) — Git CLI integration
- `ci-flow` → **H1.S5** (Foundation.Flow) — CI/CD pipeline management
- `deploy-guard` → **H8.S6** (Governance.Guard) — Deployment gates
- `infra-monitor` → **H1.S8** (Foundation.Mirror) — Infrastructure observability

#### 10. marketplace
- `market-engine` → **H10.S3** (Commerce.Engine) — Marketplace transaction processing
- `market-index` → **H10.S9** (Commerce.Index) — Plugin catalog and discovery
- `collab-interface` → **H11.S2** (Community.Interface) — Community collaboration portal
- `rating-oracle` → **H10.S12** (Commerce.Oracle) — Plugin rating and recommendation

---

## Coverage Summary

| Metric | Count |
|--------|-------|
| Total possible sphere tags | 144 |
| Currently deployed | 2 (H7.S3, H7.S9) |
| Mapped in this taxonomy | 58 |
| Remaining unmapped | 86 |

### Mapped Houses Coverage

| House | Spheres Mapped | Coverage |
|-------|---------------|----------|
| H1: Foundation | S2, S3, S4, S5, S8 | 5/12 |
| H2: Logic | S3, S6, S8, S12 | 4/12 |
| H3: Communication | S2, S4, S5, S6, S7, S8 | 6/12 |
| H4: Memory | S3, S4, S5, S7 | 4/12 |
| H5: Perception | S3, S10 | 2/12 |
| H6: Creation | S3, S10, S11 | 3/12 |
| H7: Knowledge | S3, S4, S7, S9, S11 | 5/12 |
| H8: Governance | S3, S5, S6, S8 | 4/12 |
| H9: Security | S1, S3, S6, S9 | 4/12 |
| H10: Commerce | S3, S9, S12 | 3/12 |
| H11: Community | S2, S3, S5 | 3/12 |
| H12: Transcendence | S3, S8, S12 | 3/12 |

---

## Tagging Convention

All plugins MUST be tagged using the format:

```
H{house_number}.S{sphere_number}
```

**Examples:**
- `H3.S2` → Communication.Interface
- `H9.S6` → Security.Guard
- `H12.S12` → Transcendence.Oracle

Plugins may carry **multiple tags** when they span domains (e.g., an API gateway with auth could be tagged `H3.S6` + `H9.S6`).

---

*This taxonomy is maintained as part of the aluminum-os plugin ecosystem governance. For tag assignment requests or ontology amendments, open an issue with the `sphere-taxonomy` label.*