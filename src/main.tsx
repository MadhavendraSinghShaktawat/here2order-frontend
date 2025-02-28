import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/theme-context';
import App from './App';
import RestaurantLogin from './pages/restaurant-login';
import RestaurantDashboard from './pages/restaurant-dashboard';
import './index.css';
import { initializeAuthState } from './utils/auth-setup';

// Initialize authentication state
initializeAuthState();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/restaurant-login" element={<RestaurantLogin />} />
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
