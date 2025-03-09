import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import PuzzleVerification from '../components/auth/PuzzleVerification';
import { testSupabaseConnection } from '../services/supabaseClient';
import Toast, { showErrorToast, showSuccessToast, showInfoToast, showLoadingToast, dismissToast } from '../components/ui/Toast';
import logoImage from '../assets/logoLogin.png'; // Import the new logo

// Security measures - reasonable limits
const MAX_LOGIN_ATTEMPTS = 6;
const LOCKOUT_TIME = 3 * 60 * 1000; // 3 minutes

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [registerNumber, setRegisterNumber] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  // Check for lockout on load
  useEffect(() => {
    const lockedUntil = localStorage.getItem('lockoutUntil');
    const attemptCount = localStorage.getItem('loginAttempts');
    
    if (lockedUntil && parseInt(lockedUntil) > Date.now()) {
      setIsLockedOut(true);
      setLockoutEndTime(parseInt(lockedUntil));
    }
    
    if (attemptCount) {
      setLoginAttempts(parseInt(attemptCount));
    }
    
    // Clean up any old lockouts
    if (lockedUntil && parseInt(lockedUntil) <= Date.now()) {
      localStorage.removeItem('lockoutUntil');
      localStorage.setItem('loginAttempts', '0');
    }
  }, []);
  
  // Handle lockout timer
  useEffect(() => {
    let timer;
    if (isLockedOut && lockoutEndTime) {
      timer = setInterval(() => {
        if (Date.now() >= lockoutEndTime) {
          setIsLockedOut(false);
          localStorage.removeItem('lockoutUntil');
          setLoginAttempts(0);
          localStorage.setItem('loginAttempts', '0');
          clearInterval(timer);
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLockedOut, lockoutEndTime]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Handle register number submission
  const handleRegisterSubmit = async (regNumber) => {
    try {
      // Check if account is locked out
      if (isLockedOut) {
        const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60);
        showErrorToast(`Account is locked. Try again in ${remainingTime} minutes.`);
        return;
      }
      
      setError(null);
      setLoading(true);
      setRegisterNumber(regNumber);
      
      // Check if max attempts reached
      if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_TIME;
        setIsLockedOut(true);
        setLockoutEndTime(lockoutEnd);
        localStorage.setItem('lockoutUntil', lockoutEnd.toString());
        
        setError(`Too many login attempts. Account is locked for ${LOCKOUT_TIME/60000} minutes.`);
        showErrorToast('Too many login attempts. Account is locked.');
        setLoading(false);
        return;
      }
      
      // Show verification puzzle for all users
      setShowPuzzle(true);
      setLoading(false);
      showInfoToast('Please complete the verification slider');
    } catch (err) {
      console.error('Login error:', err);
      showErrorToast('Login error: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  // Handle captcha verification completion
  const handleVerification = async (token) => {
    try {
      setError(null);
      // Show loading toast that will be dismissed on completion
      const loadingToast = showLoadingToast('Signing in...');
      setLoading(true);

      // Attempt to sign in with the verified register number
      const result = await signIn(registerNumber);

      // Dismiss the loading toast
      dismissToast(loadingToast);

      if (!result.success) {
        setError(result.error);
        showErrorToast('Login failed: ' + (result.error || 'Unknown error'));
        setShowPuzzle(false);
        
        // Increment login attempt counter
        const newAttemptCount = loginAttempts + 1;
        setLoginAttempts(newAttemptCount);
        localStorage.setItem('loginAttempts', newAttemptCount.toString());
      } else {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.setItem('loginAttempts', '0');
        
        showSuccessToast('Login successful! Welcome to FestClicks');
        
        // Small delay for the toast to be visible
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      console.error('Error during login:', err);
      showErrorToast('Login error: ' + (err.message || 'Unknown error'));
      setShowPuzzle(false);
      
      // Increment login attempt counter
      const newAttemptCount = loginAttempts + 1;
      setLoginAttempts(newAttemptCount);
      localStorage.setItem('loginAttempts', newAttemptCount.toString());
    } finally {
      setLoading(false);
    }
  };

  // Return to register number input
  const handleCancelVerification = () => {
    setShowPuzzle(false);
    setError(null);
  };

  // Handle test connection button
  const handleTestConnection = async () => {
    try {
      setLoading(true);
      setDebugInfo('Testing connection...');
      
      const result = await testSupabaseConnection();
      
      setDebugInfo(JSON.stringify(result, null, 2));
      setShowDebug(true);
    } catch (err) {
      console.error('Connection test error:', err);
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format remaining lockout time
  const formatLockoutTime = () => {
    if (!lockoutEndTime) return '';
    
    const remainingMs = lockoutEndTime - Date.now();
    if (remainingMs <= 0) return 'Unlocking...';
    
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-0 text-white font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <Toast />
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-8 h-32 w-32 overflow-hidden rounded-2xl bg-[#2a2a2a] flex items-center justify-center p-2">
            <img 
              src={logoImage} 
              alt="FestClicks Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-center text-3xl font-medium font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            WELCOME TO FESTCLICKS!
          </h1>
          <p className="mt-2 text-center text-gray-400 mb-4 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Please sign in with your register number
          </p>
          
          {error && (
            <div className="text-red-400 text-sm mb-4 px-4 py-2 bg-red-900 bg-opacity-20 rounded-md font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {error}
            </div>
          )}
          
          {isLockedOut && (
            <div className="text-red-400 text-sm mb-4 px-4 py-2 bg-red-900 bg-opacity-20 rounded-md font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Account locked. Try again in {formatLockoutTime()}
            </div>
          )}
        </div>

        <div className="px-0">
          {showPuzzle ? (
            <PuzzleVerification 
              onVerify={handleVerification} 
              onCancel={handleCancelVerification} 
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegisterSubmit}
              loading={loading}
              disabled={isLockedOut}
              error={null} // We're handling errors above
            />
          )}
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
          <p>Demo accounts: 2024MCA039, 2024MCA038, 2024SITE1 (admin)</p>
          <p className="mt-2">
            By signing in, you agree to our{" "}
            <Link to="#" className="text-gray-400 underline hover:text-white">
              Terms of Service
            </Link>
          </p>
          
          {/* Debug section - hidden in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <button
                onClick={handleTestConnection}
                disabled={loading}
                className="text-xs text-gray-400 hover:text-white font-heading" 
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                TEST DATABASE CONNECTION
              </button>
              
              {showDebug && debugInfo && (
                <div className="mt-4">
                  <div className="bg-gray-900 p-3 rounded text-left text-xs overflow-auto max-h-40 font-mono">
                    <pre>{debugInfo}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 