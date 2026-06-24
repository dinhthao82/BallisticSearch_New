import { describe, it, expect } from 'vitest';
import { tokens } from '../tokens';

describe('tokens (BS-6159 parity)', () => {
  it('primary color matches BS-6159 #435d7d', () => {
    expect(tokens.color.primary).toBe('#435d7d');
  });

  it('primaryDark matches navy #304e72', () => {
    expect(tokens.color.primaryDark).toBe('#304e72');
  });

  it('font size base is 0.875rem', () => {
    expect(tokens.font.sizeBase).toBe('0.875rem');
  });

  it('exposes layout dimensions', () => {
    expect(tokens.layout.filterWidth).toBe('20%');
    expect(tokens.layout.filterMinWidth).toBe('18rem');
  });

  it('tokens are immutable at type level (readonly)', () => {
    // @ts-expect-error tokens.color is readonly
    tokens.color.primary = '#ff0000';
  });
});
