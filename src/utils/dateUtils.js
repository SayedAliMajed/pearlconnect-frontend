// Utility functions for formatting and data manipulation

/**
 * Format price with currency
 * @param {number} price - Price value
 * @param {string} currency - Currency code (default 'BD')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = "BD") => {
  return `${currency} ${price.toFixed(3)}`;
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format time to readable string
 * @param {string} time - Time string (HH:MM)
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
