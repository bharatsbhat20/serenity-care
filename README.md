# 🌿 Serenity Care — Elderly Care Management Platform

A polished, comprehensive, mobile-first platform for managing every aspect of elderly care:
residents, scheduling, medications, health monitoring, caregivers, care workflows, analytics, and alerts.

Built with **React + Vite + Tailwind CSS + Recharts**. Runs entirely on rich mock data out of the box,
with a single toggle to switch to a live database backend.

![Status](https://img.shields.io/badge/status-v1.0.0-1f9f93) ![React](https://img.shields.io/badge/React-18-43bbac) ![Vite](https://img.shields.io/badge/Vite-5-147f77)

---

## ✨ Features

| Module | What it does |
| --- | --- |
| **Dashboard** | At-a-glance overview: occupancy, adherence, alerts, today's schedule, vitals trend, due workflows, resident snapshots |
| **Care Recipients** | Searchable, filterable resident directory with rich profiles — conditions, allergies, diet, risk scoring, emergency contacts, tabbed detail view (Overview / Vitals / Medications / Schedule / Care Plan) |
| **Scheduler** | Full **day / week / month** calendar with a time-grid day view, overlap-aware event layout, a live "now" line, type filters, and an event detail sheet with status updates |
| **Medications** | Time-of-day dosing schedule, adherence tracking, low-stock reordering, critical-med flags, per-resident detail |
| **Health Monitoring** | Per-resident vitals (BP, HR, SpO₂, temp, glucose, sleep, activity) with 30-day trend charts and normal-range reference lines |
| **Caregivers** | Care-team roster with specialties, certifications, ratings, assignments, shift coverage, and staffing-hours analytics |
| **Care Workflows** | Interactive, checkable multi-step care protocols (diabetes, CHF fluid balance, memory care, fall prevention…) with live progress |
| **Analytics** | Occupancy trends, care-level mix, adherence, incidents, wellbeing radar, satisfaction, and staffing charts |
| **Alerts** | Prioritized, filterable alert center with one-tap resolve |
| **Settings** | The **Data Source** toggle, notifications, profile, and facility info |

- 📱 **Mobile-first** — desktop sidebar collapses to a bottom navigation bar; every page is fully responsive.
- 🎨 **Polished design system** — calming teal/coral healthcare palette, soft shadows, consistent components.

---

## 🔌 Mock data ↔ live database toggle

The whole app reads through a single data-source abstraction (`src/data/DataContext.jsx`).
A switch in **Settings → Data Source** (persisted to `localStorage`) flips between:

- **Mock Data** — the built-in demo dataset (`src/data/mockService.js` over `src/data/mockData.js`). No backend needed.
- **Live Database** — a REST backend (`src/data/apiService.js`) with identical method signatures.

### Connecting a real backend

1. Copy `.env.example` → `.env.local` and set:
   ```env
   VITE_API_BASE_URL=https://your-api.example.com
   VITE_API_KEY=optional-bearer-token
   ```
2. Implement REST endpoints matching `src/data/apiService.js` (e.g. `GET /residents`, `GET /residents/:id/vitals`, …).
3. Return JSON in the same shape as `src/data/mockData.js`.
4. Flip the toggle in Settings — **no other code changes required**.

---

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

---

## 🛠 Tech stack

- **React 18** + **React Router 6**
- **Vite 5** build tooling
- **Tailwind CSS 3** design system
- **Recharts** for data visualization
- **lucide-react** icons · **date-fns** date math · **framer-motion** ready

---

## 📦 Project structure

```
src/
├── data/                 # Data layer (the toggle lives here)
│   ├── mockData.js       # rich, self-consistent demo dataset
│   ├── mockService.js    # async service over mock data
│   ├── apiService.js     # drop-in REST backend (same interface)
│   └── DataContext.jsx   # provider + useData()/useAsync() hooks
├── components/           # Layout, navigation, shared UI primitives
├── pages/                # One file per module
└── lib/utils.js          # shared helpers
```

---

## ☁️ Deployment

Configured for **Vercel** (`vercel.json`, Vite framework preset, SPA rewrites).
Pushes to the default branch deploy automatically.

---

Built with care. 🤍
