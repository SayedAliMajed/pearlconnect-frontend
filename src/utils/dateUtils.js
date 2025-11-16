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
 * Get today's date as a string in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse Bahrain date format (also handles standard formats)
 * @param {string} dateString - Date string in various formats
 * @returns {Date} Parsed date object
 */
export const parseBahrainDate = (dateString) => {
  if (!dateString) return null;

  // Try different date formats
  // DD/MM/YYYY format (used in Bahrain)
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  }

  // YYYY-MM-DD format
  if (dateString.includes('-')) {
    return new Date(dateString);
  }

  // Try constructing from any other format
  try {
    return new Date(dateString);
  } catch (e) {
    console.error('Could not parse date:', dateString);
    return null;
  }
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

/**
 * Generate time slots between start and end time
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {number} duration - Duration in minutes
 * @returns {string[]} Array of time slots
 */
export const generateTimeSlots = (startTime, endTime, duration = 60) => {
  if (!startTime || !endTime) return [];

  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += duration) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const slotTimeString = formatTimeTo12Hour(timeString);
    slots.push(slotTimeString);
  }

  return slots;
};

/**
 * Format time to readable 12-hour format string
 * @param {string} time - Time string (HH:MM)
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  if (!time) return '';
  return formatTimeTo12Hour(time);
};

/**
 * Format time to 12-hour format (this is the correct name)
 * @param {string} time - Time string (HH:MM)
 * @returns {string} Formatted time in 12-hour format
 */
export const formatTimeTo12Hour = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
