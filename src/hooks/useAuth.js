/**
 * @fileoverview Custom React hook for authentication state management
 *
 * Provides a convenient interface for accessing authentication context throughout the app.
 * This hook encapsulates the context consumption and provides additional auth-related utilities.
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook for authentication state and utilities
 *
 * @returns {Object} Authentication state and helper functions
 * @property {Object|null} user - Current authenticated user object or null
 * @property {Function} setUser - Function to update user state (for login/logout)
 * @property {boolean} isAuthenticated - Whether user is currently authenticated
 * @property {boolean} isProvider - Whether authenticated user is a service provider
 * @property {boolean} isCustomer - Whether authenticated user is a customer
 */
const useAuth = () => {
  // Consume authentication context
  const { user, setUser } = useContext(AuthContext);

  // Computed authentication state
  const isAuthenticated = !!user;
  const isProvider = user?.role === 'provider';
  const isCustomer = user?.role === 'customer' || user?.role === 'user';

  /**
   * Logs out the current user by clearing authentication state
   * Note: Token cleanup is typically handled by the component calling this
   */
  const logout = () => {
    setUser(null);
  };

  return {
    // Core auth state
    user,
    setUser,

    // Computed properties
    isAuthenticated,
    isProvider,
    isCustomer,

    // Helper functions
    logout,
  };
};

export default useAuth;
