import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AuditContractInfoPage from '../AuditContractInfoPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';
import type { ContractAuditInfo } from '../types';

vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn(),
  },
}));

interface KyMockChain {
  json: <T>() => Promise<T>;
}

function mockApiGet(response: ContractAuditInfo | Error) {
  const get = api.get as unknown as ReturnType<typeof vi.fn>;
  get.mockReturnValue({
    json: <T,>(): Promise<T> => {
      if (response instanceof Error) return Promise.reject(response);
      return Promise.resolve(response as unknown as T);
    },
  } satisfies KyMockChain);
}

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/app/audit-contract-info" element={<AuditContractInfoPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

const sampleData: ContractAuditInfo = {
  contractId: 'CONTRACT-001',
  auditedBy: 'jdoe',
  auditedAt: '2026-06-20T10:30:00Z',
  oldContract: {
    version: 'v1',
    agency: 'Springfield PD',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    status: 'Closed',
    usersLimit: 50,
  },
  newContract: {
    version: 'v2',
    agency: 'Springfield PD',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    status: 'In Process',
    usersLimit: 100,
  },
  changes: [{ field: 'usersLimit', from: '50', to: '100' }],
};

describe('AuditContractInfoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows empty state when no contractId in URL', () => {
    renderAt('/app/audit-contract-info');
    expect(screen.getByText(/no contract selected/i)).toBeInTheDocument();
    expect(screen.getByText(/provide a contractId/i)).toBeInTheDocument();
  });

  it('shows loading message while query in flight', () => {
    mockApiGet(new Promise(() => undefined) as unknown as ContractAuditInfo);
    // Actually mock with never-resolving chain
    const get = api.get as unknown as ReturnType<typeof vi.fn>;
    get.mockReturnValue({ json: () => new Promise(() => undefined) });

    renderAt('/app/audit-contract-info?contractId=CONTRACT-001');
    expect(screen.getByText(/loading contract audit info/i)).toBeInTheDocument();
  });

  it('renders contract data on success', async () => {
    mockApiGet(sampleData);
    renderAt('/app/audit-contract-info?contractId=CONTRACT-001');

    await waitFor(() => {
      expect(screen.getByText('Contract Audit')).toBeInTheDocument();
    });
    expect(screen.getByText(/CONTRACT-001/i)).toBeInTheDocument();
    expect(screen.getByText('Old contract')).toBeInTheDocument();
    expect(screen.getByText('New contract')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText('In Process')).toBeInTheDocument();
  });

  it('shows error state on query failure', async () => {
    mockApiGet(new Error('Network failure'));
    renderAt('/app/audit-contract-info?contractId=CONTRACT-001');

    await waitFor(() => {
      expect(screen.getByText(/failed to load contract audit/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/network failure/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders changes table when changes present', async () => {
    mockApiGet(sampleData);
    renderAt('/app/audit-contract-info?contractId=CONTRACT-001');

    await waitFor(() => {
      expect(screen.getByText('Changes')).toBeInTheDocument();
    });
    // 'usersLimit' field appears in changes table (single occurrence)
    expect(screen.getByText('usersLimit')).toBeInTheDocument();
    // Verify table row contains both 50 (from) and 100 (to) — search within the table
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('50');
    expect(table).toHaveTextContent('100');
  });

  it('renders "no changes" empty state when changes array empty', async () => {
    mockApiGet({ ...sampleData, changes: [] });
    renderAt('/app/audit-contract-info?contractId=CONTRACT-001');

    await waitFor(() => {
      expect(screen.getByText(/no field-level changes recorded/i)).toBeInTheDocument();
    });
  });
});
