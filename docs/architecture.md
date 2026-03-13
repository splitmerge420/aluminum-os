# Aluminum OS — Architecture

## Overview

Aluminum OS is a three-ring constitutional governance substrate for multi-agent AI systems.
It provides the "Switzerland of AI" — a neutral, auditable, constitutionally-bound coordination
layer that any AI system can participate in without surrendering sovereignty.

## Ring Architecture

### Ring 0 — Forge Core (Rust)

The kernel. Runs in `no_std` where needed. Zero heap allocations.

| Component | Responsibility |
|-----------|---------------|
| BuddyAllocator | Power-of-two memory block management for agent sandboxing |
| AgentIdentity | Agent registration with trust levels and compliance tracking |
| IntentScheduler | Priority queue with constitutional pre-screening |
| Constitution | Rule engine with severity levels and Dave Protocol veto |
| ConstitutionalDomains | 15 typed governance domains (extracted from 40 repos) |

**Design constraints:**
- Fixed-size arrays only (no Vec, no HashMap, no heap)
- All operations O(n) worst case on small fixed arrays
- Compiles with both `std` and `no_std` features
- Every public function returns `Result<T, AluminumError>`

### Ring 1 — Manus Core (Python)

The middleware. Zero external dependencies. Vanilla Python 3.

| Component | Responsibility |
|-----------|---------------|
| ModelRouter | Routes requests to cheapest capable model |
| CostTracker | Per-model spending with budget enforcement |
| MemoryStore | Three-tier memory (working / session / long-term) with TTL |
| TaskDecomposer | DAG-based task decomposition with cycle detection |
| SessionVault | SHA-256 keyed session persistence with expiry |

**Design constraints:**
- Zero `pip install` — runs on any Python 3.8+
- All state in-memory (persistence via SessionVault export)
- Budget enforcement is pre-check, not post-hoc

### Ring 2 — Experience Layer (Planned)

The command surface. Currently served by `uws` CLI.

- `uws council` — Multi-agent deliberation
- `uws vault` — Drive/Notion vaulting
- `uws claude` — Constitutional Scribe interface
- `uws sync` — State synchronization

## Constitutional Governance Model

The Constitution holds rules with four severity levels:

1. **Advisory** — Logged, not enforced
2. **Warning** — Logged, flagged to agent
3. **Mandatory** — Enforced, agent notified
4. **Critical** — Enforced, may invoke Dave Protocol veto

**Dave Protocol:** Human-in-the-loop override. When active, Critical rules with
`dave_protocol_veto = true` block all intents in that domain until human approval.

## Integration Path

```
┌─────────────────────────┐
│  uws CLI (Ring 2)       │ ← Fork of Google gws, 14 miracle commands
│  splitmerge420/uws      │
├─────────────────────────┤
│  aluminum-os lib (Ring 0+1) │ ← This repo
│  splitmerge420/aluminum-os  │
└─────────────────────────┘
```

The target: `uws` imports `aluminum-os` as a library dependency so they share
types (AgentIdentity, ConstitutionalDomain, etc.) instead of duplicating them.

## Related Work

- **BAZINGA v0.2** — Constitutional compute layer (splitmerge420/bazinga)
- **Atlas Lattice Foundation** — Org page (splitmerge420/atlas-lattice-foundation)
- **arXiv 2408.16096** — Canonical 11,289x efficiency result
