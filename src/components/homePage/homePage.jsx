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

        if (token) {
          // Try to fetch real services if user is authenticated
          const apiResponse = await fetchServices();
          const apiServices = apiResponse?.services || (Array.isArray(apiResponse) ? apiResponse : []);

          if (apiServices && Array.isArray(apiServices) && apiServices.length > 0) {
            // Show real API services (limit to 6 for homepage display)
            setServices(apiServices.slice(0, 6));
            return;
          }
        }

        // No fallback data - only live data available
        setServices([]);

      } catch (error) {
        console.error('Error loading services:', error);
        // No fallback data - only live data available
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleCategoryClick = (categoryName) => {
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
