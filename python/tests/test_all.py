"""
Aluminum OS — Ring 1 Behavioral Tests

25 tests verifying actual behavior, not just instantiation.
Zero external dependencies.

Atlas Lattice Foundation — March 2026
"""

import sys
import os
import time
import unittest

# Add parent to path for import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core.manus_core import (
    ModelRouter, ModelConfig, ModelTier,
    CostTracker,
    MemoryStore, MemoryTier,
    TaskDecomposer,
    SessionVault,
    PerformanceTracker,
)


class TestModelRouter(unittest.TestCase):
    """ModelRouter tests — verify routing logic, not just object creation."""
    
    def setUp(self):
        self.router = ModelRouter()
        self.router.register_model(ModelConfig(
            name="haiku", tier=ModelTier.HAIKU,
            cost_per_1k_tokens=0.25, max_context=200000,
            capabilities=["text", "classification"],
        ))
        self.router.register_model(ModelConfig(
            name="sonnet", tier=ModelTier.SONNET,
            cost_per_1k_tokens=3.0, max_context=200000,
            capabilities=["text", "classification", "code", "analysis"],
        ))
        self.router.register_model(ModelConfig(
            name="opus", tier=ModelTier.OPUS,
            cost_per_1k_tokens=15.0, max_context=200000,
            capabilities=["text", "classification", "code", "analysis", "reasoning", "planning"],
        ))
    
    def test_routes_to_cheapest(self):
        """Simple text task should route to haiku (cheapest)."""
        result = self.router.route(["text"])
        self.assertEqual(result, "haiku")
    
    def test_routes_to_capable_model(self):
        """Code task requires sonnet or above."""
        result = self.router.route(["code", "analysis"])
        self.assertEqual(result, "sonnet")
    
    def test_routes_to_opus_for_planning(self):
        """Planning only available on opus."""
        result = self.router.route(["planning"])
        self.assertEqual(result, "opus")
    
    def test_returns_none_for_impossible(self):
        """No model has 'quantum' capability."""
        result = self.router.route(["quantum"])
        self.assertIsNone(result)
    
    def test_model_count(self):
        self.assertEqual(self.router.model_count, 3)
        self.assertEqual(len(self.router.active_models), 3)


class TestCostTracker(unittest.TestCase):
    """CostTracker tests — verify budget enforcement."""
    
    def setUp(self):
        self.tracker = CostTracker(global_budget=10.0)
        self.tracker.set_model_budget("haiku", 5.0)
    
    def test_records_usage(self):
        allowed, cost = self.tracker.record_usage("haiku", 1000, 500, 0.25)
        self.assertTrue(allowed)
        self.assertAlmostEqual(cost, 0.375)
        self.assertEqual(self.tracker.record_count, 1)
    
    def test_enforces_model_budget(self):
        """Should reject when model budget exceeded."""
        # Spend most of the haiku budget
        self.tracker.record_usage("haiku", 10000, 10000, 0.25)  # 5.0
        # Next call should be rejected
        allowed, cost = self.tracker.record_usage("haiku", 1000, 0, 0.25)
        self.assertFalse(allowed)
        self.assertEqual(cost, 0.0)
    
    def test_enforces_global_budget(self):
        """Should reject when global budget exceeded."""
        # Use a model without its own budget
        self.tracker.record_usage("opus", 500, 500, 15.0)  # 15.0 > 10.0 budget
        # Actually let's be more precise
        tracker = CostTracker(global_budget=1.0)
        allowed, _ = tracker.record_usage("opus", 500, 500, 15.0)  # cost = 15.0
        self.assertFalse(allowed)
    
    def test_remaining_budget(self):
        self.tracker.record_usage("haiku", 1000, 0, 0.25)  # 0.25
        self.assertAlmostEqual(self.tracker.remaining_budget(), 9.75)


class TestMemoryStore(unittest.TestCase):
    """MemoryStore tests — verify tier isolation and TTL."""
    
    def setUp(self):
        self.store = MemoryStore()
    
    def test_put_and_get(self):
        self.store.put("key1", "value1", MemoryTier.WORKING)
        self.assertEqual(self.store.get("key1"), "value1")
    
    def test_tier_isolation(self):
        """Clearing working memory should not affect session memory."""
        self.store.put("work", "w", MemoryTier.WORKING)
        self.store.put("sess", "s", MemoryTier.SESSION)
        removed = self.store.clear_tier(MemoryTier.WORKING)
        self.assertEqual(removed, 1)
        self.assertIsNone(self.store.get("work"))
        self.assertEqual(self.store.get("sess"), "s")
    
    def test_ttl_expiry(self):
        """Entry with 0.01s TTL should expire quickly."""
        self.store.put("temp", "data", MemoryTier.WORKING, ttl=0.01)
        time.sleep(0.02)
        self.assertIsNone(self.store.get("temp"))
    
    def test_count_by_tier(self):
        self.store.put("a", 1, MemoryTier.WORKING)
        self.store.put("b", 2, MemoryTier.WORKING)
        self.store.put("c", 3, MemoryTier.SESSION)
        self.assertEqual(self.store.count(MemoryTier.WORKING), 2)
        self.assertEqual(self.store.count(MemoryTier.SESSION), 1)
        self.assertEqual(self.store.count(), 3)
    
    def test_access_tracking(self):
        """Access count should increment on each get."""
        self.store.put("tracked", "val", MemoryTier.LONG_TERM)
        self.store.get("tracked")
        self.store.get("tracked")
        entry = self.store._store["tracked"]
        self.assertEqual(entry.access_count, 2)


