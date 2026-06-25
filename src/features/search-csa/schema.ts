import { z } from 'zod';

export const CSA_STATUSES = ['Open', 'In Process', 'Closed'] as const;

export const searchCSASchema = z.object({
  caseNumber: z.string().trim().max(50).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  statuses: z.array(z.enum(CSA_STATUSES)),
  assignedTo: z.string().trim().max(60).optional(),
});

export type SearchCSAInput = z.infer<typeof searchCSASchema>;

export const defaultSearchCSAValues: SearchCSAInput = {
  caseNumber: '',
  dateFrom: '',
  dateTo: '',
  statuses: [],
  assignedTo: '',
};

export function buildCSAPayload(input: SearchCSAInput, page = 1, pageSize = 25) {
  return {
    caseNumber: input.caseNumber || undefined,
    dateFrom: input.dateFrom || undefined,
    dateTo: input.dateTo || undefined,
    statuses: input.statuses.length > 0 ? input.statuses : undefined,
    assignedTo: input.assignedTo || undefined,
    page,
    pageSize,
  };
}
