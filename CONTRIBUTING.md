# Contributing — adding a new component

Adding a custom A2UI component is two edits in two places:

1. Add a new package under `packages/<your-component>/` with the pure React component.
2. Register it in `@a2ui-demo/catalog`.

That's it. The Python agent picks up the change automatically because it reads `packages/catalog/src/catalog.manifest.json`.

## 1. Scaffold the component package

```bash
mkdir -p packages/<your-component>/src
```

Copy these files from `packages/button/` as a template, renaming `button` → `<your-component>`:

```
packages/<your-component>/
├── package.json          # bump version, rename, drop deps you don't need
├── tsconfig.json
├── tsconfig.lib.json
├── vite.config.ts        # change lib.name to a unique global
├── project.json          # change "name" + cwd paths
├── README.md
└── src/
    ├── index.ts              # exports { YourComponent, type YourComponentProps }
    ├── YourComponent.tsx     # pure React component
    ├── YourComponent.css.ts  # Vanilla Extract styles
    └── YourComponent.test.tsx
```

**Component packages must stay renderer-agnostic** — no dependency on `@a2ui/react`. They're shipped to npm so anyone can use them in a regular React app.

## 2. Register it with A2UI

In `packages/catalog/src/registrations.tsx`, add a `createComponentImplementation` block:

```tsx
import { YourComponent } from '@a2ui-demo/<your-component>';

export const YourComponentRegistration = createComponentImplementation(
  {
    name: 'YourComponent',
    schema: z.object({
      // Use CommonSchemas.DynamicString for path-bindable strings.
      // Use CommonSchemas.Action for click/change events.
      // Use CommonSchemas.ComponentId for child references.
      label: CommonSchemas.DynamicString,
    }),
  },
  ({ props }) => <YourComponent label={String(props.label ?? '')} />,
);
```

Then add it to the catalog map in `packages/catalog/src/catalog.ts`:

```ts
export const customCatalog: Catalog<ReactComponentImplementation> = {
  id: CATALOG_ID,
  components: {
    // ... existing
    YourComponent: YourComponentRegistration,
  },
};
```

## 3. Tell the agent about it

Add an entry to `packages/catalog/src/catalog.manifest.json`. This is what gets dropped into the LLM system prompt — be precise about props:

```json
"YourComponent": {
  "description": "What this component renders, in one sentence.",
  "props": {
    "label": "DynamicString — required. Text shown on the component."
  }
}
```

That's the only place the Python agent reads from — no change in `server/` is needed.

## 4. Wire it into the workspace

- Add the new path to `paths` in `tsconfig.base.json`.
- Add it to `apps/storybook/package.json` `dependencies` and to `apps/storybook/project.json` `implicitDependencies`.
- Add `@a2ui-demo/<your-component>` to the `dependencies` of `@a2ui-demo/catalog`.
- Run `npm install`.

## 5. Add a Storybook story

Copy `apps/storybook/src/stories/Button.stories.tsx` and follow the same two-variant pattern:

- **Direct** — render the React component in JSX.
- **Via A2UI** — render via `<A2UIDemoSurface>` with an A2UI JSON payload that uses your component.

That dual story is the contract test: it proves the React API and the A2UI API agree.

## 6. Test

```bash
# from the repo root
npm run lint
npm run test
npm run build
npm run build:storybook
```

Python side (only if you touched the server):

```bash
uv run --directory server ruff check .
uv run --directory server pytest
```

## Versioning

Each component package is versioned independently. Treat the component's React API and its A2UI catalog entry as a **joint contract** — when you change either, bump the component package version AND the catalog package version. Old surfaces that referenced the old shape will break, just like any other API change.

## Conventions

- One component = one package. Don't add a second component to an existing package.
- No `@a2ui/react` or `@a2ui/web_core` dependency in the component packages — keep them portable.
- Style with Vanilla Extract (`*.css.ts`). Don't reach for a different styling system per package.
- Write at least one Vitest test for the React component, and at least one Storybook "Via A2UI" story.
- The catalog manifest entry is the agent-facing contract. Be specific in the prop descriptions; the LLM is reading them.
