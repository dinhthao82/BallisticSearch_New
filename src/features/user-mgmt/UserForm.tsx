import { Stack, Group, Title, Container } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIQButton, BIQInput, BIQSelect, BIQSwitch } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import { defaultUserValues, USER_ROLES, userFormSchema, type UserFormInput } from './schemas';

interface UserFormProps {
  title: string;
  submitLabel: string;
  initialValues?: UserFormInput;
  onSubmit: (values: UserFormInput) => Promise<{ id: string }>;
  ariaLabel: string;
}

export function UserForm({
  title,
  submitLabel,
  initialValues,
  onSubmit,
  ariaLabel,
}: UserFormProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValues ?? defaultUserValues,
  });

  const onFormSubmit = handleSubmit(async (values) => {
    try {
      const result = await onSubmit(values);
      await messageBox.success(`Saved user (ID: ${result.id}).`);
      if (!initialValues) reset(defaultUserValues);
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

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <BIQSelect
                label="Role"
                required
                data={[...USER_ROLES]}
                value={field.value}
                onChange={(e) => field.onChange(e.currentTarget.value)}
                error={errors.role?.message}
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

          <Group justify="flex-end" mt="md" gap="sm">
            <BIQButton
              type="button"
              variant="default"
              onClick={() => reset(initialValues ?? defaultUserValues)}
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
