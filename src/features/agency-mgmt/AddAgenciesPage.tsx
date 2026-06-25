import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import { AgencyForm } from './AgencyForm';
import type { AgencyInput } from './schemas';

export default function AddAgenciesPage() {
  const mutation = useMutation({
    mutationFn: async (values: AgencyInput): Promise<{ id: string }> =>
      api.post('agencies', { json: values }).json<{ id: string }>(),
  });

  return (
    <AgencyForm
      title="Add Agency"
      submitLabel="Create agency"
      ariaLabel="Add agency form"
      onSubmit={(v) => mutation.mutateAsync(v)}
    />
  );
}
