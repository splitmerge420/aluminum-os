"""Handler/device-driver base layer for Element 145 / Aluminum OS."""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class HandlerResult:
    domain: str
    status: str
    payload: dict[str, Any]
    elapsed_ms: float
    metadata: dict[str, Any] = field(default_factory=dict)


class BaseHandler(Protocol):
    domain: str
    capabilities: list[str]

    async def handle(self, operation: dict[str, Any]) -> HandlerResult: ...


class SimpleHandler:
    """Safe default handler used for Phase-2 domain driver scaffolding."""

    domain = "general"
    capabilities = ["process"]

    async def handle(self, operation: dict[str, Any]) -> HandlerResult:
        started = time.time()
        return HandlerResult(
            domain=self.domain,
            status="handled",
            payload={"operation": operation, "capabilities": self.capabilities},
            elapsed_ms=(time.time() - started) * 1000,
        )
