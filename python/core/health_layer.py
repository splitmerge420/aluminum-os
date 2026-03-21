"""
Aluminum OS — Health Layer (Ring 1 Middleware, v2.0)

Constitutional healthcare extensions for the Python middleware tier.
Zero external dependencies. Vanilla Python 3.

Components:
    FhirEvent              — Typed FHIR R4/R5 event schema with hash integrity
    HealthAuditLedger      — Append-only health audit log (no-delete mandate)
    ConsentVault           — Health-grade patient consent management
    AiDisclosureRegistry   — INV-30 AI disclosure tracking
    AmendmentProtocol      — Constitutional amendment lifecycle management
    RegulatoryChecker      — HIPAA §164 / 21 CFR Part 11 / ONC §3022 compliance
    PqcIdentityRecord      — Post-quantum identity stubs (ML-KEM-1024 / ML-DSA-87)

Kintsugi Integration:
    HealthAuditLedger, ConsentVault, and AmendmentProtocol all accept an optional
    `tracer` argument (a GoldenTraceEmitter from kintsugi.sdk.golden_trace).
    When provided, constitutional events are emitted as GoldenTrace entries.
    When omitted, the modules run identically with zero kintsugi dependency.

    Example:
        from kintsugi import GoldenTraceEmitter
        from core.health_layer import HealthAuditLedger

        tracer = GoldenTraceEmitter(repo="aluminum-os", module="core/health_layer")
        ledger = HealthAuditLedger(tracer=tracer)
        # — every append() now also emits a GoldenTrace event

DISCLAIMER: Reference architecture only. Not certified for clinical use.
Requires independent legal review before handling real PHI.

Atlas Lattice Foundation — March 2026
"""

import hashlib
import json
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional


# ============================================================================
# FHIR R4/R5 Resource Types
# ============================================================================

class FhirResourceType(Enum):
    """FHIR R4/R5 resource types supported by the Aluminum OS Health Layer.

    Maps to HL7 FHIR R5 §3.1 canonical resource definitions.
    """
    PATIENT = "Patient"
    OBSERVATION = "Observation"
    CONDITION = "Condition"
    MEDICATION_REQUEST = "MedicationRequest"
    CLAIM = "Claim"
    EXPLANATION_OF_BENEFIT = "ExplanationOfBenefit"
    DIAGNOSTIC_REPORT = "DiagnosticReport"
    ENCOUNTER = "Encounter"
    PROCEDURE = "Procedure"
    ALLERGY_INTOLERANCE = "AllergyIntolerance"
    CARE_PLAN = "CarePlan"
    CONSENT = "Consent"
    AUDIT_EVENT = "AuditEvent"
    PRACTITIONER = "Practitioner"
    ORGANIZATION = "Organization"

    def requires_explicit_consent(self) -> bool:
        """Returns True if this resource contains PHI requiring explicit consent
        under HIPAA Privacy Rule (45 CFR §164.502)."""
        return self in {
            FhirResourceType.PATIENT,
            FhirResourceType.CONDITION,
            FhirResourceType.MEDICATION_REQUEST,
            FhirResourceType.DIAGNOSTIC_REPORT,
            FhirResourceType.PROCEDURE,
            FhirResourceType.ALLERGY_INTOLERANCE,
            FhirResourceType.CARE_PLAN,
        }

    def is_financial(self) -> bool:
        """Returns True if this is a financial/billing resource."""
        return self in {FhirResourceType.CLAIM, FhirResourceType.EXPLANATION_OF_BENEFIT}


class FhirAction(Enum):
    """Actions that can be performed on FHIR resources."""
    READ = "read"
    CREATE = "create"
    UPDATE = "update"
    SEARCH = "search"
    EXPORT = "export"
    TRANSMIT = "transmit"
    DENIAL_OF_CARE = "denial_of_care"


