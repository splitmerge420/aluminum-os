"""
Aluminum OS — `uws` CLI (Universal Workspace Shell)
Ring 1 Python implementation — zero external dependencies.

Commands (callable as library functions or via the `uws` entry-point):
  swarm_review(items, batch_size) — NPFM Gate: batch constitutional review
  lint(paths)                     — Constitutional code linter
  audit_summary(emitter, last_n)  — Kintsugi trace summary
  status()                        — Ring 0 / Ring 1 / Kintsugi health

Each function that emits audit events accepts an optional
``GoldenTraceEmitter`` so callers control the trace destination.

Atlas Lattice Foundation — March 2026
"""

import json
import re
import uuid as _uuid
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from .manus_core import CostTracker, ModelConfig, ModelRouter, ModelTier
from kintsugi.sdk.golden_trace import GoldenTraceEmitter


# ─── Shared helpers ──────────────────────────────────────────────────────────

def _default_router() -> ModelRouter:
    """Return a ModelRouter pre-loaded with standard Aluminum OS model tiers."""
    router = ModelRouter()
    router.register_model(ModelConfig(
        name="haiku",
        tier=ModelTier.HAIKU,
        cost_per_1k_tokens=0.25,
        max_context=200_000,
        capabilities=["text", "classification", "analysis"],
    ))
    router.register_model(ModelConfig(
        name="sonnet",
        tier=ModelTier.SONNET,
        cost_per_1k_tokens=3.0,
        max_context=200_000,
        capabilities=["text", "classification", "analysis", "code", "reasoning"],
    ))
    router.register_model(ModelConfig(
        name="opus",
        tier=ModelTier.OPUS,
        cost_per_1k_tokens=15.0,
        max_context=200_000,
        capabilities=["text", "classification", "analysis", "code", "reasoning", "planning"],
    ))
    return router


# ─── Swarm Review (NPFM Gate) ────────────────────────────────────────────────

# Patterns that indicate a constitutionally concerning item description.
_CONCERN_RE: List[re.Pattern] = [
    re.compile(r"(?i)\b(malware|exploit|backdoor|bypass|circumvent)\b"),
    re.compile(r"(?i)\b(delete\s+all|drop\s+table|rm\s+-rf)\b"),
    re.compile(r"(?i)\b(password|secret|token)\s*[:=]\s*\S{4,}"),
]


@dataclass
class SwarmReviewItem:
    """A single item entering the NPFM batch review gate."""
    id: str
    description: str
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SwarmReviewResult:
    """Result of a batch NPFM Gate review."""
    batch_id: str
    items_submitted: int
    items_reviewed: int
    items_approved: int
    items_flagged: int
    npfm_score: float          # Net-Positive Flourishing Metric: 0.0–1.0
    model_used: str
    cost_estimate_usd: float
    flagged_ids: List[str] = field(default_factory=list)
    trace_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "batch_id": self.batch_id,
            "items_submitted": self.items_submitted,
            "items_reviewed": self.items_reviewed,
            "items_approved": self.items_approved,
            "items_flagged": self.items_flagged,
            "npfm_score": round(self.npfm_score, 3),
            "model_used": self.model_used,
            "cost_estimate_usd": round(self.cost_estimate_usd, 6),
            "trace_id": self.trace_id,
            "flagged_ids": self.flagged_ids,
            "verdict": "APPROVED" if self.npfm_score >= 0.7 else "REVIEW_REQUIRED",
        }


def _item_passes_review(item: SwarmReviewItem) -> bool:
    """Return True when the item description contains no constitutional concerns."""
    text = f"{item.id} {item.description} {json.dumps(item.metadata)}"
    return not any(p.search(text) for p in _CONCERN_RE)


