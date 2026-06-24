import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

async function enableMocking(): Promise<void> {
  if (import.meta.env['VITE_USE_MOCK'] !== 'true') return;
  const { worker } = await import('./test/msw/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

enableMocking().then(() => {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
