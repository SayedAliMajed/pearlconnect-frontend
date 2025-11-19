/**
 * @fileoverview Custom React hook for managing service categories
 *
 * This hook provides a complete interface for fetching, filtering, and managing
 * service categories from the backend API. It handles loading states, error states,
 * and provides utility methods for category operations throughout the application.
 *
 * Features:
 * - Fetches categories from backend API on mount
 * - Handles loading and error states
 * - Provides search and filtering utilities
 * - Compatible with both authenticated and public access
 */

import { useState, useEffect, useContext } from 'react';
import { fetchCategories, getCategoryByName } from '../services/categories';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook for fetching and managing service categories
 *
 * Provides comprehensive category management including fetching from API,
 * searching by name/ID, filtering, sorting, and state management.
 *
 * @returns {Object} Categories state and utility functions
 * @property {Array} categories - Array of category objects from backend
 * @property {boolean} loading - Whether categories are currently loading
 * @property {string|null} error - Error message if loading failed
 * @property {Function} loadCategories - Manually refresh categories data
 * @property {Function} findCategoryByName - Find category by name (API call)
 * @property {Function} findCategoryById - Find category by ID (local search)
 * @property {Function} getCategoriesForSelect - Get formatted options for dropdowns
 * @property {Function} getCategoryCount - Get total number of categories
 * @property {Function} getCategoriesByServiceCount - Get categories sorted by popularity
 * @property {Function} refreshCategories - Refresh data (authenticated users only)
 */
export const useCategories = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load categories on component mount (available to everyone)
  useEffect(() => {
    loadCategories();
  }, []);

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
   * Get categories with service counts (requires services data)
   * @param {Array} services - Services array to calculate counts
   * @returns {Array} Categories with serviceCount and avgPrice
   */
  const getCategoriesWithStats = (services = []) => {
    return categories.map(category => {
      const servicesInCategory = services.filter(service => service.category?.name === category.name);
      return {
        ...category,
        serviceCount: servicesInCategory.length,
        avgPrice: servicesInCategory.length > 0 ?
          servicesInCategory.reduce((sum, service) => sum + service.price, 0) / servicesInCategory.length :
          0
      };
    });
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
    getCategoriesByServiceCount: getCategoriesWithStats, // Backward compatibility alias
    getCategoriesWithStats,
    refreshCategories
  };
};
