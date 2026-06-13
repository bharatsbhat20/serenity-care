import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BellRing, Check, Pill, Activity, CalendarClock, ShieldAlert, Filter, CheckCheck } from 'lucide-react'
import { useAsync, useData } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner, StatCard } from '../components/ui.jsx'
import { cn, severityStyles } from '../lib/utils.js'

const categoryIcon = { medication: Pill, vitals: Activity, appointment: CalendarClock, default: ShieldAlert }
const filters = ['All', 'Critical', 'Warning', 'Info', 'Unresolved']

export default function Alerts() {
  const { service } = useData()
  const { data: initial } = useAsync((s) => s.getAlerts())
  const { data: residents } = useAsync((s) => s.getResidents())
  const [alerts, setAlerts] = useState(null)
  const [filter, setFilter] = useState('Unresolved')

  useEffect(() => { if (initial) setAlerts(initial) }, [initial])

  const residentById = useMemo(() => Object.fromEntries((residents || []).map((r) => [r.id, r])), [residents])

  if (!alerts || !residents) return <Spinner label="Loading alerts…" />

  const ack = async (id) => {
    setAlerts((cur) => cur.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
    try { await service.acknowledgeAlert(id) } catch { /* mock noop */ }
  }
  const ackAll = async () => {
    const open = alerts.filter((a) => !a.acknowledged)
    setAlerts((cur) => cur.map((a) => ({ ...a, acknowledged: true })))
    for (const a of open) { try { await service.acknowledgeAlert(a.id) } catch { /* noop */ } }
  }

  const filtered = alerts.filter((a) => {
    if (filter === 'All') return true
    if (filter === 'Unresolved') return !a.acknowledged
    return a.severity === filter.toLowerCase()
  })

  const openCount = alerts.filter((a) => !a.acknowledged).length
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Alerts & Notifications"
        subtitle={`${openCount} unresolved · ${criticalCount} critical`}
        icon={BellRing}
        action={openCount > 0 && <button onClick={ackAll} className="btn-outline hidden sm:inline-flex"><CheckCheck size={16} /> Resolve all</button>}
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={ShieldAlert} label="Critical" value={alerts.filter((a) => a.severity === 'critical').length} accent="rose" />
        <StatCard icon={BellRing} label="Warnings" value={alerts.filter((a) => a.severity === 'warning').length} accent="amber" />
        <StatCard icon={Check} label="Resolved" value={alerts.filter((a) => a.acknowledged).length} accent="emerald" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Filter size={16} className="text-ink-400 shrink-0" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn('chip border whitespace-nowrap px-3 py-1.5', filter === f ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-600 border-ink-200 hover:border-brand-300')}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map((a) => {
          const s = severityStyles[a.severity]
          const Icon = categoryIcon[a.category] || categoryIcon.default
          const r = residentById[a.residentId]
          return (
            <Card key={a.id} className={cn('p-4 border-l-4 transition-all', a.acknowledged && 'opacity-60')} style={{ borderLeftColor: a.severity === 'critical' ? '#f43f5e' : a.severity === 'warning' ? '#f59e0b' : '#0ea5e9' }}>
              <div className="flex items-start gap-3">
                <span className={cn('grid place-items-center h-11 w-11 rounded-xl shrink-0 ring-4', s.chip, s.ring)}><Icon size={20} /></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-ink-900">{a.title}</p>
                    <span className={cn('chip border capitalize', s.chip)}>{a.severity}</span>
                  </div>
                  <p className="text-sm text-ink-500 mt-1">{a.detail}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {r && (
                      <Link to={`/residents/${r.id}`} className="flex items-center gap-1.5 hover:underline">
                        <Avatar src={r.photo} name={r.name} size={20} />
                        <span className="text-xs font-medium text-ink-600">{r.name}</span>
                      </Link>
                    )}
                    <span className="text-xs text-ink-300">· {a.time}</span>
                  </div>
                </div>
                {a.acknowledged ? (
                  <span className="chip bg-emerald-50 text-emerald-600 shrink-0"><Check size={13} /> Resolved</span>
                ) : (
                  <button onClick={() => ack(a.id)} className="btn-primary px-3 py-2 text-sm shrink-0"><Check size={15} /> Resolve</button>
                )}
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <span className="grid place-items-center h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-500 mx-auto mb-3"><CheckCheck size={26} /></span>
            <p className="font-semibold text-ink-700">All clear</p>
            <p className="text-sm text-ink-400 mt-1">No alerts match this filter.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
