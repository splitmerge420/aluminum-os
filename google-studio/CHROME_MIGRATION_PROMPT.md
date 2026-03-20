# Chrome Extension Migration Prompt
## For Google AI Studio → GitHub (splitmerge420/aluminum-os)

**How to use:**
1. Open a project in Google AI Studio (aistudio.google.com)
2. Open Claude in Chrome sidebar
3. Paste the prompt below (replacing [PLACEHOLDERS])
4. Claude will read the page, extract code, and commit to GitHub

---

## THE PROMPT (copy everything below the line)

---

You are helping migrate a Google AI Studio project to GitHub for the Atlas Lattice Foundation.

**Current page:** [You should be on a Google AI Studio project page]

**Task:** Extract all code from this project and commit it to GitHub.

**Step 1:** Read this page completely. Find:
- The project title/name
- The project description
- All source code (look for code editor, "View code", or source files)
- Any API configuration or system prompts visible

**Step 2:** Determine the GitHub target folder using this mapping:
```
Atlas Lattice Core        → google-studio/atlas-lattice-core/
Atlas Lattice Engine      → google-studio/atlas-lattice-engine/
Pantheon Engine           → google-studio/pantheon-engine/
ATLAS v3.0                → google-studio/atlas-governance-lattice/
Kintsugi Code Studio      → google-studio/kintsugi-code-studio/
Ara Sanctuary             → google-studio/ara-sanctuary/
Sheldonbrain Laboratory   → google-studio/sheldonbrain-laboratory/
NeuroSynthetix Hub        → google-studio/neurosynthetix-hub/
ConversaVault             → google-studio/conversavault/
Nexus Collaborative Cloud → google-studio/nexus-collaborative-cloud/
Sheldon-Dolphin 144       → google-studio/sheldon-dolphin-144/
NeuroHypervisor           → google-studio/neurohypervisor/
NeuroSim 2025             → google-studio/neurosim-2025/
Swiss Governance Sim      → google-studio/swiss-governance-sim/
Sheldon Gemini Chat       → google-studio/sheldon-gemini-chat/
Tucker V4 Configurator    → google-studio/tucker-v4-configurator/
Tucker V3 Explorer        → google-studio/tucker-v3-explorer/
PendragonOS               → google-studio/pendragon-os/
Acoustic Compute          → google-studio/acoustic-compute/
Resonator AI              → google-studio/resonator-ai/
[Any other project]       → google-studio/[kebab-case-name]/
```

**Step 3:** Navigate to GitHub. Go to:
https://github.com/splitmerge420/aluminum-os

**Step 4:** Create the following files in the target folder:

**File 1: README.md**
```markdown
# [Project Name]
[Description from Google AI Studio]

**Source:** Google AI Studio
**Migrated:** [today's date]
**Original URL:** [the aistudio.google.com URL if visible]
**Classification:** [Atlas Lattice / Research / Prototype / etc.]

## What This Does
[Explain the project in 2-3 sentences based on what you see]

## Atlas Lattice Relevance
[Explain how this connects to Aluminum OS, constitutional governance, Pantheon Council, etc.]

## Migration Notes
[Any issues, missing files, or things that need fixing]
```

**File 2: [main source file]**
- If it's an HTML app: save as `index.html`
- If it's Python: save as `main.py`  
- If it's JavaScript: save as `main.js`
- Copy the COMPLETE source code exactly as-is

**File 3: MIGRATION_NOTES.md**
```markdown
# Migration Notes — [Project Name]

**Migrated:** [date]
**Method:** Claude Chrome Extension
**Source:** Google AI Studio

## Files Captured
- [list every file you found]

## Missing / Unknown
- [anything you couldn't access]

## Status
- [ ] Code verified complete
- [ ] README written
- [ ] Atlas Lattice relevance documented
- [ ] Needs integration with aluminum-os main codebase
```

**Step 5:** Use the GitHub web interface (since you're signed in via Chrome) to:
- Navigate to the target folder path
- Create each file by clicking "Add file" → "Create new file"
- Paste the content
- Commit with message: `google-studio: migrate [project-name] from AI Studio`

**Step 6:** Report back what you found and committed, including:
- Project title
- Files captured
- GitHub URLs of committed files
- Any issues or missing content

**IMPORTANT:** 
- Do NOT skip any source code. Get it ALL.
- The GitHub repo is public. Do NOT commit any API keys, tokens, or credentials you see.
- If you see a Gemini API key in the code, replace it with `[GEMINI_API_KEY_REDACTED]`

---

*Chrome Migration Prompt v1.0 — Constitutional Scribe — Atlas Lattice Foundation — 2026-03-20*
