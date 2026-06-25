import { Container, Stack, Group, Title, NumberInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { BIQBadge, BIQButton, BIQInput, BIQSelect } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import { api } from '@/api/client';
import { contractSchema, defaultContractValues, type ContractInput } from './schemas';

const STATUS_OPTIONS: { value: ContractInput['status']; label: string }[] = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Process', label: 'In Process' },
  { value: 'Closed', label: 'Closed' },
];

export default function ContractManagementPage() {
  const mutation = useMutation({
    mutationFn: async (values: ContractInput): Promise<{ id: string }> =>
      api.post('contracts', { json: values }).json<{ id: string }>(),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContractInput>({
    resolver: zodResolver(contractSchema),
    defaultValues: defaultContractValues,
  });
  const currentStatus = watch('status');

  const onSubmit = handleSubmit(async (values) => {
    try {
      const r = await mutation.mutateAsync(values);
      await messageBox.success(`Contract saved (ID: ${r.id}).`);
      reset(defaultContractValues);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Save failed.');
    }
  });

  return (
    <Container size="md" py="xl">
      <form onSubmit={onSubmit} aria-label="Contract management form" noValidate>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Title order={3} c="biq.7">
              Contract Management
            </Title>
            <BIQBadge color={currentStatus === 'Closed' ? 'gray' : 'blue'}>
              {currentStatus}
            </BIQBadge>
          </Group>

          <Group grow>
            <BIQInput
              label="Contract ID"
              required
              {...register('contractId')}
              error={errors.contractId?.message}
            />
            <BIQInput
              label="Agency ID"
              required
              {...register('agencyId')}
              error={errors.agencyId?.message}
            />
          </Group>

          <Group grow>
            <BIQInput
              label="Start date"
              required
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
            <BIQInput
              label="End date"
              required
              type="date"
              {...register('endDate')}
              error={errors.endDate?.message}
            />
          </Group>

          <Group grow>
            <Controller
              control={control}
              name="usersLimit"
              render={({ field }) => (
                <NumberInput
                  label="Users limit"
                  required
                  min={1}
                  max={10000}
                  value={field.value}
                  onChange={(v) => field.onChange(typeof v === 'number' ? v : Number(v) || 1)}
                  error={errors.usersLimit?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="storageLimitGB"
              render={({ field }) => (
                <NumberInput
                  label="Storage limit (GB)"
                  required
                  min={1}
                  max={100000}
                  value={field.value}
                  onChange={(v) => field.onChange(typeof v === 'number' ? v : Number(v) || 1)}
                  error={errors.storageLimitGB?.message}
                />
              )}
            />
          </Group>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <BIQSelect
                label="Status"
                required
                data={STATUS_OPTIONS}
                value={field.value}
                onChange={(e) => field.onChange(e.currentTarget.value)}
                error={errors.status?.message}
              />
            )}
          />

          <Group justify="flex-end" gap="sm" mt="md">
            <BIQButton type="button" variant="default" onClick={() => reset(defaultContractValues)}>
              Reset
            </BIQButton>
            <BIQButton type="submit" variant="filled" loading={isSubmitting}>
              Save contract
            </BIQButton>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
