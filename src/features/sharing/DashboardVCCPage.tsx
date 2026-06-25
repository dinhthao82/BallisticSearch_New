import { Container, Stack, Title, SimpleGrid, Card, Text, Group, Table } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { DashboardVCCMetrics } from './types';

function MetricCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <Card withBorder padding="md" radius="md" data-testid="metric-card">
      <Stack gap={4}>
        <Text size="xs" c="dimmed" tt="uppercase">
          {label}
        </Text>
        <Text size="xl" fw={700} c={color}>
          {value.toLocaleString()}
        </Text>
      </Stack>
    </Card>
  );
}

export default function DashboardVCCPage() {
  const query = useQuery({
    queryKey: ['dashboard-vcc'],
    queryFn: ({ signal }) => api.get('dashboard/vcc', { signal }).json<DashboardVCCMetrics>(),
    staleTime: 30_000,
  });

  if (query.isLoading)
    return (
      <Container size="lg" py="xl">
        <Text>Loading dashboard…</Text>
      </Container>
    );

  if (query.isError || !query.data)
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message="Failed to load dashboard"
          detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
          onRetry={() => void query.refetch()}
        />
      </Container>
    );

  const data = query.data;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={3} c="biq.7">
          Dashboard — VCC
        </Title>

        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          <MetricCard label="Total VCC" value={data.totalVCC} />
          <MetricCard label="Pending" value={data.pending} color="yellow.7" />
          <MetricCard label="In Process" value={data.inProcess} color="blue.7" />
          <MetricCard label="Closed" value={data.closed} color="gray.7" />
        </SimpleGrid>

        <Stack gap="xs">
          <Title order={5}>VCC by agency</Title>
          <Table withTableBorder striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Agency</Table.Th>
                <Table.Th>VCC count</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.byAgency.map((a) => (
                <Table.Tr key={a.agencyId} data-testid="agency-row">
                  <Table.Td>
                    {a.agencyName} ({a.agencyId})
                  </Table.Td>
                  <Table.Td>{a.count.toLocaleString()}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>

        <Stack gap="xs">
          <Title order={5}>Recent activity</Title>
          {data.recentActivity.map((act, i) => (
            <Group key={i} gap="md">
              <BIQBadge color="biq">{new Date(act.timestamp).toLocaleString()}</BIQBadge>
              <Text size="sm">
                <strong>{act.agency}</strong> — {act.action}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
