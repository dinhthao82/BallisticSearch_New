import { Container, Stack, Title, Text, Group, SimpleGrid, Card } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { PotentialLinkDetail } from './types';

export default function SummaryPotentialLinksPage() {
  const [params] = useSearchParams();
  const potentialId = params.get('potentialId') ?? '';
  const query = useQuery({
    queryKey: ['potential-link', potentialId],
    queryFn: ({ signal }) =>
      api.get(`potential-links/${potentialId}`, { signal }).json<PotentialLinkDetail>(),
    enabled: Boolean(potentialId),
  });

  if (!potentialId) {
    return (
      <Container size="lg" py="xl">
        <EmptyState
          message="No potential link selected"
          hint="Provide ?potentialId=X in the URL."
        />
      </Container>
    );
  }
  if (query.isLoading)
    return (
      <Container size="lg" py="xl">
        <Text>Loading potential link summary…</Text>
      </Container>
    );
  if (query.isError || !query.data)
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message="Failed to load potential link"
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
            Potential Link Summary — {d.potentialId}
          </Title>
          <BIQBadge color={d.matchScore >= 80 ? 'green' : 'yellow'}>
            Score {d.matchScore.toFixed(1)}
          </BIQBadge>
        </Group>
        <Text size="sm" c="dimmed">
          Case: <strong>{d.caseNumber}</strong> — {d.matchedItems.length} matched item
          {d.matchedItems.length === 1 ? '' : 's'}
        </Text>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
          {d.matchedItems.map((it) => (
            <Card key={it.id} withBorder padding="sm" radius="sm" data-testid="potential-link-item">
              <Stack gap={4}>
                <Text size="sm" fw={600}>
                  {it.label}
                </Text>
                <Text size="xs" c="dimmed">
                  {it.id}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
        <Text>{d.notes}</Text>
      </Stack>
    </Container>
  );
}
