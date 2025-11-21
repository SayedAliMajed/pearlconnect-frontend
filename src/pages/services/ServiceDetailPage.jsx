import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { formatPrice } from '../../utils/dateUtils';
import { fetchProviderAvailability } from '../../services/bookings';
import { parseBahrainDate, generateTimeSlots, getTodayDateString, formatTimeTo12Hour, isSameDay } from '../../utils/dateUtils';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewsList from '../../components/reviews/ReviewsList';
import './ServiceDetailPage.css';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', time: '' });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [providerAvailability, setProviderAvailability] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Load service details
  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  // Load availability when service is loaded
  useEffect(() => {
    if (service) {
      fetchServiceAvailabilityData();
    }
  }, [service]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch service: ${response.status}`);
      }

      const serviceData = await response.json();
      setService({ ...serviceData, isDemoService: false });

    } catch (err) {
      setError('Failed to load service details. Service may not exist or authentication may be required.');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceAvailabilityData = async () => {
    if (!service) {
      return;
    }

    try {
      const providerId = service.providerId || service.provider._id;

      if (!providerId) {
        setProviderAvailability([]);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/availability/provider/${providerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const availabilityData = await response.json();
        let schedules = [];

        if (Array.isArray(availabilityData)) {
          schedules = availabilityData;
        } else if (availabilityData.schedules && Array.isArray(availabilityData.schedules)) {
          schedules = availabilityData.schedules;
        }

        setProviderAvailability(schedules);
      } else {
        setProviderAvailability([]);
      }
    } catch (err) {
      setProviderAvailability([]);
    }
  };

  const generateAvailableTimes = (selectedDate) => {
    if (!providerAvailability.length) {
      setAvailableTimes([]);
      return;
    }

    const selectedDateObj = parseBahrainDate(selectedDate);

    if (!selectedDateObj) {
      setAvailableTimes([]);
      return;
    }

    const selectedDayOfWeek = selectedDateObj.getDay();
    const daySchedule = providerAvailability.find(schedule => schedule.dayOfWeek === selectedDayOfWeek);

    if (!daySchedule || daySchedule.isEnabled === false) {
      setAvailableTimes([]);
      return;
    }

    const openingTime = daySchedule.startTime;
    const closingTime = daySchedule.endTime;
    const duration = daySchedule.slotDuration || 60;

    if (!openingTime || !closingTime) {
      setAvailableTimes([]);
      return;
    }

    const slots = generateTimeSlots(openingTime, closingTime, duration);
    setAvailableTimes(slots);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setBookingData({ ...bookingData, date: newDate, time: '' });
    setBookingError(null);
    generateAvailableTimes(newDate);
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    if (!bookingData.date || !bookingData.time) {
      setBookingError('Please select both date and time');
      return;
    }

    try {
      const payload = {
        serviceId: service._id,
        providerId: service.providerId || service.provider._id,
        customerId: user._id || user.id,
        date: bookingData.date,
        timeSlot: bookingData.time,
        notes: bookingData.notes || ''
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowBookingForm(false);
        setBookingData({ date: '', time: '' });
        setBookingError(null);
        navigate('/bookings');
      } else {
        const errorData = await response.json();
        setBookingError(errorData.err || 'Failed to create booking');
      }
    } catch (err) {
      setBookingError('Failed to create booking. Please try again.');
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

                {bookingError && (
                  <div style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '14px' }}>
                    {bookingError}
                  </div>
                )}

                <div className="booking-actions">
                  <Button variant="primary" onClick={handleBookingSubmit}>
                    Confirm Booking
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowBookingForm(false);
                      setBookingError(null);
                    }}
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
              <ReviewForm
                serviceId={service._id}
                providerId={service.providerId || service.provider._id}
                onSuccess={() => {
                  setShowReviewForm(false);
                }}
              />
            </Card>
          )}

          {/* Reviews Section */}
          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            <ReviewsList
              serviceId={service._id}
              maxItems={5}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ServiceDetailPage;
