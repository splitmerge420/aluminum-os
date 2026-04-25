"""Provider adapter interface for Element 145 / UWS execution bridge."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class ProviderExecutionResult:
    provider: str
    status: str
    action: str
    dry_run: bool
    payload: dict[str, Any]
    metadata: dict[str, Any] = field(default_factory=dict)


class ProviderAdapter(Protocol):
    provider: str

    async def execute(self, envelope: dict[str, Any]) -> ProviderExecutionResult: ...
