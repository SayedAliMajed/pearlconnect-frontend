import React from 'react';
import { useNavigate } from 'react-router';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎯',
      title: 'Verified Professionals',
      description: 'All service providers are thoroughly vetted and rated by our community'
    },
    {
      icon: '⚡',
      title: 'Fast Booking',
      description: 'Book in minutes with our streamlined booking system and instant confirmations'
    },
    {
      icon: '💰',
      title: 'Fair Pricing',
      description: 'Transparent pricing with no hidden fees. Pay directly to service providers'
    },
    {
      icon: '📍',
      title: 'Local Bahrain Experts',
      description: 'Connect with skilled local professionals who understand Bahraini culture and standards'
    },
    {
      icon: '⭐',
      title: 'Quality Guaranteed',
      description: '95% customer satisfaction rate. Problems solved or money back guarantee'
    },
    {
      icon: '🕒',
      title: '24/7 Support',
      description: 'Our customer support team is available around the clock in your local time'
    }
  ];

  const services = [
    { name: 'House Cleaning', count: '150+', icon: '🧹' },
    { name: 'Home Repairs', count: '90+', icon: '🔧' },
    { name: 'Plumbing', count: '75+', icon: '🚰' },
    { name: 'Electrical', count: '60+', icon: '⚡' },
    { name: 'Gardening', count: '45+', icon: '🌳' },
    { name: 'Automotive', count: '80+', icon: '🚗' },
    { name: 'Beauty & Wellness', count: '55+', icon: '💄' },
    { name: 'Moving Services', count: '35+', icon: '📦' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container size="xlarge">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="highlight">Pearl</span>Connect
            </h1>
            <p className="hero-subtitle">
              Bahrain's Trusted Platform for Local Service Professionals
            </p>
            <p className="hero-description">
              Connect with skilled local experts for all your home and business needs.
              From house cleaning to home repairs, find verified professionals in minutes.
            </p>
            <div className="hero-actions">
              <Button variant="primary" size="large" onClick={() => navigate('/sign-up')}>
                Find Services Now
              </Button>
              <Button variant="secondary" size="large" onClick={() => navigate('/sign-up?type=provider')}>
                Become a Service Provider
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <img
                src="/img/logo.png"
                alt="PearlConnect Platform"
                className="hero-logo"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container size="large">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Professionals</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Services Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+ Cities</div>
              <div className="stat-label">Across Bahrain</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container size="large">
          <div className="section-header">
            <h2>Why Choose PearlConnect?</h2>
            <p>The most trusted way to find local services in Bahrain</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} variant="feature" className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <Container size="large">
          <div className="section-header">
            <h2>Popular Services in Bahrain</h2>
            <p>Find expert help for all your service needs</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <Card key={index} variant="service" className="service-summary-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <div className="service-count">{service.count} Professionals</div>
              </Card>
            ))}
          </div>
          <div className="services-cta">
            <Button variant="primary" size="large" onClick={() => navigate('/sign-up')}>
              Browse All Services
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container size="large">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real feedback from satisfied Bahrain residents</p>
          </div>
          <div className="testimonials-grid">
            <Card variant="testimonial" className="testimonial-card">
              <div className="testimonial-content">
                "PearlConnect helped me find an excellent home cleaner in minutes. The booking process was so smooth and the service quality was outstanding!"
              </div>
              <div className="testimonial-author">
                <strong>Sara Mohamed</strong>
                <span>Manama, Bahrain</span>
              </div>
            </Card>
            <Card variant="testimonial" className="testimonial-card">
              <div className="testimonial-content">
                "As a property manager, I use PearlConnect frequently for maintenance work. The platform makes it easy to find reliable professionals quickly."
              </div>
              <div className="testimonial-author">
                <strong>Ahmed Hassan</strong>
                <span>Muharraq</span>
              </div>
            </Card>
            <Card variant="testimonial" className="testimonial-card">
              <div className="testimonial-content">
                "Found a great AC technician through PearlConnect. Fair pricing, professional service, and excellent platform support throughout."
              </div>
              <div className="testimonial-author">
                <strong>Fatma Khalil</strong>
                <span>Riffa</span>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Provider Section */}
      <section className="provider-section">
        <Container size="large">
          <div className="provider-content">
            <div className="provider-info">
              <h2>Become a PearlConnect Service Provider</h2>
              <p>Join our growing community of skilled professionals and grow your business</p>
              <ul className="provider-benefits">
                <li>📈 Access to 10,000+ potential customers</li>
                <li>💳 Direct payments with transparent pricing</li>
                <li>⭐ Build your reputation with reviews and ratings</li>
                <li>🗓️ Flexible scheduling and availability management</li>
                <li>📱 Dedicated provider dashboard and tools</li>
                <li>🛡️ Verified professional status</li>
              </ul>
              <Button variant="primary" size="large" onClick={() => navigate('/sign-up?type=provider')}>
                Join as a Professional
              </Button>
            </div>
            <div className="provider-visual">
              <div className="provider-image">
                {/* Placeholder for provider CTA image */}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container size="large">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Service Professional?</h2>
            <p>Join thousands of satisfied customers in Bahrain who trust PearlConnect for their service needs</p>
            <div className="cta-actions">
              <Button variant="primary" size="large" onClick={() => navigate('/sign-up')}>
                Get Started For Free
              </Button>
              <Button variant="link" size="large" onClick={() => navigate('/sign-in')}>
                Already have an account? Sign In
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Container size="large">
          <div className="footer-content">
            <div className="footer-section">
              <h3>PearlConnect</h3>
              <p>Bahrain's leading platform for local services</p>
              <img src="/img/logo.png" alt="PearlConnect" className="footer-logo" />
            </div>
            <div className="footer-section">
              <h4>For Customers</h4>
              <ul>
                <li>How it Works</li>
                <li>Find Services</li>
                <li>Customer Support</li>
                <li>Trust & Safety</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>For Professionals</h4>
              <ul>
                <li>Become a Provider</li>
                <li>Provider Resources</li>
                <li>Earnings Calculator</li>
                <li>Success Stories</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>About PearlConnect</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <ul>
                <li>Email: hello@pearlconnect.bh</li>
                <li>Phone: +973 1234 5678</li>
                <li>WhatsApp: +973 3333 3333</li>
                <li>Instagram: @PearlConnectBH</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 PearlConnect. All rights reserved. Made with ❤️ in Bahrain</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
