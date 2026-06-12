"""Extract A2UI message arrays from LLM output."""

from __future__ import annotations

import json
import re
from typing import Iterable

A2UI_BLOCK = re.compile(r"<a2ui-json>\s*(\[.*?\])\s*</a2ui-json>", re.DOTALL)


def extract_messages(text: str) -> list[dict]:
    """Pull the JSON array out of <a2ui-json>...</a2ui-json> and parse it.

    Returns an empty list if nothing usable is found — the agent server
    surfaces this as an error event so the UI doesn't render half a surface.
    """
    match = A2UI_BLOCK.search(text)
    if not match:
        return []
    raw = match.group(1)
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return []
    if not isinstance(parsed, list):
        return []
    return [m for m in parsed if isinstance(m, dict)]


def iter_messages(text: str) -> Iterable[dict]:
    yield from extract_messages(text)
