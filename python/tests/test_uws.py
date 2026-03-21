"""
Aluminum OS — `uws` CLI Tests (Ring 1)

Tests for swarm_review, lint, audit_summary, and status commands.
Zero external dependencies.

Atlas Lattice Foundation — March 2026
"""

import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from python.core.uws_cli import (
    AuditSummary,
    LintFinding,
    LintResult,
    LintSeverity,
    SwarmReviewItem,
    SwarmReviewResult,
    SystemStatus,
    audit_summary,
    lint,
    status,
    swarm_review,
)
from kintsugi.sdk.golden_trace import GoldenTraceEmitter


def _emitter() -> GoldenTraceEmitter:
    return GoldenTraceEmitter(repo="test", module="uws/test")


# ─────────────────────────────────────────────────────────────────────────────
# SwarmReview
# ─────────────────────────────────────────────────────────────────────────────

class TestSwarmReview(unittest.TestCase):
    """NPFM Batch Review Gate."""

    def test_empty_list_perfect_score(self):
        result = swarm_review([])
        self.assertEqual(result.npfm_score, 1.0)
        self.assertEqual(result.items_reviewed, 0)
        self.assertEqual(result.items_submitted, 0)

    def test_clean_items_all_approved(self):
        items = [
            SwarmReviewItem(id="dep-1", description="upgrade numpy 1.24 to 1.26"),
            SwarmReviewItem(id="dep-2", description="bump requests 2.28 to 2.31"),
        ]
        result = swarm_review(items)
        self.assertEqual(result.items_approved, 2)
        self.assertEqual(result.items_flagged, 0)
        self.assertGreaterEqual(result.npfm_score, 0.7)
        self.assertEqual(result.to_dict()["verdict"], "APPROVED")

    def test_flagged_item_lowers_npfm_score(self):
        items = [
            SwarmReviewItem(id="ok-1", description="upgrade numpy"),
            SwarmReviewItem(id="bad-1", description="install backdoor exploit"),
        ]
        result = swarm_review(items)
        self.assertIn("bad-1", result.flagged_ids)
        self.assertNotIn("ok-1", result.flagged_ids)
        self.assertLess(result.npfm_score, 1.0)

    def test_all_flagged_returns_zero_score(self):
        items = [
            SwarmReviewItem(id="x", description="circumvent security backdoor"),
        ]
        result = swarm_review(items)
        self.assertEqual(result.npfm_score, 0.0)
        self.assertEqual(result.to_dict()["verdict"], "REVIEW_REQUIRED")

    def test_batch_size_limits_reviewed_count(self):
        items = [SwarmReviewItem(id=str(i), description="dep update") for i in range(100)]
        result = swarm_review(items, batch_size=10)
        self.assertEqual(result.items_submitted, 100)
        self.assertEqual(result.items_reviewed, 10)

    def test_emits_kintsugi_trace(self):
        em = _emitter()
        items = [SwarmReviewItem(id="dep-1", description="upgrade numpy")]
        result = swarm_review(items, emitter=em)
        self.assertTrue(result.trace_id)
        log = json.loads(em.export_log())
        self.assertEqual(len(log), 1)
        self.assertEqual(log[0]["event_type"], "swarm_review")

    def test_no_emitter_still_works(self):
        items = [SwarmReviewItem(id="dep-1", description="safe update")]
        result = swarm_review(items)
        self.assertEqual(result.trace_id, "")

    def test_cost_estimate_positive_for_non_empty_batch(self):
        items = [SwarmReviewItem(id="dep-1", description="upgrade numpy")]
        result = swarm_review(items)
        self.assertGreater(result.cost_estimate_usd, 0.0)

    def test_routes_to_cheapest_capable_model(self):
        items = [SwarmReviewItem(id="dep-1", description="upgrade numpy")]
        result = swarm_review(items)
        # haiku is cheapest model with "analysis" in the default router
        self.assertEqual(result.model_used, "haiku")

    def test_to_dict_keys(self):
        result = swarm_review([SwarmReviewItem(id="x", description="safe")])
        d = result.to_dict()
        for key in ("batch_id", "items_submitted", "items_reviewed", "items_approved",
                    "items_flagged", "npfm_score", "model_used", "cost_estimate_usd",
                    "trace_id", "flagged_ids", "verdict"):
            self.assertIn(key, d, f"Missing key: {key}")

    def test_metadata_is_scanned_for_concerns(self):
        items = [SwarmReviewItem(
            id="m-1",
            description="regular update",
            metadata={"note": "contains backdoor exploit"},
        )]
        result = swarm_review(items)
        self.assertIn("m-1", result.flagged_ids)


