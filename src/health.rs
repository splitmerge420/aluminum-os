//! Aluminum OS Health Layer — Constitutional Healthcare Kernel (v2.0)
//!
//! Extends the core governance kernel with:
//!   - FHIR R4/R5 event types (typed enum, no heap)
//!   - Health-grade audit ledger (append-only, no-delete mandate)
//!   - PQC identity stubs (ML-KEM-1024 / ML-DSA-87 slots, NIST FIPS 203/204)
//!   - Constitutional amendment protocol (supermajority + 47% dominance cap)
//!   - AI disclosure registry (INV-30 compliance)
//!   - Regulatory compliance checker (HIPAA §164, 21 CFR Part 11, ONC §3022)
//!
//! Atlas Lattice Foundation — March 2026
//! DISCLAIMER: Reference architecture only. Not certified for clinical use.
//! Requires independent legal review before handling real PHI.

use crate::{AluminumError, FixedStr};

// ============================================================================
// Constants
// ============================================================================

/// Maximum health audit entries before flush is required
pub const MAX_AUDIT_ENTRIES: usize = 256;
/// Maximum concurrent amendment proposals
pub const MAX_AMENDMENTS: usize = 32;
/// Maximum AI disclosure records
pub const MAX_DISCLOSURES: usize = 64;
/// Fixed PQC public-key stub length stored in memory (first 64 bytes of a real
/// ML-KEM-1024 or ML-DSA-87 key; full keys are 1568 / 2592 bytes respectively).
pub const PQC_KEY_STUB_BYTES: usize = 64;

// ============================================================================
// FHIR R4/R5 Resource Types
// ============================================================================

/// FHIR R4/R5 resource types supported by the Aluminum OS Health Layer.
///
/// Each variant maps to a constitutional consent requirement and audit class.
/// See HL7 FHIR R5 §3.1 for authoritative resource definitions.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum FhirResourceType {
    Patient,
    Observation,           // vitals, labs
    Condition,             // diagnoses
    MedicationRequest,
    Claim,
    ExplanationOfBenefit,
    DiagnosticReport,
    Encounter,
    Procedure,
    AllergyIntolerance,
    CarePlan,
    Consent,
    AuditEvent,
    Practitioner,
    Organization,
}

impl FhirResourceType {
    /// Returns true if this resource type contains PHI requiring explicit consent
    /// under HIPAA Privacy Rule (45 CFR §164.502).
    pub fn requires_explicit_consent(&self) -> bool {
        matches!(
            self,
            Self::Patient
                | Self::Condition
                | Self::MedicationRequest
                | Self::DiagnosticReport
                | Self::Procedure
                | Self::AllergyIntolerance
                | Self::CarePlan
        )
    }

    /// Returns true if this is a financial/billing resource (triggers fraud-detection audit)
    pub fn is_financial(&self) -> bool {
        matches!(self, Self::Claim | Self::ExplanationOfBenefit)
    }

    /// FHIR resource type name as a static string
    pub fn name(&self) -> &'static str {
        match self {
            Self::Patient => "Patient",
            Self::Observation => "Observation",
            Self::Condition => "Condition",
            Self::MedicationRequest => "MedicationRequest",
            Self::Claim => "Claim",
            Self::ExplanationOfBenefit => "ExplanationOfBenefit",
            Self::DiagnosticReport => "DiagnosticReport",
            Self::Encounter => "Encounter",
            Self::Procedure => "Procedure",
            Self::AllergyIntolerance => "AllergyIntolerance",
            Self::CarePlan => "CarePlan",
            Self::Consent => "Consent",
            Self::AuditEvent => "AuditEvent",
            Self::Practitioner => "Practitioner",
            Self::Organization => "Organization",
        }
    }
}

// ============================================================================
// Health Audit Ledger (append-only, no-delete mandate)
// ============================================================================

/// Severity classification for a health audit event
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum HealthAuditSeverity {
    Info = 0,
    Warning = 1,
    Critical = 2,
    /// Regulatory-level — triggers mandatory external reporting
    Regulatory = 3,
}

