import { z } from 'zod';

export const SEARCH_BY_OPTIONS = ['any', 'exact'] as const;
export type SearchByMode = (typeof SEARCH_BY_OPTIONS)[number];

export const searchEventSchema = z.object({
  minScore: z.number().min(0).max(100),
  topN: z.number().int().min(1).max(500),
  searchBy: z.enum(SEARCH_BY_OPTIONS),
  caseNumbers: z.string().trim().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  site: z.string().optional(),
  user: z.string().optional(),
});

export type SearchEventInput = z.infer<typeof searchEventSchema>;

export const defaultSearchEventValues: SearchEventInput = {
  minScore: 60,
  topN: 50,
  searchBy: 'any',
  caseNumbers: '',
  dateFrom: '',
  dateTo: '',
  site: '',
  user: '',
};

export function buildSearchPayload(input: SearchEventInput, page = 1, pageSize = 25) {
  const cases = (input.caseNumbers ?? '')
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    minScore: input.minScore,
    topN: input.topN,
    searchBy: input.searchBy,
    caseNumbers: cases,
    dateFrom: input.dateFrom || undefined,
    dateTo: input.dateTo || undefined,
    site: input.site || undefined,
    user: input.user || undefined,
    page,
    pageSize,
  };
}
