"""
Aluminum OS — Health Layer Tests (v2.0)

Tests for python/core/health_layer.py components:
  - FhirEvent integrity hashing
  - HealthAuditLedger: append-only, consent enforcement, chain verification
  - ConsentVault: grant, revoke, TTL, coverage checks
  - AiDisclosureRegistry: INV-30 compliance
  - AmendmentProtocol: supermajority, simple majority, dominance cap
  - RegulatoryChecker: HIPAA / 21 CFR Part 11 / ONC §3022
  - PqcIdentityRegistry: registration and stub verification

Zero external dependencies.
Atlas Lattice Foundation — March 2026
"""

import sys
import os
import time
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core.health_layer import (
    FhirResourceType, FhirAction, FhirEvent,
    HealthAuditLedger, HealthAuditSeverity, ConsentError,
    ConsentVault,
    AiDisclosureRegistry, AiDisclosureStatus,
    AmendmentProtocol, AmendmentStatus,
    RegulatoryChecker, ComplianceResult,
    PqcAlgorithm, PqcIdentityRegistry,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_event(
    resource_type=FhirResourceType.OBSERVATION,
    action=FhirAction.READ,
    agent_id="claude",
    ai_involved=False,
) -> FhirEvent:
    return FhirEvent(
        resource_type=resource_type,
        action=action,
        agent_id=agent_id,
        ai_involved=ai_involved,
    )


# ===========================================================================
# FhirEvent
# ===========================================================================

class TestFhirEvent(unittest.TestCase):
    """FhirEvent — schema and integrity hash."""

    def test_event_id_generated(self):
        ev = _make_event()
        self.assertTrue(len(ev.event_id) == 16)

    def test_integrity_hash_generated(self):
        ev = _make_event()
        self.assertTrue(len(ev.integrity_hash) == 64)

    def test_different_events_different_hashes(self):
        ev1 = _make_event(resource_type=FhirResourceType.PATIENT)
        ev2 = _make_event(resource_type=FhirResourceType.CLAIM)
        self.assertNotEqual(ev1.integrity_hash, ev2.integrity_hash)

    def test_to_dict_contains_required_fields(self):
        ev = _make_event()
        d = ev.to_dict()
        for key in ("event_id", "resource_type", "action", "agent_id", "integrity_hash"):
            self.assertIn(key, d)

    def test_fhir_resource_consent_requirements(self):
        self.assertTrue(FhirResourceType.PATIENT.requires_explicit_consent())
        self.assertTrue(FhirResourceType.CONDITION.requires_explicit_consent())
        self.assertFalse(FhirResourceType.ENCOUNTER.requires_explicit_consent())
        self.assertFalse(FhirResourceType.ORGANIZATION.requires_explicit_consent())

    def test_fhir_financial_resources(self):
        self.assertTrue(FhirResourceType.CLAIM.is_financial())
        self.assertTrue(FhirResourceType.EXPLANATION_OF_BENEFIT.is_financial())
        self.assertFalse(FhirResourceType.PATIENT.is_financial())


# ===========================================================================
# HealthAuditLedger
# ===========================================================================

class TestHealthAuditLedger(unittest.TestCase):
    """HealthAuditLedger — append-only, consent enforcement, chain integrity."""

    def setUp(self):
        self.ledger = HealthAuditLedger()

    def test_append_non_phi_no_consent_required(self):
        ev = _make_event(resource_type=FhirResourceType.ENCOUNTER)
        entry = self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        self.assertEqual(entry.seq, 1)
        self.assertEqual(self.ledger.entry_count, 1)

    def test_append_phi_requires_consent(self):
        ev = _make_event(resource_type=FhirResourceType.PATIENT)
        with self.assertRaises(ConsentError):
            self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)

    def test_append_phi_with_consent_succeeds(self):
        ev = _make_event(resource_type=FhirResourceType.PATIENT)
        entry = self.ledger.append(ev, HealthAuditSeverity.WARNING, True, True)
        self.assertEqual(entry.seq, 1)
        self.assertTrue(entry.consent_verified)

    def test_sequential_seq_numbers(self):
        for _ in range(3):
            ev = _make_event()
            self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        self.assertEqual(self.ledger.entry_count, 3)
        for i, entry in enumerate(
            self.ledger.get(j) for j in range(3)
        ):
            self.assertEqual(entry.seq, i + 1)

    def test_denial_count_tracking(self):
        for _ in range(3):
            ev = _make_event(action=FhirAction.DENIAL_OF_CARE)
            self.ledger.append(ev, HealthAuditSeverity.REGULATORY, False, True)
        self.assertEqual(self.ledger.denial_count, 3)
        self.assertTrue(self.ledger.denial_threshold_exceeded)

    def test_below_denial_threshold(self):
        ev = _make_event(action=FhirAction.DENIAL_OF_CARE)
        self.ledger.append(ev, HealthAuditSeverity.CRITICAL, False, True)
        self.assertEqual(self.ledger.denial_count, 1)
        self.assertFalse(self.ledger.denial_threshold_exceeded)

    def test_chain_verification_valid(self):
        for _ in range(5):
            ev = _make_event()
            self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        self.assertTrue(self.ledger.verify_chain())

    def test_chain_tamper_detected(self):
        for _ in range(3):
            ev = _make_event()
            self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        # Tamper with an entry's PQC stub
        self.ledger._entries[1].pqc_sig_stub = "deadbeefdeadbeef"
        self.assertFalse(self.ledger.verify_chain())

    def test_get_entry_by_index(self):
        ev = _make_event(agent_id="gemini")
        self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        entry = self.ledger.get(0)
        self.assertEqual(entry.event.agent_id, "gemini")
        self.assertIsNone(self.ledger.get(99))

    def test_export_json(self):
        ev = _make_event()
        self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        exported = self.ledger.export_json()
        import json
        data = json.loads(exported)
        self.assertEqual(len(data), 1)
        self.assertIn("seq", data[0])