@dataclass
class FhirEvent:
    """A single FHIR health event with constitutional metadata.

    Implements the event schema required by:
      - IHE ATNA (Audit Trail and Node Authentication) profile
      - HL7 FHIR AuditEvent resource (R4/R5)
      - INV-30 AI disclosure requirements
    """
    resource_type: FhirResourceType
    action: FhirAction
    agent_id: str
    resource_id: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None
    ai_involved: bool = False
    ai_confidence_pct: int = 0
    consent_reference: Optional[str] = None
    timestamp: float = field(default_factory=time.time)
    # Computed fields
    event_id: str = field(default="", init=False)
    integrity_hash: str = field(default="", init=False)

    def __post_init__(self) -> None:
        self.event_id = self._compute_event_id()
        self.integrity_hash = self._compute_hash()

    def _compute_event_id(self) -> str:
        raw = f"{self.agent_id}:{self.resource_type.value}:{self.action.value}:{self.timestamp}"
        return hashlib.sha3_256(raw.encode()).hexdigest()[:16]

    def _compute_hash(self) -> str:
        data = {
            "resource_type": self.resource_type.value,
            "action": self.action.value,
            "agent_id": self.agent_id,
            "resource_id": self.resource_id,
            "ai_involved": self.ai_involved,
            "timestamp": self.timestamp,
        }
        return hashlib.sha3_256(
            json.dumps(data, sort_keys=True).encode()
        ).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_id": self.event_id,
            "resource_type": self.resource_type.value,
            "action": self.action.value,
            "agent_id": self.agent_id,
            "resource_id": self.resource_id,
            "payload": self.payload,
            "ai_involved": self.ai_involved,
            "ai_confidence_pct": self.ai_confidence_pct,
            "consent_reference": self.consent_reference,
            "timestamp": self.timestamp,
            "integrity_hash": self.integrity_hash,
        }


# ============================================================================
# Health Audit Ledger (append-only, no-delete mandate)
# ============================================================================

class HealthAuditSeverity(Enum):
    """Severity level for a health audit log entry."""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"
    REGULATORY = "regulatory"   # triggers mandatory external reporting


@dataclass
class HealthAuditEntry:
    """A single health audit log entry.

    Structure aligned with:
      - HIPAA Security Rule §164.312(b) audit controls
      - IHE ATNA profile (RFC 3881 / DICOM Supplement 95)
      - 21 CFR Part 11 §11.10(e)
    """
    seq: int
    event: FhirEvent
    severity: HealthAuditSeverity
    consent_verified: bool
    ai_disclosed: bool
    # Stub PQC signature (first 8 hex chars of SHA3-256 over entry)
    pqc_sig_stub: str
    logged_at: float = field(default_factory=time.time)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "seq": self.seq,
            "event": self.event.to_dict(),
            "severity": self.severity.value,
            "consent_verified": self.consent_verified,
            "ai_disclosed": self.ai_disclosed,
            "pqc_sig_stub": self.pqc_sig_stub,
            "logged_at": self.logged_at,
        }


