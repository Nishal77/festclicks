import { createContext, useContext, useState, useEffect } from 'react';
import { signIn as authSignIn, signOut as authSignOut, getCurrentUser, isUserAdmin } from '../services/authService';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get user data from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const savedUser = localStorage.getItem('festclicks_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('Loaded user from storage:', parsedUser);
          
          // Make sure we have proper data
          if (parsedUser && parsedUser.register_no) {
            setUser(parsedUser);
            setUserData(parsedUser.userData);
            const adminStatus = await isUserAdmin(parsedUser);
            setIsAdmin(adminStatus);
          } else {
            console.warn('Invalid user data in localStorage:', parsedUser);
            localStorage.removeItem('festclicks_user');
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('festclicks_user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in with register number
  const signIn = async (registerNumber) => {
    try {
      console.log('AuthContext: Signing in with register number:', registerNumber);
      
      // Call the authentication service
      const result = await authSignIn(registerNumber);
      console.log('AuthContext: Sign in result:', result);
      
      if (result && result.success && result.user) {
        // Validate user data
        if (!result.user.register_no) {
          console.error('Missing register_no in user data:', result.user);
          throw new Error('Invalid user data received from authentication service');
        }
        
        // Save user data
        setUser(result.user);
        setUserData(result.user.userData);
        const adminStatus = await isUserAdmin(result.user);
        setIsAdmin(adminStatus);
        
        // Save to localStorage for persistence
        localStorage.setItem('festclicks_user', JSON.stringify(result.user));
        
        return { success: true, data: result };
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (error) {
      console.error('Error in AuthContext signIn:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await authSignOut();
      
      // Clear all user data
      setUser(null);
      setUserData(null);
      setIsAdmin(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  };

  // Auth context value
  const value = {
    user,
    loading,
    isAdmin,
    userData,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 