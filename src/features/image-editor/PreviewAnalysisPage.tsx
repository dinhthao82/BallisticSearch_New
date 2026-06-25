import { Container, Stack, Title, Text, Group, Table } from '@mantine/core';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BIQBadge, BIQButton } from '@/components/primitives';
import { EmptyState, ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

interface AnalysisItem {
  id: string;
  caseNumber: string;
  type: 'CC' | 'BC' | 'PL';
  thumbnail: string;
  notes: string;
}

interface AnalysisResponse {
  caseNumber: string;
  items: AnalysisItem[];
}

export default function PreviewAnalysisPage() {
  const [params] = useSearchParams();
  const caseNumber = params.get('caseNumber') ?? '';
  const query = useQuery({
    queryKey: ['preview-analysis', caseNumber],
    queryFn: ({ signal }) =>
      api
        .get('preview-analysis', { searchParams: { caseNumber }, signal })
        .json<AnalysisResponse>(),
    enabled: Boolean(caseNumber),
  });

  if (!caseNumber) {
    return (
      <Container size="lg" py="xl">
        <EmptyState message="No case number provided" hint="Provide ?caseNumber=W... in the URL." />
      </Container>
    );
  }
  if (query.isLoading)
    return (
      <Container size="lg" py="xl">
        <Text>Loading analysis preview…</Text>
      </Container>
    );
  if (query.isError || !query.data)
    return (
      <Container size="lg" py="xl">
        <ErrorState
          message="Failed to load analysis preview"
          detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
          onRetry={() => void query.refetch()}
        />
      </Container>
    );

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3} c="biq.7">
            Preview Analysis — {query.data.caseNumber}
          </Title>
          <Group gap="xs">
            <BIQButton
              component={Link}
              to={`/app/image-compare?caseNumber=${query.data.caseNumber}`}
              size="xs"
              variant="default"
            >
              Compare
            </BIQButton>
            <BIQButton
              component={Link}
              to={`/app/image-2d-compare?caseNumber=${query.data.caseNumber}`}
              size="xs"
              variant="default"
            >
              2D Compare
            </BIQButton>
            <BIQButton
              component={Link}
              to={`/app/image-standardize?caseNumber=${query.data.caseNumber}`}
              size="xs"
              variant="default"
            >
              Standardize
            </BIQButton>
          </Group>
        </Group>
        <Text size="sm" c="dimmed">
          {query.data.items.length} item{query.data.items.length === 1 ? '' : 's'} in this case
        </Text>
        <Table withTableBorder striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Notes</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {query.data.items.map((it) => (
              <Table.Tr key={it.id} data-testid="analysis-row">
                <Table.Td>{it.id}</Table.Td>
                <Table.Td>
                  <BIQBadge color="biq">{it.type}</BIQBadge>
                </Table.Td>
                <Table.Td>{it.notes}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
}
