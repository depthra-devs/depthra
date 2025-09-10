const DATE_TODAY = new Date();
DATE_TODAY.setHours(0, 0, 0, 0)
const YEAR_TODAY = DATE_TODAY.getFullYear();
const DAY_TODAY = DATE_TODAY.getDate();

// Array of month names
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_NAME_TODAY = MONTH_NAMES[DATE_TODAY.getMonth()];

function getDateNDaysBefore(date, n) {
  let result = new Date(date);        // Clone the original date to avoid mutating it
  result.setDate(result.getDate() - n);  // Subtract n days
  return result;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
