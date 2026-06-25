import { z } from 'zod';

export const WEAPON_TYPES = ['Handgun', 'Rifle', 'Shotgun', 'Other'] as const;
export type WeaponType = (typeof WEAPON_TYPES)[number];

export const PRIORITIES = ['routine', 'urgent'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const MAX_PHOTO_COUNT = 5;
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_PHOTO_MIME = ['image/jpeg', 'image/png'];

export const rapidBallisticsSchema = z
  .object({
    caseNumber: z
      .string()
      .trim()
      .min(1, 'Case number is required')
      .max(50, 'Case number must be 50 characters or fewer')
      .regex(/^[A-Za-z0-9-]+$/, 'Letters, digits, and dashes only'),
    location: z.string().trim().max(200).optional(),
    weaponType: z.enum(WEAPON_TYPES),
    priority: z.enum(PRIORITIES),
    comment: z
      .string()
      .trim()
      .min(1, 'Comment is required')
      .max(4000, 'Comment must be 4000 characters or fewer'),
    photos: z.array(z.instanceof(File)).max(MAX_PHOTO_COUNT, `Maximum ${MAX_PHOTO_COUNT} photos`),
  })
  .superRefine((val, ctx) => {
    val.photos.forEach((file, index) => {
      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['photos', index],
          message: `${file.name}: file exceeds 5 MB`,
        });
      }
      if (!ACCEPTED_PHOTO_MIME.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['photos', index],
          message: `${file.name}: unsupported type (JPEG / PNG only)`,
        });
      }
    });
  });

export type RapidBallisticsInput = z.infer<typeof rapidBallisticsSchema>;

export const defaultRapidBallisticsValues: RapidBallisticsInput = {
  caseNumber: '',
  location: '',
  weaponType: 'Handgun',
  priority: 'routine',
  comment: '',
  photos: [],
};
