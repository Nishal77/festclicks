import { useState, useRef } from 'react';

const RegisterForm = ({ onSubmit, loading, error, disabled }) => {
  const [registerNumber, setRegisterNumber] = useState('');
  const [validationError, setValidationError] = useState(null);
  const inputRef = useRef(null);
  
  const validateRegisterNumber = (value) => {
    // Basic validation - ensuring the register number matches expected format
    if (!value.trim()) {
      return 'Register number is required';
    }
    
    // Check max length (database column is VARCHAR(20))
    if (value.trim().length > 20) {
      return 'Register number cannot exceed 20 characters';
    }
    
    // Check if the input has the expected format for a register number (alphanumeric)
    if (!/^[0-9A-Z]{5,15}$/.test(value.trim())) {
      return 'Register number should contain only letters and numbers (5-15 characters)';
    }
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate register number
    const error = validateRegisterNumber(registerNumber);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError(null);
    // Submit the form
    onSubmit(registerNumber);
  };

  // Handle field change
  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().trim();
    setRegisterNumber(value);
    
    // Live validation feedback as user types
    setValidationError(validateRegisterNumber(value));
  };

  return (
    <form 
      className="w-full font-sans" 
      style={{ fontFamily: 'Nunito, sans-serif' }}
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label htmlFor="register-number" className="block text-sm text-gray-400 mb-2 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Register Number
        </label>
        <input
          id="register-number"
          name="registerNumber"
          type="text"
          autoComplete="off"
          required
          ref={inputRef}
          className={`w-full rounded-md border ${validationError ? 'border-red-500' : 'border-gray-800'} bg-[#111] px-4 py-3 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-sans text-base`}
          style={{ fontFamily: 'Nunito, sans-serif' }}
          placeholder="Your register number"
          value={registerNumber}
          onChange={handleChange}
          disabled={loading || disabled}
          autoFocus
          // HTML autocomplete attributes
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck="false"
        />
        <p className="mt-2 text-xs text-gray-500 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Enter your college-provided register number (e.g. 2024MCA039)
        </p>
      </div>

      {/* Error message */}
      {(error || validationError) && (
        <div className="text-red-400 text-sm mb-4 font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {validationError || error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || validationError || disabled}
        className="w-full rounded-md bg-white py-3 text-center font-medium text-black hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed font-heading transition-colors duration-200"
        style={{ fontFamily: 'Bebas Neue, sans-serif' }}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            PROCESSING...
          </span>
        ) : (
          'SIGN IN'
        )}
      </button>
      
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-black px-4 text-gray-500 font-heading" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>EXAMPLES</span>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center font-sans" style={{ fontFamily: 'Nunito, sans-serif' }}>
        <p>Sample register numbers: 2024MCA039, 2024MCA038, 2024SITE1</p>
        <p className="mt-1">Your register number is provided by your college administration</p>
      </div>
    </form>
  );
};

export default RegisterForm; 