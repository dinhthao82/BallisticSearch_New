import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { buildQAPayload, type SearchQAInput } from './schema';
import type { QAResponse } from './types';

export const SEARCH_QA_QUERY_KEY = ['search-qa'] as const;

export function useSearchQA(
  input: SearchQAInput,
  page: number,
  pageSize: number,
  enabled: boolean
) {
  return useQuery({
    queryKey: [...SEARCH_QA_QUERY_KEY, input, page, pageSize],
    queryFn: ({ signal }): Promise<QAResponse> =>
      api
        .post('search-qa', { json: buildQAPayload(input, page, pageSize), signal })
        .json<QAResponse>(),
    enabled,
    staleTime: 10_000,
  });
}
