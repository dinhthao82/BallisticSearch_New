import { z } from 'zod';

export const QA_RESULTS = ['Pass', 'Fail', 'Pending'] as const;

export const searchQASchema = z.object({
  caseNumber: z.string().trim().max(50).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  results: z.array(z.enum(QA_RESULTS)),
  reviewer: z.string().trim().max(60).optional(),
});

export type SearchQAInput = z.infer<typeof searchQASchema>;

export const defaultSearchQAValues: SearchQAInput = {
  caseNumber: '',
  dateFrom: '',
  dateTo: '',
  results: [],
  reviewer: '',
};

export function buildQAPayload(input: SearchQAInput, page = 1, pageSize = 25) {
  return {
    caseNumber: input.caseNumber || undefined,
    dateFrom: input.dateFrom || undefined,
    dateTo: input.dateTo || undefined,
    results: input.results.length > 0 ? input.results : undefined,
    reviewer: input.reviewer || undefined,
    page,
    pageSize,
  };
}
