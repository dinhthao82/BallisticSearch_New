import { http, HttpResponse } from 'msw';
import { mockAPLData, type APLItem } from './mockData';

// Minimal cascading location dataset for BIQLocationFilter dev/test runs.
// Real systems would source these from the backend reference data service.
const LOCATIONS: Record<string, Record<string, string[]>> = {
  US: {
    CA: ['Los Angeles', 'San Francisco', 'San Diego'],
    NY: ['New York City', 'Buffalo'],
    TX: ['Houston', 'Austin', 'Dallas'],
  },
  CA: {
    ON: ['Toronto', 'Ottawa'],
    BC: ['Vancouver', 'Victoria'],
  },
  VN: {
    HN: ['Hanoi'],
    HCM: ['Ho Chi Minh City'],
  },
};

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  VN: 'Vietnam',
};

const STATE_NAMES: Record<string, Record<string, string>> = {
  US: { CA: 'California', NY: 'New York', TX: 'Texas' },
  CA: { ON: 'Ontario', BC: 'British Columbia' },
  VN: { HN: 'Ha Noi', HCM: 'Ho Chi Minh' },
};

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
      items = items.filter((i) => statusSet.has(i.reportStatus.toLowerCase().replace(/\s+/g, '')));
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

  http.get('/api/v1/location/countries', () => {
    return HttpResponse.json(
      Object.keys(LOCATIONS).map((code) => ({ code, name: COUNTRY_NAMES[code] ?? code }))
    );
  }),

  http.get('/api/v1/location/states', ({ request }) => {
    const url = new URL(request.url);
    const country = url.searchParams.get('country') ?? '';
    const states = LOCATIONS[country];
    if (!states) return HttpResponse.json([]);
    return HttpResponse.json(
      Object.keys(states).map((code) => ({ code, name: STATE_NAMES[country]?.[code] ?? code }))
    );
  }),

  http.get('/api/v1/location/cities', ({ request }) => {
    const url = new URL(request.url);
    const country = url.searchParams.get('country') ?? '';
    const state = url.searchParams.get('state') ?? '';
    const cities = LOCATIONS[country]?.[state] ?? [];
    return HttpResponse.json(cities.map((name) => ({ code: name, name })));
  }),

  http.post('/api/v1/rapid-ballistics', async ({ request }) => {
    const formData = await request.formData();
    const caseNumber = formData.get('caseNumber');
    if (!caseNumber || typeof caseNumber !== 'string' || !caseNumber.trim()) {
      return HttpResponse.json({ error: 'caseNumber is required' }, { status: 400 });
    }
    const photos = formData.getAll('photos').filter((v): v is File => v instanceof File);
    return HttpResponse.json({
      submissionId: `RB-${Date.now().toString(36).toUpperCase()}`,
      photoCount: photos.length,
      acknowledged: true,
    });
  }),

  http.get('/api/v1/audit/contract-info', ({ request }) => {
    const url = new URL(request.url);
    const contractId = url.searchParams.get('contractId') ?? '';
    if (!contractId) {
      return HttpResponse.json({ error: 'contractId is required' }, { status: 400 });
    }
    return HttpResponse.json({
      contractId,
      auditedBy: 'jdoe',
      auditedAt: '2026-06-20T10:30:00Z',
      oldContract: {
        version: 'v1',
        agency: 'Springfield PD',
        startDate: '2024-01-01',
        endDate: '2025-12-31',
        status: 'Closed',
        usersLimit: 50,
      },
      newContract: {
        version: 'v2',
        agency: 'Springfield PD',
        startDate: '2026-01-01',
        endDate: '2027-12-31',
        status: 'In Process',
        usersLimit: 100,
      },
      changes: [
        { field: 'usersLimit', from: '50', to: '100' },
        { field: 'endDate', from: '2025-12-31', to: '2027-12-31' },
      ],
    });
  }),

  http.get('/api/v1/audit/contracts', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const all = [
      {
        contractId: 'CONTRACT-001',
        agency: 'Springfield PD',
        startDate: '2024-01-01',
        endDate: '2025-12-31',
        status: 'Closed',
        auditedAt: '2026-06-20T10:30:00Z',
      },
      {
        contractId: 'CONTRACT-002',
        agency: 'Riverside Sheriff',
        startDate: '2025-06-01',
        endDate: '2027-05-31',
        status: 'In Process',
        auditedAt: '2026-06-18T14:00:00Z',
      },
      {
        contractId: 'CONTRACT-003',
        agency: 'Metro DA Office',
        startDate: '2026-01-01',
        endDate: '2028-12-31',
        status: 'Pending',
        auditedAt: '2026-06-15T09:15:00Z',
      },
    ];
    const filtered = status ? all.filter((c) => c.status === status) : all;
    return HttpResponse.json({ items: filtered, total: filtered.length });
  }),

  http.post('/api/v1/email/send', async ({ request }) => {
    const body = (await request.json()) as {
      to?: string[];
      cc?: string[];
      subject?: string;
      body?: string;
    };
    const to = body.to ?? [];
    if (to.length === 0) {
      return HttpResponse.json({ error: 'At least one recipient required' }, { status: 400 });
    }
    return HttpResponse.json({
      messageId: `MSG-${Date.now().toString(36).toUpperCase()}`,
      recipients: to.length + (body.cc?.length ?? 0),
      acknowledged: true,
    });
  }),

  http.post('/api/v1/case-number/submit', async ({ request }) => {
    const body = (await request.json()) as {
      caseNumber?: string;
      purpose?: string;
      requestor?: string;
    };
    if (!body.caseNumber || !body.caseNumber.trim()) {
      return HttpResponse.json({ error: 'caseNumber is required' }, { status: 400 });
    }
    return HttpResponse.json({
      auditId: `AUD-${Date.now().toString(36).toUpperCase()}`,
      acknowledged: true,
    });
  }),
];
