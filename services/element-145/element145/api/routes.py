"""API routes for Element 145."""
from __future__ import annotations

from fastapi import APIRouter, Request

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
from element145.provenance.models import ProvenanceRecord, ProvenanceQuery

router = APIRouter()


def build_pipeline() -> Pipeline:
    p = Pipeline()
    p.add_stage(IngressStage())
    p.add_stage(ValidationStage())
    p.add_stage(RoutingDecisionStage())
    p.add_stage(ConsentStage())
    p.add_stage(ExecutionPlanStage())
    p.add_stage(DispatchStage())
    return p


@router.post("/route")
async def route(request: Request, body: dict):
    pipeline = build_pipeline()
    ctx = await pipeline.execute(body)

    ledger: ProvenanceLedger = request.app.state.ledger
    if ctx.sphere_query and ctx.result is not None:
        record = ProvenanceRecord(
            trace_id=ctx.trace_id,
            classification=str(ctx.routing_decision.house if ctx.routing_decision else "unknown"),
            elapsed_ms=ctx.elapsed_ms,
            input_hash="",  # TODO: hash input
            output_hash="",  # TODO: hash output
            metadata={"halted": ctx.halted},
        )
        ledger.append(record)

    return ctx.to_response()


@router.get("/provenance")
async def provenance(request: Request):
    ledger: ProvenanceLedger = request.app.state.ledger
    return {"count": ledger.count}


@router.get("/provenance/verify")
async def provenance_verify(request: Request):
    ledger: ProvenanceLedger = request.app.state.ledger
    return ledger.verify_chain()
