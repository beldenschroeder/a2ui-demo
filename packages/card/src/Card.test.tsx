import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders title and children', () => {
    render(
      <Card title="Settings">
        <span>inner</span>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeDefined();
    expect(screen.getByText('inner')).toBeDefined();
  });

  it('omits the heading when no title is given', () => {
    render(<Card><span>x</span></Card>);
    expect(screen.queryByRole('heading')).toBeNull();
  });
});
