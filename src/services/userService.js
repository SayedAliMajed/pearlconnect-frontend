const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;
const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

// GET / - List users with pagination and optional role filter
export const index = async (page = 1, limit = 20, role = null) => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (role) queryParams.append('role', role);

    const res = await fetch(`${BASE_URL}?${queryParams}`, {
      method: 'GET',
      headers
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to fetch users');
  }
};

// GET /current-user - Get current authenticated user
export const getCurrentUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/current-user`, {
      method: 'GET',
      headers
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to fetch current user');
  }
};

// GET /:id - Get specific user
export const getUserById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to fetch user');
  }
};

// POST / - Create new user (admin only)
export const createUser = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to create user');
  }
};

// PUT /:id - Update user
export const updateUser = async (id, updates) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to update user');
  }
};

// DELETE /:id - Delete user (admin only)
export const deleteUser = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to delete user');
  }
};
