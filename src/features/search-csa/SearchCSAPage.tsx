import { useState, useCallback } from 'react';
import { Title, Stack, Group, Text, Table, Checkbox } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { PageBody, DataFilter, DataResult, BoxFilter } from '@/components/layout';
import { Pagination } from '@/components/data/Pagination';
import { BIQLoadingOverlay, ErrorState } from '@/components/feedback';
import { BIQBadge, BIQButton, BIQInput } from '@/components/primitives';
import {
  CSA_STATUSES,
  defaultSearchCSAValues,
  searchCSASchema,
  type SearchCSAInput,
} from './schema';
import { SEARCH_CSA_QUERY_KEY, useSearchCSA } from './useSearchCSA';

function statusColor(s: 'Open' | 'In Process' | 'Closed'): string {
  if (s === 'Open') return 'yellow';
  if (s === 'In Process') return 'blue';
  return 'gray';
}

export default function SearchCSAPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<SearchCSAInput>(defaultSearchCSAValues);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [enabled, setEnabled] = useState(false);

  const { data, isFetching, isError, error, refetch } = useSearchCSA(
    filter,
    page,
    pageSize,
    enabled
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchCSAInput>({
    resolver: zodResolver(searchCSASchema),
    defaultValues: defaultSearchCSAValues,
  });

  const onSearch = handleSubmit((values) => {
    setFilter(values);
    setPage(1);
    setEnabled(true);
  });

  const handleCancel = useCallback(() => {
    void queryClient.cancelQueries({ queryKey: [...SEARCH_CSA_QUERY_KEY] });
    setEnabled(false);
  }, [queryClient]);

  return (
    <PageBody>
      <BIQLoadingOverlay visible={isFetching} message="Searching CSAs…" onCancel={handleCancel} />
      <DataFilter>
        <BoxFilter title="Filters">
          <form onSubmit={onSearch} aria-label="Search CSA filter">
            <Stack gap="sm">
              <BIQInput
                label="Case number"
                placeholder="e.g. W124000"
                {...register('caseNumber')}
                error={errors.caseNumber?.message}
              />

              <Group grow>
                <BIQInput
                  label="Created from"
                  type="date"
                  {...register('dateFrom')}
                  error={errors.dateFrom?.message}
                />
                <BIQInput
                  label="Created to"
                  type="date"
                  {...register('dateTo')}
                  error={errors.dateTo?.message}
                />
              </Group>

              <Controller
                control={control}
                name="statuses"
                render={({ field }) => (
                  <Checkbox.Group
                    label="Status"
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                  >
                    <Stack gap={4} mt="xs">
                      {CSA_STATUSES.map((s) => (
                        <Checkbox key={s} value={s} label={s} />
                      ))}
                    </Stack>
                  </Checkbox.Group>
                )}
              />

              <BIQInput
                label="Assigned to"
                placeholder="username"
                {...register('assignedTo')}
                error={errors.assignedTo?.message}
              />

              <Group justify="space-between" mt="sm">
                <BIQButton
                  type="button"
                  variant="default"
                  onClick={() => reset(defaultSearchCSAValues)}
                >
                  Reset
                </BIQButton>
                <BIQButton type="submit" variant="filled" loading={isFetching}>
                  Search
                </BIQButton>
              </Group>
            </Stack>
          </form>
        </BoxFilter>
      </DataFilter>

      <DataResult>
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Title order={2}>Search CSA Process</Title>
            {data && (
              <Text size="sm" c="dimmed">
                {data.total} record{data.total === 1 ? '' : 's'}
              </Text>
            )}
          </Group>

          {isError && (
            <ErrorState
              message="Search failed"
              detail={error instanceof Error ? error.message : 'Unknown error'}
              onRetry={() => void refetch()}
            />
          )}

          {!isError && !data && !isFetching && (
            <Text c="dimmed">Set criteria and click Search to load results.</Text>
          )}

          {data && data.items.length === 0 && (
            <Text c="dimmed">No CSAs match the current filter.</Text>
          )}

          {data && data.items.length > 0 && (
            <Table withTableBorder withColumnBorders striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>CSA ID</Table.Th>
                  <Table.Th>Case #</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Assigned</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Updated</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.items.map((row) => (
                  <Table.Tr key={row.csaId} data-testid="csa-row">
                    <Table.Td>{row.csaId}</Table.Td>
                    <Table.Td>{row.caseNumber}</Table.Td>
                    <Table.Td>
                      <BIQBadge color={statusColor(row.status)}>{row.status}</BIQBadge>
                    </Table.Td>
                    <Table.Td>{row.assignedTo}</Table.Td>
                    <Table.Td>{new Date(row.createdAt).toLocaleString()}</Table.Td>
                    <Table.Td>{new Date(row.updatedAt).toLocaleString()}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          {data && data.items.length > 0 && (
            <Pagination
              total={data.total}
              page={data.page}
              pageSize={data.pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPage(1);
                setPageSize(s);
              }}
            />
          )}
        </Stack>
      </DataResult>
    </PageBody>
  );
}
