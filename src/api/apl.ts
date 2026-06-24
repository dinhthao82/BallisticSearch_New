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

export async function searchAPL(filter: APLFilter): Promise<APLSearchResult> {
  return api.post('apl/search', { json: filter }).json<APLSearchResult>();
}

/**
 * TanStack Query wrapper. `enabled` gate: query only fires when caller
 * explicitly enables (e.g. after first Search click) to avoid redundant
 * initial fetch.
 */
export function useSearchAPL(filter: APLFilter, enabled = false) {
  return useQuery<APLSearchResult, Error>({
    queryKey: ['apl', 'search', filter],
    queryFn: () => searchAPL(filter),
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
