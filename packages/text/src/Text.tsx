import * as styles from './Text.css';

export type TextWeight = 'normal' | 'bold' | 'subtle';

export interface TextProps {
  text: string;
  weight?: TextWeight;
}

export function Text({ text, weight = 'normal' }: TextProps) {
  return <p className={styles.text[weight]}>{text}</p>;
}
