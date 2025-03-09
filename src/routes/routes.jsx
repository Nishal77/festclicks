import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/user/Dashboard';
import Gallery from '../pages/user/Gallery';
import NotFound from '../pages/user/NotFound';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageEvents from '../pages/admin/ManageEvents';
import ProtectedRoute from '../components/shared/ProtectedRoute';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/gallery/:eventId',
    element: (
      <ProtectedRoute>
        <Gallery />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/events',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <ManageEvents />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default routes; 