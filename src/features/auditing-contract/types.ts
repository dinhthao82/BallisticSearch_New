export interface ContractSummary {
  contractId: string;
  agency: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'In Process' | 'Closed';
  auditedAt: string;
}

export interface ContractsResponse {
  items: ContractSummary[];
  total: number;
}
