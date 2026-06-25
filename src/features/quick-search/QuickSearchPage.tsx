import { useState, useCallback } from 'react';
import {
  Container,
  Stack,
  Title,
  Group,
  Text,
  SimpleGrid,
  Card,
  Tabs,
  Image,
  Radio,
} from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BIQBadge, BIQButton, BIQInput, BIQTextarea } from '@/components/primitives';
import { BIQLoadingOverlay, ErrorState } from '@/components/feedback';
import { messageBox } from '@/components/modal';
import { api } from '@/api/client';

const quickSearchSchema = z.object({
  caliber: z.string().trim().optional(),
  caseNumbers: z.string().trim().optional(),
  minScore: z.number().min(0).max(100),
});
type QuickSearchInput = z.infer<typeof quickSearchSchema>;

const defaults: QuickSearchInput = { caliber: '', caseNumbers: '', minScore: 60 };

interface QuickSearchResult {
  id: string;
  caseNumber: string;
  score: number;
  type: string;
  thumbnail?: string;
}

interface QuickSearchResponse {
  items: QuickSearchResult[];
  total: number;
}

const QS_QUERY_KEY = ['quick-search'] as const;

export default function QuickSearchPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<QuickSearchInput>(defaults);
  const [enabled, setEnabled] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table' | 'compare'>('grid');
  const [selectedForReport, setSelectedForReport] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuickSearchInput>({
    resolver: zodResolver(quickSearchSchema),
    defaultValues: defaults,
  });

  const query = useQuery({
    queryKey: [...QS_QUERY_KEY, filter],
    queryFn: ({ signal }) =>
      api.post('quick-search', { json: filter, signal }).json<QuickSearchResponse>(),
    enabled,
  });

  const reportMutation = useMutation({
    mutationFn: async (payload: { id: string }) =>
      api.post('quick-search/possible-match-report', { json: payload }).json<{ jobId: string }>(),
  });

  const onSubmit = handleSubmit((values) => {
    setFilter(values);
    setEnabled(true);
  });

  const handleCancel = useCallback(() => {
    void qc.cancelQueries({ queryKey: [...QS_QUERY_KEY] });
    setEnabled(false);
  }, [qc]);

  const handleGenerateReport = async () => {
    if (!selectedForReport) {
      await messageBox.warn('Select a result first.');
      return;
    }
    try {
      const r = await reportMutation.mutateAsync({ id: selectedForReport });
      await messageBox.success(`Possible Match Report queued (job ${r.jobId}).`);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Report generation failed.');
    }
  };

  return (
    <Container size="xl" py="xl">
      <BIQLoadingOverlay
        visible={query.isFetching}
        message="Running quick search…"
        onCancel={handleCancel}
      />
      <Stack gap="md">
        <Title order={3} c="biq.7">
          Quick Search
        </Title>

        <form onSubmit={onSubmit} aria-label="Quick search filter">
          <Group gap="sm" align="flex-end">
            <BIQInput
              label="Caliber"
              placeholder="9mm / .40 S&W / ..."
              {...register('caliber')}
              error={errors.caliber?.message}
            />
            <BIQTextarea
              label="Case numbers"
              placeholder="Comma- or space-separated"
              minRows={1}
              {...register('caseNumbers')}
              error={errors.caseNumbers?.message}
              style={{ flex: 1 }}
            />
            <Controller
              control={control}
              name="minScore"
              render={({ field }) => (
                <BIQInput
                  label="Min score"
                  type="number"
                  min={0}
                  max={100}
                  value={String(field.value)}
                  onChange={(e) => field.onChange(Number(e.currentTarget.value) || 0)}
                  error={errors.minScore?.message}
                />
              )}
            />
            <BIQButton type="submit" variant="filled">
              Search
            </BIQButton>
          </Group>
        </form>

        {query.isError && (
          <ErrorState
            message="Quick search failed"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}

        {query.data && (
          <>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {query.data.total} result{query.data.total === 1 ? '' : 's'}
              </Text>
              <BIQButton
                variant="default"
                size="sm"
                disabled={!selectedForReport}
                onClick={handleGenerateReport}
                loading={reportMutation.isPending}
              >
                Generate Possible Match Report
              </BIQButton>
            </Group>

            <Tabs value={viewMode} onChange={(v) => setViewMode((v ?? 'grid') as typeof viewMode)}>
              <Tabs.List>
                <Tabs.Tab value="grid">Grid</Tabs.Tab>
                <Tabs.Tab value="list">List</Tabs.Tab>
                <Tabs.Tab value="table">Table</Tabs.Tab>
                <Tabs.Tab value="compare">Compare</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="grid" pt="md">
                <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                  {query.data.items.map((it) => (
                    <Card
                      key={it.id}
                      withBorder
                      padding="sm"
                      radius="sm"
                      data-testid="qs-grid-card"
                    >
                      <Stack gap={4}>
                        <Group justify="space-between">
                          <Text size="sm" fw={600}>
                            {it.id}
                          </Text>
                          <BIQBadge color={it.score >= 80 ? 'green' : 'yellow'}>
                            {it.score.toFixed(1)}
                          </BIQBadge>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {it.caseNumber} — {it.type}
                        </Text>
                        {it.thumbnail && (
                          <Image src={it.thumbnail} alt={it.id} h={80} fit="cover" />
                        )}
                        <Radio
                          checked={selectedForReport === it.id}
                          onChange={() => setSelectedForReport(it.id)}
                          label="Select for report"
                          size="xs"
                        />
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              </Tabs.Panel>

              <Tabs.Panel value="list" pt="md">
                <Stack gap="xs">
                  {query.data.items.map((it) => (
                    <Card key={it.id} withBorder padding="xs" data-testid="qs-list-row">
                      <Group justify="space-between">
                        <Text size="sm">
                          {it.id} — {it.caseNumber} ({it.type})
                        </Text>
                        <BIQBadge color={it.score >= 80 ? 'green' : 'yellow'}>
                          {it.score.toFixed(1)}
                        </BIQBadge>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="table" pt="md">
                <Text size="sm" c="dimmed">
                  Tabular view shares column logic with SearchEvent; full table renders here in the
                  real integration.
                </Text>
              </Tabs.Panel>

              <Tabs.Panel value="compare" pt="md">
                <Text size="sm" c="dimmed">
                  Compare view pairs 2 selected results side-by-side. Uses the same CompareDialog
                  primitive as SearchEvent (W16).
                </Text>
              </Tabs.Panel>
            </Tabs>
          </>
        )}
      </Stack>
    </Container>
  );
}
