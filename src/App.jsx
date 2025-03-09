import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/user/Dashboard';
import Gallery from './pages/user/Gallery';
import NotFound from './pages/user/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import Toast from './components/ui/Toast';
import './App.css';

// Layout component with conditional Navbar and Footer
const Layout = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toast />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout showNavbar={false} showFooter={false}><LandingPage /></Layout>} />
          <Route path="/login" element={<Layout showNavbar={false} showFooter={false}><Login /></Layout>} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <Layout>
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </Layout>
            } 
          />
          <Route 
            path="/gallery/:eventId" 
            element={
              <Layout>
                <PrivateRoute>
                  <Gallery />
                </PrivateRoute>
              </Layout>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <Layout>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </Layout>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <Layout>
                <AdminRoute>
                  <ManageEvents />
                </AdminRoute>
              </Layout>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Layout showNavbar={false} showFooter={false}><NotFound /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
