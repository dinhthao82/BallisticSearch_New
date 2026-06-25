import { Container, Stack, Title, Table, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge, BIQButton } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { GalleryItem } from './types';

interface GalleryListProps {
  title: string;
  endpoint: string;
  ariaLabel?: string;
}

function statusColor(s: GalleryItem['status']): string {
  if (s === 'Active') return 'green';
  if (s === 'Archived') return 'gray';
  return 'yellow';
}

export function GalleryListPage({ title, endpoint, ariaLabel = title }: GalleryListProps) {
  const query = useQuery({
    queryKey: ['galleries', endpoint],
    queryFn: ({ signal }) =>
      api.get(endpoint, { signal }).json<{ items: GalleryItem[]; total: number }>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl" aria-label={ariaLabel}>
      <Stack gap="md">
        <Title order={3} c="biq.7">
          {title}
        </Title>
        {query.isLoading && <Text>Loading galleries…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load galleries"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && query.data.items.length > 0 && (
          <>
            <Text size="sm" c="dimmed">
              {query.data.total} galler{query.data.total === 1 ? 'y' : 'ies'}
            </Text>
            <Table withTableBorder striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Case #</Table.Th>
                  <Table.Th>Items</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Updated</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {query.data.items.map((g) => (
                  <Table.Tr key={g.id} data-testid="gallery-row">
                    <Table.Td>{g.id}</Table.Td>
                    <Table.Td>{g.galleryName}</Table.Td>
                    <Table.Td>{g.caseNumber}</Table.Td>
                    <Table.Td>{g.itemCount}</Table.Td>
                    <Table.Td>
                      <BIQBadge color={statusColor(g.status)}>{g.status}</BIQBadge>
                    </Table.Td>
                    <Table.Td>{new Date(g.updatedAt).toLocaleString()}</Table.Td>
                    <Table.Td>
                      <BIQButton
                        component={Link}
                        to={`/app/edit-gallery?galleryId=${g.id}`}
                        size="xs"
                        variant="subtle"
                      >
                        Edit
                      </BIQButton>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </>
        )}
      </Stack>
    </Container>
  );
}

export default function SearchGalleriesPage() {
  return <GalleryListPage title="Search Galleries" endpoint="galleries" />;
}
