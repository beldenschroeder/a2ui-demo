# @a2ui-demo/button

A plain React button styled with Vanilla Extract. Two variants: `primary` (default) and `secondary`.

```tsx
import { Button } from '@a2ui-demo/button';

<Button label="Save" onClick={() => save()} />
<Button label="Cancel" variant="secondary" />
```

This package is **renderer-agnostic** — it has no dependency on `@a2ui/react`. The A2UI registration that lets an agent request a `Button` lives in `@a2ui-demo/catalog`.
