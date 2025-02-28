import axios from 'axios';
import { API_URL, SERVER_URL, debugLog } from './env-config';

// Add this at the top of the file
declare global {
  interface Window {
    testApiConnection: typeof testApiConnection;
  }
}

// Test the API connection
export const testApiConnection = async (): Promise<void> => {
  debugLog('Testing API connection...');
  debugLog('API_URL:', API_URL);
  debugLog('SERVER_URL:', SERVER_URL);
  
  // Test relative URL (should use proxy)
  try {
    debugLog('Testing with relative URL:', `${API_URL}/health`);
    const relativeResponse = await axios.get(`${API_URL}/health`);
    debugLog('Relative URL response:', relativeResponse.data);
  } catch (error) {
    console.error('Relative URL test failed:', error);
  }
  
  // Test absolute URL (direct to server)
  try {
    debugLog('Testing with absolute URL:', `${SERVER_URL}${API_URL}/health`);
    const absoluteResponse = await axios.get(`${SERVER_URL}${API_URL}/health`);
    debugLog('Absolute URL response:', absoluteResponse.data);
  } catch (error) {
    console.error('Absolute URL test failed:', error);
  }
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection;
  debugLog('API test utility loaded. Run testApiConnection() in console to test.');
} 