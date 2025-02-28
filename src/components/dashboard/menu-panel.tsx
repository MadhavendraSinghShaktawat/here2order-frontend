import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api-service';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Define response types
interface ApiResponse<T> {
  status: string;
  data: T;
}

interface CategoriesResponse {
  categories: Category[];
}

interface MenuItemsResponse {
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
  isAvailable: boolean;
  preparationTime: number;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export const MenuPanel: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: 'https://example.com/images/default.jpg',
    isActive: true,
    isAvailable: true,
    preparationTime: 15,
    sortOrder: 1
  });
  
  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    isActive: true,
    sortOrder: 1
  });

  useEffect(() => {
    // Fetch menu items and categories
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Use the API service with proper type annotation
      const response = await apiService.get<ApiResponse<CategoriesResponse>>('/menu/categories');
      
      if (response.status === 'success') {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use mock data if API fails
      setCategories([
        {
          id: "67b30e48dc00498b145b9828",
          name: "Pizza",
          description: "Primary dishes served as the main meal",
          isActive: true,
          sortOrder: 1
        },
        {
          id: "67c1f8379489ea75e572bfa0",
          name: "Desert",
          description: "Primary dishes served as the main meal",
          isActive: true,
          sortOrder: 1
        }
      ]);
      
      if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
        toast.error('Network error. Using sample data for now.');
      } else {
        toast.error('Failed to load categories. Using sample data for now.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuItems = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Use the API service with proper type annotation
      const response = await apiService.get<ApiResponse<MenuItemsResponse>>('/menu/items');
      
      if (response.status === 'success') {
        // Parse the categoryId from string to object if needed
        const items = response.data.items.map((item: any) => {
          // Extract categoryId from the string if it's in a format like "{ _id: new ObjectId('67b30e48dc00498b145b9828'), name: 'Pizza' }"
          if (typeof item.categoryId === 'string' && item.categoryId.includes('ObjectId')) {
            const match = item.categoryId.match(/'([^']+)'/);
            if (match && match[1]) {
              item.categoryId = match[1];
            }
          }
          return item;
        });
        
        setMenuItems(items || []);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Use mock data if API fails
      setMenuItems([
        {
          id: "67b30e8bdc00498b145b982d",
          name: "Margherita Pizza",
          description: "Fresh tomatoes, mozzarella, basil, and olive oil",
          price: 12.99,
          category: "Pizza",
          categoryId: "67b30e48dc00498b145b9828",
          imageUrl: "https://example.com/images/margherita.jpg",
          isActive: true,
          isAvailable: true,
          preparationTime: 15,
          sortOrder: 1
        },
        {
          id: "67b31b07ddaada5dea645a04",
          name: "Paneer Pizza",
          description: "Fresh tomatoes, mozzarella, basil, and olive oil",
          price: 12.99,
          category: "Pizza",
          categoryId: "67b30e48dc00498b145b9828",
          imageUrl: "https://example.com/images/margherita.jpg",
          isActive: true,
          isAvailable: true,
          preparationTime: 15,
          sortOrder: 1
        }
      ]);
      
      if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
        toast.error('Network error. Using sample data for now.');
      } else {
        toast.error('Failed to load menu items. Using sample data for now.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setNewItem(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleCategoryCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddItem = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Validate form
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Make sure we're sending the correct data structure
      const payload = {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price as string),
        categoryId: newItem.categoryId,
        imageUrl: newItem.imageUrl || 'https://example.com/images/default.jpg',
        isActive: newItem.isActive,
        isAvailable: newItem.isAvailable,
        preparationTime: newItem.preparationTime || 15,
        sortOrder: newItem.sortOrder || 1,
        restaurantId: localStorage.getItem('restaurantId')
      };
      
      console.log('Trying fetch API directly...');
      
      const token = localStorage.getItem('authToken');
      const fetchResponse = await fetch('http://localhost:3000/api/v1/menu/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Fetch response status:', fetchResponse.status);
      
      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        console.log('Fetch response data:', data);
        
        toast.success('Menu item added successfully');
        setIsAddModalOpen(false);
        fetchMenuItems();
        return;
      } else {
        console.error('Fetch error status:', fetchResponse.status);
        const errorText = await fetchResponse.text();
        console.error('Fetch error text:', errorText);
      }
    } catch (fetchError) {
      console.error('Fetch API error:', fetchError);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddCategory = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Validate form
    if (!newCategory.name || !newCategory.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiService.post<ApiResponse<any>>('/menu/categories', newCategory);
      
      if (response.status === 'success') {
        toast.success('Category added successfully');
        setIsAddCategoryModalOpen(false);
        setNewCategory({
          name: '',
          description: '',
          isActive: true,
          sortOrder: 1
        });
        fetchCategories(); // Refresh categories
      }
    } catch (error) {
      console.error('Error adding category:', error);
      // Error handling is now done in the API service
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your restaurant menu</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Category
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-flamingo text-white rounded-lg hover:bg-flamingo/90 transition-colors"
          >
            Add Item
          </button>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-lg ${
            activeCategory === 'All' 
              ? 'bg-flamingo/10 text-flamingo' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg ${
              activeCategory === category.id 
                ? 'bg-flamingo/10 text-flamingo' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Menu Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-flamingo"></div>
                    </div>
                  </td>
                </tr>
              ) : menuItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No menu items found
                  </td>
                </tr>
              ) : (
                menuItems
                  .filter(item => activeCategory === 'All' || item.categoryId === activeCategory)
                  .map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={item.imageUrl} alt={item.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {categories.find(cat => cat.id === item.categoryId)?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.isAvailable 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Menu Item</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={newItem.price}
                    onChange={handleInputChange}
                    pattern="^\d+(\.\d{1,2})?$"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={newItem.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="preparationTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preparation Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="preparationTime"
                    name="preparationTime"
                    value={newItem.preparationTime}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={newItem.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort Order *
                  </label>
                  <input
                    type="number"
                    id="sortOrder"
                    name="sortOrder"
                    value={newItem.sortOrder}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={newItem.isActive}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-flamingo focus:ring-flamingo border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Active
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        name="isAvailable"
                        checked={newItem.isAvailable}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-flamingo focus:ring-flamingo border-gray-300 rounded"
                      />
                      <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Available
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-flamingo text-white rounded-lg hover:bg-flamingo/90 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Category</h3>
              <button 
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    name="name"
                    value={newCategory.name}
                    onChange={handleCategoryInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="categoryDescription"
                    name="description"
                    value={newCategory.description}
                    onChange={handleCategoryInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="categorySortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort Order *
                  </label>
                  <input
                    type="number"
                    id="categorySortOrder"
                    name="sortOrder"
                    value={newCategory.sortOrder}
                    onChange={handleCategoryInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-flamingo/50"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="categoryIsActive"
                    name="isActive"
                    checked={newCategory.isActive}
                    onChange={handleCategoryCheckboxChange}
                    className="h-4 w-4 text-flamingo focus:ring-flamingo border-gray-300 rounded"
                  />
                  <label htmlFor="categoryIsActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 