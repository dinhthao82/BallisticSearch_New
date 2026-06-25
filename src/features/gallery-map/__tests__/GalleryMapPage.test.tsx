import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import GalleryMapPage from '../GalleryMapPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';

vi.mock('@/api/client', () => ({ api: { get: vi.fn() } }));
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

describe('GalleryMapPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders markers + gallery cards', async () => {
    mockGet({
      items: [
        {
          galleryId: 'GAL-001',
          name: 'North',
          lat: 47,
          lng: -122,
          imageThumbnails: ['s3://1', 's3://2'],
          itemCount: 1000,
        },
        {
          galleryId: 'GAL-002',
          name: 'South',
          lat: 29,
          lng: -95,
          imageThumbnails: [],
          itemCount: 500,
        },
      ],
    });
    ui(<GalleryMapPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('map-marker')).toHaveLength(2);
      expect(screen.getAllByTestId('gallery-map-card')).toHaveLength(2);
    });
    // First card has 2 thumbnails
    expect(screen.getAllByTestId('gallery-thumbnail')).toHaveLength(2);
  });
});
