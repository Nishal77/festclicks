import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X, User, ChevronDown, Sparkles, LogIn, Upload, Mail, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import logoImage from '../../assets/logodash.png';
import UploadModal from '../ui/UploadModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { user, userData, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user's name for greeting
  const userName = userData?.name || 'User';

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
        className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-[hsl(var(--input))]"
        style={{ borderWidth: '1px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                <img
                  className="h-9 w-auto"
                  src={logoImage}
                  alt="FestClicks Logo"
                />
                <span className="text-white text-xl font-bold tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  FestClicks
                </span>
              </Link>

              {/* Admin link - only shown for admins */}
              <div className="hidden md:ml-8 md:flex md:items-center md:space-x-6">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center gap-1 ${
                      location.pathname.startsWith('/admin') ? 'text-white bg-gray-800/50 border-b border-[hsl(var(--primary))]' : ''
                    }`}
                    style={{ borderWidth: '1px', fontFamily: 'Inter, sans-serif' }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Button 
                    className="bg-white hover:bg-gray-100 text-black rounded-lg mr-3 border border-[hsl(var(--input))] shadow-md flex items-center gap-2 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                    style={{ borderWidth: '1px', fontFamily: 'Inter, sans-serif' }}
                    onClick={toggleUploadModal}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="font-medium">Upload</span>
                  </Button>
                  
                  {/* User avatar with dropdown */}
                  <div className="relative">
                    <button 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1D1D1D] border focus:outline-none transition-all duration-300 hover:bg-[#232323] hover:border-[#A58EFF]/50 hover:shadow-[0_0_8px_rgba(165,142,255,0.3)]"
                      style={{ borderWidth: '1px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(!dropdownOpen);
                      }}
                    >
                      <span className="text-gray-300 font-bold transition-colors duration-300 group-hover:text-white">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </button>
                    
                    {/* Dropdown menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-black/90 backdrop-blur-md border border-[hsl(var(--input))] z-50 overflow-hidden transition-all duration-300 transform"
                        style={{ borderWidth: '1px' }}>
                        <div className="py-3 px-4 border-b border-[hsl(var(--input))]" style={{ borderWidth: '1px' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center border border-[hsl(var(--input))]" style={{ borderWidth: '1px' }}>
                              <span className="text-[#A58EFF] text-xl font-bold">
                                {userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-lg font-medium text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {userName}
                              </div>
                              <div className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>{user?.email}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Dropdown items */}
                        <div className="p-2">
                          <a 
                            href="mailto:contact@festclicks.com" 
                            className="flex items-center gap-2 p-2 rounded-md text-white hover:bg-gray-800/70 transition-all duration-300 ease-in-out hover:text-[#A58EFF]"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            <Mail className="h-4 w-4 text-gray-400 transition-colors duration-300 group-hover:text-[#A58EFF]" />
                            <span>Contact Support</span>
                          </a>
                          <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 p-2 rounded-md text-white hover:bg-red-900/30 transition-all duration-300 ease-in-out hover:text-red-400"
                            style={{ fontFamily: 'Inter, sans-serif' }}
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
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none transition-all duration-300 ease-in-out"
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
          <div className="sm:hidden bg-black/90 backdrop-blur-md border-b border-[hsl(var(--input))]" style={{ borderWidth: '1px' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.startsWith('/admin')
                      ? 'text-white bg-gray-800/50 border-l border-[hsl(var(--primary))]'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  } flex items-center`}
                  style={{ borderWidth: '1px', fontFamily: 'Inter, sans-serif' }}
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
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 flex items-center transition-all duration-300 ease-in-out"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Camera className="h-4 w-4 text-[#A58EFF] mr-2" />
                Upload
              </button>
              
              <a
                href="mailto:contact@festclicks.com"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 flex items-center transition-all duration-300 ease-in-out"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                Contact
              </a>
              
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-red-300 hover:bg-red-900/30 flex items-center transition-all duration-300 ease-in-out"
                style={{ fontFamily: 'Inter, sans-serif' }}
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