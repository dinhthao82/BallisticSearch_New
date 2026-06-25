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

  it('handlers registers POST /apl/search + GET location/* + GET audit + POST case-number routes', () => {
    // MSW v2 stores route info on handler.info
    expect(handlers).toHaveLength(6);
    const infos = handlers.map((h) => (h as { info: { method: string; path: string } }).info);
    expect(infos[0]?.method).toBe('POST');
    expect(infos[0]?.path).toContain('apl/search');
    expect(infos[1]?.path).toContain('location/countries');
    expect(infos[2]?.path).toContain('location/states');
    expect(infos[3]?.path).toContain('location/cities');
    expect(infos[4]?.method).toBe('GET');
    expect(infos[4]?.path).toContain('audit/contract-info');
    expect(infos[5]?.method).toBe('POST');
    expect(infos[5]?.path).toContain('case-number/submit');
  });
});
