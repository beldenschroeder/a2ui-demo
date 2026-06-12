import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@a2ui-demo/card';
import { Text } from '@a2ui-demo/text';
import { Button } from '@a2ui-demo/button';
import { A2UIDemoSurface } from '../internal/A2UIDemoSurface';
import { CATALOG_ID } from '../internal/constants';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Direct: Story = {
  name: 'Direct — React composition',
  render: () => (
    <Card title="Profile">
      <Text text="Ada Lovelace" weight="bold" />
      <Text text="Mathematician · Programmer" weight="subtle" />
      <Button label="Follow" />
    </Card>
  ),
};

export const ViaA2UI: Story = {
  name: 'Via A2UI — Agent JSON with nested ids',
  render: () => (
    <A2UIDemoSurface
      label="Card via A2UI"
      messages={[
        { version: 'v0.9', createSurface: { surfaceId: 'card', catalogId: CATALOG_ID } },
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'card',
            components: [
              { id: 'root', component: 'Card', title: { path: '/title' }, child: 'name' },
              { id: 'name', component: 'Text', text: { path: '/name' }, weight: 'bold' },
            ],
          },
        },
        {
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'card',
            path: '/',
            value: { title: 'Profile', name: 'Ada Lovelace' },
          },
        },
      ]}
    />
  ),
};
