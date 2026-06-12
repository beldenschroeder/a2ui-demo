import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders the label and value', () => {
    render(<TextInput label="Name" value="Ada" onChange={() => {}} />);
    expect(screen.getByLabelText<HTMLInputElement>('Name').value).toBe('Ada');
  });

  it('emits onChange with the new string', () => {
    const onChange = vi.fn();
    render(<TextInput label="Name" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Grace' } });
    expect(onChange).toHaveBeenCalledWith('Grace');
  });
});
