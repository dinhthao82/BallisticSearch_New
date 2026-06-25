import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { BIQLoadingOverlay } from '../BIQLoadingOverlay';
import { mantineTheme } from '@/theme/mantineTheme';

const testI18n = i18n.createInstance();
void testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: {} } },
  interpolation: { escapeValue: false },
});

function ui(node: React.ReactNode) {
  return (
    <MantineProvider theme={mantineTheme}>
      <I18nextProvider i18n={testI18n}>{node}</I18nextProvider>
    </MantineProvider>
  );
}

describe('BIQLoadingOverlay', () => {
  it('renders nothing when visible=false', () => {
    render(ui(<BIQLoadingOverlay visible={false} />));
    expect(screen.queryByTestId('biq-loading-overlay')).not.toBeInTheDocument();
  });

  it('renders overlay when visible=true', () => {
    render(ui(<BIQLoadingOverlay visible />));
    expect(screen.getByTestId('biq-loading-overlay')).toBeInTheDocument();
  });

  it('shows fallback message when message prop omitted', () => {
    render(ui(<BIQLoadingOverlay visible />));
    expect(screen.getByText(/please wait/i)).toBeInTheDocument();
  });

  it('shows custom message when provided', () => {
    render(ui(<BIQLoadingOverlay visible message="Searching APL…" />));
    expect(screen.getByText('Searching APL…')).toBeInTheDocument();
  });

  it('does NOT render cancel button when onCancel omitted', () => {
    render(ui(<BIQLoadingOverlay visible />));
    expect(screen.queryByTestId('biq-loading-overlay-cancel')).not.toBeInTheDocument();
  });

  it('renders cancel button and fires callback on click when onCancel set', () => {
    const onCancel = vi.fn();
    render(ui(<BIQLoadingOverlay visible onCancel={onCancel} />));
    const btn = screen.getByTestId('biq-loading-overlay-cancel');
    fireEvent.click(btn);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('ESC key triggers onCancel when visible', () => {
    const onCancel = vi.fn();
    render(ui(<BIQLoadingOverlay visible onCancel={onCancel} />));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('ESC key is a no-op when not visible', () => {
    const onCancel = vi.fn();
    render(ui(<BIQLoadingOverlay visible={false} onCancel={onCancel} />));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancel).not.toHaveBeenCalled();
  });
});
