import { describe, it, expect } from 'vitest';
import { searchEventSchema, defaultSearchEventValues, buildSearchPayload } from '../schema';

describe('searchEventSchema', () => {
  it('accepts default values', () => {
    expect(searchEventSchema.safeParse(defaultSearchEventValues).success).toBe(true);
  });

  it('rejects minScore > 100', () => {
    const result = searchEventSchema.safeParse({ ...defaultSearchEventValues, minScore: 101 });
    expect(result.success).toBe(false);
  });

  it('rejects topN = 0', () => {
    const result = searchEventSchema.safeParse({ ...defaultSearchEventValues, topN: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects unknown searchBy', () => {
    const result = searchEventSchema.safeParse({
      ...defaultSearchEventValues,
      searchBy: 'fuzzy',
    });
    expect(result.success).toBe(false);
  });
});

describe('buildSearchPayload', () => {
  it('splits caseNumbers on comma/semicolon/space', () => {
    const payload = buildSearchPayload({
      ...defaultSearchEventValues,
      caseNumbers: 'W1, W2 ; W3   W4',
    });
    expect(payload.caseNumbers).toEqual(['W1', 'W2', 'W3', 'W4']);
  });

  it('drops empty optional fields', () => {
    const payload = buildSearchPayload({
      ...defaultSearchEventValues,
      dateFrom: '',
      site: '',
    });
    expect(payload.dateFrom).toBeUndefined();
    expect(payload.site).toBeUndefined();
  });

  it('passes page + pageSize through', () => {
    const payload = buildSearchPayload(defaultSearchEventValues, 3, 50);
    expect(payload.page).toBe(3);
    expect(payload.pageSize).toBe(50);
  });
});
