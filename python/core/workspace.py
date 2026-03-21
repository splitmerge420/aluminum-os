"""
Aluminum OS — WorkspaceAdapter (Google Workspace CLI Integration Layer)

Zero-dependency Python module (stdlib only: subprocess, os, json, re,
shutil) that bridges Aluminum OS and the Google Workspace CLI ecosystem.

Supported tools and their canonical versions (March 2026):

  gws   @googleworkspace/cli v0.18.1  — official Google Workspace CLI (Node.js 18+)
                                         npm: npx @googleworkspace/cli@0.18.1
                                         GitHub: github.com/googleworkspace/cli
                                         Supports: Drive, Gmail, Calendar, Sheets,
                                           Docs, Chat, Admin SDK, MCP server mode.
                                         Dynamic API surface via Google Discovery.

  gam   GAM 7.36.03                   — Google Apps Manager (Python 3.10+)
                                         pip: gam7==7.36.03 (or standalone binary)
                                         GitHub: github.com/GAM-team/GAM
                                         Supports: Admin SDK, Users, Groups,
                                           Chrome devices, Drive, Gmail, Reports.

  gyb   GYB 1.95                      — Got Your Back (Python 3.10+)
                                         GitHub: github.com/GAM-team/got-your-back
                                         Supports: Gmail backup and restore.

All three tools output JSON on stdout when given the appropriate flags.
WorkspaceAdapter normalises this into a consistent result structure and
emits a Kintsugi Golden-Trace for every operation.

Cross-ecosystem compatibility guarantee:
  - Pure stdlib — no google-api-python-client or gws npm install required.
  - Graceful degradation: missing tools are reported as unavailable, not
    raised as exceptions, so the rest of the system continues operating.
  - Authentication is entirely delegated to the CLI tools (no credentials
    stored in this module). Required env-vars are documented per-tool.

Atlas Lattice Foundation — March 2026
"""

import json
import os
import re
import shutil
import subprocess
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

from kintsugi.sdk.golden_trace import GoldenTraceEmitter


# ── Canonical version pins (March 2026) ──────────────────────────────────────

GWS_TOOL = "gws"
GWS_NPX_PACKAGE = "@googleworkspace/cli"
GWS_REQUIRED_VERSION = "0.18.1"
GWS_INSTALL_HINT = (
    "Install: npx @googleworkspace/cli@0.18.1  (requires Node.js ≥ 18)\n"
    "  or: npm install -g @googleworkspace/cli@0.18.1\n"
    "  GitHub: https://github.com/googleworkspace/cli"
)

GAM_TOOL = "gam"
GAM_REQUIRED_VERSION = "7.36.03"
GAM_INSTALL_HINT = (
    "Install: pip install gam7==7.36.03  (requires Python ≥ 3.10)\n"
    "  or: download binary from https://github.com/GAM-team/GAM/releases/tag/v7.36.03"
)

GYB_TOOL = "gyb"
GYB_REQUIRED_VERSION = "1.95"
GYB_INSTALL_HINT = (
    "Install: download binary from https://github.com/GAM-team/got-your-back/releases/tag/v1.95\n"
    "  GitHub: https://github.com/GAM-team/got-your-back"
)

# Ordered by preference for general workspace operations.
TOOL_PREFERENCE: List[str] = [GWS_TOOL, GAM_TOOL, GYB_TOOL]

# Services supported by each tool (for routing purposes).
TOOL_SERVICES: Dict[str, List[str]] = {
    GWS_TOOL: [
        "drive", "gmail", "calendar", "sheets", "docs",
        "chat", "admin", "contacts", "tasks",
    ],
    GAM_TOOL: [
        "admin", "users", "groups", "drive", "gmail",
        "calendar", "chrome", "reports",
    ],
    GYB_TOOL: ["gmail"],
}

# Required environment variables for OAuth2 (user must configure these).
REQUIRED_ENV_VARS: Dict[str, List[str]] = {
    GWS_TOOL: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    GAM_TOOL: [],  # gam manages its own credentials in ~/.gam/
    GYB_TOOL: [],  # gyb manages its own credentials in ~/.gyb/
}

# Version regex patterns for parsing CLI --version output.
_VERSION_RE = re.compile(r"(\d+\.\d+(?:\.\d+)?)")


