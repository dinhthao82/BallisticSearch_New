import { useState, useCallback } from 'react';
import { Title, Stack, Group, Text, Table, Checkbox } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { PageBody, DataFilter, DataResult, BoxFilter } from '@/components/layout';
import { Pagination } from '@/components/data/Pagination';
import { BIQLoadingOverlay, ErrorState } from '@/components/feedback';
import { BIQBadge, BIQButton, BIQInput } from '@/components/primitives';
import { QA_RESULTS, defaultSearchQAValues, searchQASchema, type SearchQAInput } from './schema';
import { SEARCH_QA_QUERY_KEY, useSearchQA } from './useSearchQA';

function resultColor(r: 'Pass' | 'Fail' | 'Pending'): string {
  if (r === 'Pass') return 'green';
  if (r === 'Fail') return 'red';
  return 'yellow';
}

export default function SearchQAPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<SearchQAInput>(defaultSearchQAValues);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [enabled, setEnabled] = useState(false);

  const { data, isFetching, isError, error, refetch } = useSearchQA(
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
  } = useForm<SearchQAInput>({
    resolver: zodResolver(searchQASchema),
    defaultValues: defaultSearchQAValues,
  });

  const onSearch = handleSubmit((values) => {
    setFilter(values);
    setPage(1);
    setEnabled(true);
  });

  const handleCancel = useCallback(() => {
    void queryClient.cancelQueries({ queryKey: [...SEARCH_QA_QUERY_KEY] });
    setEnabled(false);
  }, [queryClient]);

  return (
    <PageBody>
      <BIQLoadingOverlay
        visible={isFetching}
        message="Searching QA reports…"
        onCancel={handleCancel}
      />
      <DataFilter>
        <BoxFilter title="Filters">
          <form onSubmit={onSearch} aria-label="Search QA filter">
            <Stack gap="sm">
              <BIQInput
                label="Case number"
                placeholder="e.g. W125000"
                {...register('caseNumber')}
                error={errors.caseNumber?.message}
              />

              <Group grow>
                <BIQInput
                  label="Reviewed from"
                  type="date"
                  {...register('dateFrom')}
                  error={errors.dateFrom?.message}
                />
                <BIQInput
                  label="Reviewed to"
                  type="date"
                  {...register('dateTo')}
                  error={errors.dateTo?.message}
                />
              </Group>

              <Controller
                control={control}
                name="results"
                render={({ field }) => (
                  <Checkbox.Group
                    label="QA result"
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                  >
                    <Stack gap={4} mt="xs">
                      {QA_RESULTS.map((r) => (
                        <Checkbox key={r} value={r} label={r} />
                      ))}
                    </Stack>
                  </Checkbox.Group>
                )}
              />

              <BIQInput
                label="Reviewer"
                placeholder="username"
                {...register('reviewer')}
                error={errors.reviewer?.message}
              />

              <Group justify="space-between" mt="sm">
                <BIQButton
                  type="button"
                  variant="default"
                  onClick={() => reset(defaultSearchQAValues)}
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
            <Title order={2}>Search QA Reports</Title>
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
            <Text c="dimmed">No QA reports match the current filter.</Text>
          )}

          {data && data.items.length > 0 && (
            <Table withTableBorder withColumnBorders striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>QA ID</Table.Th>
                  <Table.Th>Case #</Table.Th>
                  <Table.Th>Result</Table.Th>
                  <Table.Th>Reviewer</Table.Th>
                  <Table.Th>Reviewed</Table.Th>
                  <Table.Th>Notes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.items.map((row) => (
                  <Table.Tr key={row.qaId} data-testid="qa-row">
                    <Table.Td>{row.qaId}</Table.Td>
                    <Table.Td>{row.caseNumber}</Table.Td>
                    <Table.Td>
                      <BIQBadge color={resultColor(row.result)}>{row.result}</BIQBadge>
                    </Table.Td>
                    <Table.Td>{row.reviewer}</Table.Td>
                    <Table.Td>{new Date(row.reviewedAt).toLocaleString()}</Table.Td>
                    <Table.Td>{row.notes || '—'}</Table.Td>
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
