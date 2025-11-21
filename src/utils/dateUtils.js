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
 * @param {string} startTime - Start time in 12-hour format (e.g., "09:00 AM")
 * @param {string} endTime - End time in 12-hour format (e.g., "05:00 PM")
 * @param {number} duration - Duration in minutes
 * @returns {string[]} Array of time slots
 */
export const generateTimeSlots = (startTime, endTime, duration = 60) => {
  if (!startTime || !endTime) return [];

  const slots = [];
  
  // Parse 12-hour format with AM/PM
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  
  if (startMinutes === null || endMinutes === null) return [];

  for (let minutes = startMinutes; minutes < endMinutes; minutes += duration) {
    const timeString = minutesToTimeString(minutes);
    slots.push(timeString);
  }

  return slots;
};

/**
 * Parse 12-hour time string to minutes
 * @param {string} timeString - Time in format "HH:MM AM/PM"
 * @returns {number} Minutes since midnight
 */
function parseTimeToMinutes(timeString) {
  if (!timeString) return null;
  
  const match = timeString.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return null;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
}

/**
 * Convert minutes to 12-hour time string
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time in format "HH:MM AM/PM"
 */
function minutesToTimeString(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${mins.toString().padStart(2, '0')} ${period}`;
}

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
