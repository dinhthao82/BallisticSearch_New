import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MapOfAgenciesPage from '../MapOfAgenciesPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';

vi.mock('@/api/client', () => ({ api: { get: vi.fn() } }));

// Stub the map renderer so happy-dom doesn't have to boot Leaflet
vi.mock('@/components/map', () => ({
  BIQMap: ({ markers, ariaLabel }: { markers: { id: string }[]; ariaLabel?: string }) => (
    <div role="region" aria-label={ariaLabel ?? 'Map'} data-testid="biq-map-stub">
      {markers.map((m) => (
        <div key={m.id} data-testid="map-marker">
          {m.id}
        </div>
      ))}
    </div>
  ),
}));

function mockApi(response: unknown | Error) {
  const get = api.get as unknown as ReturnType<typeof vi.fn>;
  get.mockReturnValue({
    json: <T,>(): Promise<T> => {
      if (response instanceof Error) return Promise.reject(response);
      return Promise.resolve(response as T);
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

describe('MapOfAgenciesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders markers on success', async () => {
    mockApi({
      items: [
        { id: 'AG-001', name: 'A', lat: 1, lng: 2, address: 'x' },
        { id: 'AG-002', name: 'B', lat: 3, lng: 4, address: 'y' },
      ],
    });
    render(ui(<MapOfAgenciesPage />));
    await waitFor(() => {
      expect(screen.getAllByTestId('map-marker')).toHaveLength(2);
    });
    expect(screen.getByText(/2 agency locations plotted/i)).toBeInTheDocument();
  });

  it('shows error state on failure', async () => {
    mockApi(new Error('boom'));
    render(ui(<MapOfAgenciesPage />));
    await waitFor(() => {
      expect(screen.getByText(/failed to load agencies/i)).toBeInTheDocument();
    });
  });
});
