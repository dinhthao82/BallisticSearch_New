import { Container, Stack, Title, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { SharingAgencyItem } from './types';

interface SharingAgenciesResponse {
  items: SharingAgencyItem[];
}

export default function ManageSharingAgenciesPage() {
  const query = useQuery({
    queryKey: ['sharing-agencies'],
    queryFn: ({ signal }) =>
      api.get('sharing/agencies', { signal }).json<SharingAgenciesResponse>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Manage Sharing Agencies
        </Title>
        {query.isLoading && <Text>Loading agencies…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load sharing agencies"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && (
          <>
            <Text size="sm" c="dimmed">
              {query.data.items.length} agency{query.data.items.length === 1 ? '' : 's'} configured
            </Text>
            <Table withTableBorder striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Agency ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Sharing</Table.Th>
                  <Table.Th>Last sync</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {query.data.items.map((row) => (
                  <Table.Tr key={row.agencyId} data-testid="sharing-agency-row">
                    <Table.Td>{row.agencyId}</Table.Td>
                    <Table.Td>{row.name}</Table.Td>
                    <Table.Td>
                      <BIQBadge color={row.sharingEnabled ? 'green' : 'gray'}>
                        {row.sharingEnabled ? 'On' : 'Off'}
                      </BIQBadge>
                    </Table.Td>
                    <Table.Td>{new Date(row.lastSyncAt).toLocaleString()}</Table.Td>
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
