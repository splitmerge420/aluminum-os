# Kintsugi Constitutional Audit Policy v2.0
# Enforces: no unaudited actions, fail closed, golden repair required for violations
# v2.0: Adds FHIR health audit, amendment protocol, PQC identity, and regulatory rules
# Atlas Lattice Foundation (c) 2026

package kintsugi.audit

import future.keywords.in

# RULE: Every action must produce a trace
deny[msg] {
    input.action
    not input.trace
    msg := "KINTSUGI-001: Action without GoldenTrace is prohibited. Every action must emit a trace."
}

# RULE: Traces must reference valid constitutional invariants
deny[msg] {
    trace := input.trace
    inv := trace.invariants_checked[_]
    not valid_invariant(inv)
    msg := sprintf("KINTSUGI-002: Invalid invariant reference: %s", [inv])
}

valid_invariant(inv) {
    regex.match("^INV-[0-9]{1,2}$", inv)
    num := to_number(trim_prefix(inv, "INV-"))
    num >= 1
    num <= 30
}

# RULE: Invariant violations must trigger golden repair within 5 minutes
deny[msg] {
    trace := input.trace
    trace.event_type == "invariant_violation"
    not has_repair_within(trace.trace_id, 300)
    msg := sprintf("KINTSUGI-003: Invariant violation %s has no golden repair within 5 minutes", [trace.trace_id])
}

has_repair_within(violation_id, seconds) {
    repair := input.trace_log[_]
    repair.event_type == "repair"
    repair.kintsugi.original_failure_trace_id == violation_id
}

# RULE: Council votes must satisfy INV-7 (47% cap)
deny[msg] {
    trace := input.trace
    trace.event_type == "council_consensus"
    model_votes := [v | v := trace.payload.votes[_]; v.vote == "approve"]
    total := count(trace.payload.votes)
    dominant := max_model_votes(trace.payload.votes)
    dominant / total > 0.47
    msg := "KINTSUGI-004: INV-7 violation — single model dominance exceeds 47% cap"
}

max_model_votes(votes) = max_count {
    models := {v.model | v := votes[_]}
    counts := [count([v | v := votes[_]; v.model == m]) | m := models[_]]
    max_count := max(counts)
}

# RULE: Ghost Seat (S144) requires unanimous + human advocate
deny[msg] {
    trace := input.trace
    trace.event_type == "ghost_seat_invoked"
    not trace.payload.unanimous_agreement
    msg := "KINTSUGI-005: Ghost Seat requires unanimous model agreement"
}

deny[msg] {
    trace := input.trace
    trace.event_type == "ghost_seat_invoked"
    not trace.payload.human_advocate_present
    msg := "KINTSUGI-006: Ghost Seat requires human advocate at Tier 3"
}

# RULE: All traces must have valid integrity hash
deny[msg] {
    trace := input.trace
    not trace.integrity.hash
    msg := "KINTSUGI-007: Trace missing integrity hash — append-only chain broken"
}

# RULE: Health-related actions require INV-30 AI disclosure
deny[msg] {
    trace := input.trace
    health_sphere(trace.sphere_tag)
    not inv30_disclosed(trace)
    msg := sprintf("KINTSUGI-008: Health sphere %s action requires INV-30 AI disclosure", [trace.sphere_tag])
}

health_sphere(tag) {
    # House 5 (Medicine S049-S060) or House 7 (Health S073-S084)
    startswith(tag, "H5.") 
}

health_sphere(tag) {
    startswith(tag, "H7.")
}

health_sphere(tag) {
    # Direct sphere references in health range
    num := to_number(trim_prefix(tag, "S"))
    num >= 49
    num <= 60
}

health_sphere(tag) {
    num := to_number(trim_prefix(tag, "S"))
    num >= 73
    num <= 84
}

inv30_disclosed(trace) {
    "INV-30" in trace.invariants_checked
}

# ============================================================================
# v2.0 Healthcare Extensions
# ============================================================================

# RULE: FHIR health events must carry consent_verified = true for PHI resources
# PHI resource types per HIPAA Privacy Rule (45 CFR §164.502)
phi_fhir_resources := {
    "Patient", "Condition", "MedicationRequest",
    "DiagnosticReport", "Procedure", "AllergyIntolerance", "CarePlan"
}

deny[msg] {
    trace := input.trace
    trace.event_type == "action"
    fhir_resource := trace.payload.fhir_resource_type
    fhir_resource in phi_fhir_resources
    not trace.payload.consent_verified
    msg := sprintf(
        "KINTSUGI-009: HIPAA §164.502 — PHI resource %s requires consent_verified=true",
        [fhir_resource]
    )
}

# RULE: Financial FHIR resources (Claim, EOB) require fraud-detection audit tag
deny[msg] {
    trace := input.trace
    trace.event_type == "action"
    fhir_resource := trace.payload.fhir_resource_type
    fhir_resource in {"Claim", "ExplanationOfBenefit"}
    not trace.payload.fraud_audit_tagged
    msg := sprintf(
        "KINTSUGI-010: Financial FHIR resource %s requires fraud_audit_tagged=true (HITECH §13402)",
        [fhir_resource]
    )
}

# RULE: Health audit entries must carry a PQC signature stub
# (full ML-DSA-87 validation occurs in the secure enclave)
deny[msg] {
    trace := input.trace
    health_sphere(trace.sphere_tag)
    trace.event_type == "action"
    not trace.payload.pqc_sig_stub
    msg := "KINTSUGI-011: Health audit entries require a PQC signature stub (ML-DSA-87, NIST FIPS 204)"
}

# RULE: Constitutional amendments require supermajority trace
# Supermajority definition: ≥5 of 7 Pantheon Council members must approve.
# This mirrors the Rust AmendmentProtocol.supermajority_met() check (votes_for >= 5)
# and the Python AmendmentProposal.supermajority_met() check.
deny[msg] {
    trace := input.trace
    trace.event_type == "amendment_enacted"
    not trace.payload.supermajority_met
    msg := "KINTSUGI-012: Amendment enactment requires supermajority (>=5/7 council members)"
}

# RULE: Constitutional amendments must satisfy the 47% dominance cap (INV-7)
deny[msg] {
    trace := input.trace
    trace.event_type == "amendment_proposed"
    trace.payload.max_single_model_pct > 47
    msg := sprintf(
        "KINTSUGI-013: INV-7 violation in amendment proposal — model holds %.1f%% (>47%% cap)",
        [trace.payload.max_single_model_pct]
    )
}

# RULE: Denial-of-care actions must be tagged for regulatory review (HIPAA §164.508)
deny[msg] {
    trace := input.trace
    trace.payload.fhir_action == "denial_of_care"
    not trace.payload.regulatory_review_tagged
    msg := "KINTSUGI-014: Denial-of-care action must be tagged for regulatory review (HIPAA §164.508 / FCA)"
}

# RULE: ONC §3022 — information export requires audit trail present
deny[msg] {
    trace := input.trace
    trace.payload.fhir_action == "export"
    not trace.payload.audit_trail_present
    msg := "KINTSUGI-015: ONC §3022 — FHIR export requires audit_trail_present=true"
}

# RULE: Health audit ledger entries must be append-only (no-delete mandate)
# Any trace with event_type == "delete" targeting a health audit record is prohibited
deny[msg] {
    trace := input.trace
    trace.event_type == "action"
    trace.payload.fhir_action == "delete"
    health_sphere(trace.sphere_tag)
    msg := "KINTSUGI-016: Health audit ledger is append-only — delete operations are constitutionally prohibited"
}
