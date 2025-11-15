import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { formatPrice } from '../../data/services';
import './ServiceDetailPage.css';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', time: '' });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Load service details
  useEffect(() => {
    fetchServiceDetails();
    fetchReviews();
  }, [serviceId]);

  // Load available times when date changes
  useEffect(() => {
    if (bookingData.date && service?.providerId) {
      fetchAvailableTimes();
    }
  }, [bookingData.date, service]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service details');
      }

      const serviceData = await response.json();
      setService(serviceData);
      setError(null);
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/reviews?serviceId=${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchAvailableTimes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/providers/${service.providerId}/availability?date=${bookingData.date}`);

      if (response.ok) {
        const data = await response.json();
        setAvailableTimes(data.slots || []);
      } else {
        setAvailableTimes([]);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
      setAvailableTimes([]);
    }
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      alert('Please sign in to book a service');
      navigate('/sign-in');
      return;
    }

    if (!bookingData.date || !bookingData.time) {
      alert('Please select both date and time');
      return;
    }

    try {
      const payload = {
        serviceId: service._id,
        providerId: service.providerId,
        customerId: user._id,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes || ''
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': `Bearer ${token}`
        },
        body: new URLSearchParams(payload).toString()
      });

      if (response.ok) {
        alert('Booking created successfully!');
        setShowBookingForm(false);
        setBookingData({ date: '', time: '', notes: '' });
        navigate('/bookings');
      } else {
        const errorData = await response.json();
        alert(errorData.err || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      alert('Please sign in to leave a review');
      navigate('/sign-in');
      return;
    }

    if (!reviewData.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      const payload = {
        serviceId: service._id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        reviewerId: user._id,
        providerId: service.providerId
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '' });
        fetchReviews(); // Refresh reviews
      } else {
        const errorData = await response.json();
        alert(errorData.err || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container size="xlarge">
        <div className="service-detail-loading">
          <p>Loading service details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xlarge">
        <div className="service-detail-error">
          <h2>Service Not Found</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/services')}>Back to Services</Button>
        </div>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container size="xlarge">
        <div className="service-detail-error">
          <h2>Service Not Found</h2>
          <Button onClick={() => navigate('/services')}>Back to Services</Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="service-detail-page">
      <Container size="xlarge">
        {/* Header with Back Button */}
        <div className="service-detail-header">
          <Button variant="secondary" onClick={() => navigate('/services')}>
            ← Back to Services
          </Button>
        </div>

        {/* Service Details */}
        <div className="service-detail-content">
          <div className="service-main-info">
            <div className="service-images">
              {service.images && service.images.length > 0 ? (
                service.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={img.alt || service.title}
                    className="service-image"
                  />
                ))
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop"
                  alt={service.title}
                  className="service-image"
                />
              )}
            </div>

            <div className="service-info">
              <h1 className="service-title">{service.title}</h1>
              <div className="service-meta">
                <span className="service-rating">
                  ⭐ {service.averageRating || 'N/A'} ({service.reviewCount || 0} reviews)
                </span>
                <span className="service-category">{service.category}</span>
              </div>

              <div className="service-price">
                {formatPrice(service.price, service.currency)}
                <span className="service-duration">{service.duration && ` • ${service.duration}`}</span>
              </div>

              <p className="service-description">{service.description || service.subtitle}</p>

              <div className="service-actions">
                <Button
                  variant="primary"
                  onClick={() => setShowBookingForm(!showBookingForm)}
                >
                  {showBookingForm ? 'Cancel Booking' : 'Book Now'}
                </Button>

                {user && (
                  <Button
                    variant="secondary"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Write Review
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          {showBookingForm && (
            <Card className="booking-form-section">
              <h3>Book This Service</h3>
              <div className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Time</label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      disabled={!bookingData.date}
                      required
                    >
                      <option value="">Select Time</option>
                      {availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea
                    value={bookingData.notes || ''}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    placeholder="Any special requests or notes..."
                    rows={3}
                  />
                </div>

                <div className="booking-actions">
                  <Button variant="primary" onClick={handleBookingSubmit}>
                    Confirm Booking
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowBookingForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <Card className="review-form-section">
              <h3>Write a Review</h3>
              <div className="review-form">
                <div className="form-group">
                  <label>Rating</label>
                  <select
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Comment</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    placeholder="Share your experience..."
                    rows={4}
                    required
                  />
                </div>

                <div className="review-actions">
                  <Button variant="primary" onClick={handleReviewSubmit}>
                    Submit Review
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Reviews Section */}
          <div className="reviews-section">
            <h3>Reviews ({reviews.length})</h3>

            {reviews.length === 0 ? (
              <Card className="no-reviews">
                <p>No reviews yet. Be the first to review this service!</p>
              </Card>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <Card key={review._id} className="review-card">
                    <div className="review-header">
                      <span className="review-rating">⭐ {review.rating}/5</span>
                      <span className="review-author">
                        By {review.reviewerId?.name || review.reviewerId?.username || 'Anonymous'}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ServiceDetailPage;
