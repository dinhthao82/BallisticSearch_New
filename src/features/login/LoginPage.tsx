import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Container, Paper, Stack, Title, TextInput, PasswordInput, Button, Text } from '@mantine/core';
import { useUserStore } from '@/store/userStore';
import type { User } from '@/store/userStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const login = useUserStore((s) => s.login);
  const [username, setUsername] = useState('am_vu');
  const [password, setPassword] = useState('Evidenceiq1!');

  if (user) return <Navigate to="/app" replace />;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // POC: mock auth. Real auth flow lands in P2 missions.
    const mockUser: User = { id: '1', username, role: 'Admin' };
    login(mockUser);
    navigate('/app/search-apl');
  };

  return (
    <Container size="xs" mt="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <form onSubmit={handleLogin}>
          <Stack>
            <Title order={2} ta="center">
              BIQ V5.1 Login
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              POC mock — any credentials grant Admin role
            </Text>
            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
            <Button type="submit" fullWidth mt="md">
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
