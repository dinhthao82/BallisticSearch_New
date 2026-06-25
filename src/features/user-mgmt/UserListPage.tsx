import { Container, Stack, Title, Table, Group, Text, TextInput } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BIQBadge, BIQButton } from '@/components/primitives';
import { ErrorState } from '@/components/feedback';
import { api } from '@/api/client';
import type { UsersResponse, UserRecord } from './types';

interface UserListPageProps {
  title: string;
  /** When set, restrict displayed rows to this role (e.g. "Admin"). */
  roleFilter?: 'Admin' | 'Agency' | 'Regular' | 'Examiner' | 'ExaminerManager';
  /** Path the "Add" button links to. */
  addLink?: string;
  formAriaLabel?: string;
}

export function UserListPage({
  title,
  roleFilter,
  addLink = '/app/add-users',
  formAriaLabel = 'User search',
}: UserListPageProps) {
  const [search, setSearch] = useState('');
  const query = useQuery({
    queryKey: ['users-list', roleFilter, search],
    queryFn: ({ signal }) =>
      api
        .get('users', {
          searchParams: {
            ...(roleFilter ? { role: roleFilter } : {}),
            ...(search ? { search } : {}),
          },
          signal,
        })
        .json<UsersResponse>(),
    staleTime: 30_000,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3} c="biq.7">
            {title}
          </Title>
          <BIQButton component={Link} to={addLink} variant="filled" size="sm">
            Add user
          </BIQButton>
        </Group>

        <form onSubmit={(e) => e.preventDefault()} role="search" aria-label={formAriaLabel}>
          <TextInput
            placeholder="Search by username / email…"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </form>

        {query.isLoading && <Text>Loading users…</Text>}
        {query.isError && (
          <ErrorState
            message="Failed to load users"
            detail={query.error instanceof Error ? query.error.message : 'Unknown error'}
            onRetry={() => void query.refetch()}
          />
        )}
        {query.data && query.data.items.length === 0 && (
          <Text c="dimmed">No users match the current filter.</Text>
        )}
        {query.data && query.data.items.length > 0 && (
          <>
            <Text size="sm" c="dimmed">
              {query.data.total} user{query.data.total === 1 ? '' : 's'}
            </Text>
            <Table withTableBorder striped highlightOnHover stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Username</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Active</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {query.data.items.map((u: UserRecord) => (
                  <Table.Tr key={u.id} data-testid="user-row">
                    <Table.Td>{u.id}</Table.Td>
                    <Table.Td>{u.username}</Table.Td>
                    <Table.Td>
                      {u.firstName} {u.lastName}
                    </Table.Td>
                    <Table.Td>{u.email}</Table.Td>
                    <Table.Td>{u.role}</Table.Td>
                    <Table.Td>
                      <BIQBadge color={u.active ? 'green' : 'gray'}>
                        {u.active ? 'Active' : 'Inactive'}
                      </BIQBadge>
                    </Table.Td>
                    <Table.Td>
                      <BIQButton
                        component={Link}
                        to={`/app/edit-users?userId=${u.id}`}
                        size="xs"
                        variant="subtle"
                      >
                        Edit
                      </BIQButton>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </>
        )}
      </Stack>
    </Container>
  );
}

export default function ManageUserPage() {
  return <UserListPage title="Manage Users" />;
}
