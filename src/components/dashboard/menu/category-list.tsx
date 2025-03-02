import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../../../types/menu-types';
import { LoadingSpinner } from '../../ui/loading-spinner';

interface CategoryListProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onEditCategory: (category: Category) => void;
  isLoading?: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  onDeleteCategory,
  onEditCategory,
  isLoading = false
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Categories</h2>
        {isLoading && <LoadingSpinner size="sm" color="#f06236" />}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeCategory === 'all' 
              ? 'bg-flamingo/10 text-flamingo font-medium' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          disabled={isLoading}
        >
          All Categories
        </button>
        
        {categories.map((category) => (
          <div key={category.id} className="relative group">
            <button
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeCategory === category.id 
                  ? 'bg-flamingo/10 text-flamingo font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              disabled={isLoading}
            >
              {category.name}
            </button>
            
            <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCategory(category);
                }}
                className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                title="Edit Category"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(category.id);
                }}
                className="p-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full"
                title="Delete Category"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{category.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditCategory(category)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit Category"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Category"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 