const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function parseResponse(res) {
  // handle empty body
  if (res.status === 204) return null;

  const contentType = (res.headers.get('content-type') || '').toLowerCase();

  if (contentType.includes('application/json')) {
    // Preferred path: parse JSON directly
    const data = await res.json();
    if (!res.ok) {
      const message = (data && (data.err || data.message)) || `Request failed with status ${res.status}`;
      throw new Error(message);
    }
    return data;
  }

  // Fallback for non-JSON responses
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const createBooking = async (payload) => {
  try {
    // validate required fields before sending
    if (!payload || !payload.serviceId || !payload.providerId || !payload.customerId || !payload.date) {
      throw new Error('Invalid booking payload: serviceId, providerId, customerId and date are required');
    }

    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(res);
    return data;
  } catch (err) {
    console.error('createBooking', err);
    throw err;
  }
};

export const fetchServices = async () => {
  try {
    const res = await fetch(`${BASE_URL}/services`, { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
    const data = await parseResponse(res);
    return data || [];
  } catch (err) {
    console.error('fetchServices', err);
    return [];
  }
};

export const fetchProviders = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users/providers`, { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
    const data = await parseResponse(res);
    return data || [];
  } catch (err) {
    console.error('fetchProviders', err);
    return [];
  }
};

export const fetchBookings = async () => {
  try {
    const res = await fetch(`${BASE_URL}/bookings`, { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
    const data = await parseResponse(res);
    return data || [];
  } catch (err) {
    console.error('fetchBookings', err);
    return [];
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    const data = await parseResponse(res);
    return data;
  } catch (err) {
    console.error('cancelBooking', err);
    throw err;
  }
};
