"""Lightweight in-process event bus for transparency/provenance hooks."""
from __future__ import annotations

from collections import defaultdict
from typing import Callable, Any, DefaultDict, List

Handler = Callable[[str, dict[str, Any]], None]


class EventBus:
    def __init__(self) -> None:
        self._subs: DefaultDict[str, List[Handler]] = defaultdict(list)

    def subscribe(self, topic: str, handler: Handler) -> None:
        self._subs[topic].append(handler)

    def publish(self, topic: str, payload: dict[str, Any]) -> None:
        for handler in self._subs.get(topic, []):
            try:
                handler(topic, payload)
            except Exception:
                # do not crash pipeline on observer failure
                continue


BUS = EventBus()
