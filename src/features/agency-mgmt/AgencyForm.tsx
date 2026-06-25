import { Stack, Group, Title, Container } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIQButton, BIQInput, BIQSwitch } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import { agencySchema, defaultAgencyValues, type AgencyInput } from './schemas';

interface AgencyFormProps {
  title: string;
  submitLabel: string;
  initialValues?: AgencyInput;
  onSubmit: (values: AgencyInput) => Promise<{ id: string }>;
  ariaLabel: string;
}

export function AgencyForm({
  title,
  submitLabel,
  initialValues,
  onSubmit,
  ariaLabel,
}: AgencyFormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgencyInput>({
    resolver: zodResolver(agencySchema),
    defaultValues: initialValues ?? defaultAgencyValues,
  });

  const onFormSubmit = handleSubmit(async (values) => {
    try {
      const r = await onSubmit(values);
      await messageBox.success(`Saved agency (ID: ${r.id}).`);
      if (!initialValues) reset(defaultAgencyValues);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Save failed.');
    }
  });

  return (
    <Container size="sm" py="xl">
      <form onSubmit={onFormSubmit} aria-label={ariaLabel} noValidate>
        <Stack gap="md">
          <Title order={3} c="biq.7">
            {title}
          </Title>

          <Group grow>
            <BIQInput
              label="Agency ID"
              required
              {...register('agencyId')}
              error={errors.agencyId?.message}
            />
            <BIQInput label="Name" required {...register('name')} error={errors.name?.message} />
          </Group>
          <BIQInput
            label="Contact email"
            required
            type="email"
            {...register('contactEmail')}
            error={errors.contactEmail?.message}
          />
          <Group grow>
            <BIQInput
              label="Contact phone"
              {...register('contactPhone')}
              error={errors.contactPhone?.message}
            />
            <BIQInput label="Region" {...register('region')} error={errors.region?.message} />
          </Group>

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
              onClick={() => reset(initialValues ?? defaultAgencyValues)}
            >
              Reset
            </BIQButton>
            <BIQButton type="submit" variant="filled" loading={isSubmitting}>
              {submitLabel}
            </BIQButton>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
