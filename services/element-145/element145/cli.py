"""Element 145 operator CLI.

Small, safe operator surface for Phase-2 reconciliation. Avoids insecure token
minting and uses the canonical contract-aware pipeline.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys

from element145.kernel.pipeline import (
    Pipeline,
    IngressStage,
    ValidationStage,
    RoutingDecisionStage,
    ConsentStage,
    ExecutionPlanStage,
    DispatchStage,
)
from element145.provenance.ledger import ProvenanceLedger
from config.settings import get_settings


def build_pipeline() -> Pipeline:
    p = Pipeline()
    p.add_stage(IngressStage())
    p.add_stage(ValidationStage())
    p.add_stage(RoutingDecisionStage())
    p.add_stage(ConsentStage())
    p.add_stage(ExecutionPlanStage())
    p.add_stage(DispatchStage())
    return p


def _print(obj) -> None:
    print(json.dumps(obj, indent=2, default=str))


async def cmd_route(args) -> None:
    payload = json.loads(args.payload)
    ctx = await build_pipeline().execute(payload)
    _print(ctx.to_response())


def cmd_verify(args) -> None:
    settings = get_settings()
    ledger = ProvenanceLedger(
        backend=settings.ledger_backend,
        path=settings.ledger_path,
        sqlite_path=settings.ledger_sqlite_path,
    )
    _print(ledger.verify_chain())
    ledger.close()


def cmd_info(args) -> None:
    settings = get_settings()
    _print({
        "name": "Element 145 / Aluminum OS Runtime Core",
        "phase": "phase2-reconciliation",
        "env": settings.env,
        "port": settings.port,
        "ledger_backend": settings.ledger_backend,
        "shadow_mode": settings.shadow_mode,
        "simulation_mode": settings.simulation_mode,
    })


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(prog="element145")
    sub = parser.add_subparsers(dest="command", required=True)

    route = sub.add_parser("route", help="Run a payload through the contract-aware pipeline")
    route.add_argument("payload", help="JSON payload")
    route.set_defaults(func=lambda args: asyncio.run(cmd_route(args)))

    verify = sub.add_parser("verify", help="Verify provenance chain")
    verify.set_defaults(func=cmd_verify)

    info = sub.add_parser("info", help="Show runtime info")
    info.set_defaults(func=cmd_info)

    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main(sys.argv[1:])
