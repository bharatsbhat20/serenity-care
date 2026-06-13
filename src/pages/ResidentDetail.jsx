import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Phone, Pill, HeartPulse, CalendarClock, ClipboardList, AlertTriangle,
  Droplet, Activity, Utensils, ShieldAlert, Stethoscope, User, ChevronRight, Footprints,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner, ProgressBar, Pill as PillTag } from '../components/ui.jsx'
import { cn, statusStyles, riskBand, formatTime12, severityStyles } from '../lib/utils.js'
import { eventTypeMeta } from '../data/mockData.js'

const tabs = ['Overview', 'Vitals', 'Medications', 'Schedule', 'Care Plan']

export default function ResidentDetail() {
  const { id } = useParams()
  const [tab, setTab] = useState('Overview')
  const { data: resident } = useAsync((s) => s.getResident(id), [id])
  const { data: meds } = useAsync((s) => s.getMedications(id), [id])
  const { data: vitals } = useAsync((s) => s.getVitals(id), [id])
  const { data: events } = useAsync((s) => s.getScheduleEvents(), [id])
  const { data: workflows } = useAsync((s) => s.getWorkflows(), [id])
  const { data: alerts } = useAsync((s) => s.getAlerts(), [id])

  if (!resident) return <Spinner label="Loading resident profile…" />

  const s = statusStyles[resident.status]
  const risk = riskBand(resident.riskScore)
  const latest = vitals?.[vitals.length - 1]
  const residentEvents = (events || []).filter((e) => e.residentId === id)
  const residentWorkflows = (workflows || []).filter((w) => w.residentId === id)
  const residentAlerts = (alerts || []).filter((a) => a.residentId === id)

  return (
    <div className="space-y-5 animate-fade-in">
      <Link to="/residents" className="btn-ghost text-ink-500 -ml-2"><ArrowLeft size={18} /> Back to overview</Link>

      {/* Header card */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <Avatar src={resident.photo} name={resident.name} size={96} ring className="mx-auto sm:mx-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display font-extrabold text-2xl text-ink-900">{resident.name}</h1>
              <span className={cn('chip', s.chip)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} /> {s.label}
              </span>
            </div>
            <p className="text-ink-500 mt-1">
              “{resident.preferredName}” · {resident.age} yrs · {resident.relationship} · {resident.livingSituation}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {resident.tags.map((t) => (
                <span key={t} className="chip bg-brand-50 text-brand-700">{t}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <MiniStat label="Living situation" value={resident.careSetting} />
              <MiniStat label="Mobility" value={resident.mobility} />
              <MiniStat label="Blood type" value={resident.bloodType} />
              <MiniStat label="Physician" value={resident.primaryPhysician} />
            </div>
          </div>
          <div className="sm:w-44 shrink-0 space-y-3">
            <div className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink-400">Risk score</span>
                <span className={cn('font-bold', risk.color)}>{risk.label}</span>
              </div>
              <ProgressBar value={resident.riskScore} barClass={risk.bar} />
              <div className="text-right text-xs text-ink-400 mt-1">{resident.riskScore}/100</div>
            </div>
            <div className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink-400">Med adherence</span>
                <span className="font-bold text-emerald-600">{resident.adherence}%</span>
              </div>
              <ProgressBar value={resident.adherence} barClass="bg-emerald-500" />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar bg-white rounded-2xl p-1 border border-ink-100 sticky top-16 z-20">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'btn px-4 py-2 whitespace-nowrap text-sm flex-1',
              tab === t ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-50'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Live vitals snapshot */}
            <Card className="p-5">
              <SectionHeader title="Latest vitals" icon={HeartPulse} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <VitalTile icon={Activity} label="Blood pressure" value={`${latest?.systolic}/${latest?.diastolic}`} unit="mmHg" accent="rose" />
                <VitalTile icon={HeartPulse} label="Heart rate" value={latest?.heartRate} unit="bpm" accent="violet" />
                <VitalTile icon={Droplet} label="SpO₂" value={latest?.spo2} unit="%" accent="sky" />
                {latest?.glucose ? (
                  <VitalTile icon={Droplet} label="Glucose" value={latest?.glucose} unit="mg/dL" accent="brand" />
                ) : (
                  <VitalTile icon={Footprints} label="Steps" value={latest?.steps} unit="today" accent="emerald" />
                )}
              </div>
            </Card>

            {/* Conditions, allergies, diet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoCard icon={Stethoscope} title="Conditions" items={resident.conditions} tone="brand" />
              <InfoCard icon={ShieldAlert} title="Allergies" items={resident.allergies.length ? resident.allergies : ['None known']} tone="rose" />
              <InfoCard icon={Utensils} title="Dietary needs" items={resident.dietaryNeeds} tone="amber" />
            </div>

            {residentAlerts.length > 0 && (
              <Card className="p-5">
                <SectionHeader title="Active alerts" icon={AlertTriangle} />
                <div className="space-y-2">
                  {residentAlerts.map((a) => {
                    const sv = severityStyles[a.severity]
                    return (
                      <div key={a.id} className={cn('rounded-xl border p-3', sv.chip)}>
                        <p className="text-sm font-semibold">{a.title}</p>
                        <p className="text-xs opacity-80 mt-0.5">{a.detail}</p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-5">
            <Card className="p-5">
              <SectionHeader title="Who to call" icon={Phone} />
              <div className="space-y-3">
                {resident.emergencyContacts.map((c) => (
                  <div key={c.phone} className="flex items-center gap-3">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-50 text-brand-600"><User size={18} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink-800">{c.name}</p>
                      <p className="text-xs text-ink-400">{c.relation}</p>
                    </div>
                    <a href={`tel:${c.phone}`} className="btn-outline px-3 py-2 text-xs"><Phone size={14} /> Call</a>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <SectionHeader title="Today’s plan" icon={CalendarClock} />
              <div className="space-y-2">
                {residentEvents.filter((e) => e.date === new Date().toISOString().slice(0, 10)).map((e) => {
                  const meta = eventTypeMeta[e.type]
                  return (
                    <div key={e.id} className="flex items-center gap-2 text-sm">
                      <span className="text-xs font-semibold text-ink-500 w-16">{formatTime12(e.start)}</span>
                      <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                      <span className="text-ink-700 truncate">{e.title}</span>
                    </div>
                  )
                })}
                {residentEvents.filter((e) => e.date === new Date().toISOString().slice(0, 10)).length === 0 && (
                  <p className="text-sm text-ink-400">No scheduled events today.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'Vitals' && vitals && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5">
            <SectionHeader title="Blood pressure" subtitle="Systolic / diastolic · 30 days" icon={Activity} />
            <ChartFrame>
              <AreaChart data={vitals}>
                <defs>
                  <linearGradient id="d-sys" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fa3c11" stopOpacity={0.2} /><stop offset="100%" stopColor="#fa3c11" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={5} />
                <YAxis tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} domain={[60, 160]} />
                <Tooltip />
                <Area type="monotone" dataKey="systolic" name="Systolic" stroke="#fa3c11" strokeWidth={2} fill="url(#d-sys)" />
                <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#147f77" strokeWidth={2} dot={false} />
              </AreaChart>
            </ChartFrame>
          </Card>
          <Card className="p-5">
            <SectionHeader title="Heart rate" subtitle="Beats per minute · 30 days" icon={HeartPulse} />
            <ChartFrame>
              <LineChart data={vitals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={5} />
                <YAxis tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} domain={[50, 110]} />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" name="Heart rate" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ChartFrame>
          </Card>
          {latest?.glucose && (
            <Card className="p-5">
              <SectionHeader title="Blood glucose" subtitle="mg/dL · 30 days" icon={Droplet} />
              <ChartFrame>
                <AreaChart data={vitals}>
                  <defs><linearGradient id="d-glu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f9f93" stopOpacity={0.2} /><stop offset="100%" stopColor="#1f9f93" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={5} />
                  <YAxis tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="glucose" name="Glucose" stroke="#1f9f93" strokeWidth={2} fill="url(#d-glu)" />
                </AreaChart>
              </ChartFrame>
            </Card>
          )}
          <Card className="p-5">
            <SectionHeader title="Weight & SpO₂" subtitle="30 days" icon={Droplet} />
            <ChartFrame>
              <LineChart data={vitals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} interval={5} />
                <YAxis yAxisId="l" tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="r" orientation="right" domain={[88, 100]} tick={{ fontSize: 10, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line yAxisId="l" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="spo2" name="SpO₂ (%)" stroke="#16a34a" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ChartFrame>
          </Card>
        </div>
      )}

      {tab === 'Medications' && meds && (
        <div className="space-y-3">
          {meds.map((m) => (
            <Card key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className={cn('grid place-items-center h-12 w-12 rounded-xl shrink-0', m.critical ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-600')}>
                <Pill size={22} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-ink-900">{m.name} <span className="text-ink-400 font-normal">{m.dose}</span></p>
                  {m.critical && <span className="chip bg-rose-50 text-rose-600">Critical</span>}
                </div>
                <p className="text-sm text-ink-400">{m.purpose} · {m.frequency} · {m.route}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xs text-ink-400">Times</div>
                  <div className="font-semibold text-ink-700">{m.times.length ? m.times.map(formatTime12).join(', ') : 'PRN'}</div>
                </div>
                <div className="text-center w-20">
                  <div className="text-xs text-ink-400">Adherence</div>
                  <div className="font-semibold text-emerald-600">{m.adherence}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-ink-400">Stock</div>
                  <div className={cn('font-semibold', m.stock <= 10 ? 'text-rose-600' : 'text-ink-700')}>{m.stock}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Schedule' && (
        <Card className="p-5">
          <SectionHeader title="Upcoming events" icon={CalendarClock} />
          <div className="space-y-2">
            {residentEvents.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)).map((e) => {
              const meta = eventTypeMeta[e.type]
              return (
                <div key={e.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                  <div className="text-center w-20 shrink-0">
                    <div className="text-xs text-ink-400">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="text-sm font-bold text-ink-800">{formatTime12(e.start)}</div>
                  </div>
                  <span className="h-9 w-1 rounded-full" style={{ background: meta.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-ink-800">{e.title}</p>
                    <p className="text-xs text-ink-400">{e.location}{e.notes ? ` · ${e.notes}` : ''}</p>
                  </div>
                  <span className="chip" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {tab === 'Care Plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-1 p-5">
            <SectionHeader title="Care plan summary" icon={ClipboardList} />
            <p className="text-sm text-ink-600 leading-relaxed">{resident.carePlan}</p>
            <div className="mt-4 pt-4 border-t border-ink-100 space-y-2 text-sm">
              <Row label="Caring since" value={new Date(resident.caringSince).toLocaleDateString('en-US', { dateStyle: 'medium' })} />
              <Row label="Living situation" value={resident.careSetting} />
              <Row label="Physician" value={resident.primaryPhysician} />
            </div>
          </Card>
          <div className="lg:col-span-2 space-y-4">
            {residentWorkflows.length ? residentWorkflows.map((w) => (
              <Card key={w.id} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-ink-900">{w.name}</p>
                    <p className="text-xs text-ink-400">{w.category} · {w.frequency}</p>
                  </div>
                  <span className="text-lg font-display font-bold text-brand-600">{w.progress}%</span>
                </div>
                <ProgressBar value={w.progress} />
                <div className="mt-3 space-y-1.5">
                  {w.steps.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 text-sm">
                      <span className={cn('h-4 w-4 rounded-full grid place-items-center text-[10px] shrink-0', st.done ? 'bg-emerald-500 text-white' : 'border border-ink-200')}>{st.done ? '✓' : ''}</span>
                      <span className={cn(st.done ? 'text-ink-400 line-through' : 'text-ink-700')}>{st.label}</span>
                      <span className="ml-auto text-xs text-ink-300">{st.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )) : <Card className="p-8 text-center text-ink-400">No active workflows for this resident.</Card>}
          </div>
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl bg-ink-50 px-3 py-2">
      <div className="text-[11px] text-ink-400">{label}</div>
      <div className="text-sm font-semibold text-ink-800 truncate">{value}</div>
    </div>
  )
}

function VitalTile({ icon: Icon, label, value, unit, accent }) {
  const accents = {
    rose: 'bg-rose-50 text-rose-600', violet: 'bg-violet-50 text-violet-600',
    sky: 'bg-sky-50 text-sky-600', brand: 'bg-brand-50 text-brand-600', emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className="rounded-xl border border-ink-100 p-3">
      <span className={cn('grid place-items-center h-8 w-8 rounded-lg', accents[accent])}><Icon size={16} /></span>
      <div className="text-xl font-display font-bold text-ink-900 mt-2">{value ?? '—'}</div>
      <div className="text-[11px] text-ink-400">{label} · {unit}</div>
    </div>
  )
}

function InfoCard({ icon: Icon, title, items, tone }) {
  const tones = { brand: 'text-brand-600 bg-brand-50', rose: 'text-rose-600 bg-rose-50', amber: 'text-amber-600 bg-amber-50' }
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={cn('grid place-items-center h-8 w-8 rounded-lg', tones[tone])}><Icon size={16} /></span>
        <p className="font-semibold text-sm text-ink-800">{title}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => <PillTag key={i}>{i}</PillTag>)}
      </div>
    </Card>
  )
}

function ChartFrame({ children }) {
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{label}</span>
      <span className="font-semibold text-ink-700">{value}</span>
    </div>
  )
}
