import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuditingContractPage from '../AuditingContractPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';
import type { ContractsResponse } from '../types';

vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn(),
  },
}));

function mockApi(response: ContractsResponse | Error) {
  const get = api.get as unknown as ReturnType<typeof vi.fn>;
  get.mockReturnValue({
    json: <T,>(): Promise<T> => {
      if (response instanceof Error) return Promise.reject(response);
      return Promise.resolve(response as unknown as T);
    },
  });
}

function ui(node: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>{node}</QueryClientProvider>
    </MantineProvider>
  );
}

const sample: ContractsResponse = {
  items: [
    {
      contractId: 'CONTRACT-001',
      agency: 'Springfield PD',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      status: 'Closed',
      auditedAt: '2026-06-20T10:30:00Z',
    },
    {
      contractId: 'CONTRACT-002',
      agency: 'Riverside Sheriff',
      startDate: '2025-06-01',
      endDate: '2027-05-31',
      status: 'In Process',
      auditedAt: '2026-06-18T14:00:00Z',
    },
  ],
  total: 2,
};

describe('AuditingContractPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders title and status filter control', () => {
    mockApi({ items: [], total: 0 });
    render(ui(<AuditingContractPage />));
    expect(screen.getByText('Auditing Contract')).toBeInTheDocument();
    expect(screen.getByText(/filter by status/i)).toBeInTheDocument();
  });

  it('renders contract rows on success', async () => {
    mockApi(sample);
    render(ui(<AuditingContractPage />));
    await waitFor(() => {
      expect(screen.getByText('CONTRACT-001')).toBeInTheDocument();
      expect(screen.getByText('CONTRACT-002')).toBeInTheDocument();
    });
    expect(screen.getByText('Springfield PD')).toBeInTheDocument();
  });

  it('shows empty state when no rows', async () => {
    mockApi({ items: [], total: 0 });
    render(ui(<AuditingContractPage />));
    await waitFor(() => {
      expect(screen.getByText(/no contracts match/i)).toBeInTheDocument();
    });
  });

  it('renders error state on failure', async () => {
    mockApi(new Error('Network down'));
    render(ui(<AuditingContractPage />));
    await waitFor(() => {
      expect(screen.getByText(/failed to load contracts/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/network down/i)).toBeInTheDocument();
  });
});
