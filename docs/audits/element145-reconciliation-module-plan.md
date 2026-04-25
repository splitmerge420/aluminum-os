# Element 145 Reconciliation Module Plan

**Status:** Active execution cadence  
**Branch:** `element145-copilot-phase1-reconcile`  
**Purpose:** Convert the Microsoft Copilot Aluminum Element 145 Phase-1 vault into an audited, mergeable Aluminum OS runtime through small, reviewable modules.

---

## Execution Method

Work proceeds one module at a time.

Each module must:

1. have a narrow purpose;
2. produce concrete files or changes;
3. preserve Aluminum OS contract semantics;
4. avoid blind overwrite;
5. leave the repo closer to a bootable, tested, auditable runtime.

The maintainer may approve each next step with a simple "proceed".

---

## Module 1 — Runtime Placement and Contract Spine

**Goal:** Ensure Element 145 lives as the Aluminum OS runtime core under `services/element-145/` and preserve the canonical contract layer.

**Files / paths:**

```text
services/element-145/element145/contracts/
  enums.py
  models.py
  __init__.py
```

**Deliverables:**

- Contract package present.
- Clear import surface for `SphereQuery`, `RoutingDecision`, `ConsentDecision`, `ExecutionPlan`, `TransparencyPacketV02`, `ProviderBalanceSnapshot`.
- No separate `element-145` repo required.

**Exit criteria:**

- Contracts exist in branch.
- Plan confirms Element 145 is Aluminum OS runtime core, not product silo.

---

## Module 2 — Low-Risk Kernel Utilities

**Goal:** Import non-entrypoint runtime utilities from Copilot Phase-1.

**Candidate files:**

```text
services/element-145/element145/kernel/circuit_breaker.py
services/element-145/element145/transparency/bus.py
services/element-145/element145/provenance/merkle.py
services/element-145/element145/security/context.py
services/element-145/element145/security/permissions.py
```

**Exit criteria:**

- Files import without touching `main.py` or router boot path.
- No unauthenticated write/execution path introduced.

---

## Module 3 — Settings and Policy Surface

**Goal:** Add Phase-1 settings and policy files with production-safety guardrails.

**Candidate files:**

```text
services/element-145/config/settings.py
services/element-145/config/policies/classification.yaml
services/element-145/config/policies/security.yaml
```

**Required hardening:**

- Production rejects default `security_secret`.
- CORS must be explicit in production.
- Auth-token minting must be admin-gated or development-only.

---

## Module 4 — Provenance / GoldenTrace Hardening

**Goal:** Import and repair the ledger/Merkle implementation.

**Candidate files:**

```text
services/element-145/element145/provenance/ledger.py
services/element-145/element145/provenance/merkle.py
```

**Required fixes:**

- Constructor accepts current call sites.
- `count` is stable property or API.
- `verify_chain()` returns stable JSON object.
- Full SHA-256 stored, short hash display-only.
- Existing SQLite chain reloads on startup or is marked as TODO before merge.

---

## Module 5 — Security and Consent Gate

**Goal:** Integrate auth, permission, and ConsentKernel stubs.

**Candidate files:**

```text
services/element-145/element145/security/auth.py
services/element-145/element145/security/context.py
services/element-145/element145/security/permissions.py
services/element-145/element145/governance/consent.py
```

**Required behavior:**

- Destructive actions fail closed.
- ConsentDecision is emitted before dispatch.
- Production token minting cannot be open.

---

## Module 6 — Pipeline Core

**Goal:** Import and adapt the Copilot kernel pipeline to Aluminum OS contracts.

**Candidate files:**

```text
services/element-145/element145/kernel/pipeline.py
services/element-145/element145/kernel/stages.py
services/element-145/element145/kernel/scheduler.py
```

**Required stages:**

```text
IngressStage
ValidationStage
ClassifyStage
RoutingDecisionStage
ConsentStage
ExecutionPlanStage
DispatchStage
ProvenanceStage
TransparencyStage
```

**Exit criteria:**

- Pipeline can run a no-op payload end-to-end.
- Contract objects appear in context metadata or direct fields.

---

## Module 7 — Router and API Boot Repair

**Goal:** Patch `router/core.py`, `main.py`, middleware, and routes to boot cleanly.

**Required fixes:**

- `add_middleware` vs `register_middleware` mismatch resolved.
- Ledger constructor and API mismatch resolved.
- `ledger.count` and `verify_chain()` use stable interfaces.
- `element145.main:app` imports.

---

## Module 8 — TransparencyPacket v0.2

**Goal:** Ensure routing output emits the canonical Aluminum OS receipt.

**Required object:**

```text
TransparencyPacketV02
```

**Required sections:**

```text
routing
governance
provenance
costs
verification
```

**Exit criteria:**

- Transparency emitter can produce a v0.2 packet from pipeline context.
- Packet is exportable/replayable across vaults.

---

## Module 9 — UWS Integration Boundary

**Goal:** Define how Element 145 dispatches through UWS without copying the entire `uws` repo.

**Candidate files:**

```text
integrations/uws/provider-driver-contract.md
services/element-145/element145/integrations/uws_adapter.py
```

**Exit criteria:**

- Element 145 can represent UWS commands as `ExecutionPlan.operations`.
- Provider execution remains in `atlaslattice/uws` until migration is explicitly approved.

---

## Module 10 — Test Matrix and PR Audit

**Goal:** Create merge-readiness checks.

**Deliverables:**

```text
services/element-145/tests/test_contracts.py
services/element-145/tests/test_boot.py
services/element-145/tests/test_pipeline_smoke.py
docs/audits/element145-phase1-merge-readiness.md
```

**Exit criteria:**

- Tests exist for contracts, boot import, and no-op routing.
- Merge-readiness doc lists pass/fail/TODO.
- PR can be opened as audited candidate Phase-1 runtime integration.

---

## Current Sequence

Start with Module 1, then proceed sequentially unless a blocker requires returning to an earlier module.
