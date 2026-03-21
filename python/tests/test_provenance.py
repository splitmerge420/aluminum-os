"""
Aluminum OS — ProvenanceTrailer Tests (Ring 1)

Tests for parse_trailers, validate_commit, validate_commits, and helper
functions in python/core/provenance.py.

Zero external dependencies.

Atlas Lattice Foundation — March 2026
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from python.core.provenance import (
    MIN_HITL_WEIGHT,
    BatchProvenanceResult,
    ParsedTrailers,
    ProvenanceFinding,
    ProvenanceResult,
    format_trailers,
    make_golden_trace_value,
    parse_trailers,
    validate_commit,
    validate_commits,
)
from kintsugi.sdk.golden_trace import GoldenTraceEmitter
import json


def _good_commit(hitl: float = 0.85) -> str:
    """Return a well-formed commit message with valid trailers."""
    gt = make_golden_trace_value("sample content")
    return (
        f"feat: add amazing feature\n\n"
        f"This commit adds the feature.\n\n"
        f"Golden-Trace: {gt}\n"
        f"HITL-Weight: {hitl:.2f}"
    )


def _emitter() -> GoldenTraceEmitter:
    return GoldenTraceEmitter(repo="test", module="provenance/test")


# ─────────────────────────────────────────────────────────────────────────────
# parse_trailers
# ─────────────────────────────────────────────────────────────────────────────

class TestParseTrailers(unittest.TestCase):

    def test_parses_golden_trace(self):
        gt = make_golden_trace_value("hello")
        msg = f"feat: something\n\nGolden-Trace: {gt}"
        parsed = parse_trailers(msg)
        self.assertEqual(parsed.golden_trace, gt)

    def test_parses_hitl_weight(self):
        gt = make_golden_trace_value("x")
        msg = f"fix: stuff\n\nGolden-Trace: {gt}\nHITL-Weight: 0.75"
        parsed = parse_trailers(msg)
        self.assertAlmostEqual(parsed.hitl_weight, 0.75)

    def test_missing_golden_trace_returns_none(self):
        parsed = parse_trailers("feat: no trailer here")
        self.assertIsNone(parsed.golden_trace)

    def test_missing_hitl_weight_returns_none(self):
        gt = make_golden_trace_value("x")
        msg = f"fix: thing\n\nGolden-Trace: {gt}"
        parsed = parse_trailers(msg)
        self.assertIsNone(parsed.hitl_weight)

    def test_invalid_golden_trace_format_not_parsed(self):
        msg = "feat: bad\n\nGolden-Trace: notahash"
        parsed = parse_trailers(msg)
        self.assertIsNone(parsed.golden_trace)

    def test_golden_trace_in_middle_of_message(self):
        gt = make_golden_trace_value("middle")
        msg = f"line1\nGolden-Trace: {gt}\nline3"
        parsed = parse_trailers(msg)
        self.assertEqual(parsed.golden_trace, gt)

    def test_hitl_weight_integer_value(self):
        gt = make_golden_trace_value("x")
        msg = f"Golden-Trace: {gt}\nHITL-Weight: 1"
        parsed = parse_trailers(msg)
        self.assertAlmostEqual(parsed.hitl_weight, 1.0)

    def test_hitl_weight_zero(self):
        gt = make_golden_trace_value("x")
        msg = f"Golden-Trace: {gt}\nHITL-Weight: 0.0"
        parsed = parse_trailers(msg)
        self.assertAlmostEqual(parsed.hitl_weight, 0.0)


# ─────────────────────────────────────────────────────────────────────────────
# validate_commit — passing cases
# ─────────────────────────────────────────────────────────────────────────────

class TestValidateCommitPass(unittest.TestCase):

    def test_valid_commit_passes(self):
        result = validate_commit(_good_commit())
        self.assertTrue(result.passed)
        self.assertEqual(len(result.findings), 0)

    def test_valid_commit_without_hitl_passes(self):
        gt = make_golden_trace_value("content")
        msg = f"feat: thing\n\nGolden-Trace: {gt}"
        result = validate_commit(msg)
        self.assertTrue(result.passed)

    def test_commit_sha_stored_in_result(self):
        result = validate_commit(_good_commit(), commit_sha="abc1234")
        self.assertEqual(result.commit_sha, "abc1234")

    def test_snippet_populated(self):
        result = validate_commit(_good_commit())
        self.assertTrue(len(result.commit_message_snippet) > 0)

    def test_parsed_trailers_attached(self):
        result = validate_commit(_good_commit(hitl=0.9))
        self.assertIsNotNone(result.parsed)
        self.assertIsNotNone(result.parsed.golden_trace)
        self.assertAlmostEqual(result.parsed.hitl_weight, 0.9)

    def test_emits_kintsugi_trace_on_pass(self):
        em = _emitter()
        result = validate_commit(_good_commit(), emitter=em)
        self.assertTrue(result.trace_id)
        log = json.loads(em.export_log())
        self.assertEqual(log[0]["event_type"], "provenance_check")
        self.assertEqual(log[0]["severity"], "info")

    def test_to_dict_keys_present(self):
        result = validate_commit(_good_commit())
        d = result.to_dict()
        for key in ("commit_sha", "commit_message_snippet", "passed",
                    "trace_id", "golden_trace", "hitl_weight", "findings"):
            self.assertIn(key, d)


# ─────────────────────────────────────────────────────────────────────────────
# validate_commit — failing cases
# ─────────────────────────────────────────────────────────────────────────────

class TestValidateCommitFail(unittest.TestCase):

    def test_missing_golden_trace_prov001(self):
        result = validate_commit("feat: no trailer")
        self.assertFalse(result.passed)
        self.assertTrue(any(f.rule_id == "PROV-001" for f in result.findings))

    def test_hitl_below_minimum_prov004(self):
        gt = make_golden_trace_value("x")
        msg = f"feat: low hitl\n\nGolden-Trace: {gt}\nHITL-Weight: 0.10"
        result = validate_commit(msg)
        self.assertFalse(result.passed)
        self.assertTrue(any(f.rule_id == "PROV-004" for f in result.findings))

    def test_hitl_above_one_prov003(self):
        gt = make_golden_trace_value("x")
        msg = f"feat: bad hitl\n\nGolden-Trace: {gt}\nHITL-Weight: 1.5"
        result = validate_commit(msg)
        self.assertFalse(result.passed)
        self.assertTrue(any(f.rule_id == "PROV-003" for f in result.findings))

    def test_emits_warning_on_failure(self):
        em = _emitter()
        result = validate_commit("feat: no trailer", emitter=em)
        self.assertFalse(result.passed)
        log = json.loads(em.export_log())
        self.assertEqual(log[0]["severity"], "warning")

    def test_no_emitter_still_works(self):
        result = validate_commit("feat: no trailer")
        self.assertFalse(result.passed)
        self.assertEqual(result.trace_id, "")

    def test_hitl_exactly_at_minimum_passes(self):
        gt = make_golden_trace_value("x")
        msg = (
            f"feat: boundary\n\n"
            f"Golden-Trace: {gt}\n"
            f"HITL-Weight: {MIN_HITL_WEIGHT:.2f}"
        )
        result = validate_commit(msg)
        self.assertTrue(result.passed)


# ─────────────────────────────────────────────────────────────────────────────
# validate_commits (batch)
# ─────────────────────────────────────────────────────────────────────────────

class TestValidateCommitsBatch(unittest.TestCase):

    def test_empty_batch_passes(self):
        result = validate_commits([])
        self.assertTrue(result.all_passed)
        self.assertEqual(result.commits_checked, 0)

    def test_all_good_batch_passes(self):
        commits = [
            ("abc1", _good_commit()),
            ("abc2", _good_commit(hitl=0.95)),
        ]
        result = validate_commits(commits)
        self.assertTrue(result.all_passed)
        self.assertEqual(result.commits_passed, 2)
        self.assertEqual(result.commits_failed, 0)

    def test_mixed_batch_fails(self):
        commits = [
            ("good", _good_commit()),
            ("bad", "feat: no trailer"),
        ]
        result = validate_commits(commits)
        self.assertFalse(result.all_passed)
        self.assertEqual(result.commits_passed, 1)
        self.assertEqual(result.commits_failed, 1)

    def test_batch_emits_single_trace(self):
        em = _emitter()
        commits = [("a", _good_commit()), ("b", _good_commit())]
        result = validate_commits(commits, emitter=em)
        self.assertTrue(result.trace_id)
        log = json.loads(em.export_log())
        self.assertEqual(len(log), 1)

    def test_batch_to_dict_keys(self):
        result = validate_commits([("x", _good_commit())])
        d = result.to_dict()
        for key in ("commits_checked", "commits_passed", "commits_failed",
                    "all_passed", "trace_id", "results"):
            self.assertIn(key, d)

    def test_all_failed_batch(self):
        commits = [("b1", "no trailer"), ("b2", "also no trailer")]
        result = validate_commits(commits)
        self.assertFalse(result.all_passed)
        self.assertEqual(result.commits_failed, 2)
        self.assertEqual(result.commits_passed, 0)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

class TestHelpers(unittest.TestCase):

    def test_make_golden_trace_value_format(self):
        value = make_golden_trace_value("hello world")
        self.assertTrue(value.startswith("sha3-256:"))
        self.assertEqual(len(value), len("sha3-256:") + 64)

    def test_make_golden_trace_value_deterministic(self):
        v1 = make_golden_trace_value("same content")
        v2 = make_golden_trace_value("same content")
        self.assertEqual(v1, v2)

    def test_make_golden_trace_value_unique_per_input(self):
        v1 = make_golden_trace_value("content A")
        v2 = make_golden_trace_value("content B")
        self.assertNotEqual(v1, v2)

    def test_format_trailers_with_hitl(self):
        gt = make_golden_trace_value("x")
        block = format_trailers(gt, hitl_weight=0.75)
        self.assertIn("Golden-Trace:", block)
        self.assertIn("HITL-Weight:", block)
        self.assertIn("0.75", block)

    def test_format_trailers_without_hitl(self):
        gt = make_golden_trace_value("x")
        block = format_trailers(gt)
        self.assertIn("Golden-Trace:", block)
        self.assertNotIn("HITL-Weight:", block)

    def test_format_trailers_roundtrip(self):
        gt = make_golden_trace_value("roundtrip")
        block = format_trailers(gt, hitl_weight=0.80)
        msg = f"feat: test\n\n{block}"
        parsed = parse_trailers(msg)
        self.assertEqual(parsed.golden_trace, gt)
        self.assertAlmostEqual(parsed.hitl_weight, 0.80)


if __name__ == "__main__":
    unittest.main()
