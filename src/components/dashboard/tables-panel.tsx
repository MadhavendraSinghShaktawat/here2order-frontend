import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../ui/loading-spinner';
import { TableService } from '../../services/table-service';
import { FiDownload, FiEye } from 'react-icons/fi';

interface Table {
  id: string;
  tableNumber: string;
  name: string;
  capacity: number;
  isActive: boolean;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Define a type for the QR code preview data
interface QrCodePreview {
  url: string;
  tableName: string;
  tableNumber: string;
}

interface TablesPanelProps {
  restaurantId: string;
}

export const TablesPanel: React.FC<TablesPanelProps> = ({ restaurantId }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewQrCode, setPreviewQrCode] = useState<QrCodePreview | null>(null);
  
  // Form state
  const [tableNumber, setTableNumber] = useState<string>('');
  const [tableName, setTableName] = useState<string>('');
  const [capacity, setCapacity] = useState<number>(2);
  
  // Verify the restaurant ID
  useEffect(() => {
    console.log('Current restaurantId in TablesPanel:', restaurantId);
    // Check if the ID is valid
    if (!restaurantId || restaurantId === 'undefined' || restaurantId === 'null') {
      setError('Invalid restaurant ID. Please check your configuration.');
      setIsLoading(false);
      return;
    }
    
    // Fetch tables if ID is valid
    fetchTables();
  }, [restaurantId]);
  
  const fetchTables = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the correct restaurant ID format
      const formattedId = restaurantId.trim();
      console.log('Fetching tables with formatted ID:', formattedId);
      
      const tablesData = await TableService.getTables(formattedId);
      setTables(tablesData);
    } catch (error) {
      console.error('Error loading tables:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tables');
      toast.error('Error loading tables');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create new table
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!tableNumber.trim() || !tableName.trim() || capacity < 1) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsCreating(true);
      setError(null);
      
      // Create table data with all required fields
      const newTableData = {
        tableNumber: tableNumber.trim(),
        name: tableName.trim(),
        capacity: Number(capacity)
      };
      
      // Use the correct restaurant ID format
      const formattedId = restaurantId.trim();
      console.log('Creating table with formatted ID:', formattedId);
      
      const createdTable = await TableService.createTable(formattedId, newTableData);
      
      if (createdTable) {
        toast.success('Table created successfully');
        setTables([...tables, createdTable]);
        resetForm();
      } else {
        throw new Error('Failed to create table');
      }
    } catch (error) {
      console.error('Error creating table:', error);
      setError(error instanceof Error ? error.message : 'Failed to create table');
      toast.error('Failed to create table');
    } finally {
      setIsCreating(false);
    }
  };
  
  const resetForm = () => {
    setTableNumber('');
    setTableName('');
    setCapacity(2);
    setShowCreateForm(false);
  };
  
  // Handle QR code download
  const handleDownloadQrCode = async (table: Table) => {
    if (!table.qrCodeUrl) {
      toast.error('QR code not available for this table');
      return;
    }
    
    try {
      // Fetch the image as a blob
      const response = await fetch(table.qrCodeUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch QR code: ${response.status}`);
      }
      
      // Get the image as a blob
      const blob = await response.blob();
      
      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `QR_Code_${table.tableNumber}.png`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      
      toast.success(`QR code for ${table.name} downloaded`);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };
  
  // Handle QR code preview
  const handlePreviewQrCode = (table: Table) => {
    if (!table.qrCodeUrl) {
      toast.error('QR code not available for this table');
      return;
    }
    setPreviewQrCode({
      url: table.qrCodeUrl,
      tableName: table.name,
      tableNumber: table.tableNumber
    });
  };
  
  // Close QR code preview
  const closePreview = () => {
    setPreviewQrCode(null);
  };
  
  return (
    <div className="h-full">
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Table Management</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manage your restaurant tables and QR codes
              {restaurantId && <span className="ml-1 text-xs">(Restaurant ID: {restaurantId})</span>}
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            disabled={!restaurantId || restaurantId === 'undefined' || restaurantId === 'null'}
          >
            Add New Table
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-xs">{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tables.length === 0 ? (
            <div className="col-span-full p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">No tables found. Create your first table to get started.</p>
            </div>
          ) : (
            tables.map((table) => (
              <div key={table.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{table.name}</h3>
                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${table.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {table.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Table #{table.tableNumber}</p>
                  
                  <div className="flex items-center mb-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center mr-3">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                      {table.capacity} seats
                    </span>
                    
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {new Date(table.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-center mb-2">
                    {table.qrCodeUrl ? (
                      <div className="relative">
                        <img 
                          src={table.qrCodeUrl} 
                          alt={`QR Code for ${table.name}`} 
                          className="w-24 h-24 object-contain"
                        />
                        <div className="absolute bottom-0 right-0 flex space-x-1">
                          <button 
                            onClick={() => handlePreviewQrCode(table)}
                            className="p-0.5 bg-gray-800 bg-opacity-70 rounded text-white hover:bg-opacity-100 transition-all"
                            title="Preview QR Code"
                          >
                            <FiEye size={14} />
                          </button>
                          <button 
                            onClick={() => handleDownloadQrCode(table)}
                            className="p-0.5 bg-blue-600 bg-opacity-70 rounded text-white hover:bg-opacity-100 transition-all"
                            title="Download QR Code"
                          >
                            <FiDownload size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-400">QR Code not available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <button className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                      View Orders
                    </button>
                    <button className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Create Table Form */}
      {showCreateForm && (
        <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
          <h2 className="text-xs font-medium text-gray-900 dark:text-white mb-3">Create New Table</h2>
          <form onSubmit={handleCreateTable}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label htmlFor="tableNumber" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Table Number*
                </label>
                <input
                  type="text"
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="T101"
                  required
                />
              </div>
              <div>
                <label htmlFor="tableName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Table Name*
                </label>
                <input
                  type="text"
                  id="tableName"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Window Table"
                  required
                />
              </div>
              <div>
                <label htmlFor="capacity" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacity*
                </label>
                <input
                  type="number"
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="20"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                disabled={isCreating}
              >
                {isCreating ? <LoadingSpinner size="xs" /> : 'Create Table'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* QR Code Preview Modal */}
      {previewQrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closePreview}>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg max-w-xs w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">QR Code Preview</h3>
              <button 
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {previewQrCode.tableName} (#{previewQrCode.tableNumber})
              </p>
              <img 
                src={previewQrCode.url} 
                alt={`QR Code for ${previewQrCode.tableName}`} 
                className="max-w-full h-auto max-h-48 border border-gray-200 dark:border-gray-700 rounded"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const table = tables.find(t => t.qrCodeUrl === previewQrCode.url);
                  if (table) handleDownloadQrCode(table);
                  closePreview();
                }}
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center"
              >
                <FiDownload className="mr-1" size={12} /> Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 