import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CaseNumberPage from '../CaseNumberPage';
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

describe('CaseNumberPage', () => {
  it('renders header copy', () => {
    render(ui(<CaseNumberPage />));
    expect(screen.getByText(/Audit Inquiry/i)).toBeInTheDocument();
    expect(screen.getByText(/audit-trail entry/i)).toBeInTheDocument();
  });

  it('renders required fields on initial load', () => {
    render(ui(<CaseNumberPage />));
    expect(screen.getByRole('textbox', { name: /case number/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /purpose/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('hides requestor name input by default (current user mode)', () => {
    render(ui(<CaseNumberPage />));
    expect(screen.queryByLabelText('Requestor name')).not.toBeInTheDocument();
  });

  it('renders both requestor radio options', () => {
    render(ui(<CaseNumberPage />));
    expect(screen.getByLabelText('Current user')).toBeInTheDocument();
    expect(screen.getByLabelText('Change requestor')).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    render(ui(<CaseNumberPage />));
    const form = screen.getByRole('form', { name: /case number audit form/i });
    fireEvent.submit(form);
    expect(await screen.findByText(/case number is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/purpose is required/i)).toBeInTheDocument();
  });

  it('Clear button resets dirty form state', () => {
    render(ui(<CaseNumberPage />));
    const caseInput = screen.getByRole('textbox', { name: /case number/i }) as HTMLInputElement;
    fireEvent.change(caseInput, { target: { value: 'CASE-001' } });
    expect(caseInput.value).toBe('CASE-001');
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(caseInput.value).toBe('');
  });
});
