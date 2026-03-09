export const formatTimeOnly = (timeString) => {
  if (!timeString) return '';
  // If it's HH:mm:ss format, take first 5 chars
  if (timeString.includes(':') && timeString.length >= 5) {
    return timeString.slice(0, 5);
  }
  return timeString;
};

export const formatDateTime = (date, timeString) => {
  if (!date || !timeString) return '';
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString();
  const formattedTime = formatTimeOnly(timeString);
  return `${formattedDate} at ${formattedTime}`;
};
