import React, { useState } from 'react';
import axios from 'axios';
import { API_URL, SERVER_URL } from '../../utils/env-config';
import { testDirectConnection, testDirectLogin, testDirectSignup } from '../../utils/direct-api-test';

export const ApiTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('/api/v1/health');
  const [credentials, setCredentials] = useState<{email: string; password: string; name: string}>({
    email: 'restaurant@example.com',
    password: 'Password123!',
    name: 'John Doe'
  });

  const testConnection = async (): Promise<void> => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      const response = await axios.get(url);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error('Test error:', error);
      setResult(`Error: ${error.message}\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (): Promise<void> => {
    setLoading(true);
    setResult('Testing login...');
    
    try {
      const response = await axios.post('/api/v1/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error('Test login error:', error);
      setResult(`Error: ${error.message}\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async (): Promise<void> => {
    setLoading(true);
    setResult('Testing signup...');
    
    try {
      const response = await axios.post('/api/v1/auth/signup', {
        email: credentials.email,
        password: credentials.password,
        name: credentials.name
      });
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error('Test signup error:', error);
      setResult(`Error: ${error.message}\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectServerConnection = async (): Promise<void> => {
    setLoading(true);
    setResult('Testing direct connection to server...');
    
    try {
      const data = await testDirectConnection();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      console.error('Direct connection test error:', error);
      setResult(`Error: ${error.message}\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectServerLogin = async (): Promise<void> => {
    setLoading(true);
    setResult('Testing direct login to server...');
    
    try {
      const data = await testDirectLogin(credentials.email, credentials.password);
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      console.error('Direct login test error:', error);
      setResult(`Error: ${error.message}\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectServerSignup = async (): Promise<void> => {
    setLoading(true);
    setResult('Testing direct signup to server...');
    
    try {
      const data = await testDirectSignup({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name
      });
      setResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      console.error('Direct signup test error:', error);
      setResult(`Error: ${error.message}\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">API Connection Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Test URL:</label>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-flamingo text-white rounded hover:bg-flamingo/90 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Login
        </button>
        
        <button
          onClick={testSignup}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Signup
        </button>
        
        <button
          onClick={testDirectServerConnection}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Direct Connection
        </button>
        
        <button
          onClick={testDirectServerLogin}
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          Direct Login
        </button>
        
        <button
          onClick={testDirectServerSignup}
          disabled={loading}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
        >
          Direct Signup
        </button>
      </div>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Test Credentials:</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium mb-1">Name:</label>
            <input 
              type="text" 
              value={credentials.name} 
              onChange={(e) => setCredentials({...credentials, name: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input 
              type="email" 
              value={credentials.email} 
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input 
              type="text" 
              value={credentials.password} 
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Environment Info:</h3>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs">
          <p>API URL: {API_URL}</p>
          <p>Server URL: {SERVER_URL}</p>
        </div>
      </div>
      
      {result && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Result:</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-60 text-xs">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}; 