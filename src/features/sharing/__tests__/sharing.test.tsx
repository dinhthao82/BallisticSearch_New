import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import AdminShareToAgenciesPage from '../AdminShareToAgenciesPage';
import AgencyShareToAdminPage from '../AgencyShareToAdminPage';
import GlobalHotlistSharingPage from '../GlobalHotlistSharingPage';
import SharingProfilesPage from '../SharingProfilesPage';
import DashboardVCCPage from '../DashboardVCCPage';
import UserManagementPage from '../UserManagementPage';
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

describe('AdminShareToAgenciesPage', () => {
  beforeEach(() => vi.clearAllMocks());
  it('renders rows on success', async () => {
    mockGet({
      items: [
        {
          id: 'SH-1',
          agencyId: 'A-1',
          agencyName: 'A',
          scope: 'All cases',
          direction: 'out',
          status: 'Active',
          updatedAt: '2026-06-01T00:00:00Z',
        },
      ],
    });
    ui(<AdminShareToAgenciesPage />);
    await waitFor(() => {
      expect(screen.getByText('SH-1')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });
});

describe('AgencyShareToAdminPage', () => {
  beforeEach(() => vi.clearAllMocks());
  it('renders title', async () => {
    mockGet({ items: [] });
    ui(<AgencyShareToAdminPage />);
    expect(screen.getByText(/agency → admin sharing/i)).toBeInTheDocument();
  });
});

describe('GlobalHotlistSharingPage', () => {
  beforeEach(() => vi.clearAllMocks());
  it('renders hotlist rows on success', async () => {
    mockGet({
      items: [
        {
          id: 'HL-1',
          name: 'List 1',
          agencyId: 'A-1',
          itemCount: 42,
          updatedAt: '2026-06-01T00:00:00Z',
          active: true,
        },
      ],
    });
    ui(<GlobalHotlistSharingPage />);
    await waitFor(() => {
      expect(screen.getByText('HL-1')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });
});

describe('SharingProfilesPage', () => {
  beforeEach(() => vi.clearAllMocks());
  it('renders profile + permissions badges', async () => {
    mockGet({
      items: [
        {
          id: 'P-1',
          name: 'Read-write',
          agencyId: 'A-1',
          permissions: ['read', 'write'],
          updatedAt: '2026-06-01T00:00:00Z',
        },
      ],
    });
    ui(<SharingProfilesPage />);
    await waitFor(() => {
      expect(screen.getByText('Read-write')).toBeInTheDocument();
      expect(screen.getByText('read')).toBeInTheDocument();
      expect(screen.getByText('write')).toBeInTheDocument();
    });
  });
});

describe('DashboardVCCPage', () => {
  beforeEach(() => vi.clearAllMocks());
  it('renders 4 metric cards + by-agency table', async () => {
    mockGet({
      totalVCC: 100,
      pending: 10,
      inProcess: 30,
      closed: 60,
      byAgency: [{ agencyId: 'A-1', agencyName: 'A1', count: 5 }],
      recentActivity: [],
    });
    ui(<DashboardVCCPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('metric-card')).toHaveLength(4);
      expect(screen.getByText('A1 (A-1)')).toBeInTheDocument();
    });
  });
});

describe('UserManagementPage (consolidated)', () => {
  beforeEach(() => vi.clearAllMocks());
  it('renders 4 tabs', () => {
    mockGet({ items: [], total: 0 });
    ui(<UserManagementPage />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /all users/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^admins$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^examiners$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /examiner managers/i })).toBeInTheDocument();
  });
});
