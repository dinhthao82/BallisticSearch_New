import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { LoadingOverlay, EmptyState, ErrorState } from '../index';
import { mantineTheme } from '@/theme/mantineTheme';

function renderWithMantine(ui: React.ReactNode) {
  return render(<MantineProvider theme={mantineTheme}>{ui}</MantineProvider>);
}

describe('LoadingOverlay', () => {
  it('renders when visible', () => {
    renderWithMantine(<LoadingOverlay visible message="Searching..." />);
    // Mantine's LoadingOverlay portals; just verify it didn't throw
    // and a loader exists in document
    expect(document.querySelector('[data-testid="loading-overlay"]')).toBeTruthy();
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
