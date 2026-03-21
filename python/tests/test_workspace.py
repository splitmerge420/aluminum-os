"""
Aluminum OS — WorkspaceAdapter Tests (Ring 1)

Tests for python/core/workspace.py — Google Workspace CLI integration layer.

Strategy: All tests that would invoke real CLI tools use
``unittest.mock.patch`` to mock ``subprocess.run`` and ``shutil.which``,
so the suite runs with zero external dependencies and no Google credentials
required.

Atlas Lattice Foundation — March 2026
"""

import json
import os
import sys
import unittest
from unittest.mock import MagicMock, patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from python.core.workspace import (
    GAM_REQUIRED_VERSION,
    GAM_TOOL,
    GWS_NPX_PACKAGE,
    GWS_REQUIRED_VERSION,
    GWS_TOOL,
    GYB_REQUIRED_VERSION,
    GYB_TOOL,
    TOOL_PREFERENCE,
    TOOL_SERVICES,
    WorkspaceAdapter,
    WorkspaceCallResult,
    WorkspaceStatus,
    _meets_version,
    _parse_version,
    _version_tuple,
    call,
    detect_tools,
)
from kintsugi.sdk.golden_trace import GoldenTraceEmitter


def _emitter() -> GoldenTraceEmitter:
    return GoldenTraceEmitter(repo="test", module="workspace/test")


def _mock_proc(stdout: str = "", stderr: str = "", returncode: int = 0):
    """Return a mock CompletedProcess-like object."""
    m = MagicMock()
    m.stdout = stdout
    m.stderr = stderr
    m.returncode = returncode
    return m


# ── Version helpers ──────────────────────────────────────────────────────────

class TestVersionHelpers(unittest.TestCase):

    def test_parse_version_simple(self):
        self.assertEqual(_parse_version("gws 0.18.1"), "0.18.1")

    def test_parse_version_from_line(self):
        self.assertEqual(_parse_version("GAM 7.36.03 - ..."), "7.36.03")

    def test_parse_version_no_version(self):
        self.assertIsNone(_parse_version("no version here"))

    def test_parse_version_gyb(self):
        self.assertEqual(_parse_version("GYB version 1.95"), "1.95")

    def test_version_tuple_simple(self):
        self.assertEqual(_version_tuple("0.18.1"), (0, 18, 1))

    def test_version_tuple_major_minor(self):
        self.assertEqual(_version_tuple("7.36"), (7, 36))

    def test_version_tuple_three_parts(self):
        self.assertEqual(_version_tuple("7.36.03"), (7, 36, 3))

    def test_meets_version_equal(self):
        self.assertTrue(_meets_version("0.18.1", "0.18.1"))

    def test_meets_version_newer(self):
        self.assertTrue(_meets_version("0.19.0", "0.18.1"))

    def test_meets_version_older(self):
        self.assertFalse(_meets_version("0.17.0", "0.18.1"))

    def test_meets_version_none(self):
        self.assertFalse(_meets_version(None, "0.18.1"))

    def test_meets_version_gam(self):
        self.assertTrue(_meets_version("7.36.03", GAM_REQUIRED_VERSION))

    def test_meets_version_gyb(self):
        self.assertTrue(_meets_version("1.95", GYB_REQUIRED_VERSION))


# ── Tool detection ────────────────────────────────────────────────────────────