class TestTaskDecomposer(unittest.TestCase):
    """TaskDecomposer tests — verify DAG ordering and cycle detection."""
    
    def setUp(self):
        self.td = TaskDecomposer()
    
    def test_add_and_order(self):
        self.td.add_task("fetch", "Fetch data")
        self.td.add_task("parse", "Parse data", ["fetch"])
        self.td.add_task("analyze", "Analyze results", ["parse"])
        order = self.td.execution_order()
        self.assertEqual(order, ["fetch", "parse", "analyze"])
    
    def test_ready_tasks(self):
        """Only tasks with all deps done should be ready."""
        self.td.add_task("a", "Step A")
        self.td.add_task("b", "Step B", ["a"])
        ready = self.td.ready_tasks()
        self.assertEqual(ready, ["a"])
        self.td.complete_task("a")
        ready = self.td.ready_tasks()
        self.assertEqual(ready, ["b"])
    
    def test_cycle_detection(self):
        """Adding a cycle should raise on execution_order."""
        self.td.add_task("x", "X")
        self.td.add_task("y", "Y", ["x"])
        # Manually create a cycle (bypass validation)
        self.td._tasks["x"].depends_on = ["y"]
        with self.assertRaises(ValueError):
            self.td.execution_order()
    
    def test_done_count(self):
        self.td.add_task("a", "A")
        self.td.add_task("b", "B")
        self.td.complete_task("a", result=42)
        self.assertEqual(self.td.done_count, 1)
        self.assertEqual(self.td.task_count, 2)


class TestSessionVault(unittest.TestCase):
    """SessionVault tests — verify token generation, TTL, export."""
    
    def test_create_and_retrieve(self):
        vault = SessionVault()
        token = vault.create_session("user-1", {"role": "admin"})
        self.assertIsNotNone(token)
        data = vault.get_session(token)
        self.assertEqual(data, {"role": "admin"})
    
    def test_session_ttl(self):
        vault = SessionVault(default_ttl=0.01)
        token = vault.create_session("user-2", {"temp": True})
        time.sleep(0.02)
        self.assertIsNone(vault.get_session(token))
    
    def test_destroy_session(self):
        vault = SessionVault()
        token = vault.create_session("user-3", {})
        self.assertTrue(vault.destroy_session(token))
        self.assertIsNone(vault.get_session(token))
    
    def test_export_json(self):
        vault = SessionVault()
        token = vault.create_session("user-4", {"key": "value"})
        exported = vault.export_session(token)
        self.assertIn("key", exported)
        self.assertIn("value", exported)


class TestPerformanceTracker(unittest.TestCase):
    """PerformanceTracker tests — verify snapshot, baseline, and delta logic."""

    def setUp(self):
        self.tracker = PerformanceTracker()
        self.tracker.record_snapshot("baseline", {
            "latency_ms": 120.0,
            "hit_rate": 0.72,
            "error_rate": 0.05,
        })
        self.tracker.set_baseline("baseline")

    def test_record_and_count(self):
        """Snapshots are stored and counted correctly."""
        self.assertEqual(self.tracker.snapshot_count, 1)
        self.tracker.record_snapshot("t2", {"latency_ms": 100.0})
        self.assertEqual(self.tracker.snapshot_count, 2)

    def test_set_baseline_returns_true(self):
        """set_baseline returns True for an existing label."""
        result = self.tracker.set_baseline("baseline")
        self.assertTrue(result)

    def test_set_baseline_returns_false_for_missing(self):
        """set_baseline returns False when no snapshot has that label."""
        result = self.tracker.set_baseline("nonexistent")
        self.assertFalse(result)

    def test_compare_improvement(self):
        """Reduced latency and higher hit_rate should show expected deltas."""
        self.tracker.record_snapshot("current", {
            "latency_ms": 90.0,   # 25% reduction
            "hit_rate": 0.90,     # 25% increase
            "error_rate": 0.02,   # 60% reduction
        })
        deltas = self.tracker.compare_to_baseline("current")
        self.assertIsNotNone(deltas)
        self.assertAlmostEqual(deltas["latency_ms"], -25.0, places=5)
        self.assertAlmostEqual(deltas["hit_rate"], 25.0, places=5)
        self.assertAlmostEqual(deltas["error_rate"], -60.0, places=5)

    def test_compare_returns_none_without_baseline(self):
        """compare_to_baseline returns None when baseline has not been set."""
        tracker = PerformanceTracker()
        tracker.record_snapshot("snap", {"x": 1.0})
        self.assertIsNone(tracker.compare_to_baseline("snap"))

    def test_all_labels(self):
        """all_labels returns labels in insertion order."""
        self.tracker.record_snapshot("day2", {"latency_ms": 110.0})
        self.tracker.record_snapshot("day3", {"latency_ms": 95.0})
        self.assertEqual(self.tracker.all_labels(), ["baseline", "day2", "day3"])


if __name__ == "__main__":
    unittest.main()