# ===========================================================================
# ConsentVault
# ===========================================================================

class TestConsentVault(unittest.TestCase):
    """ConsentVault — grant, revoke, TTL, coverage."""

    def setUp(self):
        self.vault = ConsentVault()

    def test_grant_and_check(self):
        self.vault.grant(
            "c1", "patient-1", "claude",
            ["treatment"], [FhirResourceType.PATIENT],
        )
        self.assertTrue(
            self.vault.check("patient-1", FhirResourceType.PATIENT, "treatment")
        )

    def test_wrong_purpose_fails(self):
        self.vault.grant(
            "c2", "patient-2", "claude",
            ["treatment"], [FhirResourceType.PATIENT],
        )
        self.assertFalse(
            self.vault.check("patient-2", FhirResourceType.PATIENT, "marketing")
        )

    def test_wrong_resource_fails(self):
        self.vault.grant(
            "c3", "patient-3", "claude",
            ["treatment"], [FhirResourceType.OBSERVATION],
        )
        self.assertFalse(
            self.vault.check("patient-3", FhirResourceType.CONDITION, "treatment")
        )

    def test_revoke_invalidates_consent(self):
        self.vault.grant(
            "c4", "patient-4", "claude",
            ["treatment"], [FhirResourceType.PATIENT],
        )
        self.vault.revoke("c4", reason="patient withdrew consent")
        self.assertFalse(
            self.vault.check("patient-4", FhirResourceType.PATIENT, "treatment")
        )

    def test_expired_consent_invalid(self):
        self.vault.grant(
            "c5", "patient-5", "claude",
            ["payment"], [FhirResourceType.CLAIM],
            ttl_seconds=0.01,
        )
        time.sleep(0.02)
        self.assertFalse(
            self.vault.check("patient-5", FhirResourceType.CLAIM, "payment")
        )

    def test_duplicate_grant_raises(self):
        self.vault.grant("c6", "patient-6", "claude", ["treatment"],
                         [FhirResourceType.PATIENT])
        with self.assertRaises(ValueError):
            self.vault.grant("c6", "patient-6", "claude", ["treatment"],
                             [FhirResourceType.PATIENT])

    def test_active_count(self):
        self.vault.grant("c7", "p7", "claude", ["treatment"],
                         [FhirResourceType.PATIENT])
        self.vault.grant("c8", "p8", "claude", ["treatment"],
                         [FhirResourceType.PATIENT])
        self.vault.revoke("c7")
        self.assertEqual(self.vault.active_count, 1)
        self.assertEqual(self.vault.record_count, 2)


# ===========================================================================
# AiDisclosureRegistry
# ===========================================================================

class TestAiDisclosureRegistry(unittest.TestCase):
    """AiDisclosureRegistry — INV-30 compliance tracking."""

    def setUp(self):
        self.reg = AiDisclosureRegistry()

    def test_disclosed_no_violation(self):
        self.reg.record("claude", "evt-1", AiDisclosureStatus.DISCLOSED, 91, True)
        self.assertEqual(self.reg.violation_count, 0)
        self.assertEqual(self.reg.disclosure_count, 1)

    def test_missing_counts_as_violation(self):
        self.reg.record("gemini", "evt-2", AiDisclosureStatus.MISSING)
        self.assertEqual(self.reg.violation_count, 1)

    def test_not_applicable_no_violation(self):
        self.reg.record("grok", "evt-3", AiDisclosureStatus.NOT_APPLICABLE)
        self.assertEqual(self.reg.violation_count, 0)

    def test_multiple_violations_accumulate(self):
        for i in range(3):
            self.reg.record("agent", f"evt-{i}", AiDisclosureStatus.MISSING)
        self.assertEqual(self.reg.violation_count, 3)

    def test_confidence_pct_clamped(self):
        rec = self.reg.record("claude", "evt-x", AiDisclosureStatus.DISCLOSED,
                              confidence_pct=150)
        self.assertEqual(rec.confidence_pct, 100)

    def test_record_id_increments(self):
        r1 = self.reg.record("a", "e1", AiDisclosureStatus.DISCLOSED)
        r2 = self.reg.record("b", "e2", AiDisclosureStatus.DISCLOSED)
        self.assertEqual(r2.record_id, r1.record_id + 1)


