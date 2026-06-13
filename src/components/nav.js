import {
  LayoutDashboard,
  HeartHandshake,
  CalendarDays,
  Pill,
  HeartPulse,
  Users,
  ListChecks,
  BarChart3,
  BellRing,
  Settings,
} from 'lucide-react'

// Primary navigation. `primary` items also appear in the mobile bottom bar.
export const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard, primary: true },
  { to: '/residents', label: 'Dad', icon: HeartHandshake, primary: true },
  { to: '/scheduler', label: 'Schedule', icon: CalendarDays, primary: true },
  { to: '/medications', label: 'Medications', icon: Pill, primary: false },
  { to: '/health', label: 'Health', icon: HeartPulse, primary: false },
  { to: '/caregivers', label: 'Care Circle', icon: Users, primary: false },
  { to: '/workflows', label: 'Routines', icon: ListChecks, primary: true },
  { to: '/analytics', label: 'Insights', icon: BarChart3, primary: false },
  { to: '/alerts', label: 'Reminders', icon: BellRing, primary: false },
  { to: '/settings', label: 'Settings', icon: Settings, primary: false },
]
