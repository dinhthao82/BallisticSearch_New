import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import SearchQAPage from '../SearchQAPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';
import type { QAResponse } from '../types';

vi.mock('@/api/client', () => ({ api: { post: vi.fn() } }));

function mockApi(response: QAResponse | Error) {
  (api.post as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => {
      if (response instanceof Error) return Promise.reject(response);
      return Promise.resolve(response as T);
    },
  });
}

function ui(node: React.ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter>{node}</MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('SearchQAPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title + filter fields', () => {
    mockApi({ items: [], total: 0, page: 1, pageSize: 25 });
    render(ui(<SearchQAPage />));
    expect(screen.getByText('Search QA Reports')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /case number/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /reviewer/i })).toBeInTheDocument();
  });

  it('renders rows after search', async () => {
    mockApi({
      items: [
        {
          qaId: 'QA-1',
          caseNumber: 'W1',
          result: 'Pass',
          reviewer: 'rjones',
          reviewedAt: '2026-06-01T00:00:00Z',
          notes: 'ok',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 25,
    });
    render(ui(<SearchQAPage />));
    fireEvent.submit(screen.getByRole('form', { name: /search qa filter/i }));
    await waitFor(() => {
      expect(screen.getByText('QA-1')).toBeInTheDocument();
      expect(screen.getByText(/1 record/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no rows', async () => {
    mockApi({ items: [], total: 0, page: 1, pageSize: 25 });
    render(ui(<SearchQAPage />));
    fireEvent.submit(screen.getByRole('form', { name: /search qa filter/i }));
    await waitFor(() => {
      expect(screen.getByText(/no qa reports match/i)).toBeInTheDocument();
    });
  });

  it('shows error state on failure', async () => {
    mockApi(new Error('boom'));
    render(ui(<SearchQAPage />));
    fireEvent.submit(screen.getByRole('form', { name: /search qa filter/i }));
    await waitFor(() => {
      expect(screen.getByText(/search failed/i)).toBeInTheDocument();
    });
  });
});