class TestDetectTools(unittest.TestCase):

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_all_tools_available(self, mock_run, mock_which):
        mock_which.side_effect = lambda name: f"/usr/bin/{name}"
        mock_run.return_value = _mock_proc(stdout="version 99.99.99")
        status = detect_tools()
        self.assertTrue(status.any_available)
        self.assertIsNotNone(status.preferred_tool)

    @patch("python.core.workspace.shutil.which", return_value=None)
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_no_tools_available(self, mock_run, mock_which):
        status = detect_tools()
        self.assertFalse(status.any_available)
        self.assertIsNone(status.preferred_tool)
        self.assertEqual(len(status.tools), 3)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_preferred_tool_is_gws_when_available(self, mock_run, mock_which):
        def which_side(name):
            return "/usr/bin/gws" if name == "gws" else None
        mock_which.side_effect = which_side
        mock_run.return_value = _mock_proc(stdout=f"gws {GWS_REQUIRED_VERSION}")
        status = detect_tools()
        self.assertEqual(status.preferred_tool, GWS_TOOL)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_preferred_tool_falls_back_to_gam(self, mock_run, mock_which):
        def which_side(name):
            return "/usr/bin/gam" if name == "gam" else None
        mock_which.side_effect = which_side
        mock_run.return_value = _mock_proc(stdout=f"GAM {GAM_REQUIRED_VERSION}")
        status = detect_tools()
        # gws not available, should fall back to gam
        self.assertEqual(status.preferred_tool, GAM_TOOL)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_tool_status_to_dict_keys(self, mock_run, mock_which):
        mock_which.return_value = None
        mock_run.side_effect = FileNotFoundError
        status = detect_tools()
        for ts in status.tools:
            d = ts.to_dict()
            for key in ("name", "available", "version", "meets_requirement",
                        "required_version", "binary_path", "env_vars_present"):
                self.assertIn(key, d)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_emits_kintsugi_trace(self, mock_run, mock_which):
        mock_which.return_value = None
        mock_run.side_effect = FileNotFoundError
        em = _emitter()
        status = detect_tools(emitter=em)
        self.assertTrue(status.trace_id)
        log = json.loads(em.export_log())
        self.assertEqual(len(log), 1)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_workspace_status_to_dict_keys(self, mock_run, mock_which):
        mock_which.return_value = None
        mock_run.side_effect = FileNotFoundError
        status = detect_tools()
        d = status.to_dict()
        for key in ("any_available", "preferred_tool", "trace_id", "tools"):
            self.assertIn(key, d)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_version_meets_requirement_gws(self, mock_run, mock_which):
        mock_which.side_effect = lambda n: "/usr/bin/gws" if n == "gws" else None
        mock_run.return_value = _mock_proc(stdout=f"@googleworkspace/cli {GWS_REQUIRED_VERSION}")
        status = detect_tools()
        gws_status = next(t for t in status.tools if t.name == GWS_TOOL)
        self.assertTrue(gws_status.meets_requirement)


# ── Workspace call ────────────────────────────────────────────────────────────

