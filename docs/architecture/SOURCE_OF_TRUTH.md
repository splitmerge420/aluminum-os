# Aluminum OS Source of Truth

**Status:** Stabilization memo
**Purpose:** Reconcile the current GitHub mirror into a coherent, buildable, user-friendly project structure without deleting prior work.
**Audience:** Dave Sheldon, Manus, Claude, Gemini, Copilot, GPT, and future implementation agents.

---

## 1. Canonical project framing

Aluminum OS is an AI-native workspace substrate.

It is not only a bare-metal operating system and it is not only a command-line tool. The clean model is layered:

```text
Human / AI intent
        |
        v
alum / uws command surface
        |
        v
Aluminum substrate: identity, memory, governance, provenance, agent runtime
        |
        v
Provider drivers: Google Workspace, Microsoft 365, Apple/iCloud, Android, Chrome, Notion, GitHub, Slack, Linear, and future plugins
```

The project should be organized around the distinction between:

- **Command surface:** what humans and agents invoke.
- **Substrate:** identity, memory, governance, provenance, policy, and agent orchestration.
- **Provider drivers:** ecosystem-specific integrations.
- **Artifacts:** Manus, Claude, Gemini, Copilot, GPT, and human-generated source materials that feed the architecture but are not automatically authoritative.

---

## 2. Current repository roles

### `atlaslattice/uws`

`uws` is the current operational core.

It should remain the working command-surface repository for cross-provider CLI execution. Its role is to normalize Google Workspace, Microsoft 365, Apple/iCloud, Android, Chrome, and future providers behind a JSON-first interface suitable for both humans and AI agents.

Near-term implementation should prioritize:

- stable command grammar;
- provider driver interface;
- authentication and credential storage;
- normalized JSON schemas;
- safe write confirmations;
- audit output;
- agent skill files for Manus, Claude, Gemini, GPT, and other agents.

### `atlaslattice/aluminum-os`

`aluminum-os` should be the umbrella architecture, governance, and reference-implementation repository.

It should contain:

- canonical vision and product positioning;
- architecture specifications;
- interface contracts;
- governance and constitutional substrate documents;
- roadmap and acceptance criteria;
- reference packages that prove the substrate.

The current Royalty Runtime material is valuable, but it should be treated as a subsystem or adjacent product line, not the entire public identity of Aluminum OS unless explicitly chosen later.

### `atlaslattice/manus-artifacts`

`manus-artifacts` should be treated as an archive and staging area.

Manus outputs are important source materials. They should be vaulted with metadata, reviewed, and promoted into canonical docs or implementation issues only after they are reconciled with the source-of-truth architecture.

### `atlaslattice/aluminum-os-v3`, `constitutional-os`, and related repos

These should be reviewed as candidate source-material repositories. Their contents should either be:

- merged into `aluminum-os/docs` when canonical;
- linked from `aluminum-os/archives` when historical;
- split into standalone packages when independently buildable.

---

## 3. Canonical repo layout target

```text
README.md
ROADMAP.md
CONTRIBUTING.md
LICENSE

docs/
  vision/
    aluminum-os-overview.md
    product-positioning.md
    user-experience-principles.md
  architecture/
    SOURCE_OF_TRUTH.md
    enterprise-spec-v1.md
    aluminum-kernel.md
    agent-runtime.md
    governance-layer.md
    provenance-layer.md
    memory-substrate.md
    interface-contracts.md
  integrations/
    uws-command-surface.md
    microsoft-graph.md
    google-workspace.md
    apple-icloud.md
    android.md
    chrome.md
    notion.md
    github.md
    manus.md
    claude.md
    gemini.md
    copilot.md
    gpt.md
  implementation/
    acceptance-criteria.md
    milestone-plan.md
    migration-plan.md

packages/
  alum-cli/
  agent-control-plane/
  governance-engine/
  provenance-graph/
  memory-substrate/
  royalty-runtime/

archives/
  manus/
  claude/
  gemini/
  copilot/
  gpt/
```

This layout allows the project to be understandable to three audiences simultaneously:

