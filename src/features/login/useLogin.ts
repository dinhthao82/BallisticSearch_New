import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { LoginInput } from './schema';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'Admin' | 'Agency' | 'Regular' | 'Examiner' | 'ExaminerManager';
    displayName?: string;
  };
}

export function useLogin() {
  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (input: LoginInput): Promise<LoginResponse> => {
      return api
        .post('auth/login', {
          json: {
            username: input.username,
            password: input.password,
            rememberMe: input.rememberMe,
          },
        })
        .json<LoginResponse>();
    },
  });
}