# ── Data types ────────────────────────────────────────────────────────────────

@dataclass
class ToolStatus:
    """Installation and version status of a single CLI tool."""
    name: str
    available: bool
    version: Optional[str]
    meets_requirement: bool
    required_version: str
    install_hint: str
    binary_path: Optional[str] = None
    env_vars_present: bool = True

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "available": self.available,
            "version": self.version,
            "meets_requirement": self.meets_requirement,
            "required_version": self.required_version,
            "binary_path": self.binary_path,
            "env_vars_present": self.env_vars_present,
            "install_hint": self.install_hint if not self.available else "",
        }


@dataclass
class WorkspaceStatus:
    """Aggregate status for all Google Workspace CLI tools."""
    tools: List[ToolStatus] = field(default_factory=list)
    any_available: bool = False
    preferred_tool: Optional[str] = None
    trace_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "any_available": self.any_available,
            "preferred_tool": self.preferred_tool,
            "trace_id": self.trace_id,
            "tools": [t.to_dict() for t in self.tools],
        }


@dataclass
class WorkspaceCallResult:
    """Result of a single CLI tool invocation."""
    tool: str
    service: str
    method: str
    success: bool
    stdout: str
    stderr: str
    return_code: int
    parsed: Optional[Any] = None   # JSON-parsed stdout if available
    trace_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "tool": self.tool,
            "service": self.service,
            "method": self.method,
            "success": self.success,
            "return_code": self.return_code,
            "parsed": self.parsed,
            "trace_id": self.trace_id,
        }


# ── Version helpers ───────────────────────────────────────────────────────────

def _parse_version(text: str) -> Optional[str]:
    """Extract the first semver-like version string from *text*."""
    m = _VERSION_RE.search(text)
    return m.group(1) if m else None


def _version_tuple(v: str) -> Tuple[int, ...]:
    """Convert a version string such as '7.36.03' to a comparable tuple."""
    parts = []
    for p in v.split("."):
        try:
            parts.append(int(p))
        except ValueError:
            parts.append(0)
    return tuple(parts)


def _meets_version(actual: Optional[str], required: str) -> bool:
    """Return True when *actual* is ≥ *required* (lexicographic semver compare)."""
    if actual is None:
        return False
    return _version_tuple(actual) >= _version_tuple(required)


# ── Tool detection ────────────────────────────────────────────────────────────

def _probe_tool_version(tool: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """Attempt to run ``<tool> --version`` and return (found, version, path).

    Uses :func:`shutil.which` first; if not found on PATH, tries ``npx`` for
    ``gws`` so it works even without a global npm install.

    Returns:
        Tuple of (available, version_string, binary_path).
    """
    binary = shutil.which(tool)
    try_commands: List[List[str]] = []

    if binary:
        try_commands.append([binary, "--version"])
    # gws may be available via npx even without a global install,
    # but only try npx if it is itself on PATH.
    if tool == GWS_TOOL and shutil.which("npx"):
        try_commands.append(["npx", "--yes", GWS_NPX_PACKAGE, "--version"])

    for cmd in try_commands:
        try:
            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=15,
            )
            combined = (proc.stdout + proc.stderr).strip()
            version = _parse_version(combined)
            return True, version, shutil.which(cmd[0])
        except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
            continue

    return False, None, None


def _check_env_vars(tool: str) -> bool:
    """Return True if all required environment variables for *tool* are set."""
    return all(os.environ.get(v) for v in REQUIRED_ENV_VARS.get(tool, []))