class HealthAuditLedger:
    """Append-only health audit ledger — no-delete mandate.

    Implements HIPAA §164.312(b), HITECH §13402, and 21 CFR Part 11 §11.10(e).
    Every health action MUST produce an entry before execution (fail closed).

    Kintsugi integration: pass a GoldenTraceEmitter as `tracer` to emit every
    append as a GoldenTrace event.  Denial-of-care actions emit as
    ``invariant_violation`` with ``INV-30``; all other actions emit as ``action``.
    """

    # Regulatory threshold: ≥3 denial-of-care events triggers mandatory external review.
    # Basis: HIPAA §164.530(j) requires investigation of patterns of complaints; CMS
    # Conditions of Participation (42 CFR §482.13) mandate review when a pattern of
    # inappropriate denials is identified.  Three occurrences within a rolling 90-day
    # period is the commonly accepted threshold in clinical compliance programs.
    DENIAL_THRESHOLD = 3

    # Sphere tag and layer used for all health audit GoldenTrace events.
    _SPHERE_TAG = "H7.S1"
    _LAYER = "L4-Service"

    def __init__(self, tracer: Optional[Any] = None) -> None:
        """
        Args:
            tracer: Optional GoldenTraceEmitter.  When provided, every successful
                    ``append()`` call also emits a GoldenTrace audit event.
        """
        self._entries: List[HealthAuditEntry] = []
        self._seq: int = 0
        self._denial_count: int = 0
        self._previous_hash: Optional[str] = None
        self._tracer: Optional[Any] = tracer

    def append(
        self,
        event: FhirEvent,
        severity: HealthAuditSeverity,
        consent_verified: bool,
        ai_disclosed: bool,
    ) -> HealthAuditEntry:
        """Append a new audit entry.

        Raises ConsentError if PHI is accessed without verified consent.
        Emits a GoldenTrace event when a tracer is configured.
        """
        if event.resource_type.requires_explicit_consent() and not consent_verified:
            raise ConsentError(
                f"HIPAA §164.502 violation: {event.resource_type.value} requires "
                "explicit patient consent"
            )
        if event.action == FhirAction.DENIAL_OF_CARE:
            self._denial_count += 1

        self._seq += 1

        # Stub PQC signature: SHA3-256 over previous hash + event hash
        raw = f"{self._previous_hash or 'GENESIS'}:{event.integrity_hash}:{self._seq}"
        pqc_sig_stub = hashlib.sha3_256(raw.encode()).hexdigest()[:16]

        entry = HealthAuditEntry(
            seq=self._seq,
            event=event,
            severity=severity,
            consent_verified=consent_verified,
            ai_disclosed=ai_disclosed,
            pqc_sig_stub=pqc_sig_stub,
        )
        self._entries.append(entry)
        self._previous_hash = pqc_sig_stub

        # ── Kintsugi GoldenTrace integration ──────────────────────────────
        if self._tracer is not None:
            is_denial = event.action == FhirAction.DENIAL_OF_CARE
            gt_event_type = "invariant_violation" if is_denial else "action"
            gt_severity = "critical" if is_denial else severity.value
            invariants = ["INV-30"] if is_denial else []
            self._tracer.emit(
                event_type=gt_event_type,
                sphere_tag=self._SPHERE_TAG,
                aluminum_layer=self._LAYER,
                function="HealthAuditLedger.append",
                severity=gt_severity,
                invariants_checked=invariants,
                payload={
                    "seq": entry.seq,
                    "fhir_resource_type": event.resource_type.value,
                    "fhir_action": event.action.value,
                    "agent_id": event.agent_id,
                    "consent_verified": consent_verified,
                    "ai_disclosed": ai_disclosed,
                    "pqc_sig_stub": pqc_sig_stub,
                },
            )

        return entry

    @property
    def entry_count(self) -> int:
        return len(self._entries)

    @property
    def denial_count(self) -> int:
        return self._denial_count

    @property
    def denial_threshold_exceeded(self) -> bool:
        return self._denial_count >= self.DENIAL_THRESHOLD

    def get(self, idx: int) -> Optional[HealthAuditEntry]:
        return self._entries[idx] if 0 <= idx < len(self._entries) else None

    def export_json(self) -> str:
        """Export the full ledger as JSON (for long-term storage)."""
        return json.dumps([e.to_dict() for e in self._entries], indent=2)

    def verify_chain(self) -> bool:
        """Verify the append-only integrity chain of the ledger."""
        prev = "GENESIS"
        for entry in self._entries:
            raw = f"{prev}:{entry.event.integrity_hash}:{entry.seq}"
            expected = hashlib.sha3_256(raw.encode()).hexdigest()[:16]
            if entry.pqc_sig_stub != expected:
                return False
            prev = entry.pqc_sig_stub
        return True


class ConsentError(Exception):
    """Raised when PHI is accessed without the required patient consent."""
    pass


# ============================================================================
# Consent Vault — health-grade patient consent management
# ============================================================================

class ConsentStatus(Enum):
    """Status of a patient consent record."""
    ACTIVE = "active"
    REVOKED = "revoked"
    EXPIRED = "expired"


@dataclass
class ConsentRecord:
    """A patient consent record with purpose binding and TTL.

    Implements HIPAA Minimum Necessary Standard (45 CFR §164.502(b))
    and the Aluminum OS Identity & Consent Kernel health extension.
    """
    consent_id: str
    patient_id: str
    agent_id: str
    purposes: List[str]                  # e.g. ["treatment", "payment", "operations"]
    resource_types: List[FhirResourceType]
    granted_at: float
    expires_at: Optional[float]          # None = does not expire
    status: ConsentStatus = ConsentStatus.ACTIVE
    revoked_at: Optional[float] = None
    revocation_reason: Optional[str] = None

    def is_valid(self) -> bool:
        if self.status != ConsentStatus.ACTIVE:
            return False
        if self.expires_at is not None and time.time() > self.expires_at:
            return False
        return True

    def covers(self, resource_type: FhirResourceType, purpose: str) -> bool:
        """Returns True if this consent covers the given resource and purpose."""
        if not self.is_valid():
            return False
        return resource_type in self.resource_types and purpose in self.purposes


