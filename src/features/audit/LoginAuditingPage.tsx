import { AuditTablePage } from './AuditTablePage';
import { BIQBadge } from '@/components/primitives';
import type { LoginAuditItem } from './types';

export default function LoginAuditingPage() {
  return (
    <AuditTablePage<LoginAuditItem>
      title="Audit — Login Auditing"
      endpoint="audit/logins"
      searchAriaLabel="Login audit search"
      columns={[
        { header: 'ID', cell: (r) => r.id },
        { header: 'User', cell: (r) => r.user },
        {
          header: 'Result',
          cell: (r) => (
            <BIQBadge color={r.result === 'Success' ? 'green' : 'red'}>{r.result}</BIQBadge>
          ),
        },
        { header: 'When', cell: (r) => new Date(r.occurredAt).toLocaleString() },
        { header: 'IP', cell: (r) => r.ipAddress },
        { header: 'Reason', cell: (r) => r.reason ?? '—' },
      ]}
    />
  );
}
