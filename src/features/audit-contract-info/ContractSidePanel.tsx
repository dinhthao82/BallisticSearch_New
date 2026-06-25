import { Card, Stack, Text, Group, Title } from '@mantine/core';
import { BIQBadge } from '@/components/primitives';
import type { ContractSide } from './types';

interface ContractSidePanelProps {
  label: string;
  contract: ContractSide;
}

export function ContractSidePanel({ label, contract }: ContractSidePanelProps) {
  return (
    <Card withBorder padding="md" radius="md" data-testid={`contract-side-${contract.version}`}>
      <Stack gap="xs">
        <Group justify="space-between" align="baseline">
          <Title order={5}>{label}</Title>
          <Text size="xs" c="dimmed">
            {contract.version}
          </Text>
        </Group>
        <Row label="Agency" value={contract.agency} />
        <Row label="Start date" value={contract.startDate} />
        <Row label="End date" value={contract.endDate} />
        <Row
          label="Status"
          value={<BIQBadge color={badgeColor(contract.status)}>{contract.status}</BIQBadge>}
        />
        <Row label="Users limit" value={String(contract.usersLimit)} />
      </Stack>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Group justify="space-between" gap="md" wrap="nowrap">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      {typeof value === 'string' ? <Text size="sm">{value}</Text> : value}
    </Group>
  );
}

function badgeColor(status: string): string {
  const s = status.toLowerCase();
  if (s === 'closed') return 'gray';
  if (s === 'in process') return 'blue';
  if (s === 'pending') return 'yellow';
  return 'gray';
}
