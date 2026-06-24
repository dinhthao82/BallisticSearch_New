import { useState, useCallback } from 'react';
import { Title, Stack, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { PageBody, DataFilter, DataResult, BoxFilter } from '@/components/layout';
import { Pagination } from '@/components/data/Pagination';
import { ErrorState } from '@/components/feedback';
import { useSearchAPL } from '@/api/apl';
import type { APLFilter } from '@/api/apl';
import { SearchAPLFilter } from './SearchAPLFilter';
import { SearchAPLResults } from './SearchAPLResults';
import { toApiFilter, type SearchAPLFilterValues } from './schema';

export default function SearchAPLPage() {
  const { t } = useTranslation('searchAPL');
  const [filter, setFilter] = useState<APLFilter>({ page: 1, pageSize: 25 });
  const [enabled, setEnabled] = useState(false);

  const { data, isFetching, isError, error, refetch } = useSearchAPL(filter, enabled);

  const handleSubmit = useCallback((values: SearchAPLFilterValues) => {
    const api = toApiFilter(values);
    setFilter({ ...api, page: 1, pageSize: 25 });
    setEnabled(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilter((f) => ({ ...f, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilter((f) => ({ ...f, page: 1, pageSize }));
  }, []);

  return (
    <PageBody>
      <DataFilter>
        <BoxFilter title={t('filter.title')}>
          <SearchAPLFilter onSubmit={handleSubmit} isSubmitting={isFetching} />
        </BoxFilter>
      </DataFilter>

      <DataResult>
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Title order={2}>{t('title')}</Title>
            {data && (
              <Text size="sm" c="dimmed">
                {data.total} record{data.total === 1 ? '' : 's'}
              </Text>
            )}
          </Group>

          {isError && (
            <ErrorState
              message={t('common:state.error')}
              detail={error instanceof Error ? error.message : 'Unknown error'}
              onRetry={() => void refetch()}
            />
          )}

          {!isError && (
            <SearchAPLResults items={data?.items ?? []} isLoading={isFetching} />
          )}

          {data && data.items.length > 0 && (
            <Pagination
              total={data.total}
              page={data.page}
              pageSize={data.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </Stack>
      </DataResult>
    </PageBody>
  );
}
