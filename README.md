# a2ui-demo

A minimal Nx monorepo that shows how [A2UI](https://a2ui.org/) works end-to-end with a **custom catalog of your own components**.

- Each component is its own publishable npm library under `packages/*`.
- `@a2ui-demo/catalog` registers those components with the A2UI renderer.
- A Storybook site under `apps/storybook` uses them — both directly as React components AND through A2UI.
- A small Python agent server under `server/` shows how an LLM emits A2UI JSON that references only the custom catalog.

If you just want to see it work: skip to **Get running**.

## What is A2UI?

A2UI ("Agent-to-User Interface") is a JSON specification an agent emits instead of HTML or code. A renderer in the client maps each abstract component declaration to a real React (or Lit, or Flutter) component from a **pre-approved catalog**. The agent can't execute arbitrary code in your app — it can only request UI from the catalog you allow.

That last word — _catalog_ — is what this repo is about. Most A2UI demos use the upstream `basicCatalog`. Here we ship our own.

### The 3-message lifecycle

Every A2UI exchange is just three messages over the wire:

```jsonc
// 1. Claim a surface and declare which catalog is allowed.
{ "version": "v0.9", "createSurface":    { "surfaceId": "demo", "catalogId": "https://a2ui-demo.local/catalogs/custom/v1/catalog.json" } }

// 2. Declare the component tree by ID. Children reference other IDs.
{ "version": "v0.9", "updateComponents": { "surfaceId": "demo", "components": [
    { "id": "root",  "component": "Card",  "title": "Hello", "child": "msg" },
    { "id": "msg",   "component": "Text",  "text": { "path": "/greeting" }, "weight": "bold" }
] } }

// 3. Supply the data the bindings resolve against.
{ "version": "v0.9", "updateDataModel":  { "surfaceId": "demo", "path": "/", "value": { "greeting": "Hi Ada!" } } }
```

Three kinds of values:

- **Literal**: `"text": "Hello"`.
- **Path binding**: `"text": { "path": "/greeting" }` — JSON Pointer into the data model.
- **Function call**: `"text": { "call": "formatDate", "args": {...}, "returnType": "string" }`.

## How this repo maps to A2UI

```
packages/                                  # publishable NPM libraries
  ├── button/      @a2ui-demo/button       — React <Button>      (vanilla-extract)
  ├── text-input/  @a2ui-demo/text-input   — React <TextInput>
  ├── card/        @a2ui-demo/card         — React <Card>
  ├── text/        @a2ui-demo/text         — React <Text>
  └── catalog/     @a2ui-demo/catalog      — A2UI Catalog<ReactComponentImplementation>
                                              + catalog.manifest.json (source of truth
                                                read by both TS and Python)

apps/
  └── storybook/   internal renderer wiring lives under src/internal/ — not shipped.

server/            FastAPI agent. Reads packages/catalog/src/catalog.manifest.json
                   so the LLM only ever sees the catalog the renderer accepts.
```

The four component packages are **renderer-agnostic** — they have no dependency on `@a2ui/react`. A consumer who only wants the React `<Button>` doesn't pull in the A2UI runtime. The A2UI registration that lets an agent request `Button` lives entirely in `@a2ui-demo/catalog`.

The Storybook app pulls in **all five packages** plus `@a2ui/react` + `@a2ui/web_core` directly. The renderer wiring (`A2UIDemoSurface`, `AgentSurface`, SSE client) is private app code under `apps/storybook/src/internal/` — we don't ship wrappers around third-party libraries as packages.

### Each story has two variants

Every component's story shows it **both ways**:

- **Direct** — the React component used as-is in JSX. This is how a consumer imports it from npm.
- **Via A2UI** — the same component rendered from a JSON A2UI message through the custom catalog.

That dual view is the point of A2UI: the components don't know they're being driven by an agent — the catalog is the only glue.

## Get running

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm 10+
- [uv](https://docs.astral.sh/uv/) for the Python server
- A Claude **or** Gemini API key

### 1. Install JS deps

```bash
npm install
```

### 2. Configure your `.env`

```bash
cp .env.example .env
# edit .env: set A2UI_AGENT_PROVIDER + the matching API key
```

### 3. Run Storybook

```bash
npm run storybook
```

Open <http://localhost:6006>. The **Components/** stories work standalone. The **Agent → Live Agent** story needs the Python server up.

### 4. (Optional) Run the Python agent

In a separate terminal:

```bash
uv sync --directory server
npm run agent:dev          # serves on http://localhost:8000
```

Then refresh the Storybook **Agent → Live Agent** story and click **Generate**.

## How the live agent demo works

```
┌───────────────────────┐                      ┌────────────────────────────┐
│ Storybook story        │                      │ FastAPI agent server       │
│ <AgentSurface/>        │  POST /agent/stream  │ POST → LLM → parse →       │
│ ├ useAgentStream()     │ ───────────────────► │ SSE stream of A2UI messages│
│ └ <A2UIDemoSurface/>   │ ◄─────────────────── │                            │
└──────────┬─────────────┘   event: a2ui        └──────────┬─────────────────┘
           │ MessageProcessor                              │ Anthropic SDK
           │ + customCatalog                               │ or google-genai
           │ → <A2uiSurface>                               │
           ▼                                               ▼
     Rendered React tree                                Claude / Gemini
   (Card / Text / Button /                             Prompted with the
    TextInput from packages/*)                          catalog manifest
```

Single source of truth: `packages/catalog/src/catalog.manifest.json`. The TS catalog and the Python prompt both read it. Change one place, both sides update.

The whole agent fits in four small files:

- `server/src/a2ui_agent_server/catalog.py` — loads the shared manifest.
- `server/src/a2ui_agent_server/prompts.py` — builds the system prompt from the manifest.
- `server/src/a2ui_agent_server/agent.py` — provider-agnostic `generate(prompt)`; picks Claude or Gemini from `A2UI_AGENT_PROVIDER`.
- `server/src/a2ui_agent_server/parser.py` — pulls the JSON array out of `<a2ui-json>...</a2ui-json>`.

## Useful commands

| What                   | Command                            |
| ---------------------- | ---------------------------------- |
| Install                | `npm install`                      |
| Storybook (dev)        | `npm run storybook`                |
| Build all packages     | `npm run build`                    |
| Build static Storybook | `npm run build:storybook`          |
| Run all tests (Vitest) | `npm run test`                     |
| Run agent (Python)     | `npm run agent:dev`                |
| Agent tests (pytest)   | `uv run --directory server pytest` |

## Where to look next

- Upstream A2UI repo: <https://github.com/a2ui-project/a2ui>
- Basic catalog spec (the off-the-shelf component catalog we _don't_ use here): `specification/v0_9/catalogs/basic/catalog.json` in that repo.
- Reference React renderer: `renderers/react/` in that repo.

## License

MIT.
