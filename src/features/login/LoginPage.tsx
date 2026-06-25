import { useNavigate, Navigate } from 'react-router-dom';
import { Container, Paper, Stack, Title, PasswordInput, Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/store/userStore';
import { BIQButton, BIQCheckbox, BIQInput } from '@/components/primitives';
import { loginSchema, defaultLoginValues, type LoginInput } from './schema';
import { useLogin } from './useLogin';

export default function LoginPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const login = useUserStore((s) => s.login);
  const loginMutation = useLogin();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
    mode: 'onSubmit',
  });

  if (user) return <Navigate to="/app" replace />;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await loginMutation.mutateAsync(values);
      login({
        id: result.user.id,
        username: result.user.username,
        role: result.user.role,
      });
      navigate('/app');
    } catch (err) {
      // Surface server error via mutation.error; UI reads it below.
      void err;
    }
  });

  return (
    <Container size="xs" mt="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <form onSubmit={onSubmit} aria-label="Login form" noValidate>
          <Stack>
            <Title order={2} ta="center" c="biq.7">
              BIQ V5.1 Login
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Enter your credentials to continue.
            </Text>

            {loginMutation.isError && (
              <Alert color="red" icon={<IconAlertCircle size={16} />} variant="light">
                {loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : 'Login failed. Please check your credentials.'}
              </Alert>
            )}

            <BIQInput
              label="Username"
              required
              autoComplete="username"
              maxLength={60}
              {...register('username')}
              error={errors.username?.message}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <PasswordInput
                  label="Password"
                  required
                  autoComplete="current-password"
                  maxLength={200}
                  value={field.value}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <BIQCheckbox
                  label="Remember me on this device"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.currentTarget.checked)}
                />
              )}
            />

            <BIQButton type="submit" fullWidth mt="md" loading={isSubmitting} variant="filled">
              Login
            </BIQButton>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
