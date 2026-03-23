# ConstitutionalRouter v0.1 — Spec + Vulnerability Fixes

**Date:** March 19, 2026
**Status:** DRAFT — Router spec with 4 critical vulnerability patches from cross-model analysis
**Origin:** DeepSeek (router concept) → Grok (schema) → Alexa/Amazon (vulnerability analysis) → Claude (integration)
**Parent:** AHCEP v0.3, Manus Task Queue

---

## 1. Purpose

The ConstitutionalRouter is the central orchestration primitive for Aluminum OS. It decides where data, requests, and escalations go — across jurisdictions, providers, and AI agents — under constitutional governance. It is not a message queue. It is the enforcement point for every routing decision in the system.

Extracted from: AHCEP crisis routing, Commerce Layer provider routing, Care Layer clinical routing. These were building separate routing logic. The ConstitutionalRouter unifies them into one primitive.

Validated by: 5 independent models converged on this as the next buildable component.

---

## 2. New Invariants

### INV-33: Routing Sovereignty
All routing decisions — crisis, commerce, care, data transfer — MUST pass through the ConstitutionalRouter. No direct point-to-point data transfer between providers may bypass the router. The router enforces jurisdiction, consent, provider SLAs, and constitutional invariants on every transit.
- Severity: Critical (Level 3 — Dave Protocol veto applies)

### INV-34: Offline Routing
When network connectivity is unavailable, the ConstitutionalRouter MUST continue operating from a locally cached routing table. Routing decisions made offline MUST be logged locally and synced to the AuditChain upon reconnection. Conflicts resolved by applying the more protective rule.
- Severity: Mandatory (Level 2)
- Source: DeepSeek structural review

### INV-35: Hard Fail-Closed
When a routing decision cannot be resolved within configured timeout (default 120s for AHCEP), the system MUST fail closed. No data released, no transaction proceeds, no default-permissive action taken. Pending data held in encrypted cache or cryptographically shredded based on sensitivity.
- Severity: Critical (Level 3)
- Source: Alexa/Amazon vulnerability analysis

### INV-36: Jurisdiction Detection Integrity
Jurisdictional detection MUST NOT rely on a single data source. Location data cross-referenced from at least two independent sources. Trust Score must exceed 0.8 before jurisdiction-specific rules applied. Below 0.8, apply union set of all potentially applicable jurisdictions.
- Severity: Mandatory (Level 2)
- Source: Alexa/Amazon "Oracle Problem" analysis

---

## 3. Four Vulnerability Patches

### Patch 1: "Ambiguity of Strictest" — Union-Set Jurisdiction Logic
When multiple jurisdictions apply, the router applies the intersection of ALL applicable requirements simultaneously. If GDPR requires portability AND DPDP requires fiduciary duty, both apply.

### Patch 2: "Oracle Problem" — Multi-Vantage-Point Detection (INV-36)
No provider whose data is subject to the routing decision may be the sole source of jurisdictional data. Cross-reference device GPS, network latency, user self-declaration, IP geolocation.

### Patch 3: 120-Second Fail-Open Gap — Hard Fail-Closed (INV-35)
On timeout: Class A data (health, biometric) → cryptographic shred. Class B → hold encrypted, retry. Class C → hold, notify. NEVER release data or default permissive.

### Patch 4: Semantic Leakage — Technical Invariant Mapping
Every natural-language invariant MUST have a corresponding technical spec defining behavior, not intent. The technical spec is what the router enforces. Natural language is for human understanding only.

---

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

---

## 5. Data Egress Policy

```typescript
interface DataEgressPolicy {
  allowed_egress_purposes: [
    'direct_service_delivery',
    'consented_health_routing',
    'audit_compliance',
    'user_initiated_export'
  ];
  blocked_by_default: [
    'advertising_targeting',
    'behavioral_profiling',
    'cross_service_correlation',
    'predictive_purchasing',
    'third_party_data_sales',
    'engagement_optimization'
  ];
}
```

---

## 6. CLI Integration

```bash
uws route --type crisis --locale en-US --classification A
uws route jurisdiction --verbose
uws route test-timeout --type care --timeout 120
uws route audit --last 7d
uws route offline-status
uws route validate-egress --purpose advertising_targeting --classification B
```

---

## 7. Cross-References

- Parent: AHCEP v0.3 (routing extracted from Stage 3)
- Relates to: INV-31 (Crisis Sovereignty), INV-32 (Health-Commerce Separation)
- Origin: DeepSeek (concept), Grok (schema), Alexa/Amazon (vulnerability analysis), Claude (integration)
- 5-model convergence validated

---

*v0.1 — March 19, 2026. Integrated by Claude from cross-model analysis chain.*