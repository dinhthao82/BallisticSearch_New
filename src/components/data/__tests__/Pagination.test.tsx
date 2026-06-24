import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { Pagination } from '../Pagination';
import { mantineTheme } from '@/theme/mantineTheme';

function setup(props: Partial<Parameters<typeof Pagination>[0]> = {}) {
  const onPageChange = vi.fn();
  const onPageSizeChange = vi.fn();
  render(
    <MantineProvider theme={mantineTheme}>
      <Pagination
        total={100}
        page={1}
        pageSize={25}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        {...props}
      />
    </MantineProvider>
  );
  return { onPageChange, onPageSizeChange };
}

describe('Pagination', () => {
  it('shows correct range "1–25 of 100"', () => {
    setup();
    expect(screen.getByText(/Showing 1–25 of 100/i)).toBeInTheDocument();
  });

  it('shows correct range for empty total', () => {
    setup({ total: 0 });
    expect(screen.getByText(/Showing 0–0 of 0/i)).toBeInTheDocument();
  });

  it('shows correct range on last partial page', () => {
    setup({ total: 47, page: 2, pageSize: 25 });
    expect(screen.getByText(/Showing 26–47 of 47/i)).toBeInTheDocument();
  });

  it('calls onPageChange when page 2 clicked', () => {
    const { onPageChange } = setup();
    // Mantine Pagination renders page buttons as plain buttons with the page number as text
    const page2 = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
