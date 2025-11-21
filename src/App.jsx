/**
 * @fileoverview Main application component for PearlConnect
 *
 * This component serves as the routing hub for the entire application.
 * It manages authentication-based routing, conditional navbar display,
 * and defines all the application's main routes.
 */

import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';

// UI Components
import NavBar from './components/navbar/navbar';

// Authentication Components
import SignUpPage from './components/auth/SignUpPage';
import SignInPage from './components/auth/SignInPage';

// Main Application Pages
import HomePage from './components/homePage/homePage';
import LandingPage from './pages/landing/LandingPage';
import Dashboard from './components/dashboard/dashboard';

// Service-related Pages
import ServicesPage from './pages/services/ServicesPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import CategoriesPage from './pages/categories/CategoriesPage';

// User-specific Pages
import BookingsPage from './pages/bookings/BookingsPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import ProfilePage from './pages/profile/ProfilePage';

// Provider-specific Pages
import ProviderDashboard from './pages/providers/ProviderDashboard';

const App = () => {
  // Get authentication state from AuthContext
  const { user } = useContext(AuthContext);
  // Get current route location for conditional rendering
  const location = useLocation();

  return (
    <>
      {/* Conditional Navbar Rendering */}
      {/* Only show navbar for authenticated users, excluding auth pages */}
      {user && !(location.pathname === '/sign-in' || location.pathname === '/sign-up') && <NavBar />}

      {/* Application Routes Definition */}
      <Routes>
        {/* Authentication Routes */}
        {/* These pages have full-screen designs without navigation */}
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/sign-in' element={<SignInPage />} />

        {/* Protected Application Routes */}
        {/* Different content for authenticated vs unauthenticated users */}
        <Route path='/' element={user ? <HomePage/> : <LandingPage/>}/>

        {/* Service-related routes - require authentication */}
        <Route path='/services/:serviceId' element={user ? <ServiceDetailPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/services' element={user ? <ServicesPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/categories' element={user ? <CategoriesPage /> : <Navigate to="/sign-in" replace />} />

        {/* User account routes - require authentication with sub-routes */}
        <Route path='/bookings' element={user ? <BookingsPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/bookings/new' element={user ? <BookingsPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/reviews' element={user ? <ReviewsPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/reviews/new' element={user ? <ReviewsPage /> : <Navigate to="/sign-in" replace />} />
        <Route path='/dashboard' element={user ? <Dashboard /> : <Navigate to="/sign-in" replace />} />
        <Route path='/profile' element={user ? <ProfilePage /> : <Navigate to="/sign-in" replace />} />

        {/* Provider-specific routes - require authentication with nested tabs */}
        <Route path='/provider/dashboard' element={user ? <ProviderDashboard /> : <Navigate to="/sign-in" replace />} />
        <Route path='/provider/dashboard/:tab' element={user ? <ProviderDashboard /> : <Navigate to="/sign-in" replace />} />

        {/* Placeholder routes for future features */}
        <Route path='/products' element={user ? <h1>Products</h1> : <Navigate to="/sign-in" replace />} />
        <Route path='/favs' element={user ? <h1>Favorites</h1> : <Navigate to="/sign-in" replace />} />
        <Route path='/orders' element={user ? <h1>Orders</h1> : <Navigate to="/sign-in" replace />} />
      </Routes>
    </>
  );
};

export default App;
