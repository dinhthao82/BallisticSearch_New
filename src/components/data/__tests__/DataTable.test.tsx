import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../DataTable';
import { mantineTheme } from '@/theme/mantineTheme';

interface Row {
  id: string;
  name: string;
  age: number;
}

const columns: ColumnDef<Row>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Age', accessorKey: 'age' },
];

const data: Row[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Carol', age: 40 },
];

function renderTable(props: Partial<Parameters<typeof DataTable<Row>>[0]> = {}) {
  return render(
    <MantineProvider theme={mantineTheme}>
      <DataTable data={data} columns={columns} {...props} />
    </MantineProvider>
  );
}

describe('DataTable', () => {
  it('renders headers + rows', () => {
    renderTable();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    renderTable({ data: [], emptyMessage: 'Nothing here' });
    expect(screen.getByTestId('data-table-empty')).toHaveTextContent('Nothing here');
  });

  it('shows loading state', () => {
    renderTable({ isLoading: true });
    expect(screen.getByTestId('data-table-loading')).toBeInTheDocument();
  });

  it('sorts by column when header clicked', () => {
    renderTable();
    const nameHeader = screen.getByText('Name').closest('th');
    if (!nameHeader) throw new Error('Name header not found');

    // Initially unsorted ("none")
    expect(nameHeader.getAttribute('aria-sort')).toBe('none');

    fireEvent.click(nameHeader);
    expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');

    fireEvent.click(nameHeader);
    expect(nameHeader.getAttribute('aria-sort')).toBe('descending');
  });
});
