import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/theme-context';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { AuthService } from '../services/auth-service';

// Dashboard components
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { DashboardSidebar } from '../components/dashboard/dashboard-sidebar';
import { OrdersPanel } from '../components/dashboard/orders-panel';
import { MenuPanel } from '../components/dashboard/menu-panel';
import { AnalyticsPanel } from '../components/dashboard/analytics-panel';
import { SettingsPanel } from '../components/dashboard/settings-panel';
import { TablesPanel } from '../components/dashboard/tables-panel';

/**
 * Restaurant Dashboard component that serves as the main interface for restaurant management
 * Provides access to orders, menu, analytics, tables, and settings
 */
const RestaurantDashboard: React.FC = () => {
  const { mode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('menu');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // The restaurant ID from the API response
  const restaurantId = "67c1b3da52ba0c14697e1ff8";

  // Restaurant data
  const restaurantData = {
    name: 'Here2Order Restaurant',
    orders: {
      pending: 5,
      preparing: 3,
      ready: 2,
      completed: 12
    },
    revenue: {
      today: 1250,
      week: 8750,
      month: 35000
    },
    popularItems: [
      { name: 'Margherita Pizza', orders: 42 },
      { name: 'Chicken Wings', orders: 36 },
      { name: 'Caesar Salad', orders: 28 },
      { name: 'Chocolate Cake', orders: 22 }
    ]
  };
  
  /**
   * Renders the appropriate content panel based on the active tab
   * @returns The component for the selected tab
   */
  const renderContent = () => {
    switch(activeTab) {
      case 'orders':
        return <OrdersPanel orders={restaurantData.orders} />;
      case 'menu':
        return <MenuPanel />;
      case 'analytics':
        return <AnalyticsPanel 
          revenue={restaurantData.revenue}
          popularItems={restaurantData.popularItems}
        />;
      case 'settings':
        return <SettingsPanel />;
      case 'tables':
        return <TablesPanel restaurantId={restaurantId} />;
      default:
        return <MenuPanel />;
    }
  };
  
  // Check authentication and load data
  useEffect(() => {
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className={`h-screen flex flex-col ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <DashboardHeader 
        restaurantName={restaurantData.name}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`md:block ${isMobileMenuOpen ? 'block' : 'hidden'} md:relative absolute z-20 h-full`}>
          <DashboardSidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        
        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
        {/* Content Area */}
        <div className={`flex-1 overflow-auto p-4 ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard; 