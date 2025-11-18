/**
 * @fileoverview Custom React hook for managing services data
 *
 * This hook provides comprehensive service management functionality including
 * fetching services from the backend API, filtering, searching, and state management.
 * It integrates with authentication context and handles different user roles.
 */

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { fetchServices } from '../services/services';

/**
 * Custom hook for fetching and managing services data
 *
 * Handles fetching services from the API with support for filtering by category,
 * provider, and authentication-based access control.
 *
 * @returns {Object} Services state and utility functions
 * @property {Array} services - Array of service objects
 * @property {boolean} loading - Whether services are currently loading
 * @property {string|null} error - Error message if loading failed
 * @property {Function} loadServices - Fetch services from API
 * @property {Function} getServicesByCategory - Filter services by category
 * @property {Function} getServicesByProvider - Get provider's services
 * @property {Function} searchServices - Search services by query
 * @property {Function} refreshServices - Refresh the services data
 */
const useServices = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load services from the backend API
   * Handles different access based on authentication status
   */
  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading services from API...');

      const serviceData = await fetchServices();

      if (Array.isArray(serviceData) && serviceData.length > 0) {
        console.log(`✓ Loaded ${serviceData.length} services`);
        setServices(serviceData);
      } else {
        console.log('⚠️ No services available or API returned empty array');
        setServices([]);
      }
    } catch (err) {
      console.error('✗ Error loading services:', err);
      setError(err.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load services on mount for authenticated users
  useEffect(() => {
    if (user) {
      loadServices();
    } else {
      // For unauthenticated users, show limited services or none
      setLoading(false);
    }
  }, [user]);

  /**
   * Filter services by category ID
   * @param {string} categoryId - Category ID to filter by
   * @returns {Array} Filtered services array
   */
  const getServicesByCategory = (categoryId) => {
    return services.filter(service =>
      service.category === categoryId ||
      service.category?._id === categoryId ||
      service.category?.id === categoryId
    );
  };

  /**
   * Get services provided by current user (if provider)
   * @returns {Array} Services provided by current user
   */
  const getServicesByProvider = () => {
    if (!user || user.role !== 'provider') return [];

    return services.filter(service =>
      service.provider === user._id ||
      service.provider?.id === user._id ||
      service.providerId === user._id
    );
  };

  /**
   * Search services by query string
   * @param {string} query - Search query
   * @returns {Array} Matching services
   */
  const searchServices = (query) => {
    if (!query?.trim()) return services;

    const searchTerm = query.toLowerCase();
    return services.filter(service =>
      service.title?.toLowerCase().includes(searchTerm) ||
      service.description?.toLowerCase().includes(searchTerm) ||
      service.category?.name?.toLowerCase().includes(searchTerm)
    );
  };

  /**
   * Refresh services data from API
   */
  const refreshServices = () => {
    loadServices();
  };

  /**
   * Get service by ID
   * @param {string} serviceId - Service ID to find
   * @returns {Object|null} Service object or null
   */
  const getServiceById = (serviceId) => {
    return services.find(service =>
      service._id === serviceId ||
      service.id === serviceId
    ) || null;
  };

  return {
    // Core state
    services,
    loading,
    error,

    // Load functions
    loadServices,
    refreshServices,

    // Filter/search functions
    getServicesByCategory,
    getServicesByProvider,
    getServiceById,
    searchServices,
  };
};

export default useServices;
