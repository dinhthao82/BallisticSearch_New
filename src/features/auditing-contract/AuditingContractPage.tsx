import { useState } from 'react';
import { Container, Stack, Title, Table, Text, Group, SegmentedControl } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { ContractSummary, ContractsResponse } from './types';

type StatusFilter = 'all' | 'Pending' | 'In Process' | 'Closed';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Process', label: 'In Process' },
  { value: 'Closed', label: 'Closed' },
];

export default function AuditingContractPage() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const query = useQuery({
    queryKey: ['audit', 'contracts', filter],
    queryFn: ({ signal }): Promise<ContractsResponse> =>
      api
        .get('audit/contracts', {
          searchParams: filter === 'all' ? {} : { status: filter },
          signal,
        })
        .json<ContractsResponse>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Auditing Contract
        </Title>
        <Group gap="md" align="center">
          <Text size="sm" c="dimmed">
            Filter by status:
          </Text>
          <SegmentedControl
            data={STATUS_OPTIONS}
            value={filter}
            onChange={(v) => setFilter(v as StatusFilter)}
            size="xs"
          />
        </Group>

        {query.isLoading && <Text>Loading contracts…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load contracts"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && query.data.items.length === 0 && (
          <EmptyState message="No contracts match the current filter" />
        )}
        {query.data && query.data.items.length > 0 && (
          <Table withTableBorder striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Contract ID</Table.Th>
                <Table.Th>Agency</Table.Th>
                <Table.Th>Start</Table.Th>
                <Table.Th>End</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Audited at</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {query.data.items.map((row: ContractSummary) => (
                <Table.Tr key={row.contractId}>
                  <Table.Td>{row.contractId}</Table.Td>
                  <Table.Td>{row.agency}</Table.Td>
                  <Table.Td>{row.startDate}</Table.Td>
                  <Table.Td>{row.endDate}</Table.Td>
                  <Table.Td>
                    <BIQBadge status={row.status as 'Pending' | 'In Process' | 'Closed'} />
                  </Table.Td>
                  <Table.Td>{new Date(row.auditedAt).toLocaleString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </Container>
  );
}
