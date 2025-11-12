// src/contexts/AuthContext.jsx

import { createContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const getUserFromToken = () => {
    const token = localStorage.getItem('token');

    if (!token) return null;

    try {
      // Try to decode the token payload
      return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      // If token decoding fails, return null
      console.log('Token decoding failed:', err);
      return null;
    }
  };

  // Create state just like you normally would in any other component
  const [user, setUser] = useState(getUserFromToken());
  // This is the user state and the setUser function that will update it!
  // This variable name isn't special; it's just convention to use `value`.
  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>
      {/* The data we pass to the value prop above is now available to */}
      {/* all the children of the AuthProvider component. */}
      {children}
    </AuthContext.Provider>
  );
};

// When components need to use the value of the user context, they will need
// access to the AuthContext object to know which context to access.
// Therefore, we export it here.
export { AuthProvider, AuthContext };
