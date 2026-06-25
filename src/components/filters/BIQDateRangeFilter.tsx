import { Group, Button, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';

export interface DateRangeValue {
  from: string | null; // YYYY-MM-DD
  to: string | null;
}

export interface BIQDateRangeFilterProps {
  value?: DateRangeValue;
  onChange?: (next: DateRangeValue) => void;
  label?: string;
  fromLabel?: string;
  toLabel?: string;
}

type QuickOption = 'today' | 'last7d' | 'last30d' | 'custom';

const QUICK_OPTIONS: { id: QuickOption; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'last7d', label: 'Last 7d' },
  { id: 'last30d', label: 'Last 30d' },
  { id: 'custom', label: 'Custom' },
];

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysAgoIso(daysBack: number, from: Date): string {
  const d = new Date(from);
  d.setDate(d.getDate() - daysBack);
  return toIso(d);
}

/**
 * Computes the {from, to} pair for a quick option, using `now` as the
 * reference so callers can pin determinism in tests.
 */
export function rangeForQuickOption(opt: QuickOption, now: Date = new Date()): DateRangeValue {
  switch (opt) {
    case 'today':
      return { from: toIso(now), to: toIso(now) };
    case 'last7d':
      return { from: daysAgoIso(6, now), to: toIso(now) };
    case 'last30d':
      return { from: daysAgoIso(29, now), to: toIso(now) };
    case 'custom':
      return { from: null, to: null };
  }
}

export function BIQDateRangeFilter({
  value,
  onChange,
  label,
  fromLabel = 'From',
  toLabel = 'To',
}: BIQDateRangeFilterProps) {
  const [active, setActive] = useState<QuickOption>('custom');
  const current = value ?? { from: null, to: null };

  const pickQuick = (opt: QuickOption) => {
    setActive(opt);
    const next = rangeForQuickOption(opt);
    onChange?.(next);
  };

  const setFrom = (d: Date | null) => {
    setActive('custom');
    onChange?.({ ...current, from: d ? toIso(d) : null });
  };

  const setTo = (d: Date | null) => {
    setActive('custom');
    onChange?.({ ...current, to: d ? toIso(d) : null });
  };

  return (
    <Stack gap="xs" data-testid="biq-daterange-filter">
      {label && (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      )}
      <Group gap="xs">
        {QUICK_OPTIONS.map((opt) => (
          <Button
            key={opt.id}
            size="xs"
            variant={active === opt.id ? 'filled' : 'default'}
            onClick={() => pickQuick(opt.id)}
            data-testid={`biq-daterange-quick-${opt.id}`}
          >
            {opt.label}
          </Button>
        ))}
      </Group>
      <Group grow>
        <DatePickerInput
          label={fromLabel}
          value={current.from ? new Date(current.from) : null}
          onChange={(d) => setFrom(d ? new Date(d) : null)}
          valueFormat="YYYY-MM-DD"
          clearable
          size="sm"
          data-testid="biq-daterange-from"
        />
        <DatePickerInput
          label={toLabel}
          value={current.to ? new Date(current.to) : null}
          onChange={(d) => setTo(d ? new Date(d) : null)}
          valueFormat="YYYY-MM-DD"
          clearable
          size="sm"
          data-testid="biq-daterange-to"
        />
      </Group>
    </Stack>
  );
}
