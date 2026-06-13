import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Pill,
  HeartPulse,
  UserCog,
  ListChecks,
  BarChart3,
  BellRing,
  Settings,
} from 'lucide-react'

// Primary navigation. `primary` items also appear in the mobile bottom bar.
export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, primary: true },
  { to: '/residents', label: 'Residents', icon: Users, primary: true },
  { to: '/scheduler', label: 'Scheduler', icon: CalendarDays, primary: true },
  { to: '/medications', label: 'Medications', icon: Pill, primary: false },
  { to: '/health', label: 'Health', icon: HeartPulse, primary: false },
  { to: '/caregivers', label: 'Caregivers', icon: UserCog, primary: false },
  { to: '/workflows', label: 'Workflows', icon: ListChecks, primary: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, primary: false },
  { to: '/alerts', label: 'Alerts', icon: BellRing, primary: false },
  { to: '/settings', label: 'Settings', icon: Settings, primary: false },
]
