import { useState } from 'react';
import { Stack, Title, Text, Card, Code, Group } from '@mantine/core';
import {
  BIQDateRangeFilter,
  BIQLocationFilter,
  BIQCaseFilter,
  type DateRangeValue,
  type LocationValue,
} from '@/components/filters';
import { BIQButton } from '@/components/primitives';

const EMPTY_DATE: DateRangeValue = { from: null, to: null };
const EMPTY_LOCATION: LocationValue = { country: null, state: null, city: null };

export default function FilterShowcase() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(EMPTY_DATE);
  const [location, setLocation] = useState<LocationValue>(EMPTY_LOCATION);
  const [cases, setCases] = useState('');

  const resetAll = () => {
    setDateRange(EMPTY_DATE);
    setLocation(EMPTY_LOCATION);
    setCases('');
  };

  return (
    <Stack p="lg" gap="lg">
      <Title order={2}>Filter showcase (DEV only)</Title>
      <Text c="dimmed" size="sm">
        BIQDateRangeFilter + BIQLocationFilter + BIQCaseFilter, each wired to local state. Live JSON
        view below mirrors what a SearchPage would build into its API filter body.
      </Text>

      <Group justify="flex-end">
        <BIQButton variant="default" onClick={resetAll} data-testid="filter-showcase-reset">
          Reset all
        </BIQButton>
      </Group>

      <Card withBorder p="md">
        <BIQDateRangeFilter label="Created date" value={dateRange} onChange={setDateRange} />
      </Card>

      <Card withBorder p="md">
        <BIQLocationFilter label="Location" value={location} onChange={setLocation} />
      </Card>

      <Card withBorder p="md">
        <BIQCaseFilter value={cases} onChange={setCases} />
      </Card>

      <Card withBorder p="md">
        <Text fw={500} mb="xs">
          Current filter state
        </Text>
        <Code block data-testid="filter-showcase-state">
          {JSON.stringify({ dateRange, location, cases }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
