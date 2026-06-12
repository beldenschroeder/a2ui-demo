# A2UI demo agent server

A small FastAPI service that asks an LLM (Claude or Gemini) to emit a JSON array of A2UI v0.9 messages, then streams them back to the client over Server-Sent Events.

## Why so small?

The agent has exactly one job: produce a `<a2ui-json>[ ... ]</a2ui-json>` block. The system prompt (`src/a2ui_agent_server/prompts.py`) enforces the shape; `src/a2ui_agent_server/parser.py` pulls the array out and validates it's a list of dicts. Anything else is treated as an error.

That keeps this demo provider-agnostic — swap Claude for Gemini by flipping `A2UI_AGENT_PROVIDER` in `.env`.

## Run it

```bash
# from the repo root
uv sync --directory server
uv run --directory server uvicorn a2ui_agent_server.main:app --reload --port 8000
```

…or use the script from the repo root:

```bash
npm run agent:dev
```

## Test it

```bash
curl -N -X POST http://localhost:8000/agent/stream \
  -H 'Content-Type: application/json' \
  -d '{"prompt": "Show me a contact card for Grace Hopper"}'
```

You should see a `event: a2ui` line per message, followed by `event: done`.

## Wire format

```
event: a2ui
data: { "version": "v0.9", "createSurface": {...} }

event: a2ui
data: { "version": "v0.9", "updateComponents": {...} }

event: a2ui
data: { "version": "v0.9", "updateDataModel": {...} }

event: done
data: { "provider": "anthropic" }
```

The TypeScript client in `packages/agent-client/src/useAgentStream.ts` consumes exactly this format.
