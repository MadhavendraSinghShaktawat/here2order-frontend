import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/theme-context';
import RestaurantLogin from './pages/restaurant-login';
import RestaurantDashboard from './pages/restaurant-dashboard';
import { Link } from 'react-router-dom'
import { Logo } from './components/ui/logo'
import './App.css'

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/restaurant-login" replace />} />
          <Route path="/restaurant-login" element={<RestaurantLogin />} />
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
      <div className="App">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Logo className="h-8" />
              <nav className="flex space-x-4">
                <Link 
                  to="/restaurant-login" 
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Restaurant Login
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900">Welcome to Here2Order</h1>
                  <p className="mt-4 text-xl text-gray-600">The easiest way to manage your restaurant orders</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
