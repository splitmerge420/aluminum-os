# Noosphere x Aluminum OS — Constitutional Knowledge Substrate & Decentralized Health Sovereignty

**Date:** March 15, 2026
**Status:** Draft — Pending Council Ratification

---

## Summary

Integration spec for Noosphere protocol (decentralized knowledge graph on IPFS) as the data sovereignty layer beneath Aluminum OS's Kernel. Every patient gets a cryptographically signed, content-addressed, IPFS-backed personal health sphere.

---

## Why This Fits

Noosphere and Aluminum OS share 9 architectural principles: user-owned data, key-based auth (UCAN / ConsentKernel), content addressing (IPFS / Audit Ledger), human-readable naming, versioned memos, offline-first, credible exit, and structured knowledge graphs.

---

## Architecture

**Hot Layer**: Qdrant vector DB (active inference, real-time search)
**Vault Layer**: Local encrypted store (PII, Class A data)
**Cold/Sovereign Layer**: Noosphere/IPFS (portable, permanent, patient-owned)

---

## Core Components

1. **PatientSphere** — IPFS-backed personal health space per patient (DID + UCAN identity)
2. **HealthMemo** — Noosphere memo format extended with 144-sphere classification, sensitivity, consent scope, HITL tier
3. **UCANConsentBridge** — Translates ConsentGrants to UCAN tokens and back. Revocation cascades per INV-4
4. **NoosphereAuditAnchor** — Publishes audit entries to IPFS for global verifiability
5. **OntologicalBridge** — Maps 144 sheldonbrain spheres to Noosphere /health/house/sphere/ paths
6. **VaultNoospherePolicy** — Constitutional rules for which data goes to IPFS (encrypted vault = patient opt-in only)
7. **Teilhard Layer** — Civilizational health commons via aggregated, anonymized spheres

---

## Proposed INV-26: Decentralized Data Sovereignty

Patient health data MUST be publishable to a decentralized, content-addressed storage layer at patient's request. No institution may prevent export to personal Noosphere sphere. The ultimate credible exit: if Aluminum OS ceases to exist, patient data survives on IPFS.

---

## What Noosphere Solves

- Cross-border portability (patient carries sphere)
- Institutional data hostage (data on IPFS, not in institution)
- Audit integrity (content-addressed, globally verifiable)
- Post-mortem sovereignty (sphere persists, executor has keys)
- Censorship resistance (IPFS pinning)

---

## Compatibility Gaps

1. Post-quantum crypto: Noosphere uses Ed25519, need ML-DSA migration path
2. IPFS hashing: SHA-256 may need post-quantum hash via multihash extension

---

## Technical Synergy

Noosphere core is written in Rust — same as Aluminum OS Forge Core. Natural integration.

---

## Roadmap

- Q2 2026: Noosphere SDK integration + PatientSphere creation
- Q3 2026: UCAN x ConsentKernel bridge + OntologicalBridge
- Q4 2026: Audit anchoring on IPFS
- Q1 2027: Encrypted Vault on Noosphere
- 2027+: Civilizational Health Commons

---

## Cross-References

- Related: Sheldonbrain Integration, Identity & Consent Kernel, NeuromorphicComputeAdapter
- Invariants: INV-4 (consent revocation), INV-26 (decentralized data sovereignty)