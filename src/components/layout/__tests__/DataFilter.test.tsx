import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { DataFilter } from '../DataFilter';
import { mantineTheme } from '@/theme/mantineTheme';

function renderWithMantine(ui: React.ReactNode) {
  return render(<MantineProvider theme={mantineTheme}>{ui}</MantineProvider>);
}

describe('DataFilter', () => {
  it('renders children when expanded', () => {
    renderWithMantine(
      <DataFilter>
        <div>filter content</div>
      </DataFilter>
    );
    expect(screen.getByText('filter content')).toBeInTheDocument();
    expect(screen.getByTestId('data-filter')).toHaveAttribute('data-collapsed', 'false');
  });

  it('toggles collapsed state on button click', () => {
    renderWithMantine(
      <DataFilter>
        <div>filter content</div>
      </DataFilter>
    );
    const toggle = screen.getByRole('button', { name: /toggle filter sidebar/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('data-filter')).toHaveAttribute('data-collapsed', 'true');
  });

  it('respects defaultCollapsed=true', () => {
    renderWithMantine(
      <DataFilter defaultCollapsed>
        <div>filter content</div>
      </DataFilter>
    );
    expect(screen.getByTestId('data-filter')).toHaveAttribute('data-collapsed', 'true');
  });
});
