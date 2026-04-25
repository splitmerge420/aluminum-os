"""Element 145 / Aluminum OS contract models.

These Pydantic models define the core runtime loop for the Aluminum OS
system-call layer.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from .enums import BudgetTier, EpistemicState, SafetyState


class SphereQuery(BaseModel):
    """Normalized intent entering the OS namespace."""

    query_id: str
    trace_id: str
    actor_id: Optional[str] = None
    raw_input: Any
    source: str
    requested_action: Optional[str] = None
    house: Optional[int] = None
    sphere: Optional[int] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class RoutingDecision(BaseModel):
    """Scheduler decision produced by the router."""

    trace_id: str
    query_id: str
    house: int
    sphere: int
    epistemic_state: EpistemicState
    safety_state: SafetyState
    selected_path: str
    selected_providers: List[str]
    provider_weights: Dict[str, float]
    policy_checks: List[Dict[str, Any]]
    budget_tier: BudgetTier
    requires_human_approval: bool
    routing_reason: str
    dissent: List[Dict[str, Any]] = Field(default_factory=list)


class ConsentDecision(BaseModel):
    """ConsentKernel output for an action."""

    trace_id: str
    action_type: str
    destructive: bool
    allowed: bool
    reason: str
    approval_token: Optional[str] = None
    required_approver: Optional[str] = None
    expires_at: Optional[str] = None


class ExecutionPlan(BaseModel):
    """Concrete execution plan for providers/models/tools."""

    trace_id: str
    route: RoutingDecision
    consent: ConsentDecision
    operations: List[Dict[str, Any]]
    dry_run: bool = False
    rollback_plan: Optional[Dict[str, Any]] = None


class TransparencyPacketV02(BaseModel):
    """Receipt emitted for every OS action."""

    packet_id: str
    trace_id: str
    timestamp: float
    routing: Dict[str, Any]
    governance: Dict[str, Any]
    provenance: Dict[str, Any]
    costs: Dict[str, Any]
    verification: Dict[str, Any]


class ProviderBalanceSnapshot(BaseModel):
    """INV-7 provider distribution tracking snapshot."""

    trace_id: str
    window_start: str
    window_end: str
    provider_counts: Dict[str, int]
    provider_percentages: Dict[str, float]
    violation: bool
    rebalancing_required: bool
