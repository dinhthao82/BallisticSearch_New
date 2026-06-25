import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import { LoadingOverlay, EmptyState, ErrorState } from '../index';
import { mantineTheme } from '@/theme/mantineTheme';

const testI18n = i18next.createInstance();
void testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: {} } },
  interpolation: { escapeValue: false },
});

function renderWithMantine(ui: React.ReactNode) {
  return render(
    <MantineProvider theme={mantineTheme}>
      <I18nextProvider i18n={testI18n}>{ui}</I18nextProvider>
    </MantineProvider>
  );
}

describe('LoadingOverlay (back-compat alias for BIQLoadingOverlay)', () => {
  it('renders when visible', () => {
    renderWithMantine(<LoadingOverlay visible message="Searching..." />);
    expect(screen.getByTestId('biq-loading-overlay')).toBeInTheDocument();
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders default message', () => {
    renderWithMantine(<EmptyState />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders custom message + hint', () => {
    renderWithMantine(<EmptyState message="Nothing found" hint="Try different filters" />);
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
    expect(screen.getByText('Try different filters')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('renders message + detail', () => {
    renderWithMantine(<ErrorState message="Failed" detail="Network error" />);
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows Retry button when onRetry passed', () => {
    const onRetry = vi.fn();
    renderWithMantine(<ErrorState onRetry={onRetry} />);
    const btn = screen.getByRole('button', { name: /retry|next/i });
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('hides Retry button when no onRetry', () => {
    renderWithMantine(<ErrorState />);
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
  });
});
