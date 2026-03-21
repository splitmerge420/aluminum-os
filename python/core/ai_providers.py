"""
Aluminum OS — Universal AI Provider Registry

Zero-dependency Python module (stdlib only) that integrates every major
AI CLI tool into the Aluminum OS ecosystem.  Providers are:

  - Device-agnostic (Linux, macOS, Windows via WSL)
  - AI-agnostic (any provider that passes the constitutional gate)
  - Subprocess-based (no Python SDK dependencies at import time)

Constitutional compliance gate
──────────────────────────────
Every provider is classified with a :class:`ConstitutionalStatus`:

  COMPLIANT        Open-source, transparent, community-audited.
                   Calls succeed; trace emitted at severity "info".

  PENDING_REVIEW   Available and functional but constitutional review
                   not yet completed.  Calls succeed with a "warning"
                   trace so the audit ledger captures the usage.

  NON_COMPLIANT    Violates Aluminum OS constitutional principles
                   (e.g., documented deceptive practices, opaque data
                   extraction, non-revocable licensing).  Calls are
                   blocked and a KINTSUGI "invariant_violation" trace
                   is emitted.

Human reviewers may reclassify any provider by updating the
``CONSTITUTIONAL_STATUS_OVERRIDES`` dict — this is the canonical
mechanism for governance updates without code changes.

Supported providers (March 2026)
──────────────────────────────────
  copilot   GitHub Copilot CLI   @github/copilot v0.0.367     npm / Node ≥ 22
  claude    Claude Code          @anthropic-ai/claude-code v2.1.76  npm / Node ≥ 18
  gemini    Google Gemini CLI    @google/gemini-cli v0.33.1   npm / Node ≥ 18
  deepseek  DeepSeek CLI         deepseek-cli (community)     npm / Node ≥ 18
  ollama    Ollama               binary v0.6.x                ollama.com
  openai    OpenAI CLI           openai (Python) v1.66.x      pip / Python ≥ 3.10
  gh        GitHub CLI           gh v2.67.x                   binary (gh.io)

Atlas Lattice Foundation — March 2026
"""

import json
import os
import re
import shutil
import subprocess
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple

from kintsugi.sdk.golden_trace import GoldenTraceEmitter


# ── Constitutional status ─────────────────────────────────────────────────────

class ConstitutionalStatus(str, Enum):
    """Compliance classification for an AI provider."""
    COMPLIANT        = "compliant"
    PENDING_REVIEW   = "pending_review"
    NON_COMPLIANT    = "non_compliant"


# Human-reviewer override table.  Keys are provider IDs.  Update this dict
# to reclassify a provider without touching any other code.
CONSTITUTIONAL_STATUS_OVERRIDES: Dict[str, ConstitutionalStatus] = {}


# ── Provider capability tags ──────────────────────────────────────────────────

class AICapability(str, Enum):
    """Declared capability tags for AI providers."""
    CODE_COMPLETION  = "code_completion"
    CODE_REVIEW      = "code_review"
    CODE_FIX         = "code_fix"
    EXPLAIN          = "explain"
    TEST_GENERATION  = "test_generation"
    CHAT             = "chat"
    LOCAL_MODEL      = "local_model"      # runs models locally (e.g. ollama)
    MULTI_MODEL      = "multi_model"      # supports multiple backend models
    MCP_SERVER       = "mcp_server"       # Model Context Protocol server mode
    REPO_CONTEXT     = "repo_context"     # understands entire repository
    SHELL_INTEGRATION= "shell_integration"# integrates with shell / terminal


# ── Version helpers (shared with workspace.py) ───────────────────────────────

_VERSION_RE = re.compile(r"(\d+\.\d+(?:\.\d+)?)")


def _parse_version(text: str) -> Optional[str]:
    m = _VERSION_RE.search(text)
    return m.group(1) if m else None


def _version_tuple(v: str) -> Tuple[int, ...]:
    parts = []
    for p in v.split("."):
        try:
            parts.append(int(p))
        except ValueError:
            parts.append(0)
    return tuple(parts)


def _meets_version(actual: Optional[str], required: str) -> bool:
    if actual is None:
        return False
    return _version_tuple(actual) >= _version_tuple(required)


# ── Provider definition ───────────────────────────────────────────────────────

