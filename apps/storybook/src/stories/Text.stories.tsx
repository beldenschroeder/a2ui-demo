import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '@a2ui-demo/text';
import { A2UIDemoSurface } from '../internal/A2UIDemoSurface';
import { CATALOG_ID } from '../internal/constants';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Direct: Story = {
  name: 'Direct — React variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text text="Normal weight" />
      <Text text="Bold weight" weight="bold" />
      <Text text="Subtle weight" weight="subtle" />
    </div>
  ),
};

export const ViaA2UI: Story = {
  name: 'Via A2UI — DynamicString binding',
  render: () => (
    <A2UIDemoSurface
      label="Text via A2UI"
      messages={[
        { version: 'v0.9', createSurface: { surfaceId: 'txt', catalogId: CATALOG_ID } },
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'txt',
            components: [
              { id: 'root', component: 'Text', text: { path: '/message' }, weight: 'bold' },
            ],
          },
        },
        {
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'txt',
            path: '/',
            value: { message: 'Bound from /message' },
          },
        },
      ]}
    />
  ),
};
