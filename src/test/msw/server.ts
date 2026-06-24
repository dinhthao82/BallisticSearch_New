import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** Vitest MSW server. Used by src/test/setup.ts. */
export const server = setupServer(...handlers);
