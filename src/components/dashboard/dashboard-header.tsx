import React from 'react';
import { useTheme } from '../../context/theme-context';
import { Logo } from '../ui/logo';

interface DashboardHeaderProps {
  restaurantName: string;
  toggleMobileMenu: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  restaurantName, 
  toggleMobileMenu 
}) => {
  const { toggleMode, mode } = useTheme();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-2 p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleMobileMenu}
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center">
            <Logo className="h-7 w-auto mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline-block">|</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white ml-2 hidden sm:inline-block">{restaurantName}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMode}
            className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {mode === 'dark' ? (
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-2 hidden sm:block">Restaurant Admin</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">admin@restaurant.com</span>
            <div className="ml-2 h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium">
              R
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 