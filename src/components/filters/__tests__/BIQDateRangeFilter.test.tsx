import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import {
  BIQDateRangeFilter,
  rangeForQuickOption,
  type DateRangeValue,
} from '../BIQDateRangeFilter';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

describe('rangeForQuickOption (pure)', () => {
  const ref = new Date('2026-06-25T12:00:00Z');

  it('today returns same-day from/to', () => {
    const r = rangeForQuickOption('today', ref);
    expect(r.from).toBe(r.to);
    expect(r.from).toMatch(/^2026-06-2[45]$/);
  });

  it('last7d returns a 7-day window ending today', () => {
    const r = rangeForQuickOption('last7d', ref);
    expect(r.to).toMatch(/^2026-06-2[45]$/);
    expect(r.from).toMatch(/^2026-06-(1[89]|2[01])$/);
  });

  it('last30d returns a 30-day window', () => {
    const r = rangeForQuickOption('last30d', ref);
    expect(r.from).toMatch(/^2026-05-2[67]$/);
  });

  it('custom yields null/null', () => {
    expect(rangeForQuickOption('custom')).toEqual({ from: null, to: null });
  });
});

describe('BIQDateRangeFilter', () => {
  it('renders all 4 quick option buttons + 2 date inputs', () => {
    render(ui(<BIQDateRangeFilter />));
    expect(screen.getByTestId('biq-daterange-quick-today')).toBeInTheDocument();
    expect(screen.getByTestId('biq-daterange-quick-last7d')).toBeInTheDocument();
    expect(screen.getByTestId('biq-daterange-quick-last30d')).toBeInTheDocument();
    expect(screen.getByTestId('biq-daterange-quick-custom')).toBeInTheDocument();
    expect(screen.getByTestId('biq-daterange-from')).toBeInTheDocument();
    expect(screen.getByTestId('biq-daterange-to')).toBeInTheDocument();
  });

  it('clicking Today fires onChange with same-day from/to', () => {
    const onChange = vi.fn<[DateRangeValue], void>();
    render(ui(<BIQDateRangeFilter onChange={onChange} />));
    fireEvent.click(screen.getByTestId('biq-daterange-quick-today'));
    expect(onChange).toHaveBeenCalledOnce();
    const arg = onChange.mock.calls[0]?.[0] as DateRangeValue;
    expect(arg.from).toBe(arg.to);
    expect(arg.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('clicking Custom resets both inputs to null', () => {
    const onChange = vi.fn<[DateRangeValue], void>();
    render(
      ui(
        <BIQDateRangeFilter value={{ from: '2026-06-01', to: '2026-06-10' }} onChange={onChange} />
      )
    );
    fireEvent.click(screen.getByTestId('biq-daterange-quick-custom'));
    expect(onChange).toHaveBeenLastCalledWith({ from: null, to: null });
  });

  it('renders label when provided', () => {
    render(ui(<BIQDateRangeFilter label="Created Date" />));
    expect(screen.getByText('Created Date')).toBeInTheDocument();
  });
});