def swarm_review(
    items: List[SwarmReviewItem],
    batch_size: int = 50,
    router: Optional[ModelRouter] = None,
    tracker: Optional[CostTracker] = None,
    emitter: Optional[GoldenTraceEmitter] = None,
) -> SwarmReviewResult:
    """NPFM Gate: batch-review items against constitutional rules.

    Equivalent to ``uws swarm review --batch=N``.  Routes through
    ModelRouter, optionally tracks cost, and emits a single signed
    Kintsugi trace for the entire batch — one human decision merges all
    approved items.

    Args:
        items:      Items to review (may exceed batch_size; extras are queued).
        batch_size: Maximum items processed in this run (default 50).
        router:     ModelRouter instance; a default one is created if omitted.
        tracker:    CostTracker instance for budget accounting (optional).
        emitter:    GoldenTraceEmitter for audit trace (optional).

    Returns:
        SwarmReviewResult with NPFM score, cost estimate, and trace_id.
    """
    batch_id = str(_uuid.uuid4())[:8]
    batch = items[:batch_size]

    if router is None:
        router = _default_router()

    # Select cheapest model capable of "analysis"
    model_name = router.route(["analysis"]) or "haiku"

    flagged_ids: List[str] = []
    for item in batch:
        if not _item_passes_review(item):
            flagged_ids.append(item.id)

    items_reviewed = len(batch)
    items_flagged = len(flagged_ids)
    items_approved = items_reviewed - items_flagged

    # Cost estimate: ~50 tokens per item (description + metadata header)
    tokens_per_item = 50
    total_tokens = items_reviewed * tokens_per_item
    model_cfg = router.get_model(model_name)
    cost_per_1k = model_cfg.cost_per_1k_tokens if model_cfg else 0.25
    cost_estimate = (total_tokens / 1000.0) * cost_per_1k

    if tracker is not None:
        tracker.record_usage(model_name, total_tokens, 0, cost_per_1k)

    npfm_score = items_approved / items_reviewed if items_reviewed > 0 else 1.0

    result = SwarmReviewResult(
        batch_id=batch_id,
        items_submitted=len(items),
        items_reviewed=items_reviewed,
        items_approved=items_approved,
        items_flagged=items_flagged,
        npfm_score=npfm_score,
        model_used=model_name,
        cost_estimate_usd=cost_estimate,
        flagged_ids=flagged_ids,
    )

    if emitter is not None:
        severity = (
            "info" if items_flagged == 0
            else ("warning" if npfm_score >= 0.5 else "error")
        )
        trace = emitter.emit(
            event_type="swarm_review",
            sphere_tag="H2.S3",
            aluminum_layer="L1-Constitutional",
            function="swarm_review",
            severity=severity,
            payload={
                "batch_id": batch_id,
                "items_reviewed": items_reviewed,
                "items_approved": items_approved,
                "items_flagged": items_flagged,
                "npfm_score": npfm_score,
                "model_used": model_name,
                "cost_estimate_usd": cost_estimate,
            },
            invariants_checked=["NPFM-001", "NPFM-002", "NPFM-003"],
        )
        result.trace_id = trace["trace_id"]

    return result


# ─── Constitutional Linter ────────────────────────────────────────────────────

class LintSeverity(Enum):
    INFO = "info"
    WARNING = "warning"
    VIOLATION = "violation"


@dataclass
class LintFinding:
    rule_id: str
    severity: LintSeverity
    message: str
    file: str = ""
    line: int = 0


@dataclass
class LintResult:
    files_scanned: int
    findings: List[LintFinding]
    violations: int
    warnings: int
    info_count: int
    constitutional_score: float   # 1.0 = clean; approaches 0.0 with violations
    trace_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "files_scanned": self.files_scanned,
            "violations": self.violations,
            "warnings": self.warnings,
            "info": self.info_count,
            "constitutional_score": round(self.constitutional_score, 3),
            "trace_id": self.trace_id,
            "findings": [
                {
                    "rule_id": f.rule_id,
                    "severity": f.severity.value,
                    "message": f.message,
                    "file": f.file,
                    "line": f.line,
                }
                for f in self.findings
            ],
        }


# Patterns that indicate secrets or credentials.
# NOTE: These are lightweight heuristics designed to catch common mistakes.
# They are not a substitute for a dedicated secret-scanning tool such as
# truffleHog or gitleaks for production security audits.
_SECRET_RULES: List[Tuple[re.Pattern, str]] = [
    (
        re.compile(r'(?i)(api_key|apikey|secret|password|passwd|token)\s*=\s*["\'][^"\']{8,}["\']'),
        "CONST-001",
    ),
    (
        re.compile(r'(?i)(sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z\-_]{35})'),
        "CONST-002",
    ),
]

# Patterns indicating extractive anti-patterns
_EXTRACTIVE_RULES: List[Tuple[re.Pattern, str, str]] = [
    (
        re.compile(r"\bexcept\s*:\s*pass\b"),
        "CONST-003",
        "Bare 'except: pass' silently swallows errors — extractive anti-pattern",
    ),
    (
        re.compile(r"\bsys\.exit\s*\("),
        "CONST-004",
        "sys.exit called without audit trace — constitutionally unaccounted exit",
    ),
]