def detect_tools(
    emitter: Optional[GoldenTraceEmitter] = None,
) -> WorkspaceStatus:
    """Probe each supported Google Workspace CLI tool.

    Checks availability, version, and required environment variables.
    No credentials are read or validated — only their *presence* is checked.

    Args:
        emitter: Optional Kintsugi emitter for audit trace.

    Returns:
        WorkspaceStatus describing every tool's installation state.
    """
    tool_configs = [
        (GWS_TOOL, GWS_REQUIRED_VERSION, GWS_INSTALL_HINT),
        (GAM_TOOL, GAM_REQUIRED_VERSION, GAM_INSTALL_HINT),
        (GYB_TOOL, GYB_REQUIRED_VERSION, GYB_INSTALL_HINT),
    ]
    statuses: List[ToolStatus] = []
    for name, required, hint in tool_configs:
        available, version, path = _probe_tool_version(name)
        meets = _meets_version(version, required) if available else False
        env_ok = _check_env_vars(name)
        statuses.append(ToolStatus(
            name=name,
            available=available,
            version=version,
            meets_requirement=meets,
            required_version=required,
            install_hint=hint,
            binary_path=path,
            env_vars_present=env_ok,
        ))

    available_tools = [s.name for s in statuses if s.available]
    preferred = next(
        (t for t in TOOL_PREFERENCE if t in available_tools), None
    )
    ws_status = WorkspaceStatus(
        tools=statuses,
        any_available=len(available_tools) > 0,
        preferred_tool=preferred,
    )

    if emitter is not None:
        trace = emitter.emit(
            event_type="action",
            sphere_tag="H1.S2",
            aluminum_layer="L1-Constitutional",
            function="detect_tools",
            severity="info",
            payload={
                "tools_found": available_tools,
                "preferred": preferred,
            },
        )
        ws_status.trace_id = trace["trace_id"]

    return ws_status


# ── Unified caller ────────────────────────────────────────────────────────────

def _build_gws_command(
    service: str,
    method: str,
    params: Optional[Dict[str, Any]] = None,
) -> List[str]:
    """Build a ``gws <service> <method> [--params JSON]`` invocation."""
    cmd = [GWS_TOOL, service, method]
    if params:
        cmd += ["--params", json.dumps(params)]
    return cmd


def _build_gam_command(
    service: str,
    method: str,
    params: Optional[Dict[str, Any]] = None,
) -> List[str]:
    """Build a ``gam <service> <method> [key value ...]`` invocation.

    GAM uses positional key-value pairs rather than JSON params.  For
    services and methods that map directly to GAM syntax, this produces
    a runnable command.  For advanced operations use ``gws`` instead.
    """
    cmd = ["gam", service, method]
    if params:
        for k, v in params.items():
            cmd += [str(k), str(v)]
    return cmd


def _build_gyb_command(
    service: str,
    method: str,
    params: Optional[Dict[str, Any]] = None,
) -> List[str]:
    """Build a ``gyb --action <method> [options]`` invocation.

    GYB only operates on Gmail; service is ignored.
    """
    cmd = ["gyb", "--action", method]
    if params:
        for k, v in params.items():
            cmd += [f"--{k}", str(v)]
    return cmd


_COMMAND_BUILDERS = {
    GWS_TOOL: _build_gws_command,
    GAM_TOOL: _build_gam_command,
    GYB_TOOL: _build_gyb_command,
}


def call(
    service: str,
    method: str,
    params: Optional[Dict[str, Any]] = None,
    tool: Optional[str] = None,
    timeout: int = 30,
    emitter: Optional[GoldenTraceEmitter] = None,
) -> WorkspaceCallResult:
    """Execute a Google Workspace CLI operation.

    Resolves the appropriate tool automatically based on *service* unless
    *tool* is explicitly provided.  Falls back gracefully if the preferred
    tool is not installed.

    Args:
        service:  Workspace service name (e.g. ``"drive"``, ``"gmail"``).
        method:   Method or sub-command (e.g. ``"files.list"``).
        params:   Optional dict of parameters forwarded to the CLI tool.
        tool:     Force a specific tool (``"gws"``, ``"gam"``, or ``"gyb"``).
                  When None, auto-selects based on service availability.
        timeout:  Subprocess timeout in seconds (default: 30).
        emitter:  Optional Kintsugi emitter for audit trace.

    Returns:
        WorkspaceCallResult with stdout, stderr, parsed JSON, and trace_id.
    """
    # Resolve which tool to use
    if tool is None:
        tool = _resolve_tool(service)

    if tool is None:
        result = WorkspaceCallResult(
            tool="none",
            service=service,
            method=method,
            success=False,
            stdout="",
            stderr="No suitable Google Workspace CLI tool is installed.",
            return_code=-1,
        )
        _emit_call_trace(emitter, result)
        return result

    builder = _COMMAND_BUILDERS.get(tool, _build_gws_command)
    cmd = builder(service, method, params)

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        parsed: Optional[Any] = None
        try:
            parsed = json.loads(proc.stdout)
        except (json.JSONDecodeError, ValueError):
            pass  # stdout may not be JSON (plain text output)

        result = WorkspaceCallResult(
            tool=tool,
            service=service,
            method=method,
            success=proc.returncode == 0,
            stdout=proc.stdout,
            stderr=proc.stderr,
            return_code=proc.returncode,
            parsed=parsed,
        )
    except FileNotFoundError:
        result = WorkspaceCallResult(
            tool=tool,
            service=service,
            method=method,
            success=False,
            stdout="",
            stderr=f"Tool '{tool}' not found on PATH.",
            return_code=-1,
        )
    except subprocess.TimeoutExpired:
        result = WorkspaceCallResult(
            tool=tool,
            service=service,
            method=method,
            success=False,
            stdout="",
            stderr=f"Tool '{tool}' timed out after {timeout}s.",
            return_code=-1,
        )

    _emit_call_trace(emitter, result)
    return result


