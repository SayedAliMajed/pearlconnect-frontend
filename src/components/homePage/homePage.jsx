// src/components/homePage/homePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Container from '../ui/Container';
import Card from '../ui/Card';
import { useCategories } from '../../hooks/useCategories';
import { formatPrice } from '../../utils/dateUtils';
import { fetchServices } from '../../services/bookings';
import './homePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { categories: featuredCategories, loading: categoriesLoading, error: categoriesError } = useCategories();


  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log('🔄 Homepage: Token check -', !!token);

        if (token) {
          // Try to fetch real services if user is authenticated
          console.log('👤 User authenticated, attempting to fetch all services...');
          const apiResponse = await fetchServices();
          const apiServices = apiResponse?.services || (Array.isArray(apiResponse) ? apiResponse : []);
          console.log('📋 fetchServices returned:', Array.isArray(apiServices) ? `${apiServices.length} services` : apiServices);

          if (apiServices && Array.isArray(apiServices) && apiServices.length > 0) {
            console.log(`✅ Found ${apiServices.length} real services, showing first 6:`, apiServices.slice(0, 3).map(s => `${s.title} (${s._id})`));
            // Show real API services (limit to 6 for homepage display)
            setServices(apiServices.slice(0, 6));
            return;
          } else {
            console.log('⚠️ No API services found or empty response');
          }
        } else {
          console.log('🚫 No authentication token found');
        }

        // No fallback data - only live data available
        console.log('� No live data available - user needs to authenticate to view services');
        setServices([]);

      } catch (error) {
        console.log('💥 Error loading services:', error.message);
        // No fallback data - only live data available
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleCategoryClick = (categoryName) => {
    console.log('Navigating to category:', categoryName);
    // Navigate to categories page with the selected category as a query parameter
    const encodedCategory = encodeURIComponent(categoryName);
    navigate(`/categories?category=${encodedCategory}`);
  };

  const handleServiceClick = (service) => {
    const serviceId = service._id || service.id;
    if (serviceId) {
      navigate(`/services/${serviceId}`);
    } else {
      console.error('Service has no ID:', service);
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <Container size="xlarge" padding={false}>
          <div className="hero-content">
            <h1 className="hero-title">Find the Best Local Services</h1>
            <p className="hero-subtitle">
              Connect with trusted professionals for all your service needs
            </p>
          </div>
        </Container>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories">
        <Container size="xlarge">
          <h2 className="section-title">Featured Categories</h2>
          <p className="section-subtitle">Browse our most popular service categories</p>

          <div className="categories-grid">
            {categoriesLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>
                <p>Loading categories...</p>
              </div>
            ) : Array.isArray(featuredCategories) && featuredCategories.length > 0 ? (
              featuredCategories.map(category => (
                <Card
                  key={category._id || category.id || category.name}
                  variant="category"
                  onClick={() => handleCategoryClick(category.name)}
                  className="category-card"
                >
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description || 'Professional services'}</p>
                  <span className="category-count">{category.serviceCount || 0} services</span>
                </Card>
              ))
            ) : (
              !categoriesLoading && !categoriesError && (
                <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>
                  <p>No categories available yet. Categories will appear here once added to the database.</p>
                </div>
              )
            )}
          </div>
        </Container>
      </section>

      {/* Popular Services */}
      <section className="popular-services">
        <Container size="xlarge">
          <h2 className="section-title">Popular Services</h2>
          <p className="section-subtitle">Highly rated services from trusted professionals</p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading services...</p>
            </div>
          ) : services.length > 0 ? (
            <div className="services-grid">
              {services.map(service => (
                <Card
                  key={service._id || service.id}
                  variant="service"
                  layout="wireframe"
                  className="service-card"
                  onClick={() => handleServiceClick(service)}
                >
                  <img
                    src={
                      // For API services (have _id): check service.images array
                      service._id
                        ? (service.images?.[0]?.url || service.images?.[0])
                        // For test services (have id): use service.image
                        : service.image
                    }
                    alt={service.title}
                    className="ui-card__image"
                  />
                  <div className="ui-card__content">
                    <h3 className="ui-card__title">{service.title}</h3>
                    <p className="ui-card__subtitle">{service.subtitle}</p>
                    <div className="ui-card__price">{formatPrice(service.price, service.currency)}</div>
                    <button className="ui-card__button">View Details</button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Please sign in to view available services.</p>
            </div>
          )}
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img alt="PearlConnect Logo" className="h-6 w-6 mr-2" src="/img/logo.png" />
                <span className="text-lg font-bold">PearlConnect</span>
              </div>
              <p className="text-gray-400">
                Connecting communities in Bahrain, one service at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-white">Find Services</Link></li>
                <li><Link to="/categories" className="hover:text-white">Browse Categories</Link></li>
                <li><Link to="/sign-up" className="hover:text-white">Become a Pro</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 PearlConnect Bahrain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
