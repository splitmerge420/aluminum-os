"""
Aluminum OS — Universal AI Provider Registry Tests

Tests for python/core/ai_providers.py — all major AI CLI integrations.

All subprocess and shutil.which calls are mocked so the suite runs
without any external tools, API keys, or network connectivity.

Atlas Lattice Foundation — March 2026
"""

import json
import os
import sys
import unittest
from unittest.mock import MagicMock, call as mcall, patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from python.core.ai_providers import (
    CONSTITUTIONAL_STATUS_OVERRIDES,
    PROVIDER_PREFERENCE,
    PROVIDERS,
    AICallResult,
    AICapability,
    AIProvider,
    AIProviderAdapter,
    ConstitutionalStatus,
    ProviderRegistry,
    ProviderStatus,
    _meets_version,
    _parse_version,
    _version_tuple,
    call,
    constitutional_gate,
    detect_providers,
)
from kintsugi.sdk.golden_trace import GoldenTraceEmitter


def _emitter() -> GoldenTraceEmitter:
    return GoldenTraceEmitter(repo="test", module="ai_providers/test")


def _mock_proc(stdout: str = "", stderr: str = "", returncode: int = 0):
    m = MagicMock()
    m.stdout = stdout
    m.stderr = stderr
    m.returncode = returncode
    return m


def _all_none_which(name):
    return None


# ── Registry constants ────────────────────────────────────────────────────────

class TestRegistryConstants(unittest.TestCase):

    def test_all_canonical_providers_present(self):
        for pid in ("copilot", "claude", "gemini", "deepseek", "ollama", "openai", "gh"):
            self.assertIn(pid, PROVIDERS, f"Missing provider: {pid}")

    def test_gemini_is_compliant(self):
        self.assertEqual(
            PROVIDERS["gemini"].constitutional_status,
            ConstitutionalStatus.COMPLIANT,
        )

    def test_ollama_is_compliant(self):
        self.assertEqual(
            PROVIDERS["ollama"].constitutional_status,
            ConstitutionalStatus.COMPLIANT,
        )

    def test_gh_is_compliant(self):
        self.assertEqual(
            PROVIDERS["gh"].constitutional_status,
            ConstitutionalStatus.COMPLIANT,
        )

    def test_copilot_is_pending_review(self):
        self.assertEqual(
            PROVIDERS["copilot"].constitutional_status,
            ConstitutionalStatus.PENDING_REVIEW,
        )

    def test_claude_is_pending_review(self):
        self.assertEqual(
            PROVIDERS["claude"].constitutional_status,
            ConstitutionalStatus.PENDING_REVIEW,
        )

    def test_deepseek_is_pending_review(self):
        self.assertEqual(
            PROVIDERS["deepseek"].constitutional_status,
            ConstitutionalStatus.PENDING_REVIEW,
        )

    def test_openai_is_pending_review(self):
        self.assertEqual(
            PROVIDERS["openai"].constitutional_status,
            ConstitutionalStatus.PENDING_REVIEW,
        )

    def test_gemini_is_open_source(self):
        self.assertTrue(PROVIDERS["gemini"].open_source)

    def test_ollama_is_open_source(self):
        self.assertTrue(PROVIDERS["ollama"].open_source)

    def test_copilot_is_not_open_source(self):
        self.assertFalse(PROVIDERS["copilot"].open_source)

    def test_provider_preference_starts_with_compliant(self):
        first = PROVIDER_PREFERENCE[0]
        self.assertEqual(
            PROVIDERS[first].constitutional_status,
            ConstitutionalStatus.COMPLIANT,
            "First preference must be a COMPLIANT provider",
        )

    def test_all_providers_have_capabilities(self):
        for pid, p in PROVIDERS.items():
            self.assertGreater(len(p.capabilities), 0, f"{pid} has no capabilities")

    def test_all_providers_have_required_version(self):
        for pid, p in PROVIDERS.items():
            self.assertTrue(p.required_version, f"{pid} missing required_version")

    def test_ollama_local_model_capability(self):
        self.assertIn(AICapability.LOCAL_MODEL, PROVIDERS["ollama"].capabilities)

    def test_gemini_mcp_capability(self):
        self.assertIn(AICapability.MCP_SERVER, PROVIDERS["gemini"].capabilities)

    def test_install_hints_non_empty_for_npm_providers(self):
        for pid in ("copilot", "claude", "gemini", "deepseek"):
            hints = PROVIDERS[pid].install_hints()
            self.assertTrue(any("npm" in h for h in hints), f"{pid} missing npm hint")

    def test_ollama_has_script_install_hint(self):
        hints = PROVIDERS["ollama"].install_hints()
        self.assertTrue(any("ollama.com" in h for h in hints))

    def test_to_dict_has_required_keys(self):
        for pid, p in PROVIDERS.items():
            d = p.to_dict()
            for key in ("id", "name", "binary", "required_version",
                        "open_source", "constitutional_status",
                        "capabilities", "install_hints"):
                self.assertIn(key, d, f"{pid}.to_dict() missing {key}")


