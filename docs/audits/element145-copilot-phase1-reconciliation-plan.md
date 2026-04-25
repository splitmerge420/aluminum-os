# Element 145 Copilot Phase-1 Reconciliation Plan

**Status:** Active reconciliation plan  
**Branch:** `element145-copilot-phase1-reconcile`  
**Target:** audited merged Aluminum OS runtime update  
**Source Artifact:** Microsoft Copilot Aluminum — Element 145 Phase-1 Runtime Build  
**Goal:** Integrate the Copilot Phase-1 runtime build into `aluminum-os/services/element-145/` without overwriting canonical Aluminum OS contracts.

---

## 1. Working Doctrine

This branch leads toward an audited merged new version of Aluminum OS.

Element 145 is treated as the functional Aluminum OS runtime core, not merely a separate module.

Copilot Phase-1 provides the runtime-heavy kernel implementation. The Aluminum OS contract layer provides the canonical semantics.

Correct target architecture:

```text
User / Agent Intent
  -> SphereQuery
  -> RoutingDecision
  -> ConsentDecision
  -> ExecutionPlan
  -> Copilot Aluminum kernel pipeline
  -> Provider / Model / Tool / UWS Execution
  -> TransparencyPacketV02
  -> ProvenanceLedger / GoldenTrace
```

---

## 2. Inputs

### 2.1 Canonical specs / docs

- `docs/architecture/AUWS-SPEC-001-complete-system-specification-v1.md`
- `docs/architecture/os-contract-layer.md`
- `docs/architecture/element-145-runtime-map.md`
- `docs/strategy/provider-neutrality-and-google-bridge.md`
- `docs/vaults/microsoft-copilot-aluminum-element145-phase1-vault.md`

### 2.2 Existing implementation branch

- `element145-contracts`
- Adds:
  - `services/element-145/element145/contracts/enums.py`
  - `services/element-145/element145/contracts/models.py`
  - `services/element-145/element145/contracts/__init__.py`

### 2.3 Copilot Phase-1 vault

Candidate runtime artifact containing:

```text
73 files
Phase-0 base + Phase-1 overlays
8 replaced files
26 added files
```

Key added runtime surfaces:

```text
element145/kernel/*
element145/security/*
element145/provenance/merkle.py
element145/transparency/bus.py
element145/classifier/engine.py
config/policies/*.yaml
```

---

## 3. Non-Negotiable Constraints

1. Do not blindly overwrite canonical contract files.
2. Do not merge code that fails to boot.
3. Do not allow unauthenticated production token minting.
4. Do not leave default production secrets active.
5. Do not expose wildcard CORS with credentials in production.
6. Do not treat Copilot as owner of Aluminum OS; preserve contributor provenance only.
7. Do not claim Phase-1 complete until tests and contract alignment pass.
8. Do not collapse external repos wholesale before integration boundaries stabilize.

---

## 4. P0 Boot Fixes

Before any merge candidate:

- Fix `add_middleware` vs `register_middleware` mismatch.
- Fix `ProvenanceLedger` constructor mismatch.
- Fix `ledger.count` property/method mismatch.
- Fix `verify_chain()` dict/tuple mismatch.
- Ensure `element145.main:app` imports successfully.

---

## 5. P1 Contract Reconciliation

Required canonical contract objects:

```text
SphereQuery
RoutingDecision
ConsentDecision
ExecutionPlan
TransparencyPacketV02
ProviderBalanceSnapshot
```

Pipeline must either use or emit these objects.

Minimum reconciled stages:

```text
IngressStage          raw payload -> SphereQuery
ClassifyStage         SphereQuery -> House/Sphere + epistemic/safety state
RoutingDecisionStage  classifier output -> RoutingDecision
ConsentStage          RoutingDecision -> ConsentDecision
ExecutionPlanStage    decision + consent -> ExecutionPlan
DispatchStage         execution plan -> result
ProvenanceStage       result -> ledger record
TransparencyStage     result -> TransparencyPacketV02
```

---

## 6. P1 Security Hardening

- Production must reject default `security_secret`.
- `/auth/token` must be disabled in production unless admin-gated.
- CORS must be settings-driven and non-wildcard in production.
- Destructive-action policy must fail closed.
- Permission checks must happen before dispatch.

---

## 7. P1 Provenance Hardening

- Rebuild hash chain from SQLite on startup.
- Store full SHA-256 hashes; short hashes may be display-only.
- Verify record and chain APIs must return stable JSON objects.
- Add JSON/CSV export path.
- Align ledger with GoldenTrace / Royalty Runtime fields.

---

## 8. P2 Aluminum OS Completion Gates

Before calling this an audited merged new version of Aluminum OS:

- Contract objects present and used.
- Router boot succeeds.
- Tests pass or failures documented.
- 10-case AUWS success matrix exists.
- INV-7 provider balance tracker stub exists.
- Budget-tier model exists.
- ConsentKernel stub exists.
- TransparencyPacketV02 fields include routing, governance, provenance, costs, verification.
- README/license posture matches Aluminum OS open-source strategy.

---

## 9. Step-by-Step Execution Plan

### Step 1 — Branch and audit plan

- Create `element145-copilot-phase1-reconcile`.
- Add this plan.

### Step 2 — Bring in contract layer

- Add `contracts/enums.py`.
- Add `contracts/models.py`.
- Add `contracts/__init__.py`.

### Step 3 — Add Copilot runtime modules incrementally

Add lower-risk modules first:

```text
element145/kernel/circuit_breaker.py
element145/transparency/bus.py
element145/provenance/merkle.py
element145/security/context.py
element145/security/permissions.py
```

Then add higher-risk modules:

```text
element145/security/auth.py
element145/kernel/pipeline.py
element145/kernel/stages.py
element145/kernel/scheduler.py
element145/classifier/engine.py
```

### Step 4 — Patch boot path

- Add/fix `main.py`.
- Add/fix middleware alias.
- Add/fix ledger constructor/count/verify APIs.

### Step 5 — Patch pipeline to contracts

- Add Ingress/Routing/Consent/ExecutionPlan stages.
- Update Transparency stage to emit `TransparencyPacketV02`.

### Step 6 — Add tests

- Start with contract tests.
- Add boot import test.
- Add pipeline smoke test.
- Add permission/destructive-action tests.
- Add provenance chain tests.

### Step 7 — Open PR for audit

- PR should be marked candidate Phase-1 reconciliation.
- PR should not claim production readiness until tests pass.

---

## 10. Current Status

Started.

This branch is the controlled path from Copilot's staggering Phase-1 runtime artifact to an audited merged Aluminum OS runtime update.
