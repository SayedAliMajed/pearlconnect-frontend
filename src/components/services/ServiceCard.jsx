import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/dateUtils';

const ServiceCard = ({
  service,
  variant = 'service',
  layout = 'wireframe',
  showBookButton = true,
  imageHeight = '200px',
  className = ''
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  if (!service) {
    return null;
  }

  const handleCardClick = () => {
    const serviceId = service._id || service.id;
    if (serviceId) {
      navigate(`/services/${serviceId}`);
    } else {
      console.error('Service has no ID:', service);
    }
  };

  const handleBookClick = (e) => {
    e.stopPropagation(); // Prevent card click when book button is clicked
    const serviceId = service._id || service.id;
    if (serviceId) {
      navigate(`/services/${serviceId}`);
    }
  };

  // Get image URL with fallback
  const getImageUrl = () => {
    if (imageError) {
      return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop&crop=center';
    }

    // For API services (have _id): check service.images array
    if (service._id && service.images?.[0]?.url) {
      return service.images[0].url;
    }
    // For API services fallback to images array
    if (service._id && Array.isArray(service.images) && service.images[0]) {
      return service.images[0];
    }
    // For test services (have id): use service.image
    if (service.id) {
      return service.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop&crop=center';
    }

    return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop&crop=center';
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            fontSize: '12px',
            color: i <= numRating ? '#fbbf24' : '#d1d5db',
            margin: '0 1px'
          }}
        >
          {i <= numRating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <Card
      variant={variant}
      layout={layout}
      className={`service-card ${className}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="service-card-image"
        style={{
          height: imageHeight,
          overflow: 'hidden',
          borderRadius: '8px 8px 0 0',
          position: 'relative'
        }}
      >
        <img
          src={getImageUrl()}
          alt={service.title}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      <div
        className="service-card-content"
        style={{
          padding: '1rem'
        }}
      >
        <h3
          className="service-card-title"
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            lineHeight: '1.25'
          }}
        >
          {service.title}
        </h3>

        {service.subtitle && (
          <p
            className="service-card-subtitle"
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: '1.25'
            }}
          >
            {service.subtitle}
          </p>
        )}

        <div
          className="service-meta"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}
        >
          <span
            className="service-category"
            style={{
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#374151',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {service.category?.name || service.category || 'Service'}
          </span>

          <div className="service-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {renderStars(service.rating || service.averageRating)}
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              ({service.reviewCount || service.reviews || 0})
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div
            className="service-price"
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827'
            }}
          >
            {formatPrice(service.price, service.currency)}
          </div>

          {service.duration && (
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Duration: {service.duration}
            </div>
          )}

          {service.provider?.name && (
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.25rem',
              fontStyle: 'italic'
            }}>
              by {service.provider.name}
            </div>
          )}
        </div>

        {showBookButton && (
          <Button
            variant="primary"
            onClick={handleBookClick}
            fullWidth
            style={{
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5'
            }}
          >
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;
