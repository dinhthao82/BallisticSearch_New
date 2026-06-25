import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import { useUserStore } from '@/store/userStore';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return (
    <MantineProvider theme={mantineTheme}>
      <MemoryRouter>{node}</MemoryRouter>
    </MantineProvider>
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
  });

  it('renders welcome title (anonymous)', () => {
    render(ui(<HomePage />));
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('renders welcome title including username when logged in', () => {
    useUserStore.setState({ user: { id: '1', username: 'jdoe', role: 'Admin' } });
    render(ui(<HomePage />));
    expect(screen.getByText(/welcome, jdoe/i)).toBeInTheDocument();
  });

  it('renders 14 quick-action cards', () => {
    render(ui(<HomePage />));
    const cards = screen.getAllByTestId('home-quick-action');
    expect(cards).toHaveLength(14);
  });

  it('quick-action cards link to expected routes', () => {
    render(ui(<HomePage />));
    expect(screen.getByRole('link', { name: /search apl/i })).toHaveAttribute(
      'href',
      '/app/search-apl'
    );
    expect(screen.getByRole('link', { name: /submit rapid/i })).toHaveAttribute(
      'href',
      '/app/submit-rapid'
    );
    expect(screen.getByRole('link', { name: /map of agencies/i })).toHaveAttribute(
      'href',
      '/app/map-of-agencies'
    );
  });
});
