// src/App.jsx

import { Routes, Route } from 'react-router'; // Import React Router

import NavBar from './components/navbar/navbar';
// Import the new auth page components
import SignUpPage from './pages/auth/SignUpPage';
import SignInPage from './pages/auth/SignInPage';
import Landing from './components/landing/landing';
import Dashboard from './components/dashboard/dashboard';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* Hide NavBar on auth pages for cleaner design */}
      {!(window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up') && <NavBar />}

      <Routes>
        {/* Auth Routes - Full page design without navbar */}
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        
        {/* Main App Routes */}
        {
          user ?
          <>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/products' element={<h1>Products</h1>}/>
            <Route path='/favs' element={<h1>Favorites</h1>}/>
            <Route path='/profile' element={<h1>{user.username}</h1>}/>
            <Route path='/orders' element={<h1>Orders</h1>}/>
          </>
            :
            <Route path='/' element={<Landing/>}/>
        }
      </Routes>
    </>
  );
};

export default App;