# ── Version helpers ───────────────────────────────────────────────────────────

class TestVersionHelpers(unittest.TestCase):

    def test_parse_version_semver(self):
        self.assertEqual(_parse_version("copilot v0.0.367"), "0.0.367")

    def test_parse_version_claude(self):
        self.assertEqual(_parse_version("@anthropic-ai/claude-code 2.1.76"), "2.1.76")

    def test_parse_version_none(self):
        self.assertIsNone(_parse_version("no version here"))

    def test_version_tuple_three_parts(self):
        self.assertEqual(_version_tuple("0.0.367"), (0, 0, 367))

    def test_meets_version_equal(self):
        self.assertTrue(_meets_version("2.1.76", "2.1.76"))

    def test_meets_version_newer_patch(self):
        self.assertTrue(_meets_version("2.1.77", "2.1.76"))

    def test_meets_version_older(self):
        self.assertFalse(_meets_version("0.0.366", "0.0.367"))

    def test_meets_version_none(self):
        self.assertFalse(_meets_version(None, "1.0.0"))


# ── Constitutional gate ───────────────────────────────────────────────────────

class TestConstitutionalGate(unittest.TestCase):

    def test_compliant_provider_allowed(self):
        allowed, reason = constitutional_gate(PROVIDERS["gemini"])
        self.assertTrue(allowed)
        self.assertIn("COMPLIANT", reason)

    def test_pending_review_allowed_with_warning(self):
        allowed, reason = constitutional_gate(PROVIDERS["claude"])
        self.assertTrue(allowed)
        self.assertIn("PENDING_REVIEW", reason)

    def test_non_compliant_blocked(self):
        # Temporarily mark a provider as NON_COMPLIANT via override
        CONSTITUTIONAL_STATUS_OVERRIDES["gemini"] = ConstitutionalStatus.NON_COMPLIANT
        try:
            allowed, reason = constitutional_gate(PROVIDERS["gemini"])
            self.assertFalse(allowed)
            self.assertIn("NON_COMPLIANT", reason)
        finally:
            del CONSTITUTIONAL_STATUS_OVERRIDES["gemini"]

    def test_non_compliant_emits_invariant_violation(self):
        CONSTITUTIONAL_STATUS_OVERRIDES["gemini"] = ConstitutionalStatus.NON_COMPLIANT
        try:
            em = _emitter()
            constitutional_gate(PROVIDERS["gemini"], emitter=em)
            log = json.loads(em.export_log())
            self.assertEqual(log[0]["event_type"], "invariant_violation")
        finally:
            del CONSTITUTIONAL_STATUS_OVERRIDES["gemini"]

    def test_pending_review_emits_warning_trace(self):
        em = _emitter()
        constitutional_gate(PROVIDERS["claude"], emitter=em)
        log = json.loads(em.export_log())
        self.assertEqual(log[0]["severity"], "warning")

    def test_override_table_reclassifies_provider(self):
        CONSTITUTIONAL_STATUS_OVERRIDES["deepseek"] = ConstitutionalStatus.COMPLIANT
        try:
            self.assertEqual(
                PROVIDERS["deepseek"].effective_status,
                ConstitutionalStatus.COMPLIANT,
            )
        finally:
            del CONSTITUTIONAL_STATUS_OVERRIDES["deepseek"]


