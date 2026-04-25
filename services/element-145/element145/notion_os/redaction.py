from __future__ import annotations

import re
from typing import Any

SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9]{10,}"),
    re.compile(r"(?i)api[_-]?key\s*[:=]\s*[A-Za-z0-9_-]+"),
    re.compile(r"Bearer\s+[A-Za-z0-9\._-]+"),
]


def redact_secrets(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: redact_secrets(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [redact_secrets(v) for v in obj]
    if isinstance(obj, str):
        redacted = obj
        for pat in SECRET_PATTERNS:
            redacted = pat.sub("[REDACTED]", redacted)
        return redacted
    return obj
