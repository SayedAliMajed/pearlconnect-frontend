import React, { useState, useEffect, useContext } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BookingForm from '../../components/bookings/BookingForm';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchBookings, cancelBooking, updateBookingStatus } from '../../services/bookings';

const BookingsPage = ({ showNewBookingForm = true }) => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

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
      const userBookings = await fetchBookings(user?.role);
      setBookings(Array.isArray(userBookings) ? userBookings : []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
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

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingStatusId(bookingId);
      await updateBookingStatus(bookingId, newStatus);
      // Update the booking status in the local state
      setBookings(bookings.map(booking =>
        booking._id === bookingId || booking.id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const getProviderActions = (booking) => {
    const actions = [];
    const isUpdating = updatingStatusId === (booking._id || booking.id);

    switch (booking.status?.toLowerCase()) {
      case 'pending':
        actions.push(
          <Button
            key="accept"
            variant="primary"
            size="small"
            onClick={() => handleUpdateStatus(booking._id || booking.id, 'confirmed')}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Accept Order'}
          </Button>
        );
        break;

      case 'confirmed':
        actions.push(
          <Button
            key="start"
            variant="success"
            size="small"
            onClick={() => handleUpdateStatus(booking._id || booking.id, 'in-progress')}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Start Service'}
          </Button>
        );
        break;

      case 'in-progress':
        actions.push(
          <Button
            key="complete"
            variant="success"
            size="small"
            onClick={() => handleUpdateStatus(booking._id || booking.id, 'completed')}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Mark Complete'}
          </Button>
        );
        break;

      case 'completed':
      case 'cancelled':
        return null; // No actions for completed/cancelled bookings

      default:
        break;
    }

    // Add cancel option for all non-completed bookings
    if (booking.status !== 'completed') {
      actions.push(
        <Button
          key="cancel"
          variant="danger"
          size="small"
          onClick={() => handleCancelBooking(booking._id || booking.id)}
          disabled={cancellingId === (booking._id || booking.id)}
        >
          {cancellingId === (booking._id || booking.id) ? 'Cancelling...' : 'Cancel'}
        </Button>
      );
    }

    return actions;
  };

  const getCustomerActions = (booking) => {
    // Customers can only cancel pending or confirmed bookings
    if (booking.status !== 'cancelled' && booking.status !== 'completed') {
      return (
        <Button
          variant="danger"
          size="small"
          onClick={() => handleCancelBooking(booking._id || booking.id)}
          disabled={cancellingId === (booking._id || booking.id)}
        >
          {cancellingId === (booking._id || booking.id) ? 'Cancelling...' : 'Cancel'}
        </Button>
      );
    }
    return null;
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
      case 'in-progress':
        return '#2196F3';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      case 'completed':
        return '#9C27B0';
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
          <h1>{user?.role === 'provider' ? 'My Services\' Bookings' : 'My Bookings'}</h1>
          <p>{user?.role === 'provider'
            ? 'View and manage customer bookings for your services'
            : 'Manage your service bookings and appointments'}</p>
          {showNewBookingForm && (
            <Button
              variant="primary"
              onClick={() => setShowBookingForm(!showBookingForm)}
            >
              {showBookingForm ? 'Cancel' : 'New Booking'}
            </Button>
          )}
        </div>

        {/* Booking Form - Only show for customers */}
        {showBookingForm && showNewBookingForm && (
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
                    {user?.role === 'customer' && (
                      <p className="booking-provider">
                        Provider: {booking.provider?.name || booking.provider?.username || 'N/A'}
                      </p>
                    )}
                    {user?.role === 'provider' && booking.customer && (
                      <p className="booking-customer">
                        Customer: {booking.customer?.name || booking.customer?.username || booking.customer?.email || 'N/A'}
                      </p>
                    )}
                    <p className="booking-date">
                      📅 {formatDate(booking.date)}
                    </p>
                    <p className="booking-status">
                      Status: <span style={{ color: getStatusColor(booking.status) }}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).toLowerCase() || 'Pending'}
                      </span>
                    </p>
                    {booking.notes && (
                      <p className="booking-notes">Notes: {booking.notes}</p>
                    )}
                  </div>
                  <div className="booking-actions">
                    {user?.role === 'provider'
                      ? getProviderActions(booking)
                      : getCustomerActions(booking)
                    }
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="no-bookings">
              <h3>No bookings found</h3>
              <p>
                {user?.role === 'provider'
                  ? 'No customers have booked your services yet. Customers can see your services and make bookings on the platform.'
                  : 'You haven\'t made any bookings yet. Click "New Booking" to get started!'
                }
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BookingsPage;
