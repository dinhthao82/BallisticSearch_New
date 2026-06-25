import { Container, Stack, Title, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQMap, type MapMarker } from '@/components/map';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface GalleryMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
}

interface GalleriesResponse {
  items: GalleryMarker[];
}

export default function MapOfGalleriesPage() {
  const query = useQuery({
    queryKey: ['map', 'galleries'],
    queryFn: ({ signal }) => api.get('map/galleries', { signal }).json<GalleriesResponse>(),
    staleTime: 60_000,
  });

  const markers: MapMarker[] = (query.data?.items ?? []).map((g) => ({
    id: g.id,
    lat: g.lat,
    lng: g.lng,
    popup: (
      <div>
        <strong>{g.name}</strong>
        <br />
        {g.count.toLocaleString()} cartridge cases
      </div>
    ),
  }));

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Map of Galleries
        </Title>
        {query.isLoading && <Text>Loading galleries…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load galleries"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && (
          <>
            <Text size="sm" c="dimmed">
              {markers.length} galler{markers.length === 1 ? 'y' : 'ies'} plotted
            </Text>
            <BIQMap markers={markers} ariaLabel="Map of gallery locations" />
          </>
        )}
      </Stack>
    </Container>
  );
}