_LINT_IGNORE_RE = re.compile(
    r"#\s*lint:\s*ignore(?:\s+([A-Z0-9,\s-]+))?",
    re.IGNORECASE,
)
"""Inline suppression comment recognised by the constitutional linter.

Usage examples::

    some_code()  # lint: ignore              — suppress ALL rules on this line
    some_code()  # lint: ignore CONST-001    — suppress a single rule
    some_code()  # lint: ignore CONST-001,CONST-002  — suppress several rules
"""


def _suppressed_rules(line: str) -> Optional[set]:
    """Return the set of rule IDs suppressed on *line*, or None if no comment.

    Collects ALL ``# lint: ignore`` annotations on the line (there may be more
    than one when a string literal contains an annotation followed by a real
    trailing annotation).  Returns an empty set when any annotation suppresses
    all rules; otherwise returns the union of all named rule IDs.
    Returns None when no annotation is present.
    """
    matches = list(_LINT_IGNORE_RE.finditer(line))
    if not matches:
        return None
    result: set = set()
    for m in matches:
        raw = m.group(1)
        if not raw or not raw.strip():
            return set()  # empty set → suppress everything
        result.update(r.strip().upper() for r in raw.split(",") if r.strip())
    return result


def _lint_file(path: Path) -> List[LintFinding]:
    """Return LintFindings for a single Python file."""
    findings: List[LintFinding] = []
    try:
        src = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return findings

    lines = src.splitlines()

    # CONST-001 / CONST-002 — credential patterns
    for pattern, rule_id in _SECRET_RULES:
        for i, line in enumerate(lines, 1):
            if not pattern.search(line):
                continue
            suppressed = _suppressed_rules(line)
            if suppressed is not None and (not suppressed or rule_id in suppressed):
                continue  # inline suppression
            findings.append(LintFinding(
                rule_id=rule_id,
                severity=LintSeverity.VIOLATION,
                message="Potential credential or secret detected",
                file=str(path),
                line=i,
            ))

    # CONST-003 / CONST-004 — extractive patterns
    for pattern, rule_id, message in _EXTRACTIVE_RULES:
        for i, line in enumerate(lines, 1):
            if not pattern.search(line):
                continue
            suppressed = _suppressed_rules(line)
            if suppressed is not None and (not suppressed or rule_id in suppressed):
                continue  # inline suppression
            findings.append(LintFinding(
                rule_id=rule_id,
                severity=LintSeverity.WARNING,
                message=message,
                file=str(path),
                line=i,
            ))

    # CONST-005 — missing module docstring
    stripped = src.lstrip()
    if path.suffix == ".py" and not (stripped.startswith('"""') or stripped.startswith("'''")):
        findings.append(LintFinding(
            rule_id="CONST-005",
            severity=LintSeverity.INFO,
            message="Module missing docstring — constitutional accountability requires attribution",
            file=str(path),
            line=1,
        ))

    return findings


def lint(
    paths: List[str],
    emitter: Optional[GoldenTraceEmitter] = None,
) -> LintResult:
    """Run the constitutional linter over the given file or directory paths.

    Equivalent to ``uws lint [<path>...]``.

    Checks for:
      CONST-001 / CONST-002 — hardcoded credentials (violation)
      CONST-003 / CONST-004 — extractive anti-patterns (warning)
      CONST-005             — missing module docstring (info)

    Args:
        paths:   List of file or directory paths to scan (.py files only).
        emitter: GoldenTraceEmitter for audit trace (optional).

    Returns:
        LintResult with per-file findings and an aggregate constitutional score.
    """
    all_findings: List[LintFinding] = []
    files_scanned = 0

    for raw_path in paths:
        p = Path(raw_path)
        if p.is_dir():
            for py_file in sorted(p.rglob("*.py")):
                all_findings.extend(_lint_file(py_file))
                files_scanned += 1
        elif p.is_file():
            all_findings.extend(_lint_file(p))
            files_scanned += 1

    violations = sum(1 for f in all_findings if f.severity == LintSeverity.VIOLATION)
    warnings = sum(1 for f in all_findings if f.severity == LintSeverity.WARNING)
    info_count = sum(1 for f in all_findings if f.severity == LintSeverity.INFO)

    if files_scanned == 0:
        score = 1.0
    else:
        deductions = (violations * 0.2) + (warnings * 0.05)
        score = max(0.0, min(1.0, 1.0 - (deductions / max(files_scanned, 1))))

    result = LintResult(
        files_scanned=files_scanned,
        findings=all_findings,
        violations=violations,
        warnings=warnings,
        info_count=info_count,
        constitutional_score=score,
    )

    if emitter is not None:
        severity = "info" if violations == 0 else "warning"
        trace = emitter.emit(
            event_type="constitutional_lint",
            sphere_tag="H1.S1",
            aluminum_layer="L1-Constitutional",
            function="lint",
            severity=severity,
            payload={
                "files_scanned": files_scanned,
                "violations": violations,
                "warnings": warnings,
                "constitutional_score": result.constitutional_score,
            },
            invariants_checked=[
                "CONST-001", "CONST-002", "CONST-003", "CONST-004", "CONST-005",
            ],
        )
        result.trace_id = trace["trace_id"]

    return result


