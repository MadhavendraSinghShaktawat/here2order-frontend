import React, { useState, useEffect } from 'react';
import { testNetworkConnectivity } from '../../utils/network-test';
import { LoadingSpinner } from './loading-spinner';

export const ServerStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [details, setDetails] = useState<any>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async (): Promise<void> => {
    setStatus('checking');
    try {
      const results = await testNetworkConnectivity();
      setDetails(results);
      
      if (results.tests.serverHealth?.success) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.error('Error checking server status:', error);
      setStatus('offline');
    }
  };

  return (
    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>Server Status:</span>
          {status === 'checking' && <LoadingSpinner size="xs" />}
          {status === 'online' && (
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          )}
          {status === 'offline' && (
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
          )}
          <span>{status === 'checking' ? 'Checking...' : status === 'online' ? 'Online' : 'Offline'}</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => checkServerStatus()}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
          >
            Refresh
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
          >
            {expanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>
      
      {expanded && details && (
        <div className="mt-2 text-xs">
          <div className="mb-1">
            <strong>Server URL:</strong> {details.serverInfo.url}
          </div>
          <div className="mb-1">
            <strong>API Path:</strong> {details.serverInfo.apiPath}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(details.tests).map(([testName, testResult]: [string, any]) => (
              <div key={testName} className={`p-2 rounded ${testResult.success ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <div className="font-medium">{testName}</div>
                <div>{testResult.success ? 'Success' : `Failed: ${testResult.error}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 