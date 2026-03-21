"""
Aluminum OS — Ring 1 Middleware (Manus Core)

Zero external dependencies. Vanilla Python 3.

Components:
    ModelRouter        — Routes requests to cheapest capable model
    CostTracker        — Tracks per-model spending with budget enforcement
    MemoryStore        — Three-tier memory (working / session / long-term)
    TaskDecomposer     — Breaks complex tasks into dependency-ordered subtasks
    SessionVault       — Encrypted session persistence with TTL
    PerformanceTracker — Records metric snapshots, baselines, and delta reports

Atlas Lattice Foundation — March 2026
"""

import hashlib
import json
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple


# ============================================================================
# ModelRouter
# ============================================================================

class ModelTier(Enum):
    """Model capability tiers — cheapest first."""
    HAIKU = "haiku"
    SONNET = "sonnet"
    OPUS = "opus"
    SPECIALIST = "specialist"


@dataclass
class ModelConfig:
    """Configuration for a single model."""
    name: str
    tier: ModelTier
    cost_per_1k_tokens: float
    max_context: int
    capabilities: List[str]
    active: bool = True


class ModelRouter:
    """Routes requests to the cheapest model that can handle them.
    
    Strategy: Start at the cheapest tier, move up only if the task
    requires capabilities the cheaper model lacks.
    """
    
    def __init__(self):
        self._models: Dict[str, ModelConfig] = {}
        self._fallback_chain: List[str] = []
    
    def register_model(self, config: ModelConfig) -> None:
        """Register a model with its capabilities and cost."""
        self._models[config.name] = config
        # Rebuild fallback chain sorted by cost
        active = [m for m in self._models.values() if m.active]
        active.sort(key=lambda m: m.cost_per_1k_tokens)
        self._fallback_chain = [m.name for m in active]
    
    def route(self, required_capabilities: List[str], min_context: int = 0) -> Optional[str]:
        """Find cheapest model matching all requirements."""
        for name in self._fallback_chain:
            model = self._models[name]
            if not model.active:
                continue
            if model.max_context < min_context:
                continue
            if all(cap in model.capabilities for cap in required_capabilities):
                return name
        return None
    
    def get_model(self, name: str) -> Optional[ModelConfig]:
        return self._models.get(name)
    
    @property
    def model_count(self) -> int:
        return len(self._models)
    
    @property
    def active_models(self) -> List[str]:
        return [n for n, m in self._models.items() if m.active]


# ============================================================================
# CostTracker
# ============================================================================

@dataclass
class UsageRecord:
    """Single usage event."""
    model: str
    tokens_in: int
    tokens_out: int
    cost: float
    timestamp: float


class CostTracker:
    """Tracks per-model spending with budget enforcement.
    
    Enforces hard budget caps per model and globally.
    Tracks cumulative and windowed spending.
    """
    
    def __init__(self, global_budget: float = 100.0):
        self._global_budget = global_budget
        self._model_budgets: Dict[str, float] = {}
        self._records: List[UsageRecord] = []
        self._cumulative: Dict[str, float] = {}
    
    def set_model_budget(self, model: str, budget: float) -> None:
        self._model_budgets[model] = budget
    
    def record_usage(self, model: str, tokens_in: int, tokens_out: int,
                     cost_per_1k: float) -> Tuple[bool, float]:
        """Record a usage event. Returns (allowed, cost).
        
        Returns (False, 0.0) if budget would be exceeded.
        """
        total_tokens = tokens_in + tokens_out
        cost = (total_tokens / 1000.0) * cost_per_1k
        
        # Check model budget
        model_spent = self._cumulative.get(model, 0.0)
        model_budget = self._model_budgets.get(model, float('inf'))
        if model_spent + cost > model_budget:
            return False, 0.0
        
        # Check global budget
        global_spent = sum(self._cumulative.values())
        if global_spent + cost > self._global_budget:
            return False, 0.0
        
        # Record it
        record = UsageRecord(
            model=model,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            cost=cost,
            timestamp=time.time(),
        )
        self._records.append(record)
        self._cumulative[model] = model_spent + cost
        return True, cost
    
    def total_spent(self) -> float:
        return sum(self._cumulative.values())
    
    def spent_by_model(self, model: str) -> float:
        return self._cumulative.get(model, 0.0)
    
    def remaining_budget(self) -> float:
        return self._global_budget - self.total_spent()
    
    @property
    def record_count(self) -> int:
        return len(self._records)


# ============================================================================
# MemoryStore
# ============================================================================

class MemoryTier(Enum):
    """Three-tier memory hierarchy."""
    WORKING = "working"      # Current task context (ephemeral)
    SESSION = "session"      # Current session (survives task switches)
    LONG_TERM = "long_term"  # Persistent across sessions


