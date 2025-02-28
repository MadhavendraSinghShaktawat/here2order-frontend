import axios from 'axios';
import { debugLog } from './env-config';

// Initialize authentication state from localStorage
export const initializeAuthState = (): void => {
  debugLog('Initializing auth state');
  
  try {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Set the token in axios default headers for all subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      debugLog('Auth token found and set in axios headers');
    } else {
      debugLog('No auth token found in localStorage');
    }
  } catch (error) {
    console.error('Error initializing auth state:', error);
  }
}; 