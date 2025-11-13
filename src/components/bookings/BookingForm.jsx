import React, { useState, useEffect, useContext } from 'react';
import Container from '../ui/Container';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { createBooking, fetchServices, fetchProviders } from '../../services/bookings';

const BookingForm = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ serviceId: '', providerId: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const e = {};
    if (!form.serviceId) e.serviceId = 'Select a service';
    if (!form.providerId) e.providerId = 'Select a provider';
    if (!form.date) e.date = 'Select a date/time';
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
        customerId: user?.id || user?._id || null,
        date: new Date(form.date).toISOString(),
      };

      const res = await createBooking(payload);
      setMessage('Booking created');
      setForm({ serviceId: '', providerId: '', date: '' });
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

        <label>Date & time</label>
        <Input type="datetime-local" name="date" value={form.date} onChange={handleChange} error={!!errors.date} fullWidth />
        {errors.date && <div className="pc-form-error">{errors.date}</div>}

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
