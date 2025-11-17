// useCategories hook - Live categories data from backend API
// No more hardcoded fixtures - only live data

import { useState, useEffect, useContext } from 'react';
import { fetchCategories, getCategoryByName } from '../services/categories';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook to fetch and manage categories data from backend
 * @returns {Object} Categories state and methods
 */
export const useCategories = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load categories when user is available
  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  /**
   * Fetch categories from backend API
   */
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const categoryData = await fetchCategories();

      if (Array.isArray(categoryData) && categoryData.length > 0) {
        setCategories(categoryData);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(err.message);
      setCategories([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  /**
   * Find a category by name (case-insensitive)
   * @param {string} categoryName - Name to search for
   * @returns {Object|null} Category object or null
   */
  const findCategoryByName = async (categoryName) => {
    try {
      return await getCategoryByName(categoryName);
    } catch (err) {
      console.error('Error finding category:', err);
      return null;
    }
  };

  /**
   * Find a category by ID
   * @param {string} categoryId - Category ID to find
   * @returns {Object|null} Category object or null
   */
  const findCategoryById = (categoryId) => {
    return categories.find(cat => cat._id === categoryId || cat.id === categoryId);
  };

  /**
   * Get categories formatted for select dropdowns
   * @returns {Array} Array of category objects with id and name
   */
  const getCategoriesForSelect = () => {
    return categories.map(cat => ({
      id: cat._id || cat.id,
      name: cat.name
    }));
  };

  /**
   * Get category count
   * @returns {number} Number of categories
   */
  const getCategoryCount = () => {
    return categories.length;
  };

  /**
   * Get categories by service count (most popular first)
   * @returns {Array} Sorted categories by service count
   */
  const getCategoriesByServiceCount = () => {
    return [...categories].sort((a, b) => (b.serviceCount || 0) - (a.serviceCount || 0));
  };

  /**
   * Refresh categories data
   */
  const refreshCategories = () => {
    if (user) {
      loadCategories();
    }
  };

  return {
    // State
    categories,
    loading,
    error,

    // Methods
    loadCategories,
    findCategoryByName,
    findCategoryById,
    getCategoriesForSelect,
    getCategoryCount,
    getCategoriesByServiceCount,
    refreshCategories
  };
};
