import { describe, it, expect } from 'vitest';
import { searchAPLFilterSchema, toApiFilter } from '../schema';

describe('searchAPLFilterSchema', () => {
  it('accepts empty object', () => {
    const parsed = searchAPLFilterSchema.safeParse({});
    expect(parsed.success).toBe(true);
  });

  it('accepts all fields populated', () => {
    const parsed = searchAPLFilterSchema.safeParse({
      apl_ID: '1000001',
      caseNumber: 'W101001',
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
      reportStatus: ['pending', 'closed'],
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid reportStatus value', () => {
    const parsed = searchAPLFilterSchema.safeParse({
      reportStatus: ['unknown'],
    });
    expect(parsed.success).toBe(false);
  });
});

describe('toApiFilter', () => {
  it('strips empty values', () => {
    expect(toApiFilter({})).toEqual({});
    expect(toApiFilter({ apl_ID: '', caseNumber: '' })).toEqual({});
  });

  it('takes the first non-empty APL_ID from multi-line', () => {
    expect(
      toApiFilter({ apl_ID: '\n1000005\n1000006' })
    ).toEqual({ apl_ID: '1000005' });
  });

  it('takes the first non-empty caseNumber from comma-separated', () => {
    expect(toApiFilter({ caseNumber: 'W101000, W101001' })).toEqual({
      caseNumber: 'W101000',
    });
  });

  it('passes dates through', () => {
    expect(
      toApiFilter({ dateFrom: '2026-01-01', dateTo: '2026-06-30' })
    ).toEqual({ dateFrom: '2026-01-01', dateTo: '2026-06-30' });
  });

  it('passes reportStatus only when non-empty', () => {
    expect(toApiFilter({ reportStatus: [] })).toEqual({});
    expect(toApiFilter({ reportStatus: ['pending'] })).toEqual({
      reportStatus: ['pending'],
    });
  });
});
