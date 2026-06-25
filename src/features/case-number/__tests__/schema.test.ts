import { describe, it, expect } from 'vitest';
import { caseNumberSchema, defaultCaseNumberValues } from '../schema';

describe('caseNumberSchema', () => {
  it('defaults are valid when caseNumber + purpose filled', () => {
    const result = caseNumberSchema.safeParse({
      ...defaultCaseNumberValues,
      caseNumber: 'CASE-001',
      purpose: 'Routine audit check',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty case number', () => {
    const result = caseNumberSchema.safeParse({
      requestor: { mode: 'current' },
      caseNumber: '',
      purpose: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('rejects case number with special chars', () => {
    const result = caseNumberSchema.safeParse({
      requestor: { mode: 'current' },
      caseNumber: 'CASE_001!',
      purpose: 'Test',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/Letters, digits/);
    }
  });

  it('rejects case number over 50 chars', () => {
    const result = caseNumberSchema.safeParse({
      requestor: { mode: 'current' },
      caseNumber: 'A'.repeat(51),
      purpose: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty purpose', () => {
    const result = caseNumberSchema.safeParse({
      requestor: { mode: 'current' },
      caseNumber: 'CASE-1',
      purpose: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects purpose over 255 chars', () => {
    const result = caseNumberSchema.safeParse({
      requestor: { mode: 'current' },
      caseNumber: 'CASE-1',
      purpose: 'x'.repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it('requires requestor name when mode = other', () => {
    const result = caseNumberSchema.safeParse({
      requestor: { mode: 'other' },
      caseNumber: 'CASE-1',
      purpose: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('accepts requestor name when mode = other and name provided', () => {
    const result = caseNumberSchema.safeParse({
      requestor: { mode: 'other', name: 'Jane Doe' },
      caseNumber: 'CASE-1',
      purpose: 'Test',
    });
    expect(result.success).toBe(true);
  });
});
