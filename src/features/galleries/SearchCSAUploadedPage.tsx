import { Container, Stack, Title, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { CSAUploadedItem } from './types';

function statusColor(s: CSAUploadedItem['status']): string {
  if (s === 'Processed') return 'green';
  if (s === 'Failed') return 'red';
  return 'yellow';
}

export default function SearchCSAUploadedPage() {
  const query = useQuery({
    queryKey: ['csa-uploaded'],
    queryFn: ({ signal }) =>
      api.get('csa-uploaded', { signal }).json<{ items: CSAUploadedItem[]; total: number }>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Search CSA Uploaded
        </Title>
        {query.isLoading && <Text>Loading uploads…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load CSA uploads"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && query.data.items.length > 0 && (
          <>
            <Text size="sm" c="dimmed">
              {query.data.total} upload{query.data.total === 1 ? '' : 's'}
            </Text>
            <Table withTableBorder striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Case #</Table.Th>
                  <Table.Th>Uploaded by</Table.Th>
                  <Table.Th>When</Table.Th>
                  <Table.Th>Items</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {query.data.items.map((row) => (
                  <Table.Tr key={row.id} data-testid="csa-upload-row">
                    <Table.Td>{row.id}</Table.Td>
                    <Table.Td>{row.caseNumber}</Table.Td>
                    <Table.Td>{row.uploadedBy}</Table.Td>
                    <Table.Td>{new Date(row.uploadedAt).toLocaleString()}</Table.Td>
                    <Table.Td>{row.itemCount}</Table.Td>
                    <Table.Td>
                      <BIQBadge color={statusColor(row.status)}>{row.status}</BIQBadge>
                    </Table.Td>
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
