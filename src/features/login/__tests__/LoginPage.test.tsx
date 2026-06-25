import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import LoginPage from '../LoginPage';
import { useUserStore } from '@/store/userStore';
import { mantineTheme } from '@/theme/mantineTheme';

function renderLogin(initialPath = '/login') {
  return render(
    <MantineProvider theme={mantineTheme}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app/search-apl"
            element={<div data-testid="apl-landing">APL landing</div>}
          />
        </Routes>
      </MemoryRouter>
    </MantineProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
    localStorage.clear();
  });

  it('shows login form', () => {
    renderLogin();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('submits → stores user → navigates to /app/search-apl', async () => {
    renderLogin();
    const form = screen.getByRole('button', { name: /login/i }).closest('form');
    if (!form) throw new Error('form not found');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(useUserStore.getState().user).toMatchObject({ role: 'Admin' });
    });
    await waitFor(() => {
      expect(screen.getByTestId('apl-landing')).toBeInTheDocument();
    });
  });

  it('redirects to /app if user already logged in', () => {
    useUserStore.setState({ user: { id: '1', username: 'am_vu', role: 'Admin' } });
    renderLogin();
    // Navigate to /app/search-apl should kick in
    expect(screen.queryByLabelText(/Username/i)).not.toBeInTheDocument();
  });
});
