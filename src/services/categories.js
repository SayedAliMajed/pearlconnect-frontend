// Categories API service - Live data only, no hardcoded fixtures

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Fetch all categories from the backend (private route - requires auth)
 * @returns {Promise} Array of category objects
 */
export const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required to fetch categories');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${API_BASE}/categories`, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.categories || data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch a specific category by ID
 * @param {string} categoryId - The category ID to fetch
 * @returns {Promise} Category object
 */
export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
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
    console.error('Error fetching category:', error);
    throw error;
  }
};

/**
 * Get category by name (for backward compatibility)
 * @param {string} categoryName - The name to search for
 * @returns {Promise} Category object or null
 */
export const getCategoryByName = async (categoryName) => {
  try {
    const categories = await fetchCategories();
    return categories.find(cat =>
      cat.name?.toLowerCase() === categoryName?.toLowerCase()
    );
  } catch (error) {
    console.error('Error finding category by name:', error);
    return null;
  }
};
