import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AddUsersPage from '../AddUsersPage';
import EditUsersPage from '../EditUsersPage';
import ManageUserPage from '../UserListPage';
import ManageAdminPage from '../ManageAdminPage';
import AddAgencyManagerPage from '../AddAgencyManagerPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';
import { userFormSchema, defaultUserValues } from '../schemas';

vi.mock('@/api/client', () => ({ api: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

function mockGet(response: unknown) {
  (api.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => Promise.resolve(response as T),
  });
}

function ui(node: React.ReactNode, path = '/') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="*" element={<>{node}</>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('userFormSchema', () => {
  it('accepts valid form values', () => {
    expect(
      userFormSchema.safeParse({
        ...defaultUserValues,
        username: 'alice',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Doe',
      }).success
    ).toBe(true);
  });

  it('rejects short username', () => {
    expect(userFormSchema.safeParse({ ...defaultUserValues, username: 'a' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(
      userFormSchema.safeParse({
        ...defaultUserValues,
        username: 'alice',
        email: 'not-email',
        firstName: 'a',
        lastName: 'b',
      }).success
    ).toBe(false);
  });
});

describe('AddUsersPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders Add User title + required fields', () => {
    ui(<AddUsersPage />);
    expect(screen.getByText('Add User')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    ui(<AddUsersPage />);
    fireEvent.submit(screen.getByRole('form', { name: /add user form/i }));
    expect(await screen.findByText(/username must be at least 2/i)).toBeInTheDocument();
  });
});

describe('EditUsersPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows empty state when no userId', () => {
    ui(<EditUsersPage />);
    expect(screen.getByText(/no user selected/i)).toBeInTheDocument();
  });

  it('renders edit form with prefilled values when userId given', async () => {
    mockGet({
      id: 'U-1',
      username: 'alice',
      email: 'alice@e.com',
      firstName: 'Alice',
      lastName: 'D',
      role: 'Admin',
      active: true,
      createdAt: '2026-01-01T00:00:00Z',
    });
    ui(<EditUsersPage />, '/?userId=U-1');
    await waitFor(() => {
      expect(screen.getByText(/edit user: alice/i)).toBeInTheDocument();
    });
  });
});

describe('ManageUserPage (UserListPage)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders title and Add button', () => {
    mockGet({ items: [], total: 0 });
    ui(<ManageUserPage />);
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /add user/i })).toBeInTheDocument();
  });

  it('renders user rows on success', async () => {
    mockGet({
      items: [
        {
          id: 'U-1',
          username: 'alice',
          email: 'a@e.com',
          firstName: 'A',
          lastName: 'D',
          role: 'Admin',
          active: true,
          createdAt: '2026-01-01T00:00:00Z',
        },
      ],
      total: 1,
    });
    ui(<ManageUserPage />);
    await waitFor(() => {
      expect(screen.getByText('alice')).toBeInTheDocument();
      expect(screen.getByText(/1 user/i)).toBeInTheDocument();
    });
  });
});

describe('ManageAdminPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders Manage Admins title', () => {
    mockGet({ items: [], total: 0 });
    ui(<ManageAdminPage />);
    expect(screen.getByText('Manage Admins')).toBeInTheDocument();
  });
});

describe('AddAgencyManagerPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders title + agencyId field', () => {
    ui(<AddAgencyManagerPage />);
    expect(screen.getByText('Add Agency Manager')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /agency id/i })).toBeInTheDocument();
  });

  it('shows agency-required error on empty submit', async () => {
    ui(<AddAgencyManagerPage />);
    fireEvent.submit(screen.getByRole('form', { name: /add agency manager form/i }));
    expect(await screen.findByText(/agency is required/i)).toBeInTheDocument();
  });
});
