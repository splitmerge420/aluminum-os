"""Element 145 settings with production guardrails.

This module intentionally wraps the Copilot Phase-1 configuration shape with
Aluminum OS safety defaults:
- production rejects default secrets;
- CORS is explicit in production;
- token minting is disabled in production unless explicitly admin-gated;
- live provider execution is opt-in and never silently falls back to stubs.
"""
from __future__ import annotations

from functools import lru_cache
from typing import List, Optional

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_DEV_SECRET = "e145-dev-secret-change-me"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="E145_", env_file=".env", extra="ignore")

    # Core
    env: str = "development"
    host: str = "0.0.0.0"
    port: int = 8145
    debug: bool = False

    # Kernel
    pipeline_max_payload_bytes: int = 1_048_576
    scheduler_max_queue: int = 1000
    scheduler_age_threshold_ms: float = 5000.0
    scheduler_deadline_s: float = 30.0
    breaker_failure_threshold: int = 5
    breaker_recovery_timeout_s: float = 30.0
    breaker_success_threshold: int = 2

    # Security
    security_secret: str = Field(default=DEFAULT_DEV_SECRET)
    token_expiry_hours: int = 24
    token_minting_enabled: bool = False
    token_minting_admin_only: bool = True
    cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:8145"])
    cors_allow_credentials: bool = False

    # Provider execution
    provider_mode: str = "stub"  # stub | live
    default_provider: str = "local_stub"
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-2.5-flash"
    gemini_timeout_s: float = 30.0

    # Storage
    ledger_backend: str = "sqlite"
    ledger_path: str = "./data/ledger"
    ledger_sqlite_path: str = "./data/ledger/provenance.db"

    # Policies
    policy_classification_path: str = "config/policies/classification.yaml"
    policy_security_path: str = "config/policies/security.yaml"

    # Observability
    log_level: str = "INFO"
    log_format: str = "json"

    # Transparency
    transparency_emit: bool = True
    transparency_sink: str = "stdout"

    # Modes
    simulation_mode: bool = False
    shadow_mode: bool = False
    classifier_backend: str = "rule_engine"
    event_bus_max_queue: int = 10000

    @property
    def is_production(self) -> bool:
        return self.env.lower() in {"prod", "production"}

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            return [x.strip() for x in value.split(",") if x.strip()]
        return value

    @model_validator(mode="after")
    def enforce_production_safety(self) -> "Settings":
        if self.provider_mode not in {"stub", "live"}:
            raise ValueError("E145_PROVIDER_MODE must be 'stub' or 'live'")
        if self.provider_mode == "live" and self.default_provider == "gemini" and not self.gemini_api_key:
            raise ValueError("live Gemini mode requires E145_GEMINI_API_KEY")
        if self.is_production:
            if self.security_secret == DEFAULT_DEV_SECRET:
                raise ValueError("production requires E145_SECURITY_SECRET to be set")
            if "*" in self.cors_origins:
                raise ValueError("production CORS origins must be explicit, not '*'")
            if self.cors_allow_credentials and "*" in self.cors_origins:
                raise ValueError("production CORS cannot use wildcard origins with credentials")
            if self.token_minting_enabled and not self.token_minting_admin_only:
                raise ValueError("production token minting must be admin-gated")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
