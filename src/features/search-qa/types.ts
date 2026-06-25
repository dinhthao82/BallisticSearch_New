export type QAResult = 'Pass' | 'Fail' | 'Pending';

export interface QAItem {
  qaId: string;
  caseNumber: string;
  result: QAResult;
  reviewer: string;
  reviewedAt: string;
  notes: string;
}

export interface QAResponse {
  items: QAItem[];
  total: number;
  page: number;
  pageSize: number;
}
