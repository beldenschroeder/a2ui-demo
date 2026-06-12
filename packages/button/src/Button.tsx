import type { ButtonHTMLAttributes } from 'react';
import * as styles from './Button.css';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  variant?: ButtonVariant;
}

export function Button({ label, variant = 'primary', ...rest }: ButtonProps) {
  return (
    <button type="button" className={styles.button[variant]} {...rest}>
      {label}
    </button>
  );
}
