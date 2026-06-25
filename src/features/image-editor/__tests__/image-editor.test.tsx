import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PreviewAnalysisPage from '../PreviewAnalysisPage';
import ImageComparePage from '../ImageComparePage';
import Image2DComparePage from '../Image2DComparePage';
import ImageStandardizePage from '../ImageStandardizePage';
import { BIQCanvas } from '@/components/canvas';
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

describe('BIQCanvas', () => {
  it('renders a canvas element w/ aria-label', () => {
    render(<BIQCanvas width={100} height={50} ariaLabel="Test canvas" />);
    expect(screen.getByRole('img', { name: /test canvas/i })).toBeInTheDocument();
    expect(screen.getByTestId('biq-canvas')).toBeInTheDocument();
  });
});

describe('PreviewAnalysisPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('empty state when no caseNumber', () => {
    ui(<PreviewAnalysisPage />);
    expect(screen.getByText(/no case number provided/i)).toBeInTheDocument();
  });
  it('renders analysis rows on success', async () => {
    mockGet({
      caseNumber: 'W-1',
      items: [
        { id: 'IT-1', caseNumber: 'W-1', type: 'BC', thumbnail: '', notes: 'A' },
        { id: 'IT-2', caseNumber: 'W-1', type: 'CC', thumbnail: '', notes: 'B' },
      ],
    });
    ui(<PreviewAnalysisPage />, '/?caseNumber=W-1');
    await waitFor(() => {
      expect(screen.getAllByTestId('analysis-row')).toHaveLength(2);
    });
  });
});

describe('ImageComparePage', () => {
  it('empty state without caseNumber', () => {
    ui(<ImageComparePage />);
    expect(screen.getByText(/no case number/i)).toBeInTheDocument();
  });
  it('renders 2 canvases when caseNumber given', () => {
    ui(<ImageComparePage />, '/?caseNumber=W-1');
    expect(screen.getAllByTestId('biq-canvas')).toHaveLength(2);
  });
});

describe('Image2DComparePage', () => {
  it('renders canvas + zoom/rotation controls', () => {
    ui(<Image2DComparePage />, '/?caseNumber=W-1');
    expect(screen.getByTestId('biq-canvas')).toBeInTheDocument();
    expect(screen.getByLabelText(/zoom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rotation/i)).toBeInTheDocument();
  });
});

describe('ImageStandardizePage', () => {
  it('renders canvas + 3 toggle switches', () => {
    ui(<ImageStandardizePage />, '/?caseNumber=W-1');
    expect(screen.getByTestId('biq-canvas')).toBeInTheDocument();
    expect(screen.getByLabelText(/auto-contrast/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/auto-crop/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/denoise/i)).toBeInTheDocument();
  });
});
