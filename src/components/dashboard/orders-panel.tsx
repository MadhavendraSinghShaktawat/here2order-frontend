import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface OrdersPanelProps {
  orders: {
    pending: number;
    preparing: number;
    ready: number;
    completed: number;
  };
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

interface Order {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: OrderStatus;
  time: string;
}

export const OrdersPanel: React.FC<OrdersPanelProps> = ({ orders }) => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('pending');
  
  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      items: ['Margherita Pizza', 'Coke'],
      total: 18.99,
      status: 'pending',
      time: '10 mins ago'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      items: ['Chicken Burger', 'Fries', 'Sprite'],
      total: 22.50,
      status: 'pending',
      time: '15 mins ago'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      items: ['Caesar Salad', 'Iced Tea'],
      total: 15.75,
      status: 'preparing',
      time: '20 mins ago'
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Williams',
      items: ['Pasta Carbonara', 'Garlic Bread', 'Wine'],
      total: 32.99,
      status: 'ready',
      time: '30 mins ago'
    }
  ];
  
  const filteredOrders = mockOrders.filter(order => order.status === activeStatus);
  
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleStatusChange = (status: OrderStatus) => {
    setActiveStatus(status);
  };
  
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    // In a real app, this would update the order status via API
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // Then refetch orders or update local state
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your restaurant orders</p>
      </div>
      
      {/* Order Status Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => handleStatusChange('pending')}
          className={`px-4 py-2 rounded-lg flex items-center ${
            activeStatus === 'pending' 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          <span>Pending</span>
          <span className="ml-2 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2 py-0.5 rounded-full">
            {orders.pending}
          </span>
        </button>
        
        <button
          onClick={() => handleStatusChange('preparing')}
          className={`px-4 py-2 rounded-lg flex items-center ${
            activeStatus === 'preparing' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span>Preparing</span>
          <span className="ml-2 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
            {orders.preparing}
          </span>
        </button>
        
        <button
          onClick={() => handleStatusChange('ready')}
          className={`px-4 py-2 rounded-lg flex items-center ${
            activeStatus === 'ready' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span>Ready</span>
          <span className="ml-2 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded-full">
            {orders.ready}
          </span>
        </button>
        
        <button
          onClick={() => handleStatusChange('completed')}
          className={`px-4 py-2 rounded-lg flex items-center ${
            activeStatus === 'completed' 
              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
          <span>Completed</span>
          <span className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">
            {orders.completed}
          </span>
        </button>
      </div>
      
      {/* Orders List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{order.id}</h3>
                      <span className={`ml-2 w-2 h-2 ${getStatusColor(order.status)} rounded-full`}></span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{order.time}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{order.customer}</p>
                    <div className="mt-1">
                      {order.items.map((item, index) => (
                        <span 
                          key={index} 
                          className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded mr-2 mb-1"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                    <div className="mt-2 space-x-2">
                      {activeStatus === 'pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'preparing')}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          Start Preparing
                        </button>
                      )}
                      {activeStatus === 'preparing' && (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'ready')}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                          Mark Ready
                        </button>
                      )}
                      {activeStatus === 'ready' && (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'completed')}
                          className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No {activeStatus} orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 