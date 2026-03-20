# Plugin Integration Bridge v1.0

> **Aluminum OS Layer**: L5-Extension → L1-Constitutional  
> **Sphere Tags**: H7.S3 (Systems Architecture), H7.S9 (Automation)  
> **Invariants**: INV-1, INV-7, INV-33, INV-35  
> **Status**: Architecture Specification  

## Overview

The Plugin Integration Bridge connects the 10 forked Claude plugin ecosystems into Aluminum OS through a constitutional loading pipeline. Every plugin — whether from the official Anthropic directory, community curations, or the CCPI marketplace — passes through the same invariant enforcement, GoldenTrace auditing, and council validation before activation.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    uws plugin <command>                          │
│                    (L5 CLI Surface)                              │
├──────────────────────────────────────────────────────────────────┤
│                Plugin Resolution Engine                          │
│  ┌────────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────────┐  │
│  │  Official   │ │  CCPI    │ │ Awesome │ │ CC-Marketplace   │  │
│  │  (13.5K★)  │ │(340+1367)│ │ (29K★)  │ │ (Community)      │  │
│  └─────┬──────┘ └────┬─────┘ └────┬────┘ └───────┬──────────┘  │
│        └──────────────┼───────────┼───────────────┘             │
│                       ▼           ▼                              │
│              ┌────────────────────────┐                          │
│              │  Constitutional Gate   │  ← INV-1, INV-7, INV-33│
│              │  (L1 Enforcement)      │                          │
│              └───────────┬────────────┘                          │
│                          ▼                                       │
│              ┌────────────────────────┐                          │
│              │  GoldenTrace Emitter   │  ← Kintsugi audit      │
│              │  (L1 Audit)            │                          │
│              └───────────┬────────────┘                          │
│                          ▼                                       │
│              ┌────────────────────────┐                          │
│              │  Plugin Loader         │  ← L2 Kernel            │
│              │  (Sandbox + Mount)     │                          │
│              └───────────┬────────────┘                          │
│                          ▼                                       │
│              ┌────────────────────────┐                          │
│              │  Active Plugin Runtime │  ← L3/L4/L5             │
│              └────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────┘
```

## Constitutional Gate

Every plugin installation triggers a Constitutional Gate check:

1. **INV-1 (User Sovereignty)**: User must explicitly consent to plugin installation
2. **INV-7 (47% Cap)**: No single plugin source can provide > 47% of active plugins
3. **INV-33 (Routing Sovereignty)**: User controls which plugin sources are active
4. **INV-35 (Hard Fail-Closed)**: If constitutional check fails, plugin is rejected (no fallback)

```typescript
interface ConstitutionalGate {
  checkInvariants(plugin: PluginManifest): InvariantResult[];
  enforceSourceCap(source: string, totalActive: number): boolean;
  requireConsent(plugin: PluginManifest): ConsentToken;
  emitTrace(event: GoldenTraceEvent): void;
}
```

## Plugin Source Priority

Sources are resolved in this order (configurable via `uws plugin config`):

| Priority | Source | Fork | Content |
|----------|--------|------|---------|
| 1 | Official | splitmerge420/claude-plugins-official | Anthropic-vetted plugins |
| 2 | CCPI | splitmerge420/claude-code-plugins-plus-skills | 340 plugins + 1367 skills |
| 3 | Awesome | splitmerge420/awesome-claude-code | 29K★ curated index |
| 4 | Composio | splitmerge420/awesome-claude-plugins | Enterprise curation |
| 5 | CCPlugins | splitmerge420/awesome-claude-code-plugins | Subagent focus |
| 6 | CC-Market | splitmerge420/cc-marketplace | Community marketplace |

## MCP Integration

Two forked repos provide the MCP backbone:

- **splitmerge420/servers** (81K★) — All official + community MCP servers
- **splitmerge420/claude-code-mcp** — MCP ↔ Claude Code CLI bridge

Custom constitutional MCP servers to build on top:

| Server | Purpose | Layer |
|--------|---------|-------|
| `golden-trace-mcp` | GoldenTrace audit events via MCP | L1 |
| `consent-kernel-mcp` | ConsentKernel verification via MCP | L1 |
| `council-mcp` | Pantheon Council routing via MCP | L3 |
| `sheldonbrain-mcp` | Sheldonbrain RAG via MCP | L3 |
| `144-sphere-mcp` | Sphere ontology tagging via MCP | L3 |

## uws CLI Commands

```bash
# Discovery
uws plugin list                          # List installed plugins
uws plugin list --source official        # List from specific source
uws plugin search "memory" --index all   # Search across all indexes
uws plugin stats                         # Adoption metrics from quemsah tracker

# Installation (constitutional gate enforced)
uws plugin install <name>                # Install from highest-priority source
uws plugin install <name> --source ccpi  # Install from specific source
uws plugin audit <name>                  # Pre-install constitutional audit

# MCP
uws mcp list                             # List available MCP servers
uws mcp add <server>                     # Add MCP server from fork
uws mcp bridge claude-code               # Activate CLI ↔ MCP bridge

# Maintenance
uws plugin update --all                  # Update all plugins
uws plugin remove <name>                 # Remove plugin (GoldenTrace recorded)
uws plugin config sources                # Configure source priority
```

## Janus v2 Integration

Agent skills from the CCPI collection (1,367 skills) integrate with the Janus v2 multi-agent protocol:

- Skills tagged with council roles route to appropriate Pantheon members
- INV-7 enforced across skill invocations (no single AI handles > 47%)
- GoldenTrace emitted for every skill invocation
- Failed skill invocations become kintsugi golden seams

## Sync Strategy

All forks maintain upstream tracking:

```bash
# Automated via GitHub Actions (to configure)
# Runs daily at 00:00 UTC
git fetch upstream
git merge upstream/main --no-edit
# Constitutional diff check before auto-merge
uws plugin audit --diff upstream/main
```

## Files in This Directory

| File | Purpose |
|------|---------|
| `PLUGIN_REGISTRY.yaml` | Master registry of all forked plugin sources |
| `INTEGRATION_BRIDGE.md` | This document — architecture spec |
| `loader/` | Plugin loader implementation (TODO) |
| `gate/` | Constitutional gate implementation (TODO) |

## Related Documents

- `/kintsugi/spec/golden_trace_v1.json` — GoldenTrace schema
- `/kintsugi/sdk/golden_trace.py` — Python audit SDK
- `/protocols/CONSTITUTIONAL_ROUTER_V0.1.md` — Routing with INV-33-36
- `/docs/integration/SHELDONBRAIN_INTEGRATION.md` — RAG integration
