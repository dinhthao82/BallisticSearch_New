import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import QuickSearchPage from '../QuickSearchPage';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';

vi.mock('@/api/client', () => ({ api: { get: vi.fn(), post: vi.fn() } }));

function mockPost(r: unknown) {
  (api.post as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    json: <T,>(): Promise<T> => Promise.resolve(r as T),
  });
}

function ui(node: React.ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <MemoryRouter>{node}</MemoryRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}

describe('QuickSearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title + filter form + 4 view tabs (after search)', async () => {
    mockPost({
      items: [
        { id: 'QS-1', caseNumber: 'W1', score: 88, type: 'BC' },
        { id: 'QS-2', caseNumber: 'W2', score: 72, type: 'CC' },
      ],
      total: 2,
    });
    ui(<QuickSearchPage />);
    expect(screen.getByText('Quick Search')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /caliber/i })).toBeInTheDocument();

    // Submit search
    fireEvent.submit(screen.getByRole('form', { name: /quick search filter/i }));

    await waitFor(() => {
      expect(screen.getByText(/2 results/i)).toBeInTheDocument();
    });

    // 4 view tabs visible
    expect(screen.getByRole('tab', { name: /grid/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /list/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /table/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /compare/i })).toBeInTheDocument();
  });
});