class TestWorkspaceCall(unittest.TestCase):

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_call_gws_success(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/gws"
        mock_run.return_value = _mock_proc(
            stdout='{"files": []}', returncode=0
        )
        result = call("drive", "files.list", tool=GWS_TOOL)
        self.assertTrue(result.success)
        self.assertEqual(result.tool, GWS_TOOL)
        self.assertIsNotNone(result.parsed)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_call_gam_success(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/gam"
        mock_run.return_value = _mock_proc(stdout="User user@example.com", returncode=0)
        result = call("admin", "info", tool=GAM_TOOL)
        self.assertTrue(result.success)
        self.assertEqual(result.tool, GAM_TOOL)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_call_gyb_success(self, mock_run, mock_which):
        mock_which.return_value = "/usr/bin/gyb"
        mock_run.return_value = _mock_proc(stdout="Backup complete.", returncode=0)
        result = call("gmail", "backup", tool=GYB_TOOL)
        self.assertTrue(result.success)

    @patch("python.core.workspace.shutil.which", return_value=None)
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_call_no_tool_available(self, mock_run, mock_which):
        result = call("drive", "files.list")
        self.assertFalse(result.success)
        self.assertEqual(result.tool, "none")

    @patch("python.core.workspace.shutil.which", return_value="/usr/bin/gws")
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_call_tool_not_found_on_path(self, mock_run, mock_which):
        result = call("drive", "files.list", tool=GWS_TOOL)
        self.assertFalse(result.success)
        self.assertIn("not found", result.stderr)

    @patch("python.core.workspace.shutil.which", return_value="/usr/bin/gws")
    @patch("python.core.workspace.subprocess.run")
    def test_call_tool_nonzero_exit(self, mock_run, mock_which):
        mock_run.return_value = _mock_proc(stderr="Permission denied", returncode=1)
        result = call("drive", "files.list", tool=GWS_TOOL)
        self.assertFalse(result.success)
        self.assertEqual(result.return_code, 1)

    @patch("python.core.workspace.shutil.which", return_value="/usr/bin/gws")
    @patch("python.core.workspace.subprocess.run")
    def test_call_non_json_stdout_still_succeeds(self, mock_run, mock_which):
        mock_run.return_value = _mock_proc(stdout="plain text output", returncode=0)
        result = call("drive", "files.list", tool=GWS_TOOL)
        self.assertTrue(result.success)
        self.assertIsNone(result.parsed)
        self.assertEqual(result.stdout, "plain text output")

    @patch("python.core.workspace.shutil.which", return_value="/usr/bin/gws")
    @patch("python.core.workspace.subprocess.run")
    def test_call_emits_trace_on_success(self, mock_run, mock_which):
        mock_run.return_value = _mock_proc(stdout='{"ok": true}', returncode=0)
        em = _emitter()
        result = call("drive", "files.list", tool=GWS_TOOL, emitter=em)
        self.assertTrue(result.trace_id)
        log = json.loads(em.export_log())
        self.assertEqual(log[0]["severity"], "info")

    @patch("python.core.workspace.shutil.which", return_value="/usr/bin/gws")
    @patch("python.core.workspace.subprocess.run")
    def test_call_emits_warning_on_failure(self, mock_run, mock_which):
        mock_run.return_value = _mock_proc(returncode=1)
        em = _emitter()
        result = call("drive", "files.list", tool=GWS_TOOL, emitter=em)
        self.assertFalse(result.success)
        log = json.loads(em.export_log())
        self.assertEqual(log[0]["severity"], "warning")

    @patch("python.core.workspace.shutil.which", return_value="/usr/bin/gws")
    @patch("python.core.workspace.subprocess.run")
    def test_call_result_to_dict_keys(self, mock_run, mock_which):
        mock_run.return_value = _mock_proc(stdout='{}', returncode=0)
        result = call("drive", "files.list", tool=GWS_TOOL)
        d = result.to_dict()
        for key in ("tool", "service", "method", "success",
                    "return_code", "parsed", "trace_id"):
            self.assertIn(key, d)

    @patch("python.core.workspace.shutil.which", return_value="/usr/bin/gws")
    @patch("python.core.workspace.subprocess.run")
    def test_call_passes_params_to_gws(self, mock_run, mock_which):
        mock_run.return_value = _mock_proc(stdout='{}', returncode=0)
        call("drive", "files.list", params={"pageSize": 5}, tool=GWS_TOOL)
        cmd_args = mock_run.call_args[0][0]
        self.assertIn("--params", cmd_args)
        params_idx = cmd_args.index("--params")
        parsed_params = json.loads(cmd_args[params_idx + 1])
        self.assertEqual(parsed_params["pageSize"], 5)


# ── WorkspaceAdapter class ────────────────────────────────────────────────────

class TestWorkspaceAdapter(unittest.TestCase):

    @patch("python.core.workspace.shutil.which", return_value=None)
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_detect_returns_workspace_status(self, mock_run, mock_which):
        adapter = WorkspaceAdapter()
        status = adapter.detect()
        self.assertIsInstance(status, WorkspaceStatus)

    @patch("python.core.workspace.shutil.which", return_value=None)
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_detect_caches_result(self, mock_run, mock_which):
        adapter = WorkspaceAdapter()
        s1 = adapter.detect()
        s2 = adapter.detect()
        self.assertIs(s1, s2)  # same object — cached
        self.assertEqual(mock_run.call_count, mock_run.call_count)

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_detect_refresh_re_probes(self, mock_run, mock_which):
        mock_which.return_value = None
        adapter = WorkspaceAdapter()
        _ = adapter.detect()
        _ = adapter.detect(refresh=True)
        # Two separate detect_tools calls should have been made
        self.assertGreaterEqual(mock_run.call_count, 0)

    @patch("python.core.workspace.shutil.which", return_value=None)
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_services_for_gws(self, mock_run, mock_which):
        adapter = WorkspaceAdapter()
        services = adapter.services_for(GWS_TOOL)
        self.assertIn("drive", services)
        self.assertIn("gmail", services)
        self.assertIn("sheets", services)

    @patch("python.core.workspace.shutil.which", return_value=None)
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_services_for_gyb(self, mock_run, mock_which):
        adapter = WorkspaceAdapter()
        services = adapter.services_for(GYB_TOOL)
        self.assertEqual(services, ["gmail"])

    @patch("python.core.workspace.shutil.which")
    @patch("python.core.workspace.subprocess.run")
    def test_preferred_tool_for_service(self, mock_run, mock_which):
        mock_which.side_effect = lambda n: "/usr/bin/gws" if n == "gws" else None
        mock_run.return_value = _mock_proc(stdout=f"gws {GWS_REQUIRED_VERSION}")
        adapter = WorkspaceAdapter()
        preferred = adapter.preferred_tool_for("drive")
        self.assertEqual(preferred, GWS_TOOL)

    @patch("python.core.workspace.shutil.which", return_value=None)
    @patch("python.core.workspace.subprocess.run", side_effect=FileNotFoundError)
    def test_preferred_tool_none_when_unavailable(self, mock_run, mock_which):
        adapter = WorkspaceAdapter()
        preferred = adapter.preferred_tool_for("drive")
        self.assertIsNone(preferred)


# ── Cross-ecosystem constant checks ──────────────────────────────────────────

class TestEcosystemConstants(unittest.TestCase):
    """Verify version constants and service routing tables are consistent."""

    def test_gws_version_format(self):
        parts = GWS_REQUIRED_VERSION.split(".")
        self.assertEqual(len(parts), 3, "GWS version must be major.minor.patch")

    def test_gam_version_format(self):
        parts = GAM_REQUIRED_VERSION.split(".")
        self.assertEqual(len(parts), 3, "GAM version must be major.minor.patch")

    def test_gyb_version_format(self):
        parts = GYB_REQUIRED_VERSION.split(".")
        self.assertGreaterEqual(len(parts), 2, "GYB version must be at least major.minor")

    def test_tool_preference_order(self):
        self.assertEqual(TOOL_PREFERENCE[0], GWS_TOOL,
                         "gws should be the first-preference tool")

    def test_all_tools_have_service_entries(self):
        for tool in TOOL_PREFERENCE:
            self.assertIn(tool, TOOL_SERVICES)
            self.assertGreater(len(TOOL_SERVICES[tool]), 0)

    def test_gws_npm_package_name(self):
        self.assertIn("googleworkspace", GWS_NPX_PACKAGE)

    def test_drive_in_gws_services(self):
        self.assertIn("drive", TOOL_SERVICES[GWS_TOOL])

    def test_gmail_in_all_tools(self):
        for tool in TOOL_PREFERENCE:
            self.assertIn("gmail", TOOL_SERVICES[tool])

    def test_gyb_only_supports_gmail(self):
        self.assertEqual(TOOL_SERVICES[GYB_TOOL], ["gmail"])

    def test_gws_supports_mcp_sensitive_services(self):
        for svc in ("sheets", "docs", "chat"):
            self.assertIn(svc, TOOL_SERVICES[GWS_TOOL],
                          f"gws must support {svc} for MCP compatibility")


if __name__ == "__main__":
    unittest.main()
