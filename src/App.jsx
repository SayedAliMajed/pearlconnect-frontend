// src/App.jsx

import { Routes, Route, useLocation, Navigate } from 'react-router'; // Import React Router

import NavBar from './components/navbar/navbar';
// Import the new auth page components
import SignUpPage from './components/auth/SignUpPage';
import SignInPage from './components/auth/SignInPage';
import HomePage from './components/homePage/homePage';
import LandingPage from './pages/landing/LandingPage';
import Dashboard from './components/dashboard/dashboard';
import ServicesPage from './pages/services/ServicesPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import BookingsPage from './pages/bookings/BookingsPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProviderDashboard from './pages/providers/ProviderDashboard';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <>
      {/* Show NavBar for logged-in users, hide on auth pages */}
      {user && !(location.pathname === '/sign-in' || location.pathname === '/sign-up') && <NavBar />}

      <Routes>
        {/* Auth Routes - Full page design without navbar */}
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/sign-in' element={<SignInPage />} />

        {/* Main App Routes - Landing page for guests, homepage for users */}
        <Route path='/' element={user ? <HomePage/> : <LandingPage/>}/>
        <Route path='/services/:serviceId' element={user ? <ServiceDetailPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/services' element={user ? <ServicesPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/categories' element={user ? <CategoriesPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/bookings' element={user ? <BookingsPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/reviews' element={user ? <ReviewsPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to="/sign-in" replace />} />
        <Route path='/provider/dashboard' element={user ? <ProviderDashboard /> : <Navigate to="/sign-in" replace />} />
        <Route path='/products' element={user ? <h1>Products</h1> : <Navigate to="/sign-in" replace />} />
        <Route path='/favs' element={user ? <h1>Favorites</h1> : <Navigate to="/sign-in" replace />} />
        <Route path='/profile' element={user ? <ProfilePage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/orders' element={user ? <h1>Orders</h1> : <Navigate to="/sign-in" replace />} />
      </Routes>
    </>
  );
};

export default App;
