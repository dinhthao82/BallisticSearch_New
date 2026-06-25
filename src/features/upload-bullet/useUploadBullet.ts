import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { UploadBulletInput } from './schema';

export interface UploadBulletResponse {
  bulletRecordId: string;
  photoCount: number;
  acknowledged: boolean;
}

export function useUploadBullet() {
  return useMutation({
    mutationKey: ['bullet', 'upload'],
    mutationFn: async (input: UploadBulletInput): Promise<UploadBulletResponse> => {
      const fd = new FormData();
      fd.append('caseNumber', input.caseNumber);
      fd.append('bulletId', input.bulletId);
      fd.append('caliber', input.caliber);
      fd.append('massGrains', String(input.massGrains));
      if (input.notes) fd.append('notes', input.notes);
      for (const f of input.photos) fd.append('photos', f, f.name);
      return api.post('bullet/upload', { body: fd }).json<UploadBulletResponse>();
    },
  });
}
