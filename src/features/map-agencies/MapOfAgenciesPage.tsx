import { Container, Stack, Title, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQMap, type MapMarker } from '@/components/map';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface AgencyMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface AgenciesResponse {
  items: AgencyMarker[];
}

export default function MapOfAgenciesPage() {
  const query = useQuery({
    queryKey: ['map', 'agencies'],
    queryFn: ({ signal }) => api.get('map/agencies', { signal }).json<AgenciesResponse>(),
    staleTime: 60_000,
  });

  const markers: MapMarker[] = (query.data?.items ?? []).map((a) => ({
    id: a.id,
    lat: a.lat,
    lng: a.lng,
    popup: (
      <div>
        <strong>{a.name}</strong>
        <br />
        {a.address}
      </div>
    ),
  }));

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Map of Agencies
        </Title>
        {query.isLoading && <Text>Loading agencies…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load agencies"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && (
          <>
            <Text size="sm" c="dimmed">
              {markers.length} agency location{markers.length === 1 ? '' : 's'} plotted
            </Text>
            <BIQMap markers={markers} ariaLabel="Map of agency locations" />
          </>
        )}
      </Stack>
    </Container>
  );
}
