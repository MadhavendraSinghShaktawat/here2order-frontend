import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registerRestaurant } from '../../services/auth-service';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';
import { LoadingSpinner } from '../ui/loading-spinner';
// import { debugRegistration } from '../../utils/debug-api';

export const SignupForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [restaurantName, setRestaurantName] = useState<string>('');
  
  // Address fields
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { colors } = useTheme();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!name || !email || !password || !restaurantName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate address fields
    if (!street || !city || !state || !postalCode || !country) {
      toast.error('Please fill in all address fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create a properly structured registration data object
      const registrationData = {
        name,
        email,
        password,
        phone: phone || undefined,
        restaurant: {
          name: restaurantName,
          address: {
            street,
            city,
            state,
            postalCode,
            country
          },
          contact: {
            phone: phone || '',
            email: email
          }
        }
      };
      
      // console.log('Sending registration data:', JSON.stringify(registrationData, null, 2));
      
      /* 
      // Debug registration code - commented out for production
      if (import.meta.env.DEV) {
        const debugResult = await debugRegistration(registrationData);
        
        if (debugResult.success) {
          // Handle successful registration
          toast.success('Registration successful!');
          navigate('/restaurant/dashboard');
        } else {
          // Handle registration error with more details
          console.error('Registration debug details:', debugResult);
          
          if (debugResult.status === 500) {
            toast.error('Server error. Please try again later or contact support.');
          } else if (debugResult.status === 400) {
            toast.error(`Invalid data: ${debugResult.data?.message || 'Please check your information.'}`);
          } else if (debugResult.status === 409) {
            toast.error('Email already in use. Please try another email address.');
          } else {
            toast.error(`Error: ${debugResult.message || 'Unknown error'}`);
          }
        }
      } else {
      */
      
      // Standard registration
      await registerRestaurant(registrationData);
      toast.success('Registration successful!');
      navigate('/restaurant/dashboard');
      
      // }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Provide more specific error messages based on the error type
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection or the server might be down.');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 409) {
          toast.error('Email already in use. Please try another email address.');
        } else if (error.response.status === 400) {
          toast.error(`Invalid registration data: ${error.response.data.message || 'Please check your information.'}`);
        } else if (error.response.status === 404) {
          toast.error('Server endpoint not found. Please contact support.');
        } else if (error.response.status === 500) {
          toast.error('Server error. Please try again later or contact support.');
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
    <form id="signup-form" className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 sm:pl-12 w-full px-3 sm:px-5 py-3 sm:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm sm:text-base transition-colors duration-300 disabled:opacity-70"
            style={{ 
              borderColor: 'rgba(0,0,0,0.2)',
              '--tw-ring-color': colors.primary,
              '--tw-ring-opacity': 0.5
            } as React.CSSProperties}
            placeholder="Full Name"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.3 }}
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
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            disabled={isLoading}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-10 sm:pl-12 w-full px-3 sm:px-5 py-3 sm:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm sm:text-base transition-colors duration-300 disabled:opacity-70"
            style={{ 
              borderColor: 'rgba(0,0,0,0.2)',
              '--tw-ring-color': colors.primary,
              '--tw-ring-opacity': 0.5
            } as React.CSSProperties}
            placeholder="Phone Number"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <input
            id="restaurantName"
            name="restaurantName"
            type="text"
            required
            disabled={isLoading}
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="pl-10 sm:pl-12 w-full px-3 sm:px-5 py-3 sm:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm sm:text-base transition-colors duration-300 disabled:opacity-70"
            style={{ 
              borderColor: 'rgba(0,0,0,0.2)',
              '--tw-ring-color': colors.primary,
              '--tw-ring-opacity': 0.5
            } as React.CSSProperties}
            placeholder="Restaurant Name"
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
            autoComplete="new-password"
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

      {/* Restaurant Address Section Header */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="pt-2"
      >
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Address (Required)</h3>
      </motion.div>

      {/* Address fields */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="space-y-4"
      >
        <div className="relative">
          <input
            id="street"
            name="street"
            type="text"
            required
            disabled={isLoading}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm transition-colors duration-300 disabled:opacity-70"
            style={{ 
              borderColor: 'rgba(0,0,0,0.2)',
              '--tw-ring-color': colors.primary,
              '--tw-ring-opacity': 0.5
            } as React.CSSProperties}
            placeholder="Street Address"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              id="city"
              name="city"
              type="text"
              required
              disabled={isLoading}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm transition-colors duration-300 disabled:opacity-70"
              style={{ 
                borderColor: 'rgba(0,0,0,0.2)',
                '--tw-ring-color': colors.primary,
                '--tw-ring-opacity': 0.5
              } as React.CSSProperties}
              placeholder="City"
            />
          </div>
          
          <div className="relative">
            <input
              id="state"
              name="state"
              type="text"
              required
              disabled={isLoading}
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm transition-colors duration-300 disabled:opacity-70"
              style={{ 
                borderColor: 'rgba(0,0,0,0.2)',
                '--tw-ring-color': colors.primary,
                '--tw-ring-opacity': 0.5
              } as React.CSSProperties}
              placeholder="State/Province"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              required
              disabled={isLoading}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm transition-colors duration-300 disabled:opacity-70"
              style={{ 
                borderColor: 'rgba(0,0,0,0.2)',
                '--tw-ring-color': colors.primary,
                '--tw-ring-opacity': 0.5
              } as React.CSSProperties}
              placeholder="Postal Code"
            />
          </div>
          
          <div className="relative">
            <input
              id="country"
              name="country"
              type="text"
              required
              disabled={isLoading}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 shadow-sm text-sm transition-colors duration-300 disabled:opacity-70"
              style={{ 
                borderColor: 'rgba(0,0,0,0.2)',
                '--tw-ring-color': colors.primary,
                '--tw-ring-opacity': 0.5
              } as React.CSSProperties}
              placeholder="Country"
            />
          </div>
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