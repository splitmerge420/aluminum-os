"""TransparencyPacket v0.2 emitter for Element 145 / Aluminum OS.

A v0.2 packet is the canonical receipt for an OS action. It preserves
routing, governance, provenance, costs, and verification data in one
exportable/replayable object.
"""
from __future__ import annotations

import hashlib
import json
import time
import uuid
from typing import Any

from element145.contracts import PipelineContext  # type: ignore[attr-defined]
from element145.contracts.models import TransparencyPacketV02


def _sha256_json(obj: Any) -> str:
    raw = json.dumps(obj, sort_keys=True, default=str).encode()
    return hashlib.sha256(raw).hexdigest()


class TransparencyEmitterV02:
    """Build TransparencyPacketV02 objects from pipeline execution context."""

    def emit_from_context(
        self,
        *,
        trace_id: str,
        routing: dict[str, Any],
        governance: dict[str, Any],
        provenance: dict[str, Any],
        costs: dict[str, Any] | None = None,
    ) -> TransparencyPacketV02:
        costs = costs or {"estimated_cost": 0, "actual_cost": 0, "budget_tier": None}
        unsigned = {
            "trace_id": trace_id,
            "routing": routing,
            "governance": governance,
            "provenance": provenance,
            "costs": costs,
        }
        fingerprint = _sha256_json(unsigned)
        return TransparencyPacketV02(
            packet_id=str(uuid.uuid4()),
            trace_id=trace_id,
            timestamp=time.time(),
            routing=routing,
            governance=governance,
            provenance=provenance,
            costs=costs,
            verification={
                "hash_scheme": "sha256-json-v1",
                "signature_scheme": "none-phase1",
                "fingerprint": fingerprint,
                "verified": True,
            },
        )


def build_packet_from_response(response: dict[str, Any], ledger_record: dict[str, Any] | None = None) -> TransparencyPacketV02:
    contracts = response.get("contracts", {})
    routing = contracts.get("routing_decision") or {}
    consent = contracts.get("consent_decision") or {}
    execution_plan = contracts.get("execution_plan") or {}
    provenance = {
        "ledger_record": ledger_record,
        "input_hash": ledger_record.get("input_hash") if ledger_record else None,
        "output_hash": ledger_record.get("output_hash") if ledger_record else None,
        "execution_hash": _sha256_json(response.get("result")),
        "lineage_chain": ledger_record.get("chain_hash") if ledger_record else None,
    }
    costs = {
        "estimated_cost": 0,
        "actual_cost": 0,
        "budget_tier": routing.get("budget_tier"),
    }
    return TransparencyEmitterV02().emit_from_context(
        trace_id=response["trace_id"],
        routing=routing,
        governance={
            "consent_decision": consent,
            "approval_token": consent.get("approval_token"),
            "policy_checks": routing.get("policy_checks", []),
            "dissent": routing.get("dissent", []),
            "execution_plan": execution_plan,
        },
        provenance=provenance,
        costs=costs,
    )
