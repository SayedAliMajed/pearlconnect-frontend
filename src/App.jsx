// src/App.jsx

import { Routes, Route } from 'react-router'; // Import React Router

import NavBar from './components/navbar/navbar';
// Import the auth components
import SignUpForm from './components/auth/SignUpForm';
import SignInForm from './components/auth/SignInForm';
import Landing from './components/landing/landing';
import Dashboard from './components/dashboard/dashboard';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <NavBar />

      <Routes>
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
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;
