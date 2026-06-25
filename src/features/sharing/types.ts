export interface ShareEntry {
  id: string;
  agencyId: string;
  agencyName: string;
  scope: string;
  direction: 'in' | 'out';
  status: 'Pending' | 'Active' | 'Revoked';
  updatedAt: string;
}

export interface HotlistEntry {
  id: string;
  name: string;
  agencyId: string;
  itemCount: number;
  updatedAt: string;
  active: boolean;
}

export interface SharingProfile {
  id: string;
  name: string;
  agencyId: string;
  permissions: string[];
  updatedAt: string;
}

export interface DashboardVCCMetrics {
  totalVCC: number;
  pending: number;
  inProcess: number;
  closed: number;
  byAgency: { agencyId: string; agencyName: string; count: number }[];
  recentActivity: { timestamp: string; agency: string; action: string }[];
}
