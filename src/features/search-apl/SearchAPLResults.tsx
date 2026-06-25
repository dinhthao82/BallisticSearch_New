import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/data/DataTable';
import { BIQBadge } from '@/components/primitives';
import type { APLItem } from '@/api/apl';

interface SearchAPLResultsProps {
  items: APLItem[];
  isLoading?: boolean;
}

export function SearchAPLResults({ items, isLoading = false }: SearchAPLResultsProps) {
  const { t } = useTranslation('searchAPL');

  const columns = useMemo<ColumnDef<APLItem>[]>(
    () => [
      { header: t('column.apl_ID'), accessorKey: 'apl_ID' },
      { header: t('column.assessor'), accessorKey: 'assessor' },
      { header: t('column.caseIncident'), accessorKey: 'caseIncident' },
      { header: t('column.cartridgeCase'), accessorKey: 'cartridgeCase' },
      { header: t('column.type'), accessorKey: 'type' },
      {
        header: t('column.createdDateTime'),
        accessorKey: 'createdDateTime',
        cell: (info) => formatDateTime(info.getValue() as string),
      },
      {
        header: t('column.reportStatus'),
        accessorKey: 'reportStatus',
        cell: (info) => {
          const status = info.getValue() as APLItem['reportStatus'];
          return <BIQBadge status={status}>{status}</BIQBadge>;
        },
      },
    ],
    [t]
  );

  return (
    <DataTable<APLItem>
      data={items}
      columns={columns}
      isLoading={isLoading}
      emptyMessage={t('common:state.empty')}
      loadingMessage={t('common:state.loading')}
    />
  );
}

function formatDateTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${mi}`;
}
