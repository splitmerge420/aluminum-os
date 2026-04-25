"""Contract-aware pipeline core for Element 145 / Aluminum OS."""
from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from typing import Any, Protocol

from element145.contracts import (
    BudgetTier,
    ConsentDecision,
    EpistemicState,
    ExecutionPlan,
    RoutingDecision,
    SafetyState,
    SphereQuery,
)
from element145.governance.consent import ConsentKernel
from element145.integrations.uws_adapter import to_uws_envelopes
from element145.handlers.registry import HandlerRegistry
from element145.classifier.engine import RuleEngine
from element145.integrations.providers.registry import ProviderRegistry


@dataclass
class PipelineContext:
    payload: dict[str, Any]
    trace_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    started_at: float = field(default_factory=time.time)
    metadata: dict[str, Any] = field(default_factory=dict)
    sphere_query: SphereQuery | None = None
    routing_decision: RoutingDecision | None = None
    consent_decision: ConsentDecision | None = None
    execution_plan: ExecutionPlan | None = None
    result: dict[str, Any] | None = None
    halted: bool = False
    halt_reason: str | None = None

    @property
    def elapsed_ms(self) -> float:
        return (time.time() - self.started_at) * 1000

    def halt(self, reason: str) -> None:
        self.halted = True
        self.halt_reason = reason

    def to_response(self) -> dict[str, Any]:
        return {
            "trace_id": self.trace_id,
            "halted": self.halted,
            "halt_reason": self.halt_reason,
            "result": self.result,
            "contracts": {
                "sphere_query": self.sphere_query.model_dump(mode="json") if self.sphere_query else None,
                "routing_decision": self.routing_decision.model_dump(mode="json") if self.routing_decision else None,
                "consent_decision": self.consent_decision.model_dump(mode="json") if self.consent_decision else None,
                "execution_plan": self.execution_plan.model_dump(mode="json") if self.execution_plan else None,
            },
            "elapsed_ms": self.elapsed_ms,
        }


class PipelineStage(Protocol):
    name: str
    async def execute(self, ctx: PipelineContext) -> PipelineContext: ...


class Pipeline:
    def __init__(self) -> None:
        self._stages: list[PipelineStage] = []

    def add_stage(self, stage: PipelineStage) -> None:
        self._stages.append(stage)

    @property
    def stages(self) -> list[str]:
        return [s.name for s in self._stages]

    async def execute(self, payload: dict[str, Any]) -> PipelineContext:
        ctx = PipelineContext(payload=payload)
        for stage in self._stages:
            ctx = await stage.execute(ctx)
            if ctx.halted:
                break
        return ctx


class IngressStage:
    name = "ingress"

    async def execute(self, ctx: PipelineContext) -> PipelineContext:
        ctx.sphere_query = SphereQuery(
            query_id=str(uuid.uuid4()),
            trace_id=ctx.trace_id,
            actor_id=ctx.payload.get("actor_id"),
            raw_input=ctx.payload,
            source=ctx.payload.get("source", "api"),
            requested_action=ctx.payload.get("action", "read"),
            house=ctx.payload.get("house"),
            sphere=ctx.payload.get("sphere"),
            metadata=ctx.payload.get("metadata", {}),
        )
        return ctx


class ValidationStage:
    name = "validation"

    def __init__(self, max_payload_bytes: int = 1_048_576) -> None:
        self.max_payload_bytes = max_payload_bytes

    async def execute(self, ctx: PipelineContext) -> PipelineContext:
        if len(str(ctx.payload).encode()) > self.max_payload_bytes:
            ctx.halt("payload_too_large")
        return ctx


class RoutingDecisionStage:
    name = "routing_decision"

    def __init__(self) -> None:
        self.engine = RuleEngine()

    async def execute(self, ctx: PipelineContext) -> PipelineContext:
        assert ctx.sphere_query is not None

        classification = self.engine.classify(ctx.payload)

        action = ctx.sphere_query.requested_action or "read"
        safety = SafetyState.DANGEROUS if action in {"delete", "execute_code"} else SafetyState.SAFE

        ctx.routing_decision = RoutingDecision(
            trace_id=ctx.trace_id,
            query_id=ctx.sphere_query.query_id,
            house=classification.get("house", 0),
            sphere=classification.get("sphere", 0),
            epistemic_state=EpistemicState(classification.get("epistemic_state", "known")),
            safety_state=safety,
            selected_path="fast" if safety == SafetyState.SAFE else "human_review",
            selected_providers=["local_stub"],
            provider_weights={"local_stub": 1.0},
            policy_checks=[{"name": classification.get("matched_rule"), "passed": True}],
            budget_tier=BudgetTier.T2_FAST_LOW_COST,
            requires_human_approval=safety == SafetyState.DANGEROUS,
            routing_reason="rule-engine classification",
        )
        return ctx


class ConsentStage:
    name = "consent"

    def __init__(self, kernel: ConsentKernel | None = None) -> None:
        self.kernel = kernel or ConsentKernel()

    async def execute(self, ctx: PipelineContext) -> PipelineContext:
        assert ctx.sphere_query is not None
        action = ctx.sphere_query.requested_action or "read"
        token = ctx.payload.get("approval_token")
        ctx.consent_decision = self.kernel.decide(ctx.trace_id, action, token)
        if not ctx.consent_decision.allowed:
            ctx.result = {"status": "blocked", "reason": ctx.consent_decision.reason}
            ctx.halt("consent_denied")
        return ctx


class ExecutionPlanStage:
    name = "execution_plan"

    async def execute(self, ctx: PipelineContext) -> PipelineContext:
        assert ctx.routing_decision is not None
        assert ctx.consent_decision is not None
        ctx.execution_plan = ExecutionPlan(
            trace_id=ctx.trace_id,
            route=ctx.routing_decision,
            consent=ctx.consent_decision,
            operations=[{"provider": "local_stub", "type": ctx.sphere_query.requested_action if ctx.sphere_query else "read"}],
            dry_run=bool(ctx.payload.get("dry_run", False)),
        )
        return ctx


class DispatchStage:
    name = "dispatch"

    async def execute(self, ctx: PipelineContext) -> PipelineContext:
        assert ctx.execution_plan is not None

        registry = HandlerRegistry()
        handler = registry.get("general")

        handler_results = []
        for op in ctx.execution_plan.operations:
            result = await handler.handle(op)
            handler_results.append(result.__dict__)

        consent = ctx.consent_decision.model_dump(mode="json") if ctx.consent_decision else {}

        envelopes = to_uws_envelopes(
            trace_id=ctx.trace_id,
            operations=ctx.execution_plan.operations,
            consent=consent,
            dry_run=ctx.execution_plan.dry_run,
        )

        provider_registry = ProviderRegistry()
        provider_results = []
        for envelope in envelopes:
            provider = provider_registry.get(envelope.get("provider", "local_stub"))
            result = await provider.execute(envelope)
            provider_results.append(result.__dict__)

        ctx.result = {
            "status": "ok" if not ctx.execution_plan.dry_run else "dry_run",
            "handler_results": handler_results,
            "uws_envelopes": envelopes,
            "provider_results": provider_results,
        }
        return ctx