/// Actions that can be taken on FHIR health resources
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum HealthAction {
    Read,
    Create,
    Update,
    Search,
    Export,
    Transmit,
    /// AI-assisted denial of care — triggers automatic fraud-detection audit path
    DenialOfCare,
}

impl HealthAction {
    pub fn name(&self) -> &'static str {
        match self {
            Self::Read => "read",
            Self::Create => "create",
            Self::Update => "update",
            Self::Search => "search",
            Self::Export => "export",
            Self::Transmit => "transmit",
            Self::DenialOfCare => "denial_of_care",
        }
    }
}

/// A single health audit log entry.
///
/// Structure aligns with HIPAA §164.312(b) audit controls and the
/// IHE ATNA (Audit Trail and Node Authentication) profile.
#[derive(Debug, Clone, Copy)]
pub struct HealthAuditEntry {
    pub seq: u64,
    pub agent_id: u32,
    pub resource_type: FhirResourceType,
    pub action: HealthAction,
    pub severity: HealthAuditSeverity,
    /// INV-30: was AI involvement disclosed to the patient/user?
    pub ai_disclosed: bool,
    /// Was explicit patient consent verified before this action?
    pub consent_verified: bool,
    /// PQC signature stub — first 8 bytes of the ML-DSA-87 signature over this entry.
    /// Full implementation uses the PqcIdentityRegistry to produce a real signature.
    pub pqc_sig_stub: [u8; 8],
}

/// Health-grade audit ledger — append-only, no-delete mandate.
///
/// Implements the audit control requirements from:
///   - HIPAA Security Rule §164.312(b)
///   - HITECH Act §13402 (breach notification)
///   - 21 CFR Part 11 §11.10(e) (audit trails)
///
/// Every health action MUST produce an entry before execution (fail closed).
pub struct HealthAuditLedger {
    entries: [HealthAuditEntry; MAX_AUDIT_ENTRIES],
    count: usize,
    next_seq: u64,
    /// Cumulative denial-of-care count — regulatory review triggered at ≥3
    denial_count: u32,
}

impl HealthAuditLedger {
    pub fn new() -> Self {
        Self {
            entries: [HealthAuditEntry {
                seq: 0,
                agent_id: 0,
                resource_type: FhirResourceType::AuditEvent,
                action: HealthAction::Read,
                severity: HealthAuditSeverity::Info,
                ai_disclosed: false,
                consent_verified: false,
                pqc_sig_stub: [0u8; 8],
            }; MAX_AUDIT_ENTRIES],
            count: 0,
            next_seq: 1,
            denial_count: 0,
        }
    }

    /// Append a health audit entry.
    ///
    /// Returns the sequence number on success.
    /// Returns `ConstitutionalViolation` if PHI is accessed without verified consent.
    /// Returns `IntentQueueFull` if the ledger is full (flush to long-term storage).
    pub fn append(
        &mut self,
        agent_id: u32,
        resource_type: FhirResourceType,
        action: HealthAction,
        severity: HealthAuditSeverity,
        ai_disclosed: bool,
        consent_verified: bool,
    ) -> Result<u64, AluminumError> {
        if self.count >= MAX_AUDIT_ENTRIES {
            return Err(AluminumError::IntentQueueFull);
        }

        // PHI resources require explicit consent (HIPAA §164.502)
        if resource_type.requires_explicit_consent() && !consent_verified {
            return Err(AluminumError::ConstitutionalViolation);
        }

        let seq = self.next_seq;
        if action == HealthAction::DenialOfCare {
            self.denial_count += 1;
        }

        // Stub PQC signature: real impl signs this entry with ML-DSA-87
        let pqc_sig_stub = {
            let mut s = [0u8; 8];
            s[0] = (seq & 0xFF) as u8;
            s[1] = ((seq >> 8) & 0xFF) as u8;
            s[2] = agent_id as u8;
            s[3] = if ai_disclosed { 0xAD } else { 0x00 };
            s
        };

        self.entries[self.count] = HealthAuditEntry {
            seq,
            agent_id,
            resource_type,
            action,
            severity,
            ai_disclosed,
            consent_verified,
            pqc_sig_stub,
        };
        self.count += 1;
        self.next_seq += 1;
        Ok(seq)
    }

