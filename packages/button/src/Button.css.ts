import { style, styleVariants } from '@vanilla-extract/css';

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  transition: 'background-color 120ms ease',
  selectors: {
    '&:disabled': { cursor: 'not-allowed', opacity: 0.5 },
  },
});

export const button = styleVariants({
  primary: [
    base,
    {
      background: '#111',
      color: '#fff',
      selectors: { '&:hover:not(:disabled)': { background: '#333' } },
    },
  ],
  secondary: [
    base,
    {
      background: '#eef0f3',
      color: '#111',
      selectors: { '&:hover:not(:disabled)': { background: '#dde1e6' } },
    },
  ],
});
