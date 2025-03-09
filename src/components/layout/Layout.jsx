import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if we're on the landing page or login page
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Only show Navbar if user is logged in and not on public pages */}
      {user && !isPublicPage && <Navbar />}
      
      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 