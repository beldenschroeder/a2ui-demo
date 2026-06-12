# @a2ui-demo/text-input

Controlled text input styled with Vanilla Extract.

```tsx
import { TextInput } from '@a2ui-demo/text-input';

<TextInput label="Email" value={email} onChange={setEmail} />
```

This package is **renderer-agnostic**. The A2UI registration — which wires `value` to a JSON Pointer path so the agent can read/write the data model — lives in `@a2ui-demo/catalog`.
