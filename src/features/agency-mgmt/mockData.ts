import type { AgencyRecord, SharingAgencyItem } from './types';

const REGIONS = ['North', 'South', 'East', 'West'];

export const mockAgencyData: AgencyRecord[] = Array.from({ length: 25 }, (_, i) => ({
  id: `A-${(1000 + i).toString()}`,
  agencyId: `AGY-${i.toString().padStart(3, '0')}`,
  name: `Agency ${i}`,
  contactEmail: `agency${i}@example.com`,
  contactPhone: `+1-555-${i.toString().padStart(4, '0')}`,
  region: REGIONS[i % REGIONS.length] ?? 'North',
  active: i % 7 !== 0,
}));

export const mockSharingAgencies: SharingAgencyItem[] = Array.from({ length: 15 }, (_, i) => ({
  agencyId: `AGY-${i.toString().padStart(3, '0')}`,
  name: `Agency ${i}`,
  sharingEnabled: i % 2 === 0,
  lastSyncAt: `2026-06-${String((i % 20) + 1).padStart(2, '0')}T08:00:00Z`,
}));
