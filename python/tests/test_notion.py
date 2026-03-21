"""
Aluminum OS — Notion Adapter Tests

All HTTP calls are mocked with unittest.mock so the suite runs with
zero network access and no NOTION_API_KEY required.

Atlas Lattice Foundation — March 2026
"""

import json
import os
import sys
import unittest
from unittest.mock import MagicMock, patch, call as mcall

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from python.core.notion import (
    NOTION_API_VERSION,
    NPM_PACKAGE,
    NPM_VERSION,
    PIP_PACKAGE,
    PIP_VERSION,
    DatabaseQueryResult,
    IngestResult,
    NotionAPIError,
    NotionAdapter,
    NotionBlock,
    _normalise_block,
    _page_title,
    _rich_text_to_str,
    fetch_blocks,
    fetch_page,
    ingest,
    query_database,
)
from kintsugi.sdk.golden_trace import GoldenTraceEmitter


def _emitter():
    return GoldenTraceEmitter(repo="test", module="notion/test")


def _rich(text: str) -> list:
    """Minimal rich_text array for testing."""
    return [{"plain_text": text, "type": "text", "text": {"content": text}}]


def _mock_urlopen(payload: dict, status: int = 200):
    """Return a context-manager mock that yields a urllib response."""
    raw = json.dumps(payload).encode("utf-8")
    cm = MagicMock()
    cm.__enter__ = MagicMock(return_value=MagicMock(read=MagicMock(return_value=raw)))
    cm.__exit__ = MagicMock(return_value=False)
    return cm


# ── Constants ─────────────────────────────────────────────────────────────────

class TestConstants(unittest.TestCase):

    def test_api_version_format(self):
        parts = NOTION_API_VERSION.split("-")
        self.assertEqual(len(parts), 3, "API version must be YYYY-MM-DD")

    def test_npm_package_name(self):
        self.assertIn("notionhq", NPM_PACKAGE)

    def test_npm_version_semver(self):
        parts = NPM_VERSION.split(".")
        self.assertGreaterEqual(len(parts), 2)

    def test_pip_package_name(self):
        self.assertIn("notion", PIP_PACKAGE)

    def test_pip_version_semver(self):
        parts = PIP_VERSION.split(".")
        self.assertGreaterEqual(len(parts), 2)


# ── Rich-text and page-title helpers ─────────────────────────────────────────

class TestRichText(unittest.TestCase):

    def test_empty_list(self):
        self.assertEqual(_rich_text_to_str([]), "")

    def test_single_text(self):
        self.assertEqual(_rich_text_to_str(_rich("Hello")), "Hello")

    def test_multiple_parts_concatenated(self):
        parts = _rich("Hello ") + _rich("world")
        self.assertEqual(_rich_text_to_str(parts), "Hello world")

    def test_missing_plain_text_ignored(self):
        parts = [{"type": "mention"}]
        self.assertEqual(_rich_text_to_str(parts), "")

    def test_page_title_from_title_property(self):
        page = {"properties": {"Name": {"type": "title", "title": _rich("My Page")}}}
        self.assertEqual(_page_title(page), "My Page")

    def test_page_title_empty_when_no_title(self):
        page = {"properties": {}}
        self.assertEqual(_page_title(page), "")

    def test_page_title_fallback_top_level(self):
        page = {"title": _rich("Database Title"), "properties": {}}
        self.assertEqual(_page_title(page), "Database Title")


# ── Block normalisation ───────────────────────────────────────────────────────

