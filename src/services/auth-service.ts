import axios from 'axios';
import { API_URL, SERVER_URL, debugLog } from '../utils/env-config';
import { toast } from 'react-hot-toast';

// Define interfaces for request and response data
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  restaurant?: {
    name: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    contact?: {
      phone: string;
      email: string;
    };
  };
}

interface AuthResponse {
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      restaurantId?: string;
    }
  }
}

// Configure axios with default settings
axios.defaults.withCredentials = true; // Include cookies in requests
axios.defaults.headers.common['Content-Type'] = 'application/json';

// For debugging
debugLog('Auth service initialized with API URL:', API_URL);
debugLog('Server URL:', SERVER_URL);

// After successful login or registration, store the auth data
export const storeAuthData = (response: any): void => {
  debugLog('Storing auth data');
  
  try {
    // Check if response has the expected structure
    if (!response || !response.data) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response structure');
    }
    
    // Log the full response for debugging
    console.log('Full response structure:', JSON.stringify(response.data));
    
    // The actual structure is response.data.data.user and response.data.data.token
    const { status, data } = response.data;
    
    if (status !== 'success' || !data) {
      console.error('Invalid response status or missing data:', response.data);
      throw new Error('Invalid response status or missing data');
    }
    
    const { token, user } = data;
    
    if (!token || !user) {
      console.error('Missing token or user data:', data);
      throw new Error('Missing token or user data');
    }
    
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(user));
    
    // Store restaurant ID separately for easy access
    if (user && user.restaurantId) {
      localStorage.setItem('restaurantId', user.restaurantId);
      debugLog('Restaurant ID stored:', user.restaurantId);
    } else {
      debugLog('No restaurant ID found in user data');
    }
    
    // Set the token in axios default headers for subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    debugLog('Auth data stored successfully');
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw error;
  }
};

// Login function
export const loginRestaurant = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  debugLog('Attempting login with:', credentials.email);
  
  try {
    // First try with relative URL (proxy)
    const apiUrl = API_URL.startsWith('/') ? API_URL : `/${API_URL}`;
    const loginUrl = `${apiUrl}/auth/login`;
    
    debugLog('Making request to:', loginUrl);
    
    try {
      const response = await axios.post(loginUrl, credentials);
      debugLog('Login response:', response);
      storeAuthData(response);
      return response;
    } catch (proxyError) {
      debugLog('Proxy request failed, trying direct connection:', proxyError);
      
      // If proxy fails, try direct connection
      const directUrl = `${SERVER_URL}${API_URL}/auth/login`;
      debugLog('Making direct request to:', directUrl);
      
      const directResponse = await axios.post(directUrl, credentials);
      debugLog('Direct login response:', directResponse);
      storeAuthData(directResponse);
      return directResponse;
    }
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
};

// Register function - updated to use /signup instead of /register
export const registerRestaurant = async (data: RegisterData): Promise<AuthResponse> => {
  debugLog('Attempting registration with:', data.email);
  
  try {
    // First try with relative URL (proxy)
    const apiUrl = API_URL.startsWith('/') ? API_URL : `/${API_URL}`;
    const signupUrl = `${apiUrl}/auth/signup`; // Changed from /register to /signup
    
    debugLog('Making request to:', signupUrl);
    
    try {
      const response = await axios.post(signupUrl, data);
      debugLog('Registration response:', response);
      storeAuthData(response);
      return response;
    } catch (proxyError) {
      debugLog('Proxy request failed, trying direct connection:', proxyError);
      
      // If proxy fails, try direct connection
      const directUrl = `${SERVER_URL}${API_URL}/auth/signup`; // Changed from /register to /signup
      debugLog('Making direct request to:', directUrl);
      
      const directResponse = await axios.post(directUrl, data);
      debugLog('Direct registration response:', directResponse);
      storeAuthData(directResponse);
      return directResponse;
    }
  } catch (error) {
    console.error('Registration error details:', error);
    throw error;
  }
};

// Logout function
export const logoutRestaurant = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  
  // Remove the token from axios default headers
  delete axios.defaults.headers.common['Authorization'];
  
  debugLog('User logged out, auth data cleared');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('authToken') !== null;
};

// Get current user data
export const getCurrentUser = (): any => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Service for handling authentication-related operations
 */
export const AuthService = {
  /**
   * Logs in a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns User data if login successful, null otherwise
   */
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Store auth token if provided
        if (data.data.token) {
          localStorage.setItem('authToken', data.data.token);
        }
        return data.data.user;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logs out the current user
   * @returns True if logout successful, false otherwise
   */
  async logout() {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Clear auth token
        localStorage.removeItem('authToken');
        toast.success('Logged out successfully');
        return true;
      } else {
        throw new Error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error instanceof Error ? error.message : 'Logout failed');
      return false;
    }
  },

  /**
   * Checks if user is currently authenticated
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },
}; 