    pub fn entry_count(&self) -> usize {
        self.count
    }

    pub fn denial_count(&self) -> u32 {
        self.denial_count
    }

    /// Returns true when denial-of-care count reaches the regulatory review threshold (≥3).
    /// At this threshold the ledger should be exported to the regulatory compliance pipeline.
    pub fn denial_threshold_exceeded(&self) -> bool {
        self.denial_count >= 3
    }

    /// Retrieve an entry by its zero-based index (read-only).
    pub fn get(&self, idx: usize) -> Option<&HealthAuditEntry> {
        if idx < self.count {
            Some(&self.entries[idx])
        } else {
            None
        }
    }
}

// ============================================================================
// PQC Identity (Post-Quantum Cryptography, NIST FIPS 203/204)
// ============================================================================

/// PQC algorithm identifier per NIST post-quantum standards.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PqcAlgorithm {
    /// NIST FIPS 203: ML-KEM-1024 — key encapsulation, 256-bit security level
    MlKem1024,
    /// NIST FIPS 204: ML-DSA-87 — digital signatures, 256-bit security level
    MlDsa87,
}

impl PqcAlgorithm {
    pub fn name(&self) -> &'static str {
        match self {
            Self::MlKem1024 => "ML-KEM-1024 (NIST FIPS 203)",
            Self::MlDsa87 => "ML-DSA-87 (NIST FIPS 204)",
        }
    }

    /// Nominal public key size in bytes for the full implementation
    pub fn full_pubkey_bytes(&self) -> usize {
        match self {
            Self::MlKem1024 => 1568,
            Self::MlDsa87 => 2592,
        }
    }
}

/// PQC identity slot — associates an agent with a post-quantum public key.
///
/// NOTE: `pubkey_stub` holds only the first `PQC_KEY_STUB_BYTES` bytes of
/// the full key. Production implementations must use the complete key material
/// from a FIPS 203/204 compliant library (e.g., `ml-kem` / `ml-dsa` crates).
#[derive(Debug, Clone, Copy)]
pub struct PqcIdentitySlot {
    pub agent_id: u32,
    pub algorithm: PqcAlgorithm,
    /// First 64 bytes of the public key (stub; full key stored out-of-band)
    pub pubkey_stub: [u8; PQC_KEY_STUB_BYTES],
    pub active: bool,
}

/// PQC identity registry — maps agents to post-quantum key material.
pub struct PqcIdentityRegistry {
    slots: [PqcIdentitySlot; 32],
    count: usize,
}

impl PqcIdentityRegistry {
    pub fn new() -> Self {
        Self {
            slots: [PqcIdentitySlot {
                agent_id: 0,
                algorithm: PqcAlgorithm::MlDsa87,
                pubkey_stub: [0u8; PQC_KEY_STUB_BYTES],
                active: false,
            }; 32],
            count: 0,
        }
    }

    /// Register a PQC identity slot for an agent.
    /// `pubkey_material` should be the first `PQC_KEY_STUB_BYTES` bytes of the full key.
    pub fn register(
        &mut self,
        agent_id: u32,
        algorithm: PqcAlgorithm,
        pubkey_material: &[u8],
    ) -> Result<usize, AluminumError> {
        if self.count >= 32 {
            return Err(AluminumError::AgentRegistryFull);
        }
        let mut stub = [0u8; PQC_KEY_STUB_BYTES];
        let copy_len = pubkey_material.len().min(PQC_KEY_STUB_BYTES);
        stub[..copy_len].copy_from_slice(&pubkey_material[..copy_len]);
        self.slots[self.count] = PqcIdentitySlot {
            agent_id,
            algorithm,
            pubkey_stub: stub,
            active: true,
        };
        let idx = self.count;
        self.count += 1;
        Ok(idx)
    }

    pub fn find(&self, agent_id: u32) -> Option<&PqcIdentitySlot> {
        for i in 0..self.count {
            if self.slots[i].agent_id == agent_id && self.slots[i].active {
                return Some(&self.slots[i]);
            }
        }
        None
    }

