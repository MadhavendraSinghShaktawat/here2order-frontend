// Environment configuration utility

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';
export const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || 3000;
export const SERVER_HOST = import.meta.env.VITE_SERVER_HOST || 'localhost';
export const SERVER_PROTOCOL = import.meta.env.VITE_SERVER_PROTOCOL || 'http';

// Feature Flags
export const DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';

// Full server URL
export const SERVER_URL = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}`;

// Helper function to log only in debug mode
export const debugLog = (message: string, ...args: any[]): void => {
  if (DEBUG) {
    console.log(message, ...args);
  }
}; 