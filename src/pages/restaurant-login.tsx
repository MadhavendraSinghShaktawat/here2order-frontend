import React, { useState, useRef } from 'react';
import { ThemeToggle } from '../components/ui/theme-toggle';
import { LoginForm } from '../components/auth/login-form';
import { SignupForm } from '../components/auth/signup-form';
import { motion } from 'framer-motion';
import { useTheme } from '../context/theme-context';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ApiTest } from '../components/test/api-test';
import { ServerStatus } from '../components/ui/server-status';

const RestaurantLogin: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [showSignIn, setShowSignIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { colors } = useTheme();
  const formContainerRef = useRef<HTMLDivElement>(null);

  const toggleMode = (): void => {
    setIsLoginMode(!isLoginMode);
  };

  const handleArrowClick = (): void => {
    setShowSignIn(true);
  };

  const handleBackClick = (): void => {
    setShowSignIn(false);
  };

  const handleSubmit = (): void => {
    setIsSubmitting(true);
    
    // Submit the form programmatically
    if (formContainerRef.current) {
      // Find the form inside the div and submit it
      const form = formContainerRef.current.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
    
    // Reset the submitting state after a short delay
    // This will be overridden if the form submission is successful
    setTimeout(() => {
      setIsSubmitting(false);
    }, 5000); // Longer timeout to account for potential network delays
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Welcome Screen */}
      {!showSignIn && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto flex flex-col items-center relative overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="absolute top-4 right-4 z-20">
            <ThemeToggle />
          </div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white transition-colors duration-300"
          >
            Welcome to <span className="text-flamingo font-script">Here2Order</span>
          </motion.h1>
          
          {/* Logo Card */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full h-32 sm:h-40 rounded-xl mb-10 relative overflow-hidden"
            style={{ backgroundColor: colors.primary }}
          >
            {/* Black wave */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute top-1/4 w-full h-1/2 bg-black transform -rotate-6 scale-110"></div>
            </div>
            
            {/* Gray circle */}
            <div className="absolute right-0 bottom-0 w-24 h-24 rounded-full bg-capeCod"></div>
            
            {/* Book icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 sm:h-20 w-16 sm:w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </motion.div>
          
          {/* Text and Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mb-8 w-full"
          >
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">Unlock your dineline</h2>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-300">Sign in now!</p>
            
            {/* Arrow Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleArrowClick}
              className="mx-auto bg-flamingo hover:bg-flamingo/90 text-white rounded-full h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flamingo shadow-lg transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </motion.div>
          
          {/* Gray shape at bottom */}
          <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-capeCod/20"></div>
          
          {/* API Test (remove in production) */}
          <div className="mt-8 w-full">
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Debug API Connection
              </summary>
              <div className="mt-2">
                <ApiTest />
              </div>
            </details>
          </div>
          
          {/* Server Status */}
          <div className="mt-4 w-full">
            <ServerStatus />
          </div>
        </motion.div>
      )}
      
      {/* Login/Signup Form */}
      {showSignIn && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto flex flex-col relative overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="absolute top-4 right-4 z-20">
            <ThemeToggle />
          </div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300"
          >
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </motion.h1>
          
          {/* Login/Signup Form */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-6"
            ref={formContainerRef}
          >
            {isLoginMode ? <LoginForm /> : <SignupForm />}
          </motion.div>
          
          {/* Terms & Submit Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 relative z-10 mb-6"
          >
            <div className="flex items-center w-full sm:w-auto">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 sm:h-5 sm:w-5 border-gray-300 dark:border-gray-600 rounded text-flamingo focus:ring-flamingo transition-colors duration-300"
              />
              <label htmlFor="terms" className="ml-2 block text-xs sm:text-sm text-gray-900 dark:text-white font-medium transition-colors duration-300">
                I agree with Terms & Conditions!
              </label>
            </div>
            
            {/* Circle Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-flamingo hover:bg-flamingo/90 rounded-full h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flamingo shadow-lg transition-all duration-300 disabled:opacity-70"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </motion.button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base transition-colors duration-300"
          >
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="font-bold text-flamingo underline focus:outline-none hover:text-flamingo/80 transition-colors duration-300"
            >
              {isLoginMode ? 'Sign up' : 'Sign in'}
            </button>
          </motion.p>
          
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <motion.button
              whileHover={{ x: -5 }}
              onClick={handleBackClick}
              className="text-gray-900 dark:text-white flex items-center justify-center mx-auto hover:underline focus:outline-none font-medium text-sm sm:text-base transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Welcome
            </motion.button>
          </motion.div>
          
          {/* Gray shape at bottom */}
          <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-capeCod/20"></div>
          
          {/* Server Status */}
          <div className="mt-4 w-full">
            <ServerStatus />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RestaurantLogin; 