    pub fn count(&self) -> usize {
        self.count
    }
}

// ============================================================================
// AI Disclosure Registry (INV-30)
// ============================================================================

/// AI disclosure status for a health action (INV-30 compliance)
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AiDisclosureStatus {
    /// Patient/user was informed that AI contributed to this decision
    Disclosed,
    /// AI was not involved — no disclosure needed
    NotApplicable,
    /// AI was involved but disclosure was omitted — regulatory VIOLATION
    Missing,
}

/// A single AI disclosure record (INV-30 / 21 CFR Part 11 §11.10(i))
#[derive(Debug, Clone, Copy)]
pub struct AiDisclosureRecord {
    pub id: u32,
    pub agent_id: u32,
    pub status: AiDisclosureStatus,
    /// AI confidence score disclosed to the patient (0–100%)
    pub confidence_pct: u8,
    /// Whether a human clinician reviewed and countersigned the AI decision
    pub human_cosigned: bool,
}

/// AI disclosure registry — tracks INV-30 compliance across all health agents.
pub struct AiDisclosureRegistry {
    records: [AiDisclosureRecord; MAX_DISCLOSURES],
    count: usize,
    next_id: u32,
    violation_count: u32,
}

impl AiDisclosureRegistry {
    pub fn new() -> Self {
        Self {
            records: [AiDisclosureRecord {
                id: 0,
                agent_id: 0,
                status: AiDisclosureStatus::NotApplicable,
                confidence_pct: 0,
                human_cosigned: false,
            }; MAX_DISCLOSURES],
            count: 0,
            next_id: 1,
            violation_count: 0,
        }
    }

    pub fn record(
        &mut self,
        agent_id: u32,
        status: AiDisclosureStatus,
        confidence_pct: u8,
        human_cosigned: bool,
    ) -> Result<u32, AluminumError> {
        if self.count >= MAX_DISCLOSURES {
            return Err(AluminumError::RuleRegistryFull);
        }
        if status == AiDisclosureStatus::Missing {
            self.violation_count += 1;
        }
        let id = self.next_id;
        self.records[self.count] = AiDisclosureRecord {
            id,
            agent_id,
            status,
            confidence_pct,
            human_cosigned,
        };
        self.count += 1;
        self.next_id += 1;
        Ok(id)
    }

    pub fn violation_count(&self) -> u32 {
        self.violation_count
    }

    pub fn disclosure_count(&self) -> usize {
        self.count
    }
}

// ============================================================================
// Constitutional Amendment Protocol
// ============================================================================

/// Lifecycle status of a constitutional amendment proposal
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AmendmentStatus {
    Proposed,
    UnderCouncilReview,
    /// Approved with supermajority (≥5 of 7 council members)
    Approved,
    /// Rejected or superseded
    Rejected,
    /// Enacted — now part of the living constitution
    Enacted,
}

/// A constitutional amendment proposal
#[derive(Debug, Clone, Copy)]
pub struct Amendment {
    pub id: u32,
    pub proposer_agent_id: u32,
    pub status: AmendmentStatus,
    pub title: FixedStr,
    /// Council votes in favour (max 7 council members)
    pub votes_for: u8,
    /// Council votes against
    pub votes_against: u8,
    /// Whether this amendment requires a supermajority (≥5/7) to pass
    pub supermajority_required: bool,
}

impl Amendment {
    /// Returns true when the supermajority threshold (≥5 of 7) is met
    pub fn supermajority_met(&self) -> bool {
        self.votes_for >= 5
    }

    /// Returns true when the 47% single-model dominance cap is respected.
    ///
    /// With 7 council members, one model may hold at most 3 votes (≈42.8%).
    pub fn dominance_rule_satisfied(&self, max_single_model_votes: u8) -> bool {
        let total = self.votes_for + self.votes_against;
        if total == 0 {
            return true;
        }
        // Cast to avoid floating point in no_std — multiply to stay integer
        // pct <= 47/100  ⟺  100 * max <= 47 * total
        (100 * max_single_model_votes as u32) <= (47 * total as u32)
    }
}

