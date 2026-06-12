import { style } from '@vanilla-extract/css';

export const frame = style({
  display: 'block',
  padding: 16,
  borderRadius: 12,
  border: '1px dashed rgba(0, 0, 0, 0.15)',
  background: '#fff',
  minWidth: 320,
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
});

export const empty = style({ padding: '12px 0', color: '#777', fontStyle: 'italic' });

export const errorBox = style({
  padding: '12px 16px',
  borderRadius: 8,
  background: '#fff5f5',
  color: '#a11',
  border: '1px solid #f5c6c6',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
});
