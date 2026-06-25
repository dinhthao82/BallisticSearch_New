import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FilterShowcase from '../FilterShowcase';
import { mantineTheme } from '@/theme/mantineTheme';

// Stub the location API the same way BIQLocationFilter.test does
vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn((url: string) => ({
      json: vi
        .fn()
        .mockResolvedValue(
          url.startsWith('location/countries')
            ? [{ code: 'US', name: 'United States' }]
            : url.startsWith('location/states')
              ? [{ code: 'CA', name: 'California' }]
              : []
        ),
    })),
  },
}));

function renderShowcase() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>
        <FilterShowcase />
      </QueryClientProvider>
    </MantineProvider>
  );
}

// Plan §49: 9 scenarios = 3 filters × {renders, onChange fires, reset works}
describe('Filter showcase — 9 scenarios', () => {
  // ─── BIQDateRangeFilter ────────────────────────────────────────────
  describe('BIQDateRangeFilter', () => {
    it('renders inside the showcase', () => {
      renderShowcase();
      expect(screen.getByTestId('biq-daterange-filter')).toBeInTheDocument();
    });

    it('onChange fires when Today quick-option clicked (state updates)', () => {
      renderShowcase();
      fireEvent.click(screen.getByTestId('biq-daterange-quick-today'));
      const state = screen.getByTestId('filter-showcase-state').textContent ?? '';
      expect(state).toMatch(/"from":\s*"\d{4}-\d{2}-\d{2}"/);
    });

    it('reset clears dateRange back to null/null', () => {
      renderShowcase();
      fireEvent.click(screen.getByTestId('biq-daterange-quick-today'));
      fireEvent.click(screen.getByTestId('filter-showcase-reset'));
      const state = screen.getByTestId('filter-showcase-state').textContent ?? '';
      expect(state).toContain('"dateRange": {\n    "from": null,\n    "to": null\n  }');
    });
  });

  // ─── BIQLocationFilter ─────────────────────────────────────────────
  describe('BIQLocationFilter', () => {
    it('renders inside the showcase', () => {
      renderShowcase();
      expect(screen.getByTestId('biq-location-filter')).toBeInTheDocument();
    });

    it('onChange fires when country select changes (state updates)', async () => {
      renderShowcase();
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
      });
      const country = screen.getByTestId('biq-location-country') as HTMLSelectElement;
      fireEvent.change(country, { target: { value: 'US' } });
      const state = screen.getByTestId('filter-showcase-state').textContent ?? '';
      expect(state).toMatch(/"country":\s*"US"/);
    });

    it('reset clears location back to all nulls', async () => {
      renderShowcase();
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
      });
      const country = screen.getByTestId('biq-location-country') as HTMLSelectElement;
      fireEvent.change(country, { target: { value: 'US' } });
      fireEvent.click(screen.getByTestId('filter-showcase-reset'));
      const state = screen.getByTestId('filter-showcase-state').textContent ?? '';
      expect(state).toContain('"country": null');
      expect(state).toContain('"state": null');
      expect(state).toContain('"city": null');
    });
  });

  // ─── BIQCaseFilter ─────────────────────────────────────────────────
  describe('BIQCaseFilter', () => {
    it('renders inside the showcase', () => {
      renderShowcase();
      expect(screen.getByTestId('biq-case-filter')).toBeInTheDocument();
    });

    it('onChange fires when user types (state updates)', () => {
      renderShowcase();
      const ta = screen.getByLabelText(/Case \/ Incident #/i);
      fireEvent.change(ta, { target: { value: 'A1, B-2' } });
      const state = screen.getByTestId('filter-showcase-state').textContent ?? '';
      expect(state).toMatch(/"cases":\s*"A1, B-2"/);
    });

    it('reset clears cases back to empty string', () => {
      renderShowcase();
      const ta = screen.getByLabelText(/Case \/ Incident #/i);
      fireEvent.change(ta, { target: { value: 'A1, B-2' } });
      fireEvent.click(screen.getByTestId('filter-showcase-reset'));
      const state = screen.getByTestId('filter-showcase-state').textContent ?? '';
      expect(state).toMatch(/"cases":\s*""/);
    });
  });
});
