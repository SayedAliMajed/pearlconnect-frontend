/**
 * Service Image Utilities
 * Provides consistent image handling across the application
 */

/**
 * Default fallback image URLs
 */
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1486312338219-ce68ee2c6c90?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=400&h=250&fit=crop&crop=center'
];

/**
 * Create a placeholder component for when no image is available
 */
export const createImagePlaceholder = ({ width = '100%', height = '180px', children = 'No Image' }) => {
  return {
    type: 'placeholder',
    width,
    height,
    children
  };
};

/**
 * Get the most appropriate image URL for a service
 * Handles different data structures consistently across the app
 *
 * @param {Object} service - Service object
 * @param {number} fallbackIndex - Index for fallback image rotation (to avoid repeating same image)
 * @returns {string} Image URL or fallback
 */
export const getServiceImageUrl = (service, fallbackIndex = 0) => {
  if (!service) {
    return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  }

  // Handle error state - if imageError is set, use fallback
  if (service.imageError) {
    return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  }

  // For API services (MongoDB, have _id): Check multiple image structures
  if (service._id || service.id) {
    // Check for full image objects with URL property
    if (service.images?.length > 0) {
      const firstImage = service.images[0];

      // If it's an object with a url property
      if (typeof firstImage === 'object' && firstImage?.url) {
        return firstImage.url;
      }

      // If it's a simple string URL
      if (typeof firstImage === 'string' && firstImage.trim()) {
        return firstImage;
      }
    }

    // Check for single image property (test data structure)
    if (service.image && typeof service.image === 'string' && service.image.trim()) {
      return service.image;
    }
  }

  // Fallback to default image from array
  return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
};

/**
 * Check if a service has any valid images
 *
 * @param {Object} service - Service object
 * @returns {boolean} Whether the service has images
 */
export const hasServiceImage = (service) => {
  if (!service) return false;

  if (service._id || service.id) {
    // Check images array
    if (service.images?.length > 0) {
      const firstImage = service.images[0];
      if (typeof firstImage === 'object' && firstImage?.url) return true;
      if (typeof firstImage === 'string' && firstImage.trim()) return true;
    }

    // Check image property
    if (service.image && typeof service.image === 'string' && service.image.trim()) {
      return true;
    }
  }

  return false;
};

/**
 * Create consistent image props for rendering
 *
 * @param {Object} service - Service object
 * @param {Object} options - Additional options
 * @returns {Object} Props for img tag or placeholder
 */
export const getImageProps = (service, options = {}) => {
  const {
    index = 0,
    alt = service?.title || 'Service image',
    style = {},
    className = '',
    ...imgProps
  } = options;

  const hasImage = hasServiceImage(service);

  if (!hasImage) {
    return {
      isPlaceholder: true,
      placeholderText: 'No Image Available',
      alt,
      className,
      style: { backgroundColor: '#f3f4f6', ...style }
    };
  }

  return {
    src: getServiceImageUrl(service, index),
    alt,
    className,
    style,
    ...imgProps
  };
};
