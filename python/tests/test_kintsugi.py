"""
Aluminum OS — Kintsugi SDK Tests (v1.0)

Tests for kintsugi/sdk/golden_trace.py:
  - GoldenTraceEmitter: emit, hash chain, golden repair, export, seams
  - GoldenTraceValidator: valid trace, missing fields, invalid event/layer/severity
  - Health×Kintsugi integration: HealthAuditLedger, ConsentVault, AmendmentProtocol
    each emit GoldenTrace events when a tracer is provided

Zero external dependencies. Vanilla Python 3.
Atlas Lattice Foundation — March 2026
"""

import sys
import os
import json
import time
import unittest

# Allow running from repo root: python -m unittest python.tests.test_kintsugi
# or from python/: python -m unittest tests.test_kintsugi
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from kintsugi.sdk.golden_trace import GoldenTraceEmitter, GoldenTraceValidator
from core.health_layer import (
    FhirEvent, FhirResourceType, FhirAction,
    HealthAuditLedger, HealthAuditSeverity,
    ConsentVault,
    AmendmentProtocol,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _emitter(module: str = "test") -> GoldenTraceEmitter:
    return GoldenTraceEmitter(repo="aluminum-os", module=module)


def _minimal_trace(emitter: GoldenTraceEmitter, **overrides) -> dict:
    kwargs = dict(
        event_type="action",
        sphere_tag="H7.S1",
        aluminum_layer="L4-Service",
        payload={"test": True},
    )
    kwargs.update(overrides)
    return emitter.emit(**kwargs)


# ===========================================================================
# GoldenTraceEmitter
# ===========================================================================

class TestGoldenTraceEmitter(unittest.TestCase):
    """GoldenTraceEmitter — emit, chain, repair, export."""

    def test_emit_returns_dict_with_required_fields(self):
        e = _emitter()
        trace = _minimal_trace(e)
        for field in ("trace_id", "timestamp", "source", "event_type",
                      "sphere_tag", "aluminum_layer", "payload", "integrity"):
            self.assertIn(field, trace)

    def test_emit_increments_chain(self):
        e = _emitter()
        t1 = _minimal_trace(e)
        t2 = _minimal_trace(e)
        # Second trace references first trace's hash
        self.assertEqual(t2["integrity"]["previous_trace_hash"], t1["integrity"]["hash"])

    def test_first_trace_is_genesis(self):
        e = _emitter()
        t = _minimal_trace(e)
        self.assertEqual(t["integrity"]["previous_trace_hash"], "GENESIS")

    def test_verify_chain_valid(self):
        e = _emitter()
        for _ in range(5):
            _minimal_trace(e)
        self.assertTrue(e.verify_chain())

    def test_verify_chain_empty(self):
        e = _emitter()
        self.assertTrue(e.verify_chain())

    def test_hash_algorithm_is_sha3_256(self):
        e = _emitter()
        t = _minimal_trace(e)
        self.assertEqual(t["integrity"]["hash_algorithm"], "sha3-256")

    def test_emit_all_valid_event_types(self):
        e = _emitter()
        for et in GoldenTraceValidator.VALID_EVENT_TYPES:
            trace = e.emit(event_type=et, sphere_tag="H7.S1",
                           aluminum_layer="L4-Service", payload={})
            errs = GoldenTraceValidator.validate(trace)
            self.assertEqual(errs, [], f"Unexpected errors for event_type={et!r}: {errs}")

    def test_emit_with_invariants(self):
        e = _emitter()
        t = e.emit(
            event_type="invariant_check",
            sphere_tag="H7.S1",
            aluminum_layer="L1-Constitutional",
            payload={},
            invariants_checked=["INV-1", "INV-30"],
        )
        self.assertIn("invariants_checked", t)
        self.assertEqual(t["invariants_checked"], ["INV-1", "INV-30"])

    def test_emit_with_council_context(self):
        e = _emitter()
        t = e.emit(
            event_type="council_vote",
            sphere_tag="H1.S1",
            aluminum_layer="L1-Constitutional",
            payload={},
            council_context={
                "session_id": "s1",
                "model": "claude",
                "vote": "approve",
                "confidence": 0.92,
            },
        )
        self.assertIn("council_context", t)
        self.assertEqual(t["council_context"]["vote"], "approve")

    def test_golden_repair_sets_severity_golden(self):
        e = _emitter()
        failure = _minimal_trace(e, event_type="failure")
        repair = e.emit_golden_repair(
            original_failure_trace_id=failure["trace_id"],
            repair_strategy="Retry with fallback model",
            strength_gained="Added timeout threshold",
            beauty_score=0.85,
            sphere_tag="H7.S1",
            aluminum_layer="L4-Service",
            payload={"fallback_model": "gemini"},
        )
        self.assertEqual(repair["severity"], "golden")
        self.assertIn("kintsugi", repair)
        self.assertEqual(repair["kintsugi"]["original_failure_trace_id"],
                         failure["trace_id"])

    def test_golden_repair_beauty_score_clamped(self):
        e = _emitter()
        repair = e.emit_golden_repair(
            original_failure_trace_id="some-uuid",
            repair_strategy="fix",
            strength_gained="learned",
            beauty_score=1.5,  # above max
            sphere_tag="H7.S1",
            aluminum_layer="L4-Service",
            payload={},
        )
        self.assertEqual(repair["kintsugi"]["beauty_score"], 1.0)

    def test_get_golden_seams_returns_only_repairs(self):
        e = _emitter()
        _minimal_trace(e, event_type="action")
        _minimal_trace(e, event_type="failure")
        e.emit_golden_repair(
            original_failure_trace_id="x",
            repair_strategy="r",
            strength_gained="s",
            beauty_score=0.5,
            sphere_tag="H7.S1",
            aluminum_layer="L4-Service",
            payload={},
        )
        seams = e.get_golden_seams()
        self.assertEqual(len(seams), 1)
        self.assertEqual(seams[0]["severity"], "golden")

    def test_export_log_is_valid_json(self):
        e = _emitter()
        _minimal_trace(e)
        _minimal_trace(e)
        log = e.export_log()
        data = json.loads(log)
        self.assertEqual(len(data), 2)

    def test_source_fields_set_correctly(self):
        e = GoldenTraceEmitter(repo="aluminum-os", module="core/test")
        t = e.emit(event_type="action", sphere_tag="H7.S1",
                   aluminum_layer="L4-Service", payload={}, function="test_fn")
        self.assertEqual(t["source"]["repo"], "aluminum-os")
        self.assertEqual(t["source"]["module"], "core/test")
        self.assertEqual(t["source"]["function"], "test_fn")


# ===========================================================================
# GoldenTraceValidator
# ===========================================================================

class TestGoldenTraceValidator(unittest.TestCase):
    """GoldenTraceValidator — schema enforcement."""

    def _valid_trace(self) -> dict:
        e = _emitter()
        return _minimal_trace(e)

    def test_valid_trace_has_no_errors(self):
        t = self._valid_trace()
        self.assertEqual(GoldenTraceValidator.validate(t), [])

    def test_missing_field_detected(self):
        t = self._valid_trace()
        del t["trace_id"]
        errs = GoldenTraceValidator.validate(t)
        self.assertTrue(any("trace_id" in e for e in errs))

    def test_missing_integrity_detected(self):
        t = self._valid_trace()
        del t["integrity"]
        errs = GoldenTraceValidator.validate(t)
        self.assertTrue(any("integrity" in e for e in errs))

    def test_invalid_event_type_detected(self):
        t = self._valid_trace()
        t["event_type"] = "invalid_event"
        errs = GoldenTraceValidator.validate(t)
        self.assertTrue(any("event_type" in e for e in errs))

    def test_invalid_aluminum_layer_detected(self):
        t = self._valid_trace()
        t["aluminum_layer"] = "L9-Unknown"
        errs = GoldenTraceValidator.validate(t)
        self.assertTrue(any("aluminum_layer" in e for e in errs))

    def test_invalid_severity_detected(self):
        t = self._valid_trace()
        t["severity"] = "extreme"
        errs = GoldenTraceValidator.validate(t)
        self.assertTrue(any("severity" in e for e in errs))

    def test_valid_severity_golden_accepted(self):
        e = _emitter()
        t = e.emit_golden_repair(
            original_failure_trace_id="x", repair_strategy="r",
            strength_gained="s", beauty_score=0.5,
            sphere_tag="H7.S1", aluminum_layer="L4-Service", payload={},
        )
        errs = GoldenTraceValidator.validate(t)
        self.assertEqual(errs, [])

    def test_all_valid_layers_accepted(self):
        for layer in GoldenTraceValidator.VALID_LAYERS:
            e = _emitter()
            t = e.emit(event_type="action", sphere_tag="H7.S1",
                       aluminum_layer=layer, payload={})
            errs = GoldenTraceValidator.validate(t)
            self.assertEqual(errs, [], f"Layer {layer!r} should be valid")


# ===========================================================================
# Health × Kintsugi Integration
# ===========================================================================

class TestHealthAuditLedgerWithTracer(unittest.TestCase):
    """HealthAuditLedger emits GoldenTrace events when a tracer is injected."""

    def setUp(self):
        self.tracer = _emitter("core/health_layer")
        self.ledger = HealthAuditLedger(tracer=self.tracer)

    def _obs_event(self, action=FhirAction.READ):
        return FhirEvent(
            resource_type=FhirResourceType.OBSERVATION,
            action=action,
            agent_id="claude",
        )

    def test_append_emits_action_trace(self):
        ev = self._obs_event()
        self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        self.assertEqual(len(self.tracer._trace_log), 1)
        trace = self.tracer._trace_log[0]
        self.assertEqual(trace["event_type"], "action")
        errs = GoldenTraceValidator.validate(trace)
        self.assertEqual(errs, [])

    def test_denial_of_care_emits_invariant_violation(self):
        ev = self._obs_event(action=FhirAction.DENIAL_OF_CARE)
        self.ledger.append(ev, HealthAuditSeverity.REGULATORY, False, True)
        trace = self.tracer._trace_log[0]
        self.assertEqual(trace["event_type"], "invariant_violation")
        self.assertIn("INV-30", trace.get("invariants_checked", []))

    def test_trace_chain_grows_with_ledger(self):
        for _ in range(3):
            ev = self._obs_event()
            self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        self.assertEqual(len(self.tracer._trace_log), 3)
        self.assertTrue(self.tracer.verify_chain())

    def test_no_tracer_works_silently(self):
        ledger = HealthAuditLedger()  # no tracer
        ev = self._obs_event()
        entry = ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        self.assertIsNotNone(entry)
        self.assertEqual(ledger.entry_count, 1)

    def test_trace_payload_contains_pqc_sig_stub(self):
        ev = self._obs_event()
        self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        trace = self.tracer._trace_log[0]
        self.assertIn("pqc_sig_stub", trace["payload"])

    def test_ledger_chain_integrity_unaffected_by_tracer(self):
        for _ in range(4):
            ev = self._obs_event()
            self.ledger.append(ev, HealthAuditSeverity.INFO, False, True)
        self.assertTrue(self.ledger.verify_chain())


class TestConsentVaultWithTracer(unittest.TestCase):
    """ConsentVault emits GoldenTrace events when a tracer is injected."""

    def setUp(self):
        self.tracer = _emitter("core/health_layer")
        self.vault = ConsentVault(tracer=self.tracer)

    def test_grant_emits_consent_granted(self):
        self.vault.grant(
            "c1", "patient-1", "claude",
            ["treatment"], [FhirResourceType.PATIENT],
        )
        self.assertEqual(len(self.tracer._trace_log), 1)
        trace = self.tracer._trace_log[0]
        self.assertEqual(trace["event_type"], "consent_granted")
        errs = GoldenTraceValidator.validate(trace)
        self.assertEqual(errs, [])

    def test_revoke_emits_consent_denied(self):
        self.vault.grant(
            "c2", "patient-2", "claude",
            ["treatment"], [FhirResourceType.PATIENT],
        )
        self.vault.revoke("c2", reason="patient withdrew")
        traces = self.tracer._trace_log
        self.assertEqual(len(traces), 2)
        self.assertEqual(traces[1]["event_type"], "consent_denied")
        self.assertEqual(traces[1]["payload"]["reason"], "patient withdrew")

    def test_no_tracer_works_silently(self):
        vault = ConsentVault()
        vault.grant("c3", "p3", "claude", ["treatment"], [FhirResourceType.PATIENT])
        self.assertTrue(vault.check("p3", FhirResourceType.PATIENT, "treatment"))

    def test_invariant_inv1_in_grant_trace(self):
        self.vault.grant(
            "c4", "patient-4", "claude",
            ["payment"], [FhirResourceType.CLAIM],
        )
        trace = self.tracer._trace_log[0]
        self.assertIn("INV-1", trace.get("invariants_checked", []))

    def test_grant_trace_chain_valid(self):
        for i in range(3):
            self.vault.grant(
                f"c{i}", f"p{i}", "claude",
                ["treatment"], [FhirResourceType.PATIENT],
            )
        self.assertTrue(self.tracer.verify_chain())


class TestAmendmentProtocolWithTracer(unittest.TestCase):
    """AmendmentProtocol emits GoldenTrace events when a tracer is injected."""

    def setUp(self):
        self.tracer = _emitter("core/health_layer")
        self.protocol = AmendmentProtocol(tracer=self.tracer)

    def test_propose_emits_amendment_proposed(self):
        self.protocol.propose("claude", "Test Amendment", "A description")
        self.assertEqual(len(self.tracer._trace_log), 1)
        trace = self.tracer._trace_log[0]
        self.assertEqual(trace["event_type"], "amendment_proposed")
        errs = GoldenTraceValidator.validate(trace)
        self.assertEqual(errs, [])

    def test_enact_emits_amendment_enacted(self):
        p = self.protocol.propose("claude", "Health AI Disclosure", "Mandate INV-30")
        for _ in range(5):
            self.protocol.vote(p.amendment_id, approve=True)
        self.protocol.vote(p.amendment_id, approve=False)
        enacted = self.protocol.try_enact(p.amendment_id)
        self.assertTrue(enacted)
        # Traces: one propose + one enacted
        event_types = [t["event_type"] for t in self.tracer._trace_log]
        self.assertIn("amendment_proposed", event_types)
        self.assertIn("amendment_enacted", event_types)

    def test_rejected_amendment_emits_no_enacted_trace(self):
        p = self.protocol.propose("claude", "Risky Rule", "Description")
        for _ in range(3):
            self.protocol.vote(p.amendment_id, approve=True)
        for _ in range(4):
            self.protocol.vote(p.amendment_id, approve=False)
        enacted = self.protocol.try_enact(p.amendment_id)
        self.assertFalse(enacted)
        # Only the propose trace — no amendment_enacted
        event_types = [t["event_type"] for t in self.tracer._trace_log]
        self.assertNotIn("amendment_enacted", event_types)

    def test_no_tracer_works_silently(self):
        protocol = AmendmentProtocol()
        p = protocol.propose("claude", "Test", "Desc")
        for _ in range(5):
            protocol.vote(p.amendment_id, True)
        self.assertTrue(protocol.try_enact(p.amendment_id))

    def test_enacted_trace_layer_is_constitutional(self):
        p = self.protocol.propose("claude", "Test", "Desc")
        for _ in range(5):
            self.protocol.vote(p.amendment_id, True)
        self.protocol.try_enact(p.amendment_id)
        enacted_trace = next(
            t for t in self.tracer._trace_log if t["event_type"] == "amendment_enacted"
        )
        self.assertEqual(enacted_trace["aluminum_layer"], "L1-Constitutional")


if __name__ == "__main__":
    unittest.main()
