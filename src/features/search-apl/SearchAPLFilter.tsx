import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea, Button, Stack, Group, Checkbox } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@tabler/icons-react';
import { searchAPLFilterSchema, type SearchAPLFilterValues } from './schema';

interface SearchAPLFilterProps {
  onSubmit: (values: SearchAPLFilterValues) => void;
  defaultValues?: SearchAPLFilterValues;
  isSubmitting?: boolean;
}

export function SearchAPLFilter({
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: SearchAPLFilterProps) {
  const { t } = useTranslation('searchAPL');
  const { register, handleSubmit, control, reset } = useForm<SearchAPLFilterValues>({
    resolver: zodResolver(searchAPLFilterSchema),
    defaultValues: defaultValues ?? { reportStatus: [] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="search-apl-filter">
      <Stack gap="sm">
        <Textarea
          label={t('filter.apl_ID')}
          placeholder={t('filter.apl_IDPlaceholder')}
          rows={2}
          autosize
          minRows={2}
          maxRows={5}
          {...register('apl_ID')}
        />

        <Textarea
          label={t('filter.caseIncident')}
          placeholder={t('filter.caseIncidentPlaceholder')}
          rows={2}
          autosize
          minRows={2}
          maxRows={5}
          {...register('caseNumber')}
        />

        <Group grow>
          <Controller
            name="dateFrom"
            control={control}
            render={({ field }) => (
              <DateInput
                label={t('filter.dateFrom')}
                value={field.value ? new Date(field.value) : null}
                onChange={(d) => field.onChange(d ? toIsoDate(d) : '')}
                valueFormat="YYYY-MM-DD"
                clearable
              />
            )}
          />
          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => (
              <DateInput
                label={t('filter.dateTo')}
                value={field.value ? new Date(field.value) : null}
                onChange={(d) => field.onChange(d ? toIsoDate(d) : '')}
                valueFormat="YYYY-MM-DD"
                clearable
              />
            )}
          />
        </Group>

        <Controller
          name="reportStatus"
          control={control}
          render={({ field }) => (
            <Checkbox.Group
              label={t('filter.reportStatus')}
              value={field.value ?? []}
              onChange={(v) => field.onChange(v)}
            >
              <Group mt="xs" gap="xs">
                <Checkbox value="pending" label={t('status.pending')} />
                <Checkbox value="inProcess" label={t('status.inProcess')} />
                <Checkbox value="closed" label={t('status.closed')} />
              </Group>
            </Checkbox.Group>
          )}
        />

        <Group mt="md">
          <Button
            type="submit"
            loading={isSubmitting}
            leftSection={<IconSearch size={16} />}
          >
            {t('common:button.search', 'Search')}
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => reset({ reportStatus: [] })}
          >
            {t('common:button.reset', 'Reset')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function toIsoDate(d: string | Date): string {
  if (d instanceof Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return d;
}
