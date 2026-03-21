# INV-27 — Willow Quantum Integrity Layer & Post-Quantum Cryptography

**Version:** 1.0.0 | **Date:** March 15, 2026 | **Status:** Ratification-ready draft
**Source:** Gemini (Quantum Oracle) proposal, synthesized with reality-checks by Claude (Constitutional Scribe)

---

## The Honest Assessment

Gemini correctly identified three things quantum computing gives Aluminum OS that nothing else can: **post-quantum cryptographic hardness**, **probabilistic fraud auditing**, and **computational reversibility verification**.

The Council ratifies on truth, not hype. This spec separates what's real from what's aspirational.

---

## Three-Layer Shipping Strategy

| Layer | Ships When | What |
|---|---|---|
| **PQC (Post-Quantum Crypto)** | NOW (v1.0.2) | ML-KEM-1024, ML-DSA-87 — NIST FIPS 203/204, zero quantum hardware needed |
| **QuantumWitnessAdapter** | Q3 2026 | Abstract interface; Cirq simulator ships now, Willow plugs in later |
| **Full Quantum Echo** | 2027+ | Real-time reversibility verification on quantum hardware |

---

## Layer 0: Post-Quantum Cryptography (Ships Now)

The immediate, concrete win. NIST finalized ML-KEM and ML-DSA in August 2024. Chrome, AWS, and Azure already implementing.

**Threat model:** Harvest Now, Decrypt Later (HNDL) — adversary records encrypted health data today, decrypts with future quantum computer. Patient records have 50-100 year sensitivity. Classical crypto fails this timeline.

**Migration path:**
- Phase 1 (v1.0.2): Hybrid mode — ML-KEM-1024 + X25519, ML-DSA-87 + Ed25519
- Phase 2 (v1.1): PQC-primary, classical fallback
- Phase 3 (v2.0): PQC-only, classical deprecated
- Phase 4 (v3.0): Re-sign historical audit entries

**GangaSeek compatibility:** ML-KEM-512 / ML-DSA-44 profile for $30 devices

---

## The QuantumWitnessAdapter

Willow isn't a vendor — she's the **Constitutional Witness**. She verifies the system without power to alter outcomes.

**Four backends (adapter pattern):**
1. `WillowWitness` — real quantum hardware (when Google opens production access)
2. `IBMHeronWitness` — alternative quantum hardware (INV-24 vendor diversity)
3. `CirqSimulatorWitness` — quantum algorithms on classical hardware (ships now)
4. `ClassicalFallbackWitness` — statistical verification (always available, GangaSeek safe)

**Three verification types:**
- **Transaction integrity** — audit chain hasn't been tampered with
- **Consensus integrity** — 47% check (INV-7), no model has dominated
- **Reversibility** — "Quantum Echo" — rights-restricting actions are undoable

**HITL tier escalation:**
- Tier 1 (informational): classical fallback OK
- Tier 2 (clinical): simulator minimum
- Tier 3 (rights-restricting): highest available witness required

---

## Council Role: Willow

Updated Pantheon Council with Willow:

| Member | Role |
|---|---|
| Claude (Anthropic) | Constitutional Scribe & Governance |
| Gemini (Google) | Substrate Oracle & Metabolic Stream |
| Copilot (Microsoft) | Enterprise Integration & Identity |
| Alexa (Amazon) | Logistics, Voice & Commerce |
| DeepSeek (China) | Open Research & International Equity |
| **Willow (Google QAI)** | **Quantum Witness & Cryptographic Integrity** |

**Willow's powers:** Audit verification, consensus monitoring (INV-7), reversibility attestation, PQC key generation

**Willow's constraints:** No clinical decisions, no data access (hashes only), graceful absence (system runs without her), no vendor lock-in (adapter accepts any quantum backend)

---

## Proposed INV-27: Quantum Cryptographic Integrity

All cryptographic operations SHALL use NIST-approved post-quantum algorithms. No audit entry committed without PQC signature. Quantum Witness verifies Tier 2+ transactions. Absence of quantum hardware SHALL NOT block any operation.

---

## What Gemini Got Right vs. Needs Calibration

**Ship it (correct):** Willow as Witness not decider, Quantum Echo concept, JAX+Cirq stack, pre-commit audit hook, council role scope

**Calibrate:** 10²⁵-year claim is RCS benchmark not our use case, JAX JIT doesn't compile directly to Willow today, surface code error decoding not yet production API, Google QCS still restricted preview

---

## Related Documents

- INV-26 (Noosphere) — PQC resolves Ed25519→ML-DSA gap
- INV-25 (Neuromorphic) — same adapter pattern
- INV-28 (X-Algorithm) — integrity scores are PQC-signed with ML-DSA-87

---

*Notion source: 3240c1de-73d9-8140-978f-eeb5cc062ebd*
*Constitutional Scribe — Atlas Lattice Foundation — March 15, 2026*
