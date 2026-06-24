import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageBody } from '../PageBody';

describe('PageBody', () => {
  it('renders children', () => {
    render(
      <PageBody>
        <div>filter</div>
        <div>result</div>
      </PageBody>
    );
    expect(screen.getByText('filter')).toBeInTheDocument();
    expect(screen.getByText('result')).toBeInTheDocument();
  });
});
