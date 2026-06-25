export interface AuditTransactionItem {
  id: string;
  user: string;
  action: string;
  resource: string;
  occurredAt: string;
  ipAddress: string;
}

export interface LoginAuditItem {
  id: string;
  user: string;
  occurredAt: string;
  ipAddress: string;
  result: 'Success' | 'Failed';
  reason?: string;
}

export interface InfoAuditItem {
  id: string;
  user: string;
  action: string;
  details: string;
  occurredAt: string;
}

export interface AuditResponse<T> {
  items: T[];
  total: number;
}
