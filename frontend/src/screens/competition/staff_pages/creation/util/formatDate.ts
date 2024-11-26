/**
 * Formats a given Date object into a string with the format 'YYYY-MM-DDTHH:mm'.
 * If no date is provided, it returns an empty string.
 *
 * @param {Date} [date] - The date to be formatted. If not provided, an empty string is returned.
 * @returns {string} - A string representation of the date in the format 'YYYY-MM-DDTHH:mm', or
 * an empty string if no date is provided.
 */
export const formatDate = (date?: Date) => {
  if (!date) {
    return "";
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

/**
 * Converts a given Date object to UTC, returning a new Date object representing the same moment
 * in time in UTC.
 *
 * @param {Date} date - The date to be converted to UTC.
 * @returns {Date} - A new Date object representing the UTC equivalent of the given date.
 */
export const dateToUTC = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
  );
};
