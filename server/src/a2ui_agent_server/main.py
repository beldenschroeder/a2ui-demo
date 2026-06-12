"""FastAPI app: POST /agent/stream → SSE stream of A2UI messages."""

from __future__ import annotations

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .agent import AgentError, generate

# Look for the project-root .env (server runs from server/ but env lives one up).
load_dotenv(Path(__file__).resolve().parents[3] / ".env")
load_dotenv()  # local fallback


app = FastAPI(title="A2UI demo agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptBody(BaseModel):
    prompt: str


def _sse(event: str, data: dict | str) -> str:
    payload = data if isinstance(data, str) else json.dumps(data)
    return f"event: {event}\ndata: {payload}\n\n"


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {
        "status": "ok",
        "provider": os.environ.get("A2UI_AGENT_PROVIDER", "anthropic"),
    }


@app.post("/agent/stream")
async def stream(body: PromptBody) -> StreamingResponse:
    async def gen():
        try:
            result = await generate(body.prompt)
        except AgentError as e:
            yield _sse("error", str(e))
            yield _sse("done", {})
            return

        for message in result.messages:
            yield _sse("a2ui", message)
        yield _sse("done", {"provider": result.provider})

    return StreamingResponse(gen(), media_type="text/event-stream")
