import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showErrorToast } from '../ui/Toast';

/**
 * A wrapper component for routes that require admin privileges
 * Redirects to dashboard if user is not an admin
 */
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  // If auth is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    showErrorToast('Please log in to access this page');
    return <Navigate to="/login" replace />;
  }

  // If user is not an admin, redirect to dashboard
  if (!isAdmin) {
    showErrorToast('Access denied: Admin privileges required');
    return <Navigate to="/dashboard" replace />;
  }

  // If user is an admin, render the protected component
  return children;
};

export default AdminRoute; 