@dataclass
class AIProvider:
    """Static definition of a single AI CLI provider."""
    id: str                               # short key, e.g. "copilot"
    name: str                             # human-readable name
    binary: str                           # primary executable on PATH
    required_version: str                 # minimum acceptable version
    capabilities: List[AICapability]
    constitutional_status: ConstitutionalStatus
    open_source: bool
    # Install instructions (multiple ecosystems)
    install_npm: Optional[str] = None     # npm package name
    install_pip: Optional[str] = None     # PyPI package name
    install_brew: Optional[str] = None    # Homebrew formula
    install_script: Optional[str] = None  # curl-based install URL
    install_binary_url: Optional[str] = None  # direct binary URL
    # Runtime
    auth_env_vars: List[str] = field(default_factory=list)
    node_min_version: Optional[str] = None   # Node.js requirement
    python_min_version: Optional[str] = None # Python requirement
    # Metadata
    github_url: Optional[str] = None
    npm_package: Optional[str] = None
    version_flag: str = "--version"       # flag to query version

    @property
    def effective_status(self) -> ConstitutionalStatus:
        """Return status with human-reviewer overrides applied."""
        return CONSTITUTIONAL_STATUS_OVERRIDES.get(self.id, self.constitutional_status)

    def install_hints(self) -> List[str]:
        """Return all applicable install commands as a list of strings."""
        hints = []
        if self.install_npm:
            hints.append(f"npm install -g {self.install_npm}  (Node.js ≥ {self.node_min_version or '18'})")
        if self.install_pip:
            hints.append(f"pip install {self.install_pip}  (Python ≥ {self.python_min_version or '3.10'})")
        if self.install_brew:
            hints.append(f"brew install {self.install_brew}")
        if self.install_script:
            hints.append(f"curl -fsSL {self.install_script} | bash")
        if self.install_binary_url:
            hints.append(f"Download binary: {self.install_binary_url}")
        if self.github_url:
            hints.append(f"GitHub: {self.github_url}")
        return hints

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "binary": self.binary,
            "required_version": self.required_version,
            "open_source": self.open_source,
            "constitutional_status": self.effective_status.value,
            "capabilities": [c.value for c in self.capabilities],
            "auth_env_vars": self.auth_env_vars,
            "install_hints": self.install_hints(),
            "github_url": self.github_url,
        }


# ── Canonical provider registry (March 2026) ─────────────────────────────────

