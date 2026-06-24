import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SearchAPLResults } from '../SearchAPLResults';
import { mantineTheme } from '@/theme/mantineTheme';
import type { APLItem } from '@/api/apl';
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

const sample: APLItem[] = [
  {
    apl_ID: '1000001',
    assessor: 'Anh Pham',
    caseIncident: 'W101001',
    cartridgeCase: '9MM-1',
    type: 'PL',
    createdDateTime: '2026-01-15T08:30:00Z',
    reportStatus: 'Pending',
  },
  {
    apl_ID: '1000002',
    assessor: 'AM Tran Ngoc Vu',
    caseIncident: 'W101002',
    cartridgeCase: '9MM-2',
    type: 'CSA',
    createdDateTime: '2026-02-20T14:45:00Z',
    reportStatus: 'In Process',
  },
  {
    apl_ID: '1000003',
    assessor: 'Jane Doe',
    caseIncident: 'W101003',
    cartridgeCase: '9MM-3',
    type: 'QA',
    createdDateTime: '2026-03-10T09:15:00Z',
    reportStatus: 'Closed',
  },
];

function renderResults(items: APLItem[] = sample, isLoading = false) {
  return render(
    <MantineProvider theme={mantineTheme}>
      <I18nextProvider i18n={testI18n}>
        <SearchAPLResults items={items} isLoading={isLoading} />
      </I18nextProvider>
    </MantineProvider>
  );
}

describe('SearchAPLResults', () => {
  it('renders 7 columns', () => {
    renderResults();
    expect(screen.getByText('APL ID')).toBeInTheDocument();
    expect(screen.getByText('Assessor')).toBeInTheDocument();
    expect(screen.getByText('Case/Incident')).toBeInTheDocument();
    expect(screen.getByText('Cartridge Case')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Created Date/Time')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders 3 data rows with APL IDs', () => {
    renderResults();
    expect(screen.getByText('1000001')).toBeInTheDocument();
    expect(screen.getByText('1000002')).toBeInTheDocument();
    expect(screen.getByText('1000003')).toBeInTheDocument();
  });

  it('renders status badges with text', () => {
    renderResults();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Process')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('formats ISO datetime to YYYY-MM-DD HH:mm', () => {
    renderResults();
    // 2026-01-15T08:30:00Z formatted in local timezone — just ensure date portion present
    expect(screen.getByText(/2026-01-15/)).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    renderResults([]);
    expect(screen.getByTestId('data-table-empty')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderResults([], true);
    expect(screen.getByTestId('data-table-loading')).toBeInTheDocument();
  });
});
