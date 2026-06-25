import { useState, useCallback } from 'react';
import { Title, Stack, Group, Text } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { PageBody, DataFilter, DataResult, BoxFilter } from '@/components/layout';
import { Pagination } from '@/components/data/Pagination';
import { BIQLoadingOverlay, ErrorState } from '@/components/feedback';
import { BIQButton } from '@/components/primitives';
import { SearchEventFilter } from './SearchEventFilter';
import { SearchEventResults } from './SearchEventResults';
import { CompareDialog } from './CompareDialog';
import { ExportDialog } from './ExportDialog';
import { defaultSearchEventValues, type SearchEventInput } from './schema';
import { SEARCH_EVENT_QUERY_KEY, useSearchEvents } from './useSearchEvents';

export default function SearchEventPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<SearchEventInput>(defaultSearchEventValues);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [enabled, setEnabled] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const { data, isFetching, isError, error, refetch } = useSearchEvents(
    filter,
    page,
    pageSize,
    enabled
  );

  const handleSubmit = useCallback((values: SearchEventInput) => {
    setFilter(values);
    setPage(1);
    setSelected(new Set());
    setEnabled(true);
  }, []);

  const handleCancel = useCallback(() => {
    void queryClient.cancelQueries({ queryKey: [...SEARCH_EVENT_QUERY_KEY] });
    setEnabled(false);
  }, [queryClient]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 2) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedItems = (data?.items ?? []).filter((i) => selected.has(i.eventId));

  return (
    <PageBody>
      <BIQLoadingOverlay visible={isFetching} message="Searching events…" onCancel={handleCancel} />
      <DataFilter>
        <BoxFilter title="Filters">
          <SearchEventFilter onSubmit={handleSubmit} isSubmitting={isFetching} />
        </BoxFilter>
      </DataFilter>

      <DataResult>
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Title order={2}>Search Events</Title>
            <Group gap="xs">
              {data && (
                <Text size="sm" c="dimmed">
                  {data.total} record{data.total === 1 ? '' : 's'}
                </Text>
              )}
              <BIQButton
                size="xs"
                variant="default"
                disabled={selected.size !== 2}
                onClick={() => setCompareOpen(true)}
              >
                Compare ({selected.size}/2)
              </BIQButton>
              <BIQButton
                size="xs"
                variant="default"
                disabled={!data || data.items.length === 0}
                onClick={() => setExportOpen(true)}
              >
                Export
              </BIQButton>
            </Group>
          </Group>

          {isError && (
            <ErrorState
              message="Search failed"
              detail={error instanceof Error ? error.message : 'Unknown error'}
              onRetry={() => void refetch()}
            />
          )}

          {!isError && data && (
            <SearchEventResults
              items={data.items}
              selected={selected}
              onToggleSelect={handleToggleSelect}
            />
          )}

          {!isError && !data && !isFetching && (
            <Text c="dimmed">Set criteria and click Search to load results.</Text>
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

      <CompareDialog
        opened={compareOpen}
        items={selectedItems}
        onClose={() => setCompareOpen(false)}
      />
      <ExportDialog
        opened={exportOpen}
        ids={(data?.items ?? []).map((i) => i.eventId)}
        onClose={() => setExportOpen(false)}
      />
    </PageBody>
  );
}
