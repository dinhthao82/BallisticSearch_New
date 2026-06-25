import { Container, Stack, Group, Title, NumberInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { BIQButton, BIQInput, BIQSwitch } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import { api } from '@/api/client';
import {
  agencySettingSchema,
  defaultAgencySettingValues,
  type AgencySettingInput,
} from './schemas';

export default function AgencySettingPage() {
  const mutation = useMutation({
    mutationFn: async (values: AgencySettingInput): Promise<{ id: string }> =>
      api.put('agencies/settings', { json: values }).json<{ id: string }>(),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgencySettingInput>({
    resolver: zodResolver(agencySettingSchema),
    defaultValues: defaultAgencySettingValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      await messageBox.success(`Agency settings saved.`);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Save failed.');
    }
  });

  return (
    <Container size="sm" py="xl">
      <form onSubmit={onSubmit} aria-label="Agency setting form" noValidate>
        <Stack gap="md">
          <Title order={3} c="biq.7">
            Agency Settings
          </Title>

          <BIQInput
            label="Agency ID"
            required
            {...register('agencyId')}
            error={errors.agencyId?.message}
          />

          <Controller
            control={control}
            name="retentionDays"
            render={({ field }) => (
              <NumberInput
                label="Retention (days)"
                min={30}
                max={3650}
                value={field.value}
                onChange={(v) => field.onChange(typeof v === 'number' ? v : Number(v) || 30)}
                error={errors.retentionDays?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="autoApprove"
            render={({ field }) => (
              <BIQSwitch
                label="Auto-approve new evidence"
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
            )}
          />
          <Controller
            control={control}
            name="sharingEnabled"
            render={({ field }) => (
              <BIQSwitch
                label="Enable sharing with other agencies"
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
            )}
          />

          <Group justify="flex-end" gap="sm" mt="md">
            <BIQButton
              type="button"
              variant="default"
              onClick={() => reset(defaultAgencySettingValues)}
            >
              Reset
            </BIQButton>
            <BIQButton type="submit" variant="filled" loading={isSubmitting}>
              Save settings
            </BIQButton>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
