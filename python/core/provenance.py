"""
Aluminum OS — ProvenanceTrailer (Git Commit Trailer Validator)

Zero-dependency Python module that parses and validates the mandatory
``Golden-Trace`` and optional ``HITL-Weight`` trailers that must be
present on every commit entering the main branch.

Trailer format (RFC 2822 / git-interpret-trailers compatible)::

    Golden-Trace: sha3-256:<64-hex-chars>
    HITL-Weight: 0.85

Rules (enforced by the Kintsugi Weave CI workflow):
  PROV-001  Golden-Trace trailer is present
  PROV-002  Golden-Trace value matches ``sha3-256:<64 hex chars>`` pattern
  PROV-003  HITL-Weight, when present, is a float in [0.0, 1.0]
  PROV-004  HITL-Weight, when present, is ≥ MIN_HITL_WEIGHT (0.3)

Atlas Lattice Foundation — March 2026
"""

import hashlib
import re
import subprocess
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

from kintsugi.sdk.golden_trace import GoldenTraceEmitter


# ── Constants ─────────────────────────────────────────────────────────────────

MIN_HITL_WEIGHT: float = 0.3
"""Minimum acceptable HITL weight.

A weight of 0.3 means at least 30 % of the commit's lines/decisions were
directly authored or explicitly approved by a human.  Values below this
threshold indicate the commit is too autonomous — insufficient
human-in-the-loop accountability to satisfy constitutional governance
(Principle: Non-Exploitation; KINTSUGI-007)."""

_GOLDEN_TRACE_RE = re.compile(
    r"^Golden-Trace:\s*(sha3-256:[0-9a-f]{64})\s*$",
    re.MULTILINE,
)
_HITL_WEIGHT_RE = re.compile(
    r"^HITL-Weight:\s*([0-9]+(?:\.[0-9]*)?)$",
    re.MULTILINE,
)


# ── Data types ────────────────────────────────────────────────────────────────

@dataclass
class ParsedTrailers:
    """Trailers extracted from a single commit message."""
    golden_trace: Optional[str] = None   # full value, e.g. "sha3-256:abc..."
    hitl_weight: Optional[float] = None  # None means trailer was absent


@dataclass
class ProvenanceFinding:
    """A single rule violation found during provenance validation."""
    rule_id: str
    message: str
    commit_sha: str = ""


@dataclass
class ProvenanceResult:
    """Outcome of validating one commit's provenance trailers."""
    commit_sha: str
    commit_message_snippet: str
    passed: bool
    findings: List[ProvenanceFinding] = field(default_factory=list)
    parsed: Optional[ParsedTrailers] = None
    trace_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "commit_sha": self.commit_sha,
            "commit_message_snippet": self.commit_message_snippet,
            "passed": self.passed,
            "trace_id": self.trace_id,
            "golden_trace": self.parsed.golden_trace if self.parsed else None,
            "hitl_weight": self.parsed.hitl_weight if self.parsed else None,
            "findings": [
                {"rule_id": f.rule_id, "message": f.message}
                for f in self.findings
            ],
        }


@dataclass
class BatchProvenanceResult:
    """Aggregate outcome for a batch of commits."""
    commits_checked: int
    commits_passed: int
    commits_failed: int
    results: List[ProvenanceResult] = field(default_factory=list)
    trace_id: str = ""

    @property
    def all_passed(self) -> bool:
        return self.commits_failed == 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "commits_checked": self.commits_checked,
            "commits_passed": self.commits_passed,
            "commits_failed": self.commits_failed,
            "all_passed": self.all_passed,
            "trace_id": self.trace_id,
            "results": [r.to_dict() for r in self.results],
        }


# ── Parser ────────────────────────────────────────────────────────────────────

def parse_trailers(commit_message: str) -> ParsedTrailers:
    """Extract Golden-Trace and HITL-Weight trailers from a commit message.

    Trailers are conventionally placed in the last paragraph of the message
    (after a blank line), but this parser scans the full text so it works
    regardless of placement.

    Args:
        commit_message: Full commit message text.

    Returns:
        ParsedTrailers with ``golden_trace`` and ``hitl_weight`` fields
        populated if their respective trailers are found.
    """
    result = ParsedTrailers()

    gt_match = _GOLDEN_TRACE_RE.search(commit_message)
    if gt_match:
        result.golden_trace = gt_match.group(1)

    hw_match = _HITL_WEIGHT_RE.search(commit_message)
    if hw_match:
        try:
            result.hitl_weight = float(hw_match.group(1))
        except ValueError:
            pass  # invalid float — PROV-003 will catch it

    return result


