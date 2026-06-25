import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MapItPotentialPage from '../MapItPotentialPage';
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

function renderAt(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/app/mapit-potential" element={<MapItPotentialPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('MapItPotentialPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows empty state when no potentialId', () => {
    renderAt('/app/mapit-potential');
    expect(screen.getByText(/no potential link selected/i)).toBeInTheDocument();
  });

  it('renders single marker on success', async () => {
    mockApi({
      id: 'PL-1',
      caseNumber: 'CASE-PL-1',
      lat: 34,
      lng: -118,
      occurredAt: '2026-04-12T08:30:00Z',
    });
    renderAt('/app/mapit-potential?potentialId=PL-1');
    await waitFor(() => {
      expect(screen.getByTestId('map-marker')).toBeInTheDocument();
    });
    expect(screen.getByText(/CASE-PL-1/i)).toBeInTheDocument();
  });
});
