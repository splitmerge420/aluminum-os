"""FastAPI middleware for Element 145."""
from __future__ import annotations

import time
import uuid
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware


def add_middleware(app: FastAPI, settings=None) -> None:
    origins = getattr(settings, "cors_origins", ["http://localhost:8145"])
    allow_credentials = getattr(settings, "cors_allow_credentials", False)

    @app.middleware("http")
    async def request_id_and_timing(request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        started = time.time()
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time-Ms"] = f"{(time.time() - started) * 1000:.2f}"
        return response

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )


# Backward-compatible alias for earlier scaffold naming.
def register_middleware(app: FastAPI, settings=None) -> None:
    add_middleware(app, settings=settings)