PROVIDERS: Dict[str, AIProvider] = {

    "copilot": AIProvider(
        id="copilot",
        name="GitHub Copilot CLI",
        binary="copilot",
        required_version="0.0.367",
        capabilities=[
            AICapability.CODE_COMPLETION,
            AICapability.CODE_REVIEW,
            AICapability.CODE_FIX,
            AICapability.EXPLAIN,
            AICapability.TEST_GENERATION,
            AICapability.CHAT,
            AICapability.REPO_CONTEXT,
            AICapability.SHELL_INTEGRATION,
            AICapability.MULTI_MODEL,
            AICapability.MCP_SERVER,
        ],
        constitutional_status=ConstitutionalStatus.PENDING_REVIEW,
        open_source=False,
        install_npm="@github/copilot@0.0.367",
        install_brew="copilot-cli",
        install_script="https://gh.io/copilot-install",
        npm_package="@github/copilot",
        node_min_version="22",
        auth_env_vars=["GITHUB_TOKEN"],
        github_url="https://github.com/github/copilot-cli",
        version_flag="--version",
    ),

    "claude": AIProvider(
        id="claude",
        name="Claude Code (Anthropic)",
        binary="claude",
        required_version="2.1.76",
        capabilities=[
            AICapability.CODE_COMPLETION,
            AICapability.CODE_REVIEW,
            AICapability.CODE_FIX,
            AICapability.EXPLAIN,
            AICapability.TEST_GENERATION,
            AICapability.CHAT,
            AICapability.REPO_CONTEXT,
            AICapability.SHELL_INTEGRATION,
            AICapability.MULTI_MODEL,
            AICapability.MCP_SERVER,
        ],
        constitutional_status=ConstitutionalStatus.PENDING_REVIEW,
        open_source=False,
        install_npm="@anthropic-ai/claude-code@2.1.76",
        install_brew="--cask claude-code",
        install_script="https://claude.ai/install.sh",
        npm_package="@anthropic-ai/claude-code",
        node_min_version="18",
        auth_env_vars=["ANTHROPIC_API_KEY"],
        github_url="https://github.com/anthropics/claude-code",
        version_flag="--version",
    ),

    "gemini": AIProvider(
        id="gemini",
        name="Google Gemini CLI",
        binary="gemini",
        required_version="0.33.1",
        capabilities=[
            AICapability.CODE_COMPLETION,
            AICapability.CODE_REVIEW,
            AICapability.CODE_FIX,
            AICapability.EXPLAIN,
            AICapability.TEST_GENERATION,
            AICapability.CHAT,
            AICapability.REPO_CONTEXT,
            AICapability.SHELL_INTEGRATION,
            AICapability.MULTI_MODEL,
            AICapability.MCP_SERVER,
        ],
        constitutional_status=ConstitutionalStatus.COMPLIANT,
        open_source=True,
        install_npm="@google/gemini-cli@0.33.1",
        npm_package="@google/gemini-cli",
        node_min_version="18",
        auth_env_vars=["GEMINI_API_KEY"],
        github_url="https://github.com/google-gemini/gemini-cli",
        version_flag="--version",
    ),

    "deepseek": AIProvider(
        id="deepseek",
        name="DeepSeek CLI",
        binary="deepseek",
        required_version="0.1.0",
        capabilities=[
            AICapability.CODE_COMPLETION,
            AICapability.CODE_REVIEW,
            AICapability.CODE_FIX,
            AICapability.EXPLAIN,
            AICapability.CHAT,
        ],
        constitutional_status=ConstitutionalStatus.PENDING_REVIEW,
        open_source=True,
        install_npm="deepseek-cli",
        npm_package="deepseek-cli",
        node_min_version="18",
        auth_env_vars=["DEEPSEEK_API_KEY"],
        github_url="https://github.com/holasoymalva/deepseek-cli",
        version_flag="--version",
    ),

    "ollama": AIProvider(
        id="ollama",
        name="Ollama (Local Model Runner)",
        binary="ollama",
        required_version="0.6.0",
        capabilities=[
            AICapability.CODE_COMPLETION,
            AICapability.CODE_REVIEW,
            AICapability.CHAT,
            AICapability.LOCAL_MODEL,
            AICapability.MULTI_MODEL,
        ],
        constitutional_status=ConstitutionalStatus.COMPLIANT,
        open_source=True,
        install_script="https://ollama.com/install.sh",
        install_brew="ollama",
        install_binary_url="https://ollama.com/download",
        auth_env_vars=[],  # runs fully local — no API key needed
        github_url="https://github.com/ollama/ollama",
        version_flag="--version",
    ),

    "openai": AIProvider(
        id="openai",
        name="OpenAI CLI",
        binary="openai",
        required_version="1.66.0",
        capabilities=[
            AICapability.CODE_COMPLETION,
            AICapability.CODE_REVIEW,
            AICapability.CHAT,
            AICapability.MULTI_MODEL,
        ],
        constitutional_status=ConstitutionalStatus.PENDING_REVIEW,
        open_source=True,
        install_pip="openai>=1.66.0",
        python_min_version="3.10",
        auth_env_vars=["OPENAI_API_KEY"],
        github_url="https://github.com/openai/openai-python",
        version_flag="--version",
    ),

    "gh": AIProvider(
        id="gh",
        name="GitHub CLI",
        binary="gh",
        required_version="2.67.0",
        capabilities=[
            AICapability.CODE_REVIEW,
            AICapability.REPO_CONTEXT,
            AICapability.SHELL_INTEGRATION,
        ],
        constitutional_status=ConstitutionalStatus.COMPLIANT,
        open_source=True,
        install_script="https://cli.github.com/",
        install_brew="gh",
        install_binary_url="https://github.com/cli/cli/releases",
        auth_env_vars=["GITHUB_TOKEN"],
        github_url="https://github.com/cli/cli",
        version_flag="--version",
    ),
}

# Preferred order for routing: open-source and compliant first,
# then pending-review (closed-source), local models last for specific tasks.
PROVIDER_PREFERENCE: List[str] = [
    "gemini",   # COMPLIANT, open-source
    "ollama",   # COMPLIANT, open-source, local
    "gh",       # COMPLIANT, open-source
    "claude",   # PENDING_REVIEW
    "copilot",  # PENDING_REVIEW
    "deepseek", # PENDING_REVIEW
    "openai",   # PENDING_REVIEW
]


# ── Runtime status types ──────────────────────────────────────────────────────

