import { Container, Stack, Title, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { ShareEntry } from './types';

function statusColor(s: ShareEntry['status']): string {
  if (s === 'Active') return 'green';
  if (s === 'Pending') return 'yellow';
  return 'gray';
}

interface ShareListPageProps {
  title: string;
  endpoint: string;
  emptyMessage?: string;
}

export function ShareListPage({
  title,
  endpoint,
  emptyMessage = 'No sharing entries.',
}: ShareListPageProps) {
  const query = useQuery({
    queryKey: ['sharing-list', endpoint],
    queryFn: ({ signal }) => api.get(endpoint, { signal }).json<{ items: ShareEntry[] }>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          {title}
        </Title>
        {query.isLoading && <Text>Loading…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load sharing entries"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && query.data.items.length === 0 && <Text c="dimmed">{emptyMessage}</Text>}
        {query.data && query.data.items.length > 0 && (
          <>
            <Text size="sm" c="dimmed">
              {query.data.items.length} entr{query.data.items.length === 1 ? 'y' : 'ies'}
            </Text>
            <Table withTableBorder striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Agency</Table.Th>
                  <Table.Th>Scope</Table.Th>
                  <Table.Th>Direction</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Updated</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {query.data.items.map((row) => (
                  <Table.Tr key={row.id} data-testid="share-row">
                    <Table.Td>{row.id}</Table.Td>
                    <Table.Td>
                      {row.agencyName} ({row.agencyId})
                    </Table.Td>
                    <Table.Td>{row.scope}</Table.Td>
                    <Table.Td>{row.direction === 'in' ? 'Inbound' : 'Outbound'}</Table.Td>
                    <Table.Td>
                      <BIQBadge color={statusColor(row.status)}>{row.status}</BIQBadge>
                    </Table.Td>
                    <Table.Td>{new Date(row.updatedAt).toLocaleString()}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </>
        )}
      </Stack>
    </Container>
  );
}