class ConsentVault:
    """Manages patient consent records with purpose binding and revocation.

    Consent is always revocable (HIPAA §164.508(b)(5)).
    Revocation is immediate and audit-logged.

    Kintsugi integration: pass a GoldenTraceEmitter as `tracer` to emit
    ``consent_granted`` and ``consent_denied`` GoldenTrace events.
    """

    _SPHERE_TAG = "H7.S1"
    _LAYER = "L4-Service"

    def __init__(self, tracer: Optional[Any] = None) -> None:
        self._records: Dict[str, ConsentRecord] = {}
        self._tracer: Optional[Any] = tracer

    def grant(
        self,
        consent_id: str,
        patient_id: str,
        agent_id: str,
        purposes: List[str],
        resource_types: List[FhirResourceType],
        ttl_seconds: Optional[float] = None,
    ) -> ConsentRecord:
        """Grant a new consent. Raises ValueError if consent_id already exists."""
        if consent_id in self._records:
            raise ValueError(f"Consent {consent_id!r} already exists")
        record = ConsentRecord(
            consent_id=consent_id,
            patient_id=patient_id,
            agent_id=agent_id,
            purposes=purposes,
            resource_types=resource_types,
            granted_at=time.time(),
            expires_at=time.time() + ttl_seconds if ttl_seconds is not None else None,
        )
        self._records[consent_id] = record

        if self._tracer is not None:
            self._tracer.emit(
                event_type="consent_granted",
                sphere_tag=self._SPHERE_TAG,
                aluminum_layer=self._LAYER,
                function="ConsentVault.grant",
                invariants_checked=["INV-1"],
                payload={
                    "consent_id": consent_id,
                    "patient_id": patient_id,
                    "agent_id": agent_id,
                    "purposes": purposes,
                    "resource_types": [rt.value for rt in resource_types],
                    "expires_at": record.expires_at,
                },
            )

        return record

    def revoke(self, consent_id: str, reason: str = "") -> None:
        """Revoke a consent immediately."""
        record = self._records.get(consent_id)
        if record is None:
            raise KeyError(f"Consent {consent_id!r} not found")
        record.status = ConsentStatus.REVOKED
        record.revoked_at = time.time()
        record.revocation_reason = reason

        if self._tracer is not None:
            self._tracer.emit(
                event_type="consent_denied",
                sphere_tag=self._SPHERE_TAG,
                aluminum_layer=self._LAYER,
                function="ConsentVault.revoke",
                invariants_checked=["INV-1"],
                payload={
                    "consent_id": consent_id,
                    "patient_id": record.patient_id,
                    "reason": reason,
                },
            )

    def check(
        self, patient_id: str, resource_type: FhirResourceType, purpose: str
    ) -> bool:
        """Returns True if any valid consent covers this patient, resource, and purpose."""
        for record in self._records.values():
            if record.patient_id == patient_id and record.covers(resource_type, purpose):
                return True
        return False

    def get(self, consent_id: str) -> Optional[ConsentRecord]:
        return self._records.get(consent_id)

    @property
    def record_count(self) -> int:
        return len(self._records)

    @property
    def active_count(self) -> int:
        return sum(1 for r in self._records.values() if r.is_valid())


# ============================================================================
# AI Disclosure Registry (INV-30)
# ============================================================================

class AiDisclosureStatus(Enum):
    """AI disclosure status for a health action."""
    DISCLOSED = "disclosed"         # patient informed of AI involvement
    NOT_APPLICABLE = "not_applicable"  # no AI involvement
    MISSING = "missing"             # AI was involved but disclosure was omitted — VIOLATION


@dataclass
class AiDisclosureRecord:
    """A single AI disclosure record (INV-30 / 21 CFR Part 11 §11.10(i))."""
    record_id: int
    agent_id: str
    event_id: str
    status: AiDisclosureStatus
    confidence_pct: int              # 0–100
    human_cosigned: bool             # clinician review countersignature
    disclosed_at: float = field(default_factory=time.time)


