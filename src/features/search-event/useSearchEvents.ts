import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { SearchEventInput } from './schema';
import { buildSearchPayload } from './schema';
import type { SearchEventsResponse } from './types';

export const SEARCH_EVENT_QUERY_KEY = ['search-events'] as const;

export function useSearchEvents(
  input: SearchEventInput,
  page: number,
  pageSize: number,
  enabled: boolean
) {
  return useQuery({
    queryKey: [...SEARCH_EVENT_QUERY_KEY, input, page, pageSize],
    queryFn: ({ signal }): Promise<SearchEventsResponse> =>
      api
        .post('search-events', {
          json: buildSearchPayload(input, page, pageSize),
          signal,
        })
        .json<SearchEventsResponse>(),
    enabled,
    staleTime: 10_000,
  });
}
