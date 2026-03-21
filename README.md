# Aluminum OS — Forge Core

**Constitutional AI Governance Kernel**

Atlas Lattice Foundation · v2.0.0 · March 2026

---

## What This Is

Aluminum OS is a constitutional governance substrate for multi-agent AI systems. It provides:

- **Ring 0 (Rust Kernel):** Memory management, agent identity, intent scheduling, and constitutional rule enforcement — `no_std` compatible. Healthcare v2.0 adds FHIR types, PQC identity, health audit, amendment protocol, AI disclosure, and regulatory compliance.
- **Ring 1 (Python Middleware):** Model routing, cost tracking, memory management, task decomposition, session persistence, full healthcare layer — zero external dependencies.
- **Kintsugi Governance Spine:** Append-only GoldenTrace audit SDK. Every constitutional action, consent, amendment, and health event produces a hash-chained trace. Integrated with the health layer out of the box.

## What Works Right Now

| Component | Layer | Tests | Status |
|-----------|-------|-------|--------|
| BuddyAllocator | Rust Ring 0 | 3 | ✅ Passing |
| AgentIdentity / Registry | Rust Ring 0 | 2 | ✅ Passing |
| Constitution + Rules (18) | Rust Ring 0 | 2 | ✅ Passing |
| ConstitutionalDomains (15) | Rust Ring 0 | 6 | ✅ Passing |
| IntentScheduler | Rust Ring 0 | 2 | ✅ Passing |
| Health Layer (FHIR, PQC, audit, amendments) | Rust Ring 0 | 25 | ✅ Passing |
| Boot Simulator (v2.0 — 11 phases) | Rust Ring 0 | — | ✅ Runs |
| ModelRouter | Python Ring 1 | 5 | ✅ Passing |
| CostTracker | Python Ring 1 | 4 | ✅ Passing |
| MemoryStore | Python Ring 1 | 5 | ✅ Passing |
| TaskDecomposer | Python Ring 1 | 4 | ✅ Passing |
| SessionVault | Python Ring 1 | 4 | ✅ Passing |
| Health Layer (FHIR, consent, amendments, PQC, regulatory) | Python Ring 1 | 55 | ✅ Passing |
| Kintsugi SDK (GoldenTraceEmitter/Validator) | Kintsugi | 21 | ✅ Passing |
| Kintsugi × Health Integration | Kintsugi | 17 | ✅ Passing |
| `uws` CLI (swarm review, lint, audit, status) | Python Ring 1 | 42 | ✅ Passing |
| ProvenanceTrailer (Golden-Trace validator) | Python Ring 1 | 33 | ✅ Passing |
| Kintsugi Weave CI/CD workflow | GitHub Actions | — | ✅ Active |
| **Total** | | **231** | **All passing** |

## What Doesn't Work Yet

