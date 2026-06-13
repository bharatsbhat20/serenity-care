// ============================================================================
// Serenity Care — Mock dataset (Family Caregiver edition)
//
// The platform is seen through the eyes of Sarah Bennett — an adult daughter
// coordinating care for her father, Robert ("Dad"), who is aging in place at
// home. She's supported by a "care circle": her brother, a paid home aide,
// Dad's doctor, a visiting physical therapist, and a helpful neighbor.
//
// This mirrors the shape a real backend would return. Swapping to a live
// database only requires the API service to return the same shapes
// (see apiService.js).
// ============================================================================

// Deterministic pseudo-random so charts look natural but stable across reloads.
function seeded(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function dayOffset(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
const todayISO = () => new Date().toISOString().slice(0, 10)

// ---------------------------------------------------------------------------
// The person you're caring for (kept as an array so the app stays multi-ready)
// ---------------------------------------------------------------------------
export const residents = [
  {
    id: 'r1',
    name: 'Robert Bennett',
    preferredName: 'Dad',
    relationship: 'Father',
    age: 82,
    gender: 'Male',
    photo: 'https://i.pravatar.cc/240?img=12',
    livingSituation: 'Lives at home',
    careSetting: 'Aging in place',
    status: 'attention',
    caringSince: '2024-02-10',
    bloodType: 'O+',
    mobility: 'Walker',
    dietaryNeeds: ['Low sodium', 'Diabetic-friendly'],
    allergies: ['Penicillin'],
    conditions: ['Type 2 Diabetes', 'High blood pressure', 'Arthritis (knees)'],
    primaryPhysician: 'Dr. Sandra Okafor',
    riskScore: 48,
    adherence: 93,
    address: '1420 Maple Grove Ln, Portland, OR',
    emergencyContacts: [
      { name: 'Sarah Bennett', relation: 'Daughter (you)', phone: '(503) 555-0182' },
      { name: 'Michael Bennett', relation: 'Son', phone: '(503) 555-0148' },
      { name: 'Dr. Sandra Okafor', relation: 'Primary physician', phone: '(503) 555-0400' },
    ],
    carePlan:
      'Keep blood sugar steady with morning and evening checks, low-sodium meals, and gentle daily walks with his walker. Weekly check-ins with Dr. Okafor and physical therapy twice a week for his knees.',
    tags: ['Diabetes', 'Lives at home', 'Fall risk: low'],
  },
]

// ---------------------------------------------------------------------------
// Care circle — the people who help (family, paid aide, doctor, PT, neighbor)
// ---------------------------------------------------------------------------
export const caregivers = [
  {
    id: 'c1',
    name: 'Sarah Bennett',
    role: 'Primary caregiver',
    relationship: 'Daughter',
    isYou: true,
    photo: 'https://i.pravatar.cc/240?img=31',
    phone: '(503) 555-0182',
    email: 'sarah.bennett@email.com',
    availability: 'Every day',
    status: 'on-duty',
    helpsWith: ['Coordination', 'Medications', 'Doctor visits', 'Finances'],
    assignedResidents: ['r1'],
    hoursThisWeek: 16,
    certifications: [],
  },
  {
    id: 'c2',
    name: 'Michael Bennett',
    role: 'Family — shares the load',
    relationship: 'Son',
    photo: 'https://i.pravatar.cc/240?img=15',
    phone: '(503) 555-0148',
    email: 'michael.bennett@email.com',
    availability: 'Weekends',
    status: 'off-duty',
    helpsWith: ['Weekend visits', 'Transportation', 'Groceries'],
    assignedResidents: ['r1'],
    hoursThisWeek: 6,
    certifications: [],
  },
  {
    id: 'c3',
    name: 'Linda Park',
    role: 'Home health aide (paid)',
    relationship: 'Hired aide',
    photo: 'https://i.pravatar.cc/240?img=20',
    phone: '(503) 555-0311',
    email: 'linda.park@homecareplus.com',
    availability: 'Weekday mornings',
    status: 'on-duty',
    helpsWith: ['Bathing & dressing', 'Meal prep', 'Light housekeeping'],
    assignedResidents: ['r1'],
    hoursThisWeek: 20,
    certifications: ['CNA', 'CPR'],
  },
  {
    id: 'c4',
    name: 'Dr. Sandra Okafor',
    role: 'Primary physician',
    relationship: 'Doctor',
    photo: 'https://i.pravatar.cc/240?img=47',
    phone: '(503) 555-0400',
    email: 'office@okaformd.com',
    availability: 'By appointment',
    status: 'off-duty',
    helpsWith: ['Medical care', 'Prescriptions', 'Care plan'],
    assignedResidents: ['r1'],
    hoursThisWeek: null,
    certifications: ['MD', 'Internal Medicine'],
  },
  {
    id: 'c5',
    name: 'Grace Kim',
    role: 'Physical therapist (visiting)',
    relationship: 'Therapist',
    photo: 'https://i.pravatar.cc/240?img=41',
    phone: '(503) 555-0355',
    email: 'grace.kim@mobilept.com',
    availability: 'Tue & Fri',
    status: 'off-duty',
    helpsWith: ['Mobility', 'Fall prevention', 'Knee strength'],
    assignedResidents: ['r1'],
    hoursThisWeek: 3,
    certifications: ['DPT'],
  },
  {
    id: 'c6',
    name: 'Tom Alvarez',
    role: 'Neighbor & friend',
    relationship: 'Neighbor',
    photo: 'https://i.pravatar.cc/240?img=53',
    phone: '(503) 555-0166',
    email: 'tom.alvarez@email.com',
    availability: 'As needed',
    status: 'on-duty',
    helpsWith: ['Emergency backup', 'Companionship', 'Errands'],
    assignedResidents: ['r1'],
    hoursThisWeek: 2,
    certifications: [],
  },
]

// ---------------------------------------------------------------------------
// Medications (Dad's)
// ---------------------------------------------------------------------------
export const medications = [
  { id: 'm1', residentId: 'r1', name: 'Metformin', dose: '500 mg', form: 'Tablet', frequency: 'Twice daily', times: ['08:00', '18:00'], route: 'With meals', purpose: 'Blood sugar control', prescriber: 'Dr. Okafor', refillDate: '2026-06-16', stock: 14, adherence: 95, critical: true },
  { id: 'm2', residentId: 'r1', name: 'Lisinopril', dose: '10 mg', form: 'Tablet', frequency: 'Once daily', times: ['08:00'], route: 'Morning', purpose: 'Blood pressure', prescriber: 'Dr. Okafor', refillDate: '2026-06-28', stock: 26, adherence: 97, critical: true },
  { id: 'm3', residentId: 'r1', name: 'Amlodipine', dose: '5 mg', form: 'Tablet', frequency: 'Once daily', times: ['08:00'], route: 'Morning', purpose: 'Blood pressure', prescriber: 'Dr. Okafor', refillDate: '2026-07-10', stock: 30, adherence: 92, critical: false },
  { id: 'm4', residentId: 'r1', name: 'Atorvastatin', dose: '20 mg', form: 'Tablet', frequency: 'Once daily', times: ['21:00'], route: 'Bedtime', purpose: 'Cholesterol', prescriber: 'Dr. Okafor', refillDate: '2026-07-02', stock: 9, adherence: 90, critical: false },
  { id: 'm5', residentId: 'r1', name: 'Acetaminophen', dose: '500 mg', form: 'Tablet', frequency: 'As needed', times: [], route: 'For knee pain', purpose: 'Arthritis pain relief', prescriber: 'Dr. Okafor', refillDate: '2026-06-20', stock: 5, adherence: 100, critical: false },
  { id: 'm6', residentId: 'r1', name: 'Vitamin D3', dose: '1000 IU', form: 'Softgel', frequency: 'Once daily', times: ['08:00'], route: 'Morning', purpose: 'Bone health', prescriber: 'Dr. Okafor', refillDate: '2026-08-01', stock: 40, adherence: 96, critical: false },
]

// ---------------------------------------------------------------------------
// Vitals — generated 30-day time series for Dad
// ---------------------------------------------------------------------------
function generateVitals(baseline, seed) {
  const rand = seeded(seed)
  const days = 30
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const wobble = (amp) => (rand() - 0.5) * amp
    // gentle improving trend on glucose & BP as care plan takes effect
    const trend = (days - 1 - i) / (days - 1)
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      systolic: Math.round(baseline.systolic - trend * 8 + wobble(12)),
      diastolic: Math.round(baseline.diastolic - trend * 4 + wobble(7)),
      heartRate: Math.round(baseline.heartRate + wobble(9)),
      glucose: Math.round(baseline.glucose - trend * 14 + wobble(30)),
      weight: +(baseline.weight + wobble(1.2)).toFixed(1),
      spo2: Math.min(100, Math.round(baseline.spo2 + wobble(3))),
      temperature: +(baseline.temperature + wobble(0.6)).toFixed(1),
      sleepHours: +(baseline.sleep + wobble(1.6)).toFixed(1),
      steps: Math.max(0, Math.round(baseline.steps + trend * 600 + wobble(baseline.steps * 0.5))),
      mood: Math.max(1, Math.min(5, +(baseline.mood + trend * 0.5 + wobble(1.2)).toFixed(1))),
    })
  }
  return out
}