# ===========================================================================
# AmendmentProtocol
# ===========================================================================

class TestAmendmentProtocol(unittest.TestCase):
    """AmendmentProtocol — supermajority, simple majority, dominance cap."""

    def setUp(self):
        self.protocol = AmendmentProtocol()

    def test_propose_creates_proposal(self):
        p = self.protocol.propose("janus", "health-ai-disclosure", "Mandate AI disclosure")
        self.assertEqual(p.status, AmendmentStatus.PROPOSED)
        self.assertEqual(self.protocol.proposal_count, 1)

    def test_enact_with_supermajority(self):
        p = self.protocol.propose("claude", "Test", "Desc", supermajority_required=True)
        for _ in range(5):
            self.protocol.vote(p.amendment_id, approve=True)
        self.protocol.vote(p.amendment_id, approve=False)
        enacted = self.protocol.try_enact(p.amendment_id)
        self.assertTrue(enacted)
        self.assertEqual(self.protocol.enacted_count, 1)
        updated = self.protocol.get(p.amendment_id)
        self.assertEqual(updated.status, AmendmentStatus.ENACTED)

    def test_reject_without_supermajority(self):
        p = self.protocol.propose("claude", "Test", "Desc", supermajority_required=True)
        for _ in range(4):
            self.protocol.vote(p.amendment_id, approve=True)
        for _ in range(3):
            self.protocol.vote(p.amendment_id, approve=False)
        enacted = self.protocol.try_enact(p.amendment_id)
        self.assertFalse(enacted)
        self.assertEqual(self.protocol.enacted_count, 0)

    def test_simple_majority_enacts(self):
        p = self.protocol.propose("copilot", "Minor clarification", "Desc",
                                   supermajority_required=False)
        self.protocol.vote(p.amendment_id, True)
        self.protocol.vote(p.amendment_id, True)
        self.protocol.vote(p.amendment_id, False)
        enacted = self.protocol.try_enact(p.amendment_id)
        self.assertTrue(enacted)

    def test_simple_majority_tie_rejects(self):
        p = self.protocol.propose("gemini", "Edge case", "Desc", supermajority_required=False)
        self.protocol.vote(p.amendment_id, True)
        self.protocol.vote(p.amendment_id, False)
        enacted = self.protocol.try_enact(p.amendment_id)
        self.assertFalse(enacted)

    def test_dominance_rule_within_cap(self):
        p = self.protocol.propose("a", "t", "d")
        p.votes_for = 5
        p.votes_against = 2
        # 3 votes by one model out of 7 total = 42.8% <= 47%
        self.assertTrue(p.dominance_rule_satisfied(3))

    def test_dominance_rule_exceeds_cap(self):
        p = self.protocol.propose("a", "t", "d")
        p.votes_for = 5
        p.votes_against = 2
        # 4 votes by one model out of 7 total = 57.1% > 47%
        self.assertFalse(p.dominance_rule_satisfied(4))

    def test_vote_on_enacted_amendment_raises(self):
        p = self.protocol.propose("a", "t", "d")
        for _ in range(5):
            self.protocol.vote(p.amendment_id, True)
        self.protocol.try_enact(p.amendment_id)
        with self.assertRaises(ValueError):
            self.protocol.vote(p.amendment_id, True)

    def test_enact_not_under_review_raises(self):
        p = self.protocol.propose("a", "t", "d")
        # Still in PROPOSED state (no votes cast)
        with self.assertRaises(ValueError):
            self.protocol.try_enact(p.amendment_id)

    def test_unknown_amendment_raises(self):
        with self.assertRaises(KeyError):
            self.protocol.vote(9999, True)
        with self.assertRaises(KeyError):
            self.protocol.try_enact(9999)


# ===========================================================================
# RegulatoryChecker
# ===========================================================================

