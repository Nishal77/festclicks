import { createClient } from '@supabase/supabase-js';

// Use direct values as provided in the example
const supabaseUrl = 'https://xydcmpycampryrvszwxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZGNtcHljYW1wcnlydnN6d3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjk1MzAsImV4cCI6MjA1NjgwNTUzMH0.ZQBzP7qedMM47K2jFmmXg_AAtwM2opA2CU-pvUtXRYk';

console.log('Initializing Supabase client with:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey.substring(0, 10) + '...' });

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a function to test the connection directly
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // First, test raw connection with a ping
    const { data: pingData, error: pingError } = await supabase.rpc('ping');
    
    if (pingError) {
      console.log('Basic ping failed, trying alternate method');
      // Simple query to check auth status
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        console.error('Supabase connection test failed:', authError);
        return { success: false, error: authError, message: 'Failed to connect to Supabase' };
      }
      
      return { 
        success: true, 
        message: 'Connected to Supabase (auth only)',
        authStatus: 'Anonymous' 
      };
    }
    
    // Now try to query the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    // Check if events table exists by attempting a query
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('count')
      .limit(1);
    
    return { 
      success: true, 
      ping: pingData || 'No ping response',
      usersTable: userError ? 'Not accessible' : 'Accessible',
      eventsTable: eventsError ? 'Not accessible' : 'Accessible',
      userError: userError ? userError.message : null,
      eventsError: eventsError ? eventsError.message : null
    };
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to check if a table exists
export const checkTableExists = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
      
    if (error && error.code === '42P01') {
      return false; // Table doesn't exist
    }
    
    return !error; // If no error, table exists
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

// Events related functions
export const fetchEvents = async () => {
  try {
    // First check if the events table exists
    const tableExists = await checkTableExists('events');
    if (!tableExists) {
      console.warn('Events table does not exist yet');
      return [];
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching events:', error);
      return []; // Return empty array in case of error
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return []; // Return empty array in case of any error
  }
};

export const fetchEventById = async (eventId) => {
  try {
    // Check if table exists
    const tableExists = await checkTableExists('events');
    if (!tableExists) {
      console.warn('Events table does not exist yet');
      return null;
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (error) {
      console.error(`Error fetching event with ID ${eventId}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    return null;
  }
};

export const createEvent = async (eventData) => {
  try {
    // Check if events table exists
    const tableExists = await checkTableExists('events');
    if (!tableExists) {
      throw new Error('Events table does not exist. Please set up the database first.');
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select();
    
    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    // Check if events table exists
    const tableExists = await checkTableExists('events');
    if (!tableExists) {
      throw new Error('Events table does not exist. Please set up the database first.');
    }
    
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select();
    
    if (error) {
      console.error(`Error updating event with ID ${eventId}:`, error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error(`Error updating event with ID ${eventId}:`, error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    // Check if events table exists
    const tableExists = await checkTableExists('events');
    if (!tableExists) {
      throw new Error('Events table does not exist. Please set up the database first.');
    }
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (error) {
      console.error(`Error deleting event with ID ${eventId}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting event with ID ${eventId}:`, error);
    throw error;
  }
};

// Media related functions
export const fetchMediaByEventId = async (eventId) => {
  try {
    // Check if media table exists
    const tableExists = await checkTableExists('media');
    if (!tableExists) {
      console.warn('Media table does not exist yet');
      return [];
    }
    
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching media for event ID ${eventId}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching media for event ID ${eventId}:`, error);
    return [];
  }
};

export const saveMediaRecord = async (mediaData) => {
  try {
    // Check if media table exists
    const tableExists = await checkTableExists('media');
    if (!tableExists) {
      throw new Error('Media table does not exist. Please set up the database first.');
    }
    
    const { data, error } = await supabase
      .from('media')
      .insert([mediaData])
      .select();
    
    if (error) {
      console.error('Error saving media record:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Error saving media record:', error);
    throw error;
  }
};

export const deleteMediaRecord = async (mediaId) => {
  try {
    // Check if media table exists
    const tableExists = await checkTableExists('media');
    if (!tableExists) {
      throw new Error('Media table does not exist. Please set up the database first.');
    }
    
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId);
    
    if (error) {
      console.error(`Error deleting media with ID ${mediaId}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting media with ID ${mediaId}:`, error);
    throw error;
  }
}; 