class TestNormaliseBlock(unittest.TestCase):

    def _raw(self, btype: str, inner: dict, bid: str = "block-1") -> dict:
        return {"id": bid, "type": btype, btype: inner, "has_children": False}

    def test_paragraph(self):
        nb = _normalise_block(self._raw("paragraph", {"rich_text": _rich("Hello")}))
        self.assertEqual(nb.block_type, "paragraph")
        self.assertEqual(nb.text, "Hello")

    def test_heading_1(self):
        nb = _normalise_block(self._raw("heading_1", {"rich_text": _rich("Title")}))
        self.assertEqual(nb.block_type, "heading")
        self.assertEqual(nb.level, 1)

    def test_heading_2_level(self):
        nb = _normalise_block(self._raw("heading_2", {"rich_text": _rich("Sub")}))
        self.assertEqual(nb.level, 2)

    def test_heading_3_level(self):
        nb = _normalise_block(self._raw("heading_3", {"rich_text": _rich("Sub")}))
        self.assertEqual(nb.level, 3)

    def test_code_block_language(self):
        nb = _normalise_block(self._raw("code", {"rich_text": _rich("x=1"), "language": "python"}))
        self.assertEqual(nb.block_type, "code")
        self.assertEqual(nb.language, "python")
        self.assertEqual(nb.text, "x=1")

    def test_todo_checked(self):
        nb = _normalise_block(self._raw("to_do", {"rich_text": _rich("Task"), "checked": True}))
        self.assertTrue(nb.checked)

    def test_todo_unchecked(self):
        nb = _normalise_block(self._raw("to_do", {"rich_text": _rich("Task"), "checked": False}))
        self.assertFalse(nb.checked)

    def test_image_url(self):
        nb = _normalise_block(self._raw("image", {"file": {"url": "https://img.test/a.png"}, "caption": []}))
        self.assertEqual(nb.block_type, "image")
        self.assertEqual(nb.url, "https://img.test/a.png")

    def test_divider(self):
        nb = _normalise_block(self._raw("divider", {}))
        self.assertEqual(nb.block_type, "divider")
        self.assertEqual(nb.text, "")

    def test_table_row_cells(self):
        nb = _normalise_block(self._raw("table_row", {"cells": [_rich("A"), _rich("B")]}))
        self.assertIn("A", nb.text)
        self.assertIn("B", nb.text)

    def test_meeting_notes_2026(self):
        nb = _normalise_block(self._raw("meeting_notes", {"rich_text": _rich("Notes")}))
        self.assertEqual(nb.block_type, "meeting_notes")

    def test_unknown_type_preserved(self):
        nb = _normalise_block({"id": "x", "type": "future_block", "future_block": {}, "has_children": False})
        self.assertEqual(nb.block_type, "future_block")

    def test_to_dict_heading(self):
        nb = _normalise_block(self._raw("heading_1", {"rich_text": _rich("H")}))
        d = nb.to_dict()
        self.assertEqual(d["type"], "heading")
        self.assertEqual(d["level"], 1)

    def test_to_dict_code(self):
        nb = _normalise_block(self._raw("code", {"rich_text": _rich("x"), "language": "rust"}))
        d = nb.to_dict()
        self.assertEqual(d["language"], "rust")

    def test_to_dict_image_has_url(self):
        nb = _normalise_block(self._raw("image", {"file": {"url": "http://x.test/img.jpg"}, "caption": []}))
        d = nb.to_dict()
        self.assertIn("url", d)


# ── fetch_page ────────────────────────────────────────────────────────────────

class TestFetchPage(unittest.TestCase):

    def test_raises_without_key(self):
        with patch.dict(os.environ, {}, clear=True):
            os.environ.pop("NOTION_API_KEY", None)
            os.environ.pop("NOTION_TOKEN", None)
            with self.assertRaises(ValueError):
                fetch_page("page-id-123")

    @patch("urllib.request.urlopen")
    def test_returns_page_dict(self, mock_urlopen):
        page = {"id": "abc", "object": "page", "properties": {}, "url": "https://notion.so/abc"}
        mock_urlopen.return_value = _mock_urlopen(page)
        result = fetch_page("abc", api_key="secret")  # lint: ignore CONST-001
        self.assertEqual(result["id"], "abc")

    @patch("urllib.request.urlopen")
    def test_strips_hyphens_from_page_id(self, mock_urlopen):
        page = {"id": "abcdef123456", "object": "page", "properties": {}}
        mock_urlopen.return_value = _mock_urlopen(page)
        fetch_page("abc-def-123-456", api_key="secret")  # lint: ignore CONST-001
        call_url = mock_urlopen.call_args[0][0].full_url
        self.assertNotIn("-", call_url.split("/pages/")[1])


# ── fetch_blocks ──────────────────────────────────────────────────────────────

class TestFetchBlocks(unittest.TestCase):

    @patch("urllib.request.urlopen")
    def test_returns_block_list(self, mock_urlopen):
        data = {
            "results": [
                {"id": "b1", "type": "paragraph", "paragraph": {"rich_text": _rich("Hello")}, "has_children": False},
            ],
            "has_more": False,
        }
        mock_urlopen.return_value = _mock_urlopen(data)
        blocks = fetch_blocks("page-id", api_key="secret")  # lint: ignore CONST-001
        self.assertEqual(len(blocks), 1)
        self.assertEqual(blocks[0].text, "Hello")

    @patch("urllib.request.urlopen")
    def test_paginates_until_no_more(self, mock_urlopen):
        page1 = {
            "results": [{"id": "b1", "type": "paragraph", "paragraph": {"rich_text": _rich("A")}, "has_children": False}],
            "has_more": True,
            "next_cursor": "cursor2",
        }
        page2 = {
            "results": [{"id": "b2", "type": "paragraph", "paragraph": {"rich_text": _rich("B")}, "has_children": False}],
            "has_more": False,
        }
        mock_urlopen.side_effect = [_mock_urlopen(page1), _mock_urlopen(page2)]
        blocks = fetch_blocks("page-id", api_key="secret")  # lint: ignore CONST-001
        self.assertEqual(len(blocks), 2)


