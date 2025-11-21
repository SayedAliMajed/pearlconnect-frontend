import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import ServiceCard from '../../components/services/ServiceCard';
import ServiceFilter from '../../components/services/serviceFilter';
import { useCategories } from '../../hooks/useCategories';
import { formatPrice } from '../../utils/dateUtils';
import { fetchServices } from '../../services/bookings';

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories: allCategories } = useCategories();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({
    category: 'all',
    priceMin: '',
    priceMax: '',
    rating: 'all',
    sortBy: 'relevance'
  });

  // Load services data
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

  // Initialize search parameters from URL on mount and location change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get('q') || '';
    const categoryParam = urlParams.get('category') || 'all';
    const priceMinParam = urlParams.get('priceMin') || '';
    const priceMaxParam = urlParams.get('priceMax') || '';
    const ratingParam = urlParams.get('rating') || 'all';
    const sortByParam = urlParams.get('sortBy') || 'relevance';

    const initialFilters = {
      category: categoryParam,
      priceMin: priceMinParam,
      priceMax: priceMaxParam,
      rating: ratingParam,
      sortBy: sortByParam
    };

    setCurrentFilters(initialFilters);
  }, [location.search]);

  // Enhanced filtering and sorting logic
  useEffect(() => {
    let filtered = [...services];

    // Apply filters
    const { category, priceMin, priceMax, rating } = currentFilters;

    // Category filter
    if (category && category !== 'all') {
      filtered = filtered.filter(service => {
        const categoryName = service.category?.name || service.category;
        return categoryName?.toLowerCase() === category.toLowerCase();
      });
    }

    // Price range filter
    if (priceMin || priceMax) {
      filtered = filtered.filter(service => {
        const price = parseFloat(service.price) || 0;
        const min = parseFloat(priceMin) || 0;
        const max = parseFloat(priceMax) || Number.MAX_VALUE;
        return price >= min && (max === Number.MAX_VALUE || price <= max);
      });
    }

    // Rating filter
    if (rating && rating !== 'all') {
      const minRating = parseFloat(rating);
      filtered = filtered.filter(service => {
        const serviceRating = parseFloat(service.rating || service.averageRating) || 0;
        return serviceRating >= minRating;
      });
    }

    // Sorting logic
    const { sortBy } = currentFilters;
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case 'rating':
        filtered.sort((a, b) =>
          (parseFloat(b.rating || b.averageRating) || 0) - (parseFloat(a.rating || a.averageRating) || 0)
        );
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default: // 'relevance' - keep original order
        break;
    }

    setFilteredServices(filtered);
  }, [services, currentFilters]);

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

  const handleFiltersChange = (newFilters) => {
    setCurrentFilters(newFilters);
    // Update URL parameters if needed
    const params = new URLSearchParams(location.search);
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] && newFilters[key] !== 'all' && newFilters[key] !== '') {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });
    // Optional: update URL without triggering navigation
    // navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: 'all',
      priceMin: '',
      priceMax: '',
      rating: 'all',
      sortBy: 'relevance'
    };
    setCurrentFilters(clearedFilters);
    // Clear URL parameters
    const params = new URLSearchParams(location.search);
    ['category', 'priceMin', 'priceMax', 'rating', 'sortBy', 'q'].forEach(key => params.delete(key));
    // Optional: update URL
    // navigate(location.pathname, { replace: true });
  };

  return (
    <div className="services-page">
      {/* Header Section */}
      <section className="services-header">
        <Container size="xlarge">
          <h1 className="page-title">Our Services</h1>
          <p className="page-subtitle">Find and book the best local services for all your needs</p>
        </Container>
      </section>

      {/* Advanced Filters Section */}
      <section className="services-filters">
        <Container size="xlarge">
          <ServiceFilter
            categories={allCategories}
            filters={currentFilters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            showAdvancedFilters={true}
            maxPrice={1000}
          />
        </Container>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <Container size="xlarge">
          {filteredServices.length > 0 ? (
            <>
              <div className="services-count" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div
                className="services-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}
              >
                {filteredServices.map(service => (
                  <ServiceCard
                    key={service.id || service._id}
                    service={service}
                    variant="service"
                    layout="wireframe"
                    showBookButton={true}
                    imageHeight="200px"
                  />
                ))}
              </div>
            </>
          ) : (
            <div
              className="no-services"
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#f9fafb',
                borderRadius: '1rem',
                marginTop: '2rem'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>No services found</h3>
              <p style={{ margin: '0', color: '#6b7280' }}>
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default ServicesPage;
