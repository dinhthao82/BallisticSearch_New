import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataResult } from '../DataResult';

describe('DataResult', () => {
  it('renders children inside a region', () => {
    render(
      <DataResult>
        <h2>Results</h2>
      </DataResult>
    );
    expect(screen.getByTestId('data-result')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /results/i })).toBeInTheDocument();
  });
});
