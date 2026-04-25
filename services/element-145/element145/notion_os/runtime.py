from __future__ import annotations

import datetime
from typing import Any

from element145.notion_os.client import NotionOSClient
from element145.notion_os.models import (
    ArtifactRecord,
    JanusCheckpoint,
    NotionWriteResult,
)
from element145.notion_os.outbox import queue_failed_write, flush_outbox
from element145.notion_os.redaction import redact_secrets


class NotionOSRuntime:
    def __init__(self, client: NotionOSClient | None = None) -> None:
        self.client = client or NotionOSClient()

    def _safe_write(self, kind: str, fn, payload: Any) -> NotionWriteResult:
        # auto-flush before attempting new write
        try:
            flush_outbox(lambda k, p: None)
        except Exception:
            pass

        try:
            return fn()
        except Exception as e:
            path = queue_failed_write(kind, redact_secrets(payload), str(e))
            return NotionWriteResult(ok=False, kind=kind, error=str(e), queued_locally=True, local_queue_path=path)

    def log_transparency_packet(self, packet: dict) -> NotionWriteResult:
        def _write():
            return self.client.create_database_page(
                database_id=self.client.config.db_provenance,
                title=f"Packet {packet.get('trace_id', 'unknown')}",
                kind="transparency_packet",
                payload=packet,
            )

        return self._safe_write("transparency_packet", _write, packet)

    def create_janus_checkpoint(self, checkpoint: JanusCheckpoint) -> NotionWriteResult:
        payload = checkpoint.__dict__

        def _write():
            return self.client.create_database_page(
                database_id=self.client.config.db_checkpoints,
                title=f"Checkpoint {checkpoint.checkpoint_id}",
                kind="janus_checkpoint",
                payload=payload,
            )

        return self._safe_write("janus_checkpoint", _write, payload)

    def log_model_artifact(self, artifact: ArtifactRecord) -> NotionWriteResult:
        payload = artifact.__dict__

        def _write():
            return self.client.create_database_page(
                database_id=self.client.config.db_artifacts,
                title=f"Artifact {artifact.artifact_id}",
                kind="artifact",
                payload=payload,
                classification=artifact.classification.value,
            )

        return self._safe_write("artifact", _write, payload)
