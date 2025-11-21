import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/dateUtils';
import { fetchProviderAvailability } from '../../services/bookings';
import { parseBahrainDate, generateTimeSlots, getTodayDateString, formatTimeTo12Hour, isSameDay } from '../../utils/dateUtils';
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
  const [providerAvailability, setProviderAvailability] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Load service details
  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  // Load reviews and availability when service is loaded
  useEffect(() => {
    if (service) {
      fetchReviews();
      fetchServiceAvailabilityData();
    }
  }, [service]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Only serve live data from backend API - no static test services

      // Handle real API service
      const token = localStorage.getItem('token');
      console.log('Fetching real service details for ID:', serviceId);
      console.log('API URL:', `${import.meta.env.VITE_API_URL}/services/${serviceId}`);
      console.log('Auth token exists:', !!token);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Service detail response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Service detail error:', response.status, errorText);
        throw new Error(`Failed to fetch service: ${response.status}`);
      }

      const serviceData = await response.json();
      console.log('Real service data received:', serviceData);
      setService({ ...serviceData, isDemoService: false });

    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to load service details. Service may not exist or authentication may be required.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!service) return;

    try {
      console.log('Fetching reviews for service:', service._id);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews?serviceId=${service._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const reviewsData = await response.json();
        console.log('Reviews received:', reviewsData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } else {
        console.log('Failed to fetch reviews:', response.status);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchServiceAvailabilityData = async () => {
    if (!service) return;

    try {
      console.log('Fetching provider availability for service:', service._id);
      const providerId = service.providerId || service.provider._id;

      // Fetch provider's weekly availability schedule
      const response = await fetch(`${import.meta.env.VITE_API_URL}/availability/provider/${providerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const availabilityData = await response.json();
        console.log('Provider availability received:', availabilityData);
        setProviderAvailability([availabilityData]); // Store as array for consistency
      } else if (response.status === 404) {
        console.log('No provider availability set yet');
        setProviderAvailability([]);
      } else {
        console.log('Failed to fetch provider availability:', response.status);
        setProviderAvailability([]);
      }
    } catch (err) {
      console.error('Error fetching provider availability:', err);
      setProviderAvailability([]);
    }
  };

  const generateAvailableTimes = (selectedDate) => {
    console.log('🔍 generateAvailableTimes called with date:', selectedDate);
    console.log('📊 Current providerAvailability:', providerAvailability);

    if (!providerAvailability.length) {
      console.log('❌ No provider availability data available');
      setAvailableTimes([]);
      return;
    }

    // For provider availability, we need to find the schedule for the day of the week
    const selectedDateObj = parseBahrainDate(selectedDate);
    console.log('📅 Parsed selected date:', selectedDateObj);

    if (!selectedDateObj) {
      console.log('❌ Could not parse selected date');
      setAvailableTimes([]);
      return;
    }

    // Get the day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = selectedDateObj.getDay();
    console.log('📅 Day of week for date:', dayOfWeek, ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]);

    // Find the provider's weekly schedule
    const providerSchedule = providerAvailability[0]; // We stored it as array for consistency
    console.log('🏢 Provider schedule:', providerSchedule);

    if (!providerSchedule || !providerSchedule.schedules) {
      console.log('❌ No schedules found in provider availability');
      setAvailableTimes([]);
      return;
    }

    // Find the schedule for this day of the week
    const daySchedule = providerSchedule.schedules.find(schedule =>
      schedule.dayOfWeek === dayOfWeek && schedule.isEnabled !== false
    );

    console.log('🔎 Found schedule for day:', dayOfWeek, daySchedule);

    if (!daySchedule) {
      console.log('❌ No schedule found for day of week:', dayOfWeek);
      setAvailableTimes([]);
      return;
    }

    console.log('✅ Found schedule for date:', selectedDate, daySchedule);

    // Generate time slots from the weekly schedule
    const startTime = daySchedule.startTime;
    const endTime = daySchedule.endTime;

    console.log('⏰ Start time:', startTime, 'End time:', endTime);

    if (!startTime || !endTime) {
      console.log('❌ Missing start or end time in schedule');
      setAvailableTimes([]);
      return;
    }

    const slotDuration = daySchedule.slotDuration || service?.duration || 60; // Use service duration or default to 60
    console.log('⏱️ Slot duration:', slotDuration, 'minutes');

    // Use the generateTimeSlots utility with HH:MM format
    const slots = generateTimeSlots(startTime, endTime, slotDuration);
    console.log('🕐 Generated time slots:', slots);

    setAvailableTimes(slots);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setBookingData({ ...bookingData, date: newDate, time: '' }); // Reset time when date changes
    generateAvailableTimes(newDate);
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
      console.log('Submitting booking...');
      const payload = {
        serviceId: service._id,
        providerId: service.providerId || service.provider._id,
        customerId: user._id || user.id,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes || ''
      };

      console.log('Booking payload:', payload);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Booking response status:', response.status);

      if (response.ok) {
        alert('Booking created successfully!');
        setShowBookingForm(false);
        setBookingData({ date: '', time: '' });
        navigate('/bookings');
      } else {
        const errorData = await response.json();
        console.error('Booking error:', errorData);
        alert(errorData.err || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      console.log('Submitting review...');
      const payload = {
        serviceId: service._id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        reviewerId: user._id || user.id,
        providerId: service.providerId || service.provider
      };

      console.log('Review payload:', payload);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Review response status:', response.status);

      if (response.ok) {
        alert('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '' });
        fetchReviews(); // Refresh reviews
      } else {
        const errorData = await response.json();
        console.error('Review error:', errorData);
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
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading service details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xlarge">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Service Not Found</h2>
          <p>{error}</p>
          <p>Service ID: {serviceId}</p>
          <Button onClick={() => navigate('/services')}>Back to Services</Button>
        </div>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container size="xlarge">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Service Not Found</h2>
          <p>No service data available.</p>
          <p>Service ID: {serviceId}</p>
          <Button onClick={() => navigate('/services')}>Back to Services</Button>
        </div>
      </Container>
    );
  }

  // Debug information in development
  console.log('Rendering service:', service);

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
                  ⭐ {service.averageRating || service.rating || 'N/A'} ({service.reviewCount || service.reviews || 0} reviews)
                </span>
                <span className="service-category">{service.category?.name || service.category}</span>
              </div>

              <div className="service-price">
                {formatPrice(service.price, service.currency)}
                {service.duration && <span className="service-duration"> • {service.duration}</span>}
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
                      onChange={handleDateChange}
                      min={getTodayDateString()}
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
                      <option value="">
                        {bookingData.date && providerAvailability.length > 0 ? 'Select Time' : bookingData.date ? 'Provider has no availability for this date' : 'Select a date first'}
                      </option>
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
