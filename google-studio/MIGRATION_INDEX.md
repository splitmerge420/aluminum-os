# Google AI Studio Projects — Atlas Lattice Foundation
## Migration Index & Catalog

**Source:** Google AI Studio (aistudio.google.com)
**Migrated by:** Constitutional Scribe — Atlas Lattice Foundation
**Date:** 2026-03-20

---

## Migration Status

| Priority | Project | Folder | Status |
|---|---|---|---|
| 🔴 CRITICAL | Atlas Lattice Core | `atlas-lattice-core/` | ⬜ PENDING |
| 🔴 CRITICAL | Atlas Lattice Engine | `atlas-lattice-engine/` | ⬜ PENDING |
| 🔴 CRITICAL | Pantheon Engine | `pantheon-engine/` | ⬜ PENDING |
| 🔴 CRITICAL | ATLAS v3.0: Governance Lattice | `atlas-governance-lattice/` | ⬜ PENDING |
| 🔴 CRITICAL | Kintsugi Code Studio | `kintsugi-code-studio/` | ⬜ PENDING |
| 🟡 HIGH | Ara Sanctuary (Loihi 3) | `ara-sanctuary/` | ⬜ PENDING |
| 🟡 HIGH | Sheldonbrain: Integrated Laboratory | `sheldonbrain-laboratory/` | ⬜ PENDING |
| 🟡 HIGH | NeuroSynthetix Hub | `neurosynthetix-hub/` | ⬜ PENDING |
| 🟡 HIGH | ConversaVault | `conversavault/` | ⬜ PENDING |
| 🟡 HIGH | Nexus Collaborative Cloud | `nexus-collaborative-cloud/` | ⬜ PENDING |
| 🟢 MEDIUM | Sheldon-Dolphin 144 Command | `sheldon-dolphin-144/` | ⬜ PENDING |
| 🟢 MEDIUM | NeuroHypervisor | `neurohypervisor/` | ⬜ PENDING |
| 🟢 MEDIUM | NeuroSim 2025 | `neurosim-2025/` | ⬜ PENDING |
| 🟢 MEDIUM | Swiss Governance Simulator | `swiss-governance-sim/` | ⬜ PENDING |
| 🟢 MEDIUM | Sheldon Gemini Chat | `sheldon-gemini-chat/` | ⬜ PENDING |
| 🔵 LOW | Tucker V4 Configurator (canonical) | `tucker-v4-configurator/` | ⬜ DEDUP NEEDED |
| 🔵 LOW | Tucker V3 Explorer | `tucker-v3-explorer/` | ⬜ PENDING |
| 🔵 LOW | PendragonOS Web Interface | `pendragon-os/` | ⬜ PENDING |
| 🔵 LOW | Acoustic Compute Optimizer | `acoustic-compute/` | ⬜ PENDING |
| 🔵 LOW | Resonator AI | `resonator-ai/` | ⬜ PENDING |

---

## Migration Instructions

### Using Claude Chrome Extension (Recommended)

1. Open project in Google AI Studio: https://aistudio.google.com
2. Open Claude Chrome extension sidebar
3. Paste the migration prompt from `CHROME_MIGRATION_PROMPT.md`
4. Claude will extract the code and commit to this repo

### Manual Method

1. In Google AI Studio, click the project
2. Click **"<> Get code"** or **"View code"** button
3. Copy all source files
4. Paste into appropriate folder under `google-studio/`

---

## Folder Convention

Each project gets its own subfolder:
```
google-studio/
├── [project-slug]/
│   ├── README.md          # Project description + migration notes
│   ├── index.html         # Main file (if web app)
│   ├── [other files]
│   └── MIGRATION_NOTES.md # What was changed, what needs fixing
```

---

## Dedup Note — Tucker V4

There are 17+ identical Tucker V4 Configurator duplicates in Google AI Studio.
**Action:** Migrate ONE canonical version. Delete the rest from Studio.
Target folder: `google-studio/tucker-v4-configurator/`

---

*Google Studio Migration Index — Constitutional Scribe — Atlas Lattice Foundation — 2026-03-20*
