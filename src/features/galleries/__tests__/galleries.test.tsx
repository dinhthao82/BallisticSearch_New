import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SearchGalleriesPage from '../GalleryListPage';
import EditGalleryPage from '../EditGalleryPage';
import ViewDetailsPage from '../ViewDetailsPage';
import SearchCSAUploadedPage from '../SearchCSAUploadedPage';
import DetectionInfoPage from '../DetectionInfoPage';
import SummaryPotentialLinksPage from '../SummaryPotentialLinksPage';
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

describe('SearchGalleriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders title + rows', async () => {
    mockGet({
      items: [
        {
          id: 'G-1',
          galleryName: 'G1',
          caseNumber: 'W1',
          itemCount: 5,
          status: 'Active',
          updatedAt: '2026-06-01T00:00:00Z',
        },
      ],
      total: 1,
    });
    ui(<SearchGalleriesPage />);
    expect(screen.getByText('Search Galleries')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('G-1')).toBeInTheDocument();
    });
  });
});

describe('EditGalleryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('empty state when no galleryId', () => {
    ui(<EditGalleryPage />);
    expect(screen.getByText(/no gallery selected/i)).toBeInTheDocument();
  });
  it('renders gallery details when loaded', async () => {
    mockGet({
      id: 'G-1',
      galleryName: 'G1',
      caseNumber: 'W1',
      itemCount: 5,
      status: 'Active',
      updatedAt: '2026-06-01T00:00:00Z',
    });
    ui(<EditGalleryPage />, '/?galleryId=G-1');
    await waitFor(() => {
      expect(screen.getByText(/edit gallery: g1/i)).toBeInTheDocument();
    });
  });
});

describe('ViewDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders detection details', async () => {
    mockGet({
      id: 'DET-1',
      caseNumber: 'W1',
      detectionType: 'Cartridge case',
      score: 88,
      detectedAt: '2026-06-01T00:00:00Z',
      notes: 'High match',
    });
    ui(<ViewDetailsPage />, '/?detectionId=DET-1');
    await waitFor(() => {
      expect(screen.getByText(/view details: det-1/i)).toBeInTheDocument();
      expect(screen.getByText(/Cartridge case/i)).toBeInTheDocument();
    });
  });
});

describe('SearchCSAUploadedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders rows + status badge', async () => {
    mockGet({
      items: [
        {
          id: 'CSAU-1',
          caseNumber: 'W1',
          uploadedBy: 'jdoe',
          uploadedAt: '2026-06-01T00:00:00Z',
          status: 'Processed',
          itemCount: 5,
        },
      ],
      total: 1,
    });
    ui(<SearchCSAUploadedPage />);
    await waitFor(() => {
      expect(screen.getByText('CSAU-1')).toBeInTheDocument();
      expect(screen.getByText('Processed')).toBeInTheDocument();
    });
  });
});

describe('DetectionInfoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders detection info badges', async () => {
    mockGet({
      id: 'DET-1',
      caseNumber: 'W1',
      detectionType: 'Bullet',
      score: 75,
      detectedAt: '2026-06-01T00:00:00Z',
      notes: 'Test',
    });
    ui(<DetectionInfoPage />, '/?detectionId=DET-1');
    await waitFor(() => {
      expect(screen.getByText('Bullet')).toBeInTheDocument();
      expect(screen.getByText(/score 75/i)).toBeInTheDocument();
    });
  });
});

describe('SummaryPotentialLinksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders matched-item cards', async () => {
    mockGet({
      potentialId: 'PL-1',
      caseNumber: 'W1',
      matchScore: 85,
      matchedItems: [
        { id: 'IT-1', label: 'Item 1' },
        { id: 'IT-2', label: 'Item 2' },
      ],
      notes: 'Match notes',
    });
    ui(<SummaryPotentialLinksPage />, '/?potentialId=PL-1');
    await waitFor(() => {
      expect(screen.getAllByTestId('potential-link-item')).toHaveLength(2);
    });
  });
});
