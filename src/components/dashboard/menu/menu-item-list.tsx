import React from 'react';
import { motion } from 'framer-motion';
import { MenuItem, Category } from '../../../types/menu-types';
import { LoadingSpinner } from '../../ui/loading-spinner';

interface MenuItemListProps {
  menuItems: MenuItem[];
  categories: Category[];
  activeCategory: string;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  isLoading?: boolean;
}

export const MenuItemList: React.FC<MenuItemListProps> = ({
  menuItems,
  categories,
  activeCategory,
  onEditItem,
  onDeleteItem,
  isLoading = false
}) => {
  // Filter items based on active category
  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.categoryId === activeCategory);
  
  // Get category name by id
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu Items</h2>
        <div className="flex items-center space-x-2">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </p>
          {isLoading && <LoadingSpinner size="sm" color="#f06236" />}
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No menu items found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <img 
                  src={item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => onEditItem(item)}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit Item"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Item"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{getCategoryName(item.categoryId)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-flamingo">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.isAvailable 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {item.preparationTime} min
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}; 