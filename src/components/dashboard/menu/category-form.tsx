import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Category } from '../../../types/menu-types';
import { LoadingSpinner } from '../../ui/loading-spinner';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, 'id'>) => Promise<void>;
  initialData?: Category;
  isSubmitting: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    isActive: true,
    sortOrder: 1
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        isActive: initialData.isActive,
        sortOrder: initialData.sortOrder
      });
    } else {
      // Reset form when opening for a new category
      setFormData({
        name: '',
        description: '',
        isActive: true,
        sortOrder: 1
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'sortOrder' 
          ? parseInt(value, 10) 
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                placeholder="e.g., Appetizers, Main Course, Desserts"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                placeholder="Brief description of this category"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-flamingo focus:ring-flamingo border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Active
              </label>
            </div>
            
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Lower numbers appear first</p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-flamingo text-white rounded-lg hover:bg-flamingo/90 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : initialData ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}; 