- No network layer (agents are local only)
- No persistence layer for Ring 0 (in-memory)
- No real model API calls (ModelRouter routes but doesn't call APIs)
- No Rust ↔ Python IPC bridge (shared type definitions planned)
- OPA policy enforcement requires separate OPA binary (policy exists in `kintsugi/policies/`)

## Quick Start

```bash
make test        # Run all 231 tests (Rust + Python + Kintsugi + uws CLI + Provenance)
make run         # Boot simulator demo (11 phases)
make test-rust   # Rust tests only
make test-python # Python tests only (includes uws CLI)
```

### Or without make

```bash
# Rust (Ring 0)
cargo test
cargo run

# Python (Ring 1 + Kintsugi + uws CLI)
python3 -m unittest python.tests.test_all -v       # Manus Core (22 tests)
python3 -m unittest python.tests.test_health -v    # Health Layer (55 tests)
python3 -m unittest python.tests.test_kintsugi -v  # Kintsugi SDK (38 tests)
python3 -m unittest python.tests.test_uws -v       # uws CLI (42 tests)
python3 -m unittest python.tests.test_provenance -v # ProvenanceTrailer (33 tests)

# uws CLI (entry-point script)
python3 uws status
python3 uws swarm review --batch=50 "dep-a" "dep-b" "dep-c"
python3 uws lint python/
python3 uws audit
```

## Kintsugi Weave CI/CD Workflow

The repository enforces constitutional governance at the CI level via
`.github/workflows/kintsugi-weave.yml`.  Three jobs run automatically:

| Job | Trigger | What it enforces |
|-----|---------|-----------------|
| `constitutional-lint` | Every PR / push to `main` | `uws lint` — zero CONST-001/002 credential violations |
| `provenance-check` | Every PR / push to `main` | Every commit must carry a valid `Golden-Trace` trailer |
| `swarm-review` | PR comment `/uws swarm review` | NPFM Gate — scores the file batch; posts result table as comment |

### Adding provenance trailers to commits

```python
from python.core.provenance import make_golden_trace_value, format_trailers

# Compute the trailer block (typically hash the diff or a summary):
trailers = format_trailers(
    golden_trace=make_golden_trace_value("your diff or commit body"),
    hitl_weight=0.85,
)
print(trailers)
# Golden-Trace: sha3-256:a3f9...
# HITL-Weight: 0.85
```

Append the output after a blank line at the end of your commit message:

```
feat: implement amazing feature

Detailed explanation of the change.

Golden-Trace: sha3-256:<64 hex chars>
HITL-Weight: 0.85
```



```
┌────────────────────────────────────────────────┐
│  Ring 2: Experience Layer (partial)            │
│  uws CLI · Dashboard (planned) · Voice (plan) │
├────────────────────────────────────────────────┤
│  Kintsugi Governance Spine (cross-cutting)     │
│  GoldenTraceEmitter · GoldenTraceValidator    │
│  OPA Constitutional Audit Policy (v2.0)       │
├────────────────────────────────────────────────┤
│  Ring 1: Manus Core + Health Layer (Python)   │
│  ModelRouter · CostTracker · MemoryStore      │
│  TaskDecomposer · SessionVault                │
│  HealthAuditLedger · ConsentVault             │
│  AmendmentProtocol · AiDisclosureRegistry     │
│  RegulatoryChecker · PqcIdentityRegistry      │
├────────────────────────────────────────────────┤
│  Ring 0: Forge Core (Rust, no_std)            │
│  BuddyAllocator · AgentIdentity · Constitution│
│  IntentScheduler · 15 ConstitutionalDomains   │
│  Health: FHIR · PQC · AuditLedger · Amendments│
└────────────────────────────────────────────────┘
```

## Kintsugi Integration

The Kintsugi governance spine is a fully working Python SDK that integrates with the health layer. Pass a `GoldenTraceEmitter` to `HealthAuditLedger`, `ConsentVault`, or `AmendmentProtocol` and every constitutional event automatically produces a hash-chained audit trace:

```python
from kintsugi import GoldenTraceEmitter
from core.health_layer import HealthAuditLedger, FhirEvent, FhirResourceType, FhirAction, HealthAuditSeverity

tracer = GoldenTraceEmitter(repo="aluminum-os", module="core/health_layer")
ledger = HealthAuditLedger(tracer=tracer)

ev = FhirEvent(resource_type=FhirResourceType.OBSERVATION,
               action=FhirAction.READ, agent_id="claude")
ledger.append(ev, HealthAuditSeverity.INFO, consent_verified=False, ai_disclosed=True)

# Chain is valid — every append produced a GoldenTrace event
assert tracer.verify_chain()
```

Health layer modules work identically without a tracer — kintsugi is an optional enhancement, not a dependency.

## Constitutional Domains (15)

Extracted from 40 AI governance placeholder repos and collapsed into typed enum variants:

1. General Governance · 2. Data Privacy · 3. Transparency & Audit · 4. Human Oversight (HITL)
5. Fairness & Bias · 6. Safety & Alignment · 7. Explainability · 8. Accountability & Liability
9. Resource Governance · 10. Cross-Border Compliance · 11. Environmental Impact
12. Interoperability Standards · 13. Dispute Resolution · 14. Digital Sovereignty · 15. Emergency Protocols

## Constitutional Rules (18)

14 core rules + 4 healthcare rules (v2.0):
- `health-ai-disclosure` — Critical / TransparencyAudit (INV-30 enforcement)
- `health-audit-no-delete` — Critical / TransparencyAudit (HIPAA §164.312 mandate)
- `fhir-interop-mandate` — Mandatory / InteroperabilityStandards (ONC §3022)
- `amendment-supermajority` — Mandatory / HumanOversight (≥5/7, 47% dominance cap)

## Related Repos

- [`splitmerge420/uws`](https://github.com/splitmerge420/uws) — Universal Workspace CLI (command surface)
- [`splitmerge420/bazinga`](https://github.com/splitmerge420/bazinga) — BAZINGA v0.2 constitutional compute layer
- [`splitmerge420/atlas-lattice-foundation`](https://github.com/splitmerge420/atlas-lattice-foundation) — Foundation org page

## License

MIT — Atlas Lattice Foundation

