import { Outlet, Navigate, Link } from 'react-router-dom';
import { AppShell, Burger, Group, Title, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUserStore } from '@/store/userStore';

export default function ProtectedLayout() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const [opened, { toggle }] = useDisclosure();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>BIQ V5.1 — React POC</Title>
          </Group>
          <Group>
            <Text size="sm">
              {user.username} ({user.role})
            </Text>
            <Button variant="subtle" size="xs" onClick={logout}>
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Title order={5} mb="sm">
          Navigation
        </Title>
        <Button
          component={Link}
          to="/app/search-apl"
          variant="subtle"
          fullWidth
          justify="start"
        >
          Search APL Process
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