@dataclass
class ProviderStatus:
    """Runtime installation + compliance status for one provider."""
    provider: AIProvider
    available: bool
    version: Optional[str]
    meets_version: bool
    env_vars_present: bool
    binary_path: Optional[str] = None
    blocked: bool = False      # True when NON_COMPLIANT

    def to_dict(self) -> Dict[str, Any]:
        d = self.provider.to_dict()
        d.update({
            "available": self.available,
            "version": self.version,
            "meets_version": self.meets_version,
            "env_vars_present": self.env_vars_present,
            "binary_path": self.binary_path,
            "blocked": self.blocked,
        })
        return d


@dataclass
class ProviderRegistry:
    """Snapshot of all detected providers."""
    statuses: List[ProviderStatus] = field(default_factory=list)
    available_ids: List[str] = field(default_factory=list)
    compliant_ids: List[str] = field(default_factory=list)
    preferred_id: Optional[str] = None
    trace_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "available_ids": self.available_ids,
            "compliant_ids": self.compliant_ids,
            "preferred_id": self.preferred_id,
            "trace_id": self.trace_id,
            "providers": [s.to_dict() for s in self.statuses],
        }


@dataclass
class AICallResult:
    """Result of routing a prompt through an AI CLI provider."""
    provider_id: str
    prompt: str
    success: bool
    stdout: str
    stderr: str
    return_code: int
    constitutional_status: str
    blocked: bool = False
    trace_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "provider_id": self.provider_id,
            "success": self.success,
            "return_code": self.return_code,
            "constitutional_status": self.constitutional_status,
            "blocked": self.blocked,
            "stdout": self.stdout,
            "trace_id": self.trace_id,
        }


# ── Detection ─────────────────────────────────────────────────────────────────

def _probe_provider(provider: AIProvider) -> Tuple[bool, Optional[str], Optional[str]]:
    """Return (available, version, binary_path) for a provider.

    Tries the direct binary first; falls back to ``npx`` for npm-based
    tools if Node.js is on PATH and no direct binary is found.
    """
    binary_path = shutil.which(provider.binary)
    try_cmds: List[List[str]] = []

    if binary_path:
        try_cmds.append([binary_path, provider.version_flag])

    # npm-based fallback via npx (only when npx is available)
    if provider.install_npm and shutil.which("npx"):
        pkg = provider.npm_package or provider.install_npm.split("@")[0]
        try_cmds.append(["npx", "--yes", pkg, provider.version_flag])

    for cmd in try_cmds:
        try:
            proc = subprocess.run(
                cmd, capture_output=True, text=True, timeout=15,
            )
            combined = (proc.stdout + proc.stderr).strip()
            version = _parse_version(combined)
            return True, version, shutil.which(cmd[0])
        except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
            continue

    return False, None, None


def _check_env_vars(provider: AIProvider) -> bool:
    return all(os.environ.get(v) for v in provider.auth_env_vars)


def detect_providers(
    provider_ids: Optional[List[str]] = None,
    emitter: Optional[GoldenTraceEmitter] = None,
) -> ProviderRegistry:
    """Probe all (or selected) AI CLI providers.

    Args:
        provider_ids: Restrict detection to this subset.  None = all.
        emitter:      Optional Kintsugi emitter for audit trace.

    Returns:
        ProviderRegistry with per-provider status and aggregate lists.
    """
    ids = provider_ids or list(PROVIDERS.keys())
    statuses: List[ProviderStatus] = []

    for pid in ids:
        provider = PROVIDERS.get(pid)
        if provider is None:
            continue
        available, version, path = _probe_provider(provider)
        meets = _meets_version(version, provider.required_version) if available else False
        env_ok = _check_env_vars(provider)
        blocked = provider.effective_status == ConstitutionalStatus.NON_COMPLIANT

        statuses.append(ProviderStatus(
            provider=provider,
            available=available,
            version=version,
            meets_version=meets,
            env_vars_present=env_ok,
            binary_path=path,
            blocked=blocked,
        ))

    available_ids = [s.provider.id for s in statuses if s.available]
    compliant_ids = [
        s.provider.id for s in statuses
        if s.available and s.provider.effective_status == ConstitutionalStatus.COMPLIANT
    ]
    preferred = next(
        (pid for pid in PROVIDER_PREFERENCE if pid in available_ids), None
    )

    registry = ProviderRegistry(
        statuses=statuses,
        available_ids=available_ids,
        compliant_ids=compliant_ids,
        preferred_id=preferred,
    )

    if emitter is not None:
        trace = emitter.emit(
            event_type="action",
            sphere_tag="H1.S2",
            aluminum_layer="L1-Constitutional",
            function="detect_providers",
            severity="info",
            payload={
                "available": available_ids,
                "compliant": compliant_ids,
                "preferred": preferred,
            },
        )
        registry.trace_id = trace["trace_id"]

    return registry


