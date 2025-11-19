// src/components/homePage/homePage.jsx

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '../ui/Container';
import Card from '../ui/Card';
import { useCategories } from '../../hooks/useCategories';
import { useServices } from '../../hooks/useServices';
import { formatPrice } from '../../utils/dateUtils';
import './homePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { categories: featuredCategories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { services: allServices, loading: servicesLoading } = useServices();

  // Show first 6 services for homepage display
  const services = allServices.slice(0, 6);

  const handleCategoryClick = (categoryName) => {
    // Navigate to services page filtered by category
    navigate(`/services?category=${encodeURIComponent(categoryName)}`);
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

          {servicesLoading ? (
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
                        ? (Array.isArray(service.images) && service.images[0] ?
                           (service.images[0].url || service.images[0]) : '')
                        : service.image
                    }
                    alt={service.title}
                    className="ui-card__image"
                  />
                  <div className="ui-card__content">
                    <h3 className="ui-card__title">{service.title}</h3>
                    <p className="ui-card__subtitle">
                      {service.provider?.name || service.providerName ||
                       service.category?.name || 'Professional Service'}
                    </p>
                    <div className="ui-card__price">
                      {formatPrice(service.price, service.currency)}
                    </div>
                    <button className="ui-card__button">View Details</button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No services available yet. Services will appear here once providers add them.</p>
            </div>
          )}
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img alt="PearlConnect Logo" src="/img/logo.png" />
                <span>PearlConnect</span>
              </div>
              <p>Connecting communities in Bahrain, one service at a time.</p>
            </div>
            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Services</h3>
              <ul>
                <li><Link to="/services">Find Services</Link></li>
                <li><Link to="/categories">Browse Categories</Link></li>
                <li><Link to="/sign-up">Become a Pro</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PearlConnect Bahrain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
