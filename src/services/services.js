// Services API service - Core service management functions

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Fetch all services from the backend API with authentication
 * @returns {Promise} Array of services or paginated response
 */
export const fetchServices = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required to fetch services');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${API_BASE}/services`, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.services || data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Get a specific service by ID
 * @param {string} serviceId - Service ID to fetch
 * @returns {Promise} Service object
 */
export const getService = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE}/services/${serviceId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

/**
 * Search services with query parameters
 * @param {string} query - Search query
 * @returns {Promise} Array of services matching search
 */
export const searchServices = async (query = '') => {
  try {
    const params = new URLSearchParams();
    if (query) params.set('search', query);

    const response = await fetch(`${API_BASE}/services?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.services || data || [];
  } catch (error) {
    console.error('Error searching services:', error);
    throw error;
  }
};

/**
 * Get services filtered by category
 * @param {string} category - Category name to filter by
 * @returns {Promise} Array of services in category
 */
export const getServicesByCategory = async (category) => {
  try {
    if (!category) return await fetchServices();

    const response = await fetch(`${API_BASE}/services?category=${encodeURIComponent(category)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.services || data || [];
  } catch (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }
};
