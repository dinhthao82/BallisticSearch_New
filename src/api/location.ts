import { useQuery } from '@tanstack/react-query';
import { api } from './client';

export interface LocationOption {
  code: string;
  name: string;
}

export async function fetchCountries(): Promise<LocationOption[]> {
  return api.get('location/countries').json<LocationOption[]>();
}

export async function fetchStates(country: string): Promise<LocationOption[]> {
  return api.get(`location/states?country=${encodeURIComponent(country)}`).json<LocationOption[]>();
}

export async function fetchCities(country: string, state: string): Promise<LocationOption[]> {
  return api
    .get(
      `location/cities?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}`
    )
    .json<LocationOption[]>();
}

export function useCountries() {
  return useQuery<LocationOption[], Error>({
    queryKey: ['location', 'countries'],
    queryFn: () => fetchCountries(),
    staleTime: Infinity, // countries list is static within a session
  });
}

export function useStates(country: string | null) {
  return useQuery<LocationOption[], Error>({
    queryKey: ['location', 'states', country],
    queryFn: () => fetchStates(country as string),
    enabled: !!country,
    staleTime: 5 * 60_000,
  });
}

export function useCities(country: string | null, state: string | null) {
  return useQuery<LocationOption[], Error>({
    queryKey: ['location', 'cities', country, state],
    queryFn: () => fetchCities(country as string, state as string),
    enabled: !!country && !!state,
    staleTime: 5 * 60_000,
  });
}
