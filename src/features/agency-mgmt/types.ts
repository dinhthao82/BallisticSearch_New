export interface AgencyRecord {
  id: string;
  agencyId: string;
  name: string;
  contactEmail: string;
  contactPhone?: string;
  region?: string;
  active: boolean;
}

export interface AgenciesResponse {
  items: AgencyRecord[];
  total: number;
}

export interface SharingAgencyItem {
  agencyId: string;
  name: string;
  sharingEnabled: boolean;
  lastSyncAt: string;
}
