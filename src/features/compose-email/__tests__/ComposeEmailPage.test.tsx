import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ComposeEmailPage from '../ComposeEmailPage';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>{node}</QueryClientProvider>
    </MantineProvider>
  );
}

describe('ComposeEmailPage', () => {
  it('renders all required fields', () => {
    render(ui(<ComposeEmailPage />));
    expect(screen.getByText('Compose Email')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /^to$/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /cc/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /subject/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /body/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(ui(<ComposeEmailPage />));
    const form = screen.getByRole('form', { name: /compose email form/i });
    fireEvent.submit(form);
    expect(await screen.findByText(/at least one recipient required/i)).toBeInTheDocument();
    expect(await screen.findByText(/subject is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/body is required/i)).toBeInTheDocument();
  });

  it('Clear button resets dirty inputs', () => {
    render(ui(<ComposeEmailPage />));
    const to = screen.getByRole('textbox', { name: /^to$/i }) as HTMLInputElement;
    fireEvent.change(to, { target: { value: 'a@b.com' } });
    expect(to.value).toBe('a@b.com');
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(to.value).toBe('');
  });
});
