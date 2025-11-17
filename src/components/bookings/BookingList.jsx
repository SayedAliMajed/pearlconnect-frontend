import React, { useEffect, useState, useContext } from 'react';
import Container from '../ui/Container';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchBookings, cancelBooking, fetchProviderBookings } from '../../services/bookings';

const BookingList = ({ showAll = false, providerMode = false }) => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const fetchFunc = providerMode ? fetchProviderBookings : fetchBookings;
        const data = providerMode ? await fetchProviderBookings(userId) : await fetchBookings();
        if (mounted) setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err?.message || 'Failed to load bookings');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [providerMode, userId]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(prev => prev.filter(b => (b._id || b.id) !== id));
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to cancel booking');
    }
  };

  const userId = user?.id || user?._id || null;

  const visible = bookings.filter(b => {
    if (showAll) return true;
    if (!userId) return true;
    const bCust = b.customerId && ((b.customerId._id || b.customerId) === userId);
    const bProv = b.providerId && ((b.providerId._id || b.providerId) === userId);
    return bCust || bProv;
  });

  if (loading) return <Container size="small">Loading bookings...</Container>;
  if (error) return <Container size="small">{error}</Container>;
  if (!visible.length) return <Container size="small">No bookings found.</Container>;

  return (
    <Container size="small">
      <h3>Bookings</h3>
      <div>
        {visible.map(b => {
          const id = b._id || b.id;
          const serviceTitle = b.service?.title || b.service?.name || b.serviceTitle || b.service || 'Service';
          const providerName = b.provider?.name || b.provider?.username || (b.provider?.firstName ? `${b.provider.firstName} ${b.provider.lastName || ''}` : '') || '';
          const customerName = b.customer?.name || b.customer?.username || (b.customer?.firstName ? `${b.customer.firstName} ${b.customer.lastName || ''}` : '') || '';
          const date = b.date ? new Date(b.date).toLocaleString() : '';

          return (
            <Card key={id} padding="medium">
              <div>
                <div>{serviceTitle}</div>
                <div>{date}</div>
                <div><strong>Status:</strong> {b.status}</div>
                <div><strong>Provider:</strong> {providerName}</div>
                <div><strong>Customer:</strong> {customerName}</div>
                {b.status !== 'cancelled' && (
                  <div>
                    <Button variant="danger" size="small" onClick={() => handleCancel(id)}>Cancel</Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
};

export default BookingList;
