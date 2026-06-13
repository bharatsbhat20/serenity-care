// ============================================================================
// Serenity Care — Mock dataset
// A rich, self-consistent dataset that mirrors the shape a real backend would
// return. Swapping to a live database only requires the API service to return
// objects of the same shape (see apiService.js).
// ============================================================================

const todayISO = () => new Date().toISOString().slice(0, 10)

// Deterministic pseudo-random so charts look natural but stable across reloads.
function seeded(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ---------------------------------------------------------------------------
// Care recipients (residents / clients)
// ---------------------------------------------------------------------------
export const residents = [
  {
    id: 'r1',
    name: 'Eleanor Whitfield',
    preferredName: 'Ellie',
    age: 82,
    gender: 'Female',
    photo: 'https://i.pravatar.cc/240?img=45',
    room: 'A-104',
    careLevel: 'Assisted Living',
    status: 'stable',
    admitted: '2023-03-14',
    bloodType: 'O+',
    mobility: 'Walker',
    dietaryNeeds: ['Low sodium', 'Diabetic'],
    allergies: ['Penicillin', 'Shellfish'],
    conditions: ['Type 2 Diabetes', 'Hypertension', 'Mild osteoarthritis'],
    primaryPhysician: 'Dr. Sandra Okafor',
    riskScore: 38,
    adherence: 96,
    emergencyContacts: [
      { name: 'Michael Whitfield', relation: 'Son', phone: '(415) 555-0182' },
      { name: 'Dana Whitfield', relation: 'Daughter-in-law', phone: '(415) 555-0148' },
    ],
    carePlan: 'Diabetes management with daily glucose monitoring, low-impact mobility program, and fall-risk reduction.',
    tags: ['Diabetic', 'Fall risk: low'],
  },
  {
    id: 'r2',
    name: 'Harold Benedetti',
    preferredName: 'Harry',
    age: 78,
    gender: 'Male',
    photo: 'https://i.pravatar.cc/240?img=12',
    room: 'B-210',
    careLevel: 'Memory Care',
    status: 'attention',
    admitted: '2022-11-02',
    bloodType: 'A-',
    mobility: 'Independent',
    dietaryNeeds: ['Soft foods'],
    allergies: ['Latex'],
    conditions: ['Early-stage Alzheimer’s', 'Atrial fibrillation'],
    primaryPhysician: 'Dr. Raymond Liu',
    riskScore: 64,
    adherence: 88,
    emergencyContacts: [
      { name: 'Patricia Benedetti', relation: 'Wife', phone: '(628) 555-0199' },
      { name: 'Joseph Benedetti', relation: 'Son', phone: '(628) 555-0176' },
    ],
    carePlan: 'Cognitive engagement activities twice daily, anticoagulation monitoring, structured routine to reduce agitation.',
    tags: ['Memory care', 'Wander risk'],
  },
  {
    id: 'r3',
    name: 'Margaret Sørensen',
    preferredName: 'Maggie',
    age: 75,
    gender: 'Female',
    photo: 'https://i.pravatar.cc/240?img=32',
    room: 'A-118',
    careLevel: 'Independent Living',
    status: 'stable',
    admitted: '2024-01-20',
    bloodType: 'B+',
    mobility: 'Independent',
    dietaryNeeds: ['Vegetarian'],
    allergies: [],
    conditions: ['Osteoporosis', 'High cholesterol'],
    primaryPhysician: 'Dr. Sandra Okafor',
    riskScore: 22,
    adherence: 99,
    emergencyContacts: [
      { name: 'Lars Sørensen', relation: 'Son', phone: '(510) 555-0143' },
    ],
    carePlan: 'Bone-density preservation program, weekly social activities, statin therapy with quarterly lipid panels.',
    tags: ['Active', 'Low risk'],
  },
  {
    id: 'r4',
    name: 'Walter Nakamura',
    preferredName: 'Walt',
    age: 88,
    gender: 'Male',
    photo: 'https://i.pravatar.cc/240?img=68',
    room: 'C-302',
    careLevel: 'Skilled Nursing',
    status: 'critical',
    admitted: '2021-06-30',
    bloodType: 'AB+',
    mobility: 'Wheelchair',
    dietaryNeeds: ['Pureed', 'Thickened liquids', 'Low sodium'],
    allergies: ['Sulfa drugs'],
    conditions: ['Congestive heart failure', 'Stage 3 CKD', 'COPD'],
    primaryPhysician: 'Dr. Raymond Liu',
    riskScore: 81,
    adherence: 91,
    emergencyContacts: [
      { name: 'Grace Nakamura', relation: 'Daughter', phone: '(408) 555-0121' },
      { name: 'Kevin Nakamura', relation: 'Son', phone: '(408) 555-0188' },
    ],
    carePlan: 'Daily weight & fluid-balance monitoring, supplemental oxygen as needed, cardiac diet, twice-daily vitals.',
    tags: ['High risk', 'CHF', 'Oxygen'],
  },
  {
    id: 'r5',
    name: 'Rosa Delgado',
    preferredName: 'Rosa',
    age: 79,
    gender: 'Female',
    photo: 'https://i.pravatar.cc/240?img=24',
    room: 'B-205',
    careLevel: 'Assisted Living',
    status: 'stable',
    admitted: '2023-09-08',
    bloodType: 'O-',
    mobility: 'Cane',
    dietaryNeeds: ['Gluten-free'],
    allergies: ['Aspirin'],
    conditions: ['Rheumatoid arthritis', 'Glaucoma'],
    primaryPhysician: 'Dr. Sandra Okafor',
    riskScore: 41,
    adherence: 94,
    emergencyContacts: [
      { name: 'Carlos Delgado', relation: 'Son', phone: '(669) 555-0117' },
    ],
    carePlan: 'Anti-inflammatory regimen, eye-pressure monitoring, gentle range-of-motion therapy three times weekly.',
    tags: ['Arthritis', 'Vision care'],
  },
  {
    id: 'r6',
    name: 'Arthur Pennington',
    preferredName: 'Art',
    age: 84,
    gender: 'Male',
    photo: 'https://i.pravatar.cc/240?img=60',
    room: 'C-308',
    careLevel: 'Assisted Living',
    status: 'attention',
    admitted: '2022-04-17',
    bloodType: 'A+',
    mobility: 'Walker',
    dietaryNeeds: ['Low sodium', 'Renal diet'],
    allergies: [],
    conditions: ['Parkinson’s disease', 'Depression'],
    primaryPhysician: 'Dr. Raymond Liu',
    riskScore: 57,
    adherence: 85,
    emergencyContacts: [
      { name: 'Susan Pennington', relation: 'Daughter', phone: '(415) 555-0164' },
    ],
    carePlan: 'Levodopa timing optimization, mood support and counseling, balance & gait therapy to reduce fall risk.',
    tags: ['Parkinson’s', 'Fall risk: moderate'],
  },
]

// ---------------------------------------------------------------------------
// Caregivers / staff
// ---------------------------------------------------------------------------
export const caregivers = [
  {
    id: 'c1',
    name: 'Amara Johnson',
    role: 'Registered Nurse',
    photo: 'https://i.pravatar.cc/240?img=47',
    phone: '(415) 555-0301',
    email: 'amara.johnson@serenitycare.com',
    shift: 'Day (7a–3p)',
    status: 'on-duty',
    rating: 4.9,
    specialties: ['Wound care', 'Diabetes management', 'IV therapy'],
    assignedResidents: ['r1', 'r4'],
    hoursThisWeek: 36,
    certifications: ['RN', 'BLS', 'ACLS'],
  },
  {
    id: 'c2',
    name: 'Diego Morales',
    role: 'Certified Nursing Assistant',
    photo: 'https://i.pravatar.cc/240?img=15',
    phone: '(415) 555-0302',
    email: 'diego.morales@serenitycare.com',
    shift: 'Day (7a–3p)',
    status: 'on-duty',
    rating: 4.7,
    specialties: ['Mobility assistance', 'Personal care'],
    assignedResidents: ['r2', 'r6'],
    hoursThisWeek: 40,
    certifications: ['CNA', 'BLS'],
  },
  {
    id: 'c3',
    name: 'Priya Nair',
    role: 'Memory Care Specialist',
    photo: 'https://i.pravatar.cc/240?img=20',
    phone: '(415) 555-0303',
    email: 'priya.nair@serenitycare.com',
    shift: 'Day (7a–3p)',
    status: 'on-duty',
    rating: 5.0,
    specialties: ['Dementia care', 'Behavioral support', 'Cognitive therapy'],
    assignedResidents: ['r2'],
    hoursThisWeek: 32,
    certifications: ['CDP', 'CNA', 'BLS'],
  },
  {
    id: 'c4',
    name: 'Thomas O’Brien',
    role: 'Licensed Practical Nurse',
    photo: 'https://i.pravatar.cc/240?img=53',
    phone: '(415) 555-0304',
    email: 'thomas.obrien@serenitycare.com',
    shift: 'Evening (3p–11p)',
    status: 'off-duty',
    rating: 4.6,
    specialties: ['Medication administration', 'Cardiac care'],
    assignedResidents: ['r3', 'r5'],
    hoursThisWeek: 38,
    certifications: ['LPN', 'BLS'],
  },
  {
    id: 'c5',
    name: 'Grace Kim',
    role: 'Physical Therapist',
    photo: 'https://i.pravatar.cc/240?img=41',
    phone: '(415) 555-0305',
    email: 'grace.kim@serenitycare.com',
    shift: 'Day (9a–5p)',
    status: 'on-break',
    rating: 4.8,
    specialties: ['Gait training', 'Fall prevention', 'Rehabilitation'],
    assignedResidents: ['r1', 'r6', 'r4'],
    hoursThisWeek: 30,
    certifications: ['DPT', 'BLS'],
  },
]

// ---------------------------------------------------------------------------
// Medications
// ---------------------------------------------------------------------------
export const medications = [
  { id: 'm1', residentId: 'r1', name: 'Metformin', dose: '500 mg', form: 'Tablet', frequency: 'Twice daily', times: ['08:00', '18:00'], route: 'Oral', purpose: 'Blood glucose control', prescriber: 'Dr. Okafor', refillDate: '2026-07-02', stock: 48, adherence: 97, critical: false },
  { id: 'm2', residentId: 'r1', name: 'Lisinopril', dose: '10 mg', form: 'Tablet', frequency: 'Once daily', times: ['08:00'], route: 'Oral', purpose: 'Blood pressure', prescriber: 'Dr. Okafor', refillDate: '2026-06-25', stock: 22, adherence: 99, critical: false },
  { id: 'm3', residentId: 'r1', name: 'Atorvastatin', dose: '20 mg', form: 'Tablet', frequency: 'Once daily', times: ['21:00'], route: 'Oral', purpose: 'Cholesterol', prescriber: 'Dr. Okafor', refillDate: '2026-07-10', stock: 30, adherence: 94, critical: false },
  { id: 'm4', residentId: 'r2', name: 'Donepezil', dose: '10 mg', form: 'Tablet', frequency: 'Once daily', times: ['21:00'], route: 'Oral', purpose: 'Cognitive support', prescriber: 'Dr. Liu', refillDate: '2026-06-18', stock: 12, adherence: 90, critical: true },
  { id: 'm5', residentId: 'r2', name: 'Apixaban', dose: '5 mg', form: 'Tablet', frequency: 'Twice daily', times: ['08:00', '20:00'], route: 'Oral', purpose: 'Anticoagulation (AFib)', prescriber: 'Dr. Liu', refillDate: '2026-06-20', stock: 28, adherence: 86, critical: true },
  { id: 'm6', residentId: 'r3', name: 'Alendronate', dose: '70 mg', form: 'Tablet', frequency: 'Weekly (Mon)', times: ['07:30'], route: 'Oral', purpose: 'Osteoporosis', prescriber: 'Dr. Okafor', refillDate: '2026-08-01', stock: 8, adherence: 100, critical: false },
  { id: 'm7', residentId: 'r3', name: 'Rosuvastatin', dose: '10 mg', form: 'Tablet', frequency: 'Once daily', times: ['21:00'], route: 'Oral', purpose: 'Cholesterol', prescriber: 'Dr. Okafor', refillDate: '2026-07-15', stock: 26, adherence: 98, critical: false },
  { id: 'm8', residentId: 'r4', name: 'Furosemide', dose: '40 mg', form: 'Tablet', frequency: 'Twice daily', times: ['08:00', '14:00'], route: 'Oral', purpose: 'Fluid management (CHF)', prescriber: 'Dr. Liu', refillDate: '2026-06-16', stock: 18, adherence: 93, critical: true },
  { id: 'm9', residentId: 'r4', name: 'Carvedilol', dose: '12.5 mg', form: 'Tablet', frequency: 'Twice daily', times: ['08:00', '20:00'], route: 'Oral', purpose: 'Heart failure', prescriber: 'Dr. Liu', refillDate: '2026-06-28', stock: 24, adherence: 90, critical: true },
  { id: 'm10', residentId: 'r4', name: 'Albuterol', dose: '90 mcg', form: 'Inhaler', frequency: 'As needed', times: [], route: 'Inhaled', purpose: 'COPD rescue', prescriber: 'Dr. Liu', refillDate: '2026-07-05', stock: 1, adherence: 100, critical: false },
  { id: 'm11', residentId: 'r5', name: 'Methotrexate', dose: '15 mg', form: 'Tablet', frequency: 'Weekly (Fri)', times: ['09:00'], route: 'Oral', purpose: 'Rheumatoid arthritis', prescriber: 'Dr. Okafor', refillDate: '2026-07-20', stock: 6, adherence: 95, critical: true },
  { id: 'm12', residentId: 'r5', name: 'Latanoprost', dose: '1 drop', form: 'Eye drops', frequency: 'Once daily', times: ['21:00'], route: 'Ophthalmic', purpose: 'Glaucoma', prescriber: 'Dr. Okafor', refillDate: '2026-06-22', stock: 14, adherence: 92, critical: false },
  { id: 'm13', residentId: 'r6', name: 'Carbidopa-Levodopa', dose: '25-100 mg', form: 'Tablet', frequency: 'Three times daily', times: ['08:00', '13:00', '18:00'], route: 'Oral', purpose: 'Parkinson’s', prescriber: 'Dr. Liu', refillDate: '2026-06-19', stock: 33, adherence: 84, critical: true },
  { id: 'm14', residentId: 'r6', name: 'Sertraline', dose: '50 mg', form: 'Tablet', frequency: 'Once daily', times: ['08:00'], route: 'Oral', purpose: 'Depression', prescriber: 'Dr. Liu', refillDate: '2026-07-08', stock: 20, adherence: 88, critical: false },
]

// ---------------------------------------------------------------------------
// Vitals — generated time series (last 30 days) per resident
// ---------------------------------------------------------------------------
function generateVitals(residentId, baseline, seed) {
  const rand = seeded(seed)
  const days = 30
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const wobble = (amp) => (rand() - 0.5) * amp
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      systolic: Math.round(baseline.systolic + wobble(14)),
      diastolic: Math.round(baseline.diastolic + wobble(8)),
      heartRate: Math.round(baseline.heartRate + wobble(10)),
      glucose: baseline.glucose ? Math.round(baseline.glucose + wobble(34)) : null,
      weight: +(baseline.weight + wobble(1.4)).toFixed(1),
      spo2: Math.min(100, Math.round(baseline.spo2 + wobble(3))),
      temperature: +(baseline.temperature + wobble(0.6)).toFixed(1),
      sleepHours: +(baseline.sleep + wobble(1.8)).toFixed(1),
      steps: Math.max(0, Math.round(baseline.steps + wobble(baseline.steps * 0.5))),
    })
  }
  return out
}

