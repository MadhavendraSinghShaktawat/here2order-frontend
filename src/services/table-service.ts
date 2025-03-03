import { toast } from 'react-hot-toast';

export interface Table {
  id: string;
  tableNumber: string;
  name: string;
  capacity: number;
  isActive: boolean;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableRequest {
  tableNumber: string;
  name: string;
  capacity: number;
}

// Use the same API URL format as the working menu management
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const BASE_URL = API_URL.replace('/api/v1', ''); // Extract base URL without the API path

// Get auth token from localStorage - same as menu management
const getAuthToken = () => {
  return localStorage.getItem('authToken') || '';
};

// Common headers for all requests - matching menu management pattern
const getHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

// Helper to transform table data and fix QR code URLs
const transformTableData = (table: any): Table => {
  // If qrCodeUrl is a relative path, prepend the base URL
  let qrCodeUrl = table.qrCodeUrl;
  if (qrCodeUrl && qrCodeUrl.startsWith('/')) {
    qrCodeUrl = `${BASE_URL}${qrCodeUrl}`;
  }
  
  return {
    ...table,
    qrCodeUrl
  };
};

export const TableService = {
  async getTables(restaurantId: string): Promise<Table[]> {
    try {
      console.log(`Fetching tables for restaurant: ${restaurantId} from ${API_URL}/table/${restaurantId}`);
      
      const response = await fetch(`${API_URL}/table/${restaurantId}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      
      // Handle authentication errors specifically
      if (response.status === 401) {
        const errorMessage = 'Authentication failed. Please log in again.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) errorMessage += ` - ${errorText}`;
          } catch (textError) {
            // Ignore text parsing error
          }
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (data.status === 'success') {
        // Transform the table data to fix QR code URLs
        return (data.data || []).map(transformTableData);
      } else {
        throw new Error(data.message || 'Failed to load tables');
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error(error instanceof Error ? error.message : 'Error loading tables');
      return [];
    }
  },
  
  async createTable(restaurantId: string, tableData: CreateTableRequest): Promise<Table | null> {
    try {
      console.log(`Creating table for restaurant: ${restaurantId} with data:`, tableData);
      
      const response = await fetch(`${API_URL}/table/${restaurantId}`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(tableData),
      });
      
      console.log('Create table response status:', response.status);
      
      // Handle authentication errors specifically
      if (response.status === 401) {
        const errorMessage = 'Authentication failed. Please log in again.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) errorMessage += ` - ${errorText}`;
          } catch (textError) {
            // Ignore text parsing error
          }
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Create table response data:', data);
      
      if (data.status === 'success') {
        toast.success('Table created successfully');
        // Transform the table data to fix QR code URL
        return transformTableData(data.data);
      } else {
        throw new Error(data.message || 'Failed to create table');
      }
    } catch (error) {
      console.error('Error creating table:', error);
      toast.error(error instanceof Error ? error.message : 'Error creating table');
      return null;
    }
  },
  
  async updateTable(tableId: string, tableData: Partial<CreateTableRequest>): Promise<Table | null> {
    try {
      const response = await fetch(`${API_URL}/table/${tableId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(tableData),
      });
      
      // Handle authentication errors specifically
      if (response.status === 401) {
        const errorMessage = 'Authentication failed. Please log in again.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) errorMessage += ` - ${errorText}`;
          } catch (textError) {
            // Ignore text parsing error
          }
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success('Table updated successfully');
        // Transform the table data to fix QR code URL
        return transformTableData(data.data);
      } else {
        throw new Error(data.message || 'Failed to update table');
      }
    } catch (error) {
      console.error('Error updating table:', error);
      toast.error(error instanceof Error ? error.message : 'Error updating table');
      return null;
    }
  },
  
  async deleteTable(tableId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/table/${tableId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });
      
      // Handle authentication errors specifically
      if (response.status === 401) {
        const errorMessage = 'Authentication failed. Please log in again.';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      
      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) errorMessage += ` - ${errorText}`;
          } catch (textError) {
            // Ignore text parsing error
          }
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success('Table deleted successfully');
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete table');
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error(error instanceof Error ? error.message : 'Error deleting table');
      return false;
    }
  }
}; 