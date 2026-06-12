import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from '@a2ui-demo/text-input';
import { A2UIDemoSurface } from '../internal/A2UIDemoSurface';
import { CATALOG_ID } from '../internal/constants';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TextInput>;

export const Direct: Story = {
  name: 'Direct — Controlled React',
  render: () => {
    const [v, setV] = useState('Ada');
    return <TextInput label="Name" value={v} onChange={setV} />;
  },
};

export const ViaA2UI: Story = {
  name: 'Via A2UI — Initial value from data model',
  render: () => (
    <A2UIDemoSurface
      label="TextInput via A2UI"
      messages={[
        { version: 'v0.9', createSurface: { surfaceId: 'ti', catalogId: CATALOG_ID } },
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'ti',
            components: [
              {
                id: 'root',
                component: 'TextInput',
                label: 'Name',
                value: { path: '/name' },
                placeholder: 'Type your name',
              },
            ],
          },
        },
        {
          version: 'v0.9',
          updateDataModel: { surfaceId: 'ti', path: '/', value: { name: 'Ada Lovelace' } },
        },
      ]}
    />
  ),
};
