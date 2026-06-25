import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Container, Text } from '@mantine/core';
import { api } from '@/api/client';
import { EmptyState, ErrorState } from '@/components/feedback';
import { UserForm } from './UserForm';
import type { UserFormInput } from './schemas';
import type { UserRecord } from './types';

export default function EditUsersPage() {
  const [params] = useSearchParams();
  const userId = params.get('userId') ?? '';
  const query = useQuery({
    queryKey: ['users', userId],
    queryFn: ({ signal }) => api.get(`users/${userId}`, { signal }).json<UserRecord>(),
    enabled: Boolean(userId),
  });
  const mutation = useMutation({
    mutationFn: async (values: UserFormInput): Promise<{ id: string }> =>
      api.put(`users/${userId}`, { json: values }).json<{ id: string }>(),
  });

  if (!userId) {
    return (
      <Container size="sm" py="xl">
        <EmptyState message="No user selected" hint="Provide ?userId=X in the URL." />
      </Container>
    );
  }

  if (query.isLoading) {
    return (
      <Container size="sm" py="xl">
        <Text>Loading user…</Text>
      </Container>
    );
  }
  if (query.isError || !query.data) {
    return (
      <Container size="sm" py="xl">
        <ErrorState
          message="Failed to load user"
          detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
          onRetry={() => void query.refetch()}
        />
      </Container>
    );
  }

  const initial: UserFormInput = {
    username: query.data.username,
    email: query.data.email,
    firstName: query.data.firstName,
    lastName: query.data.lastName,
    role: query.data.role,
    active: query.data.active,
  };

  return (
    <UserForm
      title={`Edit User: ${query.data.username}`}
      submitLabel="Save changes"
      ariaLabel="Edit user form"
      initialValues={initial}
      onSubmit={(v) => mutation.mutateAsync(v)}
    />
  );
}
