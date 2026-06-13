import { useState, useMemo } from 'react'
import { HeartPulse, Activity, Droplet, Thermometer, Moon, Footprints, TrendingUp, TrendingDown } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner } from '../components/ui.jsx'
import { cn } from '../lib/utils.js'

const metricDefs = [
  { key: 'systolic', label: 'Systolic BP', unit: 'mmHg', color: '#fa3c11', icon: Activity, normal: [90, 140] },
  { key: 'heartRate', label: 'Heart rate', unit: 'bpm', color: '#7c3aed', icon: HeartPulse, normal: [60, 100] },
  { key: 'spo2', label: 'Oxygen (SpO₂)', unit: '%', color: '#0ea5e9', icon: Droplet, normal: [95, 100] },
  { key: 'temperature', label: 'Temperature', unit: '°F', color: '#16a34a', icon: Thermometer, normal: [97, 99] },
  { key: 'sleepHours', label: 'Sleep', unit: 'hrs', color: '#6366f1', icon: Moon, normal: [6, 9] },
  { key: 'steps', label: 'Activity', unit: 'steps', color: '#d97706', icon: Footprints, normal: [1000, 8000] },
]

export default function HealthMonitoring() {
  const { data: residents } = useAsync((s) => s.getResidents())
  const [selectedId, setSelectedId] = useState('r1')
  const [metric, setMetric] = useState('systolic')
  const { data: vitals } = useAsync((s) => s.getVitals(selectedId), [selectedId])

  const resident = useMemo(() => (residents || []).find((r) => r.id === selectedId), [residents, selectedId])

  if (!residents) return <Spinner label="Loading health center…" />

  const def = metricDefs.find((m) => m.key === metric)
  const latest = vitals?.[vitals.length - 1]
  const prev = vitals?.[vitals.length - 8]

  const trendFor = (key) => {
    if (!vitals || vitals.length < 8) return null
    const cur = vitals[vitals.length - 1][key]
    const old = vitals[vitals.length - 8][key]
    if (cur == null || old == null) return null
    const diff = cur - old
    return { diff: +diff.toFixed(1), dir: diff >= 0 ? 'up' : 'down' }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Health Monitoring" subtitle="Real-time vitals tracking & trend analysis" icon={HeartPulse} />

      {/* Resident selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {residents.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            className={cn(
              'flex items-center gap-2 rounded-2xl border px-3 py-2 shrink-0 transition-all',
              selectedId === r.id ? 'border-brand-400 bg-brand-50 shadow-soft' : 'border-ink-200 bg-white hover:border-brand-200'
            )}
          >
            <Avatar src={r.photo} name={r.name} size={34} />
            <div className="text-left">
              <p className="text-sm font-semibold text-ink-800 whitespace-nowrap">{r.preferredName}</p>
              <p className="text-[11px] text-ink-400">{r.room}</p>
            </div>
          </button>
        ))}
      </div>

      {!vitals ? (
        <Spinner />
      ) : (
        <>
          {/* Metric tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {metricDefs.map((m) => {
              const val = m.key === 'systolic' ? `${latest.systolic}/${latest.diastolic}` : latest[m.key]
              const trend = trendFor(m.key)
              const Icon = m.icon
              const active = metric === m.key
              const isNull = val == null
              return (
                <button
                  key={m.key}
                  onClick={() => setMetric(m.key)}
                  className={cn(
                    'card p-3.5 text-left transition-all',
                    active ? 'ring-2 ring-brand-300 border-brand-200' : 'hover:border-brand-200',
                    isNull && 'opacity-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid place-items-center h-9 w-9 rounded-lg" style={{ background: m.color + '18', color: m.color }}><Icon size={17} /></span>
                    {trend && (
                      <span className={cn('text-[11px] font-semibold flex items-center gap-0.5', trend.dir === 'up' ? 'text-emerald-600' : 'text-rose-500')}>
                        {trend.dir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(trend.diff)}
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-display font-bold text-ink-900 mt-2">{isNull ? '—' : val}</div>
                  <div className="text-[11px] text-ink-400">{m.label} · {m.unit}</div>
                </button>
              )
            })}
          </div>

          {/* Main chart */}
          <Card className="p-5">
            <SectionHeader
              title={`${def.label} trend`}
              subtitle={`${resident?.name} · last 30 days · normal range ${def.normal[0]}–${def.normal[1]} ${def.unit}`}
              icon={def.icon}
            />
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {metric === 'steps' ? (
                  <BarChart data={vitals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="steps" name="Steps" fill={def.color} radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={vitals}>
                    <defs>
                      <linearGradient id="metric-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={def.color} stopOpacity={0.22} />
                        <stop offset="100%" stopColor={def.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip />
                    <ReferenceLine y={def.normal[0]} stroke="#aeb7c8" strokeDasharray="4 4" />
                    <ReferenceLine y={def.normal[1]} stroke="#aeb7c8" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey={metric} name={def.label} stroke={def.color} strokeWidth={2.5} fill="url(#metric-grad)" />
                    {metric === 'systolic' && <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#147f77" strokeWidth={2} dot={false} />}
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Secondary: weekly summary + sleep */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-5">
              <SectionHeader title="Sleep pattern" subtitle="Hours per night" icon={Moon} />
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vitals.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={1} />
                    <YAxis tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <ReferenceLine y={7} stroke="#16a34a" strokeDasharray="4 4" />
                    <Bar dataKey="sleepHours" name="Sleep (hrs)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <SectionHeader title="Heart rate variability" subtitle="bpm · 30 days" icon={HeartPulse} />
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={5} />
                    <YAxis tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} domain={[50, 110]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="heartRate" name="Heart rate" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
