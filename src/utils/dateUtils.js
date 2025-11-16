// Date utilities for Bahrain locale (DD/MM/YYYY format)
// Bahrain: Asia/Bahrain, UTC+3:00

export const BAHRAIN_LOCALE = 'ar-BH'; // Bahrain locale for Arabic/English
export const BAHRAIN_TIMEZONE = 'Asia/Bahrain';

/**
 * Format date to DD/MM/YYYY string
 * @param {Date|string} date - Date object or date string
 * @returns {string} DD/MM/YYYY formatted date
 */
export const formatDateToDMY = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Parse DD/MM/YYYY or YYYY-MM-DD string to Date object
 * @param {string} dateString - Date string in DD/MM/YYYY or YYYY-MM-DD format
 * @returns {Date} Date object or null if invalid
 */
export const parseBahrainDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;

  // Handle DD/MM/YYYY format (e.g., "14/11/2025")
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS
      const year = parseInt(parts[2], 10);

      if (day >= 1 && day <= 31 && month >= 0 && month <= 11 && year >= 1900) {
        return new Date(year, month, day);
      }
    }
  }

  // Handle YYYY-MM-DD format (e.g., "2025-11-14")
  if (dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS
      const day = parseInt(parts[2], 10);

      if (year >= 1900 && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
        return new Date(year, month, day);
      }
    }
  }

  return null; // Invalid date
};

/**
 * Format date for input[type="date"] (YYYY-MM-DD format required by HTML)
 * @param {Date|string} date - Date object or date string
 * @returns {string} YYYY-MM-DD formatted date for HTML input
 */
export const formatDateForInput = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format for min attribute of date inputs
 * @returns {string} Today's date in YYYY-MM-DD
 */
export const getTodayDateString = () => {
  return formatDateForInput(new Date());
};

/**
 * Format date for display in Bahrain locale
 * @param {Date|string} date - Date object or date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Localized date string
 */
export const formatDateLocalized = (date, options = {}) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const defaultOptions = {
    timeZone: BAHRAIN_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  };

  return d.toLocaleDateString(BAHRAIN_LOCALE, defaultOptions);
};

/**
 * Format time to HH:MM AM/PM format
 * @param {string} timeString - Time string in HH:MM format
 * @returns {string} HH:MM AM/PM formatted time
 */
export const formatTimeTo12Hour = (timeString) => {
  if (!timeString || !timeString.includes(':')) return '';

  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Check if two dates are the same day (ignoring time)
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

/**
 * Get Bahrain business days (Sunday-Thursday, Friday-Saturday are weekend)
 * @returns {string[]} Array of weekday names
 */
export const getBahrainWeekdays = () => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};

/**
 * Generate time slots for availability
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {number} duration - Duration in minutes (default: 60)
 * @returns {string[]} Array of time slot strings in HH:MM AM/PM format
 */
export const generateTimeSlots = (startTime, endTime, duration = 60) => {
  const slots = [];
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);

  let current = new Date(start);

  while (current < end) {
    const timeString = current.toTimeString().substring(0, 5); // HH:MM
    slots.push(formatTimeTo12Hour(timeString));
    current.setMinutes(current.getMinutes() + duration);
  }

  return slots;
};
