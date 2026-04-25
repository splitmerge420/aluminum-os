"""Element 145 application entrypoint."""
from __future__ import annotations

from fastapi import FastAPI

from element145.api.middleware import add_middleware
from element145.api.routes import router
from element145.provenance.ledger import ProvenanceLedger
from config.settings import get_settings


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title="Element 145", version="0.1.0")

    add_middleware(app, settings=settings)

    app.state.settings = settings
    app.state.ledger = ProvenanceLedger(
        backend=settings.ledger_backend,
        path=settings.ledger_path,
        sqlite_path=settings.ledger_sqlite_path,
    )

    app.include_router(router)

    return app


app = create_app()
