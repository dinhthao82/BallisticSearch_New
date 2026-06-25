import { Stack, Group, NumberInput, Radio } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIQButton, BIQInput, BIQSelect, BIQTextarea } from '@/components/primitives';
import { useUserStore } from '@/store/userStore';
import { defaultSearchEventValues, searchEventSchema, type SearchEventInput } from './schema';

const SITE_OPTIONS = ['Site A', 'Site B', 'Site C', 'Site D'];
const USER_OPTIONS = ['jdoe', 'asmith', 'rjones', 'mkim'];

interface SearchEventFilterProps {
  onSubmit: (values: SearchEventInput) => void;
  isSubmitting?: boolean;
}

export function SearchEventFilter({ onSubmit, isSubmitting }: SearchEventFilterProps) {
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.role === 'Admin';

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchEventInput>({
    resolver: zodResolver(searchEventSchema),
    defaultValues: defaultSearchEventValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Search event filter">
      <Stack gap="sm">
        <Controller
          control={control}
          name="minScore"
          render={({ field }) => (
            <NumberInput
              label="Min score"
              min={0}
              max={100}
              step={1}
              value={field.value}
              onChange={(v) => field.onChange(typeof v === 'number' ? v : Number(v) || 0)}
              error={errors.minScore?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="topN"
          render={({ field }) => (
            <NumberInput
              label="Top results"
              min={1}
              max={500}
              step={1}
              value={field.value}
              onChange={(v) => field.onChange(typeof v === 'number' ? v : Number(v) || 1)}
              error={errors.topN?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="searchBy"
          render={({ field }) => (
            <Radio.Group label="Search by" value={field.value} onChange={(v) => field.onChange(v)}>
              <Group gap="md" mt="xs">
                <Radio value="any" label="Any" />
                <Radio value="exact" label="Exact" />
              </Group>
            </Radio.Group>
          )}
        />

        <BIQTextarea
          label="Case numbers"
          placeholder="Comma- or space-separated"
          minRows={2}
          {...register('caseNumbers')}
          error={errors.caseNumbers?.message}
        />

        <Group grow>
          <BIQInput
            label="Date from"
            type="date"
            {...register('dateFrom')}
            error={errors.dateFrom?.message}
          />
          <BIQInput
            label="Date to"
            type="date"
            {...register('dateTo')}
            error={errors.dateTo?.message}
          />
        </Group>

        {isAdmin && (
          <>
            <Controller
              control={control}
              name="site"
              render={({ field }) => (
                <BIQSelect
                  label="Site (Admin only)"
                  data={[{ value: '', label: 'Any site' }, ...SITE_OPTIONS]}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                />
              )}
            />
            <Controller
              control={control}
              name="user"
              render={({ field }) => (
                <BIQSelect
                  label="User (Admin only)"
                  data={[{ value: '', label: 'Any user' }, ...USER_OPTIONS]}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                />
              )}
            />
          </>
        )}

        <Group justify="space-between" mt="sm">
          <BIQButton
            type="button"
            variant="default"
            onClick={() => reset(defaultSearchEventValues)}
          >
            Reset
          </BIQButton>
          <BIQButton type="submit" variant="filled" loading={isSubmitting}>
            Search
          </BIQButton>
        </Group>
      </Stack>
    </form>
  );
}
