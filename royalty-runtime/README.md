# Royalty Runtime

**Execution is compensation.**

If it runs, it pays. This runtime ensures that every execution of code distributes value back to its creators automatically.

## Architecture

```
royalty-runtime/
├── runtime-core/           # Rust: The un-bypassable engine
├── royalty-sdk/             # TypeScript: The developer adoption layer
├── collector/               # Rust: Event ingestion and ledger
└── docs/                    # White papers and documentation
```

## Philosophy

Enforcement systems get forked. Measurement systems get embedded.
We don't build the tollbooth. We own the map.

## Developer Loop

```bash
royalty trace          # What exists locally?
royalty hash           # What does it mean canonically?
royalty emit           # Tell the referee
royalty weight         # How is value distributed?
royalty verify         # Make sure the ref saw the same play
royalty lease          # Acquire execution capabilities
```

## Integration with Aluminum OS

Royalty Runtime integrates with uws (Universal Workspace CLI) as the observability and attribution layer.