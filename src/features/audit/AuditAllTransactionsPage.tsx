import { AuditTablePage } from './AuditTablePage';
import type { AuditTransactionItem } from './types';

export default function AuditAllTransactionsPage() {
  return (
    <AuditTablePage<AuditTransactionItem>
      title="Audit — All Transactions"
      endpoint="audit/transactions"
      searchAriaLabel="Audit transactions search"
      columns={[
        { header: 'ID', cell: (r) => r.id },
        { header: 'User', cell: (r) => r.user },
        { header: 'Action', cell: (r) => r.action },
        { header: 'Resource', cell: (r) => r.resource },
        { header: 'When', cell: (r) => new Date(r.occurredAt).toLocaleString() },
        { header: 'IP', cell: (r) => r.ipAddress },
      ]}
    />
  );
}
