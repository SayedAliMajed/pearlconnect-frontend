// src/components/navbar/navbar.jsx

import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import { featuredCategories } from '../../data/services';
import './navbar.css';

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowAccountDropdown(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="pc-header">
      <div className="pc-header-top">
        <div className="pc-header-container">
          {/* Logo Section */}
          <div className="pc-header-logo">
            <Link to="/" className="pc-logo-link">
              <img src="/img/logo.png" alt="PearlConnect" className="pc-logo-image" />
              <span className="pc-logo-text">PearlConnect</span>
            </Link>
          </div>



          {/* Search Bar */}
          <div className="pc-header-search">
            <form onSubmit={handleSearch} className="pc-search-form">
              <select className="pc-search-category">
                <option value="all">All Categories</option>
                {featuredCategories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PearlConnect services..."
                className="pc-search-input"
              />
              <button type="submit" className="pc-search-button">
                Search
              </button>
            </form>
          </div>

          {/* Account & Orders */}
          <div className="pc-header-account">
            <div className="pc-account-section">
              <button 
                className="pc-account-button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              >
                <span className="pc-account-greeting">
                  {user ? `Hello, ${user.username}` : 'Hello, Sign in'}
                </span>
                <span className="pc-account-options">Account & Lists</span>
              </button>
              
              {showAccountDropdown && (
                <div className="pc-account-dropdown">
                  {user ? (
                    <div className="pc-dropdown-content">
                      <Link to="/profile" className="pc-dropdown-item">Your Account</Link>
                      <Link to="/orders" className="pc-dropdown-item">Your Orders</Link>
                      <Link to="/favorites" className="pc-dropdown-item">Your Favorites</Link>
                      <button onClick={handleSignOut} className="pc-dropdown-item pc-sign-out">
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="pc-dropdown-content">
                      <Link to="/sign-in" className="pc-dropdown-item pc-sign-in">
                        Sign In
                      </Link>
                      <Link to="/sign-up" className="pc-dropdown-item">
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Returns & Orders */}
          <div className="pc-header-returns">
            <Link to="/orders" className="pc-returns-link">
              <span className="pc-returns-text">Returns</span>
              <span className="pc-orders-text">& Orders</span>
            </Link>
          </div>

          {/* Cart */}
          <div className="pc-header-cart">
            <Link to="/cart" className="pc-cart-link">
              <span className="pc-cart-icon">🛒</span>
              <span className="pc-cart-count">0</span>
              <span className="pc-cart-text">Cart</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="pc-mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span className="pc-menu-icon">☰</span>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="pc-header-nav">
        <div className="pc-header-container">
          <div className="pc-nav-links">
            <Link to="/" className="pc-nav-link">Home</Link>
            <Link to="/services" className="pc-nav-link">Services</Link>
            <Link to="/categories" className="pc-nav-link">Categories</Link>
            <Link to="/bookings" className="pc-nav-link">Bookings</Link>
            <Link to="/reviews" className="pc-nav-link">Reviews</Link>
            {user && <Link to="/dashboard" className="pc-nav-link">Dashboard</Link>}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="pc-mobile-menu">
          <div className="pc-mobile-menu-content">
            <Link to="/" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
            <Link to="/services" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
              Services
            </Link>
            <Link to="/categories" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
              Categories
            </Link>
            <Link to="/bookings" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
              Bookings
            </Link>
            <Link to="/reviews" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
              Reviews
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="pc-mobile-link pc-mobile-signout">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
                  Sign In
                </Link>
                <Link to="/sign-up" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
