# Fork Sync Strategy — aluminum-os

## Why We Fork

Our forks are **constitutional overlays, not replacements**. Each upstream
project carries its own development velocity, community, and intent. We fork
to layer our own governance, configuration, and integration patterns on top—
preserving the original while extending it for our purposes.

Think of it as kintsugi for code: the upstream is the vessel, our changes are
the gold that fills the cracks. Both are essential; neither is diminished.

### What a fork gives us

- **Stability boundary** — We control when upstream changes enter our stack.
- **Constitutional overlay** — Local policies, CI gates, and configuration
  that upstream doesn't need or want.
- **Auditability** — Every divergence from upstream is an explicit, traceable
  decision recorded in git history.
- **Contribution readiness** — Our fork is always one `git push upstream` away
  from contributing back.

## Managed Forks

| Fork | Upstream | Purpose |
|------|----------|---------|
| `splitmerge420/claude-plugins-official` | `anthropics/claude-plugins-official` | Official plugin specs |
| `splitmerge420/servers` | `modelcontextprotocol/servers` | MCP server implementations |
| `splitmerge420/claude-code` | `anthropics/claude-code` | Claude Code CLI tooling |
| `splitmerge420/awesome-claude-code` | `hesreallyhim/awesome-claude-code` | Curated resources |
| `splitmerge420/awesome-claude-plugins` | `ComposioHQ/awesome-claude-plugins` | Plugin ecosystem catalog |
| `splitmerge420/claude-code-plugins-plus-skills` | `jeremylongshore/claude-code-plugins-plus-skills` | Extended plugins & skills |
| `splitmerge420/awesome-claude-plugins2` | `quemsah/awesome-claude-plugins` | Alternative plugin catalog |
| `splitmerge420/cc-marketplace` | `ananddtyagi/cc-marketplace` | Community marketplace |
| `splitmerge420/claude-code-mcp` | `KunihiroS/claude-code-mcp` | MCP integration for Claude Code |
| `splitmerge420/awesome-claude-code-plugins` | `ccplugins/awesome-claude-code-plugins` | Plugin directory |

## Sync Frequency and Strategy

### Schedule

- **Weekly** — Every Sunday at 00:00 UTC via GitHub Actions cron.
- **On-demand** — Manual trigger via `workflow_dispatch` from the Actions tab.
- **Dry run mode** — Available on manual trigger to preview changes without
  pushing.

### Strategy: Merge, Never Force-Push

We use `git merge` exclusively. Force-push is prohibited because:

1. **Local overlay preservation** — Our constitutional changes must never be
   overwritten by upstream.
2. **Audit trail integrity** — Every merge commit is a GoldenTrace event
   recording what was incorporated and when.
3. **Collaboration safety** — Other contributors' work on the fork is never
   lost.

The workflow:

```
upstream/main ──────●────●────●────●──────
                     \              \
fork/main    ──●──●───M────●────●────M────
               ↑  ↑   ↑         ↑    ↑
             local  local merge local merge
             work   work  from  work  from
                          upstream    upstream
```

Each `M` (merge) is an auditable sync point.

## Handling Merge Conflicts — The Kintsugi Protocol

When upstream changes conflict with our local overlay, we follow the
**kintsugi protocol**: keep both, annotate the seam.

### Steps

1. **Automated detection** — The sync workflow detects conflicts and aborts
   the merge cleanly. A `SYNC_CONFLICT` warning is emitted as a GoldenTrace
   annotation.

2. **Manual resolution** — A maintainer checks out the fork and runs:
   ```bash
   git fetch upstream
   git merge upstream/main
   # Resolve conflicts...
   ```

3. **Keep both where possible** — If upstream adds a feature and we have a
   local override in the same area:
   - Preserve our override (it exists for a reason).
   - Incorporate the upstream intent if it doesn't violate our constitutional
     constraints.
   - Add an inline comment marking the resolution:
     ```
     # kintsugi: kept local overlay, incorporated upstream intent
     # upstream-sha: abc1234
     # resolution-date: 2026-03-20
     ```

4. **Document the decision** — Add a brief note to the merge commit message
   explaining why the conflict was resolved the way it was.

5. **Never silently drop upstream changes** — If we choose not to incorporate
   an upstream change, we still document that decision in the commit message.

### Escalation

If a conflict is non-trivial (touching core logic, security boundaries, or
API contracts), it goes through the **constitutional gate** before merging.

## The Constitutional Gate

Not all upstream changes should be incorporated automatically. The
constitutional gate is a review process that evaluates upstream changes
against our governance policies before they enter the fork.

### What triggers the gate

- Merge conflicts (automatic — workflow flags these).
- Changes to security-sensitive paths (authentication, authorization,
  cryptography).
- Breaking API changes.
- License or dependency changes.
- Any change a maintainer flags during review.

### Gate process

1. The sync workflow creates a GoldenTrace audit entry for every sync
   attempt.
2. Conflicts or flagged changes are surfaced as workflow warnings.
3. A maintainer reviews the upstream diff against our constitutional
   constraints.
4. The merge is either approved (proceed with kintsugi resolution) or
   deferred (documented as an intentional divergence).

### Constitutional constraints (examples)

- **No telemetry additions** we haven't explicitly approved.
- **No dependency changes** that introduce non-permissive licenses.
- **No removal of local configuration hooks** that our overlay depends on.
- **No changes to auth/access patterns** without security review.

## GoldenTrace Audit

Every sync operation produces a GoldenTrace audit entry containing:

- Timestamp
- Fork and upstream repository identifiers
- Commits behind / ahead counts
- Sync result (merged, conflict, skipped, error)
- Dry run flag

These are stored as GitHub Actions artifacts with 90-day retention and
surfaced in the workflow summary table.

## Troubleshooting

### "Fork is ahead but not behind"

This means we have local changes that upstream doesn't have. This is
normal — it's the constitutional overlay doing its job.

### "SYNC_CONFLICT" warning

Follow the kintsugi protocol above. The workflow has already aborted the
merge cleanly; no damage has been done.

### "Could not detect upstream default branch"

The upstream repository may have changed its default branch name. Update
the `branch` field in the workflow matrix for that fork.

### Manual sync for a single fork

```bash
cd /path/to/fork
git remote add upstream https://github.com/UPSTREAM_ORG/REPO.git
git fetch upstream
git merge upstream/main --no-edit
git push origin main
```
