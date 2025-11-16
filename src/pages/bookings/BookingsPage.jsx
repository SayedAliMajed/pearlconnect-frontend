import React, { useState, useEffect, useContext } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BookingForm from '../../components/bookings/BookingForm';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchBookings, cancelBooking } from '../../services/bookings';

const BookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      console.log('📋 BOOKINGS DEBUG - Loading bookings for user:', {
        userId: user?.id || user?._id,
        userRole: user?.role,
        username: user?.username
      });

      const userBookings = await fetchBookings(user?.role);

      console.log('📋 BOOKINGS DEBUG - API response:', {
        receivedData: userBookings,
        dataType: typeof userBookings,
        isArray: Array.isArray(userBookings),
        arrayLength: Array.isArray(userBookings) ? userBookings?.length : 'N/A',
        sampleItem: Array.isArray(userBookings) && userBookings.length > 0 ? userBookings[0] : 'Empty array'
      });

      setBookings(Array.isArray(userBookings) ? userBookings : []);
    } catch (error) {
      console.error('📋 BOOKINGS DEBUG - Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      // Remove the cancelled booking from the list
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleBookingSuccess = (newBooking) => {
    setShowBookingForm(false);
    // Add the new booking to the list
    setBookings([newBooking, ...bookings]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  if (!user) {
    return (
      <Container size="large">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Please sign in to view your bookings</h2>
          <p>You need to be logged in to access your bookings.</p>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="large">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading your bookings...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="bookings-page">
      <Container size="xlarge">
        {/* Header */}
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p>Manage your service bookings and appointments</p>
          <Button
            variant="primary"
            onClick={() => setShowBookingForm(!showBookingForm)}
          >
            {showBookingForm ? 'Cancel' : 'New Booking'}
          </Button>
        </div>

        {/* Booking Form */}
        {showBookingForm && (
          <div className="booking-form-section">
            <BookingForm onSuccess={handleBookingSuccess} />
          </div>
        )}

        {/* Bookings List */}
        <div className="bookings-list">
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <Card key={booking._id || booking.id} className="booking-card">
                <div className="booking-content">
                  <div className="booking-info">
                    <h3>{booking.service?.title || 'Service'}</h3>
                    <p className="booking-provider">
                      Provider: {booking.provider?.name || booking.provider?.username || 'N/A'}
                    </p>
                    <p className="booking-date">
                      📅 {formatDate(booking.date)}
                    </p>
                    <p className="booking-status">
                      Status: <span style={{ color: getStatusColor(booking.status) }}>
                        {booking.status || 'Pending'}
                      </span>
                    </p>
                    {booking.notes && (
                      <p className="booking-notes">Notes: {booking.notes}</p>
                    )}
                  </div>
                  <div className="booking-actions">
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleCancelBooking(booking._id || booking.id)}
                        disabled={cancellingId === (booking._id || booking.id)}
                      >
                        {cancellingId === (booking._id || booking.id) ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="no-bookings">
              <h3>No bookings found</h3>
              <p>You haven't made any bookings yet. Click "New Booking" to get started!</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BookingsPage;
