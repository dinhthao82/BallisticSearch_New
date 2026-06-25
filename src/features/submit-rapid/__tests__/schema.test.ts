import { describe, it, expect } from 'vitest';
import {
  rapidBallisticsSchema,
  defaultRapidBallisticsValues,
  MAX_PHOTO_SIZE_BYTES,
  MAX_PHOTO_COUNT,
} from '../schema';

function makeFile(name: string, size: number, type: string) {
  const file = new File(['x'], name, { type });
  // Patch the size getter on the File instance so the schema sees `file.size`
  // = the asserted size without actually allocating MB-large data
  Object.defineProperty(file, 'size', { value: size, configurable: true });
  return file;
}

describe('rapidBallisticsSchema', () => {
  it('valid minimum payload', () => {
    const result = rapidBallisticsSchema.safeParse({
      ...defaultRapidBallisticsValues,
      caseNumber: 'CASE-001',
      comment: 'Routine ballistics submission',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty case number', () => {
    const result = rapidBallisticsSchema.safeParse({
      ...defaultRapidBallisticsValues,
      caseNumber: '',
      comment: 'Test',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty comment', () => {
    const result = rapidBallisticsSchema.safeParse({
      ...defaultRapidBallisticsValues,
      caseNumber: 'CASE-1',
      comment: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects comment over 4000 chars', () => {
    const result = rapidBallisticsSchema.safeParse({
      ...defaultRapidBallisticsValues,
      caseNumber: 'CASE-1',
      comment: 'x'.repeat(4001),
    });
    expect(result.success).toBe(false);
  });

  it('rejects when more than MAX_PHOTO_COUNT photos', () => {
    const photos = Array.from({ length: MAX_PHOTO_COUNT + 1 }, (_, i) =>
      makeFile(`p${i}.jpg`, 1000, 'image/jpeg')
    );
    const result = rapidBallisticsSchema.safeParse({
      ...defaultRapidBallisticsValues,
      caseNumber: 'CASE-1',
      comment: 'Test',
      photos,
    });
    expect(result.success).toBe(false);
  });

  it('rejects when any photo exceeds MAX_PHOTO_SIZE_BYTES', () => {
    const photos = [makeFile('big.jpg', MAX_PHOTO_SIZE_BYTES + 1, 'image/jpeg')];
    const result = rapidBallisticsSchema.safeParse({
      ...defaultRapidBallisticsValues,
      caseNumber: 'CASE-1',
      comment: 'Test',
      photos,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => /exceeds 5 MB/.test(i.message))).toBe(true);
    }
  });

  it('rejects photo with unsupported MIME type', () => {
    const photos = [makeFile('doc.pdf', 1000, 'application/pdf')];
    const result = rapidBallisticsSchema.safeParse({
      ...defaultRapidBallisticsValues,
      caseNumber: 'CASE-1',
      comment: 'Test',
      photos,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => /unsupported type/.test(i.message))).toBe(true);
    }
  });

  it('accepts valid jpeg + png photos', () => {
    const photos = [
      makeFile('a.jpg', 1024 * 1024, 'image/jpeg'),
      makeFile('b.png', 2 * 1024 * 1024, 'image/png'),
    ];
    const result = rapidBallisticsSchema.safeParse({
      ...defaultRapidBallisticsValues,
      caseNumber: 'CASE-1',
      comment: 'Test',
      photos,
    });
    expect(result.success).toBe(true);
  });
});
