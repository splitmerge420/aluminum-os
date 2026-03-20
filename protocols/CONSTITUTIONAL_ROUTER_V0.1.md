---
title: "ConstitutionalRouter v0.1 — Spec + Vulnerability Fixes"
version: "0.1.0"
date: "2026-03-19"
author: "Claude (integration) from DeepSeek → Grok → Alexa/Amazon chain"
sphere_tags: ["S069", "S109", "S016"]
aluminum_layer: "L2-Kernel"
council_status: "approved"
invariants_added: ["INV-33", "INV-34", "INV-35", "INV-36"]
notion_source: "https://notion.so/3290c1de73d981419402e1a285f93e0c"
cross_refs:
  - repo: "aluminum-os"
    path: "kintsugi/spec/golden_trace_v1.json"
  - repo: "aluminum-os"
    path: "protocols/AHCEP_V1.md"
  - repo: "uws"
    path: "janus/JANUS_V2_SPEC.md"
---

# ConstitutionalRouter v0.1 — Spec + Vulnerability Fixes

**Status:** DRAFT | **Date:** March 19, 2026
**Origin:** DeepSeek (router concept) → Grok (schema) → Alexa/Amazon (vulnerability analysis) → Claude (integration)
**Validation:** 5-model convergence (DeepSeek, Grok, Gemini, GPT, Claude)

## 1. Purpose

The ConstitutionalRouter is the central orchestration primitive for Aluminum OS. It decides where data, requests, and escalations go — across jurisdictions, providers, and AI agents — under constitutional governance. It is not a message queue. It is the enforcement point for every routing decision in the system.

Extracted from: AHCEP crisis routing, Commerce Layer provider routing, Care Layer clinical routing. These were building separate routing logic. The ConstitutionalRouter unifies them into one primitive.

## 2. New Invariants

### INV-33: Routing Sovereignty
**Text:** All routing decisions — crisis, commerce, care, data transfer — MUST pass through the ConstitutionalRouter. No direct point-to-point data transfer between providers may bypass the router. The router enforces jurisdiction, consent, provider SLAs, and constitutional invariants on every transit. No single provider may influence routing decisions for traffic that includes competitors.
**Severity:** Critical (Level 3 — Dave Protocol veto applies)

### INV-34: Offline Routing
**Text:** When network connectivity is unavailable, the ConstitutionalRouter MUST continue operating from a locally cached routing table. Routing decisions made offline MUST be logged locally and synced to the AuditChain upon reconnection. Conflicts between offline decisions and updated routing rules are resolved by applying the more protective rule. Offline mode MUST NOT degrade consent enforcement.
**Severity:** Mandatory (Level 2)

### INV-35: Hard Fail-Closed
**Text:** When a routing decision cannot be resolved within the configured timeout (default 120 seconds for AHCEP, configurable per route type), the system MUST fail closed. Fail-closed means: no data is released, no transaction proceeds, no default-permissive action is taken. Pending data is either held in encrypted local cache or cryptographically shredded, depending on sensitivity classification. No system may implement fail-open as a timeout default.
**Severity:** Critical (Level 3)

### INV-36: Jurisdiction Detection Integrity
**Text:** Jurisdictional detection for routing decisions MUST NOT rely on a single data source. Location data must be cross-referenced from at least two independent sources (device GPS, network latency analysis, user self-declaration, IP geolocation). No provider whose data is subject to the routing decision may be the sole source of jurisdictional data. A Trust Score for location confidence must exceed 0.8 before jurisdiction-specific rules are applied. Below 0.8, the router applies the union set of all potentially applicable jurisdictions.
**Severity:** Mandatory (Level 2)

## 3. Four Vulnerability Patches

### Patch 1: "Ambiguity of Strictest" — Union-Set Jurisdiction Logic
**Problem:** When multiple jurisdictions apply (EU user on US platform with Indian data processor), selecting the "strictest" is qualitative — GDPR is stricter on portability, DPDP is stricter on fiduciary duty.
**Fix:** Apply the intersection of ALL applicable requirements simultaneously. The union set is always more protective than any single jurisdiction.

### Patch 2: "Oracle Problem" in Jurisdiction Detection — Multi-Vantage-Point (INV-36)
**Problem:** If Amazon provides the location data, Amazon controls where the router thinks the user is. The entity whose behavior is being governed cannot be the sole source of the governance input.
**Fix:** Cross-reference from ≥2 independent sources. Trust Score must exceed 0.8.

### Patch 3: 120-Second Fail-Open Gap — Hard Fail-Closed (INV-35)
**Problem:** When AHCEP escalation times out, the original spec didn't define what happens to in-flight data.
**Fix:** Class A (health, biometric, crisis) → cryptographic shred. Class B (behavioral) → hold encrypted. Class C (public) → hold + notify. NEVER release or proceed.

### Patch 4: Semantic Leakage in Constitutional Principles — Technical Invariant Mapping
**Problem:** Natural language invariants like "no surveillance capitalism" can be lawyered.
**Fix:** Every invariant MUST have a corresponding technical specification that defines behavior, not intent. The technical spec is what the router enforces.

## 4. Router Core Architecture

```typescript
interface ConstitutionalRouter {
  route(request: RoutingRequest): Promise<RoutingDecision>;
  resolveJurisdiction(context: RoutingContext): Promise<JurisdictionResult>;
  selectProvider(requirements: RequirementSet, providers: Provider[]): Provider;
  fallback(failed: Provider, context: RoutingContext): Promise<Provider>;
  handleTimeout(pending: PendingRequest): TimeoutAction;
  routeOffline(request: RoutingRequest, cache: LocalRoutingTable): RoutingDecision;
  logDecision(decision: RoutingDecision): Promise<AuditEntry>;
  validateEgress(data: DataPayload, purpose: string): EgressValidation;
}

interface RoutingRequest {
  type: 'crisis' | 'care' | 'commerce' | 'data_transfer' | 'ai_to_ai';
  source_agent: string;
  destination_hint?: string;
  data_classification: 'A' | 'B' | 'C';
  user_consent: ConsentRecord;
  context: RoutingContext;
}

interface RoutingDecision {
  status: 'routed' | 'fallback_used' | 'failed_closed' | 'offline_cached';
  provider: string;
  jurisdiction_applied: Jurisdiction[];
  egress_validated: boolean;
  latency_ms: number;
  audit_ref: string;
}
```

## 5. CLI Integration

```bash
uws route --type crisis --locale en-US --classification A
uws route jurisdiction --verbose
uws route test-timeout --type care --timeout 120
uws route audit --last 7d
uws route offline-status
uws route validate-egress --purpose advertising_targeting --classification B
```

## 6. DISCLAIMER

> ⚠️ REFERENCE ARCHITECTURE — Not certified for clinical use. Requires independent legal review before any deployment involving PHI.

---

*Integrated by Claude from cross-model analysis chain. Every vulnerability patch addresses a real production failure mode.*
*Atlas Lattice Foundation © 2026*