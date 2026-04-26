/**
 * Centralized utility for date and time formatting in Indian Standard Time (IST).
 */

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Formats a date string to a short IST date (e.g., Jun 15, 2024).
 */
export const formatToISTDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: IST_TIMEZONE
  });
};

/**
 * Formats a date string to a long IST date (e.g., Saturday, June 15, 2024).
 */
export const formatToISTDateLong = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: IST_TIMEZONE
    });
  };

/**
 * Formats a date string to an IST time (e.g., 07:30 PM).
 */
export const formatToISTTime = (dateStringOrDate) => {
  if (!dateStringOrDate) return "—";
  return new Date(dateStringOrDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIMEZONE
  });
};

/**
 * Formats to a short date for inputs (YYYY-MM-DD) in IST.
 * Note: input type=date expects local time, so we convert.
 */
export const getISTDateString = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: IST_TIMEZONE
  }).format(date);
};
