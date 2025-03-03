import React from 'react';

interface OrdersPanelProps {
  orders: {
    pending: number;
    preparing: number;
    ready: number;
    completed: number;
  };
}

export const OrdersPanel: React.FC<OrdersPanelProps> = ({ orders }) => {
  return (
    <div className="compact-ui">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your restaurant orders</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-2 mr-3">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{orders.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mr-3">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preparing</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{orders.preparing}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mr-3">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ready</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{orders.ready}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-gray-500">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 mr-3">
              <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{orders.completed}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order list */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">Recent Orders</h2>
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            View all
          </button>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Sample order items */}
          <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                <span className="text-xs font-medium text-gray-900 dark:text-white">ORD-001</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</span>
                    </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$18.99</span>
                    </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">John Doe • 10 mins ago</span>
              <div className="flex space-x-2">
                <button className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                          Start Preparing
                        </button>
                <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
          
          <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-900 dark:text-white">ORD-002</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$22.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Jane Smith • 15 mins ago</span>
              <div className="flex space-x-2">
                <button className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                  Start Preparing
                </button>
                <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 