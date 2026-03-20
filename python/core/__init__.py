# Aluminum OS — Ring 1 (Manus Core + Health Layer)
# Zero external dependencies — vanilla Python 3
# Components: ModelRouter, CostTracker, MemoryStore, TaskDecomposer, SessionVault,
#             + FhirEvent, HealthAuditLedger, ConsentVault, AiDisclosureRegistry,
#               AmendmentProtocol, RegulatoryChecker, PqcIdentityRegistry

from .manus_core import (
    ModelRouter,
    CostTracker,
    MemoryStore,
    TaskDecomposer,
    SessionVault,
)

from .health_layer import (
    FhirResourceType,
    FhirAction,
    FhirEvent,
    HealthAuditSeverity,
    HealthAuditEntry,
    HealthAuditLedger,
    ConsentError,
    ConsentStatus,
    ConsentRecord,
    ConsentVault,
    AiDisclosureStatus,
    AiDisclosureRecord,
    AiDisclosureRegistry,
    AmendmentStatus,
    AmendmentProposal,
    AmendmentProtocol,
    RegulatoryFramework,
    ComplianceResult,
    ComplianceReport,
    RegulatoryChecker,
    PqcAlgorithm,
    PqcIdentityRecord,
    PqcIdentityRegistry,
)

__version__ = "2.0.0"
__all__ = [
    # Manus Core (Ring 1 middleware)
    "ModelRouter", "CostTracker", "MemoryStore", "TaskDecomposer", "SessionVault",
    # Health Layer (Ring 1 healthcare extensions)
    "FhirResourceType", "FhirAction", "FhirEvent",
    "HealthAuditSeverity", "HealthAuditEntry", "HealthAuditLedger",
    "ConsentError", "ConsentStatus", "ConsentRecord", "ConsentVault",
    "AiDisclosureStatus", "AiDisclosureRecord", "AiDisclosureRegistry",
    "AmendmentStatus", "AmendmentProposal", "AmendmentProtocol",
    "RegulatoryFramework", "ComplianceResult", "ComplianceReport", "RegulatoryChecker",
    "PqcAlgorithm", "PqcIdentityRecord", "PqcIdentityRegistry",
]
