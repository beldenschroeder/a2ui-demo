import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
});

export const promptRow = style({ display: 'flex', gap: 8 });

export const input = style({
  flex: 1,
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 14,
});

export const button = style({
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#111',
  color: '#fff',
  fontSize: 14,
  cursor: 'pointer',
  selectors: { '&:disabled': { background: '#888', cursor: 'not-allowed' } },
});

export const status = style({ fontSize: 12, color: '#666' });
export const errorText = style({ fontSize: 12, color: '#a11' });
