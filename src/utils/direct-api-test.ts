import axios from 'axios';

// Test direct connection to the server
export const testDirectConnection = async (): Promise<void> => {
  console.log('Testing direct connection to server...');
  
  try {
    // Try direct connection to the server
    const response = await axios.get('http://localhost:3000/api/v1/health');
    console.log('Direct connection successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Direct connection failed:', error);
    throw error;
  }
};

// Test login with direct connection
export const testDirectLogin = async (email: string, password: string): Promise<any> => {
  console.log('Testing direct login to server...');
  
  try {
    // Try direct login to the server
    const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email,
      password
    });
    console.log('Direct login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Direct login failed:', error);
    throw error;
  }
};

// Test signup with direct connection
export const testDirectSignup = async (userData: any): Promise<any> => {
  console.log('Testing direct signup to server...');
  
  // Create a complete test user if minimal data is provided
  if (!userData.restaurant) {
    userData = {
      ...userData,
      phone: userData.phone || '+1234567890',
      restaurant: {
        name: userData.restaurantName || 'Test Restaurant',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345',
          country: 'Test Country'
        },
        contact: {
          phone: userData.phone || '+1234567890',
          email: userData.email || 'test@example.com'
        }
      }
    };
  }
  
  console.log('Sending signup data:', userData);
  
  try {
    // Try direct signup to the server
    const response = await axios.post('http://localhost:3000/api/v1/auth/signup', userData);
    console.log('Direct signup successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Direct signup failed:', error);
    throw error;
  }
};

// Comment out browser console exposure
/*
if (typeof window !== 'undefined') {
  window.testDirectConnection = testDirectConnection;
  window.testDirectLogin = (email: string, password: string) => testDirectLogin(email, password);
  window.testDirectSignup = (userData: any) => testDirectSignup(userData);
  console.log('Direct API test utility loaded. Run testDirectConnection(), testDirectLogin("email", "password"), or testDirectSignup(userData) in console to test.');
}
*/ 