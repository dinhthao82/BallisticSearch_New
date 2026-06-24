import { describe, it, expect } from 'vitest';
import enCommon from '../../../public/locales/en/common.json';
import enSearchAPL from '../../../public/locales/en/searchAPL.json';

describe('Locale JSON sanity', () => {
  it('common.json has required namespaces', () => {
    expect(enCommon.button.search).toBe('Search');
    expect(enCommon.button.reset).toBe('Reset');
    expect(enCommon.state.loading).toBe('Loading...');
    expect(enCommon.state.empty).toBe('No results found');
  });

  it('searchAPL.json has expected keys', () => {
    expect(enSearchAPL.title).toBe('APL Reports');
    expect(enSearchAPL.filter.apl_ID).toBe('APL ID');
    expect(enSearchAPL.column.assessor).toBe('Assessor');
    expect(enSearchAPL.status.pending).toBe('Pending');
  });

  it('common.json interpolation placeholders present', () => {
    expect(enCommon.common.showing).toContain('{{from}}');
    expect(enCommon.common.showing).toContain('{{to}}');
    expect(enCommon.common.showing).toContain('{{total}}');
  });
});
