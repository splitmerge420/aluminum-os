"""
Aluminum OS — Notion Integration Adapter

Zero-dependency module (stdlib only: urllib, json, os) that reads from the
Notion API and converts pages, databases, and block trees into Aluminum OS's
canonical structured-JSON schema.

Why stdlib-only?
  Installing notion-client or @notionhq/client requires pip/npm in the CI
  environment.  Using urllib.request means this works on any Python 3.8+
  system with no extra packages — identical behaviour across macOS, Linux,
  and Windows.

Notion API version pinned: 2026-03-11
  Key changes vs earlier versions (reflected in this module):
  - databases endpoint → dataSources  (both still accepted; we use databases
    for backward compat and dataSources for new features)
  - archived field → in_trash
  - transcription block type → meeting_notes
  - append block children: "after" param → "position" object

Authentication:
  Set NOTION_API_KEY (or NOTION_TOKEN) to your Notion integration secret.
  Obtain one at: https://www.notion.so/my-integrations

Output schema (ingest):
  {
    "schema_version": "1.0",
    "source":         "notion",
    "api_version":    "2026-03-11",
    "page_id":        "...",
    "title":          "...",
    "url":            "...",
    "last_edited":    "...",
    "properties":     {...},   # raw Notion page properties
    "blocks":         [...],   # normalised block list (see _normalise_block)
    "trace_id":       "..."
  }

External references:
  npm:  @notionhq/client v5.9.0   https://www.npmjs.com/package/@notionhq/client
  pip:  notion-client v3.0.0      https://pypi.org/project/notion-client/
  docs: https://developers.notion.com/

Atlas Lattice Foundation — March 2026
"""

import json
import os
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from kintsugi.sdk.golden_trace import GoldenTraceEmitter

# ── API constants ─────────────────────────────────────────────────────────────

NOTION_API_BASE = "https://api.notion.com/v1"
NOTION_API_VERSION = "2026-03-11"
NOTION_API_KEY_ENV = "NOTION_API_KEY"
NOTION_TOKEN_ENV = "NOTION_TOKEN"   # legacy alias

# Canonical npm / pip package versions for install hints
NPM_PACKAGE = "@notionhq/client"
NPM_VERSION = "5.9.0"
PIP_PACKAGE = "notion-client"
PIP_VERSION = "3.0.0"

INSTALL_HINT = (
    f"npm:  npm install -g {NPM_PACKAGE}@{NPM_VERSION}\n"
    f"pip:  pip install {PIP_PACKAGE}=={PIP_VERSION}\n"
    f"docs: https://developers.notion.com/"
)


# ── Data types ────────────────────────────────────────────────────────────────

@dataclass
class NotionBlock:
    """One normalised block extracted from a Notion page."""
    block_id: str
    block_type: str          # paragraph, heading_1, code, to_do, etc.
    text: str                # plain-text concatenation of rich_text array
    level: Optional[int] = None      # 1-3 for headings
    language: Optional[str] = None   # for code blocks
    checked: Optional[bool] = None   # for to_do blocks
    url: Optional[str] = None        # for image / bookmark blocks
    children: List["NotionBlock"] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        d: Dict[str, Any] = {"type": self.block_type, "text": self.text}
        if self.level is not None:
            d["level"] = self.level
        if self.language is not None:
            d["language"] = self.language
        if self.checked is not None:
            d["checked"] = self.checked
        if self.url is not None:
            d["url"] = self.url
        if self.children:
            d["children"] = [c.to_dict() for c in self.children]
        return d


@dataclass
class IngestResult:
    """Structured output of a single Notion page ingest."""
    schema_version: str = "1.0"
    source: str = "notion"
    api_version: str = NOTION_API_VERSION
    page_id: str = ""
    title: str = ""
    url: str = ""
    last_edited: str = ""
    properties: Dict[str, Any] = field(default_factory=dict)
    blocks: List[NotionBlock] = field(default_factory=list)
    trace_id: str = ""
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "schema_version": self.schema_version,
            "source": self.source,
            "api_version": self.api_version,
            "page_id": self.page_id,
            "title": self.title,
            "url": self.url,
            "last_edited": self.last_edited,
            "properties": self.properties,
            "blocks": [b.to_dict() for b in self.blocks],
            "trace_id": self.trace_id,
            "error": self.error,
        }


@dataclass
class DatabaseQueryResult:
    """Structured output of a Notion database query."""
    schema_version: str = "1.0"
    source: str = "notion"
    api_version: str = NOTION_API_VERSION
    database_id: str = ""
    pages: List[IngestResult] = field(default_factory=list)
    next_cursor: Optional[str] = None
    has_more: bool = False
    trace_id: str = ""
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "schema_version": self.schema_version,
            "source": self.source,
            "api_version": self.api_version,
            "database_id": self.database_id,
            "pages": [p.to_dict() for p in self.pages],
            "next_cursor": self.next_cursor,
            "has_more": self.has_more,
            "trace_id": self.trace_id,
            "error": self.error,
        }


