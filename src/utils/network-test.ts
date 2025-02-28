import axios from 'axios';
import { SERVER_URL, API_URL, SERVER_HOST, SERVER_PORT, debugLog } from './env-config';

// Test network connectivity to the server
export const testNetworkConnectivity = async (): Promise<any> => {
  const results: any = {
    serverInfo: {
      host: SERVER_HOST,
      port: SERVER_PORT,
      url: SERVER_URL,
      apiPath: API_URL
    },
    tests: {}
  };
  
  debugLog('[NETWORK TEST] Starting comprehensive network connectivity tests');
  debugLog('[NETWORK TEST] Server info:', results.serverInfo);
  
  // Test 1: Basic fetch to google.com to verify internet connectivity
  try {
    debugLog('[NETWORK TEST] Testing internet connectivity with fetch to google.com');
    const googleResponse = await fetch('https://www.google.com', { mode: 'no-cors' });
    results.tests.internetConnectivity = {
      success: true,
      status: googleResponse.status,
      statusText: googleResponse.statusText
    };
    debugLog('[NETWORK TEST] Internet connectivity test successful');
  } catch (error) {
    results.tests.internetConnectivity = {
      success: false,
      error: error.message
    };
    debugLog('[NETWORK TEST] Internet connectivity test failed:', error);
  }
  
  // Test 2: Ping the server's health endpoint with axios
  try {
    debugLog('[NETWORK TEST] Testing server health endpoint with axios');
    const healthResponse = await axios.get(`${SERVER_URL}${API_URL}/health`, {
      timeout: 5000 // 5 second timeout
    });
    results.tests.serverHealth = {
      success: true,
      status: healthResponse.status,
      data: healthResponse.data
    };
    debugLog('[NETWORK TEST] Server health test successful:', healthResponse.data);
  } catch (error) {
    results.tests.serverHealth = {
      success: false,
      error: error.message,
      code: error.code
    };
    debugLog('[NETWORK TEST] Server health test failed:', error);
  }
  
  // Test 3: Try a simple OPTIONS request to check CORS
  try {
    debugLog('[NETWORK TEST] Testing CORS with OPTIONS request');
    const corsResponse = await axios({
      method: 'OPTIONS',
      url: `${SERVER_URL}${API_URL}/auth/signup`,
      timeout: 5000
    });
    results.tests.cors = {
      success: true,
      status: corsResponse.status,
      headers: corsResponse.headers
    };
    debugLog('[NETWORK TEST] CORS test successful');
  } catch (error) {
    results.tests.cors = {
      success: false,
      error: error.message,
      code: error.code
    };
    debugLog('[NETWORK TEST] CORS test failed:', error);
  }
  
  // Test 4: Check if the server is running on the expected port
  try {
    debugLog('[NETWORK TEST] Testing server port with fetch');
    const portTestResponse = await fetch(`${SERVER_URL}/`, { 
      mode: 'no-cors',
      timeout: 5000
    });
    results.tests.serverPort = {
      success: true,
      status: portTestResponse.status,
      statusText: portTestResponse.statusText
    };
    debugLog('[NETWORK TEST] Server port test successful');
  } catch (error) {
    results.tests.serverPort = {
      success: false,
      error: error.message
    };
    debugLog('[NETWORK TEST] Server port test failed:', error);
  }
  
  // Test 5: Check proxy configuration
  try {
    debugLog('[NETWORK TEST] Testing proxy configuration');
    const proxyResponse = await axios.get(`${API_URL}/health`, {
      timeout: 5000
    });
    results.tests.proxy = {
      success: true,
      status: proxyResponse.status,
      data: proxyResponse.data
    };
    debugLog('[NETWORK TEST] Proxy test successful:', proxyResponse.data);
  } catch (error) {
    results.tests.proxy = {
      success: false,
      error: error.message,
      code: error.code
    };
    debugLog('[NETWORK TEST] Proxy test failed:', error);
  }
  
  // Summarize results
  const allTests = Object.values(results.tests);
  const successfulTests = allTests.filter((test: any) => test.success).length;
  results.summary = {
    totalTests: allTests.length,
    successfulTests,
    failedTests: allTests.length - successfulTests,
    overallSuccess: successfulTests === allTests.length
  };
  
  debugLog('[NETWORK TEST] Test summary:', results.summary);
  return results;
};

// Comment out browser console exposure
/* 
if (typeof window !== 'undefined') {
  window.testNetworkConnectivity = testNetworkConnectivity;
  debugLog('Network test utility loaded. Run testNetworkConnectivity() in console to test.');
}
*/ 