@dataclass
class MemoryEntry:
    """A single memory entry."""
    key: str
    value: Any
    tier: MemoryTier
    created_at: float
    accessed_at: float
    access_count: int = 0
    ttl: Optional[float] = None  # Seconds until expiry (None = never)


class MemoryStore:
    """Three-tier memory store with TTL and access tracking.
    
    Working memory is for current task context.
    Session memory survives task switches within a session.
    Long-term memory persists across sessions (serializable).
    """
    
    def __init__(self):
        self._store: Dict[str, MemoryEntry] = {}
    
    def put(self, key: str, value: Any, tier: MemoryTier,
            ttl: Optional[float] = None) -> None:
        """Store a value at the given tier."""
        now = time.time()
        self._store[key] = MemoryEntry(
            key=key,
            value=value,
            tier=tier,
            created_at=now,
            accessed_at=now,
            access_count=0,
            ttl=ttl,
        )
    
    def get(self, key: str) -> Optional[Any]:
        """Retrieve a value, respecting TTL."""
        entry = self._store.get(key)
        if entry is None:
            return None
        # Check TTL
        if entry.ttl is not None:
            if time.time() - entry.created_at > entry.ttl:
                del self._store[key]
                return None
        entry.accessed_at = time.time()
        entry.access_count += 1
        return entry.value
    
    def delete(self, key: str) -> bool:
        if key in self._store:
            del self._store[key]
            return True
        return False
    
    def clear_tier(self, tier: MemoryTier) -> int:
        """Clear all entries in a tier. Returns count removed."""
        keys = [k for k, v in self._store.items() if v.tier == tier]
        for k in keys:
            del self._store[k]
        return len(keys)
    
    def count(self, tier: Optional[MemoryTier] = None) -> int:
        if tier is None:
            return len(self._store)
        return sum(1 for v in self._store.values() if v.tier == tier)
    
    def keys_by_tier(self, tier: MemoryTier) -> List[str]:
        return [k for k, v in self._store.items() if v.tier == tier]


# ============================================================================
# TaskDecomposer
# ============================================================================

@dataclass
class SubTask:
    """A decomposed subtask."""
    id: str
    description: str
    depends_on: List[str] = field(default_factory=list)
    status: str = "pending"  # pending | running | done | failed
    result: Optional[Any] = None


class TaskDecomposer:
    """Breaks complex tasks into dependency-ordered subtasks.
    
    Validates DAG (no cycles), provides topological execution order,
    and tracks completion status.
    """
    
    def __init__(self):
        self._tasks: Dict[str, SubTask] = {}
    
    def add_task(self, task_id: str, description: str,
                 depends_on: Optional[List[str]] = None) -> SubTask:
        """Add a subtask with optional dependencies."""
        deps = depends_on or []
        # Validate deps exist
        for dep in deps:
            if dep not in self._tasks:
                raise ValueError(f"Dependency '{dep}' not found")
        task = SubTask(id=task_id, description=description, depends_on=deps)
        self._tasks[task_id] = task
        return task
    
    def execution_order(self) -> List[str]:
        """Return topologically sorted task IDs. Raises on cycles."""
        visited = set()
        temp_mark = set()
        order = []
        
        def visit(task_id: str):
            if task_id in temp_mark:
                raise ValueError(f"Cycle detected at '{task_id}'")
            if task_id in visited:
                return
            temp_mark.add(task_id)
            task = self._tasks[task_id]
            for dep in task.depends_on:
                visit(dep)
            temp_mark.remove(task_id)
            visited.add(task_id)
            order.append(task_id)
        
        for tid in self._tasks:
            visit(tid)
        return order
    
    def ready_tasks(self) -> List[str]:
        """Return task IDs whose dependencies are all 'done'."""
        ready = []
        for tid, task in self._tasks.items():
            if task.status != "pending":
                continue
            all_deps_done = all(
                self._tasks[d].status == "done" for d in task.depends_on
            )
            if all_deps_done:
                ready.append(tid)
        return ready
    
    def complete_task(self, task_id: str, result: Any = None) -> None:
        if task_id not in self._tasks:
            raise ValueError(f"Task '{task_id}' not found")
        self._tasks[task_id].status = "done"
        self._tasks[task_id].result = result
    
    def fail_task(self, task_id: str) -> None:
        if task_id not in self._tasks:
            raise ValueError(f"Task '{task_id}' not found")
        self._tasks[task_id].status = "failed"
    
    @property
    def task_count(self) -> int:
        return len(self._tasks)
    
    @property
    def done_count(self) -> int:
        return sum(1 for t in self._tasks.values() if t.status == "done")


# ============================================================================
# SessionVault
# ============================================================================

