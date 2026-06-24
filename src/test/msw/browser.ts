import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/** Browser MSW worker. Activated by main.tsx when VITE_USE_MOCK=true. */
export const worker = setupWorker(...handlers);
