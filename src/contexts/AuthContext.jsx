// src/contexts/AuthContext.jsx

import { createContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const getUserFromToken = () => {
    console.log('🔐 [DEBUG] AuthContext: getUserFromToken called');

    const token = localStorage.getItem('token');
    console.log('🔐 [DEBUG] AuthContext: localStorage check - available:', !!window.localStorage);
    console.log('🔐 [DEBUG] AuthContext: token exists:', !!token);

    if (!token) {
      console.log('🔐 [DEBUG] AuthContext: No token found, returning null');
      return null;
    }

    try {
      // Try to decode the token payload
      const userData = JSON.parse(atob(token.split('.')[1]));
      console.log('🔐 [DEBUG] AuthContext: Token decoded successfully, user:', userData);
      return userData;
    } catch (err) {
      // If token decoding fails, return null
      console.log('🔐 [DEBUG] AuthContext: Token decoding failed:', err);
      console.log('🔐 [DEBUG] AuthContext: Raw token:', token?.substring(0, 50) + '...');
      return null;
    }
  };

  // Create state just like you normally would in any other component
  console.log('🔐 [DEBUG] AuthContext: Initializing user state');
  const initialUser = getUserFromToken();
  console.log('🔐 [DEBUG] AuthContext: Initial user value:', initialUser);
  const [user, setUser] = useState(initialUser);
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
