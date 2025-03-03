import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/theme-context';
import { Logo } from '../ui/logo';
import { ThemeToggle } from '../ui/theme-toggle';
import { AuthService } from '../../services/auth-service';
import { FiLogOut, FiUser } from 'react-icons/fi';

interface DashboardHeaderProps {
  restaurantName: string;
  toggleMobileMenu: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  restaurantName, 
  toggleMobileMenu 
}) => {
  const { toggleMode, mode } = useTheme();
  const navigate = useNavigate();
  
  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    const success = await AuthService.logout();
    if (success) {
      navigate('/login');
    }
  };
  
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
          <ThemeToggle />
          
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Restaurant Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@restaurant.com</p>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 