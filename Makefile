# Aluminum OS — Unified Build & Test Makefile
# Atlas Lattice Foundation © 2026
#
# Usage:
#   make test        — run all tests (Rust + Python + Kintsugi)
#   make test-rust   — Rust tests only
#   make test-python — Python tests only (test_all + test_health + test_kintsugi)
#   make run         — boot simulator demo
#   make clean       — remove build artifacts

.PHONY: all test test-rust test-python test-all test-health test-kintsugi test-uws run clean

# Default target
all: test

# ── Rust ────────────────────────────────────────────────────────────────────

test-rust:
	@echo "▶ Running Rust tests (Ring 0 — Forge Core)..."
	cargo test

# ── Python ──────────────────────────────────────────────────────────────────

test-all:
	@echo "▶ Running Ring 1 Manus Core tests..."
	python3 -m unittest python.tests.test_all -v

test-health:
	@echo "▶ Running Ring 1 Health Layer tests..."
	python3 -m unittest python.tests.test_health -v

test-kintsugi:
	@echo "▶ Running Kintsugi SDK + integration tests..."
	python3 -m unittest python.tests.test_kintsugi -v

test-uws:
	@echo "▶ Running uws CLI tests..."
	python3 -m unittest python.tests.test_uws -v

test-python: test-all test-health test-kintsugi test-uws

# ── Full suite ───────────────────────────────────────────────────────────────

test: test-rust test-python
	@echo ""
	@echo "✅  All tests passed — Aluminum OS is operational."

# ── Utilities ────────────────────────────────────────────────────────────────

run:
	@echo "▶ Running Aluminum OS Boot Simulator..."
	cargo run

clean:
	cargo clean
	find . -type d -name __pycache__ -prune -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true
