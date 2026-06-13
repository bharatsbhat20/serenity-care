import { Link } from 'react-router-dom'
import {
  HeartHandshake, MapPin, Pill, AlertTriangle, ArrowRight, Phone, HeartPulse,
  CalendarClock, ListChecks, Stethoscope, ShieldAlert, Utensils, ClipboardList,
} from 'lucide-react'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner, ProgressBar, Pill as PillTag } from '../components/ui.jsx'
import { cn, statusStyles, riskBand } from '../lib/utils.js'

export default function Residents() {
  const { data: residents } = useAsync((s) => s.getResidents())
  const { data: vitals } = useAsync((s) => s.getVitals('r1'))
  const { data: events } = useAsync((s) => s.getScheduleEvents())

  if (!residents) return <Spinner label="Loading…" />

  const dad = residents[0]
  const s = statusStyles[dad.status]
  const risk = riskBand(dad.riskScore)
  const latest = vitals?.[vitals.length - 1]
  const today = new Date().toISOString().slice(0, 10)
  const todayCount = (events || []).filter((e) => e.date === today).length

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Dad" subtitle="Robert Bennett · your care overview" icon={HeartHandshake} />

      {/* Hero profile */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <Avatar src={dad.photo} name={dad.name} size={104} ring className="mx-auto sm:mx-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display font-extrabold text-2xl text-ink-900">{dad.name}</h1>
              <span className={cn('chip', s.chip)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} /> {s.label}
              </span>
            </div>
            <p className="text-ink-500 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>“{dad.preferredName}” · {dad.age} yrs · {dad.relationship}</span>
            </p>
            <p className="text-sm text-ink-400 flex items-center gap-1 mt-1"><MapPin size={14} /> {dad.address}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {dad.tags.map((t) => <span key={t} className="chip bg-brand-50 text-brand-700">{t}</span>)}
            </div>
          </div>
          <div className="sm:w-48 shrink-0 space-y-3">
            <div className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink-400 flex items-center gap-1"><Pill size={12} /> Med adherence</span>
                <span className="font-bold text-emerald-600">{dad.adherence}%</span>
              </div>
              <ProgressBar value={dad.adherence} barClass="bg-emerald-500" />
            </div>
            <div className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink-400 flex items-center gap-1"><AlertTriangle size={12} /> Fall / health risk</span>
                <span className={cn('font-bold', risk.color)}>{risk.label}</span>
              </div>
              <ProgressBar value={dad.riskScore} barClass={risk.bar} />
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <QuickLink to="/health" icon={HeartPulse} label="Health" accent="violet" />
          <QuickLink to="/medications" icon={Pill} label="Medications" accent="brand" />
          <QuickLink to="/scheduler" icon={CalendarClock} label={`Schedule · ${todayCount}`} accent="sky" />
          <QuickLink to="/workflows" icon={ListChecks} label="Routines" accent="amber" />
        </div>
      </Card>

      {/* Latest vitals */}
      {latest && (
        <Card className="p-5">
          <SectionHeader title="How he’s doing right now" icon={HeartPulse} action={<Link to="/health" className="btn-ghost text-brand-600 text-sm">Trends <ArrowRight size={15} /></Link>} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <VitalTile label="Blood pressure" value={`${latest.systolic}/${latest.diastolic}`} unit="mmHg" accent="rose" />
            <VitalTile label="Blood sugar" value={latest.glucose} unit="mg/dL" accent="brand" />
            <VitalTile label="Heart rate" value={latest.heartRate} unit="bpm" accent="violet" />
            <VitalTile label="Sleep" value={latest.sleepHours} unit="hrs last night" accent="sky" />
          </div>
        </Card>
      )}

      {/* Health info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard icon={Stethoscope} title="Conditions" items={dad.conditions} tone="brand" />
        <InfoCard icon={ShieldAlert} title="Allergies" items={dad.allergies.length ? dad.allergies : ['None known']} tone="rose" />
        <InfoCard icon={Utensils} title="Diet" items={dad.dietaryNeeds} tone="amber" />
      </div>

      {/* Care plan + who to call */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Care plan" icon={ClipboardList} action={<Link to={`/residents/${dad.id}`} className="btn-ghost text-brand-600 text-sm">Full record <ArrowRight size={15} /></Link>} />
          <p className="text-sm text-ink-600 leading-relaxed">{dad.carePlan}</p>
          <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-2 gap-3 text-sm">
            <Row label="Doctor" value={dad.primaryPhysician} />
            <Row label="Living situation" value={dad.livingSituation} />
            <Row label="Mobility" value={dad.mobility} />
            <Row label="Blood type" value={dad.bloodType} />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Who to call" icon={Phone} />
          <div className="space-y-3">
            {dad.emergencyContacts.map((c) => (
              <div key={c.phone} className="flex items-center gap-3">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-50 text-brand-600 font-semibold text-sm">{c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800 truncate">{c.name}</p>
                  <p className="text-xs text-ink-400">{c.relation}</p>
                </div>
                <a href={`tel:${c.phone}`} className="btn-outline px-3 py-2 text-xs"><Phone size={14} /> Call</a>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function QuickLink({ to, icon: Icon, label, accent }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600', violet: 'bg-violet-50 text-violet-600',
    sky: 'bg-sky-50 text-sky-600', amber: 'bg-amber-50 text-amber-600',
  }
  return (
    <Link to={to} className="flex flex-col items-center gap-2 rounded-2xl border border-ink-100 p-3 hover:border-brand-200 hover:shadow-soft transition-all">
      <span className={cn('grid place-items-center h-10 w-10 rounded-xl', accents[accent])}><Icon size={20} /></span>
      <span className="text-xs font-semibold text-ink-700 text-center">{label}</span>
    </Link>
  )
}

function VitalTile({ label, value, unit, accent }) {
  const accents = {
    rose: 'text-rose-600', violet: 'text-violet-600', sky: 'text-sky-600', brand: 'text-brand-600',
  }
  return (
    <div className="rounded-xl border border-ink-100 p-3.5">
      <div className={cn('text-2xl font-display font-bold', accents[accent])}>{value ?? '—'}</div>
      <div className="text-[11px] text-ink-400 mt-0.5">{label}</div>
      <div className="text-[11px] text-ink-300">{unit}</div>
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

function Row({ label, value }) {
  return (
    <div>
      <div className="text-ink-400 text-xs">{label}</div>
      <div className="font-semibold text-ink-700">{value}</div>
    </div>
  )
}