# ── Authentication ────────────────────────────────────────────────────────────

def _get_api_key() -> Optional[str]:
    """Return the Notion API key from environment variables, or None."""
    return os.environ.get(NOTION_API_KEY_ENV) or os.environ.get(NOTION_TOKEN_ENV)


def _auth_headers(api_key: str) -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {api_key}",
        "Notion-Version": NOTION_API_VERSION,
        "Content-Type": "application/json",
    }


# ── HTTP helpers ──────────────────────────────────────────────────────────────

def _get(path: str, api_key: str, timeout: int = 15) -> Dict[str, Any]:
    """HTTP GET to Notion API; returns parsed JSON dict."""
    url = f"{NOTION_API_BASE}{path}"
    req = urllib.request.Request(url, headers=_auth_headers(api_key))
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise NotionAPIError(exc.code, body) from exc


def _post(path: str, api_key: str, payload: Dict[str, Any], timeout: int = 15) -> Dict[str, Any]:
    """HTTP POST to Notion API; returns parsed JSON dict."""
    url = f"{NOTION_API_BASE}{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=_auth_headers(api_key), method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise NotionAPIError(exc.code, body) from exc


class NotionAPIError(Exception):
    """Raised when the Notion API returns an HTTP error."""
    def __init__(self, status_code: int, body: str):
        self.status_code = status_code
        self.body = body
        super().__init__(f"Notion API error {status_code}: {body[:200]}")


# ── Rich-text extraction ──────────────────────────────────────────────────────

def _rich_text_to_str(rich_text: List[Dict[str, Any]]) -> str:
    """Concatenate Notion rich_text array to a plain string."""
    return "".join(part.get("plain_text", "") for part in rich_text)


def _page_title(page: Dict[str, Any]) -> str:
    """Extract plain-text title from a Notion page object."""
    props = page.get("properties", {})
    for val in props.values():
        if val.get("type") == "title":
            return _rich_text_to_str(val.get("title", []))
    # Fallback: check top-level title key (databases)
    title_list = page.get("title", [])
    if title_list:
        return _rich_text_to_str(title_list)
    return ""


# ── Block normalisation ───────────────────────────────────────────────────────

_HEADING_TYPES = {"heading_1": 1, "heading_2": 2, "heading_3": 3}

def _normalise_block(raw: Dict[str, Any]) -> Optional[NotionBlock]:
    """Convert one raw Notion block dict to a NotionBlock.

    Handles all common block types.  Unknown types are returned with
    block_type preserved and empty text so no data is silently dropped.
    """
    btype = raw.get("type", "unknown")
    bid = raw.get("id", "")
    inner = raw.get(btype, {})

    # Paragraph / list items / quote / callout / toggle
    if btype in (
        "paragraph", "bulleted_list_item", "numbered_list_item",
        "quote", "callout", "toggle",
    ):
        text = _rich_text_to_str(inner.get("rich_text", []))
        return NotionBlock(block_id=bid, block_type=btype, text=text)

    # Headings
    if btype in _HEADING_TYPES:
        text = _rich_text_to_str(inner.get("rich_text", []))
        return NotionBlock(
            block_id=bid, block_type="heading",
            text=text, level=_HEADING_TYPES[btype],
        )

    # Code
    if btype == "code":
        text = _rich_text_to_str(inner.get("rich_text", []))
        lang = inner.get("language", "")
        return NotionBlock(block_id=bid, block_type="code", text=text, language=lang)

    # To-do
    if btype == "to_do":
        text = _rich_text_to_str(inner.get("rich_text", []))
        checked = bool(inner.get("checked", False))
        return NotionBlock(block_id=bid, block_type="to_do", text=text, checked=checked)

    # Image / video / file / pdf / audio
    if btype in ("image", "video", "file", "pdf", "audio"):
        file_obj = inner.get("file") or inner.get("external") or {}
        url = file_obj.get("url", "")
        caption = _rich_text_to_str(inner.get("caption", []))
        return NotionBlock(block_id=bid, block_type=btype, text=caption, url=url)

    # Bookmark / link_preview
    if btype in ("bookmark", "link_preview"):
        url = inner.get("url", "")
        caption = _rich_text_to_str(inner.get("caption", []))
        return NotionBlock(block_id=bid, block_type=btype, text=caption, url=url)

    # Divider / table_of_contents / breadcrumb
    if btype in ("divider", "table_of_contents", "breadcrumb"):
        return NotionBlock(block_id=bid, block_type=btype, text="")

    # Table row
    if btype == "table_row":
        cells = [_rich_text_to_str(c) for c in inner.get("cells", [])]
        return NotionBlock(block_id=bid, block_type="table_row", text="\t".join(cells))

    # meeting_notes (formerly transcription — Notion API 2026-03-11)
    if btype == "meeting_notes":
        text = _rich_text_to_str(inner.get("rich_text", []))
        return NotionBlock(block_id=bid, block_type="meeting_notes", text=text)

    # child_page / child_database — record as a reference
    if btype in ("child_page", "child_database"):
        title = inner.get("title", "")
        return NotionBlock(block_id=bid, block_type=btype, text=title)

    # Unsupported type — preserve so no data is silently dropped
    return NotionBlock(block_id=bid, block_type=btype, text="")


