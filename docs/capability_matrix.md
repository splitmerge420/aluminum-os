# Aluminum OS — Capability Matrix

## Current State (v2.0.0 — March 2026)

### Ring 0 (Rust Kernel)

| Capability | Status | Tests | Notes |
|-----------|--------|-------|-------|
| Memory allocation (BuddyAllocator) | ✅ Working | 3 | Power-of-two splitting, alloc/free |
| Agent registration | ✅ Working | 2 | Trust levels, compliance tracking |
| Constitutional rules | ✅ Working | 2 | 18 defaults (14 core + 4 health), severity + Dave veto |
| Constitutional domains | ✅ Working | 6 | 15 domains from 40 repo extractions |
| Intent scheduling | ✅ Working | 2 | Priority queue + constitutional screening |
| Fixed-size strings | ✅ Working | 1 | No-heap string handling |
| FHIR R4/R5 types | ✅ Working | 5 | 15 resource types, PHI + financial classification |
| Health audit ledger | ✅ Working | 4 | Append-only, consent enforcement, HIPAA §164.312 |
| PQC identity registry | ✅ Working | 3 | ML-KEM-1024 / ML-DSA-87 stubs, NIST FIPS 203/204 |
| AI disclosure registry | ✅ Working | 3 | INV-30 compliance, violation counting |
| Amendment protocol | ✅ Working | 5 | Supermajority (≥5/7), 47% dominance cap |
| Regulatory compliance checker | ✅ Working | 6 | HIPAA, 21 CFR Part 11, ONC §3022 |
| Boot simulator | ✅ Working | — | Full v2.0 boot (11 phases, Pantheon Council) |
| `no_std` compatibility | ✅ Compiles | — | Feature-gated std/no_std |

### Ring 1 (Python Middleware)

| Capability | Status | Tests | Notes |
|-----------|--------|-------|-------|
| Model routing | ✅ Working | 5 | Cost-optimized, capability-matched |
| Cost tracking | ✅ Working | 4 | Per-model + global budget enforcement |
| Memory store | ✅ Working | 5 | Three-tier with TTL |
| Task decomposition | ✅ Working | 4 | DAG ordering, cycle detection |
| Session vault | ✅ Working | 4 | SHA-256 tokens, TTL, JSON export |
| FHIR events | ✅ Working | 6 | Hash-chained integrity, 15 resource types |
| Health audit ledger | ✅ Working | 10 | Append-only, chain verification, denial tracking |
| Consent vault | ✅ Working | 7 | Purpose binding, TTL, immediate revocation |
| AI disclosure registry | ✅ Working | 6 | INV-30 compliance, confidence clamping |
| Amendment protocol | ✅ Working | 10 | Supermajority, simple majority, dominance cap |
| Regulatory checker | ✅ Working | 9 | HIPAA, 21 CFR Part 11, ONC §3022, reports |
| PQC identity registry | ✅ Working | 7 | Algorithm key sizes, stub verification |

### Kintsugi Governance Spine

| Capability | Status | Tests | Notes |
|-----------|--------|-------|-------|
| GoldenTraceEmitter | ✅ Working | 13 | Emit, chain, golden repair, export, seams |
| GoldenTraceValidator | ✅ Working | 8 | Schema enforcement, all field/type validation |
| Health × Kintsugi integration | ✅ Working | 17 | HealthAuditLedger, ConsentVault, AmendmentProtocol emit traces |
| OPA constitutional audit policy | ✅ Written | — | KINTSUGI-001 through KINTSUGI-016; requires OPA binary to eval |

### Ring 2 (UWS CLI)

| Capability | Status | Notes |
|-----------|--------|-------|
| 14 miracle commands | ✅ Runs | council, vault, claude, sync, etc. |
| Shared types with Ring 0 | 🔲 Planned | Currently separate type definitions |
| MCP server | 🔲 Planned | Model Context Protocol integration |

## What's NOT Built Yet

| Capability | Priority | Blocked By |
|-----------|----------|------------|
| Rust ↔ Python IPC | High | FFI bridge or gRPC definition |
| Network transport | High | Protocol decision (gRPC vs HTTP vs MCP) |
| Persistent storage (Ring 0) | Medium | Filesystem abstraction for no_std |
| Real model API calls | Medium | API keys + provider integration |
| Auth/authz beyond trust levels | Medium | Identity provider choice |
| OPA policy evaluation (runtime) | Medium | OPA binary / Rego WASM integration |
| SHELDONBRAIN search indexing | Low | Meilisearch integration from repo shred |
| Dashboard UI | Low | Framework choice |

## Test Summary

| Layer | Language | Tests | Status |
|-------|----------|-------|--------|
| Ring 0 | Rust | 41 | ✅ All passing |
| Ring 1 — Manus Core | Python | 22 | ✅ All passing |
| Ring 1 — Health Layer | Python | 55 | ✅ All passing |
| Kintsugi SDK + Integration | Python | 38 | ✅ All passing |
| **Total** | | **156** | **All green** |

## Running Tests

```bash
make test          # all 156 tests
make test-rust     # 41 Rust tests
make test-python   # 115 Python tests
```
