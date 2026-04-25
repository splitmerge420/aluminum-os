# INV-7d — Cost Transparency and Provider Auth Modes

**Status:** Approved doctrine / pending implementation  
**Date:** 2026-04-25  
**Branch:** `element145-copilot-phase1-reconcile`  
**Source:** Convenor + Constitutional Scribe verification, incorporated by GPT

---

## 1. Invariant

No subscription-based service may be a hard dependency of the UWS / Element 145 kernel.

Where provider terms permit, the kernel may opportunistically route through user-owned subscription quota with explicit user consent to reduce incremental cost.

Where provider terms prohibit subscription delegation, the kernel must use API-key, hyperscaler, local, or other compliant paths.

The routing layer must surface meaningful cost differences before execution when costs differ materially.

---

## 2. Provider Auth Modes

Element 145 recognizes four provider authentication / execution modes:

```text
subscription_oauth  — reserved for providers whose terms explicitly permit third-party subscription delegation
api_key             — direct provider API key, consumption billing
hyperscaler         — provider/model access through cloud distributor such as Azure Foundry, Bedrock, Vertex, etc.
local               — local/on-device runtime such as Ollama, Foundry Local, MLX, llama.cpp
```

As of the current verification checkpoint, `subscription_oauth` is a reserved architectural slot, not a currently implemented live path for the verified frontier providers.

---

## 3. Verified Frontier Provider Matrix — April 25, 2026

| Provider | Subscription Delegation | API Key | Hyperscaler Path | Status |
|---|---:|---:|---:|---|
| Anthropic | Prohibited | Required | Bedrock, Vertex, Foundry | verified by Scribe / pending local source archive |
| OpenAI | Prohibited | Required | Azure Foundry | verified by Scribe / pending local source archive |
| Google Gemini | Prohibited | Required | Vertex AI | verified by Scribe / pending local source archive |
| Microsoft Copilot | Unverified | Available | Foundry direct | deferred |
| xAI / Grok | Unverified | Available | Limited | deferred |
| DeepSeek | Unverified | Available | Limited | deferred |
| Local runtimes | N/A | N/A | N/A | local execution |

---

## 4. Implementation Rule

Implement only ToS-compliant live auth paths:

- `api_key`
- `hyperscaler`
- `local`

Keep `subscription_oauth` in the enum/spec, but raise `NotImplementedError` with a clear message unless/until a provider is verified as permitting third-party subscription delegation.

---

## 5. User-Facing Cost Transparency

When a user has a subscription but provider terms prohibit third-party delegation, the cost surface must say so plainly.

Example:

```text
Routing: Anthropic Claude
Path: API key (consumption billing)
Cost: ~$0.03 for this request
Note: Your Claude Max subscription cannot be used here because Anthropic terms prohibit third-party subscription delegation.
```

The system should not hide provider-imposed double-billing dynamics. Users should see subscription quota, consumption billing, hyperscaler, and local/free alternatives honestly.

---

## 6. Module Placement

Implement as:

```text
Module 16K — Provider Auth Mode + Cost Transparency Matrix
```

Sequence:

```text
16N Phase 3 — Notion CLI + route integration
16C — OpenAI adapter
16K — Provider Auth Mode + Cost Transparency Matrix
16D–16F — Anthropic / xAI / DeepSeek adapters
16G — multi-provider routing
16H — INV-7 provider balance enforcement
```

---

## 7. Constitutional Rationale

The regenerative-vs-extractive posture requires transparent cost presentation, not hidden routing economics.

The kernel must comply with provider terms while still exposing to users where those terms create cost asymmetry or double-billing.
