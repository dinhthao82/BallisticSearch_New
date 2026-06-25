import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ComposeEmailInput } from './schema';

export interface SendEmailResponse {
  messageId: string;
  recipients: number;
  acknowledged: boolean;
}

function splitList(s: string | undefined): string[] {
  if (!s) return [];
  return s
    .split(/[,;\s]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function useSendEmail() {
  return useMutation({
    mutationKey: ['email', 'send'],
    mutationFn: async (input: ComposeEmailInput): Promise<SendEmailResponse> => {
      const body = {
        to: splitList(input.to),
        cc: splitList(input.cc),
        subject: input.subject,
        body: input.body,
      };
      return api.post('email/send', { json: body }).json<SendEmailResponse>();
    },
  });
}