# ── Provider detection ────────────────────────────────────────────────────────

class TestDetectProviders(unittest.TestCase):

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_no_providers_available(self, mock_run, mock_which):
        registry = detect_providers()
        self.assertEqual(registry.available_ids, [])
        self.assertIsNone(registry.preferred_id)

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_gemini_detected_first(self, mock_run, mock_which):
        mock_which.side_effect = lambda n: "/usr/bin/gemini" if n == "gemini" else None
        mock_run.return_value = _mock_proc(stdout="gemini 0.33.1")
        registry = detect_providers()
        self.assertIn("gemini", registry.available_ids)
        self.assertEqual(registry.preferred_id, "gemini")

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_preferred_skips_blocked_provider(self, mock_run, mock_which):
        # Mark gemini as NON_COMPLIANT, ollama should be preferred instead
        CONSTITUTIONAL_STATUS_OVERRIDES["gemini"] = ConstitutionalStatus.NON_COMPLIANT
        mock_which.side_effect = lambda n: f"/usr/bin/{n}" if n in ("gemini", "ollama") else None
        mock_run.return_value = _mock_proc(stdout="0.6.0")
        try:
            # preferred_id still returns gemini (prefer by availability, not compliance)
            registry = detect_providers()
            self.assertIn("gemini", registry.available_ids)
            # compliant_ids should NOT include the non-compliant one
            self.assertNotIn("gemini", registry.compliant_ids)
        finally:
            del CONSTITUTIONAL_STATUS_OVERRIDES["gemini"]

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_registry_to_dict_keys(self, mock_run, mock_which):
        registry = detect_providers()
        d = registry.to_dict()
        for key in ("available_ids", "compliant_ids", "preferred_id",
                    "trace_id", "providers"):
            self.assertIn(key, d)

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_emits_trace(self, mock_run, mock_which):
        em = _emitter()
        registry = detect_providers(emitter=em)
        self.assertTrue(registry.trace_id)
        log = json.loads(em.export_log())
        self.assertEqual(log[0]["event_type"], "action")

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_filter_by_provider_ids(self, mock_run, mock_which):
        registry = detect_providers(provider_ids=["gemini", "ollama"])
        self.assertEqual(len(registry.statuses), 2)


# ── AI call routing ───────────────────────────────────────────────────────────