# ── ingest ────────────────────────────────────────────────────────────────────

class TestIngest(unittest.TestCase):

    def test_error_set_when_no_key(self):
        with patch.dict(os.environ, {}, clear=True):
            os.environ.pop("NOTION_API_KEY", None)
            os.environ.pop("NOTION_TOKEN", None)
            result = ingest(page_id="abc")
        self.assertIsNotNone(result.error)
        self.assertEqual(result.blocks, [])

    @patch("python.core.notion.fetch_blocks")
    @patch("python.core.notion.fetch_page")
    def test_full_ingest_success(self, mock_page, mock_blocks):
        mock_page.return_value = {
            "id": "abc123",
            "url": "https://notion.so/abc123",
            "last_edited_time": "2026-03-21T00:00:00.000Z",
            "properties": {"Name": {"type": "title", "title": _rich("My Archive")}},
        }
        mock_blocks.return_value = [
            NotionBlock(block_id="b1", block_type="paragraph", text="First paragraph"),
            NotionBlock(block_id="b2", block_type="heading", text="Section 1", level=1),
        ]
        result = ingest(page_id="abc123", api_key="secret")  # lint: ignore CONST-001
        self.assertIsNone(result.error)
        self.assertEqual(result.title, "My Archive")
        self.assertEqual(result.page_id, "abc123")
        self.assertEqual(len(result.blocks), 2)

    @patch("python.core.notion.fetch_blocks")
    @patch("python.core.notion.fetch_page")
    def test_ingest_to_dict_schema(self, mock_page, mock_blocks):
        mock_page.return_value = {
            "id": "abc",
            "url": "https://notion.so/abc",
            "last_edited_time": "2026-03-21T00:00:00.000Z",
            "properties": {"Name": {"type": "title", "title": _rich("Doc")}},
        }
        mock_blocks.return_value = []
        result = ingest(page_id="abc", api_key="secret")  # lint: ignore CONST-001
        d = result.to_dict()
        for key in ("schema_version", "source", "api_version", "page_id",
                    "title", "url", "last_edited", "properties", "blocks", "trace_id"):
            self.assertIn(key, d)
        self.assertEqual(d["source"], "notion")
        self.assertEqual(d["api_version"], NOTION_API_VERSION)

    @patch("python.core.notion.fetch_blocks")
    @patch("python.core.notion.fetch_page")
    def test_ingest_emits_kintsugi_trace(self, mock_page, mock_blocks):
        mock_page.return_value = {"id": "abc", "url": "", "last_edited_time": "", "properties": {}}
        mock_blocks.return_value = []
        em = _emitter()
        ingest(page_id="abc", api_key="secret", emitter=em)  # lint: ignore CONST-001
        log = json.loads(em.export_log())
        self.assertEqual(len(log), 1)
        self.assertEqual(log[0]["event_type"], "action")

    @patch("python.core.notion.fetch_page")
    def test_ingest_api_error_sets_error_field(self, mock_page):
        mock_page.side_effect = NotionAPIError(404, '{"message": "not found"}')
        result = ingest(page_id="bad-id", api_key="secret")  # lint: ignore CONST-001
        self.assertIsNotNone(result.error)
        self.assertIn("404", result.error)


# ── NotionAdapter class ───────────────────────────────────────────────────────

class TestNotionAdapter(unittest.TestCase):

    def test_configured_false_without_key(self):
        with patch.dict(os.environ, {}, clear=True):
            os.environ.pop("NOTION_API_KEY", None)
            os.environ.pop("NOTION_TOKEN", None)
            adapter = NotionAdapter()
        self.assertFalse(adapter.configured)

    def test_configured_true_with_key(self):
        adapter = NotionAdapter(api_key="secret")  # lint: ignore CONST-001
        self.assertTrue(adapter.configured)

    @patch("python.core.notion.ingest")
    def test_adapter_ingest_delegates(self, mock_ingest):
        mock_ingest.return_value = IngestResult(page_id="abc", title="Test")
        adapter = NotionAdapter(api_key="secret")  # lint: ignore CONST-001
        result = adapter.ingest(page_id="abc")
        self.assertEqual(result.title, "Test")
        mock_ingest.assert_called_once()

    @patch("python.core.notion.fetch_page")
    def test_adapter_fetch_page_delegates(self, mock_fetch):
        mock_fetch.return_value = {"id": "abc"}
        adapter = NotionAdapter(api_key="secret")  # lint: ignore CONST-001
        result = adapter.fetch_page("abc")
        self.assertEqual(result["id"], "abc")


if __name__ == "__main__":
    unittest.main()
