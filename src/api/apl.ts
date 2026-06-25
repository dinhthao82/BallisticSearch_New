import { useQuery } from '@tanstack/react-query';
import { api } from './client';

export interface APLFilter {
  apl_ID?: string;
  caseNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  reportStatus?: string[];
  page?: number;
  pageSize?: number;
}

export interface APLItem {
  apl_ID: string;
  assessor: string;
  caseIncident: string;
  cartridgeCase: string;
  type: 'PL' | 'CSA' | 'QA';
  createdDateTime: string;
  reportStatus: 'Pending' | 'In Process' | 'Closed';
}

export interface APLSearchResult {
  items: APLItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function searchAPL(filter: APLFilter, signal?: AbortSignal): Promise<APLSearchResult> {
  return api.post('apl/search', { json: filter, signal }).json<APLSearchResult>();
}

export const APL_SEARCH_QUERY_KEY = ['apl', 'search'] as const;

/**
 * TanStack Query wrapper. `enabled` gate: query only fires when caller
 * explicitly enables (e.g. after first Search click) to avoid redundant
 * initial fetch. AbortSignal is forwarded so queryClient.cancelQueries
 * (used by BIQLoadingOverlay's onCancel) aborts the in-flight ky request.
 */
export function useSearchAPL(filter: APLFilter, enabled = false) {
  return useQuery<APLSearchResult, Error>({
    queryKey: [...APL_SEARCH_QUERY_KEY, filter],
    queryFn: ({ signal }) => searchAPL(filter, signal),
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