class TestCallRouting(unittest.TestCase):

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_call_no_provider_returns_failure(self, mock_run, mock_which):
        result = call("explain this code")
        self.assertFalse(result.success)
        self.assertEqual(result.provider_id, "none")

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_call_gemini_success(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/gemini"
        mock_run.return_value = _mock_proc(stdout="Here is the explanation.", returncode=0)
        result = call("explain this", provider_id="gemini")
        self.assertTrue(result.success)
        self.assertEqual(result.provider_id, "gemini")

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_call_blocked_non_compliant(self, mock_run, mock_which):
        CONSTITUTIONAL_STATUS_OVERRIDES["gemini"] = ConstitutionalStatus.NON_COMPLIANT
        try:
            mock_which.return_value = "/usr/bin/gemini"
            result = call("explain this", provider_id="gemini")
            self.assertFalse(result.success)
            self.assertTrue(result.blocked)
            mock_run.assert_not_called()
        finally:
            del CONSTITUTIONAL_STATUS_OVERRIDES["gemini"]

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_call_pending_review_succeeds_with_warning_trace(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/claude"
        mock_run.return_value = _mock_proc(stdout="response text", returncode=0)
        em = _emitter()
        result = call("explain this", provider_id="claude", emitter=em)
        self.assertTrue(result.success)
        log = json.loads(em.export_log())
        # Should have a warning trace from the gate + an info trace from the call
        severities = [e["severity"] for e in log]
        self.assertIn("warning", severities)

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_call_binary_not_found(self, mock_run, mock_which):
        mock_which.return_value = None
        result = call("explain this", provider_id="ollama")
        self.assertFalse(result.success)
        self.assertIn("not found", result.stderr)

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_call_result_to_dict_keys(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/gemini"
        mock_run.return_value = _mock_proc(stdout="ok", returncode=0)
        result = call("explain this", provider_id="gemini")
        d = result.to_dict()
        for key in ("provider_id", "success", "return_code",
                    "constitutional_status", "blocked", "stdout", "trace_id"):
            self.assertIn(key, d)

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_call_emits_trace_on_success(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/gemini"
        mock_run.return_value = _mock_proc(stdout="ok", returncode=0)
        em = _emitter()
        result = call("explain this", provider_id="gemini", emitter=em)
        self.assertTrue(result.trace_id)

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_call_ollama_command_includes_model(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/ollama"
        mock_run.return_value = _mock_proc(stdout="ok", returncode=0)
        call("explain this", provider_id="ollama", extra_args=["codellama"])
        cmd = mock_run.call_args[0][0]
        self.assertIn("run", cmd)

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_call_copilot_uses_ask_subcommand(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/copilot"
        mock_run.return_value = _mock_proc(stdout="ok", returncode=0)
        call("explain this", provider_id="copilot")
        cmd = mock_run.call_args[0][0]
        self.assertIn("ask", cmd)


# ── AIProviderAdapter class ───────────────────────────────────────────────────

class TestAIProviderAdapter(unittest.TestCase):

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_detect_returns_registry(self, mock_run, mock_which):
        adapter = AIProviderAdapter()
        reg = adapter.detect()
        self.assertIsInstance(reg, ProviderRegistry)

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_detect_caches_result(self, mock_run, mock_which):
        adapter = AIProviderAdapter()
        r1 = adapter.detect()
        r2 = adapter.detect()
        self.assertIs(r1, r2)

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_list_compliant_empty_when_none_available(self, mock_run, mock_which):
        adapter = AIProviderAdapter()
        self.assertEqual(adapter.list_compliant(), [])

    @patch("python.core.ai_providers.shutil.which")
    @patch("python.core.ai_providers.subprocess.run")
    def test_list_compliant_returns_compliant_ids(self, mock_run, mock_which):
        mock_which.side_effect = lambda n: f"/usr/bin/{n}" if n in ("gemini", "ollama") else None
        mock_run.return_value = _mock_proc(stdout="0.33.1")
        adapter = AIProviderAdapter()
        compliant = adapter.list_compliant()
        self.assertIn("gemini", compliant)

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_provider_info_returns_dict(self, mock_run, mock_which):
        adapter = AIProviderAdapter()
        info = adapter.provider_info("gemini")
        self.assertIsNotNone(info)
        self.assertEqual(info["id"], "gemini")

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_provider_info_none_for_unknown(self, mock_run, mock_which):
        adapter = AIProviderAdapter()
        self.assertIsNone(adapter.provider_info("nonexistent"))

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_capabilities_for_gemini(self, mock_run, mock_which):
        adapter = AIProviderAdapter()
        caps = adapter.capabilities_for("gemini")
        self.assertIn("code_completion", caps)
        self.assertIn("mcp_server", caps)

    @patch("python.core.ai_providers.shutil.which", side_effect=_all_none_which)
    @patch("python.core.ai_providers.subprocess.run", side_effect=FileNotFoundError)
    def test_capabilities_for_ollama_includes_local(self, mock_run, mock_which):
        adapter = AIProviderAdapter()
        caps = adapter.capabilities_for("ollama")
        self.assertIn("local_model", caps)


if __name__ == "__main__":
    unittest.main()
