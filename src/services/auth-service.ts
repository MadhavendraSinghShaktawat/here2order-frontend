import axios from 'axios';
import { API_URL, SERVER_URL, DEBUG, debugLog } from '../utils/env-config';

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
export const storeAuthData = (response: AuthResponse): void => {
  debugLog('Storing auth data');
  
  try {
    // Store token in localStorage
    localStorage.setItem('authToken', response.data.token);
    
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(response.data.user));
    
    // Set the token in axios default headers for subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
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