// src/components/homePage/homePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Container from '../ui/Container';
import Card from '../ui/Card';
import { popularServices, featuredCategories, formatPrice } from '../../test/fixtures/test-services';
import { fetchServices } from '../../services/bookings';
import './homePage.css';

const HomePage = () => {
  const navigate = useNavigate();
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

        // Fallback to static test data if not authenticated or no API services
        console.log('📚 Showing test data as fallback');
        setServices(popularServices);

      } catch (error) {
        console.log('💥 Error loading services:', error.message);
        // Always fall back to static test data on any error
        setServices(popularServices);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleCategoryClick = (categoryName) => {
    // Navigate to category page or filter services
    console.log('Selected category:', categoryName);
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
            {featuredCategories.map(category => (
              <Card
                key={category.id}
                variant="category"
                onClick={() => handleCategoryClick(category.name)}
                className="category-card"
              >
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <span className="category-count">{category.serviceCount} services</span>
              </Card>
            ))}
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
          ) : (
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
          )}
        </Container>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <Container size="xlarge">
          <div className="footer-content">
            <div className="footer-section">
              <h4>PearlConnect</h4>
              <p>Your trusted platform for local services in Bahrain</p>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>Home Repair</li>
                <li>Cleaning</li>
                <li>Automotive</li>
                <li>Wellness</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>FAQ</li>
                <li>Customer Service</li>
                <li>Feedback</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 PearlConnect. All rights reserved. Made with Visily</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