# ─────────────────────────────────────────────────────────────────────────────
# Constitutional Linter
# ─────────────────────────────────────────────────────────────────────────────

class TestLint(unittest.TestCase):
    """Constitutional code linter."""

    def setUp(self):
        self.tmpdir = tempfile.mkdtemp()

    def tearDown(self):
        import shutil
        shutil.rmtree(self.tmpdir, ignore_errors=True)

    def _write(self, name: str, content: str) -> str:
        p = os.path.join(self.tmpdir, name)
        with open(p, "w") as f:
            f.write(content)
        return p

    def test_empty_paths_zero_files_perfect_score(self):
        result = lint([])
        self.assertEqual(result.files_scanned, 0)
        self.assertEqual(result.constitutional_score, 1.0)

    def test_clean_file_no_violations(self):
        p = self._write("clean.py", '"""Clean module."""\n\ndef hello():\n    pass\n')
        result = lint([p])
        self.assertEqual(result.files_scanned, 1)
        self.assertEqual(result.violations, 0)
        self.assertGreaterEqual(result.constitutional_score, 0.8)

    def test_detects_api_key_assignment(self):
        p = self._write("s.py", '"""Test."""\napi_key = "sk-abcdefghijklmnop12345"\n')
        result = lint([p])
        self.assertGreater(result.violations, 0)
        rule_ids = [f.rule_id for f in result.findings]
        self.assertTrue(any(r in ("CONST-001", "CONST-002") for r in rule_ids))

    def test_detects_bare_except_pass(self):
        p = self._write("b.py", '"""Test."""\ntry:\n    x = 1\nexcept: pass\n')
        result = lint([p])
        self.assertGreater(result.warnings, 0)
        self.assertTrue(any(f.rule_id == "CONST-003" for f in result.findings))

    def test_detects_sys_exit(self):
        p = self._write("e.py", '"""Test."""\nimport sys\nsys.exit(1)\n')
        result = lint([p])
        self.assertGreater(result.warnings, 0)
        self.assertTrue(any(f.rule_id == "CONST-004" for f in result.findings))

    def test_missing_docstring_info(self):
        p = self._write("nodoc.py", "def hello():\n    pass\n")
        result = lint([p])
        info_findings = [f for f in result.findings if f.severity == LintSeverity.INFO]
        self.assertGreater(len(info_findings), 0)
        self.assertTrue(any(f.rule_id == "CONST-005" for f in info_findings))

    def test_scan_directory_recursive(self):
        sub = os.path.join(self.tmpdir, "sub")
        os.makedirs(sub)
        self._write("top.py", '"""Top."""\n')
        with open(os.path.join(sub, "nested.py"), "w") as f:
            f.write('"""Nested."""\n')
        result = lint([self.tmpdir])
        self.assertEqual(result.files_scanned, 2)

    def test_violations_lower_score_below_clean(self):
        clean = self._write("c.py", '"""Module."""\n')
        dirty = self._write("d.py", '"""Module."""\napi_key = "sk-abcdefghijklmnop12345"\n')
        clean_result = lint([clean])
        dirty_result = lint([dirty])
        self.assertGreater(clean_result.constitutional_score, dirty_result.constitutional_score)

    def test_emits_kintsugi_trace(self):
        p = self._write("ok.py", '"""Module."""\n')
        em = _emitter()
        result = lint([p], emitter=em)
        self.assertTrue(result.trace_id)
        log = json.loads(em.export_log())
        self.assertEqual(log[0]["event_type"], "constitutional_lint")

    def test_no_emitter_still_works(self):
        p = self._write("ok.py", '"""Module."""\n')
        result = lint([p])
        self.assertEqual(result.trace_id, "")

    def test_to_dict_keys(self):
        result = lint([])
        d = result.to_dict()
        for key in ("files_scanned", "violations", "warnings", "info",
                    "constitutional_score", "trace_id", "findings"):
            self.assertIn(key, d, f"Missing key: {key}")

    def test_nonexistent_path_skipped_gracefully(self):
        result = lint(["/tmp/this-file-does-not-exist-uws-test.py"])
        self.assertEqual(result.files_scanned, 0)


