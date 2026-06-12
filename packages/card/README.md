# @a2ui-demo/card

A simple framed container with an optional title. Use it to group other components.

```tsx
import { Card } from '@a2ui-demo/card';
import { Text } from '@a2ui-demo/text';

<Card title="Profile">
  <Text text="Ada Lovelace" weight="bold" />
  <Text text="Mathematician · Programmer" />
</Card>
```

The A2UI registration treats `child` as a component reference and `title` as a `DynamicString`. Defined in `@a2ui-demo/catalog`.
