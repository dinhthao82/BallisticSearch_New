import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import {
  BIQCaseFilter,
  parseCaseNumbers,
  invalidCaseNumbers,
  isValidCaseInput,
} from '../BIQCaseFilter';
import { mantineTheme } from '@/theme/mantineTheme';

function ui(node: React.ReactNode) {
  return <MantineProvider theme={mantineTheme}>{node}</MantineProvider>;
}

describe('parseCaseNumbers (pure)', () => {
  it('splits on whitespace and commas, trims, drops empties', () => {
    expect(parseCaseNumbers('A1  B2, C3\nD-4')).toEqual(['A1', 'B2', 'C3', 'D-4']);
  });

  it('returns empty array for empty / whitespace-only input', () => {
    expect(parseCaseNumbers('   \n')).toEqual([]);
  });
});

describe('invalidCaseNumbers (pure)', () => {
  it('flags tokens with anything other than alphanumeric or dash', () => {
    expect(invalidCaseNumbers('OK1, BAD@2, ALSO_BAD, FINE-3')).toEqual(['BAD@2', 'ALSO_BAD']);
  });

  it('returns empty for fully valid input', () => {
    expect(invalidCaseNumbers('A B-1, c2, D3')).toEqual([]);
  });
});

describe('isValidCaseInput (pure)', () => {
  it('true for valid', () => {
    expect(isValidCaseInput('A B-1 c2')).toBe(true);
  });
  it('false when any token is invalid', () => {
    expect(isValidCaseInput('A B@1')).toBe(false);
  });
});

describe('BIQCaseFilter', () => {
  it('renders label + textarea', () => {
    render(ui(<BIQCaseFilter />));
    expect(screen.getByLabelText(/Case \/ Incident #/i)).toBeInTheDocument();
  });

  it('fires onChange with raw value as the user types', () => {
    const onChange = vi.fn();
    render(ui(<BIQCaseFilter onChange={onChange} />));
    const ta = screen.getByLabelText(/Case \/ Incident #/i);
    fireEvent.change(ta, { target: { value: 'A1, B-2' } });
    expect(onChange).toHaveBeenLastCalledWith('A1, B-2');
  });

  it('shows inline error when any token has invalid chars', () => {
    render(ui(<BIQCaseFilter value="A1, B@2" />));
    expect(screen.getByText(/Invalid \(alphanumeric and dashes only\): B@2/)).toBeInTheDocument();
  });

  it('no error when value is empty or fully valid', () => {
    const { rerender } = render(ui(<BIQCaseFilter value="" />));
    expect(screen.queryByText(/Invalid/)).not.toBeInTheDocument();
    rerender(ui(<BIQCaseFilter value="A B-1, c2" />));
    expect(screen.queryByText(/Invalid/)).not.toBeInTheDocument();
  });

  it('truncates the invalid list to first 3 with a "+N more" suffix', () => {
    render(ui(<BIQCaseFilter value="A@, B@, C@, D@, E@" />));
    expect(screen.getByText(/Invalid.*A@, B@, C@.*\+2 more/)).toBeInTheDocument();
  });
});
