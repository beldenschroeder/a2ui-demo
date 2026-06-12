import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined();
  });

  it('fires onClick', () => {
    const onClick = vi.fn();
    render(<Button label="Go" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('honors the disabled prop', () => {
    render(<Button label="Off" disabled />);
    expect(screen.getByRole<HTMLButtonElement>('button').disabled).toBe(true);
  });
});