/// Constitutional amendment protocol — manages proposals, voting, and enactment.
pub struct AmendmentProtocol {
    amendments: [Amendment; MAX_AMENDMENTS],
    count: usize,
    next_id: u32,
    enacted_count: u32,
}

impl AmendmentProtocol {
    pub fn new() -> Self {
        Self {
            amendments: [Amendment {
                id: 0,
                proposer_agent_id: 0,
                status: AmendmentStatus::Proposed,
                title: FixedStr::empty(),
                votes_for: 0,
                votes_against: 0,
                supermajority_required: true,
            }; MAX_AMENDMENTS],
            count: 0,
            next_id: 1,
            enacted_count: 0,
        }
    }

    /// Propose a new constitutional amendment.
    pub fn propose(
        &mut self,
        proposer_agent_id: u32,
        title: &[u8],
        supermajority_required: bool,
    ) -> Result<u32, AluminumError> {
        if self.count >= MAX_AMENDMENTS {
            return Err(AluminumError::RuleRegistryFull);
        }
        let id = self.next_id;
        self.amendments[self.count] = Amendment {
            id,
            proposer_agent_id,
            status: AmendmentStatus::Proposed,
            title: FixedStr::from_bytes(title),
            votes_for: 0,
            votes_against: 0,
            supermajority_required,
        };
        self.count += 1;
        self.next_id += 1;
        Ok(id)
    }

    /// Cast a vote on an amendment (approve or reject).
    pub fn vote(&mut self, amendment_id: u32, approve: bool) -> Result<(), AluminumError> {
        for i in 0..self.count {
            if self.amendments[i].id == amendment_id {
                match self.amendments[i].status {
                    AmendmentStatus::Proposed | AmendmentStatus::UnderCouncilReview => {
                        self.amendments[i].status = AmendmentStatus::UnderCouncilReview;
                        if approve {
                            self.amendments[i].votes_for += 1;
                        } else {
                            self.amendments[i].votes_against += 1;
                        }
                        return Ok(());
                    }
                    _ => return Err(AluminumError::InvalidInput),
                }
            }
        }
        Err(AluminumError::AgentNotFound)
    }

    /// Attempt to enact an amendment after the voting period.
    ///
    /// Returns `Ok(true)` if enacted, `Ok(false)` if rejected.
    pub fn try_enact(&mut self, amendment_id: u32) -> Result<bool, AluminumError> {
        for i in 0..self.count {
            if self.amendments[i].id == amendment_id {
                if self.amendments[i].status != AmendmentStatus::UnderCouncilReview {
                    return Err(AluminumError::InvalidInput);
                }
                let amendment = &mut self.amendments[i];
                let passed = if amendment.supermajority_required {
                    amendment.supermajority_met()
                } else {
                    amendment.votes_for > amendment.votes_against
                };
                if passed {
                    amendment.status = AmendmentStatus::Enacted;
                    self.enacted_count += 1;
                } else {
                    amendment.status = AmendmentStatus::Rejected;
                }
                return Ok(passed);
            }
        }
        Err(AluminumError::AgentNotFound)
    }

    pub fn amendment_count(&self) -> usize {
        self.count
    }

    pub fn enacted_count(&self) -> u32 {
        self.enacted_count
    }

    pub fn find(&self, amendment_id: u32) -> Option<&Amendment> {
        for i in 0..self.count {
            if self.amendments[i].id == amendment_id {
                return Some(&self.amendments[i]);
            }
        }
        None
    }
}

// ============================================================================
// Regulatory Compliance Checker
// ============================================================================

/// Regulatory frameworks enforced by the Aluminum OS Health Layer
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RegulatoryFramework {
    /// HIPAA Privacy Rule (45 CFR §164.500–.534)
    HipaaPrivacy,
    /// HIPAA Security Rule (45 CFR §164.300–.318)
    HipaaSecurity,
    /// 21 CFR Part 11 — Electronic Records & Electronic Signatures
    CfrPart11,
    /// HITECH Act — Health Information Technology for Economic and Clinical Health
    Hitech,
    /// ONC Information Blocking Rule (21st Century Cures Act §3022)
    OncInfoBlocking,
}

