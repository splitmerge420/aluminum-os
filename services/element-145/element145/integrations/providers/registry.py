"""Provider adapter registry for UWS execution bridge."""
from __future__ import annotations

from typing import Dict, Any

from element145.integrations.providers.local_stub import LocalStubProvider

try:
    from element145.integrations.providers.gemini import GeminiProvider
    HAS_GEMINI = True
except Exception:
    HAS_GEMINI = False


class ProviderRegistry:
    def __init__(self) -> None:
        self._providers: Dict[str, Any] = {}
        self._register_defaults()

    def _register_defaults(self) -> None:
        self.register(LocalStubProvider())
        if HAS_GEMINI:
            try:
                self.register(GeminiProvider())
            except Exception:
                pass

    def register(self, provider: Any) -> None:
        self._providers[provider.provider] = provider

    def get(self, name: str):
        return self._providers.get(name) or self._providers.get("local_stub")

    @property
    def providers(self) -> list[str]:
        return list(self._providers.keys())
