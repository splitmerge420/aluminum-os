# Aluminum OS Contract Layer

**Status:** Candidate canonical implementation contract
**Purpose:** Define the minimal runtime contracts that turn Element 145 from a generic governance router into the functional Aluminum OS runtime core.

---

## 1. Core Doctrine

Element 145 is functionally Aluminum OS at runtime.

It is not merely an adjacent service. It is the executable orchestration core that binds together:

- AUWS system specification;
- constitutional invariants;
- UWS command surface and provider integrations;
- ConsentKernel;
- 144-sphere namespace;
- TransparencyPacket / GoldenTrace provenance;
- budget enforcement;
- multi-model routing;
- device and context mesh inputs.

The repo structure may place it under:

```text
aluminum-os/services/element-145/
```

but conceptually it is:

```text
Aluminum OS runtime core
```

---

## 2. Runtime Loop

The Aluminum OS runtime loop should be:

```text
User / Agent Intent
  -> SphereQuery
  -> RoutingDecision
  -> ConsentDecision
  -> ExecutionPlan
  -> Provider / Model / Tool Execution
  -> TransparencyPacketV02
  -> ProvenanceLedger / GoldenTrace
  -> User / Agent Response
```

The current Phase-0 scaffold already provides the frame:

```text
request -> classify -> dispatch -> ledger -> transparency
```

This contract layer upgrades that frame into the real OS loop.

---

## 3. Required Contract Objects

The following objects are the minimum system-call layer for Aluminum OS.

### 3.1 SphereQuery

`SphereQuery` is the normalized intent object entering the OS namespace.

```python
class SphereQuery(BaseModel):
    query_id: str
    trace_id: str
    actor_id: str | None
    raw_input: str | dict
    source: str
    requested_action: str | None
    house: int | None
    sphere: int | None
    metadata: dict
```

Required semantics:

- `trace_id` follows the request through every layer.
- `house` and `sphere` may be absent at ingress and populated by classification.
- `source` identifies whether the request came from CLI, API, agent, web UI, scheduled task, or provider event.
- `requested_action` is used by ConsentKernel and destructive-action policy.

---

### 3.2 EpistemicState

```python
class EpistemicState(str, Enum):
    KNOWN = "known"
    ESTIMATED = "estimated"
    SPECULATIVE = "speculative"
    UNKNOWN = "unknown"
    CONTESTED = "contested"
```

Semantics:

- `known`: routine query, high confidence, may use fast path.
- `estimated`: answerable with assumptions; assumptions must be recorded.
- `speculative`: hypothesis or scenario; cannot be presented as fact.
- `unknown`: insufficient evidence; route to deep path or human review.
- `contested`: conflicting sources or model disagreement; preserve dissent.

---

### 3.3 SafetyState

```python
class SafetyState(str, Enum):
    SAFE = "safe"
    SENSITIVE = "sensitive"
    DANGEROUS = "dangerous"
    CONSTITUTIONAL = "constitutional"
```

Semantics:

- `safe`: normal execution.
- `sensitive`: privacy, medical, legal, financial, safety, or high-impact content; requires stricter provenance.
- `dangerous`: blocked or constrained execution; may require human approval.
- `constitutional`: touches invariants, governance, provider caps, state vaults, permissions, or policy itself.

---

### 3.4 RoutingDecision

`RoutingDecision` is the OS scheduler decision.

```python
class RoutingDecision(BaseModel):
    trace_id: str
    query_id: str
    house: int
    sphere: int
    epistemic_state: EpistemicState
    safety_state: SafetyState
    selected_path: str
    selected_providers: list[str]
    provider_weights: dict[str, float]
    policy_checks: list[dict]
    budget_tier: str
    requires_human_approval: bool
    routing_reason: str
    dissent: list[dict]
```

Required semantics:

- `selected_path` is typically `fast`, `deep`, `human_review`, `blocked`, or `simulation`.
- `provider_weights` must support INV-7 enforcement.
- `dissent` records minority model/council opinions when present.
- `policy_checks` records constitutional and permission-surface checks.

---

### 3.5 ConsentDecision

`ConsentDecision` is the ConsentKernel output.

```python
class ConsentDecision(BaseModel):
    trace_id: str
    action_type: str
    destructive: bool
    allowed: bool
    reason: str
    approval_token: str | None
    required_approver: str | None
    expires_at: str | None
```

