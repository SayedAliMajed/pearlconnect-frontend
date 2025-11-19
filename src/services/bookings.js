import { index as indexUsers } from './userService.js';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const createBooking = async (payload) => {
  try {
    // validate required fields before sending
    if (!payload || !payload.serviceId || !payload.providerId || !payload.customerId || !payload.date || !payload.timeSlot) {
      throw new Error('Invalid booking payload: serviceId, providerId, customerId, date and timeSlot are required');
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data && data.err) throw new Error(data.err || 'Booking error');
    return data;
  } catch (err) {
    console.error('createBooking', err);
    throw err;
  }
};

export const fetchServices = async (limit = 6) => {
  try {
    const servicesHeaders = {
      'Content-Type': 'application/json'
    };

    // Add auth token only if available (for authenticated requests)
    const token = localStorage.getItem('token');
    if (token) {
      servicesHeaders['Authorization'] = `Bearer ${token}`;
    }

    const url = limit ? `${BASE_URL}/services?limit=${limit}` : `${BASE_URL}/services`;
    const res = await fetch(url, { headers: servicesHeaders });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to fetch services');
    return data;
  } catch (err) {
    console.error('fetchServices', err);
    return [];
  }
};

export const fetchProviders = async () => {
  try {
    // Use pagination with large limit to get all providers
    const { users } = await indexUsers(1, 1000, 'provider');
    return users || [];
  } catch (err) {
    console.error('fetchProviders', err);
    return [];
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, { headers: headers() });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to fetch booking');
    return data;
  } catch (err) {
    console.error('getBookingById', err);
    throw err;
  }
};

export const fetchBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, { headers: headers() });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to fetch bookings');
    return data;
  } catch (err) {
    console.error('fetchBookings', err);
    return [];
  }
};

export const fetchProviderBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/provider-bookings`, { headers: headers() });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to fetch provider bookings');
    return data;
  } catch (err) {
    console.error('fetchProviderBookings', err);
    return [];
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to cancel booking');
    return data;
  } catch (err) {
    console.error('cancelBooking', err);
    throw err;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to update booking status');
    return data;
  } catch (err) {
    console.error('updateBookingStatus', err);
    throw err;
  }
};

export const fetchProviderAvailability = async (providerId) => {
  try {
    const res = await fetch(`${BASE_URL}/availability/provider/${providerId}`, { headers: headers() });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to fetch provider availability');
    return data;
  } catch (err) {
    console.error('fetchProviderAvailability', err);
    return {}; // Return empty object on error to use defaults
  }
};
