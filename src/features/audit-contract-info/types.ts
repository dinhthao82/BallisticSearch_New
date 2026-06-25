export interface ContractSide {
  version: string;
  agency: string;
  startDate: string;
  endDate: string;
  status: string;
  usersLimit: number;
}

export interface ContractChange {
  field: string;
  from: string;
  to: string;
}

export interface ContractAuditInfo {
  contractId: string;
  auditedBy: string;
  auditedAt: string;
  oldContract: ContractSide;
  newContract: ContractSide;
  changes: ContractChange[];
}
