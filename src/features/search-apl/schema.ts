import { z } from 'zod';

export const REPORT_STATUS = ['pending', 'inProcess', 'closed'] as const;
export type ReportStatusValue = (typeof REPORT_STATUS)[number];

/**
 * APL search filter — what the UI form collects.
 * Mirrors legacy GUI/SearchAPLProcess.aspx filter sidebar (BS-6159 Phase 19).
 */
export const searchAPLFilterSchema = z.object({
  /** Multi-line text — APL IDs, one per line or comma-separated. */
  apl_ID: z.string().optional(),
  /** Multi-line text — case/incident numbers. */
  caseNumber: z.string().optional(),
  /** ISO date string (YYYY-MM-DD). */
  dateFrom: z.string().optional(),
  /** ISO date string (YYYY-MM-DD). */
  dateTo: z.string().optional(),
  /** Multi-select report statuses (Pending / In Process / Closed). */
  reportStatus: z.array(z.enum(REPORT_STATUS)).optional(),
});

export type SearchAPLFilterValues = z.infer<typeof searchAPLFilterSchema>;

/**
 * Map UI form values → API request body shape.
 * APL_ID textarea is split by newline / comma into a single trimmed string,
 * because the legacy ASHX expects substring match (one value at a time
 * in POC). Real backend will accept array — defer to Phase 1 contract.
 */
export function toApiFilter(values: SearchAPLFilterValues): {
  apl_ID?: string;
  caseNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  reportStatus?: string[];
} {
  const out: ReturnType<typeof toApiFilter> = {};
  const apl = values.apl_ID?.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)[0];
  if (apl) out.apl_ID = apl;
  const cn = values.caseNumber?.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)[0];
  if (cn) out.caseNumber = cn;
  if (values.dateFrom) out.dateFrom = values.dateFrom;
  if (values.dateTo) out.dateTo = values.dateTo;
  if (values.reportStatus && values.reportStatus.length > 0) {
    out.reportStatus = values.reportStatus;
  }
  return out;
}
