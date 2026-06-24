import { http, HttpResponse } from 'msw';
import { mockAPLData, type APLItem } from './mockData';

interface SearchAPLBody {
  apl_ID?: string;
  caseNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  reportStatus?: string[];
  page?: number;
  pageSize?: number;
}

export const handlers = [
  http.post('/api/v1/apl/search', async ({ request }) => {
    const body = (await request.json()) as SearchAPLBody;

    let items: APLItem[] = [...mockAPLData];

    // Filter by APL_ID (substring match)
    if (body.apl_ID && body.apl_ID.trim()) {
      const q = body.apl_ID.trim().toLowerCase();
      items = items.filter((i) => i.apl_ID.toLowerCase().includes(q));
    }

    // Filter by case number (substring match)
    if (body.caseNumber && body.caseNumber.trim()) {
      const q = body.caseNumber.trim().toLowerCase();
      items = items.filter((i) => i.caseIncident.toLowerCase().includes(q));
    }

    // Filter by date range (ISO compare works lexicographically)
    if (body.dateFrom) {
      items = items.filter((i) => i.createdDateTime >= body.dateFrom!);
    }
    if (body.dateTo) {
      items = items.filter((i) => i.createdDateTime <= body.dateTo!);
    }

    // Filter by report status
    if (body.reportStatus && body.reportStatus.length > 0) {
      const statusSet = new Set(body.reportStatus.map((s) => s.toLowerCase()));
      items = items.filter((i) =>
        statusSet.has(i.reportStatus.toLowerCase().replace(/\s+/g, ''))
      );
    }

    const total = items.length;
    const page = body.page ?? 1;
    const pageSize = body.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    return HttpResponse.json({
      items: paged,
      total,
      page,
      pageSize,
    });
  }),
];
