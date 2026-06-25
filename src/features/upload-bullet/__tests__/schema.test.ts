import { describe, it, expect } from 'vitest';
import {
  uploadBulletSchema,
  defaultUploadBulletValues,
  MAX_PHOTO_COUNT,
  MAX_PHOTO_SIZE_BYTES,
} from '../schema';

function file(name: string, size: number, type: string): File {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: size, configurable: true });
  return f;
}

const validBase = {
  ...defaultUploadBulletValues,
  caseNumber: 'CASE-1',
  bulletId: 'BUL-1',
  massGrains: 124,
  photos: [file('a.jpg', 1024, 'image/jpeg')],
};

describe('uploadBulletSchema', () => {
  it('valid minimum payload', () => {
    expect(uploadBulletSchema.safeParse(validBase).success).toBe(true);
  });

  it('rejects empty caseNumber', () => {
    expect(uploadBulletSchema.safeParse({ ...validBase, caseNumber: '' }).success).toBe(false);
  });

  it('rejects empty bulletId', () => {
    expect(uploadBulletSchema.safeParse({ ...validBase, bulletId: '' }).success).toBe(false);
  });

  it('rejects mass = 0', () => {
    expect(uploadBulletSchema.safeParse({ ...validBase, massGrains: 0 }).success).toBe(false);
  });

  it('rejects mass > 2000', () => {
    expect(uploadBulletSchema.safeParse({ ...validBase, massGrains: 2001 }).success).toBe(false);
  });

  it('requires at least one photo', () => {
    expect(uploadBulletSchema.safeParse({ ...validBase, photos: [] }).success).toBe(false);
  });

  it('rejects more than MAX_PHOTO_COUNT photos', () => {
    const photos = Array.from({ length: MAX_PHOTO_COUNT + 1 }, (_, i) =>
      file(`p${i}.jpg`, 1024, 'image/jpeg')
    );
    expect(uploadBulletSchema.safeParse({ ...validBase, photos }).success).toBe(false);
  });

  it('rejects photo over 10 MB', () => {
    const photos = [file('big.jpg', MAX_PHOTO_SIZE_BYTES + 1, 'image/jpeg')];
    expect(uploadBulletSchema.safeParse({ ...validBase, photos }).success).toBe(false);
  });

  it('rejects unsupported MIME (gif)', () => {
    const photos = [file('a.gif', 1024, 'image/gif')];
    expect(uploadBulletSchema.safeParse({ ...validBase, photos }).success).toBe(false);
  });

  it('accepts TIFF photos', () => {
    const photos = [file('a.tif', 1024, 'image/tiff')];
    expect(uploadBulletSchema.safeParse({ ...validBase, photos }).success).toBe(true);
  });
});
