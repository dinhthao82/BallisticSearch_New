import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SubmitRapidPage from '../SubmitRapidPage';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={queryClient}>{node}</QueryClientProvider>
    </MantineProvider>
  );
}

describe('SubmitRapidPage', () => {
  it('renders title and required fields', () => {
    render(ui(<SubmitRapidPage />));
    expect(screen.getByText(/submit rapid ballistics/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /case number/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /location/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /comment/i })).toBeInTheDocument();
  });

  it('renders priority radio options', () => {
    render(ui(<SubmitRapidPage />));
    expect(screen.getByLabelText('Routine')).toBeInTheDocument();
    expect(screen.getByLabelText('Urgent')).toBeInTheDocument();
  });

  it('renders photos input with description', () => {
    render(ui(<SubmitRapidPage />));
    expect(screen.getByText(/Max 5 photos/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(ui(<SubmitRapidPage />));
    const form = screen.getByRole('form', { name: /rapid ballistics submission/i });
    fireEvent.submit(form);
    expect(await screen.findByText(/case number is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/comment is required/i)).toBeInTheDocument();
  });

  it('Clear button resets caseNumber input', () => {
    render(ui(<SubmitRapidPage />));
    const input = screen.getByRole('textbox', { name: /case number/i }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'CASE-2026-001' } });
    expect(input.value).toBe('CASE-2026-001');
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(input.value).toBe('');
  });
});
