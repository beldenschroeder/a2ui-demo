import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
  borderRadius: 12,
  background: '#fff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  color: '#111',
  minWidth: 280,
});

export const title = style({
  fontSize: 16,
  fontWeight: 600,
  margin: 0,
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});
