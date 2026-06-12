import type { Meta, StoryObj } from '@storybook/react';
import { AgentSurface } from '../internal/AgentSurface';

const meta: Meta<typeof AgentSurface> = {
  title: 'Agent/Live Agent',
  component: AgentSurface,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Requires the Python agent server (`npm run agent:dev`). The agent is told about the custom catalog only — it can only request Card, Text, Button, and TextInput.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AgentSurface>;

export const Profile: Story = {
  args: { initialPrompt: 'Show me a small profile card for Ada Lovelace.' },
};

export const Signup: Story = {
  args: {
    initialPrompt:
      'Build a signup form with a name field, an email field, and a Sign up button.',
  },
};

export const Confirmation: Story = {
  args: {
    initialPrompt: 'Show a confirmation card with a message and two buttons: Confirm and Cancel.',
  },
};
