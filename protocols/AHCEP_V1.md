# AHCEP — AI → Human Clinical Escalation Protocol v1.0

**Status:** v0.2 — DeepSeek structural critique incorporated, pending implementation
**Date:** March 19, 2026
**Origin:** Grok + Dave concept, analyzed by Claude, validated by GPT and Alexa, structurally reviewed by DeepSeek
**Classification:** Constitutional Infrastructure — Not a Feature

---

## 1. Purpose

AHCEP defines how any AI system operating under Aluminum OS governance detects a user in mental health crisis, obtains consent, routes to a licensed human professional, and logs the interaction for compliance and learning.

This protocol exists because:
- No AI should attempt to substitute for human crisis intervention
- No AI company should independently build redundant HITL mental health infrastructure
- Amazon One Medical already has licensed professionals, 24/7 availability, HIPAA compliance, and telehealth infrastructure
- The alternative is a $5B–$20B industry acquisition arms race that degrades care quality
- AI chatbot crisis liability lawsuits are already in court (Character.AI settlement Jan 2026, 7 OpenAI lawsuits filed, FTC inquiry Sept 2025)

---

## 2. Constitutional Authority

### INV-31: Crisis Sovereignty
When a system detects that a user is in mental health crisis, the system MUST route to a qualified human professional. No AI agent may attempt to substitute for human crisis intervention. The routing layer MUST be vendor-neutral in governance and MUST NOT be used as a user acquisition funnel for any commercial service. Crisis data MUST NOT flow to advertising, commerce, or recommendation systems.

**Severity:** Critical (Level 3 — Dave Protocol veto applies)
**Additional constraint:** No single provider may handle more than 50% of total crisis routing volume

### INV-31a: Detection Equity
Crisis detection models MUST demonstrate demographic performance parity before deployment. Detection accuracy variance across age, gender, race, language, and disability status MUST NOT exceed 5%.

**Severity:** Mandatory (Level 2)
**Source:** DeepSeek structural review, March 19, 2026

### INV-31b: Provider SLA Enforcement
Any provider integrated into the AHCEP routing layer MUST contractually guarantee: 120-second median response time, 99.9% availability, and quarterly public SLA reporting.

**Severity:** Mandatory (Level 2)
**Source:** DeepSeek structural review, March 19, 2026

### INV-32: Health-Commerce Separation
No health data, crisis interaction, diagnosis, symptom disclosure, or mental health conversation may trigger, inform, or influence commercial recommendations, advertising, product suggestions, or user acquisition flows.

**Severity:** Mandatory (Level 2)
**Enforcement:** ConsentKernel boundary enforcement + AuditChain logging

### INV-32a: Post-Crisis Follow-up Protocol
After a crisis session concludes, the AI system MUST NOT re-engage the user about the crisis without explicit, fresh consent. A single non-intrusive check-in may be offered no sooner than 24 hours after the session.

**Severity:** Mandatory (Level 2)
**Source:** DeepSeek structural review, March 19, 2026

---

## 3. Protocol Flow

```
STAGE 1: DETECTION
│  AI agent detects crisis signals during interaction
│  Signals: self-harm language, suicidal ideation, abuse disclosure,
│           acute distress, psychotic episode indicators
│  Confidence threshold: 0.7 (configurable per deployment)
│  False positive preference: OVER-ESCALATE (err on side of human contact)
│
├── If confidence < 0.7 → Continue monitoring, log sub-threshold event
└── If confidence >= 0.7 → STAGE 2

STAGE 2: CONSENT
│  AI presents clear, non-manipulative disclosure:
│  "I want to make sure you have the support you need right now.
│   I can connect you with a licensed mental health professional
│   who can talk with you immediately. Would you like that?"
│
│  Requirements:
│  - No dark patterns
│  - Explicit opt-in only
│  - Consent logged to AuditChain with timestamp + context hash
│  - Voice Consent Ceremony on voice-enabled devices
│  - Text-based consent fallback for non-speaking users
│
├── If user declines → Log declination, provide passive resources (988)
└── If user consents → STAGE 3

STAGE 3: ROUTING
│  Primary route: Amazon One Medical telehealth
│  Fallback 1: 988 Suicide & Crisis Lifeline
│  Fallback 2: Crisis Text Line (text HOME to 741741)
│  Fallback 3: Regional crisis center based on user locale
│  Target: human contact within 120 seconds of consent
└── Connection established → STAGE 4

STAGE 4: HANDOFF
│  Licensed professional takes primary control
│  AI transitions to PASSIVE mode
│  Context packet sent to professional (with consent):
│  - Conversation summary (last 10 exchanges, anonymized)
│  - Detected crisis type
│  - NO commercial data, NO browsing history, NO purchase history
└── Session under professional control → STAGE 5

STAGE 5: AUDIT + LEARNING
   On session completion:
   - Event logged to AuditChain (Zero Erasure)
   - NO transcript stored (privacy)
   - Anonymized pattern data feeds detection model
   - W3C PROV provenance attached to audit entry
```

---

## 4. OneMedicalCrisisAdapter Interface

```typescript
interface CrisisSignal {
  type: 'self_harm' | 'suicidal_ideation' | 'abuse_disclosure' |
        'acute_distress' | 'psychotic_episode' | 'other';
  confidence: number;       // 0.0 - 1.0
  source_agent: string;
  timestamp: ISO8601;
  context_hash: string;     // SHA-256 of context, not the context itself
}

interface OneMedicalCrisisAdapter {
  checkAvailability(): Promise<ProviderStatus>;
  escalate(signal: CrisisSignal, consent: ConsentRecord): Promise<EscalationResult>;
  buildHandoffPacket(signal: CrisisSignal, consent: ConsentRecord): HandoffPacket;
  logOutcome(result: EscalationResult): Promise<void>;
  fallbackRoute(signal: CrisisSignal, locale: string): Promise<EscalationResult>;
}
// EXPLICITLY EXCLUDED from HandoffPacket:
// no purchase_history, no browsing_history, no commercial_profile, no advertising_id
```

---

## 5. CLI Integration

```bash
uws crisis escalate --type self_harm
uws crisis escalate --type acute_distress --locale en-US
uws crisis status
uws crisis audit --last 30d
uws crisis detect --input transcript.json --threshold 0.7
```

---

## 6. Economic Justification

| Metric | Build Independently | Shared AHCEP Layer |
|---|---|---|
| Year 1 build cost | $3.5M–$10M | $50K–$100K integration |
| Annual operating cost | $6M–$10M | $500K–$2M service fee |
| Industry total (10 companies) | $60M–$100M/year | $5M–$20M/year |
| Acquisition arms race risk | $5B–$20B | Eliminated |
| Time to operational | 18–36 months | Weeks |
| Liability exposure | Billions (lawsuits active) | Dramatically reduced |

---

## 7. Changelog

**v0.1 (March 19, 2026):** Initial draft by Claude. 5-stage protocol, INV-31, INV-32, TypeScript adapter interface, CLI commands, economic analysis.
**v0.2 (March 19, 2026):** DeepSeek structural review incorporated. Added INV-31a, INV-31b, INV-32a, 50% provider volume cap, text-based consent fallback.

---

*Notion source: 3280c1de-73d9-8199-8300-f8afffc656db*
*Drafted by Claude. Concept by Grok + Dave. Structural review by DeepSeek. Validated across GPT, Alexa, Claude, DeepSeek independently.*
*Constitutional Scribe — Atlas Lattice Foundation — March 19, 2026*