export const vitalsByResident = {
  r1: generateVitals({ systolic: 142, diastolic: 86, heartRate: 74, glucose: 152, weight: 79, spo2: 97, temperature: 98.4, sleep: 6.6, steps: 2200, mood: 3.4 }, 101),
}

// ---------------------------------------------------------------------------
// Schedule / care calendar — Dad's day, shared across the care circle
// ---------------------------------------------------------------------------
const T = todayISO()

export const scheduleEvents = [
  // Today
  { id: 'e1', date: T, start: '07:30', end: '08:00', type: 'medication', title: 'Morning meds & blood sugar check', residentId: 'r1', caregiverId: 'c3', location: 'Home', status: 'completed', notes: 'Linda: blood sugar 138, all morning meds taken.' },
  { id: 'e2', date: T, start: '08:00', end: '08:30', type: 'meal', title: 'Breakfast — diabetic-friendly', residentId: 'r1', caregiverId: 'c3', location: 'Home · kitchen', status: 'completed', notes: 'Oatmeal, eggs, no added salt.' },
  { id: 'e3', date: T, start: '09:30', end: '10:15', type: 'therapy', title: 'Physical therapy — knees', residentId: 'r1', caregiverId: 'c5', location: 'Home · living room', status: 'in-progress', notes: 'Grace: balance work and gentle strengthening.' },
  { id: 'e4', date: T, start: '11:00', end: '11:30', type: 'errand', title: 'Pharmacy refill pickup', residentId: 'r1', caregiverId: 'c2', location: 'Riverside Pharmacy', status: 'upcoming', notes: 'Michael picking up Metformin + Atorvastatin.' },
  { id: 'e5', date: T, start: '12:30', end: '13:00', type: 'meal', title: 'Lunch — low sodium', residentId: 'r1', caregiverId: 'c3', location: 'Home · kitchen', status: 'upcoming', notes: '' },
  { id: 'e6', date: T, start: '14:00', end: '14:20', type: 'vitals', title: 'Afternoon blood pressure check', residentId: 'r1', caregiverId: 'c1', location: 'Home', status: 'upcoming', notes: 'You’re logging this remotely with the home cuff.' },
  { id: 'e7', date: T, start: '16:00', end: '16:30', type: 'social', title: 'Video call with the grandkids', residentId: 'r1', caregiverId: 'c1', location: 'Home', status: 'upcoming', notes: 'Always lifts his spirits.' },
  { id: 'e8', date: T, start: '17:30', end: '18:30', type: 'visit', title: 'Your evening visit', residentId: 'r1', caregiverId: 'c1', location: 'Home', status: 'upcoming', notes: 'Dinner together, evening meds, tidy up.' },
  { id: 'e9', date: T, start: '18:00', end: '18:15', type: 'medication', title: 'Evening medications', residentId: 'r1', caregiverId: 'c1', location: 'Home', status: 'upcoming', notes: 'Metformin with dinner.' },
  // Tomorrow
  { id: 'e10', date: dayOffset(1), start: '09:00', end: '10:00', type: 'appointment', title: 'Dr. Okafor — diabetes check-up', residentId: 'r1', caregiverId: 'c1', location: 'Okafor Family Medicine', status: 'upcoming', notes: 'Michael driving. Bring glucose log & questions.' },
  { id: 'e11', date: dayOffset(1), start: '13:00', end: '13:45', type: 'social', title: 'Garden walk with Tom', residentId: 'r1', caregiverId: 'c6', location: 'Backyard & block', status: 'upcoming', notes: '' },
  { id: 'e12', date: dayOffset(1), start: '15:00', end: '15:30', type: 'errand', title: 'Grocery delivery & put-away', residentId: 'r1', caregiverId: 'c2', location: 'Home', status: 'upcoming', notes: '' },
  // Day +2
  { id: 'e13', date: dayOffset(2), start: '09:30', end: '10:15', type: 'therapy', title: 'Physical therapy — knees', residentId: 'r1', caregiverId: 'c5', location: 'Home · living room', status: 'upcoming', notes: '' },
  { id: 'e14', date: dayOffset(2), start: '11:00', end: '11:45', type: 'activity', title: 'Crossword & coffee', residentId: 'r1', caregiverId: 'c6', location: 'Home', status: 'upcoming', notes: 'His favorite morning ritual.' },
  // Day +3
  { id: 'e15', date: dayOffset(3), start: '10:00', end: '10:30', type: 'vitals', title: 'Weekly weight & blood pressure', residentId: 'r1', caregiverId: 'c1', location: 'Home', status: 'upcoming', notes: '' },
  { id: 'e16', date: dayOffset(3), start: '17:30', end: '18:30', type: 'visit', title: 'Your evening visit', residentId: 'r1', caregiverId: 'c1', location: 'Home', status: 'upcoming', notes: '' },
  // Yesterday (history)
  { id: 'e17', date: dayOffset(-1), start: '09:30', end: '10:15', type: 'therapy', title: 'Physical therapy — knees', residentId: 'r1', caregiverId: 'c5', location: 'Home · living room', status: 'completed', notes: 'Good session, less stiffness.' },
  { id: 'e18', date: dayOffset(-1), start: '14:00', end: '14:20', type: 'vitals', title: 'Afternoon blood pressure check', residentId: 'r1', caregiverId: 'c1', location: 'Home', status: 'completed', notes: '136/84 — better than last week.' },
]

