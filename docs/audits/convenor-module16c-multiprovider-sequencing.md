# Convenor Checkpoint — Module 16C+ Multi-Provider Sequencing

**Status:** Active sequencing decision  
**Branch:** `element145-copilot-phase1-reconcile`  
**Purpose:** Pause Module 17 observability until the live execution path is expanded beyond one provider and routing/INV-7 measurement become meaningful.

---

## 1. Decision

Module 16B (Gemini live adapter) is necessary but insufficient.

Proceed with additional live provider adapter modules before Module 17:

```text
Module 16C — OpenAI / GPT provider adapter
Module 16D — Anthropic / Claude provider adapter
Module 16E — xAI / Grok provider adapter
Module 16F — DeepSeek provider adapter
Module 16G — Multi-provider routing + INV-7 provider balance enforcement
Module 17  — Observability and metrics
```

Rationale:

- AUWS requires provider-agnostic multi-model execution.
- Pantheon Council architecture requires multiple council members to be callable.
- INV-7 cannot be measured with only one live provider.
- Observability is more useful after routing can actually choose among providers.

---

## 2. Architecture Check

The current ProviderAdapter abstraction is mostly provider-agnostic:

```text
ProviderExecutionResult
ProviderAdapter protocol
ProviderRegistry
LocalStubProvider
GeminiProvider
```

A provider can be added by creating a new file such as:

```text
services/element-145/element145/integrations/providers/openai.py
services/element-145/element145/integrations/providers/anthropic.py
services/element-145/element145/integrations/providers/xai.py
services/element-145/element145/integrations/providers/deepseek.py
```

and registering it in `ProviderRegistry`.

However, current architecture still needs generalization because:

- `GeminiProvider` is text-generation specific;
- `ExecutionPlanStage` still emits `local_stub` directly;
- provider selection is not yet driven by classification/routing policy;
- no provider balance tracker exists yet;
- provider result metadata is minimal.

---

## 3. Routing Check

Current routing is not yet true multi-provider routing.

Current state:

```text
RoutingDecision.selected_providers -> local_stub
ExecutionPlan.operations -> local_stub
ProviderRegistry -> local_stub / gemini available
```

Needed:

- provider selection rules in policy/config;
- query-type/domain mapping to provider(s);
- explicit `default_provider` handling;
- fallback provider order;
- provider balance snapshot for INV-7;
- routing decision must record actual provider selection truthfully.

---

## 4. Acceptance Criteria for 16C–16G

Each live provider module must include:

1. opt-in live mode only;
2. explicit missing-key error;
3. timeout/error handling;
4. no silent fallback to stub;
5. provider result contains:
   - provider name;
   - model name;
   - dry_run truth;
   - status;
   - output text or structured error;
6. provenance/transparency must record actual provider used.

Module 16G is complete only when:

- routing can choose among at least Gemini, OpenAI, Anthropic, xAI, DeepSeek, and local_stub;
- provider selection is policy/config driven;
- provider balance tracker records usage;
- INV-7 warnings/violations can be computed over a window;
- `/route` response shows selected provider(s), actual provider result(s), and provider balance snapshot.

---

## 5. Terminology Correction

Before 16G, describe the system as:

> contract-aware Aluminum OS runtime with closed-loop execution and one live Gemini provider path.

After 16G, if provider routing and balance are working, describe as:

> multi-provider Aluminum OS runtime slice with live provider adapters, policy-driven routing, consent gating, provenance, transparency, and INV-7 measurement.
