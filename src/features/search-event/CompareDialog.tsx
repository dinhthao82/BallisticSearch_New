import { SimpleGrid, Stack, Text, Group, Title } from '@mantine/core';
import { BIQModal } from '@/components/modal';
import { BIQBadge, BIQButton } from '@/components/primitives';
import type { SearchEventItem } from './types';

interface CompareDialogProps {
  opened: boolean;
  items: SearchEventItem[];
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </Group>
  );
}

export function CompareDialog({ opened, items, onClose }: CompareDialogProps) {
  return (
    <BIQModal
      opened={opened}
      onClose={onClose}
      title="Compare events"
      size="lg"
      footer={
        <Group justify="flex-end">
          <BIQButton variant="default" onClick={onClose}>
            Close
          </BIQButton>
        </Group>
      }
    >
      {items.length !== 2 ? (
        <Text c="dimmed">Select exactly 2 events to compare.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {items.map((it) => (
            <Stack key={it.eventId} gap="xs" data-testid="compare-side">
              <Title order={5}>{it.eventId}</Title>
              <Row label="Case" value={it.caseNumber} />
              <Row label="Score" value={<BIQBadge color="blue">{it.score.toFixed(2)}</BIQBadge>} />
              <Row label="Site" value={it.site} />
              <Row label="User" value={it.user} />
              <Row label="Date" value={new Date(it.eventDate).toLocaleString()} />
              <Row label="Type" value={it.type} />
            </Stack>
          ))}
        </SimpleGrid>
      )}
    </BIQModal>
  );
}