1. **Users:** what does it do and why should I care?
2. **Developers:** what can I build, run, and test?
3. **Agents:** what is canonical, what is archival, and what is safe to modify?

---

## 4. Promotion rules for artifacts

No artifact becomes canonical merely because it exists.

An artifact is promoted from archive to canonical only when it has:

1. a clear purpose;
2. a responsible source or agent;
3. a creation date;
4. Sphere144 or equivalent ontology tags when available;
5. a link to upstream conversation or source repo when available;
6. a status: `draft`, `candidate`, `canonical`, `deprecated`, or `archival`;
7. acceptance criteria if it implies implementation;
8. consistency with the current interface contracts.

Suggested metadata block:

```yaml
artifact_id: TBD
created: YYYY-MM-DD
source: Manus | Claude | Gemini | Copilot | GPT | Human | Multi-council
status: draft | candidate | canonical | deprecated | archival
sphere144_tags: []
related_repos: []
related_files: []
concepts_introduced: []
implementation_required: true | false
acceptance_criteria: []
```

---

## 5. Build priority

The safest build order is:

### Phase 0 — Stabilize the repository

- Add this source-of-truth map.
- Inventory docs and artifacts.
- Decide which repo is canonical for each subsystem.
- Create issues for promotion/migration work.

### Phase 1 — Ship the command surface

- Treat `uws` as the immediate operational layer.
- Normalize provider driver contracts.
- Add safe write confirmations and audit logs.
- Add agent-facing skill files.

### Phase 2 — Introduce `alum`

- Build `alum` as the user-friendly provider-agnostic wrapper.
- Route commands to `uws` providers.
- Add normalized resources: mail, calendar, drive, contacts, tasks, notes, search, sync.

### Phase 3 — Add the substrate

- Agent Control Plane.
- Governance engine.
- Provenance graph.
- Memory substrate.
- Policy enforcement and consent flows.

### Phase 4 — Promote advanced OS work

- Bare-metal or microkernel work should remain a long-term research track.
- It should not block the middleware/product path.
- Every kernel claim should map to a testable milestone.

---

## 6. User-friendliness principles

Aluminum OS should be acceptable and usable by normal people, developers, enterprises, and AI agents.

Therefore:

- Do not lead with internal mythology.
- Lead with the user benefit: one command surface, one memory layer, one governance layer, all clouds.
- Make every write operation understandable and reversible.
- Make consent explicit.
- Make provenance visible without overwhelming the user.
- Make the system useful before it is philosophically complete.
- Keep advanced constitutional and Pantheon concepts available, but layered behind practical workflows.

Suggested public summary:

> Aluminum OS is an open-source AI-native workspace layer. It gives humans and AI agents one safe, auditable command surface across Google Workspace, Microsoft 365, Apple/iCloud, Android, Chrome, GitHub, Notion, and future tools.

---

## 7. Non-destructive migration policy

Until the repository is fully audited:

- Do not delete Manus, Claude, Gemini, Copilot, GPT, or human artifacts.
- Do not overwrite large specs without preserving old versions.
- Prefer additive moves: create canonical summaries, then link to archives.
- Use pull requests for structural changes.
- Use issues for unresolved decisions.

This keeps the project moving without losing prior work.

---

## 8. Immediate next actions

1. Create an inventory of all Aluminum-related repositories.
2. Create an inventory of all major specs and artifact dumps.
3. Open GitHub issues for:
   - reconcile `aluminum-os` README with umbrella architecture;
   - clarify Royalty Runtime as subsystem or separate product;
   - define `uws` provider driver interface;
   - define `alum` wrapper MVP;
   - promote enterprise spec into `docs/architecture`;
   - archive Manus artifacts with metadata.
4. Add a root roadmap linking `uws`, `alum`, governance, provenance, and memory substrate milestones.

---

## 9. Working doctrine

Build the thing people can use first.

The universal command surface is the wedge. Governance, provenance, memory, and agent orchestration make it defensible. Bare-metal OS work is the moonshot track, not the blocker.
