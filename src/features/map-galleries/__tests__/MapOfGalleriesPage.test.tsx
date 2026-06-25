import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MapOfGalleriesPage from '../MapOfGalleriesPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';

vi.mock('@/api/client', () => ({ api: { get: vi.fn() } }));
vi.mock('@/components/map', () => ({
  BIQMap: ({ markers }: { markers: { id: string }[] }) => (
    <div data-testid="biq-map-stub">
      {markers.map((m) => (
        <div key={m.id} data-testid="map-marker">
          {m.id}
        </div>
      ))}
    </div>
  ),
}));

function mockApi(response: unknown) {
  (api.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => Promise.resolve(response as T),
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

describe('MapOfGalleriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders galleries on success', async () => {
    mockApi({
      items: [
        { id: 'GAL-1', name: 'N', lat: 1, lng: 2, count: 100 },
        { id: 'GAL-2', name: 'S', lat: 3, lng: 4, count: 200 },
        { id: 'GAL-3', name: 'E', lat: 5, lng: 6, count: 300 },
      ],
    });
    render(ui(<MapOfGalleriesPage />));
    await waitFor(() => {
      expect(screen.getAllByTestId('map-marker')).toHaveLength(3);
    });
    expect(screen.getByText(/3 galleries plotted/i)).toBeInTheDocument();
  });
});
