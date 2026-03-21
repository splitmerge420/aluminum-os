# Aluminum OS — Capability Matrix

## Current State (v0.3.0 — March 13, 2026)

### Ring 0 (Rust Kernel)

| Capability | Status | Tests | Notes |
|-----------|--------|-------|-------|
| Memory allocation (BuddyAllocator) | ✅ Working | 3 | Power-of-two splitting, alloc/free |
| Agent registration | ✅ Working | 2 | Trust levels, compliance tracking |
| Constitutional rules | ✅ Working | 2 | 14 defaults, severity + Dave veto |
| Constitutional domains | ✅ Working | 6 | 15 domains from 40 repo extractions |
| Intent scheduling | ✅ Working | 2 | Priority queue + constitutional screening |
| Boot simulator | ✅ Working | — | Full Pantheon Council boot demo |
| Fixed-size strings | ✅ Working | 1 | No-heap string handling |
| `no_std` compatibility | ✅ Compiles | — | Feature-gated std/no_std |

### Ring 1 (Python Middleware)

| Capability | Status | Tests | Notes |
|-----------|--------|-------|-------|
| Model routing | ✅ Working | 5 | Cost-optimized, capability-matched |
| Cost tracking | ✅ Working | 4 | Per-model + global budget enforcement |
| Memory store | ✅ Working | 5 | Three-tier with TTL |
| Task decomposition | ✅ Working | 4 | DAG ordering, cycle detection |
| Session vault | ✅ Working | 4 | SHA-256 tokens, TTL, JSON export |
| Performance tracking | ✅ Working | 6 | Timestamped snapshots, baseline, % delta |

### Ring 2 (UWS CLI)

| Capability | Status | Notes |
|-----------|--------|-------|
| 14 miracle commands | ✅ Runs | council, vault, claude, sync, etc. |
| Shared types with Ring 0 | 🔲 Planned | Currently separate type definitions |
| MCP server | 🔲 Planned | Model Context Protocol integration |

## What's NOT Built Yet

| Capability | Priority | Blocked By |
|-----------|----------|------------|
| Rust ↔ Python IPC | High | FFI bridge or gRPC definition |
| Network transport | High | Protocol decision (gRPC vs HTTP vs MCP) |
| Persistent storage (Ring 0) | Medium | Filesystem abstraction for no_std |
| Real model API calls | Medium | API keys + provider integration |
| Auth/authz beyond trust levels | Medium | Identity provider choice |
| SHELDONBRAIN search indexing | Low | Meilisearch integration from repo shred |
| Dashboard UI | Low | Framework choice |

## Test Summary

| Layer | Language | Tests | Status |
|-------|----------|-------|--------|
| Ring 0 | Rust | 16 | ✅ All passing |
| Ring 1 | Python | 28 | ✅ All passing |
| **Total** | | **44** | **All green** |
