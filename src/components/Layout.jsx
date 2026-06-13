import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Search, Database, FlaskConical, HeartHandshake, BellRing } from 'lucide-react'
import { navItems } from './nav.js'
import { useData, useAsync } from '../data/DataContext.jsx'
import { cn } from '../lib/utils.js'

function Brand({ compact }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid place-items-center h-9 w-9 rounded-xl bg-brand-600 text-white shadow-soft">
        <HeartHandshake size={20} />
      </span>
      {!compact && (
        <div className="leading-tight">
          <div className="font-display font-extrabold text-ink-900 text-[15px]">Serenity Care</div>
          <div className="text-[11px] text-ink-400 font-medium">Care Management</div>
        </div>
      )}
    </div>
  )
}

function SourceBadge() {
  const { useLiveDatabase } = useData()
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold border',
        useLiveDatabase
          ? 'bg-brand-50 text-brand-700 border-brand-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      )}
    >
      {useLiveDatabase ? <Database size={14} /> : <FlaskConical size={14} />}
      {useLiveDatabase ? 'Live Database' : 'Mock Data'}
    </div>
  )
}

function NavList({ onNavigate }) {
  return (
    <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-600 text-white shadow-soft'
                : 'text-ink-600 hover:bg-brand-50 hover:text-brand-700'
            )
          }
        >
          <item.icon size={19} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { service } = useData()
  const { data: alerts } = useAsync((s) => s.getAlerts(), [location.key])
  const unack = (alerts || []).filter((a) => !a.acknowledged).length

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-100 bg-white">
        <div className="p-5">
          <Brand />
        </div>
        <NavList />
        <div className="p-3 border-t border-ink-100">
          <SourceBadge />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col shadow-2xl animate-fade-in">
            <div className="p-5 flex items-center justify-between">
              <Brand />
              <button onClick={() => setMobileOpen(false)} className="btn-ghost p-2">
                <X size={20} />
              </button>
            </div>
            <NavList onNavigate={() => setMobileOpen(false)} />
            <div className="p-3 border-t border-ink-100">
              <SourceBadge />
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-ink-100">
          <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
            <button
              onClick={() => setMobileOpen(true)}
              className="btn-ghost p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="lg:hidden">
              <Brand compact />
            </div>

            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md ml-1">
              <div className="relative w-full">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  className="input pl-9"
                  placeholder="Search residents, meds, schedule…"
                  aria-label="Search"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <NavLink to="/alerts" className="relative btn-ghost p-2.5" aria-label="Alerts">
                <BellRing size={20} />
                {unack > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-accent-500 text-white text-[10px] font-bold animate-pulse-ring">
                    {unack}
                  </span>
                )}
              </NavLink>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2.5 pl-2">
                  <img
                    src="https://i.pravatar.cc/80?img=8"
                    alt="You"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div className="leading-tight pr-1">
                    <div className="text-sm font-semibold text-ink-800">Dr. Naomi Reyes</div>
                    <div className="text-[11px] text-ink-400">Care Director</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-5 pb-28 lg:pb-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileBottomNav unack={unack} />
      </div>
    </div>
  )
}

function MobileBottomNav({ unack }) {
  const items = navItems.filter((i) => i.primary).slice(0, 4)
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-ink-100 safe-bottom">
      <div className="grid grid-cols-5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-brand-600' : 'text-ink-400'
              )
            }
          >
            <item.icon size={22} />
            {item.label}
          </NavLink>
        ))}
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            cn(
              'relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
              isActive ? 'text-brand-600' : 'text-ink-400'
            )
          }
        >
          <span className="relative">
            <BellRing size={22} />
            {unack > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 grid place-items-center rounded-full bg-accent-500 text-white text-[9px] font-bold">
                {unack}
              </span>
            )}
          </span>
          Alerts
        </NavLink>
      </div>
    </nav>
  )
}
