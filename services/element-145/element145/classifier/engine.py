"""Policy-driven classifier engine for Element 145.

Phase-2 compatible, narrowed for Aluminum OS reconciliation.
Supports simple YAML rules and safe fallback defaults.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


class RuleEngine:
    def __init__(self, policy_path: str | Path | None = None) -> None:
        self.policy_path = Path(policy_path or "services/element-145/config/policies/classification.yaml")
        self.policy: dict[str, Any] = {}
        self.reload()

    def reload(self) -> None:
        if not self.policy_path.exists():
            self.policy = {
                "default": {
                    "house": 0,
                    "sphere": 0,
                    "epistemic_state": "known",
                    "safety_state": "safe",
                },
                "rules": [],
            }
            return
        with self.policy_path.open("r", encoding="utf-8") as f:
            self.policy = yaml.safe_load(f) or {}

    def classify(self, payload: dict[str, Any]) -> dict[str, Any]:
        default = self.policy.get("default", {})
        for rule in self.policy.get("rules", []):
            if self._matches(rule.get("match", {}), payload):
                merged = dict(default)
                merged.update(rule.get("set", {}))
                merged["matched_rule"] = rule.get("name", "unnamed")
                return merged
        out = dict(default)
        out["matched_rule"] = "default"
        return out

    def _matches(self, match: dict[str, Any], payload: dict[str, Any]) -> bool:
        keywords = match.get("any_keywords") or []
        if keywords:
            haystack = str(payload).lower()
            return any(str(k).lower() in haystack for k in keywords)

        equals = match.get("equals") or {}
        for key, value in equals.items():
            if self._resolve(payload, key) != value:
                return False
        return bool(match)

    def _resolve(self, payload: dict[str, Any], dotted: str) -> Any:
        cur: Any = payload
        for part in dotted.split("."):
            if not isinstance(cur, dict):
                return None
            cur = cur.get(part)
        return cur