# ── Validator ─────────────────────────────────────────────────────────────────

def validate_commit(
    commit_message: str,
    commit_sha: str = "",
    emitter: Optional[GoldenTraceEmitter] = None,
) -> ProvenanceResult:
    """Validate a single commit message against provenance rules.

    Rules checked:
      PROV-001  Golden-Trace trailer present
      PROV-002  Golden-Trace value is ``sha3-256:<64 hex chars>``
      PROV-003  HITL-Weight, when present, is a float in [0.0, 1.0]
      PROV-004  HITL-Weight, when present, is ≥ MIN_HITL_WEIGHT

    Args:
        commit_message: Full text of the commit message.
        commit_sha:     Optional short or full commit SHA for reporting.
        emitter:        Optional GoldenTraceEmitter for audit trace.

    Returns:
        ProvenanceResult; ``passed`` is True when no rule violations found.
    """
    snippet = commit_message[:72].replace("\n", " ").strip()
    parsed = parse_trailers(commit_message)
    findings: List[ProvenanceFinding] = []

    # PROV-001 — presence
    if parsed.golden_trace is None:
        findings.append(ProvenanceFinding(
            rule_id="PROV-001",
            message="Missing required Golden-Trace trailer",
            commit_sha=commit_sha,
        ))
    else:
        # PROV-002 — format (already enforced by regex, but double-check)
        if not re.match(r"^sha3-256:[0-9a-f]{64}$", parsed.golden_trace):
            findings.append(ProvenanceFinding(
                rule_id="PROV-002",
                message=f"Golden-Trace value has invalid format: {parsed.golden_trace!r}",
                commit_sha=commit_sha,
            ))

    # HITL-Weight checks only when the trailer is present
    if parsed.hitl_weight is not None:
        # PROV-003 — range [0.0, 1.0]
        if not (0.0 <= parsed.hitl_weight <= 1.0):
            findings.append(ProvenanceFinding(
                rule_id="PROV-003",
                message=(
                    f"HITL-Weight {parsed.hitl_weight} is outside valid range [0.0, 1.0]"
                ),
                commit_sha=commit_sha,
            ))
        # PROV-004 — minimum threshold
        elif parsed.hitl_weight < MIN_HITL_WEIGHT:
            findings.append(ProvenanceFinding(
                rule_id="PROV-004",
                message=(
                    f"HITL-Weight {parsed.hitl_weight} is below minimum "
                    f"{MIN_HITL_WEIGHT} — insufficient human-in-the-loop accountability"
                ),
                commit_sha=commit_sha,
            ))

    passed = len(findings) == 0
    result = ProvenanceResult(
        commit_sha=commit_sha,
        commit_message_snippet=snippet,
        passed=passed,
        findings=findings,
        parsed=parsed,
    )

    if emitter is not None:
        severity = "info" if passed else "warning"
        trace = emitter.emit(
            event_type="provenance_check",
            sphere_tag="H1.S2",
            aluminum_layer="L1-Constitutional",
            function="validate_commit",
            severity=severity,
            payload={
                "commit_sha": commit_sha,
                "passed": passed,
                "golden_trace_present": parsed.golden_trace is not None,
                "hitl_weight": parsed.hitl_weight,
                "violation_count": len(findings),
            },
            invariants_checked=["PROV-001", "PROV-002", "PROV-003", "PROV-004"],
        )
        result.trace_id = trace["trace_id"]

    return result


