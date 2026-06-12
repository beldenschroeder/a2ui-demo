/**
 * Internal helper for Storybook stories. NOT a published package — this is the
 * thin wiring around the third-party @a2ui/react + @a2ui/web_core packages that
 * we don't want to ship as a library.
 */
import { useEffect, useMemo, useState } from 'react';
import { A2uiSurface, type ReactComponentImplementation } from '@a2ui/react/v0_9';
import { MessageProcessor, type SurfaceModel } from '@a2ui/web_core/v0_9';
import { customCatalog } from '@a2ui-demo/catalog';
import * as styles from './A2UIDemoSurface.css';

export type A2uiMessageLike = Record<string, unknown>;

export interface A2UIDemoSurfaceProps {
  messages: A2uiMessageLike[];
  label?: string;
  emptyState?: string;
}

export function A2UIDemoSurface({
  messages,
  label = 'A2UI surface',
  emptyState = 'Waiting for the first A2UI message…',
}: A2UIDemoSurfaceProps) {
  const processor = useMemo(
    () => new MessageProcessor<ReactComponentImplementation>([customCatalog]),
    [],
  );
  const [surface, setSurface] = useState<SurfaceModel<ReactComponentImplementation> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const sub = processor.onSurfaceCreated((s) => setSurface(s));
    return () => sub.unsubscribe?.();
  }, [processor]);

  useEffect(() => {
    setError(null);
    try {
      processor.processMessages(messages as never);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, [processor, messages]);

  if (error) {
    return (
      <div className={styles.errorBox} role="alert">
        Failed to process A2UI messages: {error.message}
      </div>
    );
  }
  return (
    <section className={styles.frame} aria-label={label}>
      {surface ? <A2uiSurface surface={surface} /> : <div className={styles.empty}>{emptyState}</div>}
    </section>
  );
}
