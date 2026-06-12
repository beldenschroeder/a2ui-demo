import { style, styleVariants } from '@vanilla-extract/css';

const base = style({
  margin: 0,
  fontSize: 14,
  lineHeight: 1.5,
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
});

export const text = styleVariants({
  normal: [base, { color: '#111', fontWeight: 400 }],
  bold: [base, { color: '#111', fontWeight: 700 }],
  subtle: [base, { color: '#666', fontWeight: 400 }],
});
