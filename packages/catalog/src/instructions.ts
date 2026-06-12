import manifest from './catalog.manifest.json';

/**
 * Render the catalog manifest as a markdown bullet list, suitable to drop
 * straight into an LLM system prompt. The Python agent server consumes the
 * same JSON file and produces an equivalent string.
 */
export function agentInstructions(): string {
  const lines: string[] = [];
  lines.push(`Catalog id: ${manifest.catalogId}`);
  lines.push('');
  lines.push('Available components:');
  for (const [name, info] of Object.entries(manifest.components)) {
    lines.push(`- **${name}** — ${info.description}`);
    for (const [prop, desc] of Object.entries(info.props)) {
      lines.push(`    - \`${prop}\`: ${desc}`);
    }
  }
  return lines.join('\n');
}
