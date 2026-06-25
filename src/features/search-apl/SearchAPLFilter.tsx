import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { IconSearch } from '@tabler/icons-react';
import { BIQButton, BIQTextarea, BIQCheckbox } from '@/components/primitives';
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
        <BIQTextarea
          label={t('filter.apl_ID')}
          placeholder={t('filter.apl_IDPlaceholder')}
          {...register('apl_ID')}
        />

        <BIQTextarea
          label={t('filter.caseIncident')}
          placeholder={t('filter.caseIncidentPlaceholder')}
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
            <BIQCheckbox.Group
              label={t('filter.reportStatus')}
              value={field.value ?? []}
              onChange={(v) => field.onChange(v)}
            >
              <Group mt="xs" gap="xs">
                <BIQCheckbox value="pending" label={t('status.pending')} />
                <BIQCheckbox value="inProcess" label={t('status.inProcess')} />
                <BIQCheckbox value="closed" label={t('status.closed')} />
              </Group>
            </BIQCheckbox.Group>
          )}
        />

        <Group mt="md">
          <BIQButton type="submit" loading={isSubmitting} leftSection={<IconSearch size={16} />}>
            {t('common:button.search', 'Search')}
          </BIQButton>
          <BIQButton type="button" variant="default" onClick={() => reset({ reportStatus: [] })}>
            {t('common:button.reset', 'Reset')}
          </BIQButton>
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
