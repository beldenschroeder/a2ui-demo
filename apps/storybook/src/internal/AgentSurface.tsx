import { useState } from 'react';
import { A2UIDemoSurface } from './A2UIDemoSurface';
import { useAgentStream } from './useAgentStream';
import * as styles from './AgentSurface.css';

export interface AgentSurfaceProps {
  agentUrl?: string;
  initialPrompt?: string;
}

const DEFAULT_AGENT_URL =
  (typeof import.meta !== 'undefined'
    ? (import.meta as { env?: { VITE_A2UI_AGENT_URL?: string } }).env?.VITE_A2UI_AGENT_URL
    : undefined) ?? 'http://localhost:8000';

export function AgentSurface({
  agentUrl = DEFAULT_AGENT_URL,
  initialPrompt = 'Show me a small profile card for Ada Lovelace.',
}: AgentSurfaceProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const { messages, status, error, send, cancel } = useAgentStream(agentUrl);
  const streaming = status === 'streaming';

  return (
    <div className={styles.root}>
      <form
        className={styles.promptRow}
        onSubmit={(e) => {
          e.preventDefault();
          void send(prompt);
        }}
      >
        <input
          className={styles.input}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the agent for a UI…"
          disabled={streaming}
        />
        {streaming ? (
          <button type="button" className={styles.button} onClick={cancel}>Cancel</button>
        ) : (
          <button type="submit" className={styles.button}>Generate</button>
        )}
      </form>

      <div className={styles.status}>
        Status: {status}
        {messages.length > 0 && ` · ${messages.length} message(s) received`}
      </div>
      {error && <div className={styles.errorText}>Error: {error}</div>}

      <A2UIDemoSurface
        messages={messages}
        label="Agent-generated A2UI surface"
        emptyState={
          status === 'idle'
            ? 'Enter a prompt and press Generate to ask the agent for a UI.'
            : 'Waiting for the first message…'
        }
      />
    </div>
  );
}
