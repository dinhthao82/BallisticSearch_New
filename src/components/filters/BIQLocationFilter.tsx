import { Group, Stack, Text } from '@mantine/core';
import { BIQSelect } from '@/components/primitives';
import { useCountries, useStates, useCities } from '@/api/location';

export interface LocationValue {
  country: string | null;
  state: string | null;
  city: string | null;
}

export interface BIQLocationFilterProps {
  value?: LocationValue;
  onChange?: (next: LocationValue) => void;
  label?: string;
}

const EMPTY_VALUE: LocationValue = { country: null, state: null, city: null };

export function BIQLocationFilter({
  value = EMPTY_VALUE,
  onChange,
  label,
}: BIQLocationFilterProps) {
  const countries = useCountries();
  const states = useStates(value.country);
  const cities = useCities(value.country, value.state);

  const setCountry = (country: string | null) => {
    onChange?.({ country, state: null, city: null });
  };

  const setState = (state: string | null) => {
    onChange?.({ country: value.country, state, city: null });
  };

  const setCity = (city: string | null) => {
    onChange?.({ country: value.country, state: value.state, city });
  };

  return (
    <Stack gap="xs" data-testid="biq-location-filter">
      {label && (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      )}
      <Group grow>
        <BIQSelect
          label="Country"
          data={[
            { value: '', label: 'All' },
            ...(countries.data?.map((c) => ({ value: c.code, label: c.name })) ?? []),
          ]}
          value={value.country ?? ''}
          onChange={(e) => setCountry(e.currentTarget.value || null)}
          disabled={countries.isLoading}
          data-testid="biq-location-country"
        />
        <BIQSelect
          label="State"
          data={[
            { value: '', label: 'All' },
            ...(states.data?.map((s) => ({ value: s.code, label: s.name })) ?? []),
          ]}
          value={value.state ?? ''}
          onChange={(e) => setState(e.currentTarget.value || null)}
          disabled={!value.country || states.isLoading}
          data-testid="biq-location-state"
        />
        <BIQSelect
          label="City"
          data={[
            { value: '', label: 'All' },
            ...(cities.data?.map((c) => ({ value: c.code, label: c.name })) ?? []),
          ]}
          value={value.city ?? ''}
          onChange={(e) => setCity(e.currentTarget.value || null)}
          disabled={!value.state || cities.isLoading}
          data-testid="biq-location-city"
        />
      </Group>
    </Stack>
  );
}
