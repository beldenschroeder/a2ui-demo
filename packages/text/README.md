# @a2ui-demo/text

Display text with one of three weight variants: `normal`, `bold`, `subtle`.

```tsx
import { Text } from '@a2ui-demo/text';

<Text text="Ada Lovelace" weight="bold" />
<Text text="Mathematician" weight="subtle" />
```

The A2UI registration accepts a `DynamicString` for `text`, which means an agent can pass a literal, a path binding, or a function call. Defined in `@a2ui-demo/catalog`.
