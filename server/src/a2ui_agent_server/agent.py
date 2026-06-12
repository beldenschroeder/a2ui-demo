"""Provider-agnostic agent: ask an LLM for A2UI JSON, parse, return messages."""

from __future__ import annotations

import os
from dataclasses import dataclass

from .parser import extract_messages
from .prompts import build_system_prompt


@dataclass
class AgentResult:
    messages: list[dict]
    raw: str
    provider: str


class AgentError(RuntimeError):
    pass


async def generate(prompt: str) -> AgentResult:
    provider = os.environ.get("A2UI_AGENT_PROVIDER", "anthropic").lower()
    if provider == "anthropic":
        raw = await _call_anthropic(prompt)
    elif provider == "gemini":
        raw = await _call_gemini(prompt)
    else:
        raise AgentError(f"Unknown A2UI_AGENT_PROVIDER: {provider}")

    messages = extract_messages(raw)
    if not messages:
        raise AgentError(
            "Agent did not return a valid <a2ui-json>...</a2ui-json> block."
        )
    return AgentResult(messages=messages, raw=raw, provider=provider)


async def _call_anthropic(prompt: str) -> str:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise AgentError("ANTHROPIC_API_KEY is not set.")
    model = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-6")

    # Imported lazily so the module is importable without the SDK installed
    # (e.g. when running unit tests that only exercise the parser).
    from anthropic import AsyncAnthropic

    client = AsyncAnthropic(api_key=api_key)
    msg = await client.messages.create(
        model=model,
        max_tokens=2048,
        system=build_system_prompt(),
        messages=[{"role": "user", "content": prompt}],
    )
    parts = [block.text for block in msg.content if getattr(block, "type", "") == "text"]
    return "".join(parts)


async def _call_gemini(prompt: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise AgentError("GEMINI_API_KEY is not set.")
    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    resp = await client.aio.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(system_instruction=build_system_prompt()),
    )
    return resp.text or ""
