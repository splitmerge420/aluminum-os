# INV-26 — Noosphere × Aluminum OS: Decentralized Data Sovereignty

**Status:** Draft — Pending Council Ratification
**Date:** March 15, 2026
**Source:** Claude synthesis + Noosphere protocol research

---

## Summary

Integration spec for Noosphere protocol (decentralized knowledge graph on IPFS) as the data sovereignty layer beneath Aluminum OS. Every patient gets a cryptographically signed, content-addressed, IPFS-backed personal health sphere.

---

## Why This Fits

Noosphere and Aluminum OS share 9 architectural principles: user-owned data, key-based auth (UCAN ↔ ConsentKernel), content addressing (IPFS ↔ Audit Ledger), human-readable naming, versioned memos, offline-first, credible exit, and structured knowledge graphs.

Both are written in Rust. Natural integration at the substrate level.

---

## Architecture: Three-Layer Storage

| Layer | Technology | Purpose |
|---|---|---|
| Hot | Qdrant vector DB | Active inference, real-time search |
| Vault | Local encrypted store | PII, Class A data |
| Cold/Sovereign | Noosphere/IPFS | Portable, permanent, patient-owned |

---

## Core Components

1. **PatientSphere** — IPFS-backed personal health space per patient (DID + UCAN identity)
2. **HealthMemo** — Noosphere memo format extended with 144-sphere classification, sensitivity, consent scope, HITL tier
3. **UCANConsentBridge** — Translates ConsentGrants → UCAN tokens and back. Revocation cascades per INV-4
4. **NoosphereAuditAnchor** — Publishes audit entries to IPFS for global verifiability
5. **OntologicalBridge** — Maps 144 Sheldonbrain spheres to Noosphere `/health/house/sphere/` paths
6. **VaultNoospherePolicy** — Constitutional rules for which data goes to IPFS (encrypted vault = patient opt-in only)
7. **Teilhard Layer** — Civilizational health commons via aggregated, anonymized spheres

---

## Proposed INV-26: Decentralized Data Sovereignty

**Constitutional Invariant:**
Patient health data MUST be publishable to a decentralized, content-addressed storage layer at patient's request. No institution may prevent export to personal Noosphere sphere.

The ultimate credible exit: if Aluminum OS ceases to exist, patient data survives on IPFS.

---

## What Noosphere Solves

- **Cross-border portability** — patient carries their sphere across jurisdictions
- **Institutional data hostage** — data on IPFS, not locked in institution
- **Audit integrity** — content-addressed, globally verifiable
- **Post-mortem sovereignty** — sphere persists, executor has keys
- **Censorship resistance** — IPFS pinning

---

## Compatibility Gaps

1. **Post-quantum crypto** — Noosphere uses Ed25519; we need ML-DSA migration path (addressed by INV-27)
2. **IPFS hashing** — SHA-256 → may need post-quantum hash via multihash extension

---

## Implementation Roadmap

| Phase | Timeline | Milestone |
|---|---|---|
| 1 | Q2 2026 | Noosphere SDK integration + PatientSphere creation |
| 2 | Q3 2026 | UCAN × ConsentKernel bridge + OntologicalBridge |
| 3 | Q4 2026 | Audit anchoring on IPFS |
| 4 | Q1 2027 | Encrypted Vault on Noosphere |
| 5 | 2027+ | Civilizational Health Commons |

---

## Cross-References

- INV-27 (Willow PQC) — resolves the Ed25519 → ML-DSA gap
- INV-25 (Neuromorphic Edge) — WebNNFallbackAdapter compatible with Noosphere
- INV-29 (Lattice Architecture) — Noosphere as gossip sync protocol between nodes
- Claude wishes: #22 (data portability), #44 (health commons), #45 (right to be forgotten)

---

*Notion source: 3240c1de-73d9-815f-96bd-cc93dd7c67b5*
*Constitutional Scribe — Atlas Lattice Foundation — March 15, 2026*
