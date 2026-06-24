export interface APLItem {
  apl_ID: string;
  assessor: string;
  caseIncident: string;
  cartridgeCase: string;
  type: 'PL' | 'CSA' | 'QA';
  createdDateTime: string; // ISO
  reportStatus: 'Pending' | 'In Process' | 'Closed';
}

const ASSESSORS = ['AM co quyen User', 'AM Tran Ngoc Vu', 'Anh Pham', 'Jane Doe', 'Bob Lee'];
const TYPES: APLItem['type'][] = ['PL', 'CSA', 'QA'];
const STATUSES: APLItem['reportStatus'][] = ['Pending', 'In Process', 'Closed'];

/**
 * 47 row fixture for APL search. Deterministic — no Date.now(), no Math.random().
 * Generated at module load.
 */
export const mockAPLData: APLItem[] = Array.from({ length: 47 }, (_, i) => {
  const day = (i % 28) + 1;
  const month = (Math.floor(i / 28) % 12) + 1;
  const year = 2026;
  return {
    apl_ID: String(1000000 + i),
    assessor: ASSESSORS[i % ASSESSORS.length] ?? 'Unknown',
    caseIncident: `W${String(101000 + i)}`,
    cartridgeCase: `9MM-${i + 1}`,
    type: TYPES[i % TYPES.length] ?? 'PL',
    createdDateTime: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String((i % 12) + 8).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00Z`,
    reportStatus: STATUSES[i % STATUSES.length] ?? 'Pending',
  };
});
