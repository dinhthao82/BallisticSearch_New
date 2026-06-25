import { Container, Stack, Title, Table, Text, Group } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { SharingProfile } from './types';

export default function SharingProfilesPage() {
  const query = useQuery({
    queryKey: ['sharing-profiles'],
    queryFn: ({ signal }) =>
      api.get('sharing/profiles', { signal }).json<{ items: SharingProfile[] }>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Sharing Profiles
        </Title>
        {query.isLoading && <Text>Loading profiles…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load profiles"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && query.data.items.length > 0 && (
          <Table withTableBorder striped highlightOnHover stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Agency</Table.Th>
                <Table.Th>Permissions</Table.Th>
                <Table.Th>Updated</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {query.data.items.map((row) => (
                <Table.Tr key={row.id} data-testid="profile-row">
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>{row.name}</Table.Td>
                  <Table.Td>{row.agencyId}</Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {row.permissions.map((p) => (
                        <BIQBadge key={p} color={p === 'write' ? 'blue' : 'gray'}>
                          {p}
                        </BIQBadge>
                      ))}
                    </Group>
                  </Table.Td>
                  <Table.Td>{new Date(row.updatedAt).toLocaleString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </Container>
  );
}
