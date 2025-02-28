import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { SERVER_URL, API_URL, debugLog } from './env-config';

// Enhanced API debugging utility
export const debugApiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  useProxy: boolean = true
): Promise<any> => {
  const fullEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = useProxy 
    ? `${API_URL}${fullEndpoint}` 
    : `${SERVER_URL}${API_URL}${fullEndpoint}`;
  
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    validateStatus: () => true, // Don't throw on any status code
  };
  
  debugLog(`[DEBUG API] Making ${method} request to: ${url}`);
  if (data) {
    debugLog(`[DEBUG API] Request payload:`, JSON.stringify(data, null, 2));
  }
  
  try {
    const response = await axios(config);
    
    debugLog(`[DEBUG API] Response status: ${response.status}`);
    debugLog(`[DEBUG API] Response headers:`, response.headers);
    debugLog(`[DEBUG API] Response data:`, response.data);
    
    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      data: response.data,
      headers: response.headers,
      response
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    debugLog(`[DEBUG API] Request failed:`, axiosError.message);
    if (axiosError.response) {
      debugLog(`[DEBUG API] Response status: ${axiosError.response.status}`);
      debugLog(`[DEBUG API] Response data:`, axiosError.response.data);
    }
    
    return {
      success: false,
      error: axiosError,
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data
    };
  }
};

// Test registration with detailed debugging
export const debugRegistration = async (userData: any): Promise<any> => {
  debugLog('[DEBUG API] Testing registration with detailed logging');
  
  // First try with proxy
  const proxyResult = await debugApiRequest('/auth/signup', 'POST', userData, true);
  
  if (proxyResult.success) {
    return proxyResult;
  }
  
  debugLog('[DEBUG API] Proxy registration failed, trying direct connection');
  
  // If proxy fails, try direct
  return await debugApiRequest('/auth/signup', 'POST', userData, false);
};

// Comment out browser console exposure
/*
if (typeof window !== 'undefined') {
  window.debugApiRequest = debugApiRequest;
  window.debugRegistration = debugRegistration;
  debugLog('Debug API utility loaded. Run debugApiRequest() or debugRegistration() in console to test.');
}
*/ 