import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '../LoginPage';
import { useUserStore } from '@/store/userStore';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';

vi.mock('@/api/client', () => ({ api: { post: vi.fn() } }));

function mockLogin(response: unknown | Error) {
  (api.post as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => {
      if (response instanceof Error) return Promise.reject(response);
      return Promise.resolve(response as T);
    },
  });
}

function renderLogin(initialPath = '/login') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/app" element={<Navigate to="/app/search-apl" replace />} />
            <Route
              path="/app/search-apl"
              element={<div data-testid="apl-landing">APL landing</div>}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('shows login form fields', () => {
    renderLogin();
    expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    renderLogin();
    const form = screen.getByRole('form', { name: /login form/i });
    fireEvent.submit(form);
    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('submits → stores user → navigates to /app/search-apl', async () => {
    mockLogin({
      token: 't',
      user: { id: '1', username: 'am_vu', role: 'Admin', displayName: 'AM Vu' },
    });
    renderLogin();
    fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
      target: { value: 'am_vu' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'secret' },
    });
    const form = screen.getByRole('form', { name: /login form/i });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(useUserStore.getState().user).toMatchObject({ role: 'Admin', username: 'am_vu' });
    });
    await waitFor(() => {
      expect(screen.getByTestId('apl-landing')).toBeInTheDocument();
    });
  });

  it('renders server error alert on failed login', async () => {
    mockLogin(new Error('Invalid credentials'));
    renderLogin();
    fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
      target: { value: 'x' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'y' },
    });
    fireEvent.submit(screen.getByRole('form', { name: /login form/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
    expect(useUserStore.getState().user).toBeNull();
  });

  it('redirects to /app if user already logged in', () => {
    useUserStore.setState({ user: { id: '1', username: 'am_vu', role: 'Admin' } });
    renderLogin();
    // Login form should not render — Navigate kicked us into search-apl
    expect(screen.queryByRole('textbox', { name: /username/i })).not.toBeInTheDocument();
  });
});
