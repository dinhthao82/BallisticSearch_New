import { Container, Stack, Title, Group } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIQButton, BIQInput, BIQSelect, BIQSwitch } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import { api } from '@/api/client';
import {
  agencyManagerSchema,
  defaultAgencyManagerValues,
  USER_ROLES,
  type AgencyManagerInput,
} from './schemas';

export default function AddAgencyManagerPage() {
  const mutation = useMutation({
    mutationFn: async (values: AgencyManagerInput): Promise<{ id: string }> =>
      api.post('agency-managers', { json: values }).json<{ id: string }>(),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgencyManagerInput>({
    resolver: zodResolver(agencyManagerSchema),
    defaultValues: defaultAgencyManagerValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await mutation.mutateAsync(values);
      await messageBox.success(`Agency manager created (ID: ${result.id}).`);
      reset(defaultAgencyManagerValues);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Save failed.');
    }
  });

  return (
    <Container size="sm" py="xl">
      <form onSubmit={onSubmit} aria-label="Add agency manager form" noValidate>
        <Stack gap="md">
          <Title order={3} c="biq.7">
            Add Agency Manager
          </Title>

          <BIQInput
            label="Username"
            required
            {...register('username')}
            error={errors.username?.message}
          />
          <BIQInput
            label="Email"
            required
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Group grow>
            <BIQInput
              label="First name"
              required
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <BIQInput
              label="Last name"
              required
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </Group>
          <BIQInput
            label="Agency ID"
            required
            {...register('agencyId')}
            error={errors.agencyId?.message}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <BIQSelect
                label="Role"
                data={[...USER_ROLES]}
                value={field.value}
                onChange={(e) => field.onChange(e.currentTarget.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <BIQSwitch
                label="Active"
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
            )}
          />

          <Group justify="flex-end" gap="sm" mt="md">
            <BIQButton
              type="button"
              variant="default"
              onClick={() => reset(defaultAgencyManagerValues)}
            >
              Reset
            </BIQButton>
            <BIQButton type="submit" variant="filled" loading={isSubmitting}>
              Create manager
            </BIQButton>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