class TestRegulatoryChecker(unittest.TestCase):
    """RegulatoryChecker — HIPAA / 21 CFR Part 11 / ONC §3022."""

    def _check(self, **kwargs):
        defaults = dict(
            resource_type=FhirResourceType.OBSERVATION,
            action=FhirAction.READ,
            ai_involved=False,
            ai_disclosed=True,
            consent_verified=False,
            audit_trail_present=True,
        )
        defaults.update(kwargs)
        return RegulatoryChecker.check(**defaults)

    def test_non_phi_read_is_compliant(self):
        report = self._check()
        self.assertTrue(report.is_compliant)
        self.assertEqual(report.result, ComplianceResult.COMPLIANT)

    def test_phi_without_consent_is_violation(self):
        report = self._check(resource_type=FhirResourceType.PATIENT, consent_verified=False)
        self.assertEqual(report.result, ComplianceResult.VIOLATION)
        self.assertTrue(any("§164.502" in v for v in report.violations))

    def test_phi_without_audit_trail_is_violation(self):
        report = self._check(
            resource_type=FhirResourceType.PATIENT,
            consent_verified=True,
            audit_trail_present=False,
        )
        self.assertEqual(report.result, ComplianceResult.VIOLATION)
        self.assertTrue(any("§164.312" in v for v in report.violations))

    def test_phi_with_consent_and_audit_is_compliant(self):
        report = self._check(
            resource_type=FhirResourceType.PATIENT,
            consent_verified=True,
            audit_trail_present=True,
        )
        self.assertTrue(report.is_compliant)

    def test_ai_denial_without_disclosure_is_violation(self):
        report = self._check(
            action=FhirAction.DENIAL_OF_CARE,
            ai_involved=True,
            ai_disclosed=False,
        )
        self.assertEqual(report.result, ComplianceResult.VIOLATION)
        self.assertTrue(any("INV-30" in v for v in report.violations))

    def test_ai_denial_with_disclosure_is_warning(self):
        report = self._check(
            action=FhirAction.DENIAL_OF_CARE,
            ai_involved=True,
            ai_disclosed=True,
        )
        self.assertEqual(report.result, ComplianceResult.WARNING)

    def test_non_ai_denial_is_warning(self):
        report = self._check(action=FhirAction.DENIAL_OF_CARE, ai_involved=False)
        self.assertEqual(report.result, ComplianceResult.WARNING)

    def test_export_without_audit_is_violation(self):
        report = self._check(action=FhirAction.EXPORT, audit_trail_present=False)
        self.assertEqual(report.result, ComplianceResult.VIOLATION)

    def test_frameworks_listed(self):
        report = self._check()
        self.assertGreater(len(report.frameworks_checked), 0)


# ===========================================================================
# PqcIdentityRegistry
# ===========================================================================

class TestPqcIdentityRegistry(unittest.TestCase):
    """PqcIdentityRegistry — PQC identity stubs (NIST FIPS 203/204)."""

    def setUp(self):
        self.registry = PqcIdentityRegistry()

    def test_register_and_find(self):
        pubkey = bytes(range(64))
        record = self.registry.register("claude", PqcAlgorithm.ML_DSA_87, pubkey)
        self.assertEqual(record.algorithm, PqcAlgorithm.ML_DSA_87)
        found = self.registry.find("claude")
        self.assertIsNotNone(found)

    def test_count_increments(self):
        for i in range(3):
            self.registry.register(f"agent-{i}", PqcAlgorithm.ML_DSA_87, bytes(64))
        self.assertEqual(self.registry.count, 3)

    def test_not_found_returns_none(self):
        self.assertIsNone(self.registry.find("unknown"))

    def test_pubkey_stub_stored(self):
        pubkey = bytes([0xAB] * 128)
        self.registry.register("gemini", PqcAlgorithm.ML_KEM_1024, pubkey)
        rec = self.registry.find("gemini")
        # Stub is first 64 bytes → all 0xAB
        self.assertEqual(rec.pubkey_stub_hex, "ab" * 64)

    def test_stub_verification(self):
        pubkey = bytes([0xCD] * 128)
        self.registry.register("grok", PqcAlgorithm.ML_DSA_87, pubkey)
        rec = self.registry.find("grok")
        self.assertTrue(rec.verify_stub(pubkey))
        self.assertFalse(rec.verify_stub(bytes([0x00] * 128)))

    def test_algorithm_key_sizes(self):
        self.assertEqual(PqcAlgorithm.ML_KEM_1024.full_pubkey_bytes, 1568)
        self.assertEqual(PqcAlgorithm.ML_DSA_87.full_pubkey_bytes, 2592)

    def test_overwrite_registration(self):
        self.registry.register("claude", PqcAlgorithm.ML_DSA_87, bytes(64))
        self.registry.register("claude", PqcAlgorithm.ML_KEM_1024, bytes(64))
        # Most recent registration wins
        rec = self.registry.find("claude")
        self.assertEqual(rec.algorithm, PqcAlgorithm.ML_KEM_1024)
        # Count is still 1 (overwrite)
        self.assertEqual(self.registry.count, 1)


if __name__ == "__main__":
    unittest.main()
