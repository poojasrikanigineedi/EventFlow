// EventFlow REST API Client connected to Node.js / Express backend

const BASE_URL = '/api';

function getHeaders() {
  const user = JSON.parse(localStorage.getItem('ef_user') || 'null');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (user?.id) {
    headers['x-user-id'] = user.id;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication
  signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  login: (email, password, role) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Venues
  getVenues: () => request('/venues'),
  createVenue: (venueData) => request('/venues', { method: 'POST', body: JSON.stringify(venueData) }),
  updateVenue: (id, venueData) => request(`/venues/${id}`, { method: 'PUT', body: JSON.stringify(venueData) }),
  deleteVenue: (id) => request(`/venues/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: () => request('/events'),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (eventData) => request('/events', { method: 'POST', body: JSON.stringify(eventData) }),
  updateEvent: (id, eventData) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) }),
  publishEvent: (id) => request(`/events/${id}/publish`, { method: 'PATCH' }),

  // Sessions
  createSession: (eventId, sessionData) => request(`/events/${eventId}/sessions`, { method: 'POST', body: JSON.stringify(sessionData) }),
  updateSession: (id, sessionData) => request(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(sessionData) }),
  deleteSession: (id) => request(`/sessions/${id}`, { method: 'DELETE' }),

  // Registrations
  getRegistrations: () => request('/registrations'),
  createRegistration: (eventId, responses) => request('/registrations', { method: 'POST', body: JSON.stringify({ eventId, responses }) }),

  // Schedule
  getSchedule: () => request('/schedule'),

  // QR Codes & Check-ins
  generateQR: (eventId, sessionId, venueId) => request('/qr/generate', { method: 'POST', body: JSON.stringify({ eventId, sessionId, venueId }) }),
  getQRCodes: () => request('/qr/codes'),
  getActiveStations: () => request('/qr/active-stations'),
  checkInQR: (payload) => request('/qr/checkin', { method: 'POST', body: JSON.stringify(payload) }),
  getQRTracking: () => request('/qr/tracking'),

  // Live Crowd
  getCrowd: () => request('/crowd'),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH' }),

  // System Clean Reset
  resetSystem: () => request('/system/reset', { method: 'POST' })
};
