import { useState, useEffect, useRef } from 'react';
import { showErrorToast, showInfoToast, showSuccessToast } from '../ui/Toast';

// Enhanced slider captcha component for login verification
const PuzzleVerification = ({ onVerify, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [targetPosition, setTargetPosition] = useState(Math.floor(Math.random() * 60) + 20); // 20% to 80%
  const [remainingTime, setRemainingTime] = useState(30); // 30 seconds countdown
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [puzzleKey, setPuzzleKey] = useState(Date.now()); // For forcing re-render
  const [puzzleImage, setPuzzleImage] = useState('');
  const [puzzleImageLoaded, setPuzzleImageLoaded] = useState(false);
  const [puzzleLoading, setPuzzleLoading] = useState(true);
  
  // Puzzle container ref for measurements
  const puzzleContainerRef = useRef(null);
  
  // Enhanced security - generate a verification token
  const [verificationToken, setVerificationToken] = useState('');
  
  // Generate a verification token and select a random image
  useEffect(() => {
    const generateToken = () => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 10);
      return `${timestamp}-${random}`;
    };
    
    setVerificationToken(generateToken());
    
    // Generate random puzzle image
    setPuzzleLoading(true);
    const imageNumber = Math.floor(Math.random() * 1000);
    const categories = ['nature', 'animals', 'architecture', 'technology', 'art'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const imageUrl = `https://source.unsplash.com/featured/600x400?sig=${imageNumber}&${randomCategory}`;
    
    const img = new Image();
    img.onload = () => {
      setPuzzleImage(imageUrl);
      setPuzzleImageLoaded(true);
      setPuzzleLoading(false);
    };
    img.onerror = () => {
      // Fallback to a solid color with pattern if image fails to load
      setPuzzleImage('');
      setPuzzleImageLoaded(true);
      setPuzzleLoading(false);
    };
    img.src = imageUrl;
  }, [puzzleKey]);
  
  // Handle countdown timer
  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onCancel(); // Timeout - go back to login
          showInfoToast('Verification time expired');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [onCancel, puzzleKey]);

  // Handle slider change
  const handleSliderChange = (e) => {
    if (success) return; // Prevent moving after success
    setSliderValue(e.target.value);
  };
  
  // Handle slider release
  const handleSliderRelease = () => {
    if (success) return; // Prevent verification after success
    
    // Increment attempt counter
    setAttempts(prev => prev + 1);
    
    if (attempts >= 3) {
      showErrorToast('Too many failed attempts. Please try again later.');
      // Wait a moment before returning to login
      setTimeout(() => {
        onCancel();
      }, 1500);
      return;
    }
    
    // Check if slider is close to target
    const tolerance = 5; // 5% tolerance
    if (Math.abs(parseInt(sliderValue) - targetPosition) <= tolerance) {
      setSuccess(true);
      showSuccessToast('Verification successful!');
      
      // Success! Wait a moment, then submit
      setTimeout(() => {
        onVerify(verificationToken);
      }, 800);
    } else {
      showErrorToast('Verification failed. Please try again.');
      // Reset slider but keep the same target
      setSliderValue(0);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    setPuzzleKey(Date.now());
    setSliderValue(0);
    setTargetPosition(Math.floor(Math.random() * 60) + 20);
    setPuzzleImageLoaded(false);
    setPuzzleLoading(true);
    setSuccess(false);
    showInfoToast('Verification reset. Try again.');
  };
  
  // Handle verify button click
  const handleVerifyClick = () => {
    if (!success || loading) return;
    
    setLoading(true);
    // Pass verification token back to parent
    setTimeout(() => {
      onVerify(verificationToken);
    }, 500);
  };

  // Puzzle piece dimensions
  const puzzlePieceWidth = 40;
  const puzzlePieceHeight = 40;

  return (
    <div className="bg-gray-900 bg-opacity-40 rounded-lg border border-gray-800 p-5 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <div className="text-center mb-4">
        <h3 className="text-xl text-white mb-2 font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>SECURITY VERIFICATION</h3>
        <p className="text-gray-400 text-sm font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Slide the puzzle piece to complete the verification
        </p>
      </div>

      <div className="text-center mb-1">
        <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-white text-sm font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Time remaining: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Puzzle container */}
      <div 
        ref={puzzleContainerRef}
        className="relative h-40 bg-gray-800 rounded-lg mb-5 overflow-hidden"
      >
        {puzzleLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Background image or pattern */}
            {puzzleImage ? (
              <img 
                src={puzzleImage} 
                alt="Verification puzzle" 
                className="w-full h-full object-cover"
                onLoad={() => setPuzzleImageLoaded(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
            )}
            
            {/* Target zone indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-yellow-500 opacity-70"
              style={{ left: `${targetPosition}%` }}
            ></div>
            
            {/* The puzzle piece that slides */}
            <div 
              className={`absolute top-0 bottom-0 w-10 flex items-center justify-center transition-all duration-100
                ${success ? 'bg-green-600' : 'bg-blue-600'} cursor-pointer opacity-80`}
              style={{ left: `calc(${sliderValue}% - 20px)` }}
            >
              <div className="w-6 h-12 flex flex-col justify-between">
                <div className="w-full h-2 bg-white rounded-full"></div>
                <div className="w-full h-2 bg-white rounded-full"></div>
                <div className="w-full h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Slider control */}
      <div className="mb-5">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderValue} 
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          disabled={success || loading}
        />
        
        <div className="text-center mt-2">
          <p className="text-sm text-gray-400 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {success ? 'Verification successful!' : 'Slide to match the position'}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-700 rounded text-gray-300 hover:text-white hover:border-gray-600 transition-colors font-heading"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          CANCEL
        </button>
        
        <button
          onClick={handleVerifyClick}
          disabled={!success || loading}
          className={`px-5 py-2 rounded font-medium transition-colors font-heading ${
            success 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              <span>VERIFYING...</span>
            </div>
          ) : 'PROCEED'}
        </button>
      </div>
      
      {attempts > 0 && (
        <div className="mt-3 text-xs text-center">
          <p className={`${attempts >= 3 ? 'text-red-400' : 'text-gray-500'} font-sans`} style={{ fontFamily: 'Nunito, sans-serif' }}>
            {attempts >= 3 ? 'Too many failed attempts' : `Attempts: ${attempts}/3`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PuzzleVerification; 