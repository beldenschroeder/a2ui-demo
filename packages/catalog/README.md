# @a2ui-demo/catalog

The A2UI integration layer for the `@a2ui-demo/*` component packages.

It does three things:

1. Holds the **catalog manifest** (`src/catalog.manifest.json`) — the source of truth that lists every component and what props it accepts. Both the TypeScript renderer and the Python agent server read this file.
2. Exports `customCatalog` — a `Catalog<ReactComponentImplementation>` you hand to `@a2ui/web_core`'s `MessageProcessor`.
3. Exports `agentInstructions()` — a string version of the manifest you can drop into an LLM system prompt.

## Usage in a React app

```ts
import { MessageProcessor } from '@a2ui/web_core/v0_9';
import { A2uiSurface } from '@a2ui/react/v0_9';
import { customCatalog, CATALOG_ID } from '@a2ui-demo/catalog';

const processor = new MessageProcessor([customCatalog]);
processor.onSurfaceCreated((surface) => setSurface(surface));
processor.processMessages([
  { version: 'v0.9', createSurface:    { surfaceId: 's', catalogId: CATALOG_ID } },
  { version: 'v0.9', updateComponents: { surfaceId: 's', components: [
    { id: 'root', component: 'Card', title: 'Hello', child: 't' },
    { id: 't',    component: 'Text', text: { path: '/name' } },
  ] } },
  { version: 'v0.9', updateDataModel:  { surfaceId: 's', path: '/', value: { name: 'Ada' } } },
]);

// then:
<A2uiSurface surface={surface} />;
```

## Adding a new component

1. Add a new package under `packages/<your-component>/` (see `CONTRIBUTING.md`).
2. Add a `createComponentImplementation` registration in `src/registrations.tsx`.
3. Add the component to `customCatalog.components` in `src/catalog.ts`.
4. Add the manifest entry in `src/catalog.manifest.json` — that's what the agent sees.
