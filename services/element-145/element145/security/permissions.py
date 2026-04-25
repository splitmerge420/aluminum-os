"""Basic permission checks (fail-closed) for Element 145."""
from __future__ import annotations

from typing import Iterable

from element145.security.context import SecurityContext


class PermissionError(RuntimeError):
    pass


def require_roles(ctx: SecurityContext, roles: Iterable[str]) -> None:
    if not any(ctx.has_role(r) for r in roles):
        raise PermissionError(f"missing required roles: {list(roles)}")


def require_domain(ctx: SecurityContext, domain: str) -> None:
    if not ctx.in_domain(domain):
        raise PermissionError(f"missing required domain: {domain}")


def require_not_destructive(action: str) -> None:
    destructive = {
        "delete",
        "execute_code",
        "modify_constitution",
        "modify_routing",
        "modify_provenance",
        "modify_budget",
        "access_credentials",
        "submit_public",
    }
    if action in destructive:
        raise PermissionError("destructive action requires explicit consent")
