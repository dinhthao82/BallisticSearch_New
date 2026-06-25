import { Container, Stack, Title, Text, Group, Card, SimpleGrid } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface SearchFaceInfo {
  searchId: string;
  caseNumber: string;
  candidates: { id: string; faceScore: number; demographics: string }[];
  threshold: number;
}

export default function SearchFaceInfoPage() {
  const [params] = useSearchParams();
  const searchId = params.get('searchId') ?? '';
  const query = useQuery({
    queryKey: ['face-search-info', searchId],
    queryFn: ({ signal }) => api.get(`face-search/${searchId}`, { signal }).json<SearchFaceInfo>(),
    enabled: Boolean(searchId),
  });

  if (!searchId) {
    return (
      <Container size="lg" py="xl">
        <EmptyState message="No face search selected" hint="Provide ?searchId=X in the URL." />
      </Container>
    );
  }
  if (query.isLoading)
    return (
      <Container size="lg" py="xl">
        <Text>Loading face search info…</Text>
      </Container>
    );
  if (query.isError || !query.data)
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message="Failed to load face search"
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
            Face Search Info — {d.searchId}
          </Title>
          <BIQBadge color="biq">Threshold {d.threshold.toFixed(0)}</BIQBadge>
        </Group>
        <Text size="sm" c="dimmed">
          Case: <strong>{d.caseNumber}</strong> — {d.candidates.length} candidate
          {d.candidates.length === 1 ? '' : 's'}
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {d.candidates.map((c) => (
            <Card key={c.id} withBorder padding="sm" radius="sm" data-testid="face-candidate-card">
              <Stack gap={4}>
                <Group justify="space-between">
                  <Text fw={600}>{c.id}</Text>
                  <BIQBadge color={c.faceScore >= d.threshold ? 'green' : 'gray'}>
                    {c.faceScore.toFixed(1)}
                  </BIQBadge>
                </Group>
                <Text size="xs" c="dimmed">
                  {c.demographics}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
