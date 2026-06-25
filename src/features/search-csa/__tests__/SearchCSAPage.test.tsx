import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import SearchCSAPage from '../SearchCSAPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';
import type { CSAResponse } from '../types';

vi.mock('@/api/client', () => ({ api: { post: vi.fn() } }));

function mockApi(response: CSAResponse | Error) {
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

describe('SearchCSAPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and filter fields', () => {
    mockApi({ items: [], total: 0, page: 1, pageSize: 25 });
    render(ui(<SearchCSAPage />));
    expect(screen.getByText('Search CSA Process')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /case number/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /assigned to/i })).toBeInTheDocument();
  });

  it('shows prompt until Search clicked', () => {
    mockApi({ items: [], total: 0, page: 1, pageSize: 25 });
    render(ui(<SearchCSAPage />));
    expect(screen.getByText(/set criteria and click search/i)).toBeInTheDocument();
  });

  it('renders rows after submit', async () => {
    mockApi({
      items: [
        {
          csaId: 'CSA-1',
          caseNumber: 'W1',
          status: 'In Process',
          assignedTo: 'jdoe',
          createdAt: '2026-06-01T00:00:00Z',
          updatedAt: '2026-06-02T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 25,
    });
    render(ui(<SearchCSAPage />));
    fireEvent.submit(screen.getByRole('form', { name: /search csa filter/i }));
    await waitFor(() => {
      expect(screen.getByText('CSA-1')).toBeInTheDocument();
      expect(screen.getByText(/1 record/i)).toBeInTheDocument();
    });
  });

  it('renders empty message when no rows', async () => {
    mockApi({ items: [], total: 0, page: 1, pageSize: 25 });
    render(ui(<SearchCSAPage />));
    fireEvent.submit(screen.getByRole('form', { name: /search csa filter/i }));
    await waitFor(() => {
      expect(screen.getByText(/no csas match/i)).toBeInTheDocument();
    });
  });

  it('shows error state on failure', async () => {
    mockApi(new Error('Network down'));
    render(ui(<SearchCSAPage />));
    fireEvent.submit(screen.getByRole('form', { name: /search csa filter/i }));
    await waitFor(() => {
      expect(screen.getByText(/search failed/i)).toBeInTheDocument();
    });
  });
});
