import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { CompareDialog } from '../CompareDialog';
import { ExportDialog } from '../ExportDialog';
import { mantineTheme } from '@/theme/mantineTheme';
import { api } from '@/api/client';
import type { SearchEventItem } from '../types';

vi.mock('@/api/client', () => ({ api: { post: vi.fn() } }));
vi.mock('@/components/modal', async () => {
  const actual = await vi.importActual<typeof import('@/components/modal')>('@/components/modal');
  return {
    ...actual,
    messageBox: {
      success: vi.fn().mockResolvedValue(undefined),
      error: vi.fn().mockResolvedValue(undefined),
      alert: vi.fn().mockResolvedValue(undefined),
      info: vi.fn().mockResolvedValue(undefined),
      warn: vi.fn().mockResolvedValue(undefined),
    },
  };
});

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

const twoItems: SearchEventItem[] = [
  {
    eventId: 'EV-1',
    caseNumber: 'W1',
    score: 90,
    site: 'A',
    user: 'u1',
    eventDate: '2026-06-01T00:00:00Z',
    type: 'CC',
  },
  {
    eventId: 'EV-2',
    caseNumber: 'W2',
    score: 80,
    site: 'B',
    user: 'u2',
    eventDate: '2026-06-02T00:00:00Z',
    type: 'BC',
  },
];

describe('CompareDialog', () => {
  it('shows hint when fewer than 2 selected', () => {
    render(ui(<CompareDialog opened items={[]} onClose={() => {}} />));
    expect(screen.getByText(/select exactly 2/i)).toBeInTheDocument();
  });

  it('renders two compare panels when exactly 2 items', () => {
    render(ui(<CompareDialog opened items={twoItems} onClose={() => {}} />));
    expect(screen.getAllByTestId('compare-side')).toHaveLength(2);
    expect(screen.getByText('EV-1')).toBeInTheDocument();
    expect(screen.getByText('EV-2')).toBeInTheDocument();
  });

  it('Close button fires onClose', () => {
    const onClose = vi.fn();
    render(ui(<CompareDialog opened items={twoItems} onClose={onClose} />));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('ExportDialog', () => {
  it('shows correct record count', () => {
    render(ui(<ExportDialog opened ids={['a', 'b', 'c']} onClose={() => {}} />));
    expect(screen.getByText(/Exporting 3 records/i)).toBeInTheDocument();
  });

  it('renders Excel + PDF format radios', () => {
    render(ui(<ExportDialog opened ids={['a']} onClose={() => {}} />));
    expect(screen.getByLabelText(/Excel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PDF/i)).toBeInTheDocument();
  });

  it('submit calls api + onClose on success', async () => {
    (api.post as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      json: <T,>(): Promise<T> =>
        Promise.resolve({ jobId: 'EXP-1', format: 'excel', count: 1 } as T),
    });
    const onClose = vi.fn();
    render(ui(<ExportDialog opened ids={['a']} onClose={onClose} />));
    fireEvent.click(screen.getByRole('button', { name: /submit export/i }));
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
