import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { mantineTheme } from '@/theme/mantineTheme';
import enCommon from '../../../../public/locales/en/common.json';
import enSearchAPL from '../../../../public/locales/en/searchAPL.json';

// Mock api/client to short-circuit network
vi.mock('@/api/client', () => ({
  api: {
    post: vi.fn(() => ({
      json: vi.fn().mockResolvedValue({
        items: [
          {
            apl_ID: '1000001',
            assessor: 'Anh Pham',
            caseIncident: 'W101001',
            cartridgeCase: '9MM-1',
            type: 'PL',
            createdDateTime: '2026-01-15T08:30:00Z',
            reportStatus: 'Pending',
          },
          {
            apl_ID: '1000002',
            assessor: 'Jane Doe',
            caseIncident: 'W101002',
            cartridgeCase: '9MM-2',
            type: 'CSA',
            createdDateTime: '2026-02-20T14:45:00Z',
            reportStatus: 'Closed',
          },
        ],
        total: 2,
        page: 1,
        pageSize: 25,
      }),
    })),
  },
}));

import SearchAPLPage from '../SearchAPLPage';

const testI18n = i18n.createInstance();
void testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'searchAPL'],
  defaultNS: 'common',
  resources: {
    en: { common: enCommon, searchAPL: enSearchAPL },
  },
  interpolation: { escapeValue: false },
});

function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <I18nextProvider i18n={testI18n}>
            <SearchAPLPage />
          </I18nextProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('SearchAPLPage (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title + filter shell', () => {
    renderPage();
    expect(screen.getAllByText(/APL Reports/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId('search-apl-filter')).toBeInTheDocument();
  });

  it('shows results table after Search submitted', async () => {
    renderPage();
    const form = screen.getByTestId('search-apl-filter');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('1000001')).toBeInTheDocument();
    });
    expect(screen.getByText('1000002')).toBeInTheDocument();
    expect(screen.getByText(/2 records?/i)).toBeInTheDocument();
  });

  it('shows pagination control after results', async () => {
    renderPage();
    const form = screen.getByTestId('search-apl-filter');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  it('shows BIQLoadingOverlay with Cancel while fetching; clicking Cancel hides it', async () => {
    const { api } = await import('@/api/client');
    const apiMock = api.post as ReturnType<typeof vi.fn>;
    // Replace the instant-resolve mock with a pending promise so isFetching
    // stays true long enough for the assertions / interaction.
    apiMock.mockImplementationOnce(() => ({
      json: vi.fn(() => new Promise(() => {})),
    }));

    renderPage();
    const form = screen.getByTestId('search-apl-filter');
    fireEvent.submit(form);

    const cancelBtn = await screen.findByTestId('biq-loading-overlay-cancel');
    expect(screen.getByTestId('biq-loading-overlay')).toBeInTheDocument();

    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('biq-loading-overlay')).not.toBeInTheDocument();
    });
  });
});
