import { z } from 'zod';

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(10, 'New password must be at least 10 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/\d/, 'Must include a digit')
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Must include a special character'),
    confirmPassword: z.string().min(1, 'Please confirm'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

export const defaultPasswordValues: PasswordChangeInput = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const mfaSetupSchema = z.object({
  otpCode: z.string().regex(/^\d{6}$/, 'Enter 6-digit code'),
});
export type MFASetupInput = z.infer<typeof mfaSetupSchema>;
