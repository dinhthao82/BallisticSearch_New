import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import AuditAllTransactionsPage from '../AuditAllTransactionsPage';
import LoginAuditingPage from '../LoginAuditingPage';
import InformationAuditingPage from '../InformationAuditingPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';

vi.mock('@/api/client', () => ({ api: { get: vi.fn() } }));

function mockGet(r: unknown) {
  (api.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => Promise.resolve(r as T),
  });
}

function ui(node: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter>{node}</MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('AuditAllTransactionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders title and rows', async () => {
    mockGet({
      items: [
        {
          id: 'T-1',
          user: 'jdoe',
          action: 'create',
          resource: 'user',
          occurredAt: '2026-06-01T00:00:00Z',
          ipAddress: '10.0.0.1',
        },
      ],
      total: 1,
    });
    ui(<AuditAllTransactionsPage />);
    expect(screen.getByText(/audit — all transactions/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('T-1')).toBeInTheDocument();
    });
  });
});

describe('LoginAuditingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders Success badge and reason column', async () => {
    mockGet({
      items: [
        {
          id: 'L-1',
          user: 'jdoe',
          occurredAt: '2026-06-01T00:00:00Z',
          ipAddress: '1.2.3.4',
          result: 'Success',
        },
        {
          id: 'L-2',
          user: 'mkim',
          occurredAt: '2026-06-02T00:00:00Z',
          ipAddress: '5.6.7.8',
          result: 'Failed',
          reason: 'Invalid password',
        },
      ],
      total: 2,
    });
    ui(<LoginAuditingPage />);
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
      expect(screen.getByText('Invalid password')).toBeInTheDocument();
    });
  });
});

describe('InformationAuditingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders title and details column', async () => {
    mockGet({
      items: [
        {
          id: 'I-1',
          user: 'rjones',
          action: 'view',
          details: 'Viewed search results',
          occurredAt: '2026-06-01T00:00:00Z',
        },
      ],
      total: 1,
    });
    ui(<InformationAuditingPage />);
    expect(screen.getByText(/audit — information/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Viewed search results')).toBeInTheDocument();
    });
  });
});
