import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { CaseNumberInput } from './schema';

export interface CaseNumberSubmitResponse {
  auditId: string;
  acknowledged: boolean;
}

export function useCaseNumberSubmit() {
  return useMutation({
    mutationKey: ['case-number', 'submit'],
    mutationFn: async (input: CaseNumberInput): Promise<CaseNumberSubmitResponse> => {
      return api
        .post('case-number/submit', {
          json: {
            caseNumber: input.caseNumber,
            purpose: input.purpose,
            requestor: input.requestor.mode === 'other' ? input.requestor.name : '(current user)',
          },
        })
        .json<CaseNumberSubmitResponse>();
    },
  });
}