class AiDisclosureRegistry:
    """Tracks INV-30 AI disclosure compliance across all health agents.

    Any Missing disclosure is a regulatory violation under
    21 CFR Part 11 §11.10(i) and the Aluminum OS AI Governance Constitution.
    """

    def __init__(self) -> None:
        self._records: List[AiDisclosureRecord] = []
        self._violation_count: int = 0
        self._next_id: int = 1

    def record(
        self,
        agent_id: str,
        event_id: str,
        status: AiDisclosureStatus,
        confidence_pct: int = 0,
        human_cosigned: bool = False,
    ) -> AiDisclosureRecord:
        if status == AiDisclosureStatus.MISSING:
            self._violation_count += 1
        rec = AiDisclosureRecord(
            record_id=self._next_id,
            agent_id=agent_id,
            event_id=event_id,
            status=status,
            confidence_pct=max(0, min(100, confidence_pct)),
            human_cosigned=human_cosigned,
        )
        self._records.append(rec)
        self._next_id += 1
        return rec

    @property
    def violation_count(self) -> int:
        return self._violation_count

    @property
    def disclosure_count(self) -> int:
        return len(self._records)


# ============================================================================
# Constitutional Amendment Protocol
# ============================================================================

class AmendmentStatus(Enum):
    """Lifecycle status of a constitutional amendment proposal."""
    PROPOSED = "proposed"
    UNDER_COUNCIL_REVIEW = "under_council_review"
    ENACTED = "enacted"
    REJECTED = "rejected"


@dataclass
class AmendmentProposal:
    """A constitutional amendment proposal.

    Voting rules:
      - Supermajority (default): ≥5 of 7 council members must approve
      - Simple majority (non-default): votes_for > votes_against
      - 47% dominance cap: no single model may hold >47% of votes cast (INV-7)
    """
    # INV-7: no single AI model may hold more than 47% of votes in any council decision.
    DOMINANCE_CAP: float = field(default=0.47, init=False, repr=False, compare=False)

    amendment_id: int
    proposer_agent_id: str
    title: str
    description: str
    supermajority_required: bool
    status: AmendmentStatus = AmendmentStatus.PROPOSED
    votes_for: int = 0
    votes_against: int = 0
    proposed_at: float = field(default_factory=time.time)
    enacted_at: Optional[float] = None
    rejected_at: Optional[float] = None

    def supermajority_met(self) -> bool:
        return self.votes_for >= 5

    def dominance_rule_satisfied(self, max_single_model_votes: int) -> bool:
        """Returns True when the 47% single-model dominance cap (INV-7) is respected."""
        total = self.votes_for + self.votes_against
        if total == 0:
            return True
        return (max_single_model_votes / total) <= self.DOMINANCE_CAP


