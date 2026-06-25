import { Container, Stack, Title, Text, Group } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { DetectionDetail } from './types';

export default function ViewDetailsPage() {
  const [params] = useSearchParams();
  const detectionId = params.get('detectionId') ?? '';
  const query = useQuery({
    queryKey: ['detection', detectionId],
    queryFn: ({ signal }) =>
      api.get(`detections/${detectionId}`, { signal }).json<DetectionDetail>(),
    enabled: Boolean(detectionId),
  });

  if (!detectionId) {
    return (
      <Container size="lg" py="xl">
        <EmptyState message="No detection selected" hint="Provide ?detectionId=X in the URL." />
      </Container>
    );
  }

  if (query.isLoading)
    return (
      <Container size="lg" py="xl">
        <Text>Loading detection details…</Text>
      </Container>
    );
  if (query.isError || !query.data)
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message="Failed to load detection"
          detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
          onRetry={() => void query.refetch()}
        />
      </Container>
    );

  const d = query.data;

  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          View Details: {d.id}
        </Title>
        <Group gap="md">
          <Text size="sm" c="dimmed">
            Case: <strong>{d.caseNumber}</strong>
          </Text>
          <BIQBadge color={d.score >= 80 ? 'green' : d.score >= 60 ? 'yellow' : 'orange'}>
            Score {d.score.toFixed(0)}
          </BIQBadge>
        </Group>
        <Text>
          <strong>Type:</strong> {d.detectionType}
        </Text>
        <Text>
          <strong>Detected at:</strong> {new Date(d.detectedAt).toLocaleString()}
        </Text>
        <Text>
          <strong>Notes:</strong> {d.notes}
        </Text>
      </Stack>
    </Container>
  );
}
