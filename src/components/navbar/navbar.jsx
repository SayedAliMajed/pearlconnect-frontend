// src/components/navbar/navbar.jsx

import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import './navbar.css';

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { categories: navCategories, loading: navCategoriesLoading } = useCategories();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };

    if (showAccountDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccountDropdown]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowAccountDropdown(false);
    navigate('/');
  };

  // Handle search navigation (for form submission)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to services page with search parameters
      const searchParams = new URLSearchParams();
      searchParams.set('q', searchQuery.trim());

      // Get category if not "all"
      const categorySelect = e.target.querySelector('.pc-search-category');
      const selectedCategory = categorySelect?.value;
      if (selectedCategory && selectedCategory !== 'all') {
        searchParams.set('category', selectedCategory);
      }

      const queryString = searchParams.toString();
      navigate(`/services${queryString ? `?${queryString}` : ''}`);
    }
  };

  // Handle real-time search (navigate immediately when typing starts)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If user has typed at least 2 characters, navigate immediately
    if (value.trim().length >= 2) {
      const searchParams = new URLSearchParams();
      searchParams.set('q', value.trim());

      // Include current category selection
      const categorySelect = e.target.closest('form').querySelector('.pc-search-category');
      const selectedCategory = categorySelect?.value;
      if (selectedCategory && selectedCategory !== 'all') {
        searchParams.set('category', selectedCategory);
      }

      const queryString = searchParams.toString();
      navigate(`/services${queryString ? `?${queryString}` : ''}`);
    }
  };

  // Handle real-time category change (navigate immediately when category is selected)
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    // Always navigate immediately when category changes (even to "all")
    const searchParams = new URLSearchParams();

    // Include current search query if exists
    if (searchQuery.trim()) {
      searchParams.set('q', searchQuery.trim());
    }

    // Include category selection (even if it's "all" - clears category filter)
    if (selectedCategory && selectedCategory !== 'all') {
      searchParams.set('category', selectedCategory);
    }
    // If "all" is selected, don't include category param (show all categories)

    const queryString = searchParams.toString();
    navigate(`/services${queryString ? `?${queryString}` : ''}`);
  };

  const token = localStorage.getItem('token');

  return (
    <header className="pc-header">
      <div className="pc-header-top">
        <div className="pc-header-container">
          {/* Logo Section */}
          <div className="pc-header-logo">
            <Link to="/" className="pc-logo-link">
              <img src="/img/logo.png" alt="PearlConnect" className="pc-logo-image" />
              <span className="pc-logo-text"></span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="pc-header-search">
            <form onSubmit={handleSearch} className="pc-search-form">
              <select className="pc-search-category" onChange={handleCategoryChange}>
                <option value="all">All Categories</option>
                {navCategories.map(category => (
                  <option key={category._id || category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pc-search-input"
                placeholder="Search services..."
              />
              <button type="submit" className="pc-search-button">
                Search
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="pc-header-right">
            {/* Account & Orders */}
            <div className="pc-header-account" ref={dropdownRef}>
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
                        {user.role === 'provider' ? (
                          <Link to="/provider/dashboard" className="pc-dropdown-item" onClick={() => setShowAccountDropdown(false)}>
                            🏪 Provider Dashboard
                          </Link>
                        ) : (
                          <Link to="/dashboard" className="pc-dropdown-item" onClick={() => setShowAccountDropdown(false)}>
                            📊 Dashboard
                          </Link>
                        )}
                        <Link to="/profile" className="pc-dropdown-item" onClick={() => setShowAccountDropdown(false)}>👤 Your Account</Link>
                        <Link to="/orders" className="pc-dropdown-item" onClick={() => setShowAccountDropdown(false)}>📦 Your Orders</Link>
                        <Link to="/favorites" className="pc-dropdown-item" onClick={() => setShowAccountDropdown(false)}>❤️ Your Favorites</Link>
                        <button onClick={handleSignOut} className="pc-dropdown-item pc-sign-out">
                          🚪 Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="pc-dropdown-content">
                        <Link to="/sign-in" className="pc-dropdown-item pc-sign-in" onClick={() => setShowAccountDropdown(false)}>
                          Sign In
                        </Link>
                        <Link to="/sign-up" className="pc-dropdown-item" onClick={() => setShowAccountDropdown(false)}>
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
      </div>

          {/* Navigation Menu */}
      <div className="pc-header-nav">
        <div className="pc-header-container">
          <div className="pc-nav-links">
            <Link to="/" className="pc-nav-link">Home</Link>
            <Link to="/services" className="pc-nav-link">Services</Link>
            <Link to="/categories" className="pc-nav-link">Categories</Link>
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
            {user ? (
              <>
                {user.role === 'provider' ? (
                  <Link to="/provider/dashboard" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
                    Provider Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="pc-mobile-link" onClick={() => setShowMobileMenu(false)}>
                    Dashboard
                  </Link>
                )}
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
