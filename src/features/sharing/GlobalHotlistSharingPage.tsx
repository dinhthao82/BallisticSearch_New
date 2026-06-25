import { Container, Stack, Title, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { HotlistEntry } from './types';

export default function GlobalHotlistSharingPage() {
  const query = useQuery({
    queryKey: ['hotlists'],
    queryFn: ({ signal }) =>
      api.get('sharing/hotlists', { signal }).json<{ items: HotlistEntry[] }>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Global Hotlist Sharing
        </Title>
        {query.isLoading && <Text>Loading hotlists…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load hotlists"
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
                <Table.Th>Items</Table.Th>
                <Table.Th>Active</Table.Th>
                <Table.Th>Updated</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {query.data.items.map((row) => (
                <Table.Tr key={row.id} data-testid="hotlist-row">
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>{row.name}</Table.Td>
                  <Table.Td>{row.agencyId}</Table.Td>
                  <Table.Td>{row.itemCount}</Table.Td>
                  <Table.Td>
                    <BIQBadge color={row.active ? 'green' : 'gray'}>
                      {row.active ? 'Active' : 'Inactive'}
                    </BIQBadge>
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
