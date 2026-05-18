import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from './components/DashboardLayout.jsx';
import PublicLayout from './components/PublicLayout.jsx';
import { useAuth } from './auth/AuthContext.jsx';

const About = lazy(() => import('./pages/About.jsx'));
const AdminApplications = lazy(() => import('./pages/AdminApplications.jsx'));
const AdminMembers = lazy(() => import('./pages/AdminMembers.jsx'));
const AdminUsers = lazy(() => import('./pages/AdminUsers.jsx'));
const DashboardAnnouncements = lazy(() => import('./pages/DashboardAnnouncements.jsx'));
const DashboardEvents = lazy(() => import('./pages/DashboardEvents.jsx'));
const DashboardHome = lazy(() => import('./pages/DashboardHome.jsx'));
const DashboardResources = lazy(() => import('./pages/DashboardResources.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Join = lazy(() => import('./pages/Join.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const MemberDetail = lazy(() => import('./pages/MemberDetail.jsx'));
const MemberProfile = lazy(() => import('./pages/MemberProfile.jsx'));
const Members = lazy(() => import('./pages/Members.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Resources = lazy(() => import('./pages/Resources.jsx'));

function PageLoader() {
  return (
    <Box sx={{ minHeight: '70dvh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress color="secondary" />
    </Box>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="members" element={<Members />} />
          <Route path="members/:id" element={<MemberDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="join" element={<Join />} />
          <Route path="resources" element={<Resources />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route
            path="members"
            element={
              <ProtectedRoute roles={['admin', 'president']}>
                <AdminMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="applications"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminApplications />
              </ProtectedRoute>
            }
          />
          <Route path="announcements" element={<DashboardAnnouncements />} />
          <Route path="events" element={<DashboardEvents />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route
            path="resources"
            element={
              <ProtectedRoute roles={['admin']}>
                <DashboardResources />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
