"""Provenance models for Element 145 / Aluminum OS."""
from __future__ import annotations

import time
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field


class ProvenanceRecord(BaseModel):
    """Immutable record of one runtime decision or execution."""

    record_id: str = Field(default_factory=lambda: str(uuid4()))
    trace_id: str
    timestamp: float = Field(default_factory=time.time)
    classification: str
    elapsed_ms: float
    input_hash: str
    output_hash: str
    metadata: dict[str, Any] = Field(default_factory=dict)

    @property
    def is_valid(self) -> bool:
        return bool(self.trace_id and self.input_hash and self.output_hash)

    def to_ledger_entry(self) -> dict[str, Any]:
        return self.model_dump(mode="json")


class ProvenanceQuery(BaseModel):
    trace_id: str | None = None
    classification: str | None = None
    start_time: float | None = None
    end_time: float | None = None
    limit: int = Field(default=100, ge=1, le=1000)
