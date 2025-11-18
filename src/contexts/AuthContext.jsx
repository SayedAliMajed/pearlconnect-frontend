/**
 * @fileoverview Authentication Context Provider for PearlConnect
 *
 * This context provides authentication state management throughout the application.
 * It handles JWT token storage, decoding, and user state persistence across page reloads.
 * All components that need access to user authentication state use this context.
 */

import { createContext, useState } from 'react';

/**
 * AuthContext - React Context object for authentication state
 * Exported to allow components to consume authentication data
 */
const AuthContext = createContext();

/**
 * AuthProvider Component
 *
 * Wraps the application to provide authentication context to all child components.
 * Manages user state and provides login/logout functionality through setUser.
 *
 * @param {Object} props - React component props
 * @param {ReactNode} props.children - Child components that need auth access
 */
function AuthProvider({ children }) {
  /**
   * Decodes JWT token to extract user information
   *
   * JWT tokens consist of three parts: header.payload.signature
   * We decode the base64-encoded payload to get user data
   *
   * @returns {Object|null} Decoded user object or null if no/invalid token
   */
  const getUserFromToken = () => {
    const token = localStorage.getItem('token');

    // If no token exists, user is not authenticated
    if (!token) return null;

    try {
      // Decode the JWT payload (second part of token)
      // JWT format: header.payload.signature
      const decodedPayload = JSON.parse(atob(token.split('.')[1]));
      return decodedPayload;
    } catch (err) {
      // Token is invalid or corrupted
      console.log('Token decoding failed:', err);
      return null;
    }
  };

  // Initialize user state from stored token on app load
  const [user, setUser] = useState(getUserFromToken());

  // Context value object contains user data and setter function
  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>
      {/* All child components can now access user state and setUser function */}
      {children}
    </AuthContext.Provider>
  );
};

// Export both the Provider component and Context for use throughout the app
export { AuthProvider, AuthContext };
