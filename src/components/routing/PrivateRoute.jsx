import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showErrorToast } from '../ui/Toast';

/**
 * A wrapper component for routes that require authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

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

  // If user is authenticated, render the protected component
  return children;
};

export default PrivateRoute; 