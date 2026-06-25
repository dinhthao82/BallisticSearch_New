import { Container, Stack, Title, Text, Group, Card, SimpleGrid } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQMap, type MapMarker } from '@/components/map';
import { BIQBadge } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface GalleryMapEntry {
  galleryId: string;
  name: string;
  lat: number;
  lng: number;
  imageThumbnails: string[]; // S3 URL placeholders
  itemCount: number;
}

interface GalleryMapResponse {
  items: GalleryMapEntry[];
}

export default function GalleryMapPage() {
  const query = useQuery({
    queryKey: ['gallery-map'],
    queryFn: ({ signal }) => api.get('gallery-map', { signal }).json<GalleryMapResponse>(),
    staleTime: 60_000,
  });

  const markers: MapMarker[] = (query.data?.items ?? []).map((g) => ({
    id: g.galleryId,
    lat: g.lat,
    lng: g.lng,
    popup: (
      <div>
        <strong>{g.name}</strong>
        <br />
        {g.itemCount} items
      </div>
    ),
  }));

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Gallery Map
        </Title>
        <Text size="sm" c="dimmed">
          Geographic view of galleries with S3-imagery thumbnail strip. Click a marker to see
          gallery preview.
        </Text>
        {query.isLoading && <Text>Loading map…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load gallery map"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && (
          <>
            <BIQMap markers={markers} ariaLabel="Map of galleries with imagery" />
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mt="md">
              {query.data.items.map((g) => (
                <Card key={g.galleryId} withBorder padding="md" data-testid="gallery-map-card">
                  <Stack gap={4}>
                    <Group justify="space-between">
                      <Text fw={600}>{g.name}</Text>
                      <BIQBadge color="biq">{g.itemCount}</BIQBadge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {g.galleryId}
                    </Text>
                    {g.imageThumbnails.length > 0 && (
                      <Group gap={4} mt={4}>
                        {g.imageThumbnails.slice(0, 4).map((url, i) => (
                          <div
                            key={i}
                            data-testid="gallery-thumbnail"
                            style={{
                              width: 48,
                              height: 48,
                              background: '#e9ecef',
                              border: '1px solid #ced4da',
                              borderRadius: 4,
                              fontSize: 10,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              color: '#868e96',
                            }}
                            title={url}
                          >
                            {/* Real thumbnail = <img src={url} />. S3 placeholder for POC. */}
                            S3
                          </div>
                        ))}
                      </Group>
                    )}
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </>
        )}
      </Stack>
    </Container>
  );
}
