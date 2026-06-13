# 🌿 Serenity Care — Family Caregiver Companion

A warm, practical platform for the **family caregiver** — the adult son or daughter coordinating care for an
aging parent at home. Keep on top of the schedule, medications, health, the people helping out, daily routines,
and gentle insights — all in one calm, mobile-first place.

> You play **Sarah Bennett**, coordinating care for your dad, **Robert**, who's aging in place at home — supported
> by a care circle of family, a paid home aide, his doctor, a visiting physical therapist, and a neighbor.

Built with **React + Vite + Tailwind CSS + Recharts**. Runs entirely on rich mock data out of the box,
with a single toggle to switch to a live database backend.

![Status](https://img.shields.io/badge/version-3.0.1-1f9f93) ![React](https://img.shields.io/badge/React-18-43bbac) ![Vite](https://img.shields.io/badge/Vite-5-147f77)

---

## ✨ Features

| Section | What it does |
| --- | --- |
| **Home** | Personal overview: how Dad is doing today, what needs your attention, his day's schedule, health trend, routines due, recent updates from everyone helping, and the care circle |
| **Dad** | A single, rich profile — status, latest vitals, conditions, allergies, diet, care plan, who to call, and quick links into every section |
| **Schedule** | Full **day / week / month** calendar — meds, doctor visits, therapy, meals, family visits, errands, and social time — with a time-grid day view, a live "now" line, type filters, and an event detail sheet |
| **Medications** | Time-of-day dosing schedule, adherence tracking, low-stock refill nudges, and must-not-miss flags |
| **Health** | Dad's vitals (blood sugar, blood pressure, heart rate, SpO₂, sleep, activity, mood) with 30-day trends and healthy-range guides |
| **Care Circle** | Everyone helping — you, your brother, the paid aide, the doctor, the PT, a neighbor — with what each helps with, availability, and a view of how care is shared (so no one burns out) |
| **Routines** | Friendly, checkable daily/weekly checklists (morning routine, diabetes daily care, evening wind-down, home safety, doctor-visit prep) with live progress |
| **Insights** | Overall wellbeing trend, who's helping, medication adherence, health events, mood over time, and a wellbeing balance radar |
| **Reminders** | A gentle, prioritized list of what to follow up on — one tap to mark done |
| **Settings** | The **Data Source** toggle, notifications, your profile, and care details |

- 📱 **Mobile-first** — desktop sidebar collapses to a bottom navigation bar; every screen is fully responsive.
- 🤍 **Warm, non-clinical tone** — designed for a worried family member, not a hospital.

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
2. Implement REST endpoints matching `src/data/apiService.js`.
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
- **lucide-react** icons · **date-fns** date math

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
├── pages/                # One file per section
└── lib/utils.js          # shared helpers
```

---

## ☁️ Deployment

Configured for **Vercel** (`vercel.json`, Vite framework preset, SPA rewrites).
Pushes to the default branch deploy automatically.

---

## 🕘 Versions

- **v3.0.1** — Family Caregiver edition. Reframed the entire experience around an adult child caring for one parent at home.
- **v1.0.0** — Original professional facility / care-director edition.

---

Built with care. 🤍
