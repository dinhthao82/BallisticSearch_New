import { Container, Stack, Title, Tabs } from '@mantine/core';
import { UserListPage } from '@/features/user-mgmt/UserListPage';

/**
 * M-072 consolidated admin view — wraps Admins / Examiners / Regular users
 * lists in a single tabbed page, matching the legacy GUI/UserManagement.aspx.
 */
export default function UserManagementPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3} c="biq.7">
          User Management
        </Title>

        <Tabs defaultValue="all">
          <Tabs.List>
            <Tabs.Tab value="all">All users</Tabs.Tab>
            <Tabs.Tab value="admins">Admins</Tabs.Tab>
            <Tabs.Tab value="examiners">Examiners</Tabs.Tab>
            <Tabs.Tab value="examiner-managers">Examiner Managers</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all" pt="md">
            <UserListPage title="All Users" formAriaLabel="All-users search" />
          </Tabs.Panel>
          <Tabs.Panel value="admins" pt="md">
            <UserListPage
              title="Admins"
              roleFilter="Admin"
              addLink="/app/add-users?role=Admin"
              formAriaLabel="Admin search"
            />
          </Tabs.Panel>
          <Tabs.Panel value="examiners" pt="md">
            <UserListPage
              title="Examiners"
              roleFilter="Examiner"
              addLink="/app/add-users?role=Examiner"
              formAriaLabel="Examiner search"
            />
          </Tabs.Panel>
          <Tabs.Panel value="examiner-managers" pt="md">
            <UserListPage
              title="Examiner Managers"
              roleFilter="ExaminerManager"
              addLink="/app/add-users?role=ExaminerManager"
              formAriaLabel="Examiner manager search"
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
