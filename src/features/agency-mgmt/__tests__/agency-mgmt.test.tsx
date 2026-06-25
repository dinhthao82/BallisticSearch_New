import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AddAgenciesPage from '../AddAgenciesPage';
import EditAgencyPage from '../EditAgencyPage';
import AgencySettingPage from '../AgencySettingPage';
import ContractManagementPage from '../ContractManagementPage';
import ManageSharingAgenciesPage from '../ManageSharingAgenciesPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';
import {
  agencySchema,
  defaultAgencyValues,
  contractSchema,
  defaultContractValues,
} from '../schemas';

vi.mock('@/api/client', () => ({ api: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

function mockGet(r: unknown) {
  (api.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => Promise.resolve(r as T),
  });
}

function ui(node: React.ReactNode, path = '/') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="*" element={<>{node}</>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('agency schemas', () => {
  it('agencySchema accepts valid input', () => {
    expect(
      agencySchema.safeParse({
        ...defaultAgencyValues,
        agencyId: 'AGY-001',
        name: 'Test',
        contactEmail: 'a@b.com',
      }).success
    ).toBe(true);
  });

  it('agencySchema rejects lowercase agencyId', () => {
    expect(
      agencySchema.safeParse({
        ...defaultAgencyValues,
        agencyId: 'agy-001',
        name: 'Test',
        contactEmail: 'a@b.com',
      }).success
    ).toBe(false);
  });

  it('contractSchema rejects usersLimit < 1', () => {
    expect(contractSchema.safeParse({ ...defaultContractValues, usersLimit: 0 }).success).toBe(
      false
    );
  });
});

describe('AddAgenciesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders Add Agency form', () => {
    ui(<AddAgenciesPage />);
    expect(screen.getByText('Add Agency')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /agency id/i })).toBeInTheDocument();
  });
});

describe('EditAgencyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('shows empty state when no agencyId', () => {
    ui(<EditAgencyPage />);
    expect(screen.getByText(/no agency selected/i)).toBeInTheDocument();
  });
  it('renders edit form when loaded', async () => {
    mockGet({
      id: 'A-1',
      agencyId: 'AGY-001',
      name: 'Springfield PD',
      contactEmail: 's@p.com',
      contactPhone: '+1',
      region: 'North',
      active: true,
    });
    ui(<EditAgencyPage />, '/?agencyId=AGY-001');
    await waitFor(() => {
      expect(screen.getByText(/edit agency: springfield pd/i)).toBeInTheDocument();
    });
  });
});

describe('AgencySettingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders settings form', () => {
    ui(<AgencySettingPage />);
    expect(screen.getByText('Agency Settings')).toBeInTheDocument();
    expect(screen.getByLabelText(/auto-approve/i)).toBeInTheDocument();
  });
});

describe('ContractManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders contract form', () => {
    ui(<ContractManagementPage />);
    expect(screen.getByText('Contract Management')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /contract id/i })).toBeInTheDocument();
  });
  it('shows required errors on empty submit', async () => {
    ui(<ContractManagementPage />);
    fireEvent.submit(screen.getByRole('form', { name: /contract management form/i }));
    expect(await screen.findByText(/contract id is required/i)).toBeInTheDocument();
  });
});

describe('ManageSharingAgenciesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders rows on success', async () => {
    mockGet({
      items: [
        {
          agencyId: 'AGY-001',
          name: 'A1',
          sharingEnabled: true,
          lastSyncAt: '2026-06-01T00:00:00Z',
        },
        {
          agencyId: 'AGY-002',
          name: 'A2',
          sharingEnabled: false,
          lastSyncAt: '2026-06-02T00:00:00Z',
        },
      ],
    });
    ui(<ManageSharingAgenciesPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('sharing-agency-row')).toHaveLength(2);
    });
  });
});
