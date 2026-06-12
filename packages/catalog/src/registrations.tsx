import { useEffect, useState } from 'react';
import { z } from 'zod';
import { CommonSchemas, createComponentImplementation } from '@a2ui/react/v0_9';

import { Button } from '@a2ui-demo/button';
import { Card } from '@a2ui-demo/card';
import { Text } from '@a2ui-demo/text';
import { TextInput } from '@a2ui-demo/text-input';

/**
 * Each `createComponentImplementation` call is the bridge between an agent's
 * abstract component declaration and a concrete React component.
 *
 * - `name`   — the string the agent uses in `updateComponents`.
 * - `schema` — Zod schema declaring which props are allowed. The renderer's
 *              GenericBinder resolves data-model bindings before handing
 *              `props` to the render function.
 * - render() — receives the resolved props plus `buildChild` for nested ids.
 */

export const ButtonRegistration = createComponentImplementation(
  {
    name: 'Button',
    schema: z.object({
      label: CommonSchemas.DynamicString,
      variant: z.enum(['primary', 'secondary']).optional(),
      onClick: CommonSchemas.Action.optional(),
    }),
  },
  ({ props }) => (
    <Button
      label={String(props.label ?? '')}
      variant={props.variant}
      onClick={props.onClick ? () => props.onClick?.() : undefined}
    />
  ),
);

export const TextRegistration = createComponentImplementation(
  {
    name: 'Text',
    schema: z.object({
      text: CommonSchemas.DynamicString,
      weight: z.enum(['normal', 'bold', 'subtle']).optional(),
    }),
  },
  ({ props }) => (
    <Text text={String(props.text ?? '')} weight={props.weight} />
  ),
);

export const CardRegistration = createComponentImplementation(
  {
    name: 'Card',
    schema: z.object({
      title: CommonSchemas.DynamicString.optional(),
      child: CommonSchemas.ComponentId.optional(),
    }),
  },
  ({ props, buildChild }) => (
    <Card title={props.title ? String(props.title) : undefined}>
      {props.child ? buildChild(String(props.child)) : null}
    </Card>
  ),
);

export const TextInputRegistration = createComponentImplementation(
  {
    name: 'TextInput',
    schema: z.object({
      label: CommonSchemas.DynamicString.optional(),
      value: CommonSchemas.DynamicString.optional(),
      placeholder: CommonSchemas.DynamicString.optional(),
      onChange: CommonSchemas.Action.optional(),
    }),
  },
  ({ props }) => {
    const incoming = String(props.value ?? '');
    const [v, setV] = useState(incoming);
    // Re-sync if the agent pushes a new data-model value mid-session.
    useEffect(() => setV(incoming), [incoming]);
    return (
      <TextInput
        label={props.label ? String(props.label) : undefined}
        placeholder={props.placeholder ? String(props.placeholder) : undefined}
        value={v}
        onChange={(next) => {
          setV(next);
          props.onChange?.();
        }}
      />
    );
  },
);
