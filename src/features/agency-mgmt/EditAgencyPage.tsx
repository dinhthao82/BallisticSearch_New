import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Container, Text } from '@mantine/core';
import { api } from '@/api/client';
import { EmptyState, ErrorState } from '@/components/feedback';
import { AgencyForm } from './AgencyForm';
import type { AgencyInput } from './schemas';
import type { AgencyRecord } from './types';

export default function EditAgencyPage() {
  const [params] = useSearchParams();
  const id = params.get('agencyId') ?? '';
  const query = useQuery({
    queryKey: ['agencies', id],
    queryFn: ({ signal }) => api.get(`agencies/${id}`, { signal }).json<AgencyRecord>(),
    enabled: Boolean(id),
  });
  const mutation = useMutation({
    mutationFn: async (values: AgencyInput): Promise<{ id: string }> =>
      api.put(`agencies/${id}`, { json: values }).json<{ id: string }>(),
  });

  if (!id) {
    return (
      <Container size="sm" py="xl">
        <EmptyState message="No agency selected" hint="Provide ?agencyId=X in the URL." />
      </Container>
    );
  }
  if (query.isLoading)
    return (
      <Container size="sm" py="xl">
        <Text>Loading agency…</Text>
      </Container>
    );
  if (query.isError || !query.data)
    return (
      <Container size="sm" py="xl">
        <ErrorState
          message="Failed to load agency"
          detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
          onRetry={() => void query.refetch()}
        />
      </Container>
    );

  const initial: AgencyInput = {
    agencyId: query.data.agencyId,
    name: query.data.name,
    contactEmail: query.data.contactEmail,
    contactPhone: query.data.contactPhone ?? '',
    region: query.data.region ?? '',
    active: query.data.active,
  };

  return (
    <AgencyForm
      title={`Edit Agency: ${query.data.name}`}
      submitLabel="Save changes"
      ariaLabel="Edit agency form"
      initialValues={initial}
      onSubmit={(v) => mutation.mutateAsync(v)}
    />
  );
}