# ── Constitutional gate ───────────────────────────────────────────────────────

def constitutional_gate(
    provider: AIProvider,
    emitter: Optional[GoldenTraceEmitter] = None,
) -> Tuple[bool, str]:
    """Check whether *provider* may be invoked.

    Returns:
        Tuple of (allowed: bool, reason: str).
        ``allowed`` is False only for NON_COMPLIANT providers.
    """
    status = provider.effective_status

    if status == ConstitutionalStatus.NON_COMPLIANT:
        reason = (
            f"Provider '{provider.id}' is classified NON_COMPLIANT and is "
            "blocked by the Aluminum OS constitutional gate."
        )
        if emitter is not None:
            emitter.emit(
                event_type="invariant_violation",
                sphere_tag="H1.S2",
                aluminum_layer="L1-Constitutional",
                function="constitutional_gate",
                severity="error",
                payload={"provider": provider.id, "reason": reason},
                invariants_checked=["KINTSUGI-007"],
            )
        return False, reason

    if status == ConstitutionalStatus.PENDING_REVIEW:
        reason = (
            f"Provider '{provider.id}' is PENDING_REVIEW — usage is permitted "
            "but logged for constitutional audit."
        )
        if emitter is not None:
            emitter.emit(
                event_type="action",
                sphere_tag="H1.S2",
                aluminum_layer="L1-Constitutional",
                function="constitutional_gate",
                severity="warning",
                payload={"provider": provider.id, "status": "pending_review"},
            )
        return True, reason

    return True, f"Provider '{provider.id}' is COMPLIANT."


# ── Call routing ──────────────────────────────────────────────────────────────

def _build_call_command(
    provider: AIProvider,
    prompt: str,
    extra_args: Optional[List[str]] = None,
) -> List[str]:
    """Build a non-interactive one-shot command for the given provider.

    Each provider has a different CLI interface; we normalise to a single
    ``prompt`` string passed via the appropriate flag or positional arg.
    """
    binary = shutil.which(provider.binary) or provider.binary
    args = extra_args or []

    if provider.id == "copilot":
        return [binary, "ask", "--no-interactive", prompt] + args
    if provider.id == "claude":
        return [binary, "--print", prompt] + args
    if provider.id == "gemini":
        return [binary, "--prompt", prompt] + args
    if provider.id == "deepseek":
        return [binary, "--prompt", prompt] + args
    if provider.id == "ollama":
        # Default to a capable open model; callers may override via extra_args
        model = next((a for a in args if not a.startswith("-")), "llama3")
        remaining = [a for a in args if a != model]
        return [binary, "run", model, prompt] + remaining
    if provider.id == "openai":
        return [binary, "api", "chat.completions.create",
                "-m", "gpt-4o-mini", "-g", "user", prompt] + args
    if provider.id == "gh":
        return [binary, "copilot", "explain", prompt] + args

    # Generic fallback
    return [binary, prompt] + args


