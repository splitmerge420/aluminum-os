"""General domain handler."""
from __future__ import annotations

from element145.handlers.base import HandlerResult


class GeneralHandler:
    domain = "general"
    capabilities = ["read", "process"]

    async def handle(self, operation: dict):
        return HandlerResult(
            domain=self.domain,
            status="ok",
            payload={"echo": operation},
            elapsed_ms=0.1,
        )
