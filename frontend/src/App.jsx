import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLoader } from './components/ui/Loader.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import useAuthStore from './store/authStore.js';
import useSocket from './hooks/useSocket.js';

// ─── Public pages ─────────────────────────────────────────────────────────────
const HomePage           = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage          = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage       = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage.jsx'));

// Public browsing (no login required)
const FindCreatorsPage   = lazy(() => import('./pages/creators/FindCreatorsPage.jsx'));
const CreatorProfilePage = lazy(() => import('./pages/creators/CreatorProfilePage.jsx'));
const FindCampaignsPage  = lazy(() => import('./pages/campaigns/FindCampaignsPage.jsx'));
const CampaignDetailPage = lazy(() => import('./pages/campaigns/CampaignDetailPage.jsx'));

// ─── Auth pages ───────────────────────────────────────────────────────────────
const ProfileSetupPage   = lazy(() => import('./pages/auth/ProfileSetupPage.jsx'));

// ─── Creator-only ─────────────────────────────────────────────────────────────
const CreatorDashboard   = lazy(() => import('./pages/dashboard/CreatorDashboard.jsx'));
const MyProfilePage      = lazy(() => import('./pages/creator/MyProfilePage.jsx'));
const MyApplicationsPage = lazy(() => import('./pages/applications/MyApplicationsPage.jsx'));

// ─── Business-only ────────────────────────────────────────────────────────────
const BusinessDashboard         = lazy(() => import('./pages/dashboard/BusinessDashboard.jsx'));
const CreateCampaignPage        = lazy(() => import('./pages/campaigns/CreateCampaignPage.jsx'));
const MyCampaignsPage           = lazy(() => import('./pages/campaigns/MyCampaignsPage.jsx'));
const CampaignApplicationsPage  = lazy(() => import('./pages/applications/CampaignApplicationsPage.jsx'));

// ─── Shared protected ─────────────────────────────────────────────────────────
const MessagesPage = lazy(() => import('./pages/messages/MessagesPage.jsx'));

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const user        = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const getMe       = useAuthStore((s) => s.getMe);
  const [isInitializing, setIsInitializing] = useState(true);

  // Keep socket connected whenever the logged-in user changes
  useSocket(user);

  // Restore session on hard refresh when an access token is already in memory
  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        try { await getMe(); } catch { /* expired — authStore clears itself */ }
      }
      setIsInitializing(false);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isInitializing) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Fully public ──────────────────────────────────────────────── */}
        <Route path="/"            element={<HomePage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/creators"    element={<FindCreatorsPage />} />
        <Route path="/creators/:id" element={<CreatorProfilePage />} />
        <Route path="/campaigns"   element={<FindCampaignsPage />} />
        {/* /campaigns/create must appear BEFORE /campaigns/:id so the static
            segment wins the ranking match */}
        <Route path="/campaigns/create" element={
          <ProtectedRoute allowedRoles={['business']}>
            <CreateCampaignPage />
          </ProtectedRoute>
        } />
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />

        {/* ── Any authenticated user ────────────────────────────────────── */}
        <Route path="/profile-setup" element={
          <ProtectedRoute>
            <ProfileSetupPage />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
        <Route path="/messages/:userId" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />

        {/* ── Creator-only ──────────────────────────────────────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['creator']}>
            <CreatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/my-profile" element={
          <ProtectedRoute allowedRoles={['creator']}>
            <MyProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/my-applications" element={
          <ProtectedRoute allowedRoles={['creator']}>
            <MyApplicationsPage />
          </ProtectedRoute>
        } />

        {/* ── Business-only ─────────────────────────────────────────────── */}
        <Route path="/business-dashboard" element={
          <ProtectedRoute allowedRoles={['business']}>
            <BusinessDashboard />
          </ProtectedRoute>
        } />
        <Route path="/campaigns/:id/edit" element={
          <ProtectedRoute allowedRoles={['business']}>
            <CreateCampaignPage isEdit />
          </ProtectedRoute>
        } />
        <Route path="/my-campaigns" element={
          <ProtectedRoute allowedRoles={['business']}>
            <MyCampaignsPage />
          </ProtectedRoute>
        } />
        <Route path="/campaigns/:id/applications" element={
          <ProtectedRoute allowedRoles={['business']}>
            <CampaignApplicationsPage />
          </ProtectedRoute>
        } />

        {/* ── 404 ───────────────────────────────────────────────────────── */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />

      </Routes>
    </Suspense>
  );
}

export default App;
