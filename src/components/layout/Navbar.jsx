import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X, User, ChevronDown, Sparkles, LogIn, Upload, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import logoImage from '../../assets/logodash.png';
import UploadModal from '../ui/UploadModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { user, userData, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user's name for greeting
  const userName = userData?.name || 'User';

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/');
    } else {
      console.error('Failed to sign out:', result.error);
      // Force redirect to landing page in case of error
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  // Toggle upload modal
  const toggleUploadModal = () => {
    setUploadModalOpen(!uploadModalOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    // Add event listener only if dropdown is open
    if (dropdownOpen) {
      document.addEventListener('click', closeDropdown);
    }

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [dropdownOpen]);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-md border-b border-gray-800/30 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img
                  className="h-10 w-auto"
                  src={logoImage}
                  alt="FestClicks Logo"
                />
              </Link>

              <div className="hidden md:ml-8 md:flex md:items-center md:space-x-6">
                <Link 
                  to="/dashboard" 
                  className={`font-heading px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors ${
                    location.pathname === '/dashboard' ? 'text-white bg-gray-800/50 border-b-2 border-blue-500' : ''
                  }`}
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/events" 
                  className={`font-heading px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors ${
                    location.pathname === '/events' ? 'text-white bg-gray-800/50 border-b-2 border-blue-500' : ''
                  }`}
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  Events
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`font-heading px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-1 ${
                      location.pathname.startsWith('/admin') ? 'text-white bg-gray-800/50 border-b-2 border-blue-500' : ''
                    }`}
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-md border border-white/10 mr-3 font-heading"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    onClick={toggleUploadModal}
                  >
                    <Upload className="mr-2 h-4 w-4" />Upload
                  </Button>
                  
                  <a 
                    href="mailto:contact@festclicks.com" 
                    className="flex items-center justify-center px-3 py-2 mr-3 border border-gray-800/30 bg-black/40 hover:bg-black/60 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2 text-gray-300" />
                    <span className="font-heading text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Contact</span>
                  </a>
                  
                  {/* User avatar with dropdown */}
                  <div className="relative">
                    <button 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 focus:outline-none hover:ring-1 hover:ring-blue-400 transition-all duration-200 border border-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(!dropdownOpen);
                      }}
                    >
                      <span className="text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </button>
                    
                    {/* Dropdown menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-black/90 backdrop-blur-md border border-gray-800/30 z-50 overflow-hidden transition-all duration-300 transform">
                        <div className="py-3 px-4 border-b border-gray-800/30">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border border-white/10">
                              <span className="text-white text-xl font-bold font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-lg font-medium text-white font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {userName}
                              </div>
                              <div className="text-sm text-gray-400 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>{user?.email}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Dropdown items */}
                        <div className="p-2">
                          <a 
                            href="mailto:contact@festclicks.com" 
                            className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-gray-800/50 transition-colors font-sans"
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                          >
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>Contact Support</span>
                          </a>
                          <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 p-2 rounded-md text-white hover:bg-gray-800/50 transition-colors font-sans"
                            style={{ fontFamily: 'Nunito, sans-serif' }}
                          >
                            <LogOut className="h-4 w-4 text-red-400" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-black/90 backdrop-blur-md border-b border-gray-800/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/dashboard'
                    ? 'text-white bg-gray-800/50 border-l-2 border-blue-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                } font-heading`}
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              <Link
                to="/events"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/events'
                    ? 'text-white bg-gray-800/50 border-l-2 border-blue-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                } font-heading`}
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.startsWith('/admin')
                      ? 'text-white bg-gray-800/50 border-l-2 border-blue-500'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  } flex items-center font-heading`}
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
                  Admin
                </Link>
              )}
              
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  toggleUploadModal();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 flex items-center font-heading"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                <Upload className="h-4 w-4 text-gray-400 mr-2" />
                Upload
              </button>
              
              <a
                href="mailto:contact@festclicks.com"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 flex items-center font-heading"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                Contact
              </a>
              
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 flex items-center font-heading"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                <LogOut className="h-4 w-4 text-red-400 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </nav>
      
      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadModal isOpen={uploadModalOpen} onClose={toggleUploadModal} />
      )}
    </>
  );
};

export default Navbar; 