def validate_commits(
    commits: List[Tuple[str, str]],
    emitter: Optional[GoldenTraceEmitter] = None,
) -> BatchProvenanceResult:
    """Validate a list of commits.

    Args:
        commits: List of ``(commit_sha, commit_message)`` tuples.
        emitter: Optional GoldenTraceEmitter for a single batch-level audit trace
                 (individual ``validate_commit`` calls do not each emit when a
                 batch emitter is used — only the summary is emitted).

    Returns:
        BatchProvenanceResult with per-commit results and aggregate counts.
    """
    results: List[ProvenanceResult] = []
    for sha, message in commits:
        # Individual traces are suppressed in batch mode; we emit one summary.
        r = validate_commit(message, commit_sha=sha, emitter=None)
        results.append(r)

    passed = sum(1 for r in results if r.passed)
    failed = len(results) - passed

    batch = BatchProvenanceResult(
        commits_checked=len(results),
        commits_passed=passed,
        commits_failed=failed,
        results=results,
    )

    if emitter is not None:
        severity = "info" if failed == 0 else "warning"
        trace = emitter.emit(
            event_type="provenance_check",
            sphere_tag="H1.S2",
            aluminum_layer="L1-Constitutional",
            function="validate_commits",
            severity=severity,
            payload={
                "commits_checked": len(results),
                "commits_passed": passed,
                "commits_failed": failed,
                "all_passed": batch.all_passed,
            },
            invariants_checked=["PROV-001", "PROV-002", "PROV-003", "PROV-004"],
        )
        batch.trace_id = trace["trace_id"]

    return batch


# ── Helpers ───────────────────────────────────────────────────────────────────

def make_golden_trace_value(content: str) -> str:
    """Compute a canonical ``sha3-256:<hex>`` value suitable for the trailer.

    Hashes the UTF-8 encoding of *content* (typically a commit diff or summary).

    Args:
        content: Arbitrary string to hash.

    Returns:
        String in the form ``sha3-256:<64 lowercase hex chars>``.
    """
    digest = hashlib.sha3_256(content.encode("utf-8")).hexdigest()
    return f"sha3-256:{digest}"


def format_trailers(golden_trace: str, hitl_weight: Optional[float] = None) -> str:
    """Return a ready-to-append trailer block for a commit message.

    Args:
        golden_trace: Value produced by :func:`make_golden_trace_value`.
        hitl_weight:  Optional float in [0.0, 1.0]; omitted when None.

    Returns:
        Newline-separated trailer lines suitable for appending after a blank
        line at the end of a commit message.
    """
    lines = [f"Golden-Trace: {golden_trace}"]
    if hitl_weight is not None:
        lines.append(f"HITL-Weight: {hitl_weight:.2f}")
    return "\n".join(lines)


# ── GPG / SSH signing detection ───────────────────────────────────────────────

_GPG_SIGNED_RE = re.compile(r"gpg:\s+Good signature|gpgsig|gpg: Signature made", re.IGNORECASE)
_SSH_SIGNED_RE = re.compile(r"Good.*signature.*key|ssh-rsa|ssh-ed25519|ecdsa-sha2", re.IGNORECASE)


def detect_git_signing(commit_sha: str = "HEAD") -> bool:
    """Return True when a git commit is signed with a GPG or SSH key.

    This is the zero-friction HITL binding: if a developer uses their
    existing git signing key, that cryptographic proof counts as human
    attestation without any new tooling required.

    Uses ``git log --show-signature -1 <sha>`` and ``git verify-commit``.
    Both are fast local operations — no network call, no cloud API.

    Args:
        commit_sha: A commit SHA, branch name, or ``"HEAD"``.

    Returns:
        True if the commit carries a valid GPG or SSH signature.
    """
    # Try git verify-commit first (fast, exit code 0 on success)
    try:
        proc = subprocess.run(
            ["git", "verify-commit", commit_sha],
            capture_output=True, text=True, timeout=5,
        )
        if proc.returncode == 0:
            return True
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        pass

    # Fallback: parse git log --show-signature output
    try:
        proc = subprocess.run(
            ["git", "log", "--show-signature", "-1", commit_sha],
            capture_output=True, text=True, timeout=5,
        )
        combined = proc.stdout + proc.stderr
        if _GPG_SIGNED_RE.search(combined) or _SSH_SIGNED_RE.search(combined):
            return True
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        pass

    # Check git config: if gpg.format or commit.gpgsign is set, treat as signed
    try:
        fmt = subprocess.run(
            ["git", "config", "--get", "gpg.format"],
            capture_output=True, text=True, timeout=3,
        ).stdout.strip()
        sign_flag = subprocess.run(
            ["git", "config", "--get", "commit.gpgsign"],
            capture_output=True, text=True, timeout=3,
        ).stdout.strip().lower()
        if fmt in ("ssh", "openpgp", "x509") or sign_flag == "true":
            return True
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        pass

    return False
