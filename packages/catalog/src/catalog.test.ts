import { describe, expect, it } from 'vitest';
import { customCatalog } from './catalog';
import { CATALOG_ID, manifest } from './constants';
import { agentInstructions } from './instructions';

describe('customCatalog', () => {
  it('exposes all four registered components', () => {
    expect(Object.keys(customCatalog.components).sort()).toEqual(
      ['Button', 'Card', 'Text', 'TextInput'],
    );
  });

  it('uses the manifest catalog id', () => {
    expect(customCatalog.id).toBe(CATALOG_ID);
    expect(CATALOG_ID).toBe(manifest.catalogId);
  });
});

describe('agentInstructions', () => {
  it('includes every component from the manifest', () => {
    const out = agentInstructions();
    for (const name of Object.keys(manifest.components)) {
      expect(out).toContain(`**${name}**`);
    }
  });
});
