---
title: "Kintsugi — Governance Spine for Aluminum OS"
version: "1.0.0"
date: "2026-03-20"
author: "Claude (Constitutional Scribe)"
sphere_tags: ["S144", "S069", "S109"]
aluminum_layer: "L1-Constitutional"
council_status: "approved"
---

# Kintsugi 金継ぎ

> Every break becomes a golden seam of strength.

Kintsugi is the **governance spine** of the Aluminum OS ecosystem. It provides a standardized format for audit traces, constitutional enforcement policies, and the SDK libraries that emit them.

## What's Here

| Directory | Contents |
|-----------|----------|
| `spec/` | GoldenTrace v1.0 JSON Schema — the canonical event format |
| `sdk/` | Python SDK (zero deps) for emitting, validating, and chaining traces |
| `policies/` | OPA/Rego policies enforcing constitutional invariants |
| `adapters/` | (Coming) Adapters for UWS CLI, ModelRouter, Sheldonbrain |

## Quick Start

```python
from kintsugi.sdk.golden_trace import GoldenTraceEmitter

emitter = GoldenTraceEmitter(repo="aluminum-os", module="engine/ontology_manager")

# Emit a standard trace
trace = emitter.emit(
    event_type="classification",
    sphere_tag="H4.S7",
    aluminum_layer="L3-Engine",
    payload={"document_id": "abc123", "confidence": 0.94},
    invariants_checked=["INV-3"]
)

# Emit a golden repair (failure → strength)
repair = emitter.emit_golden_repair(
    original_failure_trace_id="<uuid-of-failure>",
    repair_strategy="Retried with fallback model after primary timeout",
    strength_gained="Added timeout threshold to ModelRouter config",
    beauty_score=0.85,
    sphere_tag="H4.S7",
    aluminum_layer="L3-Engine",
    payload={"fallback_model": "gemini", "latency_ms": 340}
)

# Verify chain integrity
assert emitter.verify_chain()

# Get all golden seams (scars that became strengths)
golden_seams = emitter.get_golden_seams()
```

## Philosophy

In traditional Japanese kintsugi, broken pottery is repaired with gold — the repair becomes more beautiful than the original. In Aluminum OS:

- **Every failure** produces a GoldenTrace
- **Every repair** is recorded with what was learned
- **Every golden seam** makes the system stronger
- **The audit chain** is append-only and hash-linked
- **Constitutional invariants** are enforced by policy, not hope

## Related

- [aluminum-os](https://github.com/splitmerge420/aluminum-os) — The OS that emits traces
- [uws](https://github.com/splitmerge420/uws) — CLI that emits traces
- [144-sphere-ontology](https://github.com/splitmerge420/144-sphere-ontology) — Sphere tags referenced in every trace

---

*Atlas Lattice Foundation © 2026*