import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BoxFilter } from '../BoxFilter';

describe('BoxFilter', () => {
  it('renders children', () => {
    render(
      <BoxFilter>
        <input placeholder="name" />
      </BoxFilter>
    );
    expect(screen.getByPlaceholderText('name')).toBeInTheDocument();
  });

  it('renders optional title', () => {
    render(
      <BoxFilter title="Filters">
        <div>content</div>
      </BoxFilter>
    );
    expect(screen.getByRole('heading', { level: 3, name: /filters/i })).toBeInTheDocument();
  });

  it('applies maxWidth inline style', () => {
    render(
      <BoxFilter maxWidth="24rem">
        <div>content</div>
      </BoxFilter>
    );
    const box = screen.getByTestId('box-filter');
    expect(box.getAttribute('style')).toContain('max-width: 24rem');
  });
});
