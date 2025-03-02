import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/api-service';
import { LoadingSpinner } from '../ui/loading-spinner';
import { CategoryList } from './menu/category-list';
import { MenuItemList } from './menu/menu-item-list';
import { CategoryForm } from './menu/category-form';
import { MenuItem, Category, CategoriesResponse, MenuItemsResponse, DeleteResponse, CategoryFormData } from '../../types/menu-types';

// Define proper types for API responses
interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

/**
 * MenuPanel component for managing restaurant menu categories and items
 */
export const MenuPanel: React.FC = () => {
  // State for categories and menu items
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Loading and modal states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);
  const [isMenuItemsLoading, setIsMenuItemsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  
  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  /**
   * Fetch categories from API
   */
  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      setIsCategoriesLoading(true);
      
      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        console.error('Restaurant ID not found in localStorage');
        toast.error('Could not fetch categories: Restaurant ID not found');
        return;
      }
      
      // Use the API service to fetch categories with proper typing
      const response = await apiService.get<ApiResponse<CategoriesResponse>>(`/menu/categories/${restaurantId}`);
      
      if (response.status === 'success' && response.data.categories) {
        setCategories(response.data.categories);
      } else {
        console.error('Invalid categories response:', response);
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories. Please try again later.');
    } finally {
      setIsCategoriesLoading(false);
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch menu items from API
   */
  const fetchMenuItems = useCallback(async (): Promise<void> => {
    try {
      setIsMenuItemsLoading(true);
      
      // Get the restaurant ID from localStorage
      const restaurantId = localStorage.getItem('restaurantId');
      
      if (!restaurantId) {
        console.error('Restaurant ID not found in localStorage');
        toast.error('Could not fetch menu items: Restaurant ID not found');
        return;
      }
      
      // Use the API service to fetch menu items with proper typing
      const response = await apiService.get<ApiResponse<MenuItemsResponse>>(`/menu/items/${restaurantId}`);
      
      if (response.status === 'success' && response.data.menuItems) {
        setMenuItems(response.data.menuItems);
      } else {
        console.error('Invalid menu items response:', response);
        toast.error('Failed to fetch menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to fetch menu items. Please try again later.');
    } finally {
      setIsMenuItemsLoading(false);
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCategories(), fetchMenuItems()]);
    };
    
    loadData();
  }, [fetchCategories, fetchMenuItems]);

  /**
   * Handle adding or updating a category
   */
  const handleAddCategory = async (categoryData: CategoryFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      
      // Create payload for category creation
      const payload = {
        name: categoryData.name,
        description: categoryData.description,
        isActive: categoryData.isActive,
        sortOrder: categoryData.sortOrder || 1
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
        fetchCategories();
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
    if (!categoryId) {
      toast.error('Invalid category ID');
      return;
    }
    
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all menu items in this category.')) {
      return;
    }
    
    try {
      setIsCategoriesLoading(true);
      
      // Use the API service to delete the category
      const response = await apiService.delete<ApiResponse<DeleteResponse>>(`/menu/categories/${categoryId}`);
      
      // Check if the response has the expected structure
      if (response && response.status === 'success') {
        toast.success(response.data?.message || 'Category deleted successfully');
        
        // Update the categories list by removing the deleted category
        setCategories(prevCategories => 
          prevCategories.filter(category => category.id !== categoryId)
        );
        
        // If we're viewing this category, switch to 'all'
        if (activeCategory === categoryId) {
          setActiveCategory('all');
        }
        
        // Refresh menu items as they might be affected
        fetchMenuItems();
      } else {
        console.error('Failed to delete category:', response);
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. Please try again later.');
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  /**
   * Handle deleting a menu item
   */
  const handleDeleteMenuItem = async (itemId: string): Promise<void> => {
    if (!itemId) {
      toast.error('Invalid menu item ID');
      return;
    }
    
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
    
    try {
      setIsMenuItemsLoading(true);
      
      // Use the API service to delete the menu item
      const response = await apiService.delete<ApiResponse<DeleteResponse>>(`/menu/items/${itemId}`);
      
      if (response && response.status === 'success') {
        toast.success(response.data?.message || 'Menu item deleted successfully');
        
        // Update the menu items list by removing the deleted item
        setMenuItems(prevItems => 
          prevItems.filter(item => item.id !== itemId)
        );
      } else {
        console.error('Failed to delete menu item:', response);
        toast.error('Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item. Please try again later.');
    } finally {
      setIsMenuItemsLoading(false);
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
   * Handle refreshing data
   */
  const handleRefresh = async (): Promise<void> => {
    setIsLoading(true);
    await Promise.all([fetchCategories(), fetchMenuItems()]);
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your restaurant's menu items and categories</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full transition-colors"
          title="Refresh data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" color="#f06236" />
        </div>
      )}
      
      {!isLoading && (
        <div className="space-y-8">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setEditingCategory(undefined);
                setIsAddCategoryModalOpen(true);
              }}
              className="px-4 py-2 bg-flamingo text-white rounded-lg hover:bg-flamingo/90 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </button>
          </div>
          
          {/* Categories section */}
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
            isLoading={isCategoriesLoading}
          />
          
          {/* Menu items section */}
          <MenuItemList
            menuItems={menuItems}
            categories={categories}
            activeCategory={activeCategory}
            onEditItem={() => {}} // Placeholder for now
            onDeleteItem={handleDeleteMenuItem}
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
        </div>
      )}
    </div>
  );
}; 