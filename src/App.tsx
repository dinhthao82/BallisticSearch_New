import { lazy, Suspense } from 'react';
import { MantineProvider, Center, Loader } from '@mantine/core';
import '@mantine/core/styles.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mantineTheme } from '@/theme/mantineTheme';
import ProtectedLayout from '@/routes/ProtectedLayout';
import LoginPage from '@/features/login/LoginPage';
import { BIQToaster } from '@/components/modal';
import './theme/cssVars.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const HomePage = lazy(() => import('@/features/home/HomePage'));
const SearchAPLPage = lazy(() => import('@/features/search-apl/SearchAPLPage'));
const CaseNumberPage = lazy(() => import('@/features/case-number/CaseNumberPage'));
const AuditContractInfoPage = lazy(
  () => import('@/features/audit-contract-info/AuditContractInfoPage')
);
const SubmitRapidPage = lazy(() => import('@/features/submit-rapid/SubmitRapidPage'));
const VCCRedirectPage = lazy(() => import('@/features/vcc-redirect/VCCRedirectPage'));
const AuditingContractPage = lazy(
  () => import('@/features/auditing-contract/AuditingContractPage')
);
const ComposeEmailPage = lazy(() => import('@/features/compose-email/ComposeEmailPage'));
const UploadBulletPage = lazy(() => import('@/features/upload-bullet/UploadBulletPage'));
const MapOfAgenciesPage = lazy(() => import('@/features/map-agencies/MapOfAgenciesPage'));
const MapOfGalleriesPage = lazy(() => import('@/features/map-galleries/MapOfGalleriesPage'));
const MapItGalleryPage = lazy(() => import('@/features/mapit-gallery/MapItGalleryPage'));
const MapItPotentialPage = lazy(() => import('@/features/mapit-potential/MapItPotentialPage'));
const SearchEventPage = lazy(() => import('@/features/search-event/SearchEventPage'));
const SearchCSAPage = lazy(() => import('@/features/search-csa/SearchCSAPage'));

const ModalShowcase = import.meta.env.DEV
  ? lazy(() => import('@/features/dev/ModalShowcase'))
  : null;
const FilterShowcase = import.meta.env.DEV
  ? lazy(() => import('@/features/dev/FilterShowcase'))
  : null;

function RouteFallback() {
  return (
    <Center h="100%" p="xl">
      <Loader size="sm" />
    </Center>
  );
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

export default function App() {
  return (
    <MantineProvider theme={mantineTheme}>
      <BIQToaster position="top-right" richColors closeButton />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/app" element={<ProtectedLayout />}>
              <Route
                index
                element={
                  <Lazy>
                    <HomePage />
                  </Lazy>
                }
              />
              <Route
                path="search-apl"
                element={
                  <Lazy>
                    <SearchAPLPage />
                  </Lazy>
                }
              />
              <Route
                path="search-event"
                element={
                  <Lazy>
                    <SearchEventPage />
                  </Lazy>
                }
              />
              <Route
                path="search-csa"
                element={
                  <Lazy>
                    <SearchCSAPage />
                  </Lazy>
                }
              />
              <Route
                path="case-number"
                element={
                  <Lazy>
                    <CaseNumberPage />
                  </Lazy>
                }
              />
              <Route
                path="audit-contract-info"
                element={
                  <Lazy>
                    <AuditContractInfoPage />
                  </Lazy>
                }
              />
              <Route
                path="submit-rapid"
                element={
                  <Lazy>
                    <SubmitRapidPage />
                  </Lazy>
                }
              />
              <Route
                path="vcc-redirect"
                element={
                  <Lazy>
                    <VCCRedirectPage />
                  </Lazy>
                }
              />
              <Route
                path="auditing-contract"
                element={
                  <Lazy>
                    <AuditingContractPage />
                  </Lazy>
                }
              />
              <Route
                path="compose-email"
                element={
                  <Lazy>
                    <ComposeEmailPage />
                  </Lazy>
                }
              />
              <Route
                path="upload-bullet"
                element={
                  <Lazy>
                    <UploadBulletPage />
                  </Lazy>
                }
              />
              <Route
                path="map-of-agencies"
                element={
                  <Lazy>
                    <MapOfAgenciesPage />
                  </Lazy>
                }
              />
              <Route
                path="map-of-galleries"
                element={
                  <Lazy>
                    <MapOfGalleriesPage />
                  </Lazy>
                }
              />
              <Route
                path="mapit-gallery"
                element={
                  <Lazy>
                    <MapItGalleryPage />
                  </Lazy>
                }
              />
              <Route
                path="mapit-potential"
                element={
                  <Lazy>
                    <MapItPotentialPage />
                  </Lazy>
                }
              />
              <Route
                path="edit-vcc"
                element={
                  <div style={{ padding: '2rem' }}>
                    VCC editor placeholder (P6 beast — not in Wave C scope).
                  </div>
                }
              />
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
