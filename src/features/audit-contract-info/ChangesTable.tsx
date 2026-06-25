import { Table, Text } from '@mantine/core';
import type { ContractChange } from './types';

interface ChangesTableProps {
  changes: ContractChange[];
}

export function ChangesTable({ changes }: ChangesTableProps) {
  if (changes.length === 0) {
    return (
      <Text size="sm" c="dimmed" mt="sm">
        No field-level changes recorded.
      </Text>
    );
  }
  return (
    <Table withTableBorder withColumnBorders striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Field</Table.Th>
          <Table.Th>Old value</Table.Th>
          <Table.Th>New value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {changes.map((c) => (
          <Table.Tr key={c.field}>
            <Table.Td>{c.field}</Table.Td>
            <Table.Td>{c.from}</Table.Td>
            <Table.Td>{c.to}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
