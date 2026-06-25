import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock the api/client module so the hook doesn't actually hit fetch
// (MSW v2 + happy-dom + Ky have known fetch ReadableStream incompat).
// Full HTTP integration verified in browser dev mode + Playwright E2E.
vi.mock('../client', () => ({
  api: {
    post: vi.fn(() => ({
      json: vi.fn().mockResolvedValue({
        items: [
          {
            apl_ID: '1000000',
            assessor: 'Anh Pham',
            caseIncident: 'W101000',
            cartridgeCase: '9MM-1',
            type: 'PL',
            createdDateTime: '2026-01-01T08:00:00Z',
            reportStatus: 'Pending',
          },
        ],
        total: 47,
        page: 1,
        pageSize: 25,
      }),
    })),
  },
}));

import { useSearchAPL, searchAPL } from '../apl';
import { api } from '../client';

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

describe('API: searchAPL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls api.post with apl/search + json filter body', async () => {
    const data = await searchAPL({ caseNumber: 'W101' });
    expect(api.post).toHaveBeenCalledWith('apl/search', { json: { caseNumber: 'W101' } });
    expect(data.total).toBe(47);
    expect(data.items[0]?.apl_ID).toBe('1000000');
  });
});

describe('Hook: useSearchAPL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not fetch when enabled=false', () => {
    const { result } = renderHook(() => useSearchAPL({}, false), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('fetches when enabled=true and resolves to data', async () => {
    const { result } = renderHook(() => useSearchAPL({}, true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.total).toBe(47);
    expect(result.current.data?.items).toHaveLength(1);
  });

  it('passes filter as queryKey + forwards AbortSignal from useQuery', async () => {
    const { result } = renderHook(() => useSearchAPL({ caseNumber: 'W' }, true), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.post).toHaveBeenCalledWith(
      'apl/search',
      expect.objectContaining({ json: { caseNumber: 'W' }, signal: expect.any(AbortSignal) })
    );
  });
});
