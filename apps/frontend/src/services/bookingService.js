import axios from 'axios';

// Reads from environment variable at build time.
// In local dev: set in .env.local (REACT_APP_API_URL=http://localhost:8082)
// In GKE:       set in the frontend Helm template as env var and injected at runtime
//               via window._env_ or via Dockerfile build args.
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8082';

const BOOKING_SERVICE = `${API_BASE}/api/v1`;
const PAYMENT_SERVICE = (process.env.REACT_APP_PAYMENT_URL || 'http://localhost:8085') + '/api/v1';

// ── Bookings ──────────────────────────────────────────────
export const getBookings = () => axios.get(`${BOOKING_SERVICE}/bookings`);
export const createBooking = (b) => axios.post(`${BOOKING_SERVICE}/bookings`, b);
export const cancelBooking = (id) => axios.delete(`${BOOKING_SERVICE}/bookings/${id}`);

// ── Payments ─────────────────────────────────────────────
export const processPayment = (payload) => axios.post(`${PAYMENT_SERVICE}/payments/process`, payload);
