import { Container, Stack, Title, Tabs, Text, Group, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { BIQButton, BIQInput } from '@/components/primitives';
import { messageBox } from '@/components/modal';
import { api } from '@/api/client';
import {
  defaultPasswordValues,
  mfaSetupSchema,
  passwordChangeSchema,
  type MFASetupInput,
  type PasswordChangeInput,
} from './schema';

function PasswordChangeForm({ expired = false }: { expired?: boolean }) {
  const mutation = useMutation({
    mutationFn: async (values: PasswordChangeInput): Promise<{ ok: boolean }> =>
      api.post('user/password', { json: values }).json<{ ok: boolean }>(),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: defaultPasswordValues,
  });

  const onSubmit = handleSubmit(async (v) => {
    try {
      await mutation.mutateAsync(v);
      await messageBox.success('Password updated.');
      reset(defaultPasswordValues);
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'Password update failed.');
    }
  });

  return (
    <form onSubmit={onSubmit} aria-label="Change password form" noValidate>
      <Stack gap="md">
        {expired && (
          <Alert color="yellow" icon={<IconAlertCircle size={16} />} variant="light">
            Your password has expired. Set a new one to continue.
          </Alert>
        )}
        <BIQInput
          label="Current password"
          required
          type="password"
          {...register('currentPassword')}
          error={errors.currentPassword?.message}
        />
        <BIQInput
          label="New password"
          required
          type="password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
        <BIQInput
          label="Confirm new password"
          required
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        <Group justify="flex-end" mt="sm">
          <BIQButton type="submit" variant="filled" loading={isSubmitting}>
            Update password
          </BIQButton>
        </Group>
      </Stack>
    </form>
  );
}

function MFASetupForm() {
  const mutation = useMutation({
    mutationFn: async (values: MFASetupInput): Promise<{ enabled: boolean }> =>
      api.post('user/mfa/verify', { json: values }).json<{ enabled: boolean }>(),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MFASetupInput>({
    resolver: zodResolver(mfaSetupSchema),
    defaultValues: { otpCode: '' },
  });

  const onSubmit = handleSubmit(async (v) => {
    try {
      await mutation.mutateAsync(v);
      await messageBox.success('MFA enabled.');
      reset({ otpCode: '' });
    } catch (err) {
      await messageBox.error(err instanceof Error ? err.message : 'MFA verification failed.');
    }
  });

  return (
    <form onSubmit={onSubmit} aria-label="MFA setup form" noValidate>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Scan the QR code in your authenticator app (placeholder — real QR ships with backend
          integration), then enter the 6-digit code below.
        </Text>
        <BIQInput
          label="6-digit OTP"
          required
          maxLength={6}
          placeholder="123456"
          {...register('otpCode')}
          error={errors.otpCode?.message}
        />
        <Group justify="flex-end" mt="sm">
          <BIQButton type="submit" variant="filled" loading={isSubmitting}>
            Verify + enable MFA
          </BIQButton>
        </Group>
      </Stack>
    </form>
  );
}

export default function UserProfilesPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          User Profile
        </Title>
        <Tabs defaultValue="profile">
          <Tabs.List>
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="password">Change password</Tabs.Tab>
            <Tabs.Tab value="expired">Password expired</Tabs.Tab>
            <Tabs.Tab value="mfa">MFA setup</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="profile" pt="md">
            <Text>Profile details placeholder — wire to backend in real integration.</Text>
          </Tabs.Panel>
          <Tabs.Panel value="password" pt="md">
            <PasswordChangeForm />
          </Tabs.Panel>
          <Tabs.Panel value="expired" pt="md">
            <PasswordChangeForm expired />
          </Tabs.Panel>
          <Tabs.Panel value="mfa" pt="md">
            <MFASetupForm />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