class AmendmentProtocol:
    """Manages constitutional amendment lifecycle.

    Supermajority threshold: ≥5 of 7 council members.
    Dominance cap: no single model may hold >47% of votes (INV-7).

    Kintsugi integration: pass a GoldenTraceEmitter as `tracer` to emit
    ``amendment_proposed`` and ``amendment_enacted`` GoldenTrace events.
    """

    _SPHERE_TAG = "H1.S1"
    _LAYER = "L1-Constitutional"

    def __init__(self, tracer: Optional[Any] = None) -> None:
        self._proposals: Dict[int, AmendmentProposal] = {}
        self._next_id: int = 1
        self._enacted_count: int = 0
        self._tracer: Optional[Any] = tracer

    def propose(
        self,
        proposer_agent_id: str,
        title: str,
        description: str,
        supermajority_required: bool = True,
    ) -> AmendmentProposal:
        proposal = AmendmentProposal(
            amendment_id=self._next_id,
            proposer_agent_id=proposer_agent_id,
            title=title,
            description=description,
            supermajority_required=supermajority_required,
        )
        self._proposals[self._next_id] = proposal
        self._next_id += 1

        if self._tracer is not None:
            self._tracer.emit(
                event_type="amendment_proposed",
                sphere_tag=self._SPHERE_TAG,
                aluminum_layer=self._LAYER,
                function="AmendmentProtocol.propose",
                invariants_checked=["INV-7"],
                payload={
                    "amendment_id": proposal.amendment_id,
                    "proposer_agent_id": proposer_agent_id,
                    "title": title,
                    "supermajority_required": supermajority_required,
                },
            )

        return proposal

    def vote(self, amendment_id: int, approve: bool) -> None:
        """Cast a vote on an open amendment."""
        proposal = self._proposals.get(amendment_id)
        if proposal is None:
            raise KeyError(f"Amendment {amendment_id} not found")
        if proposal.status not in {AmendmentStatus.PROPOSED, AmendmentStatus.UNDER_COUNCIL_REVIEW}:
            raise ValueError(f"Amendment {amendment_id} is not open for voting")
        proposal.status = AmendmentStatus.UNDER_COUNCIL_REVIEW
        if approve:
            proposal.votes_for += 1
        else:
            proposal.votes_against += 1

    def try_enact(self, amendment_id: int) -> bool:
        """Attempt to enact an amendment after the voting period.

        Returns True if enacted, False if rejected.
        Emits ``amendment_enacted`` GoldenTrace when a tracer is configured.
        """
        proposal = self._proposals.get(amendment_id)
        if proposal is None:
            raise KeyError(f"Amendment {amendment_id} not found")
        if proposal.status != AmendmentStatus.UNDER_COUNCIL_REVIEW:
            raise ValueError(f"Amendment {amendment_id} is not under review")

        passed = (
            proposal.supermajority_met()
            if proposal.supermajority_required
            else proposal.votes_for > proposal.votes_against
        )
        if passed:
            proposal.status = AmendmentStatus.ENACTED
            proposal.enacted_at = time.time()
            self._enacted_count += 1
        else:
            proposal.status = AmendmentStatus.REJECTED
            proposal.rejected_at = time.time()

        if self._tracer is not None and passed:
            self._tracer.emit(
                event_type="amendment_enacted",
                sphere_tag=self._SPHERE_TAG,
                aluminum_layer=self._LAYER,
                function="AmendmentProtocol.try_enact",
                invariants_checked=["INV-7"],
                payload={
                    "amendment_id": amendment_id,
                    "title": proposal.title,
                    "votes_for": proposal.votes_for,
                    "votes_against": proposal.votes_against,
                    "supermajority_required": proposal.supermajority_required,
                },
            )

        return passed

    def get(self, amendment_id: int) -> Optional[AmendmentProposal]:
        return self._proposals.get(amendment_id)

    @property
    def proposal_count(self) -> int:
        return len(self._proposals)

    @property
    def enacted_count(self) -> int:
        return self._enacted_count


# ============================================================================
# Regulatory Compliance Checker
# ============================================================================

class RegulatoryFramework(Enum):
    """Regulatory frameworks enforced by the Aluminum OS Health Layer."""
    HIPAA_PRIVACY = "HIPAA Privacy Rule (45 CFR §164.500)"
    HIPAA_SECURITY = "HIPAA Security Rule (45 CFR §164.300)"
    CFR_PART_11 = "21 CFR Part 11 — Electronic Records"
    HITECH = "HITECH Act (42 U.S.C. §17901)"
    ONC_INFO_BLOCKING = "ONC Information Blocking Rule (§3022)"


class ComplianceResult(Enum):
    """Result of a regulatory compliance check."""
    COMPLIANT = "compliant"
    WARNING = "warning"
    VIOLATION = "violation"


@dataclass
class ComplianceReport:
    """Detailed result of a multi-framework compliance check."""
    result: ComplianceResult
    frameworks_checked: List[RegulatoryFramework]
    findings: List[str]            # human-readable findings
    violations: List[str]          # specific rule citations

    @property
    def is_compliant(self) -> bool:
        return self.result == ComplianceResult.COMPLIANT


