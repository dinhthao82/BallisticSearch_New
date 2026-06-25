import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { SearchEventResults } from '../SearchEventResults';
import { mantineTheme } from '@/theme/mantineTheme';
import type { SearchEventItem } from '../types';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

const sample: SearchEventItem[] = [
  {
    eventId: 'EV-1',
    caseNumber: 'W1',
    score: 92.5,
    site: 'Site A',
    user: 'jdoe',
    eventDate: '2026-06-01T10:00:00Z',
    type: 'CC',
  },
  {
    eventId: 'EV-2',
    caseNumber: 'W2',
    score: 72.0,
    site: 'Site B',
    user: 'asmith',
    eventDate: '2026-06-02T11:00:00Z',
    type: 'BC',
  },
  {
    eventId: 'EV-3',
    caseNumber: 'W3',
    score: 55.0,
    site: 'Site C',
    user: 'rjones',
    eventDate: '2026-06-03T12:00:00Z',
    type: 'PL',
  },
];

describe('SearchEventResults', () => {
  it('renders empty message when no items', () => {
    const onToggle = vi.fn();
    render(ui(<SearchEventResults items={[]} selected={new Set()} onToggleSelect={onToggle} />));
    expect(screen.getByText(/no events match/i)).toBeInTheDocument();
  });

  it('renders one row per item', () => {
    const onToggle = vi.fn();
    render(
      ui(<SearchEventResults items={sample} selected={new Set()} onToggleSelect={onToggle} />)
    );
    expect(screen.getAllByTestId('event-row')).toHaveLength(3);
  });

  it('renders aria-labeled checkbox per row', () => {
    const onToggle = vi.fn();
    render(
      ui(<SearchEventResults items={sample} selected={new Set()} onToggleSelect={onToggle} />)
    );
    expect(screen.getByLabelText(/Select event EV-1 for compare/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select event EV-2 for compare/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select event EV-3 for compare/i)).toBeInTheDocument();
    // Real toggle interaction is exercised via Playwright E2E (Mantine Checkbox
    // onChange doesn't fire reliably under happy-dom for native click events).
  });

  it('disables unchecked checkboxes once 2 are selected', () => {
    const onToggle = vi.fn();
    render(
      ui(
        <SearchEventResults
          items={sample}
          selected={new Set(['EV-1', 'EV-2'])}
          onToggleSelect={onToggle}
        />
      )
    );
    const third = screen.getByLabelText(/Select event EV-3 for compare/i) as HTMLInputElement;
    expect(third).toBeDisabled();
    // Selected ones stay enabled (so user can uncheck)
    const first = screen.getByLabelText(/Select event EV-1 for compare/i) as HTMLInputElement;
    expect(first).not.toBeDisabled();
  });
});
