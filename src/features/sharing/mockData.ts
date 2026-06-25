import type { ShareEntry, HotlistEntry, SharingProfile, DashboardVCCMetrics } from './types';

const STATUSES: ShareEntry['status'][] = ['Pending', 'Active', 'Revoked'];

export const mockAdminShareEntries: ShareEntry[] = Array.from({ length: 12 }, (_, i) => ({
  id: `SH-A-${(100 + i).toString()}`,
  agencyId: `AGY-${i.toString().padStart(3, '0')}`,
  agencyName: `Agency ${i}`,
  scope: i % 2 === 0 ? 'All cases' : 'Selected cases',
  direction: 'out',
  status: STATUSES[i % STATUSES.length] ?? 'Active',
  updatedAt: `2026-06-${String((i % 20) + 1).padStart(2, '0')}T10:00:00Z`,
}));

export const mockAgencyShareEntries: ShareEntry[] = Array.from({ length: 8 }, (_, i) => ({
  id: `SH-B-${(200 + i).toString()}`,
  agencyId: `AGY-${i.toString().padStart(3, '0')}`,
  agencyName: `Agency ${i}`,
  scope: 'Inbound from admin',
  direction: 'in',
  status: STATUSES[i % STATUSES.length] ?? 'Active',
  updatedAt: `2026-06-${String((i % 20) + 1).padStart(2, '0')}T12:00:00Z`,
}));

export const mockHotlistData: HotlistEntry[] = Array.from({ length: 10 }, (_, i) => ({
  id: `HL-${(300 + i).toString()}`,
  name: `Hotlist ${i}`,
  agencyId: `AGY-${i.toString().padStart(3, '0')}`,
  itemCount: 25 + i * 7,
  updatedAt: `2026-06-${String((i % 20) + 1).padStart(2, '0')}T08:00:00Z`,
  active: i % 3 !== 0,
}));

export const mockSharingProfiles: SharingProfile[] = Array.from({ length: 8 }, (_, i) => ({
  id: `P-${(400 + i).toString()}`,
  name: `Profile ${i}`,
  agencyId: `AGY-${i.toString().padStart(3, '0')}`,
  permissions: i % 2 === 0 ? ['read', 'write'] : ['read'],
  updatedAt: `2026-06-${String((i % 20) + 1).padStart(2, '0')}T14:00:00Z`,
}));

export const mockDashboardVCC: DashboardVCCMetrics = {
  totalVCC: 247,
  pending: 38,
  inProcess: 91,
  closed: 118,
  byAgency: [
    { agencyId: 'AGY-001', agencyName: 'Springfield PD', count: 56 },
    { agencyId: 'AGY-002', agencyName: 'Riverside Sheriff', count: 42 },
    { agencyId: 'AGY-003', agencyName: 'Metro DA', count: 38 },
    { agencyId: 'AGY-004', agencyName: 'Capitol Forensics', count: 31 },
    { agencyId: 'AGY-005', agencyName: 'Northgate PD', count: 28 },
  ],
  recentActivity: [
    { timestamp: '2026-06-25T10:30:00Z', agency: 'Springfield PD', action: 'Submitted VCC' },
    { timestamp: '2026-06-25T09:15:00Z', agency: 'Metro DA', action: 'Approved VCC' },
    { timestamp: '2026-06-24T16:00:00Z', agency: 'Riverside Sheriff', action: 'Closed VCC' },
  ],
};