export const eventTypeMeta = {
  medication: { label: 'Medication', color: '#1f9f93', bg: '#d4f5ee', icon: 'Pill' },
  vitals: { label: 'Health check', color: '#7c3aed', bg: '#ede9fe', icon: 'Activity' },
  therapy: { label: 'Therapy', color: '#0ea5e9', bg: '#e0f2fe', icon: 'Dumbbell' },
  appointment: { label: 'Doctor visit', color: '#fa3c11', bg: '#ffe2d4', icon: 'Stethoscope' },
  activity: { label: 'Activity', color: '#d97706', bg: '#fef3c7', icon: 'Music' },
  meal: { label: 'Meal', color: '#16a34a', bg: '#dcfce7', icon: 'Utensils' },
  social: { label: 'Social', color: '#db2777', bg: '#fce7f3', icon: 'Users' },
  visit: { label: 'Family visit', color: '#6366f1', bg: '#e0e7ff', icon: 'Home' },
  errand: { label: 'Errand', color: '#0891b2', bg: '#cffafe', icon: 'ShoppingCart' },
}

// ---------------------------------------------------------------------------
// Care routines — friendly daily/weekly checklists (not clinical protocols)
// ---------------------------------------------------------------------------
export const workflows = [
  {
    id: 'w1',
    name: 'Dad’s Morning Routine',
    residentId: 'r1',
    category: 'Daily routine',
    frequency: 'Every morning',
    progress: 80,
    assignedTo: 'c3',
    priority: 'high',
    dueToday: true,
    steps: [
      { id: 's1', label: 'Gentle wake-up & help getting dressed', done: true, time: '7:00 AM' },
      { id: 's2', label: 'Wash up & morning hygiene', done: true, time: '7:20 AM' },
      { id: 's3', label: 'Check blood sugar', done: true, time: '7:30 AM' },
      { id: 's4', label: 'Breakfast + morning medications', done: true, time: '8:00 AM' },
      { id: 's5', label: 'Short walk with walker', done: false, time: '8:45 AM' },
    ],
  },
  {
    id: 'w2',
    name: 'Diabetes Daily Care',
    residentId: 'r1',
    category: 'Health',
    frequency: 'Daily',
    progress: 50,
    assignedTo: 'c1',
    priority: 'high',
    dueToday: true,
    steps: [
      { id: 's1', label: 'Fasting blood sugar reading', done: true, time: '7:30 AM' },
      { id: 's2', label: 'Check feet for sores or redness', done: true, time: '8:00 AM' },
      { id: 's3', label: 'Log meals & carbs', done: false, time: 'Ongoing' },
      { id: 's4', label: 'Evening blood sugar reading', done: false, time: '6:00 PM' },
      { id: 's5', label: 'Evening medications with dinner', done: false, time: '6:00 PM' },
    ],
  },
  {
    id: 'w3',
    name: 'Evening Wind-Down',
    residentId: 'r1',
    category: 'Wellbeing',
    frequency: 'Every evening',
    progress: 0,
    assignedTo: 'c1',
    priority: 'medium',
    dueToday: true,
    steps: [
      { id: 's1', label: 'Light, low-sodium dinner', done: false, time: '6:00 PM' },
      { id: 's2', label: 'Evening medications', done: false, time: '6:15 PM' },
      { id: 's3', label: 'Favorite TV show or music', done: false, time: '7:00 PM' },
      { id: 's4', label: 'Lay out clothes for tomorrow', done: false, time: '8:30 PM' },
      { id: 's5', label: 'Lights, locks & nightlights on', done: false, time: '9:00 PM' },
    ],
  },
  {
    id: 'w4',
    name: 'Mealtime & Nutrition',
    residentId: 'r1',
    category: 'Daily routine',
    frequency: 'Daily',
    progress: 67,
    assignedTo: 'c3',
    priority: 'medium',
    dueToday: true,
    steps: [
      { id: 's1', label: 'Plan low-sodium, diabetic-friendly meals', done: true, time: 'Morning' },
      { id: 's2', label: 'Prep healthy snacks within reach', done: true, time: 'Morning' },
      { id: 's3', label: 'Hydration reminders through the day', done: false, time: 'Ongoing' },
    ],
  },
  {
    id: 'w5',
    name: 'Weekly Home Safety Check',
    residentId: 'r1',
    category: 'Safety',
    frequency: 'Weekly',
    progress: 0,
    assignedTo: 'c1',
    priority: 'medium',
    dueToday: false,
    steps: [
      { id: 's1', label: 'Clear walkways & secure loose rugs', done: false, time: 'Sat' },
      { id: 's2', label: 'Check bathroom grab bars', done: false, time: 'Sat' },
      { id: 's3', label: 'Test nightlights & replace batteries', done: false, time: 'Sat' },
      { id: 's4', label: 'Phone & emergency list within reach', done: false, time: 'Sat' },
    ],
  },
  {
    id: 'w6',
    name: 'Doctor Visit Prep',
    residentId: 'r1',
    category: 'Appointments',
    frequency: 'Before each visit',
    progress: 25,
    assignedTo: 'c2',
    priority: 'high',
    dueToday: false,
    steps: [
      { id: 's1', label: 'Write down questions & new symptoms', done: true, time: 'Night before' },
      { id: 's2', label: 'Update current medication list', done: false, time: 'Night before' },
      { id: 's3', label: 'Arrange transportation', done: false, time: 'Night before' },
      { id: 's4', label: 'Bring insurance card & glucose log', done: false, time: 'Day of' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Reminders & alerts
// ---------------------------------------------------------------------------
export const alerts = [
  { id: 'a1', severity: 'critical', residentId: 'r1', title: 'Blood pressure is high', detail: 'Reading of 164/96 this morning — above Dad’s usual range. Keep an eye on it and mention it to Dr. Okafor tomorrow.', time: '25 min ago', category: 'vitals', acknowledged: false },
  { id: 'a2', severity: 'warning', residentId: 'r1', title: 'Metformin refill due soon', detail: 'Only 14 tablets left — refill is due Jun 16. Michael is picking it up today.', time: '1 hr ago', category: 'medication', acknowledged: false },
  { id: 'a3', severity: 'warning', residentId: 'r1', title: 'Pain reliever running low', detail: 'Acetaminophen down to 5 tablets. Add to the next pharmacy order.', time: '3 hr ago', category: 'medication', acknowledged: false },
  { id: 'a4', severity: 'info', residentId: 'r1', title: 'Appointment tomorrow at 9:00 AM', detail: 'Diabetes check-up with Dr. Okafor. Don’t forget the glucose log.', time: '4 hr ago', category: 'appointment', acknowledged: false },
  { id: 'a5', severity: 'warning', residentId: 'r1', title: 'Missed his afternoon walk yesterday', detail: 'Dad skipped his walk — knees were sore. Grace can adjust today’s PT.', time: 'Yesterday', category: 'activity', acknowledged: false },
  { id: 'a6', severity: 'info', residentId: 'r1', title: 'Blood sugar trending down 🎉', detail: '7-day average glucose is down 14 mg/dL. The new routine is working.', time: 'Yesterday', category: 'vitals', acknowledged: true },
  { id: 'a7', severity: 'critical', residentId: 'r1', title: 'Low blood sugar earlier (resolved)', detail: 'Glucose dipped to 64 mg/dL at 3 PM yesterday — Linda gave juice and it recovered to 110.', time: 'Yesterday', category: 'vitals', acknowledged: true },
  { id: 'a8', severity: 'info', residentId: 'r1', title: 'Restless night', detail: 'Dad woke twice overnight. Worth watching if it continues.', time: 'Yesterday', category: 'vitals', acknowledged: true },
]

// ---------------------------------------------------------------------------
// Recent updates from the care circle
// ---------------------------------------------------------------------------
export const activityFeed = [
  { id: 'af1', residentId: 'r1', caregiverId: 'c3', action: 'gave Dad his morning meds & logged blood sugar (138)', time: '8:05 AM', type: 'medication' },
  { id: 'af2', residentId: 'r1', caregiverId: 'c5', action: 'finished a knee physical-therapy session — less stiffness', time: '10:15 AM', type: 'therapy' },
  { id: 'af3', residentId: 'r1', caregiverId: 'c2', action: 'picked up prescriptions from the pharmacy', time: '11:30 AM', type: 'errand' },
  { id: 'af4', residentId: 'r1', caregiverId: 'c1', action: 'added a note: “Dad seemed cheerful and ate a full lunch”', time: '12:40 PM', type: 'social' },
  { id: 'af5', residentId: 'r1', caregiverId: 'c6', action: 'stopped by for coffee and a chat', time: '3:00 PM', type: 'social' },
  { id: 'af6', residentId: 'r1', caregiverId: 'c3', action: 'prepped low-sodium dinner and tidied the kitchen', time: '4:10 PM', type: 'meal' },
]

// ---------------------------------------------------------------------------
// Insights — family-caregiver analytics
// ---------------------------------------------------------------------------
export const analytics = {
  // Overall wellbeing score (0–100) over 6 months — trending up with the new routine
  wellbeingTrend: [
    { month: 'Jan', score: 66 },
    { month: 'Feb', score: 69 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 79 },
    { month: 'Jun', score: 83 },
  ],
  // Who's helping — hours of care contributed this week
  careContribution: [
    { name: 'Linda (aide)', hours: 20, color: '#1f9f93' },
    { name: 'You (Sarah)', hours: 16, color: '#43bbac' },
    { name: 'Michael', hours: 6, color: '#7c3aed' },
    { name: 'Grace (PT)', hours: 3, color: '#0ea5e9' },
    { name: 'Tom', hours: 2, color: '#d97706' },
  ],
  // Daily care hours split across helper types
  helperHours: [
    { day: 'Mon', you: 2, aide: 4, family: 0 },
    { day: 'Tue', you: 3, aide: 4, family: 0 },
    { day: 'Wed', you: 2, aide: 4, family: 0 },
    { day: 'Thu', you: 3, aide: 4, family: 0 },
    { day: 'Fri', you: 2, aide: 4, family: 1 },
    { day: 'Sat', you: 2, aide: 0, family: 4 },
    { day: 'Sun', you: 2, aide: 0, family: 3 },
  ],
  // Medication adherence — 6-week trend
  adherenceTrend: [
    { week: 'W1', adherence: 86 },
    { week: 'W2', adherence: 89 },
    { week: 'W3', adherence: 91 },
    { week: 'W4', adherence: 90 },
    { week: 'W5', adherence: 94 },
    { week: 'W6', adherence: 95 },
  ],
  // Health events logged this month
  healthEventsByType: [
    { type: 'PT sessions', count: 8 },
    { type: 'Doctor visits', count: 3 },
    { type: 'Dizzy spells', count: 2 },
    { type: 'Missed meds', count: 1 },
    { type: 'Falls', count: 0 },
  ],
  // Mood over the last 6 weeks (out of 5)
  moodTrend: [
    { week: 'W1', mood: 3.3 },
    { week: 'W2', mood: 3.5 },
    { week: 'W3', mood: 3.4 },
    { week: 'W4', mood: 3.8 },
    { week: 'W5', mood: 4.0 },
    { week: 'W6', mood: 4.2 },
  ],
  wellbeingRadar: [
    { dimension: 'Mobility', value: 64 },
    { dimension: 'Nutrition', value: 82 },
    { dimension: 'Mood', value: 78 },
    { dimension: 'Sleep', value: 70 },
    { dimension: 'Social', value: 75 },
    { dimension: 'Independence', value: 68 },
  ],
}

// Household / care context (replaces the old facility object)
export const facility = {
  caregiverName: 'Sarah Bennett',
  caregiverRole: 'Daughter & primary caregiver',
  lovedOneName: 'Robert (Dad)',
  lovedOnesCount: 1,
  careCircleSize: 6,
  location: 'Portland, Oregon',
  caringSince: 2024,
}
