import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ContractAuditInfo } from './types';

export function useContractAudit(contractId: string | undefined) {
  return useQuery({
    queryKey: ['audit', 'contract-info', contractId],
    queryFn: ({ signal }): Promise<ContractAuditInfo> =>
      api
        .get('audit/contract-info', {
          searchParams: { contractId: contractId ?? '' },
          signal,
        })
        .json<ContractAuditInfo>(),
    enabled: Boolean(contractId),
    staleTime: 60_000,
  });
}