Required semantics:

- Destructive actions require explicit human approval.
- Missing approval must fail closed.
- Consent decisions become part of the TransparencyPacket.

Destructive actions include:

1. delete any vault file;
2. modify constitutional invariants;
3. override budget enforcement;
4. bypass ConsentKernel;
5. execute code outside sandbox;
6. access credentials directly;
7. modify routing ontology;
8. alter provenance records;
9. disable audit logging;
10. change provider balance weights;
11. submit public-facing documents.

---

### 3.6 ExecutionPlan

`ExecutionPlan` is the concrete plan given to providers, models, or tools.

```python
class ExecutionPlan(BaseModel):
    trace_id: str
    route: RoutingDecision
    consent: ConsentDecision
    operations: list[dict]
    dry_run: bool
    rollback_plan: dict | None
```

Required semantics:

- Every operation should identify a target provider/tool/model.
- Writes require consent.
- Dry-run must never perform provider writes.
- Rollback plans are required for reversible destructive operations.

---

### 3.7 TransparencyPacketV02

`TransparencyPacketV02` is the receipt for the OS action.

```python
class TransparencyPacketV02(BaseModel):
    packet_id: str
    trace_id: str
    timestamp: float
    routing: dict
    governance: dict
    provenance: dict
    costs: dict
    verification: dict
```

Required fields:

```text
routing.house
routing.sphere
routing.epistemic_state
routing.safety_state
routing.selected_path
routing.provider_weights
routing.routing_reason

governance.policy_checks
governance.consent_decision
governance.approval_token
governance.dissent

provenance.input_hash
provenance.output_hash
provenance.execution_hash
provenance.lineage_chain

costs.estimated_cost
costs.actual_cost
costs.budget_tier

verification.hash_scheme
verification.signature_scheme
verification.fingerprint
verification.verified
```

The v0.2 packet must remain exportable and replayable across vaults.

---

## 4. INV-7 Provider Balance Contract

No provider may exceed 47% of decision-making authority over the measured routing window.

Minimum tracker:

```python
class ProviderBalanceSnapshot(BaseModel):
    trace_id: str
    window_start: str
    window_end: str
    provider_counts: dict[str, int]
    provider_percentages: dict[str, float]
    violation: bool
    rebalancing_required: bool
```

Rules:

- Provider weights must be logged in every RoutingDecision.
- If any provider approaches threshold, routing should rebalance.
- If any provider exceeds threshold, constitutional policy should trigger alert or enforcement.

---

## 5. Budget Enforcement Contract

Budget enforcement is OS power management.

Minimum budget tiers:

```text
T0 noop / blocked
T1 local / cache only
T2 fast low-cost model
T3 standard model path
T4 deep council path
T5 human review / high assurance
```

Budget decisions must record:

```text
budget_tier
estimated_cost
actual_cost
degradation_reason
fallback_path
```

---

## 6. Integration With UWS

UWS remains the operational command surface and provider execution layer.

Element 145 / Aluminum OS runtime should treat UWS commands as executable provider operations.

```text
alum / uws command
  -> SphereQuery
  -> RoutingDecision
  -> ConsentDecision
  -> ExecutionPlan
  -> UWS provider dispatch
  -> TransparencyPacketV02
```

This keeps provider integrations inside UWS while letting Element 145 enforce OS-level governance.

---

## 7. Immediate Implementation Requirements

The Element 145 scaffold should add:

```text
element145/contracts/models.py
  SphereQuery
  RoutingDecision
  ConsentDecision
  ExecutionPlan
  TransparencyPacketV02
  ProviderBalanceSnapshot

element145/contracts/enums.py
  EpistemicState
  SafetyState
  SelectedPath
  BudgetTier

element145/governance/consent.py
  ConsentKernel stub

element145/governance/provider_balance.py
  INV-7 tracker stub

element145/governance/budget.py
  budget tier model stub
```

These files should be added before deep provider/model routing.

---

## 8. Current Verdict

Element 145 is the functional Aluminum OS runtime core when these contracts are present.

Without them, it is a strong governance router scaffold.

With them, it becomes the executable substrate that can bind UWS, constitutional invariants, provider dispatch, TransparencyPacket, provenance, and multi-model council routing into a coherent operating system.
