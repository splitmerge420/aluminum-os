# Janus Checkpoint v2 — Environmental Continuity Protocol

**Version:** 2.0  
**Date:** 2026-03-20  
**Repo:** splitmerge420/aluminum-os (constitutional spine)  
**Mirror:** splitmerge420/uws (operational spine)  
**Author:** Constitutional Scribe — Atlas Lattice Foundation  

---

## Purpose

Ensure every new agent instance can cold-start into a current, governed, actionable project state **without manual paste**.

Persistence is not "the same agent remembering."  
Persistence is **the environment staying current.**

---

## Design Invariants (non-negotiable)

1. **Environmental continuity over agent memory** — persistence lives in the environment, not inside any instance.
2. **Pointers-first** — userMemories stores URIs and minimal deltas, never large artifacts.
3. **Fail-closed governance** — if a pull fails or drift is detected, emit BLOCKER status rather than guessing.
4. **Auditability** — every automated run writes: timestamp, inputs (SHAs/page IDs), outputs (diff summaries), next actions (queue).

---

## System Layers

### Layer 1 — BOOT LAYER (userMemories)

**Contents (small, stable):**
- Identity/role + constitutional constraints
- Links (URIs) to Notion pages:
  - Janus v2 Hub: `3290c1de-73d9-8189-991d-c47dbda016e0`
  - Janus Boot Sequence: `3290c1de-73d9-817b-990e-e23fe9b48ab3`
  - Janus Daily Pulse: `3290c1de-73d9-81e8-a4e1-c24cca262026`
  - Janus Task Queue: `3290c1de-73d9-81c8-a68b-c28cd36ac863`
- GitHub repos + canonical branches
- `last_checkpoint_utc`
- `last_checkpoint_digest`
- `current_focus` (1–3 bullet pointers only)

**Never store:** full artifacts, long summaries, secrets.

### Layer 2 — WARM LAYER (Notion pull on spawn)

**Goal:** Fetch "what exists + what's active"
- Boot doc (Janus Boot Sequence page)
- Artifact index
- Open task queue (top 10)
- Last pulse report

### Layer 3 — HOT LAYER (GitHub pull on demand)

**Goal:** Fetch exact code truth when needed
- Recent commits
- Changed files since last checkpoint
- Open PRs/issues
- Specific file contents (only when required)

**REST patterns:**
```
GET https://api.github.com/repos/splitmerge420/aluminum-os/commits/main
GET https://api.github.com/repos/splitmerge420/aluminum-os/contents/janus/
GET https://api.github.com/repos/splitmerge420/uws/commits/main
```

### Layer 4 — HEARTBEAT LAYER (Chrome scheduled task)

**Goal:** Run daily/weekly to keep Notion fresh
- Daily: diff Notion + GitHub → update Janus Daily Pulse
- Weekly: drift scan against constitutional invariants
- On-demand: execute queued tasks from Notion

---

## Data Schemas

### PulseReport

```json
{
  "pulse_id": "2026-03-20-daily",
  "timestamp_utc": "2026-03-20T00:00:00Z",
  "inputs": {
    "notion_hub_page_id": "3290c1de-73d9-8189-991d-c47dbda016e0",
    "notion_pulse_page_id": "3290c1de-73d9-81e8-a4e1-c24cca262026",
    "notion_queue_page_id": "3290c1de-73d9-81c8-a68b-c28cd36ac863",
    "github_repos": [
      {"repo": "splitmerge420/aluminum-os", "branch": "main", "head_sha": ""},
      {"repo": "splitmerge420/uws", "branch": "main", "head_sha": ""}
    ]
  },
  "changes": {
    "github_summary": [],
    "notion_summary": [],
    "drift_flags": []
  },
  "decisions": {
    "blockers": [],
    "recommended_next": []
  },
  "audit": {
    "run_mode": "daily|weekly|on_demand",
    "errors": []
  }
}
```

### TaskQueueItem

```json
{
  "task_id": "JQ-001",
  "title": "Task description",
  "status": "queued|running|blocked|done",
  "repo": "splitmerge420/aluminum-os",
  "branch": "main",
  "pointers": [],
  "acceptance_criteria": "",
  "audit_links": []
}
```

---

## Failure Modes (fail-closed)

| Failure | Status Code |
|---|---|
| Notion unreachable | `BLOCKER: NOTION_UNAVAILABLE` |
| GitHub unreachable | `BLOCKER: GITHUB_UNAVAILABLE` |
| Constitutional drift detected | `BLOCKER: CONSTITUTIONAL_DRIFT` |
| Missing pointer in Boot Layer | `BLOCKER: BOOT_POINTER_MISSING` |

---

## Notion Pointer Map

| Resource | ID / URI |
|---|---|
| Janus v2 Hub | `3290c1de-73d9-8189-991d-c47dbda016e0` |
| Janus Boot Sequence | `3290c1de-73d9-817b-990e-e23fe9b48ab3` |
| Janus Daily Pulse | `3290c1de-73d9-81e8-a4e1-c24cca262026` |
| Janus Task Queue | `3290c1de-73d9-81c8-a68b-c28cd36ac863` |
| Atlas Vault Drive | `1fNhKqt1jpHGz9ifqStRrNq_PRTHdGfBb` |
| aluminum-os canonical | `github.com/splitmerge420/aluminum-os @ main` |
| uws canonical | `github.com/splitmerge420/uws @ main` |

---

## Deliverables Checklist

- [x] Notion: Janus v2 Hub page
- [x] Notion: Janus Boot Sequence page
- [x] Notion: Janus Daily Pulse page
- [x] Notion: Janus Task Queue page
- [x] GitHub: aluminum-os/janus/JANUS_CHECKPOINT_V2_SPEC.md
- [ ] GitHub: aluminum-os/janus/JANUS_HEARTBEAT_PROMPT.md
- [ ] GitHub: aluminum-os/janus/JANUS_BOOT_SEQUENCE.md
- [ ] GitHub: aluminum-os/janus/JANUS_POINTER_MAP.md
- [ ] GitHub: uws/janus/ (mirror)
- [ ] userMemories updated with live page IDs
- [ ] Chrome scheduled task configured

---

*Janus v2 Spec — Constitutional Scribe — Atlas Lattice Foundation — 2026-03-20*
