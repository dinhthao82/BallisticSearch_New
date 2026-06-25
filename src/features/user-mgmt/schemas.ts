import { z } from 'zod';

export const USER_ROLES = ['Admin', 'Agency', 'Regular', 'Examiner', 'ExaminerManager'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const userFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, 'Username must be at least 2 characters')
    .max(60)
    .regex(/^[A-Za-z0-9_.-]+$/, 'Letters, digits, dot, dash, underscore only'),
  email: z.string().trim().email('Invalid email'),
  firstName: z.string().trim().min(1, 'First name is required').max(60),
  lastName: z.string().trim().min(1, 'Last name is required').max(60),
  role: z.enum(USER_ROLES),
  active: z.boolean(),
});
export type UserFormInput = z.infer<typeof userFormSchema>;

export const defaultUserValues: UserFormInput = {
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  role: 'Regular',
  active: true,
};

export const agencyManagerSchema = userFormSchema.extend({
  agencyId: z.string().trim().min(1, 'Agency is required'),
});
export type AgencyManagerInput = z.infer<typeof agencyManagerSchema>;

export const defaultAgencyManagerValues: AgencyManagerInput = {
  ...defaultUserValues,
  role: 'Agency',
  agencyId: '',
};
