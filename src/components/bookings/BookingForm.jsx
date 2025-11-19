import React, { useState, useEffect, useContext } from 'react';
import Container from '../ui/Container';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { createBooking, fetchServices, fetchProviders, fetchProviderAvailability } from '../../services/bookings';

const BookingForm = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [providerAvailability, setProviderAvailability] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [form, setForm] = useState({ serviceId: '', providerId: '', date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Generate time slots based on availability for the selected date
  const generateTimeSlots = (selectedDate, availability) => {
    const dateObj = new Date(selectedDate);
    const selectedDayOfWeek = dateObj.getDay(); // 0-6, Sunday=0

    // Find availability for this date or recurring settings
    const dayAvailability = availability.find(slot => {
      const slotDate = slot.date; // "DD/MM/YYYY"
      if (slotDate) {
        const [day, month, year] = slotDate.split('/');
        const slotDateObj = new Date(year, month - 1, day);
        return slotDateObj.toDateString() === dateObj.toDateString();
      }
      return false;
    });

    // Default availability if none found (fallback)
    const defaultOpening = '09:00';
    const defaultClosing = '17:00';
    const defaultDuration = 60;

    const openingTime = dayAvailability?.openingTime || defaultOpening;
    const closingTime = dayAvailability?.closingTime || defaultClosing;
    const duration = dayAvailability?.duration || defaultDuration;
    const breakStart = dayAvailability?.breakStartTime;
    const breakEnd = dayAvailability?.breakEndTime;

    const slots = [];
    const [openHour, openMin] = openingTime.split(':').map(Number);
    const [closeHour, closeMin] = closingTime.split(':').map(Number);

    let currentTime = new Date();
    currentTime.setHours(openHour, openMin, 0, 0);

    const endTime = new Date();
    endTime.setHours(closeHour, closeMin, 0, 0);

    while (currentTime < endTime) {
      // Check if during break
      let isDuringBreak = false;
      if (breakStart && breakEnd) {
        const [breakH, breakM] = breakStart.split(':').map(Number);
        const breakStartTime = new Date();
        breakStartTime.setHours(breakH, breakM, 0, 0);

        const [breakEH, breakEM] = breakEnd.split(':').map(Number);
        const breakEndTime = new Date();
        breakEndTime.setHours(breakEH, breakEM, 0, 0);

        if (currentTime >= breakStartTime && currentTime < breakEndTime) {
          isDuringBreak = true;
        }
      }

      if (!isDuringBreak) {
        const timeString = currentTime.toTimeString().slice(0, 5); // HH:MM
        slots.push(timeString);
      }

      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    return slots;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const s = await fetchServices();
        const p = await fetchProviders();
        setServices(Array.isArray(s) ? s : []);
        setProviders(Array.isArray(p) ? p : []);
      } catch (err) {
        console.error('Failed to load services/providers', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadAvailability = async () => {
      if (!form.providerId) {
        setProviderAvailability([]);
        return;
      }
      try {
        const avail = await fetchProviderAvailability(form.providerId);
        setProviderAvailability(Array.isArray(avail) ? avail : []);
      } catch (err) {
        console.error('Failed to load availability', err);
        setProviderAvailability([]); // Use defaults
      }
    };
    loadAvailability();
  }, [form.providerId]);

  useEffect(() => {
    if (!form.date) {
      setTimeSlots([]);
      return;
    }
    const slots = generateTimeSlots(form.date, providerAvailability);
    setTimeSlots(slots);
  }, [form.date, providerAvailability]);

  const validate = () => {
    const e = {};
    if (!form.serviceId) e.serviceId = 'Select a service';
    if (!form.providerId) e.providerId = 'Select a provider';
    if (!form.date) e.date = 'Select a date';
    if (!form.time) e.time = 'Select a time';
    if (form.date && new Date(form.date) <= new Date()) e.date = 'Date must be in the future';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        serviceId: form.serviceId,
        providerId: form.providerId,
        customerId: user._id,
        date: form.date, // Send date as string (YYYY-MM-DD)
        timeSlot: form.time, // Send time as HH:MM format
      };

      const res = await createBooking(payload);
      setMessage('Booking created');
      setForm({ serviceId: '', providerId: '', date: '', time: '' });
      setErrors({});
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.error(err);
      setMessage(err?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="small">
      <form onSubmit={handleSubmit}>
        <h3>Create booking</h3>

        <label>Service</label>
        <Input type="select" name="serviceId" value={form.serviceId} onChange={handleChange} error={!!errors.serviceId} fullWidth>
          <option value="">Select a service</option>
          {services.map(s => (
            <option key={s._id || s.id} value={s._id || s.id}>{s.title || s.name}</option>
          ))}
        </Input>
        {errors.serviceId && <div className="pc-form-error">{errors.serviceId}</div>}

        <label>Provider</label>
        <Input type="select" name="providerId" value={form.providerId} onChange={handleChange} error={!!errors.providerId} fullWidth>
          <option value="">Select a provider</option>
          {providers.map(p => (
            <option key={p._id || p.id} value={p._id || p.id}>{p.name || p.username || `${p.firstName || ''} ${p.lastName || ''}`}</option>
          ))}
        </Input>
        {errors.providerId && <div className="pc-form-error">{errors.providerId}</div>}

        <label>Date</label>
        <Input type="date" name="date" value={form.date} onChange={handleChange} error={!!errors.date} fullWidth />
        {errors.date && <div className="pc-form-error">{errors.date}</div>}

        <label>Time</label>
        <Input type="select" name="time" value={form.time} onChange={handleChange} error={!!errors.time} fullWidth disabled={!timeSlots.length}>
          <option value="">Select a time</option>
          {timeSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </Input>
        {!timeSlots.length && form.date && <div className="pc-form-error">No available slots for selected date</div>}
        {errors.time && <div className="pc-form-error">{errors.time}</div>}

        <div>
          <Button type="submit" variant="primary" disabled={loading} fullWidth>
            {loading ? 'Creating...' : 'Create booking'}
          </Button>
        </div>

        {message && <div className="pc-form-message">{message}</div>}
      </form>
    </Container>
  );
};

export default BookingForm;
