import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/api-service';
import { LoadingSpinner } from '../ui/loading-spinner';
import { CategoryList } from './menu/category-list';
import { MenuItemList } from './menu/menu-item-list';
import { CategoryForm } from './menu/category-form';
import { MenuItem, Category, CategoriesResponse, MenuItemsResponse, DeleteResponse, CategoryFormData, MenuItemFormData } from '../../types/menu-types';
import { MenuItemForm } from './menu/menu-item-form';

// Define proper types for API responses
interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

/**
 * Menu Panel component for managing restaurant menu categories and items
 */
export const MenuPanel: React.FC = () => {
  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);
  const [isMenuItemsLoading, setIsMenuItemsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Modal states
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);
  
  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | undefined>(undefined);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch categories from API
   */
  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      setIsCategoriesLoading(true);
      setError(null);
      
      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        console.error('Restaurant ID not found in localStorage');
        setError('Could not fetch categories: Restaurant ID not found');
        return;
      }
      
      // Use the API service to fetch categories with proper typing
      const response = await apiService.get<ApiResponse<CategoriesResponse>>(`/menu/categories/${restaurantId}`);
      
      if (response.status === 'success' && response.data.categories) {
        // Sort categories by sortOrder
        const sortedCategories = [...response.data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
        setCategories(sortedCategories);
      } else {
        console.error('Invalid categories response:', response);
        setError('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again later.');
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  /**
   * Fetch menu items from API
   */
  const fetchMenuItems = useCallback(async (): Promise<void> => {
    try {
      setIsMenuItemsLoading(true);
      setError(null);
      
      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        console.error('Restaurant ID not found in localStorage');
        setError('Could not fetch menu items: Restaurant ID not found');
        return;
      }
      
      // Use the API service to fetch menu items with proper typing
      const response = await apiService.get<ApiResponse<MenuItemsResponse>>(`/menu/items/${restaurantId}`);
      
      if (response.status === 'success' && response.data.items) {
        // Process the menu items to extract the proper categoryId
        const processedItems = response.data.items.map((item: MenuItem) => {
          // Check if categoryId is a string that contains an object
          if (typeof item.categoryId === 'string' && item.categoryId.includes('_id')) {
            try {
              // Extract the ObjectId from the string using regex
              const match = item.categoryId.match(/ObjectId\('([^']+)'\)/);
              if (match && match[1]) {
                return {
                  ...item,
                  categoryId: match[1] // Use the extracted ID
                };
              }
            } catch (err) {
              console.error('Error parsing categoryId:', err);
            }
          }
          return item;
        });
        
        // Sort menu items by sortOrder
        const sortedItems = [...processedItems].sort((a, b) => a.sortOrder - b.sortOrder);
        setMenuItems(sortedItems);
      } else {
        console.error('Invalid menu items response:', response);
        setError('Failed to fetch menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to fetch menu items. Please try again later.');
    } finally {
      setIsMenuItemsLoading(false);
      setIsLoading(false);
    }
  }, []);

  /**
   * Load all data on component mount
   */
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load data in parallel for better performance
        await Promise.all([
          fetchCategories(),
          fetchMenuItems()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load menu data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchCategories, fetchMenuItems]);

  /**
   * Handle adding or updating a category
   */
  const handleAddCategory = async (categoryData: CategoryFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        console.error('Restaurant ID not found in localStorage');
        toast.error('Could not add category: Restaurant ID not found');
        return;
      }
      
      // Create payload for category creation
      const payload = {
        ...categoryData,
        restaurantId
      };
      
      let response;
      
      if (editingCategory) {
        // Update existing category
        response = await apiService.put<ApiResponse<{ id: string; message: string }>>(
          `/menu/categories/${editingCategory.id}`, 
          payload
        );
        toast.success('Category updated successfully');
      } else {
        // Create new category
        response = await apiService.post<ApiResponse<{ id: string; message: string }>>(
          '/menu/categories', 
          payload
        );
        toast.success('Category added successfully');
      }
      
      // Check if the response has the expected structure
      if (response && response.status === 'success') {
        // Close modal and refresh categories
        setIsAddCategoryModalOpen(false);
        setEditingCategory(undefined);
        await fetchCategories();
        
        // If we're editing a category, we should also refresh menu items
        // as they might display category names
        if (editingCategory) {
          await fetchMenuItems();
        }
      } else {
        console.error('Failed to save category:', response);
        toast.error('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle deleting a category
   */
  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    // Check if there are menu items in this category
    const itemsInCategory = menuItems.filter(item => item.categoryId === categoryId);
    
    if (itemsInCategory.length > 0) {
      toast.error(`Cannot delete category with ${itemsInCategory.length} menu items. Please move or delete these items first.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        const response = await apiService.delete<ApiResponse<DeleteResponse>>(`/menu/categories/${categoryId}`);
        
        if (response && response.status === 'success') {
          toast.success('Category deleted successfully');
          
          // If the deleted category was active, switch to 'all'
          if (activeCategory === categoryId) {
            setActiveCategory('all');
          }
          
          // Refresh categories
          await fetchCategories();
        } else {
          console.error('Failed to delete category:', response);
          toast.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  /**
   * Handle editing a category
   */
  const handleEditCategory = (category: Category): void => {
    setEditingCategory(category);
    setIsAddCategoryModalOpen(true);
  };

  /**
   * Handle editing a menu item
   */
  const handleEditMenuItem = (menuItem: MenuItem): void => {
    setEditingMenuItem(menuItem);
    setIsAddItemModalOpen(true);
  };

  /**
   * Handle adding or updating a menu item
   */
  const handleAddMenuItem = async (menuItemData: MenuItemFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        console.error('Restaurant ID not found in localStorage');
        toast.error('Could not add menu item: Restaurant ID not found');
        return;
      }
      
      // Create payload for menu item creation
      const payload = {
        ...menuItemData,
        restaurantId
      };
      
      let response;
      
      if (editingMenuItem) {
        // Update existing menu item
        response = await apiService.put<ApiResponse<MenuItem>>(
          `/menu/items/${editingMenuItem.id}`, 
          payload
        );
        toast.success('Menu item updated successfully');
      } else {
        // Create new menu item
        response = await apiService.post<ApiResponse<MenuItem>>(
          '/menu/items', 
          payload
        );
        toast.success('Menu item added successfully');
      }
      
      if (response && response.status === 'success') {
        // Close the modal
        setIsAddItemModalOpen(false);
        
        // Reset the editing state
        setEditingMenuItem(undefined);
        
        // Refresh the menu items
        await fetchMenuItems();
      } else {
        console.error('Failed to save menu item:', response);
        toast.error('Failed to save menu item');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle deleting a menu item
   */
  const handleDeleteMenuItem = async (itemId: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        const response = await apiService.delete<ApiResponse<DeleteResponse>>(`/menu/items/${itemId}`);
        
        if (response && response.status === 'success') {
          toast.success('Menu item deleted successfully');
          
          // Refresh menu items
          await fetchMenuItems();
        } else {
          console.error('Failed to delete menu item:', response);
          toast.error('Failed to delete menu item');
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  /**
   * Handle refreshing data
   */
  const handleRefresh = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load data in parallel for better performance
      await Promise.all([
        fetchCategories(),
        fetchMenuItems()
      ]);
      
      toast.success('Menu data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh menu data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle menu item availability
   */
  const handleToggleAvailability = async (itemId: string, isAvailable: boolean): Promise<void> => {
    try {
      setIsSubmitting(true);
      
      // Use the API service to toggle availability
      const response = await apiService.put<ApiResponse<MenuItem>>(
        `/menu/items/${itemId}/availability`,
        { isAvailable }
      );
      
      if (response.status === 'success') {
        // Update the menu item in the state
        setMenuItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId 
              ? { ...item, isAvailable, updatedAt: response.data.updatedAt } 
              : item
          )
        );
        
        toast.success(`Item marked as ${isAvailable ? 'available' : 'unavailable'}`);
      } else {
        console.error('Failed to toggle availability:', response);
        toast.error('Failed to update availability');
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update availability. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoize filtered menu items based on active category
  const filteredMenuItems = useMemo(() => {
    return activeCategory === 'all'
      ? menuItems
      : menuItems.filter(item => item.categoryId === activeCategory);
  }, [menuItems, activeCategory]);

  return (
    <div className="h-full">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your restaurant menu categories and items</p>
          </div>
          
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh Data"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
          <button 
            onClick={handleRefresh}
            className="mt-2 text-sm text-red-700 dark:text-red-300 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <LoadingSpinner size="lg" color="#f06236" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading menu data...</p>
        </div>
      ) : (
        <div>
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => {
                setEditingCategory(undefined);
                setIsAddCategoryModalOpen(true);
              }}
              className="px-4 py-2 bg-flamingo text-white rounded-lg hover:bg-flamingo/90 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </button>
            
            <button
              onClick={() => {
                setEditingMenuItem(undefined);
                setIsAddItemModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              disabled={categories.length === 0 || isSubmitting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Menu Item
            </button>
          </div>
          
          {/* Categories */}
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
            isLoading={isCategoriesLoading}
          />
          
          {/* Menu Items */}
          <MenuItemList
            menuItems={filteredMenuItems}
            categories={categories}
            activeCategory={activeCategory}
            onEditItem={handleEditMenuItem}
            onDeleteItem={handleDeleteMenuItem}
            onToggleAvailability={handleToggleAvailability}
            isLoading={isMenuItemsLoading}
          />
          
          {/* Category form modal */}
          <CategoryForm
            isOpen={isAddCategoryModalOpen}
            onClose={() => {
              setIsAddCategoryModalOpen(false);
              setEditingCategory(undefined);
            }}
            onSubmit={handleAddCategory}
            initialData={editingCategory}
            isSubmitting={isSubmitting}
          />
          
          {/* Menu item form modal */}
          <MenuItemForm
            isOpen={isAddItemModalOpen}
            onClose={() => {
              setIsAddItemModalOpen(false);
              setEditingMenuItem(undefined);
            }}
            onSubmit={handleAddMenuItem}
            initialData={editingMenuItem}
            categories={categories}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}; 