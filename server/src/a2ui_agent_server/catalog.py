"""Load the shared A2UI catalog manifest.

Both the TypeScript catalog package and the Python agent read the same JSON
file (packages/catalog/src/catalog.manifest.json). Keeping a single source of
truth means the LLM is told about exactly the components the renderer can
render — adding a new component is one file edit.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

# server/src/a2ui_agent_server/catalog.py
#       parents[3]              = server/
#       parents[4]              = repo root
_MANIFEST_PATH = (
    Path(__file__).resolve().parents[3]
    / "packages"
    / "catalog"
    / "src"
    / "catalog.manifest.json"
)


@lru_cache(maxsize=1)
def load_manifest() -> dict:
    with _MANIFEST_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def catalog_id() -> str:
    return load_manifest()["catalogId"]


def catalog_summary() -> str:
    """Markdown bullet list of components and their props. Drop into a prompt."""
    manifest = load_manifest()
    lines = [f"Catalog id: {manifest['catalogId']}", "", "Available components:"]
    for name, info in manifest["components"].items():
        lines.append(f"- **{name}** — {info['description']}")
        for prop, desc in info["props"].items():
            lines.append(f"    - `{prop}`: {desc}")
    return "\n".join(lines)
