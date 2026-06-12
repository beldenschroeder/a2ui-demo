import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders the text', () => {
    render(<Text text="Hello" />);
    expect(screen.getByText('Hello')).toBeDefined();
  });

  it('accepts a weight variant', () => {
    render(<Text text="Bold one" weight="bold" />);
    expect(screen.getByText('Bold one')).toBeDefined();
  });
});
