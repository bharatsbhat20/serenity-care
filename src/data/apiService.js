// ============================================================================
// API / database service
// A drop-in replacement for the mock service that talks to a real backend.
// It implements the exact same method signatures, so flipping the "Live
// Database" switch in Settings swaps this in with zero changes elsewhere.
//
// To connect a real backend:
//   1. Set VITE_API_BASE_URL (and optionally VITE_API_KEY) in .env.local
//   2. Implement matching REST endpoints, OR adapt the fetch paths below.
//   3. Flip the toggle in Settings → Data Source.
//
// Each endpoint should return JSON matching the shapes in mockData.js.
// ============================================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_KEY = import.meta.env.VITE_API_KEY || ''

async function request(path, options = {}) {
  if (!BASE_URL) {
    throw new Error(
      'No API base URL configured. Set VITE_API_BASE_URL in .env.local to use the live database, or switch back to mock data in Settings.'
    )
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
    },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API request failed (${res.status}): ${path}`)
  }
  return res.json()
}

export const apiService = {
  source: 'api',
  configured: Boolean(BASE_URL),

  getFacility: () => request('/facility'),
  getResidents: () => request('/residents'),
  getResident: (id) => request(`/residents/${id}`),
  getCaregivers: () => request('/caregivers'),
  getMedications: (residentId) =>
    request(residentId ? `/medications?residentId=${residentId}` : '/medications'),
  getVitals: (residentId) => request(`/residents/${residentId}/vitals`),
  getAllVitals: () => request('/vitals'),
  getScheduleEvents: () => request('/schedule'),
  getWorkflows: () => request('/workflows'),
  getAlerts: () => request('/alerts'),
  getActivityFeed: () => request('/activity'),
  getAnalytics: () => request('/analytics'),
  getEventTypeMeta: () => request('/schedule/event-types'),

  toggleWorkflowStep: (workflowId, stepId) =>
    request(`/workflows/${workflowId}/steps/${stepId}/toggle`, { method: 'POST' }),
  acknowledgeAlert: (alertId) =>
    request(`/alerts/${alertId}/acknowledge`, { method: 'POST' }),
  updateEventStatus: (eventId, status) =>
    request(`/schedule/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}
