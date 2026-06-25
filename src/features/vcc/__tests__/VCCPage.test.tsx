import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import VCCPage from '../VCCPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';

vi.mock('@/api/client', () => ({ api: { get: vi.fn(), post: vi.fn() } }));

function mockGet(r: unknown) {
  (api.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => Promise.resolve(r as T),
  });
}

function ui(node: React.ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter>{node}</MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('VCCPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title + 3-tab report selector', async () => {
    mockGet({ items: [], total: 0 });
    ui(<VCCPage />);
    expect(screen.getByText(/VCC — Verification of Cartridge Cases/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /csa report/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /qa report/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /plr report/i })).toBeInTheDocument();
  });

  it('renders VCC rows w/ status badges', async () => {
    mockGet({
      items: [
        {
          id: 'VCC-1',
          caseNumber: 'W1',
          status: 'In Process',
          examiner: 'jdoe',
          comment: '',
          createdAt: '2026-06-01T00:00:00Z',
        },
      ],
      total: 1,
    });
    ui(<VCCPage />);
    await waitFor(() => {
      expect(screen.getByText('VCC-1')).toBeInTheDocument();
      expect(screen.getByText('In Process')).toBeInTheDocument();
    });
  });

  it('Save+Notify button disabled until VCC selected', async () => {
    mockGet({
      items: [
        {
          id: 'VCC-1',
          caseNumber: 'W1',
          status: 'Pending',
          examiner: 'jdoe',
          comment: '',
          createdAt: '2026-06-01T00:00:00Z',
        },
      ],
      total: 1,
    });
    ui(<VCCPage />);
    await waitFor(() => {
      expect(screen.getByText('VCC-1')).toBeInTheDocument();
    });
    const saveBtn = screen.getByRole('button', { name: /save \+ notify/i });
    expect(saveBtn).toBeDisabled();
  });
});
