import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Table, ScrollArea, Center, Text, Loader } from '@mantine/core';
import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './DataTable.module.css';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  emptyMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
  /** Enable client-side sorting (Step 20 unlocks per-column UI). Default true. */
  enableSorting?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage = 'No data',
  loadingMessage = 'Loading...',
  isLoading = false,
  enableSorting = true,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableSorting,
  });

  if (isLoading) {
    return (
      <Center py="xl" data-testid="data-table-loading">
        <Loader size="sm" mr="sm" />
        <Text c="dimmed">{loadingMessage}</Text>
      </Center>
    );
  }

  if (data.length === 0) {
    return (
      <Center py="xl" data-testid="data-table-empty">
        <Text c="dimmed">{emptyMessage}</Text>
      </Center>
    );
  }

  return (
    <ScrollArea
      className={classes.scrollArea}
      viewportProps={{ tabIndex: 0, 'aria-label': 'Result table scroll area' }}
    >
      <Table className={classes.table} striped highlightOnHover withTableBorder>
        <Table.Thead className={classes.stickyHeader}>
          {table.getHeaderGroups().map((hg) => (
            <Table.Tr key={hg.id}>
              {hg.headers.map((h) => {
                const sortDir = h.column.getIsSorted();
                const canSort = enableSorting && h.column.getCanSort();
                const ariaSort =
                  sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none';
                const thProps: Omit<React.ComponentProps<typeof Table.Th>, 'children'> = {
                  'aria-sort': ariaSort,
                };
                if (canSort) {
                  thProps.onClick = h.column.getToggleSortingHandler();
                  thProps.className = classes.sortable;
                }
                return (
                  <Table.Th key={h.id} {...thProps}>
                    <span className={classes.headerCell}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {canSort && (
                        <span className={classes.sortIcon} aria-hidden>
                          {sortDir === 'asc' ? (
                            <IconSortAscending size={14} />
                          ) : sortDir === 'desc' ? (
                            <IconSortDescending size={14} />
                          ) : (
                            <IconArrowsSort size={14} />
                          )}
                        </span>
                      )}
                    </span>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
