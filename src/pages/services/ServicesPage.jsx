import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import { useCategories } from '../../hooks/useCategories';
import { formatPrice } from '../../utils/dateUtils';
import { fetchServices } from '../../services/bookings';

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories: allCategories } = useCategories();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialize search parameters from URL on mount and location change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get('q');
    const categoryParam = urlParams.get('category');

    if (queryParam) {
      setSearchQuery(queryParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        // Try to fetch from API first
        const apiResponse = await fetchServices();
        const apiServices = apiResponse?.services || (Array.isArray(apiResponse) ? apiResponse : []);

        console.log('Services Page - fetchServices returned:', Array.isArray(apiServices) ? `${apiServices.length} services` : apiServices);

        if (apiServices && Array.isArray(apiServices) && apiServices.length > 0) {
          console.log('✅ Services Page - Showing real API services');
          setServices(apiServices);
        } else {
          console.log('⚠️ Services Page - Falling back to test data');
          // Fallback to static data
          console.log('⚠️ Services Page - No live services available');
          setServices([]);
        }
      } catch (error) {
        console.log('Services Page - API error:', error.message);
        // No fallback data - only live data available
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service =>
        service.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, selectedCategory, searchQuery]);

  const handleServiceClick = (service) => {
    const serviceId = service._id || service.id;
    if (serviceId) {
      navigate(`/services/${serviceId}`);
    } else {
      console.error('Service has no ID:', service);
    }
  };

  if (loading) {
    return (
      <Container size="xlarge">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading services...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="services-page">
      {/* Header Section */}
      <section className="services-header">
        <Container size="xlarge">
          <h1 className="page-title">Our Services</h1>
          <p className="page-subtitle">Find and book the best local services for all your needs</p>
        </Container>
      </section>

      {/* Filters Section */}
      <section className="services-filters">
        <Container size="xlarge">
          <div className="filters-container">
            {/* Category Filter */}
            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {allCategories.map(category => (
                  <option key={category._id || category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div className="filter-group">
              <label htmlFor="search-filter">Search:</label>
              <input
                id="search-filter"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="filter-input"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <Container size="xlarge">
          {filteredServices.length > 0 ? (
            <>
              <div className="services-count">
                <p>{filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found</p>
              </div>
              <div className="services-grid">
                {filteredServices.map(service => (
                  <Card
                    key={service.id || service._id}
                    variant="service"
                    layout="wireframe"
                    className="service-card"
                    onClick={() => handleServiceClick(service)}
                  >
                    <img
                      src={
                        // For API services (have _id): check service.images array
                        service._id
                          ? (service.images?.[0]?.url || service.images?.[0] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=297&h=167&fit=crop')
                          // For test services (have id): use service.image
                          : (service.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=297&h=167&fit=crop')
                      }
                      alt={service.title}
                      className="ui-card__image"
                    />
                    <div className="ui-card__content">
                      <h3 className="ui-card__title">{service.title}</h3>
                      <p className="ui-card__subtitle">{service.subtitle}</p>
                      <div className="service-meta">
                        <span className="service-category">{service.category?.name || service.category}</span>
                        <div className="service-rating">
                          ⭐ {service.rating || 'N/A'} ({service.reviews || 0} reviews)
                        </div>
                      </div>
                      <div className="ui-card__price">
                        {formatPrice(service.price, service.currency)}
                      </div>
                      <button className="ui-card__button">Book Now</button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="no-services">
              <h3>No services found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default ServicesPage;
