import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { buildCSAPayload, type SearchCSAInput } from './schema';
import type { CSAResponse } from './types';

export const SEARCH_CSA_QUERY_KEY = ['search-csa'] as const;

export function useSearchCSA(
  input: SearchCSAInput,
  page: number,
  pageSize: number,
  enabled: boolean
) {
  return useQuery({
    queryKey: [...SEARCH_CSA_QUERY_KEY, input, page, pageSize],
    queryFn: ({ signal }): Promise<CSAResponse> =>
      api
        .post('search-csa', { json: buildCSAPayload(input, page, pageSize), signal })
        .json<CSAResponse>(),
    enabled,
    staleTime: 10_000,
  });
}
