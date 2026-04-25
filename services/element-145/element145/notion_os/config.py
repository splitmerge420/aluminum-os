from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class NotionOSConfig:
    api_token: Optional[str] = None
    root_page_id: Optional[str] = None

    # database ids (filled after bootstrap)
    db_provenance: Optional[str] = None
    db_tasks: Optional[str] = None
    db_approvals: Optional[str] = None
    db_artifacts: Optional[str] = None
    db_checkpoints: Optional[str] = None

    sandbox: bool = True

    @classmethod
    def from_env(cls) -> "NotionOSConfig":
        return cls(
            api_token=os.getenv("NOTION_API_TOKEN"),
            root_page_id=os.getenv("NOTION_ROOT_PAGE_ID"),
            db_provenance=os.getenv("NOTION_DB_PROVENANCE"),
            db_tasks=os.getenv("NOTION_DB_TASKS"),
            db_approvals=os.getenv("NOTION_DB_APPROVALS"),
            db_artifacts=os.getenv("NOTION_DB_ARTIFACTS"),
            db_checkpoints=os.getenv("NOTION_DB_CHECKPOINTS"),
            sandbox=os.getenv("NOTION_SANDBOX", "true").lower() == "true",
        )
