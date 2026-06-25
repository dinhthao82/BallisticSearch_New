export interface SearchEventItem {
  eventId: string;
  caseNumber: string;
  score: number;
  site: string;
  user: string;
  eventDate: string;
  type: 'CC' | 'BC' | 'PL';
}

export interface SearchEventsResponse {
  items: SearchEventItem[];
  total: number;
  page: number;
  pageSize: number;
}