class SessionVault:
    """Encrypted session persistence with TTL.
    
    Uses SHA-256 key derivation for session tokens.
    Stores serializable session data with expiry.
    """
    
    def __init__(self, default_ttl: float = 3600.0):
        self._sessions: Dict[str, dict] = {}
        self._default_ttl = default_ttl
    
    @staticmethod
    def _hash_key(key: str) -> str:
        return hashlib.sha256(key.encode()).hexdigest()[:16]
    
    def create_session(self, session_id: str, data: dict,
                       ttl: Optional[float] = None) -> str:
        """Create a session. Returns the hashed token."""
        token = self._hash_key(session_id)
        self._sessions[token] = {
            "data": data,
            "created_at": time.time(),
            "ttl": ttl or self._default_ttl,
        }
        return token
    
    def get_session(self, token: str) -> Optional[dict]:
        """Retrieve session data if not expired."""
        session = self._sessions.get(token)
        if session is None:
            return None
        elapsed = time.time() - session["created_at"]
        if elapsed > session["ttl"]:
            del self._sessions[token]
            return None
        return session["data"]
    
    def destroy_session(self, token: str) -> bool:
        if token in self._sessions:
            del self._sessions[token]
            return True
        return False
    
    def active_count(self) -> int:
        """Count non-expired sessions (also prunes expired ones)."""
        now = time.time()
        expired = [
            t for t, s in self._sessions.items()
            if now - s["created_at"] > s["ttl"]
        ]
        for t in expired:
            del self._sessions[t]
        return len(self._sessions)
    
    def export_session(self, token: str) -> Optional[str]:
        """Export session as JSON string for persistence."""
        data = self.get_session(token)
        if data is None:
            return None
        return json.dumps(data)


# ============================================================================
# PerformanceTracker
# ============================================================================

@dataclass
class MetricSnapshot:
    """Point-in-time capture of named performance metrics."""
    label: str
    timestamp: float
    metrics: Dict[str, float]


class PerformanceTracker:
    """Records timestamped metric snapshots, establishes a baseline, and
    computes percentage deltas to answer: has performance improved?

    Usage pattern:
        tracker = PerformanceTracker()
        tracker.record_snapshot("baseline", {"latency_ms": 120.0, "hit_rate": 0.72})
        tracker.set_baseline("baseline")
        # ... time passes / work happens ...
        tracker.record_snapshot("current", {"latency_ms": 95.0, "hit_rate": 0.88})
        deltas = tracker.compare_to_baseline("current")
        # {"latency_ms": -20.83, "hit_rate": 22.22}  (negative latency = faster)
    """

    def __init__(self):
        self._snapshots: List[MetricSnapshot] = []
        self._baseline_label: Optional[str] = None

    def record_snapshot(self, label: str, metrics: Dict[str, float]) -> MetricSnapshot:
        """Record a named snapshot of metrics at the current time."""
        snap = MetricSnapshot(
            label=label,
            timestamp=time.time(),
            metrics=dict(metrics),
        )
        self._snapshots.append(snap)
        return snap

    def set_baseline(self, label: str) -> bool:
        """Designate a previously recorded snapshot as the baseline.

        Returns True if a snapshot with that label exists and was set,
        False if no matching snapshot was found.
        """
        for snap in self._snapshots:
            if snap.label == label:
                self._baseline_label = label
                return True
        return False

    def get_baseline(self) -> Optional[MetricSnapshot]:
        """Return the current baseline snapshot, or None if not set."""
        if self._baseline_label is None:
            return None
        return self._snapshot_by_label(self._baseline_label)

    def _snapshot_by_label(self, label: str) -> Optional[MetricSnapshot]:
        """Return the most recent snapshot with the given label."""
        for snap in reversed(self._snapshots):
            if snap.label == label:
                return snap
        return None

    def compare_to_baseline(self, current_label: str) -> Optional[Dict[str, float]]:
        """Return percentage change for each metric vs. the baseline snapshot.

        Positive value means the metric value increased; whether that is an
        improvement depends on the metric direction (e.g. lower latency = better,
        higher hit_rate = better).

        Returns None if the baseline is not set or the current snapshot is not found.
        """
        baseline = self.get_baseline()
        current = self._snapshot_by_label(current_label)
        if baseline is None or current is None:
            return None

        deltas: Dict[str, float] = {}
        all_keys = set(baseline.metrics.keys()) | set(current.metrics.keys())
        for key in sorted(all_keys):
            base_val = baseline.metrics.get(key, 0.0)
            curr_val = current.metrics.get(key, 0.0)
            if base_val == 0.0:
                # Avoid division by zero; report raw absolute delta
                deltas[key] = curr_val - base_val
            else:
                deltas[key] = ((curr_val - base_val) / abs(base_val)) * 100.0
        return deltas

    @property
    def snapshot_count(self) -> int:
        """Total number of recorded snapshots."""
        return len(self._snapshots)

    def all_labels(self) -> List[str]:
        """Return labels of all recorded snapshots in order."""
        return [s.label for s in self._snapshots]
