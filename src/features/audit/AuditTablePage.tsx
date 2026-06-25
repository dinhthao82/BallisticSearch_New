import { useState, type ReactNode } from 'react';
import { Container, Stack, Title, Table, Text, Group, TextInput } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { BIQButton } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';

export interface AuditColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
}

interface AuditTablePageProps<T extends { id: string }> {
  title: string;
  endpoint: string;
  columns: AuditColumn<T>[];
  searchAriaLabel: string;
  searchPlaceholder?: string;
}

export function AuditTablePage<T extends { id: string }>({
  title,
  endpoint,
  columns,
  searchAriaLabel,
  searchPlaceholder = 'Search user / action…',
}: AuditTablePageProps<T>) {
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const query = useQuery({
    queryKey: ['audit', endpoint, submittedSearch],
    queryFn: ({ signal }) =>
      api
        .get(endpoint, {
          searchParams: submittedSearch ? { search: submittedSearch } : {},
          signal,
        })
        .json<{ items: T[]; total: number }>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          {title}
        </Title>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmittedSearch(search);
          }}
          role="search"
          aria-label={searchAriaLabel}
        >
          <Group gap="sm">
            <TextInput
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <BIQButton type="submit" variant="filled">
              Search
            </BIQButton>
          </Group>
        </form>

        {query.isLoading && <Text>Loading…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load audit log"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && query.data.items.length === 0 && (
          <Text c="dimmed">No entries match the current search.</Text>
        )}
        {query.data && query.data.items.length > 0 && (
          <>
            <Text size="sm" c="dimmed">
              {query.data.total} entr{query.data.total === 1 ? 'y' : 'ies'}
            </Text>
            <Table withTableBorder striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  {columns.map((c) => (
                    <Table.Th key={c.header}>{c.header}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {query.data.items.map((row) => (
                  <Table.Tr key={row.id} data-testid="audit-row">
                    {columns.map((c, i) => (
                      <Table.Td key={i}>{c.cell(row)}</Table.Td>
                    ))}
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
