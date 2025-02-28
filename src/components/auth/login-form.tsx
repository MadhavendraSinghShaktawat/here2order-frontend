import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginRestaurant } from '../../services/auth-service';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';
import { LoadingSpinner } from '../ui/loading-spinner';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { colors } = useTheme();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await loginRestaurant({ email, password });
      
      toast.success('Login successful!');
      navigate('/restaurant/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more specific error messages based on the error type
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection or the server might be down.');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          toast.error('Invalid email or password');
        } else if (error.response.status === 404) {
          toast.error('Server endpoint not found. Please contact support.');
        } else {
          toast.error(`Server error: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="login-form" className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 sm:pl-12 w-full px-3 sm:px-5 py-3 sm:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm sm:text-base transition-colors duration-300 disabled:opacity-70"
            style={{ 
              borderColor: 'rgba(0,0,0,0.2)',
              '--tw-ring-color': colors.primary,
              '--tw-ring-opacity': 0.5
            } as React.CSSProperties}
            placeholder="Email Address"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 sm:pl-12 w-full px-3 sm:px-5 py-3 sm:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm sm:text-base transition-colors duration-300 disabled:opacity-70"
            style={{ 
              borderColor: 'rgba(0,0,0,0.2)',
              '--tw-ring-color': colors.primary,
              '--tw-ring-opacity': 0.5
            } as React.CSSProperties}
            placeholder="Password"
          />
        </div>
      </motion.div>

      {/* Loading indicator */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <LoadingSpinner size="sm" color={colors.primary} />
        </motion.div>
      )}

      {/* Hidden submit button to trigger form submission */}
      <button type="submit" className="hidden" disabled={isLoading} />
    </form>
  );
}; 