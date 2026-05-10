/**
 * @file shared/constants.js
 * Platform-wide constants shared between client and server.
 */

const USER_ROLES = Object.freeze({
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin',
});

const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

const TIME_SLOTS = Object.freeze({
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
});

const PRICE_UNITS = Object.freeze({
  FIXED: 'fixed',
  PER_HOUR: 'per_hour',
  PER_SQFT: 'per_sqft',
});

const GST_RATE = 0.18;

const SERVICE_CATEGORIES = Object.freeze([
  { name: 'AC Repair & Service', slug: 'ac-repair', icon: '❄️' },
  { name: 'Home Cleaning', slug: 'cleaning', icon: '🧹' },
  { name: 'Plumbing', slug: 'plumbing', icon: '🔧' },
  { name: 'Electrician', slug: 'electrical', icon: '⚡' },
  { name: 'Painting', slug: 'painting', icon: '🎨' },
  { name: 'Pest Control', slug: 'pest-control', icon: '🐛' },
  { name: 'Carpentry', slug: 'carpentry', icon: '🪚' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: '🛠️' },
]);

const SOCKET_EVENTS = Object.freeze({
  BOOKING_NEW: 'booking:new',
  BOOKING_ACCEPTED: 'booking:accepted',
  BOOKING_COMPLETED: 'booking:completed',
  VENDOR_LOCATION: 'vendor:location',
});

const INDIAN_CITIES = Object.freeze([
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
]);

module.exports = {
  USER_ROLES, BOOKING_STATUS, TIME_SLOTS, PRICE_UNITS,
  GST_RATE, SERVICE_CATEGORIES, SOCKET_EVENTS, INDIAN_CITIES,
};
