import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@a2ui-demo/button';
import { A2UIDemoSurface } from '../internal/A2UIDemoSurface';
import { CATALOG_ID } from '../internal/constants';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Direct: Story = {
  name: 'Direct — React component',
  args: { label: 'Save', variant: 'primary' },
};

export const Secondary: Story = {
  name: 'Direct — Secondary variant',
  args: { label: 'Cancel', variant: 'secondary' },
};

export const ViaA2UI: Story = {
  name: 'Via A2UI — Agent JSON',
  render: () => (
    <A2UIDemoSurface
      label="Button via A2UI"
      messages={[
        { version: 'v0.9', createSurface: { surfaceId: 'btn', catalogId: CATALOG_ID } },
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'btn',
            components: [
              { id: 'root', component: 'Button', label: { path: '/label' }, variant: 'primary' },
            ],
          },
        },
        {
          version: 'v0.9',
          updateDataModel: { surfaceId: 'btn', path: '/', value: { label: 'Save (bound)' } },
        },
      ]}
    />
  ),
};
