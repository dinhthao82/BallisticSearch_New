import { Container, Stack, Title, Text, Group, Table } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface ProbeMatchInfo {
  probeId: string;
  caseNumber: string;
  matches: { id: string; score: number; resource: string }[];
  topScore: number;
}

export default function ProbeMatchesInfoPage() {
  const [params] = useSearchParams();
  const probeId = params.get('probeId') ?? '';
  const query = useQuery({
    queryKey: ['probe-match-info', probeId],
    queryFn: ({ signal }) => api.get(`probe-matches/${probeId}`, { signal }).json<ProbeMatchInfo>(),
    enabled: Boolean(probeId),
  });

  if (!probeId) {
    return (
      <Container size="lg" py="xl">
        <EmptyState message="No probe selected" hint="Provide ?probeId=X in the URL." />
      </Container>
    );
  }
  if (query.isLoading)
    return (
      <Container size="lg" py="xl">
        <Text>Loading probe match info…</Text>
      </Container>
    );
  if (query.isError || !query.data)
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message="Failed to load probe matches"
          detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
          onRetry={() => void query.refetch()}
        />
      </Container>
    );

  const d = query.data;

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3} c="biq.7">
            Probe Matches — {d.probeId}
          </Title>
          <BIQBadge color={d.topScore >= 80 ? 'green' : 'yellow'}>
            Top score {d.topScore.toFixed(1)}
          </BIQBadge>
        </Group>
        <Text size="sm" c="dimmed">
          Case: <strong>{d.caseNumber}</strong> — {d.matches.length} match
          {d.matches.length === 1 ? '' : 'es'}
        </Text>
        {d.matches.length > 0 && (
          <Table withTableBorder striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Match ID</Table.Th>
                <Table.Th>Resource</Table.Th>
                <Table.Th>Score</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {d.matches.map((m) => (
                <Table.Tr key={m.id} data-testid="probe-match-row">
                  <Table.Td>{m.id}</Table.Td>
                  <Table.Td>{m.resource}</Table.Td>
                  <Table.Td>
                    <BIQBadge color={m.score >= 80 ? 'green' : 'yellow'}>
                      {m.score.toFixed(1)}
                    </BIQBadge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </Container>
  );
}