# ─── Audit Summary ────────────────────────────────────────────────────────────

@dataclass
class AuditSummary:
    """Summary of recent Kintsugi trace entries."""
    total_traces: int
    chain_valid: bool
    event_type_counts: Dict[str, int]
    severity_counts: Dict[str, int]
    last_trace_id: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "total_traces": self.total_traces,
            "chain_valid": self.chain_valid,
            "event_type_counts": self.event_type_counts,
            "severity_counts": self.severity_counts,
            "last_trace_id": self.last_trace_id,
        }


def audit_summary(
    emitter: GoldenTraceEmitter,
    last_n: int = 20,
) -> AuditSummary:
    """Return a summary of the most recent Kintsugi trace entries.

    Equivalent to ``uws audit [--last=N]``.

    Args:
        emitter: GoldenTraceEmitter whose log to summarize.
        last_n:  Window size (most recent entries to include).

    Returns:
        AuditSummary with chain validity, event-type counts, and severity
        distribution.
    """
    log: List[Dict[str, Any]] = json.loads(emitter.export_log())
    recent = log[-last_n:] if len(log) > last_n else log

    event_counts: Dict[str, int] = {}
    severity_counts: Dict[str, int] = {}
    for entry in recent:
        et = entry.get("event_type", "unknown")
        sv = entry.get("severity", "unknown")
        event_counts[et] = event_counts.get(et, 0) + 1
        severity_counts[sv] = severity_counts.get(sv, 0) + 1

    last_trace_id = recent[-1]["trace_id"] if recent else ""
    chain_valid = emitter.verify_chain()

    return AuditSummary(
        total_traces=len(log),
        chain_valid=chain_valid,
        event_type_counts=event_counts,
        severity_counts=severity_counts,
        last_trace_id=last_trace_id,
    )


# ─── System Status ────────────────────────────────────────────────────────────

@dataclass
class SystemStatus:
    """Per-ring operational status for Aluminum OS."""
    ring0: str    # "no_bridge" until Rust↔Python IPC is wired
    ring1: str    # "operational" | "degraded" | "offline"
    kintsugi: str # "operational" | "degraded" | "offline"
    version: str

    def to_dict(self) -> Dict[str, Any]:
        overall = (
            "operational"
            if self.ring1 == "operational" and self.kintsugi == "operational"
            else "degraded"
        )
        return {
            "ring0": self.ring0,
            "ring1": self.ring1,
            "kintsugi": self.kintsugi,
            "version": self.version,
            "overall": overall,
        }


def status() -> SystemStatus:
    """Return per-ring operational status.

    Equivalent to ``uws status``.

    Ring 0 is reported as ``"no_bridge"`` until the Rust↔Python IPC layer
    is implemented; Ring 1 and Kintsugi are probed by instantiating core
    objects.

    Returns:
        SystemStatus with per-ring health strings and overall verdict.
    """
    ring1 = "offline"
    try:
        from .manus_core import MemoryStore
        _ = ModelRouter()
        _ = CostTracker(global_budget=1.0)
        _ = MemoryStore()
        ring1 = "operational"
    except Exception:
        ring1 = "degraded"

    kintsugi = "offline"
    try:
        probe = GoldenTraceEmitter(repo="aluminum-os", module="uws/status-probe")
        probe.emit(
            event_type="action",
            sphere_tag="H0.S0",
            aluminum_layer="L3-Engine",
            payload={"probe": True},
        )
        kintsugi = "operational"
    except Exception:
        kintsugi = "degraded"

    return SystemStatus(
        ring0="no_bridge",
        ring1=ring1,
        kintsugi=kintsugi,
        version="2.0.0",
    )