def call(
    prompt: str,
    provider_id: Optional[str] = None,
    extra_args: Optional[List[str]] = None,
    timeout: int = 60,
    emitter: Optional[GoldenTraceEmitter] = None,
) -> AICallResult:
    """Route a prompt to an AI CLI provider.

    Enforces the constitutional gate before invoking.  Auto-selects the
    preferred compliant provider when *provider_id* is not specified.

    Args:
        prompt:      Natural-language prompt or code snippet.
        provider_id: Explicit provider key (e.g. ``"claude"``).  If None,
                     the preferred available provider is selected.
        extra_args:  Extra CLI arguments appended to the command.
        timeout:     Subprocess timeout in seconds (default: 60).
        emitter:     Optional Kintsugi emitter.

    Returns:
        AICallResult with stdout, return_code, constitutional_status.
    """
    # Resolve provider
    if provider_id is None:
        registry = detect_providers(emitter=None)
        provider_id = registry.preferred_id

    if provider_id is None or provider_id not in PROVIDERS:
        result = AICallResult(
            provider_id=provider_id or "none",
            prompt=prompt[:120],
            success=False,
            stdout="",
            stderr="No suitable AI provider found.  Install one of: "
                   + ", ".join(PROVIDER_PREFERENCE),
            return_code=-1,
            constitutional_status="unavailable",
        )
        _emit_call_trace(emitter, result)
        return result

    provider = PROVIDERS[provider_id]
    allowed, gate_reason = constitutional_gate(provider, emitter=emitter)

    if not allowed:
        result = AICallResult(
            provider_id=provider_id,
            prompt=prompt[:120],
            success=False,
            stdout="",
            stderr=gate_reason,
            return_code=-1,
            constitutional_status=provider.effective_status.value,
            blocked=True,
        )
        _emit_call_trace(emitter, result)
        return result

    cmd = _build_call_command(provider, prompt, extra_args)
    try:
        proc = subprocess.run(
            cmd, capture_output=True, text=True, timeout=timeout,
        )
        result = AICallResult(
            provider_id=provider_id,
            prompt=prompt[:120],
            success=proc.returncode == 0,
            stdout=proc.stdout,
            stderr=proc.stderr,
            return_code=proc.returncode,
            constitutional_status=provider.effective_status.value,
        )
    except FileNotFoundError:
        result = AICallResult(
            provider_id=provider_id,
            prompt=prompt[:120],
            success=False,
            stdout="",
            stderr=f"Binary '{provider.binary}' not found on PATH.",
            return_code=-1,
            constitutional_status=provider.effective_status.value,
        )
    except subprocess.TimeoutExpired:
        result = AICallResult(
            provider_id=provider_id,
            prompt=prompt[:120],
            success=False,
            stdout="",
            stderr=f"Provider '{provider_id}' timed out after {timeout}s.",
            return_code=-1,
            constitutional_status=provider.effective_status.value,
        )

    _emit_call_trace(emitter, result)
    return result


def _emit_call_trace(
    emitter: Optional[GoldenTraceEmitter],
    result: AICallResult,
) -> None:
    if emitter is None:
        return
    severity = "info" if result.success else "warning"
    if result.blocked:
        severity = "error"
    trace = emitter.emit(
        event_type="action",
        sphere_tag="H1.S2",
        aluminum_layer="L1-Constitutional",
        function="ai_providers.call",
        severity=severity,
        payload={
            "provider": result.provider_id,
            "success": result.success,
            "return_code": result.return_code,
            "blocked": result.blocked,
            "constitutional_status": result.constitutional_status,
        },
    )
    result.trace_id = trace["trace_id"]


# ── High-level adapter ────────────────────────────────────────────────────────

class AIProviderAdapter:
    """High-level interface combining detect + call + constitutional gate.

    Usage::

        adapter = AIProviderAdapter(emitter=my_emitter)
        registry = adapter.detect()
        print(registry.compliant_ids)

        result = adapter.ask("Explain this diff", provider_id="gemini")
        print(result.stdout)
    """

    def __init__(self, emitter: Optional[GoldenTraceEmitter] = None):
        self._emitter = emitter
        self._registry: Optional[ProviderRegistry] = None

    def detect(self, refresh: bool = False) -> ProviderRegistry:
        """Detect all providers; result cached for the adapter's lifetime."""
        if self._registry is None or refresh:
            self._registry = detect_providers(emitter=self._emitter)
        return self._registry

    def ask(
        self,
        prompt: str,
        provider_id: Optional[str] = None,
        extra_args: Optional[List[str]] = None,
        timeout: int = 60,
    ) -> AICallResult:
        """Route a prompt to an AI provider through the constitutional gate."""
        return call(
            prompt=prompt,
            provider_id=provider_id,
            extra_args=extra_args,
            timeout=timeout,
            emitter=self._emitter,
        )

    def list_compliant(self) -> List[str]:
        """Return provider IDs that are available AND COMPLIANT."""
        return list(self.detect().compliant_ids)

    def list_available(self) -> List[str]:
        """Return all available provider IDs regardless of compliance."""
        return list(self.detect().available_ids)

    def provider_info(self, provider_id: str) -> Optional[Dict[str, Any]]:
        """Return the full metadata dict for a provider, or None."""
        p = PROVIDERS.get(provider_id)
        return p.to_dict() if p else None

    def capabilities_for(self, provider_id: str) -> List[str]:
        """Return capability tag strings for a provider."""
        p = PROVIDERS.get(provider_id)
        return [c.value for c in p.capabilities] if p else []