impl RegulatoryFramework {
    pub fn name(&self) -> &'static str {
        match self {
            Self::HipaaPrivacy => "HIPAA Privacy Rule (45 CFR §164.500)",
            Self::HipaaSecurity => "HIPAA Security Rule (45 CFR §164.300)",
            Self::CfrPart11 => "21 CFR Part 11 — Electronic Records",
            Self::Hitech => "HITECH Act (42 U.S.C. §17901)",
            Self::OncInfoBlocking => "ONC Information Blocking Rule (§3022)",
        }
    }
}

/// Result of a regulatory compliance check
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ComplianceResult {
    Compliant,
    Warning,
    Violation,
}

/// Regulatory compliance checker.
///
/// Stateless — all checks are pure functions of the operation parameters.
/// Returns the strictest result across all applicable frameworks.
pub struct RegulatoryComplianceChecker;

impl RegulatoryComplianceChecker {
    /// Check a health operation for multi-framework regulatory compliance.
    ///
    /// # Arguments
    /// - `resource_type` — FHIR resource type being acted upon
    /// - `action` — action being performed
    /// - `ai_disclosed` — whether AI involvement was disclosed (INV-30)
    /// - `consent_verified` — whether explicit patient consent was verified
    /// - `audit_trail_present` — whether an audit trail entry will be emitted
    pub fn check(
        resource_type: FhirResourceType,
        action: HealthAction,
        ai_disclosed: bool,
        consent_verified: bool,
        audit_trail_present: bool,
    ) -> ComplianceResult {
        // HIPAA §164.502: PHI requires consent
        if resource_type.requires_explicit_consent() && !consent_verified {
            return ComplianceResult::Violation;
        }

        // HIPAA §164.312(b): All PHI access must be audited
        if resource_type.requires_explicit_consent() && !audit_trail_present {
            return ComplianceResult::Violation;
        }

        // 21 CFR Part 11 §11.10(i): AI decisions in clinical/billing context require disclosure
        if matches!(
            action,
            HealthAction::DenialOfCare | HealthAction::Create | HealthAction::Transmit
        ) && !ai_disclosed
        {
            return ComplianceResult::Violation;
        }

        // ONC §3022: Export operations require audit trail
        if action == HealthAction::Export && !audit_trail_present {
            return ComplianceResult::Violation;
        }

        // Warning: any denial-of-care always warrants review
        if action == HealthAction::DenialOfCare {
            return ComplianceResult::Warning;
        }

        ComplianceResult::Compliant
    }
}

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // --- FHIR resource types ---

    #[test]
    fn test_fhir_consent_requirements() {
        assert!(FhirResourceType::Patient.requires_explicit_consent());
        assert!(FhirResourceType::Condition.requires_explicit_consent());
        assert!(FhirResourceType::MedicationRequest.requires_explicit_consent());
        assert!(!FhirResourceType::Practitioner.requires_explicit_consent());
        assert!(!FhirResourceType::Organization.requires_explicit_consent());
        assert!(!FhirResourceType::Encounter.requires_explicit_consent());
    }

    #[test]
    fn test_fhir_financial_resources() {
        assert!(FhirResourceType::Claim.is_financial());
        assert!(FhirResourceType::ExplanationOfBenefit.is_financial());
        assert!(!FhirResourceType::Patient.is_financial());
        assert!(!FhirResourceType::Observation.is_financial());
    }

    #[test]
    fn test_fhir_resource_names() {
        assert_eq!(FhirResourceType::Patient.name(), "Patient");
        assert_eq!(FhirResourceType::DiagnosticReport.name(), "DiagnosticReport");
    }

    // --- Health Audit Ledger ---

    #[test]
    fn test_audit_ledger_append_non_phi() {
        let mut ledger = HealthAuditLedger::new();
        // Observation does not require consent
        let seq = ledger
            .append(1, FhirResourceType::Observation, HealthAction::Read,
                    HealthAuditSeverity::Info, true, false)
            .unwrap();
        assert_eq!(seq, 1);
        assert_eq!(ledger.entry_count(), 1);
    }

    #[test]
    fn test_audit_ledger_phi_requires_consent() {
        let mut ledger = HealthAuditLedger::new();
        // Patient is PHI — requires consent_verified=true
        let err = ledger
            .append(1, FhirResourceType::Patient, HealthAction::Read,
                    HealthAuditSeverity::Info, true, false)
            .unwrap_err();
        assert_eq!(err, AluminumError::ConstitutionalViolation);
    }

    #[test]
    fn test_audit_ledger_phi_with_consent_succeeds() {
        let mut ledger = HealthAuditLedger::new();
        let seq = ledger
            .append(1, FhirResourceType::Patient, HealthAction::Read,
                    HealthAuditSeverity::Info, true, true)
            .unwrap();
        assert_eq!(seq, 1);
    }

    #[test]
    fn test_audit_ledger_denial_tracking() {
        let mut ledger = HealthAuditLedger::new();
        // AuditEvent does not require consent
        for _ in 0..3 {
            ledger.append(1, FhirResourceType::AuditEvent, HealthAction::DenialOfCare,
                          HealthAuditSeverity::Regulatory, true, false).unwrap();
        }
        assert_eq!(ledger.denial_count(), 3);
        assert!(ledger.denial_threshold_exceeded());
    }

    #[test]
    fn test_audit_ledger_get_entry() {
        let mut ledger = HealthAuditLedger::new();
        ledger.append(7, FhirResourceType::Encounter, HealthAction::Search,
                      HealthAuditSeverity::Info, true, false).unwrap();
        let entry = ledger.get(0).unwrap();
        assert_eq!(entry.agent_id, 7);
        assert_eq!(entry.action, HealthAction::Search);
        assert!(ledger.get(1).is_none());
    }

    // --- PQC Identity ---

    #[test]
    fn test_pqc_identity_register_and_find() {
        let mut registry = PqcIdentityRegistry::new();
        let pubkey = [0xABu8; 64];
        let idx = registry.register(1, PqcAlgorithm::MlDsa87, &pubkey).unwrap();
        assert_eq!(idx, 0);
        assert_eq!(registry.count(), 1);
        let slot = registry.find(1).unwrap();
        assert_eq!(slot.algorithm, PqcAlgorithm::MlDsa87);
        assert_eq!(slot.pubkey_stub[0], 0xAB);
    }

    #[test]
    fn test_pqc_algorithm_names() {
        assert!(PqcAlgorithm::MlKem1024.name().contains("ML-KEM-1024"));
        assert!(PqcAlgorithm::MlDsa87.name().contains("ML-DSA-87"));
    }

    #[test]
    fn test_pqc_full_key_sizes() {
        assert_eq!(PqcAlgorithm::MlKem1024.full_pubkey_bytes(), 1568);
        assert_eq!(PqcAlgorithm::MlDsa87.full_pubkey_bytes(), 2592);
    }

    // --- AI Disclosure Registry ---

    #[test]
    fn test_ai_disclosure_disclosed_no_violation() {
        let mut reg = AiDisclosureRegistry::new();
        reg.record(1, AiDisclosureStatus::Disclosed, 87, true).unwrap();
        assert_eq!(reg.violation_count(), 0);
        assert_eq!(reg.disclosure_count(), 1);
    }

    #[test]
    fn test_ai_disclosure_missing_counts_as_violation() {
        let mut reg = AiDisclosureRegistry::new();
        reg.record(2, AiDisclosureStatus::Missing, 0, false).unwrap();
        assert_eq!(reg.violation_count(), 1);
    }

    #[test]
    fn test_ai_disclosure_not_applicable_no_violation() {
        let mut reg = AiDisclosureRegistry::new();
        reg.record(3, AiDisclosureStatus::NotApplicable, 0, false).unwrap();
        assert_eq!(reg.violation_count(), 0);
    }

    // --- Amendment Protocol ---

    #[test]
    fn test_amendment_enact_with_supermajority() {
        let mut protocol = AmendmentProtocol::new();
        let id = protocol.propose(1, b"health-ai-disclosure-mandate", true).unwrap();
        for _ in 0..5 {
            protocol.vote(id, true).unwrap();
        }
        protocol.vote(id, false).unwrap();
        protocol.vote(id, false).unwrap();
        let enacted = protocol.try_enact(id).unwrap();
        assert!(enacted);
        assert_eq!(protocol.enacted_count(), 1);
    }

    #[test]
    fn test_amendment_reject_without_supermajority() {
        let mut protocol = AmendmentProtocol::new();
        let id = protocol.propose(1, b"risky-rule-change", true).unwrap();
        for _ in 0..4 {
            protocol.vote(id, true).unwrap();
        }
        for _ in 0..3 {
            protocol.vote(id, false).unwrap();
        }
        let enacted = protocol.try_enact(id).unwrap();
        assert!(!enacted);
        assert_eq!(protocol.enacted_count(), 0);
    }

    #[test]
    fn test_amendment_simple_majority() {
        let mut protocol = AmendmentProtocol::new();
        let id = protocol.propose(1, b"minor-clarification", false).unwrap();
        protocol.vote(id, true).unwrap();
        protocol.vote(id, true).unwrap();
        protocol.vote(id, false).unwrap();
        let enacted = protocol.try_enact(id).unwrap();
        assert!(enacted);
    }

    #[test]
    fn test_dominance_rule_satisfied() {
        let a = Amendment {
            id: 1, proposer_agent_id: 1,
            status: AmendmentStatus::UnderCouncilReview,
            title: FixedStr::from_bytes(b"test"),
            votes_for: 5, votes_against: 2,
            supermajority_required: true,
        };
        // 3 votes out of 7 = 42.8% — within 47% cap
        assert!(a.dominance_rule_satisfied(3));
        // 4 votes out of 7 = 57.1% — exceeds 47% cap
        assert!(!a.dominance_rule_satisfied(4));
    }

    #[test]
    fn test_amendment_not_found() {
        let mut protocol = AmendmentProtocol::new();
        assert_eq!(protocol.vote(999, true).unwrap_err(), AluminumError::AgentNotFound);
        assert_eq!(protocol.try_enact(999).unwrap_err(), AluminumError::AgentNotFound);
    }

    // --- Regulatory Compliance Checker ---

    #[test]
    fn test_compliance_phi_without_consent_is_violation() {
        let result = RegulatoryComplianceChecker::check(
            FhirResourceType::Patient, HealthAction::Read,
            true, false, true,
        );
        assert_eq!(result, ComplianceResult::Violation);
    }

    #[test]
    fn test_compliance_phi_without_audit_is_violation() {
        let result = RegulatoryComplianceChecker::check(
            FhirResourceType::Patient, HealthAction::Read,
            true, true, false,
        );
        assert_eq!(result, ComplianceResult::Violation);
    }

    #[test]
    fn test_compliance_ai_denial_without_disclosure_is_violation() {
        let result = RegulatoryComplianceChecker::check(
            FhirResourceType::Claim, HealthAction::DenialOfCare,
            false, false, true,
        );
        assert_eq!(result, ComplianceResult::Violation);
    }

    #[test]
    fn test_compliance_ai_denial_with_disclosure_is_warning() {
        let result = RegulatoryComplianceChecker::check(
            FhirResourceType::Claim, HealthAction::DenialOfCare,
            true, false, true,
        );
        assert_eq!(result, ComplianceResult::Warning);
    }

    #[test]
    fn test_compliance_observation_read_is_compliant() {
        let result = RegulatoryComplianceChecker::check(
            FhirResourceType::Observation, HealthAction::Read,
            true, false, true,
        );
        assert_eq!(result, ComplianceResult::Compliant);
    }

    #[test]
    fn test_compliance_export_without_audit_is_violation() {
        let result = RegulatoryComplianceChecker::check(
            FhirResourceType::Encounter, HealthAction::Export,
            true, false, false,
        );
        assert_eq!(result, ComplianceResult::Violation);
    }
}
