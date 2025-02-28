import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/theme-context';
import { LoadingSpinner } from '../components/ui/loading-spinner';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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
    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        <DashboardHeader 
          restaurantName={restaurantData.name} 
          toggleMobileMenu={toggleMobileMenu}
        />
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - hidden on mobile unless toggled */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative z-20 h-full md:h-auto`}>
            <DashboardSidebar 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </div>
          
          {/* Overlay for mobile when sidebar is open */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}
          
          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 w-full">
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