export const vitalsByResident = {
  r1: generateVitals('r1', { systolic: 134, diastolic: 82, heartRate: 74, glucose: 138, weight: 68, spo2: 97, temperature: 98.4, sleep: 6.8, steps: 2400 }, 101),
  r2: generateVitals('r2', { systolic: 128, diastolic: 78, heartRate: 88, glucose: null, weight: 81, spo2: 96, temperature: 98.2, sleep: 5.9, steps: 3100 }, 202),
  r3: generateVitals('r3', { systolic: 122, diastolic: 76, heartRate: 70, glucose: null, weight: 62, spo2: 98, temperature: 98.6, sleep: 7.4, steps: 5200 }, 303),
  r4: generateVitals('r4', { systolic: 146, diastolic: 88, heartRate: 92, glucose: null, weight: 74, spo2: 93, temperature: 98.1, sleep: 5.2, steps: 600 }, 404),
  r5: generateVitals('r5', { systolic: 126, diastolic: 79, heartRate: 72, glucose: null, weight: 59, spo2: 97, temperature: 98.5, sleep: 6.6, steps: 3400 }, 505),
  r6: generateVitals('r6', { systolic: 132, diastolic: 80, heartRate: 76, glucose: null, weight: 70, spo2: 96, temperature: 98.3, sleep: 6.1, steps: 1800 }, 606),
}

