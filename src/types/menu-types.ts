/**
 * Menu-related type definitions
 */

// Category type definition
export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Menu item type definition
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
  isAvailable: boolean;
  preparationTime: number;
  sortOrder: number;
  restaurantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API response types
export interface CategoriesResponse {
  categories: Category[];
}

export interface MenuItemsResponse {
  menuItems: MenuItem[];
}

export interface DeleteResponse {
  id: string;
  message: string;
}

// Form data types (without ID for creation)
export type CategoryFormData = Omit<Category, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>;
export type MenuItemFormData = Omit<MenuItem, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>; 