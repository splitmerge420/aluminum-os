# Aluminum OS — Forge Core

**Constitutional AI Governance Kernel**

Atlas Lattice Foundation · v0.3.0 · March 2026

---

## What This Is

Aluminum OS is a constitutional governance substrate for multi-agent AI systems. It provides:

- **Ring 0 (Rust Kernel):** Memory management, agent identity, intent scheduling, and constitutional rule enforcement — all `no_std` compatible
- **Ring 1 (Python Middleware):** Model routing, cost tracking, memory management, task decomposition, and session persistence — zero external dependencies

## What Works Right Now

| Component | Language | Tests | Status |
|-----------|----------|-------|--------|
| BuddyAllocator | Rust | 3 | ✅ Passing |
| AgentIdentity / Registry | Rust | 2 | ✅ Passing |
| Constitution + Rules | Rust | 2 | ✅ Passing |
| ConstitutionalDomains (15) | Rust | 6 | ✅ Passing |
| IntentScheduler | Rust | 2 | ✅ Passing |
| Boot Simulator | Rust | — | ✅ Runs |
| ModelRouter | Python | 5 | ✅ Passing |
| CostTracker | Python | 4 | ✅ Passing |
| MemoryStore | Python | 5 | ✅ Passing |
| TaskDecomposer | Python | 4 | ✅ Passing |
| SessionVault | Python | 4 | ✅ Passing |
| **Total** | | **37** | **All passing** |

## What Doesn't Work Yet

- No network layer (agents are local only)
- No persistence layer for Rust (Ring 0 is in-memory)
- No real model API integration (ModelRouter routes but doesn't call APIs)
- No cross-ring IPC (Rust ↔ Python bridge is planned, not built)
- No authentication/authorization beyond trust levels
- UWS CLI integration pending (shared types, not wired yet)

## Quick Start

### Rust (Ring 0)

```bash
cargo test          # Run all 15 Rust tests
cargo run           # Boot simulator demo
```

### Python (Ring 1)

```bash
cd python
python -m pytest tests/test_all.py -v    # Run 19+ Python tests
# or
python -m unittest tests.test_all -v
```

## Architecture

```
┌─────────────────────────────────────────┐
│  Ring 2: Experience Layer (planned)     │
│  UWS CLI · Dashboard · Voice           │
├─────────────────────────────────────────┤
│  Ring 1: Manus Core (Python)           │
│  ModelRouter · CostTracker · Memory    │
│  TaskDecomposer · SessionVault         │
├─────────────────────────────────────────┤
│  Ring 0: Forge Core (Rust)             │
│  BuddyAllocator · AgentIdentity       │
│  IntentScheduler · Constitution        │
│  15 ConstitutionalDomains              │
└─────────────────────────────────────────┘
```

## Constitutional Domains

The 15 governance domains were extracted from 40 empty AI governance placeholder repos. Each was analyzed, categorized, and collapsed into typed enum variants:

1. General Governance
2. Data Privacy
3. Transparency & Audit
4. Human Oversight (HITL)
5. Fairness & Bias
6. Safety & Alignment
7. Explainability
8. Accountability & Liability
9. Resource Governance
10. Cross-Border Compliance
11. Environmental Impact
12. Interoperability Standards
13. Dispute Resolution
14. Digital Sovereignty
15. Emergency Protocols

## Related Repos

- [`splitmerge420/uws`](https://github.com/splitmerge420/uws) — Universal Workspace CLI (command surface)
- [`splitmerge420/bazinga`](https://github.com/splitmerge420/bazinga) — BAZINGA v0.2 constitutional compute layer
- [`splitmerge420/atlas-lattice-foundation`](https://github.com/splitmerge420/atlas-lattice-foundation) — Foundation org page

## License

MIT — Atlas Lattice Foundation
