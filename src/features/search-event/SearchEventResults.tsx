import { Table, Text, Checkbox, Stack, Group } from '@mantine/core';
import { BIQBadge } from '@/components/primitives';
import type { SearchEventItem } from './types';

interface SearchEventResultsProps {
  items: SearchEventItem[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
}

function scoreColor(score: number): string {
  if (score >= 85) return 'green';
  if (score >= 70) return 'yellow';
  return 'orange';
}

export function SearchEventResults({ items, selected, onToggleSelect }: SearchEventResultsProps) {
  if (items.length === 0) {
    return (
      <Text size="sm" c="dimmed" mt="md">
        No events match the current filter. Adjust criteria and re-run the search.
      </Text>
    );
  }
  return (
    <Stack gap="xs">
      <Text size="xs" c="dimmed">
        Tip: tick at most 2 rows to enable Compare. Currently selected: {selected.size} / 2.
      </Text>
      <Table withTableBorder withColumnBorders striped highlightOnHover stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}>Compare</Table.Th>
            <Table.Th>Event ID</Table.Th>
            <Table.Th>Case #</Table.Th>
            <Table.Th>Score</Table.Th>
            <Table.Th>Site</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Type</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((row) => {
            const isChecked = selected.has(row.eventId);
            const disabled = !isChecked && selected.size >= 2;
            return (
              <Table.Tr key={row.eventId} data-testid="event-row">
                <Table.Td>
                  <Checkbox
                    checked={isChecked}
                    disabled={disabled}
                    onChange={() => onToggleSelect(row.eventId)}
                    aria-label={`Select event ${row.eventId} for compare`}
                  />
                </Table.Td>
                <Table.Td>{row.eventId}</Table.Td>
                <Table.Td>{row.caseNumber}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <BIQBadge color={scoreColor(row.score)}>{row.score.toFixed(2)}</BIQBadge>
                  </Group>
                </Table.Td>
                <Table.Td>{row.site}</Table.Td>
                <Table.Td>{row.user}</Table.Td>
                <Table.Td>{new Date(row.eventDate).toLocaleString()}</Table.Td>
                <Table.Td>{row.type}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
