export type CSAStatus = 'Open' | 'In Process' | 'Closed';

export interface CSAItem {
  csaId: string;
  caseNumber: string;
  status: CSAStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CSAResponse {
  items: CSAItem[];
  total: number;
  page: number;
  pageSize: number;
}