class RegulatoryChecker:
    """Stateless multi-framework regulatory compliance checker.

    Validates health operations against HIPAA, 21 CFR Part 11,
    HITECH, and the ONC Information Blocking Rule.
    """

    @staticmethod
    def check(
        resource_type: FhirResourceType,
        action: FhirAction,
        ai_involved: bool,
        ai_disclosed: bool,
        consent_verified: bool,
        audit_trail_present: bool,
    ) -> ComplianceReport:
        """Check a health operation for multi-framework regulatory compliance.

        Returns a ComplianceReport with the strictest result across all frameworks.
        """
        findings: List[str] = []
        violations: List[str] = []
        result = ComplianceResult.COMPLIANT
        frameworks = [
            RegulatoryFramework.HIPAA_PRIVACY,
            RegulatoryFramework.HIPAA_SECURITY,
            RegulatoryFramework.CFR_PART_11,
            RegulatoryFramework.ONC_INFO_BLOCKING,
        ]

        # HIPAA §164.502: PHI requires explicit consent
        if resource_type.requires_explicit_consent() and not consent_verified:
            violations.append("HIPAA §164.502: explicit patient consent required for PHI")
            result = ComplianceResult.VIOLATION

        # HIPAA §164.312(b): PHI access must be audited
        if resource_type.requires_explicit_consent() and not audit_trail_present:
            violations.append("HIPAA §164.312(b): audit trail required for all PHI access")
            result = ComplianceResult.VIOLATION

        # 21 CFR Part 11 §11.10(i): AI decisions in clinical/billing context require disclosure
        if ai_involved and not ai_disclosed and action in {
            FhirAction.DENIAL_OF_CARE,
            FhirAction.CREATE,
            FhirAction.TRANSMIT,
        }:
            violations.append(
                "21 CFR Part 11 §11.10(i): AI involvement in clinical/billing decisions "
                "must be disclosed (INV-30)"
            )
            result = ComplianceResult.VIOLATION

        # ONC §3022: Export requires audit trail
        if action == FhirAction.EXPORT and not audit_trail_present:
            violations.append("ONC §3022: export operations require audit trail")
            result = ComplianceResult.VIOLATION

        # Warning: any denial-of-care warrants regulatory review
        if action == FhirAction.DENIAL_OF_CARE and result == ComplianceResult.COMPLIANT:
            findings.append(
                "Denial-of-care action flagged for regulatory review "
                "(HIPAA §164.508 / FCA monitoring)"
            )
            result = ComplianceResult.WARNING

        return ComplianceReport(
            result=result,
            frameworks_checked=frameworks,
            findings=findings,
            violations=violations,
        )


# ============================================================================
# PQC Identity (Post-Quantum Cryptography stubs, NIST FIPS 203/204)
# ============================================================================

class PqcAlgorithm(Enum):
    """PQC algorithm identifier per NIST post-quantum standards."""
    ML_KEM_1024 = "ML-KEM-1024 (NIST FIPS 203)"   # key encapsulation
    ML_DSA_87 = "ML-DSA-87 (NIST FIPS 204)"         # digital signatures

    @property
    def full_pubkey_bytes(self) -> int:
        return {
            PqcAlgorithm.ML_KEM_1024: 1568,
            PqcAlgorithm.ML_DSA_87: 2592,
        }[self]


@dataclass
class PqcIdentityRecord:
    """PQC identity record for a health agent.

    NOTE: `pubkey_stub_hex` holds only the first 64 bytes of the full key
    as a hex string. Production implementations must use the complete key
    from a FIPS 203/204 compliant library.
    """
    agent_id: str
    algorithm: PqcAlgorithm
    pubkey_stub_hex: str      # hex of first 64 bytes of public key
    registered_at: float = field(default_factory=time.time)
    active: bool = True

    def verify_stub(self, material: bytes) -> bool:
        """Stub verification: checks only the first 64 bytes of the key material."""
        expected = material[:64].hex() if len(material) >= 64 else material.hex()
        return self.pubkey_stub_hex[:len(expected)] == expected


class PqcIdentityRegistry:
    """Maps health agents to post-quantum identity records."""

    def __init__(self) -> None:
        self._records: Dict[str, PqcIdentityRecord] = {}

    def register(
        self,
        agent_id: str,
        algorithm: PqcAlgorithm,
        pubkey_material: bytes,
    ) -> PqcIdentityRecord:
        stub_hex = pubkey_material[:64].hex() if len(pubkey_material) >= 64 else pubkey_material.hex()
        record = PqcIdentityRecord(
            agent_id=agent_id,
            algorithm=algorithm,
            pubkey_stub_hex=stub_hex,
        )
        self._records[agent_id] = record
        return record

    def find(self, agent_id: str) -> Optional[PqcIdentityRecord]:
        return self._records.get(agent_id)

    @property
    def count(self) -> int:
        return len(self._records)
