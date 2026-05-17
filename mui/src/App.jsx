import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from './components/DashboardLayout.jsx';
import PublicLayout from './components/PublicLayout.jsx';
import { useAuth } from './auth/AuthContext.jsx';
import About from './pages/About.jsx';
import AdminApplications from './pages/AdminApplications.jsx';
import AdminMembers from './pages/AdminMembers.jsx';
import DashboardAnnouncements from './pages/DashboardAnnouncements.jsx';
import DashboardEvents from './pages/DashboardEvents.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import DashboardResources from './pages/DashboardResources.jsx';
import Events from './pages/Events.jsx';
import Home from './pages/Home.jsx';
import Join from './pages/Join.jsx';
import Login from './pages/Login.jsx';
import MemberDetail from './pages/MemberDetail.jsx';
import MemberProfile from './pages/MemberProfile.jsx';
import Members from './pages/Members.jsx';
import NotFound from './pages/NotFound.jsx';
import Resources from './pages/Resources.jsx';

function PageLoader() {
  return (
    <Box sx={{ minHeight: '70dvh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress color="secondary" />
    </Box>
  );
}

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
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
            <ProtectedRoute role="admin">
              <AdminMembers />
            </ProtectedRoute>
          }
        />
        <Route
          path="applications"
          element={
            <ProtectedRoute role="admin">
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
            <ProtectedRoute role="admin">
              <DashboardResources />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
