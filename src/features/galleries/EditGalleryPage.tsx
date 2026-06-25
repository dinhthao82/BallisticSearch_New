import { Container, Stack, Title, Text, Group, Table } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge, BIQButton } from '@/components/primitives';
import { EmptyState, ErrorState } from '@/components/feedback';
import { messageBox } from '@/components/modal';
import { api } from '@/api/client';
import type { GalleryItem } from './types';

export default function EditGalleryPage() {
  const [params] = useSearchParams();
  const galleryId = params.get('galleryId') ?? '';
  const query = useQuery({
    queryKey: ['galleries', 'single', galleryId],
    queryFn: ({ signal }) => api.get(`galleries/${galleryId}`, { signal }).json<GalleryItem>(),
    enabled: Boolean(galleryId),
  });

  if (!galleryId) {
    return (
      <Container size="lg" py="xl">
        <EmptyState message="No gallery selected" hint="Provide ?galleryId=X in the URL." />
      </Container>
    );
  }

  if (query.isLoading)
    return (
      <Container size="lg" py="xl">
        <Text>Loading gallery…</Text>
      </Container>
    );
  if (query.isError || !query.data)
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message="Failed to load gallery"
          detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
          onRetry={() => void query.refetch()}
        />
      </Container>
    );

  const g = query.data;

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3} c="biq.7">
            Edit Gallery: {g.galleryName}
          </Title>
          <Group gap="xs">
            <BIQBadge color={g.status === 'Active' ? 'green' : 'gray'}>{g.status}</BIQBadge>
            <BIQButton
              variant="default"
              size="xs"
              onClick={() => void messageBox.info('Bulk-archive feature placeholder.')}
            >
              Bulk archive
            </BIQButton>
          </Group>
        </Group>

        <Table withTableBorder striped>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <strong>Gallery ID</strong>
              </Table.Td>
              <Table.Td>{g.id}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <strong>Case number</strong>
              </Table.Td>
              <Table.Td>{g.caseNumber}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <strong>Item count</strong>
              </Table.Td>
              <Table.Td>{g.itemCount}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <strong>Updated</strong>
              </Table.Td>
              <Table.Td>{new Date(g.updatedAt).toLocaleString()}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        <Text size="sm" c="dimmed">
          Full image-management UI (bulk add/remove items, drag-reorder, retag) ships with the
          backend integration mission. The shell here demonstrates the page route, data flow, and
          action wiring.
        </Text>
      </Stack>
    </Container>
  );
}
