// ============================================================================
// Mock data service
// Implements the same async interface as apiService so the rest of the app is
// agnostic to where data comes from. All methods return Promises and simulate
// realistic network latency.
// ============================================================================
import * as db from './mockData.js'

// Clone so callers can't accidentally mutate the source dataset.
const clone = (v) => JSON.parse(JSON.stringify(v))
const delay = (ms = 220) => new Promise((res) => setTimeout(res, ms))

export const mockService = {
  source: 'mock',

  async getFacility() {
    await delay()
    return clone(db.facility)
  },

  async getResidents() {
    await delay()
    return clone(db.residents)
  },

  async getResident(id) {
    await delay()
    return clone(db.residents.find((r) => r.id === id) || null)
  },

  async getCaregivers() {
    await delay()
    return clone(db.caregivers)
  },

  async getMedications(residentId) {
    await delay()
    const meds = residentId
      ? db.medications.filter((m) => m.residentId === residentId)
      : db.medications
    return clone(meds)
  },

  async getVitals(residentId) {
    await delay()
    return clone(db.vitalsByResident[residentId] || [])
  },

  async getAllVitals() {
    await delay()
    return clone(db.vitalsByResident)
  },

  async getScheduleEvents() {
    await delay()
    return clone(db.scheduleEvents)
  },

  async getWorkflows() {
    await delay()
    return clone(db.workflows)
  },

  async getAlerts() {
    await delay()
    return clone(db.alerts)
  },

  async getActivityFeed() {
    await delay()
    return clone(db.activityFeed)
  },

  async getAnalytics() {
    await delay()
    return clone(db.analytics)
  },

  async getEventTypeMeta() {
    return clone(db.eventTypeMeta)
  },

  // ---- Mutations (kept in-memory only for the mock backend) ----
  async toggleWorkflowStep(workflowId, stepId) {
    await delay(120)
    const wf = db.workflows.find((w) => w.id === workflowId)
    if (!wf) return null
    const step = wf.steps.find((s) => s.id === stepId)
    if (step) step.done = !step.done
    wf.progress = Math.round((wf.steps.filter((s) => s.done).length / wf.steps.length) * 100)
    return clone(wf)
  },

  async acknowledgeAlert(alertId) {
    await delay(120)
    const a = db.alerts.find((x) => x.id === alertId)
    if (a) a.acknowledged = true
    return clone(a)
  },

  async updateEventStatus(eventId, status) {
    await delay(120)
    const e = db.scheduleEvents.find((x) => x.id === eventId)
    if (e) e.status = status
    return clone(e)
  },
}
