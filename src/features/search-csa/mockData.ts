import type { CSAItem, CSAStatus } from './types';

const STATUSES: CSAStatus[] = ['Open', 'In Process', 'Closed'];
const ASSIGNEES = ['jdoe', 'asmith', 'rjones', 'mkim'];

export const mockCSAData: CSAItem[] = Array.from({ length: 30 }, (_, i) => ({
  csaId: `CSA-${(5000 + i).toString()}`,
  caseNumber: `W${(124000 + i).toString()}`,
  status: STATUSES[i % STATUSES.length] ?? 'Open',
  assignedTo: ASSIGNEES[i % ASSIGNEES.length] ?? 'jdoe',
  createdAt: `2026-${String((i % 6) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T08:00:00Z`,
  updatedAt: `2026-${String(((i + 2) % 6) + 1).padStart(2, '0')}-${String(((i + 2) % 28) + 1).padStart(2, '0')}T15:30:00Z`,
}));