# ── Core API functions ────────────────────────────────────────────────────────

def fetch_page(
    page_id: str,
    api_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Retrieve a Notion page object (metadata + properties only, no blocks).

    Args:
        page_id: Notion page UUID (with or without hyphens).
        api_key: API key; falls back to NOTION_API_KEY env var.

    Returns:
        Raw Notion page dict.

    Raises:
        NotionAPIError: on HTTP error.
        ValueError: if no API key is available.
    """
    key = api_key or _get_api_key()
    if not key:
        raise ValueError(
            f"Notion API key not set. Export {NOTION_API_KEY_ENV}.\n{INSTALL_HINT}"
        )
    pid = page_id.replace("-", "")
    return _get(f"/pages/{pid}", key)


def fetch_blocks(
    block_id: str,
    api_key: Optional[str] = None,
    max_depth: int = 3,
    _depth: int = 0,
) -> List[NotionBlock]:
    """Recursively retrieve and normalise all children of a block (or page).

    Args:
        block_id:  Block or page UUID.
        api_key:   API key; falls back to NOTION_API_KEY env var.
        max_depth: Maximum recursion depth for nested blocks (default: 3).

    Returns:
        Flat-ish list of NotionBlock objects; children are nested inside
        toggled/synced blocks when present.

    Raises:
        NotionAPIError, ValueError.
    """
    key = api_key or _get_api_key()
    if not key:
        raise ValueError(f"Notion API key not set. Export {NOTION_API_KEY_ENV}.")

    bid = block_id.replace("-", "")
    blocks: List[NotionBlock] = []
    cursor: Optional[str] = None

    while True:
        path = f"/blocks/{bid}/children?page_size=100"
        if cursor:
            path += f"&start_cursor={cursor}"
        data = _get(path, key)
        for raw in data.get("results", []):
            nb = _normalise_block(raw)
            if nb is None:
                continue
            # Recurse into blocks that can have children
            if (
                _depth < max_depth
                and raw.get("has_children")
                and raw.get("type") in (
                    "toggle", "bulleted_list_item", "numbered_list_item",
                    "to_do", "quote", "callout", "column", "synced_block",
                    "table", "child_page",
                )
            ):
                nb.children = fetch_blocks(
                    raw["id"], key, max_depth=max_depth, _depth=_depth + 1
                )
            blocks.append(nb)
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")

    return blocks


def query_database(
    database_id: str,
    api_key: Optional[str] = None,
    filter_payload: Optional[Dict[str, Any]] = None,
    page_size: int = 50,
) -> DatabaseQueryResult:
    """Query a Notion database (or DataSource).

    Args:
        database_id:    Notion database UUID.
        api_key:        API key; falls back to NOTION_API_KEY env var.
        filter_payload: Optional Notion filter object (e.g. ``{"property":
                        "Status", "select": {"equals": "Done"}}``).
        page_size:      Number of results per page (max 100).

    Returns:
        DatabaseQueryResult with page stubs (no block content fetched).
    """
    key = api_key or _get_api_key()
    if not key:
        raise ValueError(f"Notion API key not set. Export {NOTION_API_KEY_ENV}.")

    did = database_id.replace("-", "")
    payload: Dict[str, Any] = {"page_size": min(page_size, 100)}
    if filter_payload:
        payload["filter"] = filter_payload

    data = _post(f"/databases/{did}/query", key, payload)

    pages = []
    for raw_page in data.get("results", []):
        pages.append(IngestResult(
            page_id=raw_page.get("id", ""),
            title=_page_title(raw_page),
            url=raw_page.get("url", ""),
            last_edited=raw_page.get("last_edited_time", ""),
            properties=raw_page.get("properties", {}),
        ))

    return DatabaseQueryResult(
        database_id=database_id,
        pages=pages,
        next_cursor=data.get("next_cursor"),
        has_more=bool(data.get("has_more")),
    )


def ingest(
    page_id: Optional[str] = None,
    database_id: Optional[str] = None,
    api_key: Optional[str] = None,
    max_depth: int = 3,
    emitter: Optional[GoldenTraceEmitter] = None,
) -> IngestResult:
    """Ingest a Notion page (or first page of a database) into structured JSON.

    This is the primary entry-point for ``uws workspace ingest --source=notion``.
    Converts unstructured Notion content into Aluminum OS's canonical JSON
    schema so it can be processed by the ModelRouter or stored in the
    GoldenTrace audit ledger.

    Args:
        page_id:     Notion page UUID.  Provide either this or database_id.
        database_id: Notion database UUID.  If provided without page_id,
                     ingests the first result of a database query.
        api_key:     API key; falls back to NOTION_API_KEY env var.
        max_depth:   Maximum block recursion depth (default: 3).
        emitter:     Optional Kintsugi emitter for audit trace.

    Returns:
        IngestResult with full structured content.  ``error`` field is set
        (and blocks is empty) on any API failure so the caller can decide
        whether to raise or handle gracefully.
    """
    key = api_key or _get_api_key()
    result = IngestResult()

    if not key:
        result.error = (
            f"Notion API key not set. Export {NOTION_API_KEY_ENV}.\n{INSTALL_HINT}"
        )
        return result

    try:
        # Resolve page_id from database if only database_id was given
        resolved_page_id = page_id
        if resolved_page_id is None and database_id is not None:
            db_result = query_database(database_id, api_key=key, page_size=1)
            if not db_result.pages:
                result.error = f"Database {database_id!r} returned no pages."
                return result
            resolved_page_id = db_result.pages[0].page_id

        if resolved_page_id is None:
            result.error = "Provide page_id or database_id."
            return result

        # Fetch page metadata
        raw_page = fetch_page(resolved_page_id, api_key=key)
        result.page_id = raw_page.get("id", resolved_page_id)
        result.title = _page_title(raw_page)
        result.url = raw_page.get("url", "")
        result.last_edited = raw_page.get("last_edited_time", "")
        result.properties = raw_page.get("properties", {})

        # Fetch and normalise block tree
        result.blocks = fetch_blocks(resolved_page_id, api_key=key, max_depth=max_depth)

    except NotionAPIError as exc:
        result.error = str(exc)
    except Exception as exc:  # pragma: no cover
        result.error = f"Unexpected error: {exc}"

    if emitter is not None:
        severity = "info" if result.error is None else "warning"
        trace = emitter.emit(
            event_type="action",
            sphere_tag="H1.S2",
            aluminum_layer="L1-Constitutional",
            function="notion.ingest",
            severity=severity,
            payload={
                "page_id": result.page_id,
                "title": result.title,
                "block_count": len(result.blocks),
                "error": result.error,
            },
        )
        result.trace_id = trace["trace_id"]

    return result


# ── High-level adapter ────────────────────────────────────────────────────────

class NotionAdapter:
    """High-level interface combining authentication, fetch, and ingest.

    Usage::

        adapter = NotionAdapter()          # reads NOTION_API_KEY from env
        result = adapter.ingest(page_id="abc123")
        print(result.title)
        for block in result.blocks:
            print(block.to_dict())
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        emitter: Optional[GoldenTraceEmitter] = None,
    ):
        self._key = api_key or _get_api_key()
        self._emitter = emitter

    @property
    def configured(self) -> bool:
        """True if an API key is available."""
        return bool(self._key)

    def ingest(
        self,
        page_id: Optional[str] = None,
        database_id: Optional[str] = None,
        max_depth: int = 3,
    ) -> IngestResult:
        """Ingest a page or first database result into structured JSON."""
        return ingest(
            page_id=page_id,
            database_id=database_id,
            api_key=self._key,
            max_depth=max_depth,
            emitter=self._emitter,
        )

    def fetch_page(self, page_id: str) -> Dict[str, Any]:
        """Return the raw Notion page dict for *page_id*."""
        return fetch_page(page_id, api_key=self._key)

    def fetch_blocks(self, block_id: str, max_depth: int = 3) -> List[NotionBlock]:
        """Return normalised blocks for *block_id*."""
        return fetch_blocks(block_id, api_key=self._key, max_depth=max_depth)

    def query_database(
        self,
        database_id: str,
        filter_payload: Optional[Dict[str, Any]] = None,
        page_size: int = 50,
    ) -> DatabaseQueryResult:
        """Query a Notion database."""
        return query_database(
            database_id,
            api_key=self._key,
            filter_payload=filter_payload,
            page_size=page_size,
        )