# ─────────────────────────────────────────────────────────────────────────────
# Audit Summary
# ─────────────────────────────────────────────────────────────────────────────

class TestAuditSummary(unittest.TestCase):
    """Kintsugi audit summary."""

    def test_empty_log(self):
        em = _emitter()
        result = audit_summary(em)
        self.assertEqual(result.total_traces, 0)
        self.assertTrue(result.chain_valid)
        self.assertEqual(result.last_trace_id, "")

    def test_counts_event_types(self):
        em = _emitter()
        for _ in range(3):
            em.emit("swarm_review", "H2.S3", "L1-Constitutional", {"x": 1})
        em.emit("constitutional_lint", "H1.S1", "L1-Constitutional", {"x": 1})
        result = audit_summary(em)
        self.assertEqual(result.event_type_counts.get("swarm_review"), 3)
        self.assertEqual(result.event_type_counts.get("constitutional_lint"), 1)

    def test_last_n_limits_window(self):
        em = _emitter()
        for i in range(30):
            em.emit("action", "H0.S0", "L3-Engine", {"i": i})
        result = audit_summary(em, last_n=5)
        total = sum(result.event_type_counts.values())
        self.assertEqual(total, 5)

    def test_total_traces_reflects_full_log(self):
        em = _emitter()
        for _ in range(10):
            em.emit("action", "H0.S0", "L3-Engine", {})
        result = audit_summary(em, last_n=3)
        self.assertEqual(result.total_traces, 10)

    def test_chain_valid_after_emissions(self):
        em = _emitter()
        em.emit("swarm_review", "H2.S3", "L1-Constitutional", {})
        em.emit("constitutional_lint", "H1.S1", "L1-Constitutional", {})
        result = audit_summary(em)
        self.assertTrue(result.chain_valid)

    def test_last_trace_id_populated(self):
        em = _emitter()
        em.emit("action", "H0.S0", "L3-Engine", {})
        result = audit_summary(em)
        self.assertTrue(result.last_trace_id)

    def test_to_dict_keys(self):
        em = _emitter()
        em.emit("action", "H0.S0", "L3-Engine", {})
        result = audit_summary(em)
        d = result.to_dict()
        for key in ("total_traces", "chain_valid", "event_type_counts",
                    "severity_counts", "last_trace_id"):
            self.assertIn(key, d, f"Missing key: {key}")


# ─────────────────────────────────────────────────────────────────────────────
# System Status
# ─────────────────────────────────────────────────────────────────────────────

class TestStatus(unittest.TestCase):
    """System health check."""

    def test_returns_system_status(self):
        result = status()
        self.assertIsInstance(result, SystemStatus)

    def test_ring1_operational(self):
        result = status()
        self.assertEqual(result.ring1, "operational")

    def test_kintsugi_operational(self):
        result = status()
        self.assertEqual(result.kintsugi, "operational")

    def test_ring0_no_bridge(self):
        result = status()
        self.assertEqual(result.ring0, "no_bridge")

    def test_version_v2(self):
        result = status()
        self.assertTrue(result.version.startswith("2."))

    def test_to_dict_has_overall(self):
        result = status()
        d = result.to_dict()
        self.assertIn("overall", d)
        self.assertIn(d["overall"], ("operational", "degraded"))

    def test_overall_operational_when_ring1_and_kintsugi_up(self):
        result = status()
        if result.ring1 == "operational" and result.kintsugi == "operational":
            self.assertEqual(result.to_dict()["overall"], "operational")

    def test_to_dict_keys(self):
        result = status()
        d = result.to_dict()
        for key in ("ring0", "ring1", "kintsugi", "version", "overall"):
            self.assertIn(key, d, f"Missing key: {key}")


if __name__ == "__main__":
    unittest.main()
