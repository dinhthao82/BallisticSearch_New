import { lazy, Suspense } from 'react';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mantineTheme } from '@/theme/mantineTheme';
import ProtectedLayout from '@/routes/ProtectedLayout';
import LoginPage from '@/features/login/LoginPage';
import SearchAPLPage from '@/features/search-apl/SearchAPLPage';
import CaseNumberPage from '@/features/case-number/CaseNumberPage';
import AuditContractInfoPage from '@/features/audit-contract-info/AuditContractInfoPage';
import SubmitRapidPage from '@/features/submit-rapid/SubmitRapidPage';
import { BIQToaster } from '@/components/modal';
import './theme/cssVars.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const ModalShowcase = import.meta.env.DEV
  ? lazy(() => import('@/features/dev/ModalShowcase'))
  : null;
const FilterShowcase = import.meta.env.DEV
  ? lazy(() => import('@/features/dev/FilterShowcase'))
  : null;

export default function App() {
  return (
    <MantineProvider theme={mantineTheme}>
      <BIQToaster position="top-right" richColors closeButton />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/app" element={<ProtectedLayout />}>
              <Route index element={<Navigate to="/app/search-apl" replace />} />
              <Route path="search-apl" element={<SearchAPLPage />} />
              <Route path="case-number" element={<CaseNumberPage />} />
              <Route path="audit-contract-info" element={<AuditContractInfoPage />} />
              <Route path="submit-rapid" element={<SubmitRapidPage />} />
            </Route>
            {ModalShowcase && (
              <Route
                path="/dev/modal-showcase"
                element={
                  <Suspense fallback={null}>
                    <ModalShowcase />
                  </Suspense>
                }
              />
            )}
            {FilterShowcase && (
              <Route
                path="/dev/filter-showcase"
                element={
                  <Suspense fallback={null}>
                    <FilterShowcase />
                  </Suspense>
                }
              />
            )}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
