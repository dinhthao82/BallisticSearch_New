import { Container, Stack, Title, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { BIQMap } from '@/components/map';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface GalleryLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

export default function MapItGalleryPage() {
  const [params] = useSearchParams();
  const galleryId = params.get('galleryId') ?? '';
  const query = useQuery({
    queryKey: ['map', 'gallery', galleryId],
    queryFn: ({ signal }) =>
      api.get(`map/gallery/${galleryId}`, { signal }).json<GalleryLocation>(),
    enabled: Boolean(galleryId),
    staleTime: 60_000,
  });

  if (!galleryId) {
    return (
      <Container size="lg" py="xl">
        <EmptyState message="No gallery selected" hint="Provide ?galleryId=X in the URL." />
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Map It — Gallery
        </Title>
        {query.isLoading && <Text>Loading gallery location…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load gallery location"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && (
          <>
            <Text size="sm" c="dimmed">
              {query.data.name} — {query.data.address}
            </Text>
            <BIQMap
              markers={[
                {
                  id: query.data.id,
                  lat: query.data.lat,
                  lng: query.data.lng,
                  popup: (
                    <div>
                      <strong>{query.data.name}</strong>
                      <br />
                      {query.data.address}
                    </div>
                  ),
                },
              ]}
              zoom={12}
              ariaLabel={`Map showing ${query.data.name}`}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
