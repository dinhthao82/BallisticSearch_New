import { describe, it, expect } from 'vitest';
import { mockAPLData } from '../mockData';
import { handlers } from '../handlers';

describe('MSW APL mock fixtures', () => {
  it('mockAPLData has 47 deterministic rows', () => {
    expect(mockAPLData).toHaveLength(47);
    expect(mockAPLData[0]?.apl_ID).toBe('1000000');
    expect(mockAPLData[46]?.apl_ID).toBe('1000046');
  });

  it('every row has all required fields', () => {
    for (const row of mockAPLData) {
      expect(row.apl_ID).toMatch(/^\d+$/);
      expect(row.assessor).toBeTruthy();
      expect(row.caseIncident).toMatch(/^W\d+$/);
      expect(row.cartridgeCase).toMatch(/^9MM-\d+$/);
      expect(['PL', 'CSA', 'QA']).toContain(row.type);
      expect(['Pending', 'In Process', 'Closed']).toContain(row.reportStatus);
      expect(row.createdDateTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    }
  });

  it('handlers registers expected routes (apl + location + rapid + audit + case-number)', () => {
    // MSW v2 stores route info on handler.info
    expect(handlers).toHaveLength(10);
    const paths = handlers.map((h) => (h as { info: { method: string; path: string } }).info.path);
    expect(paths.some((p) => p.includes('apl/search'))).toBe(true);
    expect(paths.some((p) => p.includes('location/countries'))).toBe(true);
    expect(paths.some((p) => p.includes('location/states'))).toBe(true);
    expect(paths.some((p) => p.includes('location/cities'))).toBe(true);
    expect(paths.some((p) => p.includes('rapid-ballistics'))).toBe(true);
    expect(paths.some((p) => p.includes('audit/contract-info'))).toBe(true);
    expect(paths.some((p) => p.endsWith('audit/contracts'))).toBe(true);
    expect(paths.some((p) => p.includes('case-number/submit'))).toBe(true);
    expect(paths.some((p) => p.includes('email/send'))).toBe(true);
    expect(paths.some((p) => p.includes('bullet/upload'))).toBe(true);
  });
});
