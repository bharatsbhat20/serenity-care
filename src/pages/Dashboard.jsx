import { Link } from 'react-router-dom'
import {
  HeartHandshake, Pill, BellRing, CalendarClock, Activity, ArrowRight,
  ClipboardList, Sparkles, Users, MessageCircle, Phone, ListChecks,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar,
} from 'recharts'
import { useAsync } from '../data/DataContext.jsx'
import { Card, StatCard, SectionHeader, Avatar, Spinner, ProgressBar } from '../components/ui.jsx'
import { greeting, formatTime12, cn, statusStyles, severityStyles } from '../lib/utils.js'
import { eventTypeMeta } from '../data/mockData.js'

function todayStr() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function Dashboard() {
  const { data: household } = useAsync((s) => s.getFacility())
  const { data: residents } = useAsync((s) => s.getResidents())
  const { data: caregivers } = useAsync((s) => s.getCaregivers())
  const { data: events } = useAsync((s) => s.getScheduleEvents())
  const { data: alerts } = useAsync((s) => s.getAlerts())
  const { data: workflows } = useAsync((s) => s.getWorkflows())
  const { data: vitals } = useAsync((s) => s.getVitals('r1'))
  const { data: feed } = useAsync((s) => s.getActivityFeed())

  if (!household || !residents || !events || !alerts || !workflows || !caregivers) return <Spinner label="Loading your dashboard…" />

  const dad = residents[0]
  const today = new Date().toISOString().slice(0, 10)
  const todayEvents = events.filter((e) => e.date === today).sort((a, b) => a.start.localeCompare(b.start))
  const upcoming = todayEvents.filter((e) => e.status !== 'completed')
  const openAlerts = alerts.filter((a) => !a.acknowledged)
  const criticalCount = openAlerts.filter((a) => a.severity === 'critical').length
  const caregiverById = Object.fromEntries(caregivers.map((c) => [c.id, c]))
  const dueWorkflows = workflows.filter((w) => w.dueToday)
  const tasksComplete = dueWorkflows.length
    ? Math.round(dueWorkflows.reduce((a, w) => a + w.progress, 0) / dueWorkflows.length)
    : 0
  const nextAppt = events
    .filter((e) => e.type === 'appointment' && (e.date > today || (e.date === today && e.status !== 'completed')))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))[0]
  const s = statusStyles[dad.status]

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
            {greeting()}, Sarah
          </h1>
          <p className="text-brand-50/90 mt-1.5 max-w-xl text-sm sm:text-base">
            Here’s how Dad is doing today.{' '}
            {criticalCount > 0 ? (
              <span className="font-semibold text-white">{criticalCount} thing{criticalCount > 1 ? 's' : ''} need{criticalCount > 1 ? '' : 's'} your attention</span>
            ) : (
              <span>everything looks on track.</span>
            )}{' '}
            You’re not doing this alone — {household.careCircleSize} people are in his care circle.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link to="/scheduler" className="btn bg-white text-brand-700 px-4 py-2.5 hover:bg-brand-50 font-semibold">
              <CalendarClock size={17} /> Today’s schedule
            </Link>
            <Link to="/alerts" className="btn bg-white/15 text-white px-4 py-2.5 hover:bg-white/25 font-semibold backdrop-blur">
              <BellRing size={17} /> {openAlerts.length} reminders
            </Link>
            <a href={`tel:${dad.emergencyContacts[2]?.phone}`} className="btn bg-white/15 text-white px-4 py-2.5 hover:bg-white/25 font-semibold backdrop-blur">
              <Phone size={17} /> Call the doctor
            </a>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={BellRing} label="Open reminders" value={openAlerts.length} sub={`${criticalCount} need attention`} accent={criticalCount ? 'rose' : 'sky'} trend={{ dir: criticalCount ? 'down' : 'flat', value: criticalCount ? 'Review' : 'OK' }} />
        <StatCard icon={Pill} label="Med adherence" value={`${dad.adherence}%`} sub="this week" accent="emerald" trend={{ dir: 'up', value: '+2%' }} />
        <StatCard icon={ClipboardList} label="Care tasks today" value={`${tasksComplete}%`} sub={`${dueWorkflows.length} routines`} accent="violet" trend={{ dir: 'flat', value: 'Today' }} />
        <StatCard icon={Users} label="Care circle" value={household.careCircleSize} sub="people helping" accent="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's schedule */}
        <Card className="lg:col-span-2 p-5">
          <SectionHeader
            title="Dad’s day"
            subtitle={`${upcoming.length} coming up · ${todayEvents.length - upcoming.length} done`}
            icon={CalendarClock}
            action={<Link to="/scheduler" className="btn-ghost text-brand-600 text-sm">Full schedule <ArrowRight size={15} /></Link>}
          />
          <div className="space-y-2 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
            {todayEvents.map((e) => {
              const meta = eventTypeMeta[e.type]
              const who = caregiverById[e.caregiverId]
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
                    <p className={cn('font-semibold text-sm text-ink-800 truncate', done && 'line-through')}>{e.title}</p>
                    <p className="text-xs text-ink-400 truncate">{who?.isYou ? 'You' : who?.name} · {e.location}</p>
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

        {/* Reminders + tasks radial */}
        <div className="space-y-5">
          <Card className="p-5">
            <SectionHeader title="Needs your attention" icon={BellRing} />
            <div className="space-y-2">
              {openAlerts.slice(0, 4).map((a) => {
                const sv = severityStyles[a.severity]
                return (
                  <Link to="/alerts" key={a.id} className={cn('block rounded-xl border p-3 hover:shadow-soft transition-shadow', sv.chip)}>
                    <div className="flex items-start gap-2">
                      <span className={cn('mt-1 h-2 w-2 rounded-full shrink-0', sv.dot)} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{a.title}</p>
                        <p className="text-xs opacity-80 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {openAlerts.length === 0 && (
                <p className="text-sm text-ink-400 py-4 text-center">All caught up 🎉</p>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Today’s care tasks" icon={ListChecks} />
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: 'Tasks', value: tasksComplete, fill: '#1f9f93' }]} startAngle={90} endAngle={-270}>
                  <RadialBar background={{ fill: '#eceef2' }} dataKey="value" cornerRadius={20} />
                  <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="fill-ink-900 font-display font-extrabold" fontSize="28">
                    {tasksComplete}%
                  </text>
                  <text x="50%" y="64%" textAnchor="middle" className="fill-ink-400" fontSize="11">complete</text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Health trend + routines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader
            title="Dad’s health trend"
            subtitle="Blood sugar & blood pressure · last 14 days"
            icon={Activity}
            action={<Link to="/health" className="btn-ghost text-brand-600 text-sm">Health <ArrowRight size={15} /></Link>}
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
                  <Area type="monotone" dataKey="systolic" name="Blood pressure (top)" stroke="#fa3c11" strokeWidth={2.5} fill="url(#sys)" />
                  <Area type="monotone" dataKey="glucose" name="Blood sugar" stroke="#1f9f93" strokeWidth={2.5} fill="url(#glu)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <SectionHeader
            title="Routines due today"
            icon={ClipboardList}
            action={<Link to="/workflows" className="btn-ghost text-brand-600 text-sm">All <ArrowRight size={15} /></Link>}
          />
          <div className="space-y-3">
            {dueWorkflows.map((w) => {
              const who = caregiverById[w.assignedTo]
              return (
                <Link to="/workflows" key={w.id} className="block rounded-xl border border-ink-100 p-3 hover:bg-ink-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-ink-800 truncate">{w.name}</p>
                    <span className="text-xs font-bold text-brand-600">{w.progress}%</span>
                  </div>
                  <ProgressBar value={w.progress} barClass={w.progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'} />
                  <p className="text-xs text-ink-400 mt-1.5">{who?.isYou ? 'You' : who?.name} · {w.steps.filter((s) => s.done).length}/{w.steps.length} steps</p>
                </Link>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recent updates + care circle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Recent updates" subtitle="From everyone helping with Dad" icon={MessageCircle} />
          <div className="space-y-1">
            {(feed || []).map((f) => {
              const who = caregiverById[f.caregiverId]
              const meta = eventTypeMeta[f.type] || eventTypeMeta.social
              return (
                <div key={f.id} className="flex items-start gap-3 py-2.5 border-b border-ink-50 last:border-0">
                  <Avatar src={who?.photo} name={who?.name} size={36} ring />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-700">
                      <span className="font-semibold text-ink-900">{who?.isYou ? 'You' : who?.name}</span> {f.action}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">{f.time}</p>
                  </div>
                  <span className="chip shrink-0 hidden sm:inline-flex" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader
            title="Dad’s care circle"
            icon={Users}
            action={<Link to="/caregivers" className="btn-ghost text-brand-600 text-sm">View <ArrowRight size={15} /></Link>}
          />
          <Link to="/residents" className="flex items-center gap-3 rounded-2xl border border-ink-100 p-3 hover:border-brand-200 hover:shadow-soft transition-all mb-3">
            <Avatar src={dad.photo} name={dad.name} size={48} ring />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink-900 truncate">{dad.name}</p>
              <p className="text-xs text-ink-400">{dad.age} yrs · {dad.livingSituation}</p>
            </div>
            <span className={cn('chip', s.chip)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} /> {s.label}
            </span>
          </Link>
          <div className="space-y-2">
            {caregivers.filter((c) => !c.isYou).slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar src={c.photo} name={c.name} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800 truncate">{c.name}</p>
                  <p className="text-[11px] text-ink-400 truncate">{c.role}</p>
                </div>
                <a href={`tel:${c.phone}`} className="btn-ghost p-2 text-ink-400"><Phone size={15} /></a>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
