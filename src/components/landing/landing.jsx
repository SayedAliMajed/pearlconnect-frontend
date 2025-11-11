// src/components/landing/landing.jsx

import React, { useState } from 'react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { popularServices, featuredCategories, formatPrice } from '../../data/services';
import './landing.css';

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }

    return stars.join(' ');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container size="xlarge" padding={false}>
          <div className="hero-content">
            <h1 className="hero-title">Find the Best Local Services</h1>
            <p className="hero-subtitle">
              Connect with trusted professionals for all your service needs
            </p>
            
            {/* Search/Filter Bar */}
            <div className="search-bar">
              <div className="search-input-wrapper">
                <Input
                  type="text"
                  placeholder="Search for services"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  }
                  className="search-input"
                />
              </div>
              
              <div className="category-dropdown">
                <Input
                  type="select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="All Categories">All Categories</option>
                  {featuredCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Input>
              </div>
              
              <Button
                variant="primary"
                size="search"
                onClick={handleSearch}
                className="search-button"
              >
                Search
              </Button>
            </div>
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
          
          <div className="services-grid">
            {popularServices.map(service => (
              <Card
                key={service.id}
                variant="service"
                layout="wireframe"
                className="service-card"
              >
                <img
                  src={service.image}
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
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
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

export default Landing;
