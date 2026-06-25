import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { RapidBallisticsInput } from './schema';

export interface SubmitRapidResponse {
  submissionId: string;
  photoCount: number;
  acknowledged: boolean;
}

export function useSubmitRapid() {
  return useMutation({
    mutationKey: ['rapid-ballistics', 'submit'],
    mutationFn: async (input: RapidBallisticsInput): Promise<SubmitRapidResponse> => {
      const fd = new FormData();
      fd.append('caseNumber', input.caseNumber);
      if (input.location) fd.append('location', input.location);
      fd.append('weaponType', input.weaponType);
      fd.append('priority', input.priority);
      fd.append('comment', input.comment);
      for (const file of input.photos) fd.append('photos', file, file.name);
      return api.post('rapid-ballistics', { body: fd }).json<SubmitRapidResponse>();
    },
  });
}
