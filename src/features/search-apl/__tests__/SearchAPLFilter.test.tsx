import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SearchAPLFilter } from '../SearchAPLFilter';
import { mantineTheme } from '@/theme/mantineTheme';
import enCommon from '../../../../public/locales/en/common.json';
import enSearchAPL from '../../../../public/locales/en/searchAPL.json';

const testI18n = i18n.createInstance();
void testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'searchAPL'],
  defaultNS: 'common',
  resources: {
    en: { common: enCommon, searchAPL: enSearchAPL },
  },
  interpolation: { escapeValue: false },
});

function renderFilter(onSubmit = vi.fn()) {
  render(
    <MantineProvider theme={mantineTheme}>
      <I18nextProvider i18n={testI18n}>
        <SearchAPLFilter onSubmit={onSubmit} />
      </I18nextProvider>
    </MantineProvider>
  );
  return { onSubmit };
}

describe('SearchAPLFilter', () => {
  it('renders all filter fields', () => {
    renderFilter();
    expect(screen.getByLabelText(/APL ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Case\/Incident/i)).toBeInTheDocument();
    expect(screen.getByText(/Report Status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('renders 3 report status checkboxes', () => {
    renderFilter();
    expect(screen.getByLabelText('Pending')).toBeInTheDocument();
    expect(screen.getByLabelText('In Process')).toBeInTheDocument();
    expect(screen.getByLabelText('Closed')).toBeInTheDocument();
  });

  it('calls onSubmit when form submitted (empty form is valid)', async () => {
    const { onSubmit } = renderFilter();
    const form = screen.getByTestId('search-apl-filter');
    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled(), { timeout: 2000 });
  });

  it('initial reportStatus is empty array', async () => {
    const { onSubmit } = renderFilter();
    const form = screen.getByTestId('search-apl-filter');
    fireEvent.submit(form);

    await waitFor(() => expect(onSubmit).toHaveBeenCalled(), { timeout: 2000 });
    const submitted = onSubmit.mock.calls[0]?.[0] as { reportStatus?: string[] };
    // Default value from defaultValues — explicitly empty array
    expect(submitted.reportStatus ?? []).toEqual([]);
  });

  it('has form testid for integration tests', () => {
    renderFilter();
    expect(screen.getByTestId('search-apl-filter')).toBeInTheDocument();
  });
});
