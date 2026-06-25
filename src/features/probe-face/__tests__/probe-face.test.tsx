import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProbeMatchesInfoPage from '../ProbeMatchesInfoPage';
import SearchFaceInfoPage from '../SearchFaceInfoPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';

vi.mock('@/api/client', () => ({ api: { get: vi.fn() } }));

function mockGet(r: unknown) {
  (api.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => Promise.resolve(r as T),
  });
}

function ui(node: React.ReactNode, path = '/') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
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

describe('ProbeMatchesInfoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('empty state when no probeId', () => {
    ui(<ProbeMatchesInfoPage />);
    expect(screen.getByText(/no probe selected/i)).toBeInTheDocument();
  });
  it('renders match rows on success', async () => {
    mockGet({
      probeId: 'P-1',
      caseNumber: 'W1',
      topScore: 88,
      matches: [
        { id: 'M-1', score: 88, resource: 'Gallery X' },
        { id: 'M-2', score: 72, resource: 'Gallery Y' },
      ],
    });
    ui(<ProbeMatchesInfoPage />, '/?probeId=P-1');
    await waitFor(() => {
      expect(screen.getAllByTestId('probe-match-row')).toHaveLength(2);
    });
  });
});

describe('SearchFaceInfoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('empty state when no searchId', () => {
    ui(<SearchFaceInfoPage />);
    expect(screen.getByText(/no face search selected/i)).toBeInTheDocument();
  });
  it('renders candidate cards on success', async () => {
    mockGet({
      searchId: 'F-1',
      caseNumber: 'W1',
      threshold: 70,
      candidates: [
        { id: 'F-1', faceScore: 88, demographics: 'M / 30s' },
        { id: 'F-2', faceScore: 75, demographics: 'F / 25s' },
      ],
    });
    ui(<SearchFaceInfoPage />, '/?searchId=F-1');
    await waitFor(() => {
      expect(screen.getAllByTestId('face-candidate-card')).toHaveLength(2);
    });
  });
});
