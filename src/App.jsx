// src/App.jsx

import { Routes, Route, useLocation } from 'react-router'; // Import React Router

import NavBar from './components/navbar/navbar';
// Import the new auth page components
import SignUpPage from './components/auth/SignUpPage';
import SignInPage from './components/auth/SignInPage';
import HomePage from './components/homePage/homePage';
import Dashboard from './components/dashboard/dashboard';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <>
      {/* Hide NavBar on auth pages for cleaner design */}
      {!(location.pathname === '/sign-in' || location.pathname === '/sign-up') && <NavBar />}

      <Routes>
        {/* Auth Routes - Full page design without navbar */}
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/sign-in' element={<SignInPage />} />

        {/* Main App Routes - Homepage for everyone */}
        <Route path='/' element={<HomePage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/products' element={<h1>Products</h1>}/>
        <Route path='/favs' element={<h1>Favorites</h1>}/>
        <Route path='/profile' element={<h1>{user ? user.username : 'Profile'}</h1>}/>
        <Route path='/orders' element={<h1>Orders</h1>}/>
      </Routes>
    </>
  );
};

export default App;
