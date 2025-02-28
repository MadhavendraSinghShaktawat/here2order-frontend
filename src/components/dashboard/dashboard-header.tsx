import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui/theme-toggle';
import { toast } from 'react-hot-toast';

interface DashboardHeaderProps {
  restaurantName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ restaurantName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth token and redirect to login
    localStorage.removeItem('authToken');
    toast.success('Logged out successfully');
    navigate('/restaurant-login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className="text-flamingo font-script text-2xl mr-2">Here2Order</div>
          <span className="text-gray-600 dark:text-gray-300 font-medium">|</span>
          <h1 className="ml-2 text-gray-800 dark:text-white font-medium">{restaurantName}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          
          <ThemeToggle />
          
          <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-flamingo text-white flex items-center justify-center font-medium">
              R
            </div>
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Restaurant Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@restaurant.com</p>
            </div>
            <button 
              onClick={handleLogout}
              className="ml-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}; 