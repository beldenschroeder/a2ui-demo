/**
 * SSE client for the Python agent server (server/). Internal to Storybook.
 *
 * Wire format (see server/src/a2ui_agent_server/main.py):
 *   event: a2ui  →  one A2UI message in `data:`
 *   event: done  →  end of stream
 *   event: error →  error message in `data:`
 */
import { useCallback, useRef, useState } from 'react';
import type { A2uiMessageLike } from './A2UIDemoSurface';

export interface AgentStreamState {
  messages: A2uiMessageLike[];
  status: 'idle' | 'streaming' | 'done' | 'error';
  error: string | null;
}

export function useAgentStream(agentUrl: string) {
  const [state, setState] = useState<AgentStreamState>({
    messages: [],
    status: 'idle',
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (prompt: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setState({ messages: [], status: 'streaming', error: null });

      try {
        const res = await fetch(`${agentUrl}/agent/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error(`Agent server returned ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let sep: number;
          while ((sep = buffer.indexOf('\n\n')) !== -1) {
            const raw = buffer.slice(0, sep);
            buffer = buffer.slice(sep + 2);
            const evt = parseSse(raw);
            if (!evt) continue;
            if (evt.event === 'a2ui') {
              const message = JSON.parse(evt.data) as A2uiMessageLike;
              setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
            } else if (evt.event === 'done') {
              setState((prev) => ({ ...prev, status: 'done' }));
            } else if (evt.event === 'error') {
              setState((prev) => ({ ...prev, status: 'error', error: evt.data }));
            }
          }
        }
      } catch (err) {
        if ((err as { name?: string }).name === 'AbortError') return;
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: err instanceof Error ? err.message : String(err),
        }));
      }
    },
    [agentUrl],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setState((prev) => ({ ...prev, status: 'idle' }));
  }, []);

  return { ...state, send, cancel };
}

function parseSse(raw: string): { event: string; data: string } | null {
  let event = 'message';
  const dataLines: string[] = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }
  if (!dataLines.length) return null;
  return { event, data: dataLines.join('\n') };
}
