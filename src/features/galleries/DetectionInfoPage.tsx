import { Container, Stack, Title, Text, Group } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge } from '@/components/primitives';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { DetectionDetail } from './types';

export default function DetectionInfoPage() {
  const [params] = useSearchParams();
  const detectionId = params.get('detectionId') ?? '';
  const query = useQuery({
    queryKey: ['detection-info', detectionId],
    queryFn: ({ signal }) =>
      api.get(`detections/${detectionId}/info`, { signal }).json<DetectionDetail>(),
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
        <Text>Loading detection info…</Text>
      </Container>
    );
  if (query.isError || !query.data)
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message="Failed to load detection info"
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
          Detection Info — {d.id}
        </Title>
        <Group gap="md">
          <BIQBadge color="blue">{d.detectionType}</BIQBadge>
          <BIQBadge color={d.score >= 80 ? 'green' : 'yellow'}>Score {d.score.toFixed(0)}</BIQBadge>
        </Group>
        <Text size="sm">
          <strong>Case:</strong> {d.caseNumber}
        </Text>
        <Text size="sm">
          <strong>When:</strong> {new Date(d.detectedAt).toLocaleString()}
        </Text>
        <Text>{d.notes}</Text>
      </Stack>
    </Container>
  );
}
