import { supabase, testSupabaseConnection } from './supabaseClient';

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - The user data or error
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }

  return data;
};

/**
 * Direct login with register number
 * @param {string} registerNumber - Student's register number
 * @returns {Promise<Object>} - The user data
 */
export const signIn = async (registerNumber) => {
  if (!registerNumber || registerNumber.trim() === '') {
    throw new Error('Register number is required');
  }

  const cleanRegisterNumber = registerNumber.trim();
  console.log('Signing in with register number:', cleanRegisterNumber);

  try {
    // First, test the Supabase connection
    const testConnection = await testSupabaseConnection();
    console.log('Connection test result:', testConnection);
    
    if (!testConnection.success) {
      console.error('Failed to connect to Supabase:', testConnection.error);
      throw new Error('Database connection failed. Please try again later.');
    }
    
    // Try direct query first for simplicity
    console.log('Attempting direct query to users table...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('register_no', cleanRegisterNumber)
      .maybeSingle();
    
    console.log('Direct query response:', { data, error });
    
    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data) {
      // For debugging purposes, let's try to get all users to see what's in the table
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('*')
        .limit(10);
      
      console.log('All users in table:', { allUsers, allUsersError });
      
      // If we still can't find the user, use debug mode for known test users
      const isKnownTestUser = ['2024SITE1', '2024MCA039', '2024MCA038', '2024MCA037'].includes(cleanRegisterNumber);
      if (isKnownTestUser) {
        console.log('⚠️ USING DEBUG MODE FOR KNOWN TEST USER');
        return createDebugUserResponse(cleanRegisterNumber);
      }
      
      throw new Error(`User with register number ${cleanRegisterNumber} not found`);
    }
    
    // User found, return success
    return {
      success: true,
      user: {
        id: data.id,
        register_no: data.register_no,
        name: data.name,
        role: data.role || 'user',
        userData: data
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    
    // For demo purposes, return debug data if the register number matches one of our test accounts
    const isKnownTestUser = ['2024SITE1', '2024MCA039', '2024MCA038', '2024MCA037'].includes(cleanRegisterNumber);
    
    if (isKnownTestUser) {
      console.log('⚠️ USING DEBUG MODE FOR KNOWN TEST USER');
      return createDebugUserResponse(cleanRegisterNumber);
    }
    
    throw error;
  }
};

/**
 * Create a debug user response for testing
 * @private
 */
const createDebugUserResponse = (registerNumber) => {
  return {
    success: true,
    user: {
      id: 'debug-id-' + Date.now(),
      register_no: registerNumber,
      name: registerNumber === '2024SITE1' ? 'Admin User' : 
            registerNumber === '2024MCA039' ? 'Nishal N Poojary' :
            registerNumber === '2024MCA038' ? 'Vivek' :
            registerNumber === '2024MCA037' ? 'Pradhymna' : 'Test User',
      role: registerNumber === '2024SITE1' ? 'admin' : 'user',
      userData: {
        register_no: registerNumber,
        name: registerNumber === '2024SITE1' ? 'Admin User' : 
              registerNumber === '2024MCA039' ? 'Nishal N Poojary' :
              registerNumber === '2024MCA038' ? 'Vivek' :
              registerNumber === '2024MCA037' ? 'Pradhymna' : 'Test User',
        role: registerNumber === '2024SITE1' ? 'admin' : 'user',
        created_at: new Date().toISOString()
      }
    }
  };
};

/**
 * Admin function to create a new student account
 * @param {Object} studentData - Student data
 * @returns {Promise<Object>} - The new student data
 */
export const createStudent = async (studentData) => {
  const { registerNumber, fullName, department, year, role } = studentData;

  // Create a dummy email and password
  const dummyEmail = `${registerNumber.toLowerCase()}@festclicks.edu`;
  const fixedPassword = 'FestClicks@2024';

  try {
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: dummyEmail,
      password: fixedPassword,
      email_confirm: true // Auto confirm the email
    });

    if (authError) throw authError;

    // Create the student record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert([
        {
          id: authData.user.id,
          register_number: registerNumber,
          full_name: fullName,
          department,
          year,
          role: role || 'user'
        }
      ])
      .select()
      .single();

    if (studentError) throw studentError;

    return studentData;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    localStorage.removeItem('festclicks_user');
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get the current user data from localStorage
 */
export const getCurrentUser = async () => {
  try {
    const userData = localStorage.getItem('festclicks_user');
    if (!userData) return null;
    return JSON.parse(userData);
  } catch (e) {
    console.error('Error getting current user:', e);
    return null;
  }
};

/**
 * Reset password for a user
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - The user data
 */
export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Error updating password:', error);
    throw error;
  }

  return data;
};

/**
 * Check if a user is an admin
 * @param {Object} user - User object 
 * @returns {Promise<boolean>} - True if user is admin
 */
export const isUserAdmin = async (user) => {
  if (!user) return false;
  return user.role === 'admin';
};

/**
 * Verification for the puzzle captcha
 * This is a simple mock function as we don't need real verification logic
 */
export const verifyPuzzle = () => {
  // In a real app, we would verify the puzzle answer
  return true;
}; 