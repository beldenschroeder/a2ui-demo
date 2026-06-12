import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
});

export const label = style({
  fontSize: 12,
  fontWeight: 500,
  color: '#444',
});

export const input = style({
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #cbd0d8',
  fontSize: 14,
  background: '#fff',
  color: '#111',
  outline: 'none',
  selectors: {
    '&:focus': { borderColor: '#111', boxShadow: '0 0 0 3px rgba(17, 17, 17, 0.1)' },
    '&:disabled': { background: '#f3f4f6', color: '#888' },
  },
});
