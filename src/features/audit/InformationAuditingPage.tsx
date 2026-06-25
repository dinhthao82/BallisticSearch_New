import { AuditTablePage } from './AuditTablePage';
import type { InfoAuditItem } from './types';

export default function InformationAuditingPage() {
  return (
    <AuditTablePage<InfoAuditItem>
      title="Audit — Information"
      endpoint="audit/information"
      searchAriaLabel="Information audit search"
      columns={[
        { header: 'ID', cell: (r) => r.id },
        { header: 'User', cell: (r) => r.user },
        { header: 'Action', cell: (r) => r.action },
        { header: 'Details', cell: (r) => r.details },
        { header: 'When', cell: (r) => new Date(r.occurredAt).toLocaleString() },
      ]}
    />
  );
}
