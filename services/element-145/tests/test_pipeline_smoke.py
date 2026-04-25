import asyncio

from element145.kernel.pipeline import (
    Pipeline,
    IngressStage,
    ValidationStage,
    RoutingDecisionStage,
    ConsentStage,
    ExecutionPlanStage,
    DispatchStage,
)


def build_pipeline():
    p = Pipeline()
    p.add_stage(IngressStage())
    p.add_stage(ValidationStage())
    p.add_stage(RoutingDecisionStage())
    p.add_stage(ConsentStage())
    p.add_stage(ExecutionPlanStage())
    p.add_stage(DispatchStage())
    return p


def test_pipeline_noop():
    p = build_pipeline()
    payload = {"action": "read"}
    ctx = asyncio.run(p.execute(payload))

    assert ctx.trace_id is not None
    assert ctx.result is not None
    assert "uws_envelopes" in ctx.result
