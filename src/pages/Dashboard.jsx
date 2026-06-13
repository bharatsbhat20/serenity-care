import { Link } from 'react-router-dom'
import {
  Users, HeartPulse, Pill, BellRing, CalendarClock, TrendingUp, Activity,
  ArrowRight, ShieldCheck, ClipboardList, Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
} from 'recharts'
import { useAsync } from '../data/DataContext.jsx'
import { Card, StatCard, SectionHeader, Avatar, Spinner, ProgressBar } from '../components/ui.jsx'
import { greeting, formatTime12, cn, statusStyles, severityStyles } from '../lib/utils.js'
import { eventTypeMeta } from '../data/mockData.js'

function todayStr() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Dashboard() {
  const { data: facility } = useAsync((s) => s.getFacility())
  const { data: residents } = useAsync((s) => s.getResidents())
  const { data: caregivers } = useAsync((s) => s.getCaregivers())
  const { data: events } = useAsync((s) => s.getScheduleEvents())
  const { data: alerts } = useAsync((s) => s.getAlerts())
  const { data: workflows } = useAsync((s) => s.getWorkflows())
  const { data: vitals } = useAsync((s) => s.getVitals('r1'))
  const { data: analytics } = useAsync((s) => s.getAnalytics())

  if (!facility || !residents || !events || !alerts || !workflows) return <Spinner label="Loading care dashboard…" />

  const today = new Date().toISOString().slice(0, 10)
  const todayEvents = events.filter((e) => e.date === today).sort((a, b) => a.start.localeCompare(b.start))
  const upcoming = todayEvents.filter((e) => e.status !== 'completed')
  const openAlerts = alerts.filter((a) => !a.acknowledged)
  const criticalCount = openAlerts.filter((a) => a.severity === 'critical').length
  const residentById = Object.fromEntries(residents.map((r) => [r.id, r]))
  const dueWorkflows = workflows.filter((w) => w.dueToday)
  const avgAdherence = Math.round(residents.reduce((a, r) => a + r.adherence, 0) / residents.length)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white p-6 sm:p-8 shadow-soft">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-brand-100 text-sm font-medium flex items-center gap-2">
            <Sparkles size={15} /> {todayStr()}
          </p>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl mt-1">
            {greeting()}, Dr. Reyes
          </h1>
          <p className="text-brand-50/90 mt-1.5 max-w-xl text-sm sm:text-base">
            {facility.occupied} residents in your care · {facility.staffOnDuty} staff on duty ·{' '}
            {criticalCount > 0 ? (
              <span className="font-semibold text-white">{criticalCount} critical alert{criticalCount > 1 ? 's' : ''} need attention</span>
            ) : (
              <span>all residents stable</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/scheduler" className="btn bg-white text-brand-700 px-4 py-2.5 hover:bg-brand-50 font-semibold">
              <CalendarClock size={17} /> View schedule
            </Link>
            <Link to="/alerts" className="btn bg-white/15 text-white px-4 py-2.5 hover:bg-white/25 font-semibold backdrop-blur">
              <BellRing size={17} /> {openAlerts.length} open alerts
            </Link>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label="Residents" value={facility.occupied} sub={`of ${facility.capacity} capacity`} accent="brand" trend={{ dir: 'up', value: `${Math.round((facility.occupied / facility.capacity) * 100)}%` }} />
        <StatCard icon={Pill} label="Med adherence" value={`${avgAdherence}%`} sub="across all residents" accent="emerald" trend={{ dir: 'up', value: '+2%' }} />
        <StatCard icon={BellRing} label="Open alerts" value={openAlerts.length} sub={`${criticalCount} critical`} accent={criticalCount ? 'rose' : 'sky'} trend={{ dir: criticalCount ? 'down' : 'flat', value: criticalCount ? 'Action' : 'OK' }} />
        <StatCard icon={ClipboardList} label="Care tasks due" value={dueWorkflows.length} sub="active workflows today" accent="violet" trend={{ dir: 'flat', value: 'Today' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's schedule */}
        <Card className="lg:col-span-2 p-5">
          <SectionHeader
            title="Today’s schedule"
            subtitle={`${upcoming.length} upcoming · ${todayEvents.length - upcoming.length} completed`}
            icon={CalendarClock}
            action={<Link to="/scheduler" className="btn-ghost text-brand-600 text-sm">View all <ArrowRight size={15} /></Link>}
          />
          <div className="space-y-2 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
            {todayEvents.slice(0, 8).map((e) => {
              const meta = eventTypeMeta[e.type]
              const r = residentById[e.residentId]
              const done = e.status === 'completed'
              return (
                <div
                  key={e.id}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                    e.status === 'in-progress' ? 'border-brand-200 bg-brand-50/50' : 'border-ink-100 hover:bg-ink-50',
                    done && 'opacity-60'
                  )}
                >
                  <div className="text-center w-14 shrink-0">
                    <div className="text-sm font-bold text-ink-800">{formatTime12(e.start).split(' ')[0]}</div>
                    <div className="text-[10px] text-ink-400 font-medium">{formatTime12(e.start).split(' ')[1]}</div>
                  </div>
                  <span className="h-9 w-1 rounded-full shrink-0" style={{ background: meta.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn('font-semibold text-sm text-ink-800 truncate', done && 'line-through')}>{e.title}</p>
                    </div>
                    <p className="text-xs text-ink-400 truncate">{r?.name} · {e.location}</p>
                  </div>
                  <span className="chip shrink-0" style={{ background: meta.bg, color: meta.color }}>
                    {meta.label}
                  </span>
                  {e.status === 'in-progress' && (
                    <span className="chip bg-brand-100 text-brand-700 shrink-0 hidden sm:inline-flex">Now</span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Critical alerts + wellbeing */}
        <div className="space-y-5">
          <Card className="p-5">
            <SectionHeader title="Priority alerts" icon={BellRing} />
            <div className="space-y-2">
              {openAlerts.slice(0, 4).map((a) => {
                const s = severityStyles[a.severity]
                const r = residentById[a.residentId]
                return (
                  <Link to="/alerts" key={a.id} className={cn('block rounded-xl border p-3 hover:shadow-soft transition-shadow', s.chip)}>
                    <div className="flex items-start gap-2">
                      <span className={cn('mt-1 h-2 w-2 rounded-full shrink-0', s.dot)} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{a.title}</p>
                        <p className="text-xs opacity-80 mt-0.5">{r?.preferredName} · {a.time}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {openAlerts.length === 0 && (
                <p className="text-sm text-ink-400 py-4 text-center">No open alerts 🎉</p>
              )}
            </div>
          </Card>

          {analytics && (
            <Card className="p-5">
              <SectionHeader title="Facility occupancy" icon={TrendingUp} />
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: 'Occupancy', value: Math.round((facility.occupied / facility.capacity) * 100), fill: '#1f9f93' }]} startAngle={90} endAngle={-270}>
                    <RadialBar background={{ fill: '#eceef2' }} dataKey="value" cornerRadius={20} />
                    <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-ink-900 font-display font-extrabold" fontSize="28">
                      {Math.round((facility.occupied / facility.capacity) * 100)}%
                    </text>
                    <text x="50%" y="64%" textAnchor="middle" className="fill-ink-400" fontSize="11">occupied</text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Health trend + workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader
            title="Vitals trend — featured resident"
            subtitle="Eleanor Whitfield · last 14 days"
            icon={Activity}
            action={<Link to="/health" className="btn-ghost text-brand-600 text-sm">Health center <ArrowRight size={15} /></Link>}
          />
          {vitals && (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vitals.slice(-14)} margin={{ left: -18, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="sys" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fa3c11" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#fa3c11" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="glu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1f9f93" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#1f9f93" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="systolic" name="Systolic BP" stroke="#fa3c11" strokeWidth={2.5} fill="url(#sys)" />
                  <Area type="monotone" dataKey="glucose" name="Glucose" stroke="#1f9f93" strokeWidth={2.5} fill="url(#glu)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <SectionHeader
            title="Care workflows due"
            icon={ClipboardList}
            action={<Link to="/workflows" className="btn-ghost text-brand-600 text-sm">All <ArrowRight size={15} /></Link>}
          />
          <div className="space-y-3">
            {dueWorkflows.map((w) => {
              const r = residentById[w.residentId]
              return (
                <Link to="/workflows" key={w.id} className="block rounded-xl border border-ink-100 p-3 hover:bg-ink-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-ink-800 truncate">{w.name}</p>
                    <span className="text-xs font-bold text-brand-600">{w.progress}%</span>
                  </div>
                  <ProgressBar value={w.progress} barClass={w.priority === 'critical' ? 'bg-rose-500' : 'bg-brand-500'} />
                  <p className="text-xs text-ink-400 mt-1.5">{r?.preferredName} · {w.steps.filter((s) => s.done).length}/{w.steps.length} steps</p>
                </Link>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Resident snapshot row */}
      <Card className="p-5">
        <SectionHeader
          title="Residents at a glance"
          icon={ShieldCheck}
          action={<Link to="/residents" className="btn-ghost text-brand-600 text-sm">All residents <ArrowRight size={15} /></Link>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {residents.map((r) => {
            const s = statusStyles[r.status]
            return (
              <Link to={`/residents/${r.id}`} key={r.id} className="rounded-2xl border border-ink-100 p-3 hover:shadow-soft hover:border-brand-200 transition-all text-center">
                <Avatar src={r.photo} name={r.name} size={56} className="mx-auto" ring />
                <p className="font-semibold text-sm text-ink-800 mt-2 truncate">{r.preferredName}</p>
                <p className="text-[11px] text-ink-400 truncate">{r.room} · {r.age}y</p>
                <span className={cn('chip mt-2 mx-auto', s.chip)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
                  {s.label}
                </span>
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
