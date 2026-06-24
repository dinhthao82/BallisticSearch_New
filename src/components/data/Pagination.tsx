import { Pagination as MantinePagination, Select, Group, Text } from '@mantine/core';

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

/**
 * Pagination control: Mantine pagination + page-size select + "Showing X–Y of Z" text.
 * Mirrors legacy EIQ_Pagination.js (BS-6159).
 */
export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Group justify="space-between" mt="md" wrap="wrap" data-testid="pagination">
      <Text size="sm" c="dimmed">
        Showing {from}–{to} of {total}
      </Text>
      <Group gap="sm">
        <Select
          aria-label="Rows per page"
          data={pageSizeOptions.map((n) => String(n))}
          value={String(pageSize)}
          onChange={(v) => {
            if (v) onPageSizeChange(Number(v));
          }}
          w={80}
          size="xs"
          allowDeselect={false}
        />
        <MantinePagination
          total={totalPages}
          value={page}
          onChange={onPageChange}
          size="sm"
          siblings={1}
          getControlProps={(control) => {
            // a11y: Mantine's arrow controls lack inner text. Provide aria-labels.
            if (control === 'first') return { 'aria-label': 'Go to first page' };
            if (control === 'last') return { 'aria-label': 'Go to last page' };
            if (control === 'next') return { 'aria-label': 'Go to next page' };
            if (control === 'previous') return { 'aria-label': 'Go to previous page' };
            return {};
          }}
          withEdges
        />
      </Group>
    </Group>
  );
}
