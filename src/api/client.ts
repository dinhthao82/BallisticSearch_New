import ky from 'ky';

/**
 * Centralized Ky instance for the BIQ API.
 * - prefixUrl: from VITE_API_BASE (defaults /api/v1)
 * - retries on GET 2x
 * - placeholder beforeRequest hook attaches mock user header
 *   (Step 28 real auth replaces this with Bearer JWT)
 */
export const api = ky.create({
  prefixUrl: import.meta.env['VITE_API_BASE'] ?? '/api/v1',
  timeout: 30000,
  retry: { limit: 2, methods: ['get'] },
  hooks: {
    beforeRequest: [
      (req) => {
        try {
          const raw = localStorage.getItem('biq-user');
          if (raw) {
            const parsed = JSON.parse(raw) as { state?: { user?: { username?: string } } };
            const username = parsed.state?.user?.username;
            if (username) req.headers.set('X-Mock-User', username);
          }
        } catch {
          // ignore — anonymous request
        }
      },
    ],
  },
});
