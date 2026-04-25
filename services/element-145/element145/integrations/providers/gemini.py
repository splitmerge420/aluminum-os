"""Gemini provider adapter (Module 16B live execution)."""
from __future__ import annotations

import asyncio
from typing import Any

from element145.integrations.providers.base import ProviderExecutionResult
from config.settings import get_settings


class GeminiProvider:
    provider = "gemini"

    async def execute(self, envelope: dict[str, Any]) -> ProviderExecutionResult:
        settings = get_settings()

        if settings.provider_mode != "live":
            raise RuntimeError("GeminiProvider called while provider_mode != live")

        if not settings.gemini_api_key:
            raise RuntimeError("E145_GEMINI_API_KEY is required for live Gemini execution")

        text = envelope.get("payload", {}).get("text") or envelope.get("text") or ""

        if not text:
            raise RuntimeError("GeminiProvider requires 'text' in payload for generation")

        try:
            import google.generativeai as genai
        except ImportError as e:
            raise RuntimeError("google-generativeai package is required for GeminiProvider") from e

        genai.configure(api_key=settings.gemini_api_key)

        try:
            model = genai.GenerativeModel(settings.gemini_model)

            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: model.generate_content(text),
            )

            output_text = getattr(response, "text", None) or str(response)

            return ProviderExecutionResult(
                provider=self.provider,
                status="success",
                action="generate_text",
                dry_run=False,
                payload={"input": text, "output": output_text},
                metadata={"model": settings.gemini_model},
            )

        except Exception as e:
            raise RuntimeError(f"Gemini API call failed: {e}") from e
