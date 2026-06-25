import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BIQLocationFilter, type LocationValue } from '../BIQLocationFilter';
import { mantineTheme } from '@/theme/mantineTheme';

vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn((url: string) => {
      // Return a json() promise per URL pattern
      const data = url.startsWith('location/countries')
        ? [
            { code: 'US', name: 'United States' },
            { code: 'CA', name: 'Canada' },
          ]
        : url.startsWith('location/states')
          ? [
              { code: 'CA', name: 'California' },
              { code: 'NY', name: 'New York' },
            ]
          : url.startsWith('location/cities')
            ? [{ code: 'San Francisco', name: 'San Francisco' }]
            : [];
      return {
        json: vi.fn().mockResolvedValue(data),
      };
    }),
  },
}));

function ui(node: React.ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return (
    <MantineProvider theme={mantineTheme}>
      <QueryClientProvider client={qc}>{node}</QueryClientProvider>
    </MantineProvider>
  );
}

describe('BIQLocationFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 3 selects, with state + city disabled until upstream selected', async () => {
    render(ui(<BIQLocationFilter />));
    const country = await screen.findByTestId('biq-location-country');
    const state = screen.getByTestId('biq-location-state');
    const city = screen.getByTestId('biq-location-city');
    expect(country).toBeInTheDocument();
    expect(state).toBeDisabled();
    expect(city).toBeDisabled();
  });

  it('loads countries from API on mount', async () => {
    render(ui(<BIQLocationFilter />));
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
    });
  });

  it('selecting a country fires onChange and clears downstream values', async () => {
    const onChange = vi.fn<[LocationValue], void>();
    render(
      ui(
        <BIQLocationFilter
          value={{ country: null, state: 'OLD_STATE', city: 'OLD_CITY' }}
          onChange={onChange}
        />
      )
    );
    // Wait for the countries query to populate options before firing change
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
    });
    const country = screen.getByTestId('biq-location-country') as HTMLSelectElement;
    fireEvent.change(country, { target: { value: 'US' } });
    expect(onChange).toHaveBeenLastCalledWith({ country: 'US', state: null, city: null });
  });

  it('selecting a state preserves country and clears city', async () => {
    const onChange = vi.fn<[LocationValue], void>();
    render(
      ui(
        <BIQLocationFilter
          value={{ country: 'US', state: null, city: 'STALE_CITY' }}
          onChange={onChange}
        />
      )
    );
    await screen.findByTestId('biq-location-country');
    // Wait for states query to populate, then change state
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'California' })).toBeInTheDocument();
    });
    const state = screen.getByTestId('biq-location-state') as HTMLSelectElement;
    fireEvent.change(state, { target: { value: 'CA' } });
    expect(onChange).toHaveBeenLastCalledWith({ country: 'US', state: 'CA', city: null });
  });

  it('renders label when provided', async () => {
    render(ui(<BIQLocationFilter label="Location" />));
    expect(screen.getByText('Location')).toBeInTheDocument();
  });
});
