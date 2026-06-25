import { Container, Stack, Title, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { BIQMap } from '@/components/map';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface PotentialLocation {
  id: string;
  caseNumber: string;
  lat: number;
  lng: number;
  occurredAt: string;
}

export default function MapItPotentialPage() {
  const [params] = useSearchParams();
  const potentialId = params.get('potentialId') ?? '';
  const query = useQuery({
    queryKey: ['map', 'potential', potentialId],
    queryFn: ({ signal }) =>
      api.get(`map/potential/${potentialId}`, { signal }).json<PotentialLocation>(),
    enabled: Boolean(potentialId),
    staleTime: 60_000,
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

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Map It — Potential Link
        </Title>
        {query.isLoading && <Text>Loading potential link location…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load potential link"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && (
          <>
            <Text size="sm" c="dimmed">
              {query.data.caseNumber} — occurred {new Date(query.data.occurredAt).toLocaleString()}
            </Text>
            <BIQMap
              markers={[
                {
                  id: query.data.id,
                  lat: query.data.lat,
                  lng: query.data.lng,
                  popup: (
                    <div>
                      <strong>{query.data.caseNumber}</strong>
                      <br />
                      {new Date(query.data.occurredAt).toLocaleString()}
                    </div>
                  ),
                },
              ]}
              zoom={12}
              ariaLabel={`Map showing ${query.data.caseNumber}`}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
