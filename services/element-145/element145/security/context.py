"""Security context for request-scoped identity and permissions."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, List


@dataclass
class SecurityContext:
    subject: str
    roles: List[str] = field(default_factory=list)
    domains: List[str] = field(default_factory=list)
    attributes: dict[str, Any] = field(default_factory=dict)

    def has_role(self, role: str) -> bool:
        return role in self.roles

    def in_domain(self, domain: str) -> bool:
        return domain in self.domains
