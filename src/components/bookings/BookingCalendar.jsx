import React, { useEffect, useState } from 'react';
import Container from '../ui/Container';
import Card from '../ui/Card';
import { fetchBookings } from '../../services/bookings';

const BookingCalendar = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const generateDailySlots = (date) => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      const slot = new Date(date);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot);
    }
    return slots;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const bookings = await fetchBookings();

        // Create a map of date + timeSlot combinations that are already booked
        const bookedSlots = new Set();
        bookings.forEach(booking => {
          if (booking.date && booking.timeSlot) {
            const bookingDate = new Date(booking.date).toDateString();
            const key = `${bookingDate}_${booking.timeSlot}`;
            bookedSlots.add(key);
          }
        });

        const now = new Date();
        const daysAhead = 7;
        const allAvailable = [];

        for (let i = 0; i < daysAhead; i++) {
          const date = new Date();
          date.setDate(now.getDate() + i);

          const dateKey = date.toDateString();
          const slots = generateDailySlots(date).filter(slot => {
            // Only show future slots that aren't booked
            if (slot <= now) return false;

            // Format slot time in HH:MM AM/PM format to match backend expectations
            const hours = slot.getHours();
            const minutes = slot.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            const slotTimeStr = `${displayHours}:${minutes} ${period}`; // e.g., "09:30 AM"

            const slotKey = `${dateKey}_${slotTimeStr}`;
            return !bookedSlots.has(slotKey);
          });

          if (slots.length > 0) {
            allAvailable.push({ date: dateKey, slots });
          }
        }

        setAvailableSlots(allAvailable);
      } catch (err) {
        console.error(err);
        setError(err?.message || 'Failed to load available slots');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Container size="small">Loading available slots...</Container>;
  if (error) return <Container size="small">{error}</Container>;
  if (!availableSlots.length) return <Container size="small">No available slots found.</Container>;

  return (
    <Container size="small">
      <h3>Available Booking Slots</h3>
      {availableSlots.map((day, idx) => (
        <Card key={idx} padding="medium">
          <h4>{day.date}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {day.slots.map((slot, i) => (
              <div
                key={i}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: '#f9f9f9'
                }}
              >
                {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </Container>
  );
};

export default BookingCalendar;
