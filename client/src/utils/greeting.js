/**
 * Returns a time-appropriate greeting string based on the current hour.
 * Morning: 00:00–11:59, Afternoon: 12:00–16:59, Evening: 17:00–23:59.
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