def _resolve_tool(service: str) -> Optional[str]:
    """Return the first available tool that supports *service*."""
    for tool in TOOL_PREFERENCE:
        if service not in TOOL_SERVICES.get(tool, []):
            continue
        if shutil.which(tool):
            return tool
    # gws may be available via npx even without a global binary
    if service in TOOL_SERVICES.get(GWS_TOOL, []):
        if shutil.which("npx"):
            return GWS_TOOL
    return None


def _emit_call_trace(
    emitter: Optional[GoldenTraceEmitter],
    result: WorkspaceCallResult,
) -> None:
    """Emit a Kintsugi trace for a workspace call and attach trace_id."""
    if emitter is None:
        return
    severity = "info" if result.success else "warning"
    trace = emitter.emit(
        event_type="action",
        sphere_tag="H1.S2",
        aluminum_layer="L1-Constitutional",
        function="workspace.call",
        severity=severity,
        payload={
            "tool": result.tool,
            "service": result.service,
            "method": result.method,
            "success": result.success,
            "return_code": result.return_code,
        },
    )
    result.trace_id = trace["trace_id"]


# ── High-level adapter class ──────────────────────────────────────────────────

class WorkspaceAdapter:
    """High-level interface that combines detect + call + status.

    Intended as the primary entry-point for Aluminum OS Ring 1 code that
    needs to interact with Google Workspace APIs via the CLI layer.

    Usage::

        adapter = WorkspaceAdapter(emitter=my_emitter)
        ws_status = adapter.detect()
        if ws_status.any_available:
            result = adapter.call("drive", "files.list", {"pageSize": 10})
    """

    def __init__(self, emitter: Optional[GoldenTraceEmitter] = None):
        self._emitter = emitter
        self._status_cache: Optional[WorkspaceStatus] = None

    def detect(self, refresh: bool = False) -> WorkspaceStatus:
        """Detect installed tools; result is cached for the adapter's lifetime.

        Args:
            refresh: Force re-detection even if cached.

        Returns:
            WorkspaceStatus.
        """
        if self._status_cache is None or refresh:
            self._status_cache = detect_tools(emitter=self._emitter)
        return self._status_cache

    def call(
        self,
        service: str,
        method: str,
        params: Optional[Dict[str, Any]] = None,
        tool: Optional[str] = None,
        timeout: int = 30,
    ) -> WorkspaceCallResult:
        """Execute a Google Workspace operation.

        Delegates to :func:`call` with this adapter's emitter.
        """
        return call(
            service=service,
            method=method,
            params=params,
            tool=tool,
            timeout=timeout,
            emitter=self._emitter,
        )

    def services_for(self, tool_name: str) -> List[str]:
        """Return the list of services supported by *tool_name*."""
        return list(TOOL_SERVICES.get(tool_name, []))

    def preferred_tool_for(self, service: str) -> Optional[str]:
        """Return the preferred available tool for a given service."""
        status = self.detect()
        available = {t.name for t in status.tools if t.available}
        for tool in TOOL_PREFERENCE:
            if tool in available and service in TOOL_SERVICES.get(tool, []):
                return tool
        return None
