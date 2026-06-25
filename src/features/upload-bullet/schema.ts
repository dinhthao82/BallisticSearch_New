import { z } from 'zod';

export const CALIBERS = ['9mm', '.40 S&W', '.45 ACP', '.380 ACP', '5.56 NATO', 'Other'] as const;
export type Caliber = (typeof CALIBERS)[number];

export const MAX_PHOTO_COUNT = 8;
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_PHOTO_MIME = ['image/jpeg', 'image/png', 'image/tiff'];

export const uploadBulletSchema = z
  .object({
    caseNumber: z
      .string()
      .trim()
      .min(1, 'Case number is required')
      .max(50)
      .regex(/^[A-Za-z0-9-]+$/, 'Letters, digits, and dashes only'),
    bulletId: z
      .string()
      .trim()
      .min(1, 'Bullet ID is required')
      .max(80)
      .regex(/^[A-Za-z0-9-]+$/, 'Letters, digits, and dashes only'),
    caliber: z.enum(CALIBERS),
    massGrains: z
      .number({ invalid_type_error: 'Mass must be a number (grains)' })
      .positive('Mass must be > 0')
      .max(2000, 'Mass must be ≤ 2000 grains'),
    notes: z.string().trim().max(2000).optional(),
    photos: z
      .array(z.instanceof(File))
      .min(1, 'At least one photo is required')
      .max(MAX_PHOTO_COUNT, `Maximum ${MAX_PHOTO_COUNT} photos`),
  })
  .superRefine((val, ctx) => {
    val.photos.forEach((file, index) => {
      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['photos', index],
          message: `${file.name}: file exceeds 10 MB`,
        });
      }
      if (!ACCEPTED_PHOTO_MIME.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['photos', index],
          message: `${file.name}: unsupported type (JPEG / PNG / TIFF only)`,
        });
      }
    });
  });

export type UploadBulletInput = z.infer<typeof uploadBulletSchema>;

export const defaultUploadBulletValues: UploadBulletInput = {
  caseNumber: '',
  bulletId: '',
  caliber: '9mm',
  massGrains: 0,
  notes: '',
  photos: [],
};
