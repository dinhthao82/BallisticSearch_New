import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username is required')
    .max(60, 'Username must be 60 characters or fewer'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(200, 'Password must be 200 characters or fewer'),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const defaultLoginValues: LoginInput = {
  username: '',
  password: '',
  rememberMe: false,
};
