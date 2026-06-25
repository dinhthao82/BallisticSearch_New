import { z } from 'zod';

export const caseNumberSchema = z.object({
  requestor: z
    .object({
      mode: z.enum(['current', 'other']),
      name: z.string().max(100).optional(),
    })
    .refine((v) => v.mode !== 'other' || (typeof v.name === 'string' && v.name.trim().length > 0), {
      message: 'Requestor name is required when "Change requestor" is selected',
      path: ['name'],
    }),
  caseNumber: z
    .string()
    .trim()
    .min(1, 'Case number is required')
    .max(50, 'Case number must be 50 characters or fewer')
    .regex(/^[A-Za-z0-9-]+$/, 'Letters, digits, and dashes only'),
  purpose: z
    .string()
    .trim()
    .min(1, 'Purpose is required')
    .max(255, 'Purpose must be 255 characters or fewer'),
});

export type CaseNumberInput = z.infer<typeof caseNumberSchema>;

export const defaultCaseNumberValues: CaseNumberInput = {
  requestor: { mode: 'current' },
  caseNumber: '',
  purpose: '',
};
