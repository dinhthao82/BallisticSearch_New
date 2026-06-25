import { z } from 'zod';

const emailListSchema = z
  .string()
  .trim()
  .transform((s) => s.split(/[,;\s]+/).filter(Boolean))
  .pipe(z.array(z.string().email('Invalid email address')))
  .or(z.array(z.string().email()));

export const composeEmailSchema = z.object({
  to: z
    .string()
    .trim()
    .min(1, 'At least one recipient required')
    .refine(
      (s) => {
        const parts = s.split(/[,;\s]+/).filter(Boolean);
        return parts.length > 0 && parts.every((p) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p));
      },
      { message: 'One or more emails are invalid (comma/space-separated)' }
    ),
  cc: z
    .string()
    .trim()
    .optional()
    .refine(
      (s) => {
        if (!s) return true;
        return s
          .split(/[,;\s]+/)
          .filter(Boolean)
          .every((p) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p));
      },
      { message: 'One or more emails are invalid (comma/space-separated)' }
    ),
  subject: z
    .string()
    .trim()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be 200 characters or fewer'),
  body: z
    .string()
    .trim()
    .min(1, 'Body is required')
    .max(10_000, 'Body must be 10000 characters or fewer'),
});

export type ComposeEmailInput = z.infer<typeof composeEmailSchema>;

export const defaultComposeEmailValues: ComposeEmailInput = {
  to: '',
  cc: '',
  subject: '',
  body: '',
};

// Exposed for tests
export { emailListSchema };
