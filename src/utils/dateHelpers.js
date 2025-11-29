/**
 * Get today's date in YYYY-MM-DD format
 */
export function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
  const one = new Date(date1);
  const two = new Date(date2);
  const diffMs = two - one;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Compute booking status based on check-in and check-out dates
 */
export function computeStatus(checkIn, checkOut) {
  const t = today();
  if (!checkIn || !checkOut) return "UNKNOWN";
  if (t < checkIn) return "UPCOMING";
  if (t > checkOut) return "PAST";
  return "CURRENT";
}

/**
 * Check if two date ranges overlap
 */
export function overlap(start1, end1, start2, end2) {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  return s1 <= e2 && s2 <= e1;
}

/**
 * Get date in IST for check-in (min today)
 */
export function getDateISTForCheckInMin() {
  const d = getDateIST();
  return d.toISOString().split("T")[0];
}

/**
 * Get date in IST for check-in (max 1 year from now)
 */
export function getDateISTForCheckInMax() {
  const d = getDateIST();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

/**
 * Get date in IST for check-out (min tomorrow)
 */
export function getDateISTForCheckOutMin() {
  const d = getDateIST();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

/**
 * Get date in IST for check-out (max 6 months from now)
 */
export function getDateISTForCheckOutMax() {
  const d = getDateIST();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split("T")[0];
}

/**
 * Get current date in IST timezone
 */
function getDateIST() {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

/**
 * Format date for display
 */
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Validate date is not in the past
 */
export function isNotPastDate(dateString) {
  const date = new Date(dateString);
  const todayDate = new Date(today());
  return date >= todayDate;
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end > start;
}