"""
GoldenTrace SDK v1.0 — Kintsugi Governance Spine
Zero-dependency Python module for emitting, validating, and chaining
GoldenTrace events across the Aluminum OS ecosystem.

Usage:
    from kintsugi.sdk.golden_trace import GoldenTraceEmitter

    emitter = GoldenTraceEmitter(repo="aluminum-os", module="engine/ontology_manager")
    trace = emitter.emit(
        event_type="classification",
        sphere_tag="H4.S7",
        aluminum_layer="L3-Engine",
        payload={"document_id": "abc123", "sphere_confidence": 0.94}
    )
    # trace is a dict conforming to golden_trace_v1.json schema

Atlas Lattice Foundation (c) 2026
"""

import uuid
import json
import hashlib
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any


class GoldenTraceEmitter:
    """Emits GoldenTrace events with automatic hash chaining."""

    def __init__(self, repo: str, module: str):
        self.repo = repo
        self.module = module
        self._previous_hash: Optional[str] = None
        self._trace_log: List[Dict[str, Any]] = []

    def emit(
        self,
        event_type: str,
        sphere_tag: str,
        aluminum_layer: str,
        payload: Dict[str, Any],
        function: str = "",
        severity: str = "info",
        invariants_checked: Optional[List[str]] = None,
        council_context: Optional[Dict[str, Any]] = None,
        kintsugi: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Emit a new GoldenTrace event with automatic hash chaining."""
        trace = {
            "trace_id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": {
                "repo": self.repo,
                "module": self.module,
                "function": function,
            },
            "event_type": event_type,
            "severity": severity,
            "sphere_tag": sphere_tag,
            "aluminum_layer": aluminum_layer,
            "payload": payload,
        }

        if invariants_checked:
            trace["invariants_checked"] = invariants_checked
        if council_context:
            trace["council_context"] = council_context
        if kintsugi:
            trace["severity"] = "golden"
            trace["kintsugi"] = kintsugi

        # Compute integrity hash chain
        trace_bytes = json.dumps(trace, sort_keys=True).encode("utf-8")
        current_hash = hashlib.sha3_256(trace_bytes).hexdigest()

        trace["integrity"] = {
            "hash_algorithm": "sha3-256",
            "hash": current_hash,
            "previous_trace_hash": self._previous_hash or "GENESIS",
        }

        self._previous_hash = current_hash
        self._trace_log.append(trace)
        return trace

    def emit_golden_repair(
        self,
        original_failure_trace_id: str,
        repair_strategy: str,
        strength_gained: str,
        beauty_score: float,
        sphere_tag: str,
        aluminum_layer: str,
        payload: Dict[str, Any],
        function: str = "",
    ) -> Dict[str, Any]:
        """Emit a kintsugi golden repair trace — failure turned to strength."""
        return self.emit(
            event_type="repair",
            sphere_tag=sphere_tag,
            aluminum_layer=aluminum_layer,
            function=function,
            payload=payload,
            kintsugi={
                "original_failure_trace_id": original_failure_trace_id,
                "repair_strategy": repair_strategy,
                "strength_gained": strength_gained,
                "beauty_score": max(0.0, min(1.0, beauty_score)),
            },
        )

    def verify_chain(self) -> bool:
        """Verify the integrity of the entire trace chain."""
        for i, trace in enumerate(self._trace_log):
            integrity = trace.pop("integrity")
            trace_bytes = json.dumps(trace, sort_keys=True).encode("utf-8")
            expected_hash = hashlib.sha3_256(trace_bytes).hexdigest()
            trace["integrity"] = integrity

            if integrity["hash"] != expected_hash:
                return False
            if i == 0 and integrity["previous_trace_hash"] != "GENESIS":
                return False
            if i > 0:
                prev_hash = self._trace_log[i - 1]["integrity"]["hash"]
                if integrity["previous_trace_hash"] != prev_hash:
                    return False
        return True

    def get_golden_seams(self) -> List[Dict[str, Any]]:
        """Return all kintsugi golden repair traces — the scars that became strengths."""
        return [t for t in self._trace_log if t.get("severity") == "golden"]

    def export_log(self) -> str:
        """Export the full trace log as JSON."""
        return json.dumps(self._trace_log, indent=2)


class GoldenTraceValidator:
    """Validates GoldenTrace events against the v1.0 schema."""

    REQUIRED_FIELDS = ["trace_id", "timestamp", "source", "event_type", "sphere_tag", "aluminum_layer", "payload", "integrity"]
    VALID_EVENT_TYPES = [
        "action", "failure", "repair", "golden_seam",
        "invariant_check", "invariant_violation",
        "consent_granted", "consent_denied",
        "council_vote", "council_consensus", "council_dissent",
        "model_route", "model_fallback",
        "query", "ingestion", "classification",
        "amendment_proposed", "amendment_enacted",
        "ghost_seat_invoked", "human_override",
        # uws CLI event types
        "swarm_review",
        "constitutional_lint",
        # provenance trailer event types
        "provenance_check",
    ]
    VALID_LAYERS = ["L1-Constitutional", "L2-Kernel", "L3-Engine", "L4-Service", "L5-Extension"]
    VALID_SEVERITIES = ["trace", "info", "warning", "error", "critical", "golden"]

    @classmethod
    def validate(cls, trace: Dict[str, Any]) -> List[str]:
        """Validate a trace event. Returns list of errors (empty = valid)."""
        errors = []
        for field in cls.REQUIRED_FIELDS:
            if field not in trace:
                errors.append(f"Missing required field: {field}")
        if trace.get("event_type") not in cls.VALID_EVENT_TYPES:
            errors.append(f"Invalid event_type: {trace.get('event_type')}")
        if trace.get("aluminum_layer") not in cls.VALID_LAYERS:
            errors.append(f"Invalid aluminum_layer: {trace.get('aluminum_layer')}")
        if trace.get("severity") and trace["severity"] not in cls.VALID_SEVERITIES:
            errors.append(f"Invalid severity: {trace.get('severity')}")
        return errors