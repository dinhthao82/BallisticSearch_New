import type { QAItem, QAResult } from './types';

const RESULTS: QAResult[] = ['Pass', 'Fail', 'Pending'];
const REVIEWERS = ['rjones', 'mkim', 'asmith', 'jdoe'];

export const mockQAData: QAItem[] = Array.from({ length: 25 }, (_, i) => ({
  qaId: `QA-${(7000 + i).toString()}`,
  caseNumber: `W${(125000 + i).toString()}`,
  result: RESULTS[i % RESULTS.length] ?? 'Pending',
  reviewer: REVIEWERS[i % REVIEWERS.length] ?? 'rjones',
  reviewedAt: `2026-${String((i % 6) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T13:15:00Z`,
  notes: i % 3 === 0 ? 'Sample notes for QA review.' : '',
}));
