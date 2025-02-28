import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/theme-context';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { toast } from 'react-hot-toast';

// Dashboard components
import { DashboardHeader } from '../components/dashboard/dashboard-header';
import { DashboardSidebar } from '../components/dashboard/dashboard-sidebar';
import { OrdersPanel } from '../components/dashboard/orders-panel';
import { MenuPanel } from '../components/dashboard/menu-panel';
import { AnalyticsPanel } from '../components/dashboard/analytics-panel';
import { SettingsPanel } from '../components/dashboard/settings-panel';

// Types
type DashboardTab = 'orders' | 'menu' | 'analytics' | 'settings';

const RestaurantDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { colors } = useTheme();

  // Mock restaurant data
  const restaurantData = {
    name: 'Here2Order Restaurant',
    orders: {
      pending: 5,
      preparing: 3,
      ready: 2,
      completed: 12
    },
    revenue: {
      today: 1250.75,
      week: 8320.50,
      month: 32150.25
    },
    popularItems: [
      { name: 'Margherita Pizza', orders: 124 },
      { name: 'Chicken Burger', orders: 98 },
      { name: 'Caesar Salad', orders: 67 },
      { name: 'Pasta Carbonara', orders: 52 },
      { name: 'Chocolate Cake', orders: 45 }
    ]
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: DashboardTab): void => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" color={colors.primary} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Dashboard Layout */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <DashboardHeader restaurantName={restaurantData.name} />
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <DashboardSidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
          
          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeTab === 'orders' && (
                <OrdersPanel 
                  orders={restaurantData.orders} 
                />
              )}
              
              {activeTab === 'menu' && (
                <MenuPanel />
              )}
              
              {activeTab === 'analytics' && (
                <AnalyticsPanel 
                  revenue={restaurantData.revenue}
                  popularItems={restaurantData.popularItems}
                />
              )}
              
              {activeTab === 'settings' && (
                <SettingsPanel />
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard; 