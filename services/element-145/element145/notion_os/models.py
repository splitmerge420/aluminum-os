from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class DataClassification(str, Enum):
    PUBLIC = "PUBLIC"
    INTERNAL = "INTERNAL"
    SENSITIVE = "SENSITIVE"
    RESTRICTED = "RESTRICTED"


class ArtifactStatus(str, Enum):
    RECEIVED = "RECEIVED"
    UNDER_REVIEW = "UNDER_REVIEW"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    MERGED = "MERGED"
    SUPERSEDED = "SUPERSEDED"
    PARKED = "PARKED"
    NEEDS_VERIFICATION = "NEEDS_VERIFICATION"


class IntegrationDecision(str, Enum):
    NO_ACTION = "NO_ACTION"
    INTEGRATE = "INTEGRATE"
    REFERENCE_ONLY = "REFERENCE_ONLY"
    VERIFY_FIRST = "VERIFY_FIRST"
    REJECT = "REJECT"
    DEFER = "DEFER"


@dataclass
class NotionWriteResult:
    ok: bool
    kind: str
    notion_url: Optional[str] = None
    notion_id: Optional[str] = None
    warning: Optional[str] = None
    error: Optional[str] = None
    queued_locally: bool = False
    local_queue_path: Optional[str] = None


@dataclass
class JanusCheckpoint:
    checkpoint_id: str
    timestamp: str
    active_branch: str
    active_module: str
    roadmap: str
    last_command: Optional[str] = None
    blockers: Optional[str] = None
    next_action: Optional[str] = None
    summary: Optional[str] = None


@dataclass
class ArtifactRecord:
    artifact_id: str
    source_model: str
    summary: str
    status: ArtifactStatus
    decision: IntegrationDecision
    classification: DataClassification
