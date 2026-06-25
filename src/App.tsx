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
const SearchQAPage = lazy(() => import('@/features/search-qa/SearchQAPage'));
const AddUsersPage = lazy(() => import('@/features/user-mgmt/AddUsersPage'));
const EditUsersPage = lazy(() => import('@/features/user-mgmt/EditUsersPage'));
const ManageUserPage = lazy(() => import('@/features/user-mgmt/UserListPage'));
const ManageAdminPage = lazy(() => import('@/features/user-mgmt/ManageAdminPage'));
const AddAgencyManagerPage = lazy(() => import('@/features/user-mgmt/AddAgencyManagerPage'));
const AddAgenciesPage = lazy(() => import('@/features/agency-mgmt/AddAgenciesPage'));
const EditAgencyPage = lazy(() => import('@/features/agency-mgmt/EditAgencyPage'));
const AgencySettingPage = lazy(() => import('@/features/agency-mgmt/AgencySettingPage'));
const ContractManagementPage = lazy(() => import('@/features/agency-mgmt/ContractManagementPage'));
const ManageSharingAgenciesPage = lazy(
  () => import('@/features/agency-mgmt/ManageSharingAgenciesPage')
);
const AuditAllTransactionsPage = lazy(() => import('@/features/audit/AuditAllTransactionsPage'));
const LoginAuditingPage = lazy(() => import('@/features/audit/LoginAuditingPage'));
const InformationAuditingPage = lazy(() => import('@/features/audit/InformationAuditingPage'));
const AdminShareToAgenciesPage = lazy(() => import('@/features/sharing/AdminShareToAgenciesPage'));
const AgencyShareToAdminPage = lazy(() => import('@/features/sharing/AgencyShareToAdminPage'));
const GlobalHotlistSharingPage = lazy(() => import('@/features/sharing/GlobalHotlistSharingPage'));
const SharingProfilesPage = lazy(() => import('@/features/sharing/SharingProfilesPage'));
const DashboardVCCPage = lazy(() => import('@/features/sharing/DashboardVCCPage'));
const UserManagementCombinedPage = lazy(() => import('@/features/sharing/UserManagementPage'));
const EditGalleryPage = lazy(() => import('@/features/galleries/EditGalleryPage'));
const SearchGalleriesPage = lazy(() => import('@/features/galleries/GalleryListPage'));
const ViewDetailsPage = lazy(() => import('@/features/galleries/ViewDetailsPage'));
const SearchCSAUploadedPage = lazy(() => import('@/features/galleries/SearchCSAUploadedPage'));
const DetectionInfoPage = lazy(() => import('@/features/galleries/DetectionInfoPage'));
const SummaryPotentialLinksPage = lazy(
  () => import('@/features/galleries/SummaryPotentialLinksPage')
);
const UserProfilesPage = lazy(() => import('@/features/user-profile/UserProfilesPage'));
const GalleryMapPage = lazy(() => import('@/features/gallery-map/GalleryMapPage'));
const VCCPage = lazy(() => import('@/features/vcc/VCCPage'));
const ProbeMatchesInfoPage = lazy(() => import('@/features/probe-face/ProbeMatchesInfoPage'));
const SearchFaceInfoPage = lazy(() => import('@/features/probe-face/SearchFaceInfoPage'));
const QuickSearchPage = lazy(() => import('@/features/quick-search/QuickSearchPage'));
const PreviewAnalysisPage = lazy(() => import('@/features/image-editor/PreviewAnalysisPage'));
const ImageComparePage = lazy(() => import('@/features/image-editor/ImageComparePage'));
const Image2DComparePage = lazy(() => import('@/features/image-editor/Image2DComparePage'));
const ImageStandardizePage = lazy(() => import('@/features/image-editor/ImageStandardizePage'));

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
                path="search-qa"
                element={
                  <Lazy>
                    <SearchQAPage />
                  </Lazy>
                }
              />
              <Route
                path="add-users"
                element={
                  <Lazy>
                    <AddUsersPage />
                  </Lazy>
                }
              />
              <Route
                path="edit-users"
                element={
                  <Lazy>
                    <EditUsersPage />
                  </Lazy>
                }
              />
              <Route
                path="manage-users"
                element={
                  <Lazy>
                    <ManageUserPage />
                  </Lazy>
                }
              />
              <Route
                path="manage-admins"
                element={
                  <Lazy>
                    <ManageAdminPage />
                  </Lazy>
                }
              />
              <Route
                path="add-agency-manager"
                element={
                  <Lazy>
                    <AddAgencyManagerPage />
                  </Lazy>
                }
              />
              <Route
                path="add-agencies"
                element={
                  <Lazy>
                    <AddAgenciesPage />
                  </Lazy>
                }
              />
              <Route
                path="edit-agency"
                element={
                  <Lazy>
                    <EditAgencyPage />
                  </Lazy>
                }
              />
              <Route
                path="agency-setting"
                element={
                  <Lazy>
                    <AgencySettingPage />
                  </Lazy>
                }
              />
              <Route
                path="contract-management"
                element={
                  <Lazy>
                    <ContractManagementPage />
                  </Lazy>
                }
              />
              <Route
                path="manage-sharing-agencies"
                element={
                  <Lazy>
                    <ManageSharingAgenciesPage />
                  </Lazy>
                }
              />
              <Route
                path="audit-all-transactions"
                element={
                  <Lazy>
                    <AuditAllTransactionsPage />
                  </Lazy>
                }
              />
              <Route
                path="login-auditing"
                element={
                  <Lazy>
                    <LoginAuditingPage />
                  </Lazy>
                }
              />
              <Route
                path="information-auditing"
                element={
                  <Lazy>
                    <InformationAuditingPage />
                  </Lazy>
                }
              />
              <Route
                path="admin-share-to-agencies"
                element={
                  <Lazy>
                    <AdminShareToAgenciesPage />
                  </Lazy>
                }
              />
              <Route
                path="agency-share-to-admin"
                element={
                  <Lazy>
                    <AgencyShareToAdminPage />
                  </Lazy>
                }
              />
              <Route
                path="global-hotlist-sharing"
                element={
                  <Lazy>
                    <GlobalHotlistSharingPage />
                  </Lazy>
                }
              />
              <Route
                path="sharing-profiles"
                element={
                  <Lazy>
                    <SharingProfilesPage />
                  </Lazy>
                }
              />
              <Route
                path="dashboard-vcc"
                element={
                  <Lazy>
                    <DashboardVCCPage />
                  </Lazy>
                }
              />
              <Route
                path="user-management"
                element={
                  <Lazy>
                    <UserManagementCombinedPage />
                  </Lazy>
                }
              />
              <Route
                path="edit-gallery"
                element={
                  <Lazy>
                    <EditGalleryPage />
                  </Lazy>
                }
              />
              <Route
                path="search-galleries"
                element={
                  <Lazy>
                    <SearchGalleriesPage />
                  </Lazy>
                }
              />
              <Route
                path="view-details"
                element={
                  <Lazy>
                    <ViewDetailsPage />
                  </Lazy>
                }
              />
              <Route
                path="search-csa-uploaded"
                element={
                  <Lazy>
                    <SearchCSAUploadedPage />
                  </Lazy>
                }
              />
              <Route
                path="detection-info"
                element={
                  <Lazy>
                    <DetectionInfoPage />
                  </Lazy>
                }
              />
              <Route
                path="summary-potential-links"
                element={
                  <Lazy>
                    <SummaryPotentialLinksPage />
                  </Lazy>
                }
              />
              <Route
                path="user-profile"
                element={
                  <Lazy>
                    <UserProfilesPage />
                  </Lazy>
                }
              />
              <Route
                path="gallery-map"
                element={
                  <Lazy>
                    <GalleryMapPage />
                  </Lazy>
                }
              />
              <Route
                path="vcc"
                element={
                  <Lazy>
                    <VCCPage />
                  </Lazy>
                }
              />
              <Route
                path="probe-matches-info"
                element={
                  <Lazy>
                    <ProbeMatchesInfoPage />
                  </Lazy>
                }
              />
              <Route
                path="search-face-info"
                element={
                  <Lazy>
                    <SearchFaceInfoPage />
                  </Lazy>
                }
              />
              <Route
                path="quick-search"
                element={
                  <Lazy>
                    <QuickSearchPage />
                  </Lazy>
                }
              />
              <Route
                path="preview-analysis"
                element={
                  <Lazy>
                    <PreviewAnalysisPage />
                  </Lazy>
                }
              />
              <Route
                path="image-compare"
                element={
                  <Lazy>
                    <ImageComparePage />
                  </Lazy>
                }
              />
              <Route
                path="image-2d-compare"
                element={
                  <Lazy>
                    <Image2DComparePage />
                  </Lazy>
                }
              />
              <Route
                path="image-standardize"
                element={
                  <Lazy>
                    <ImageStandardizePage />
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
