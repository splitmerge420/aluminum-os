# Kintsugi — Governance Spine for Aluminum OS
# Re-exports the public SDK surface for convenient import.
#
# Usage:
#   from kintsugi import GoldenTraceEmitter, GoldenTraceValidator
#   from kintsugi.sdk.golden_trace import GoldenTraceEmitter  # explicit path
#
# Atlas Lattice Foundation © 2026

from kintsugi.sdk.golden_trace import GoldenTraceEmitter, GoldenTraceValidator

__version__ = "1.0.0"
__all__ = ["GoldenTraceEmitter", "GoldenTraceValidator"]
