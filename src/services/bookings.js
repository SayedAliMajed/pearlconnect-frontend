const BASE_URL = `${import.meta.env.VITE_API_URL}`;
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const createBooking = async (payload) => {
  try {
    // validate required fields before sending
    if (!payload || !payload.serviceId || !payload.providerId || !payload.customerId || !payload.date) {
      throw new Error('Invalid booking payload: serviceId, providerId, customerId and date are required');
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams(payload).toString(),
    });

    // resilient response parsing
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (data && data.err) throw new Error(data.err || 'Booking error');
    return data;
  } catch (err) {
    console.error('createBooking', err);
    throw err;
  }
};

export const fetchServices = async () => {
  try {
    const res = await fetch(`${BASE_URL}/services`, { headers: headers() });
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
    const res = await fetch(`${BASE_URL}/users/providers`, { headers: headers() });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to fetch providers');
    return data;
  } catch (err) {
    console.error('fetchProviders', err);
    return [];
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

export const fetchCustomerBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/my-bookings`, { headers: headers() });
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to fetch customer bookings');
    return data;
  } catch (err) {
    console.error('fetchCustomerBookings', err);
    return [];
  }
};

export const fetchProviderBookings = async (providerId) => {
  try {
    const res = await fetch(`${BASE_URL}/provider-bookings`, { headers: headers() });
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

    // Enhanced diagnostic logging
    console.log('🔄 PUT /bookings/:id - URL:', `${BASE_URL}/bookings/${bookingId}`);
    console.log('🔄 PUT /bookings/:id - Status:', res.status);
    console.log('🔄 PUT /bookings/:id - Headers:', Object.fromEntries(res.headers));

    const responseText = await res.text();
    console.log('🔄 PUT /bookings/:id - Raw response:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ PUT /bookings/:id - Parsed JSON:', data);
    } catch (jsonErr) {
      console.error('❌ PUT /bookings/:id - JSON parse failed:', jsonErr);
      console.error('❌ Response body (first 500 chars):', responseText.substring(0, 500));
      console.error('❌ This is likely HTML error page instead of JSON response');
      throw new Error(`Server returned non-JSON response: ${res.status} ${res.statusText}`);
    }

    if (data.err) throw new Error(data.err || 'Failed to update booking status');
    return data;
  } catch (err) {
    console.error('💥 updateBookingStatus complete error:', err);
    throw err;
  }
};

export const fetchProviderAvailability = async (providerId) => {
  try {
    const res = await fetch(`${BASE_URL}/providers/${providerId}/availability`);
    const data = await res.json();
    if (data.err) throw new Error(data.err || 'Failed to fetch provider availability');
    return data;
  } catch (err) {
    console.error('fetchProviderAvailability', err);
    return []; // Return empty array on error to use defaults
  }
};
