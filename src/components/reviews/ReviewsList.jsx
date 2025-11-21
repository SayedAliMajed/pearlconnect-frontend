import React, { useEffect, useState, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';

const ReviewsList = ({ serviceId, providerId, maxItems = 5 }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (serviceId || providerId) {
      loadReviews();
    }
  }, [serviceId, providerId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let apiUrl = `${import.meta.env.VITE_API_URL}/reviews`;
      const params = new URLSearchParams();

      if (serviceId) {
        params.append('serviceId', serviceId);
      }
      if (providerId) {
        params.append('providerId', providerId);
      }

      if (params.toString()) {
        apiUrl += `?${params.toString()}`;
      }

      console.log('Loading reviews from:', apiUrl);

      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const reviewsArray = Array.isArray(data) ? data : [];
        console.log(`Loaded ${reviewsArray.length} reviews`);
        setReviews(reviewsArray);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to load reviews:', response.status, errorData);
        setError('Failed to load reviews');
        setReviews([]);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Network error loading reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return 'Today';
      } else if (diffDays === 2) {
        return 'Yesterday';
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
      } else if (diffDays <= 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Unknown date';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            fontSize: '14px',
            color: i <= rating ? '#fbbf24' : '#d1d5db',
            margin: '0 1px'
          }}
        >
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  const getReviewerName = (review) => {
    // Try profile firstName + lastName (new backend structure)
    if (review.customerId?.profile?.firstName || review.customerId?.profile?.lastName) {
      const firstName = review.customerId.profile.firstName || '';
      const lastName = review.customerId.profile.lastName || '';
      return `${firstName} ${lastName}`.trim();
    }

    // Fallback to old structure or other fields
    if (review.customerId?.name) return review.customerId.name;
    if (review.customerId?.username) return review.customerId.username;
    if (review.customerId?.email) {
      const emailParts = review.customerId.email.split('@');
      return emailParts[0] + '...';
    }
    return 'Anonymous Customer';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
          ⌛
        </div>
        <p style={{ marginTop: '0.5rem' }}>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
        <p>⚠️ {error}</p>
        <Button
          variant="secondary"
          size="small"
          onClick={loadReviews}
          style={{ marginTop: '1rem' }}
        >
          Retry Loading
        </Button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
        border: '2px dashed #e5e7eb'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
        <p>No reviews yet for this service.</p>
        <p style={{ fontSize: '14px', marginTop: '0.5rem' }}>
          Be the first to leave a review and help others discover quality services!
        </p>
      </Card>
    );
  }

  const displayedReviews = expanded ? reviews : reviews.slice(0, maxItems);
  const hasMoreReviews = reviews.length > maxItems;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {displayedReviews.map((review) => (
          <Card
            key={review._id || review.id}
            style={{
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              border: '1px solid #f3f4f6'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#6b7280'
                }}>
                  {getReviewerName(review).charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#111827',
                    LINEHeight: '1.25'
                  }}>
                    {getReviewerName(review)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: review.rating >= 4 ? '#f0fdf4' : review.rating >= 3 ? '#fefce8' : '#fef2f2',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px'
              }}>
                {renderStars(review.rating)}
                <span style={{
                  marginLeft: '0.25rem',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: review.rating >= 4 ? '#166534' : review.rating >= 3 ? '#92400e' : '#991b1b'
                }}>
                  {review.rating}/5
                </span>
              </div>
            </div>

            <div style={{
              fontSize: '15px',
              lineHeight: '1.5',
              color: '#374151'
            }}>
              {review.comment}
            </div>

            {review.serviceId && (
              <div style={{
                marginTop: '0.75rem',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                Reviewed for: {review.serviceId?.title || 'Service'}
              </div>
            )}
          </Card>
        ))}
      </div>

      {hasMoreReviews && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setExpanded(!expanded)}
            fullWidth={false}
          >
            {expanded ? 'Show Less' : `Show ${reviews.length - maxItems} More Review${reviews.length - maxItems === 1 ? '' : 's'}`}
          </Button>
        </div>
      )}

      <div style={{
        textAlign: 'center',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Total {reviews.length} review{reviews.length === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
};

export default ReviewsList;