// ---------------------------------------------------------------------------
// Schedule / appointments — typed events across residents & caregivers
// ---------------------------------------------------------------------------
const T = todayISO()
function dayOffset(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const scheduleEvents = [
  // Today
  { id: 'e1', date: T, start: '07:30', end: '08:00', type: 'medication', title: 'Morning medications', residentId: 'r1', caregiverId: 'c1', location: 'Room A-104', status: 'completed', notes: 'Metformin, Lisinopril administered.' },
  { id: 'e2', date: T, start: '08:00', end: '08:30', type: 'vitals', title: 'Vitals check', residentId: 'r4', caregiverId: 'c1', location: 'Room C-302', status: 'completed', notes: 'BP elevated — flagged for review.' },
  { id: 'e3', date: T, start: '09:00', end: '09:45', type: 'therapy', title: 'Physical therapy — gait training', residentId: 'r6', caregiverId: 'c5', location: 'Therapy Suite', status: 'in-progress', notes: 'Focus on balance and step length.' },
  { id: 'e4', date: T, start: '09:30', end: '10:15', type: 'activity', title: 'Memory care — music therapy', residentId: 'r2', caregiverId: 'c3', location: 'Activity Room', status: 'upcoming', notes: 'Group session, familiar songs.' },
  { id: 'e5', date: T, start: '10:30', end: '11:00', type: 'appointment', title: 'Telehealth — cardiology', residentId: 'r4', caregiverId: 'c1', location: 'Telehealth Booth', status: 'upcoming', notes: 'Dr. Liu — CHF follow-up.' },
  { id: 'e6', date: T, start: '11:30', end: '12:00', type: 'meal', title: 'Lunch — diabetic menu', residentId: 'r1', caregiverId: 'c2', location: 'Dining Hall', status: 'upcoming', notes: 'Low-sodium, carb-counted.' },
  { id: 'e7', date: T, start: '13:00', end: '13:30', type: 'medication', title: 'Midday medications', residentId: 'r6', caregiverId: 'c2', location: 'Room C-308', status: 'upcoming', notes: 'Levodopa dose 2 of 3.' },
  { id: 'e8', date: T, start: '14:00', end: '14:45', type: 'social', title: 'Garden walk & social hour', residentId: 'r3', caregiverId: 'c4', location: 'Courtyard', status: 'upcoming', notes: '' },
  { id: 'e9', date: T, start: '15:30', end: '16:00', type: 'vitals', title: 'Afternoon vitals', residentId: 'r4', caregiverId: 'c4', location: 'Room C-302', status: 'upcoming', notes: 'Weight & fluid balance.' },
  { id: 'e10', date: T, start: '18:00', end: '18:30', type: 'medication', title: 'Evening medications', residentId: 'r1', caregiverId: 'c4', location: 'Room A-104', status: 'upcoming', notes: '' },
  { id: 'e11', date: T, start: '10:00', end: '10:30', type: 'appointment', title: 'Eye pressure check', residentId: 'r5', caregiverId: 'c4', location: 'Clinic', status: 'upcoming', notes: 'Glaucoma monitoring.' },
  // Tomorrow
  { id: 'e12', date: dayOffset(1), start: '08:00', end: '08:30', type: 'medication', title: 'Morning medications', residentId: 'r2', caregiverId: 'c3', location: 'Room B-210', status: 'upcoming', notes: '' },
  { id: 'e13', date: dayOffset(1), start: '09:00', end: '10:00', type: 'appointment', title: 'In-person — neurology', residentId: 'r6', caregiverId: 'c5', location: 'Mercy Medical Center', status: 'upcoming', notes: 'Transport scheduled 8:15a.' },
  { id: 'e14', date: dayOffset(1), start: '11:00', end: '11:45', type: 'therapy', title: 'Occupational therapy', residentId: 'r5', caregiverId: 'c5', location: 'Therapy Suite', status: 'upcoming', notes: '' },
  { id: 'e15', date: dayOffset(1), start: '14:00', end: '14:30', type: 'vitals', title: 'Glucose & vitals', residentId: 'r1', caregiverId: 'c1', location: 'Room A-104', status: 'upcoming', notes: '' },
  { id: 'e16', date: dayOffset(2), start: '10:00', end: '10:45', type: 'activity', title: 'Art & craft circle', residentId: 'r3', caregiverId: 'c3', location: 'Activity Room', status: 'upcoming', notes: '' },
  { id: 'e17', date: dayOffset(2), start: '13:00', end: '13:30', type: 'appointment', title: 'Dental cleaning', residentId: 'r5', caregiverId: 'c4', location: 'On-site Dental', status: 'upcoming', notes: '' },
  { id: 'e18', date: dayOffset(3), start: '09:30', end: '10:15', type: 'therapy', title: 'Physical therapy', residentId: 'r1', caregiverId: 'c5', location: 'Therapy Suite', status: 'upcoming', notes: '' },
  { id: 'e19', date: dayOffset(-1), start: '09:00', end: '09:45', type: 'therapy', title: 'Physical therapy', residentId: 'r6', caregiverId: 'c5', location: 'Therapy Suite', status: 'completed', notes: 'Good progress on balance.' },
  { id: 'e20', date: dayOffset(-1), start: '15:00', end: '15:30', type: 'appointment', title: 'Podiatry', residentId: 'r4', caregiverId: 'c1', location: 'Clinic', status: 'completed', notes: '' },
]

export const eventTypeMeta = {
  medication: { label: 'Medication', color: '#1f9f93', bg: '#d4f5ee', icon: 'Pill' },
  vitals: { label: 'Vitals', color: '#7c3aed', bg: '#ede9fe', icon: 'Activity' },
  therapy: { label: 'Therapy', color: '#0ea5e9', bg: '#e0f2fe', icon: 'Dumbbell' },
  appointment: { label: 'Appointment', color: '#fa3c11', bg: '#ffe2d4', icon: 'Stethoscope' },
  activity: { label: 'Activity', color: '#d97706', bg: '#fef3c7', icon: 'Music' },
  meal: { label: 'Meal', color: '#16a34a', bg: '#dcfce7', icon: 'Utensils' },
  social: { label: 'Social', color: '#db2777', bg: '#fce7f3', icon: 'Users' },
}

// ---------------------------------------------------------------------------
// Care workflows / protocols — multi-step task pipelines
// ---------------------------------------------------------------------------
export const workflows = [
  {
    id: 'w1',
    name: 'Daily Diabetes Management',
    residentId: 'r1',
    category: 'Chronic Care',
    frequency: 'Daily',
    progress: 75,
    assignedTo: 'c1',
    priority: 'high',
    dueToday: true,
    steps: [
      { id: 's1', label: 'Fasting glucose reading', done: true, time: '07:00' },
      { id: 's2', label: 'Administer Metformin (AM)', done: true, time: '08:00' },
      { id: 's3', label: 'Foot inspection for ulcers', done: true, time: '08:15' },
      { id: 's4', label: 'Post-lunch glucose reading', done: false, time: '13:00' },
      { id: 's5', label: 'Administer Metformin (PM)', done: false, time: '18:00' },
      { id: 's6', label: 'Log carbohydrate intake', done: false, time: '19:00' },
    ],
  },
  {
    id: 'w2',
    name: 'CHF Fluid Balance Protocol',
    residentId: 'r4',
    category: 'Cardiac Care',
    frequency: 'Daily',
    progress: 40,
    assignedTo: 'c1',
    priority: 'critical',
    dueToday: true,
    steps: [
      { id: 's1', label: 'Morning weight (same scale)', done: true, time: '07:00' },
      { id: 's2', label: 'Assess for edema (ankles/legs)', done: true, time: '07:15' },
      { id: 's3', label: 'Administer Furosemide', done: false, time: '08:00' },
      { id: 's4', label: 'Record fluid intake', done: false, time: 'Ongoing' },
      { id: 's5', label: 'Oxygen saturation check', done: false, time: '14:00' },
    ],
  },
  {
    id: 'w3',
    name: 'Memory Care Engagement',
    residentId: 'r2',
    category: 'Cognitive',
    frequency: 'Daily',
    progress: 60,
    assignedTo: 'c3',
    priority: 'medium',
    dueToday: true,
    steps: [
      { id: 's1', label: 'Morning orientation (date/place)', done: true, time: '08:00' },
      { id: 's2', label: 'Reminiscence activity', done: true, time: '09:30' },
      { id: 's3', label: 'Music therapy session', done: true, time: '10:00' },
      { id: 's4', label: 'Afternoon cognitive game', done: false, time: '15:00' },
      { id: 's5', label: 'Evening calming routine', done: false, time: '19:30' },
    ],
  },
  {
    id: 'w4',
    name: 'Fall Prevention — Mobility',
    residentId: 'r6',
    category: 'Safety',
    frequency: 'Daily',
    progress: 50,
    assignedTo: 'c5',
    priority: 'high',
    dueToday: true,
    steps: [
      { id: 's1', label: 'Clear pathways & remove hazards', done: true, time: '07:30' },
      { id: 's2', label: 'Balance & gait assessment', done: true, time: '09:00' },
      { id: 's3', label: 'Assisted ambulation practice', done: false, time: '11:00' },
      { id: 's4', label: 'Evening bathroom escort', done: false, time: '20:00' },
    ],
  },
  {
    id: 'w5',
    name: 'New Resident Onboarding',
    residentId: 'r3',
    category: 'Admissions',
    frequency: 'One-time',
    progress: 100,
    assignedTo: 'c4',
    priority: 'low',
    dueToday: false,
    steps: [
      { id: 's1', label: 'Welcome & room orientation', done: true, time: 'Day 1' },
      { id: 's2', label: 'Baseline health assessment', done: true, time: 'Day 1' },
      { id: 's3', label: 'Care plan development', done: true, time: 'Day 2' },
      { id: 's4', label: 'Family meeting & consent', done: true, time: 'Day 3' },
      { id: 's5', label: 'Medication reconciliation', done: true, time: 'Day 3' },
    ],
  },
  {
    id: 'w6',
    name: 'Weekly Wound Care',
    residentId: 'r5',
    category: 'Skilled Nursing',
    frequency: 'Weekly',
    progress: 0,
    assignedTo: 'c1',
    priority: 'medium',
    dueToday: false,
    steps: [
      { id: 's1', label: 'Remove & assess dressing', done: false, time: 'Mon 10:00' },
      { id: 's2', label: 'Clean & measure wound', done: false, time: 'Mon 10:15' },
      { id: 's3', label: 'Apply new dressing', done: false, time: 'Mon 10:30' },
      { id: 's4', label: 'Document healing progress', done: false, time: 'Mon 10:45' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Alerts & notifications
// ---------------------------------------------------------------------------
export const alerts = [
  { id: 'a1', severity: 'critical', residentId: 'r4', title: 'Elevated blood pressure', detail: 'BP 158/94 recorded at 08:05 — above care-plan threshold (150/90).', time: '12 min ago', category: 'vitals', acknowledged: false },
  { id: 'a2', severity: 'critical', residentId: 'r4', title: 'Albuterol inhaler low', detail: 'Only 1 rescue inhaler remaining. Reorder required.', time: '1 hr ago', category: 'medication', acknowledged: false },
  { id: 'a3', severity: 'warning', residentId: 'r2', title: 'Medication adherence dropping', detail: 'Apixaban adherence fell to 86% this week (anticoagulant — critical).', time: '2 hr ago', category: 'medication', acknowledged: false },
  { id: 'a4', severity: 'warning', residentId: 'r2', title: 'Donepezil refill due soon', detail: 'Refill needed by Jun 18 — 12 tablets remaining.', time: '3 hr ago', category: 'medication', acknowledged: false },
  { id: 'a5', severity: 'warning', residentId: 'r6', title: 'Missed medication window', detail: 'Levodopa midday dose not yet logged (due 13:00).', time: '20 min ago', category: 'medication', acknowledged: false },
  { id: 'a6', severity: 'info', residentId: 'r3', title: 'Appointment reminder', detail: 'Dental cleaning scheduled in 2 days.', time: '5 hr ago', category: 'appointment', acknowledged: true },
  { id: 'a7', severity: 'info', residentId: 'r1', title: 'Glucose trend improving', detail: '7-day average glucose down 11 mg/dL. Care plan on track.', time: 'Yesterday', category: 'vitals', acknowledged: true },
  { id: 'a8', severity: 'warning', residentId: 'r5', title: 'Methotrexate stock low', detail: '6 tablets remaining — weekly med, reorder advised.', time: 'Yesterday', category: 'medication', acknowledged: false },
]

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------
export const activityFeed = [
  { id: 'af1', residentId: 'r1', caregiverId: 'c1', action: 'administered morning medications', time: '08:02', type: 'medication' },
  { id: 'af2', residentId: 'r4', caregiverId: 'c1', action: 'recorded vitals — flagged elevated BP', time: '08:05', type: 'vitals' },
  { id: 'af3', residentId: 'r6', caregiverId: 'c5', action: 'started physical therapy session', time: '09:00', type: 'therapy' },
  { id: 'af4', residentId: 'r2', caregiverId: 'c3', action: 'completed reminiscence activity', time: '09:35', type: 'activity' },
  { id: 'af5', residentId: 'r3', caregiverId: 'c4', action: 'logged breakfast — full intake', time: '07:45', type: 'meal' },
  { id: 'af6', residentId: 'r5', caregiverId: 'c4', action: 'assisted with morning routine', time: '07:20', type: 'social' },
]

// ---------------------------------------------------------------------------
// Analytics aggregates
// ---------------------------------------------------------------------------
export const analytics = {
  censusTrend: [
    { month: 'Jan', occupancy: 84, capacity: 100 },
    { month: 'Feb', occupancy: 86, capacity: 100 },
    { month: 'Mar', occupancy: 88, capacity: 100 },
    { month: 'Apr', occupancy: 91, capacity: 100 },
    { month: 'May', occupancy: 93, capacity: 100 },
    { month: 'Jun', occupancy: 92, capacity: 100 },
  ],
  careLevelMix: [
    { name: 'Independent', value: 1, color: '#43bbac' },
    { name: 'Assisted', value: 3, color: '#1f9f93' },
    { name: 'Memory Care', value: 1, color: '#7c3aed' },
    { name: 'Skilled Nursing', value: 1, color: '#fa3c11' },
  ],
  incidentsByType: [
    { type: 'Falls', count: 3 },
    { type: 'Med errors', count: 1 },
    { type: 'Behavioral', count: 4 },
    { type: 'Skin/wounds', count: 2 },
    { type: 'Infections', count: 1 },
  ],
  adherenceTrend: [
    { week: 'W1', adherence: 91 },
    { week: 'W2', adherence: 93 },
    { week: 'W3', adherence: 90 },
    { week: 'W4', adherence: 94 },
    { week: 'W5', adherence: 95 },
    { week: 'W6', adherence: 93 },
  ],
  staffHours: [
    { day: 'Mon', direct: 142, admin: 38 },
    { day: 'Tue', direct: 138, admin: 41 },
    { day: 'Wed', direct: 150, admin: 36 },
    { day: 'Thu', direct: 145, admin: 39 },
    { day: 'Fri', direct: 148, admin: 42 },
    { day: 'Sat', direct: 120, admin: 28 },
    { day: 'Sun', direct: 118, admin: 26 },
  ],
  satisfaction: [
    { quarter: 'Q1', score: 4.4 },
    { quarter: 'Q2', score: 4.5 },
    { quarter: 'Q3', score: 4.6 },
    { quarter: 'Q4', score: 4.8 },
  ],
  wellbeingRadar: [
    { dimension: 'Mobility', value: 72 },
    { dimension: 'Nutrition', value: 88 },
    { dimension: 'Cognition', value: 65 },
    { dimension: 'Social', value: 81 },
    { dimension: 'Mood', value: 76 },
    { dimension: 'Sleep', value: 69 },
  ],
}

export const facility = {
  name: 'Serenity Care Residence',
  location: 'San Mateo, California',
  capacity: 100,
  occupied: 92,
  staffOnDuty: 14,
  established: 2009,
}
