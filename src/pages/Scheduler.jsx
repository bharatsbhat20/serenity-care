import { useState, useMemo } from 'react'
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, X, MapPin, User, Clock,
  Pill, Activity, Dumbbell, Stethoscope, Music, Utensils, Users, Check, Filter,
} from 'lucide-react'
import {
  format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay,
  startOfMonth, endOfMonth, isSameMonth, addMonths, isToday,
} from 'date-fns'
import { useAsync, useData } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner } from '../components/ui.jsx'
import { cn, formatTime12 } from '../lib/utils.js'
import { eventTypeMeta } from '../data/mockData.js'

const iconMap = { Pill, Activity, Dumbbell, Stethoscope, Music, Utensils, Users }
const VIEWS = ['Day', 'Week', 'Month']
const HOUR_START = 7
const HOUR_END = 21
const PX_PER_HOUR = 64

function toMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export default function Scheduler() {
  const [view, setView] = useState('Day')
  const [cursor, setCursor] = useState(new Date())
  const [selected, setSelected] = useState(null)
  const [activeTypes, setActiveTypes] = useState(Object.keys(eventTypeMeta))
  const { data: events } = useAsync((s) => s.getScheduleEvents())
  const { data: residents } = useAsync((s) => s.getResidents())
  const { data: caregivers } = useAsync((s) => s.getCaregivers())

  const residentById = useMemo(() => Object.fromEntries((residents || []).map((r) => [r.id, r])), [residents])
  const caregiverById = useMemo(() => Object.fromEntries((caregivers || []).map((c) => [c.id, c])), [caregivers])

  const filtered = useMemo(
    () => (events || []).filter((e) => activeTypes.includes(e.type)),
    [events, activeTypes]
  )

  if (!events || !residents) return <Spinner label="Loading scheduler…" />

  const toggleType = (t) =>
    setActiveTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))

  const move = (dir) => {
    if (view === 'Day') setCursor((c) => addDays(c, dir))
    else if (view === 'Week') setCursor((c) => addDays(c, dir * 7))
    else setCursor((c) => addMonths(c, dir))
  }

  const headerLabel =
    view === 'Day'
      ? format(cursor, 'EEEE, MMMM d, yyyy')
      : view === 'Week'
      ? `${format(startOfWeek(cursor), 'MMM d')} – ${format(endOfWeek(cursor), 'MMM d, yyyy')}`
      : format(cursor, 'MMMM yyyy')

  return (
    <div className="space-y-4 animate-fade-in">
      <SectionHeader
        title="Care Scheduler"
        subtitle="Medications, therapy, appointments & activities"
        icon={CalendarDays}
        action={<button className="btn-primary hidden sm:inline-flex"><Plus size={17} /> New event</button>}
      />

      {/* Toolbar */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={() => move(-1)} className="btn-ghost p-2"><ChevronLeft size={20} /></button>
            <button onClick={() => setCursor(new Date())} className="btn-outline px-3 py-2 text-sm">Today</button>
            <button onClick={() => move(1)} className="btn-ghost p-2"><ChevronRight size={20} /></button>
          </div>
          <h3 className="font-display font-bold text-ink-900 text-base sm:text-lg flex-1">{headerLabel}</h3>
          <div className="flex bg-ink-100 rounded-xl p-1">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn('btn px-4 py-1.5 text-sm', view === v ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500')}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          <Filter size={15} className="text-ink-400 shrink-0" />
          {Object.entries(eventTypeMeta).map(([key, meta]) => {
            const on = activeTypes.includes(key)
            return (
              <button
                key={key}
                onClick={() => toggleType(key)}
                className={cn('chip border whitespace-nowrap transition-all', on ? '' : 'opacity-40')}
                style={on ? { background: meta.bg, color: meta.color, borderColor: meta.color + '40' } : {}}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                {meta.label}
              </button>
            )
          })}
        </div>
      </Card>

      {view === 'Day' && <DayView date={cursor} events={filtered} residentById={residentById} onSelect={setSelected} />}
      {view === 'Week' && <WeekView cursor={cursor} events={filtered} residentById={residentById} onSelect={setSelected} />}
      {view === 'Month' && <MonthView cursor={cursor} events={filtered} onSelect={setSelected} onPickDay={(d) => { setCursor(d); setView('Day') }} />}

      {selected && (
        <EventModal
          event={selected}
          resident={residentById[selected.residentId]}
          caregiver={caregiverById[selected.caregiverId]}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

function EventChip({ event, onSelect, compact }) {
  const meta = eventTypeMeta[event.type]
  const Icon = iconMap[meta.icon] || Activity
  return (
    <button
      onClick={() => onSelect(event)}
      className={cn(
        'w-full text-left rounded-lg border px-2 py-1.5 overflow-hidden hover:shadow-soft transition-shadow',
        event.status === 'completed' && 'opacity-55'
      )}
      style={{ background: meta.bg, borderColor: meta.color + '33' }}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={compact ? 11 : 13} style={{ color: meta.color }} className="shrink-0" />
        <span className="text-[11px] font-bold truncate" style={{ color: meta.color }}>
          {formatTime12(event.start)}
        </span>
      </div>
      {!compact && <p className="text-xs font-medium text-ink-700 truncate mt-0.5">{event.title}</p>}
    </button>
  )
}

function DayView({ date, events, residentById, onSelect }) {
  const dayEvents = events
    .filter((e) => isSameDay(new Date(e.date), date))
    .sort((a, b) => a.start.localeCompare(b.start))
  const hours = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Time grid */}
      <Card className="lg:col-span-2 p-4 overflow-hidden">
        <div className="relative" style={{ height: (HOUR_END - HOUR_START) * PX_PER_HOUR + 20 }}>
          {hours.map((h, i) => (
            <div key={h} className="absolute left-0 right-0 flex items-start gap-2" style={{ top: i * PX_PER_HOUR }}>
              <span className="text-[11px] text-ink-400 font-medium w-14 shrink-0 -translate-y-2">{formatTime12(`${String(h).padStart(2, '0')}:00`)}</span>
              <div className="flex-1 border-t border-ink-100" />
            </div>
          ))}
          {/* now line */}
          {isToday(date) && <NowLine />}
          {/* events */}
          <div className="absolute left-16 right-0 top-0 bottom-0">
            {layoutDay(dayEvents).map(({ event, col, cols }) => {
              const top = ((toMinutes(event.start) - HOUR_START * 60) / 60) * PX_PER_HOUR
              const height = Math.max(34, ((toMinutes(event.end) - toMinutes(event.start)) / 60) * PX_PER_HOUR - 4)
              const meta = eventTypeMeta[event.type]
              const Icon = iconMap[meta.icon] || Activity
              const r = residentById[event.residentId]
              return (
                <button
                  key={event.id}
                  onClick={() => onSelect(event)}
                  className={cn('absolute rounded-xl border px-2.5 py-1.5 text-left overflow-hidden hover:shadow-soft hover:z-10 transition-all', event.status === 'completed' && 'opacity-60')}
                  style={{
                    top, height,
                    left: `${(col / cols) * 100}%`,
                    width: `calc(${(1 / cols) * 100}% - 6px)`,
                    background: meta.bg,
                    borderColor: meta.color + '44',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon size={13} style={{ color: meta.color }} className="shrink-0" />
                    <span className="text-[11px] font-bold truncate" style={{ color: meta.color }}>{event.title}</span>
                  </div>
                  <p className="text-[11px] text-ink-500 truncate mt-0.5">{formatTime12(event.start)} · {r?.preferredName}</p>
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Agenda list */}
      <Card className="p-4">
        <p className="font-display font-bold text-ink-900 mb-3">{dayEvents.length} events · {format(date, 'MMM d')}</p>
        <div className="space-y-2 max-h-[700px] overflow-y-auto no-scrollbar">
          {dayEvents.map((e) => {
            const meta = eventTypeMeta[e.type]
            const r = residentById[e.residentId]
            const Icon = iconMap[meta.icon] || Activity
            return (
              <button key={e.id} onClick={() => onSelect(e)} className="w-full flex items-center gap-3 rounded-xl border border-ink-100 p-2.5 text-left hover:bg-ink-50">
                <span className="grid place-items-center h-9 w-9 rounded-lg shrink-0" style={{ background: meta.bg, color: meta.color }}><Icon size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800 truncate">{e.title}</p>
                  <p className="text-xs text-ink-400 truncate">{formatTime12(e.start)} · {r?.preferredName}</p>
                </div>
                {e.status === 'completed' && <Check size={16} className="text-emerald-500 shrink-0" />}
                {e.status === 'in-progress' && <span className="chip bg-brand-100 text-brand-700 shrink-0">Now</span>}
              </button>
            )
          })}
          {dayEvents.length === 0 && <p className="text-sm text-ink-400 py-8 text-center">No events scheduled.</p>}
        </div>
      </Card>
    </div>
  )
}

function NowLine() {
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  if (now.getHours() < HOUR_START || now.getHours() > HOUR_END) return null
  const top = ((mins - HOUR_START * 60) / 60) * PX_PER_HOUR
  return (
    <div className="absolute left-14 right-0 z-20 flex items-center" style={{ top }}>
      <span className="h-2.5 w-2.5 rounded-full bg-accent-500 -ml-1" />
      <span className="flex-1 border-t-2 border-accent-500" />
    </div>
  )
}

// Simple overlap layout: assign columns to overlapping events.
function layoutDay(dayEvents) {
  const result = []
  const groups = []
  for (const e of dayEvents) {
    let placed = false
    for (const g of groups) {
      if (toMinutes(e.start) < g.end) {
        g.items.push(e)
        g.end = Math.max(g.end, toMinutes(e.end))
        placed = true
        break
      }
    }
    if (!placed) groups.push({ items: [e], end: toMinutes(e.end) })
  }
  for (const g of groups) {
    g.items.forEach((event, i) => result.push({ event, col: i, cols: g.items.length }))
  }
  return result
}

function WeekView({ cursor, events, residentById, onSelect }) {
  const days = eachDayOfInterval({ start: startOfWeek(cursor), end: endOfWeek(cursor) })
  return (
    <Card className="p-0 overflow-hidden">
      <div className="grid grid-cols-7 divide-x divide-ink-100 min-w-[700px] lg:min-w-0">
        {days.map((day) => {
          const dayEvents = events.filter((e) => isSameDay(new Date(e.date), day)).sort((a, b) => a.start.localeCompare(b.start))
          return (
            <div key={day.toISOString()} className={cn('min-h-[460px]', isToday(day) && 'bg-brand-50/30')}>
              <div className={cn('text-center py-2.5 border-b border-ink-100 sticky top-0 bg-white', isToday(day) && 'bg-brand-50')}>
                <div className="text-[11px] text-ink-400 uppercase font-semibold">{format(day, 'EEE')}</div>
                <div className={cn('text-lg font-display font-bold', isToday(day) ? 'text-brand-600' : 'text-ink-800')}>{format(day, 'd')}</div>
              </div>
              <div className="p-1.5 space-y-1.5">
                {dayEvents.map((e) => <EventChip key={e.id} event={e} onSelect={onSelect} />)}
                {dayEvents.length === 0 && <p className="text-[11px] text-ink-300 text-center py-3">—</p>}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function MonthView({ cursor, events, onSelect, onPickDay }) {
  const monthStart = startOfMonth(cursor)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(endOfMonth(cursor))
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  return (
    <Card className="p-0 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-ink-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center py-2 text-[11px] font-semibold text-ink-400 uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = events.filter((e) => isSameDay(new Date(e.date), day)).sort((a, b) => a.start.localeCompare(b.start))
          const inMonth = isSameMonth(day, cursor)
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-[96px] sm:min-h-[120px] border-b border-r border-ink-100 p-1.5 cursor-pointer hover:bg-ink-50 transition-colors',
                !inMonth && 'bg-ink-50/40'
              )}
              onClick={() => onPickDay(day)}
            >
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-xs font-semibold grid place-items-center h-6 w-6 rounded-full',
                  isToday(day) ? 'bg-brand-600 text-white' : inMonth ? 'text-ink-700' : 'text-ink-300'
                )}>
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && <span className="text-[10px] text-ink-400 font-medium">{dayEvents.length}</span>}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map((e) => {
                  const meta = eventTypeMeta[e.type]
                  return (
                    <button
                      key={e.id}
                      onClick={(ev) => { ev.stopPropagation(); onSelect(e) }}
                      className="w-full text-left rounded px-1.5 py-0.5 text-[10px] font-medium truncate"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      {formatTime12(e.start).replace(' ', '')} {e.title}
                    </button>
                  )
                })}
                {dayEvents.length > 3 && <p className="text-[10px] text-ink-400 px-1">+{dayEvents.length - 3} more</p>}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function EventModal({ event, resident, caregiver, onClose }) {
  const { service } = useData()
  const meta = eventTypeMeta[event.type]
  const Icon = iconMap[meta.icon] || Activity
  const [status, setStatus] = useState(event.status)

  const markComplete = async () => {
    setStatus('completed')
    try { await service.updateEventStatus(event.id, 'completed') } catch { /* mock noop */ }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <Card className="relative w-full sm:max-w-md rounded-b-none sm:rounded-3xl animate-fade-in max-h-[88vh] overflow-y-auto">
        <div className="p-5 border-b border-ink-100" style={{ background: meta.bg }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-white/70" style={{ color: meta.color }}><Icon size={22} /></span>
              <div>
                <span className="chip" style={{ background: 'white', color: meta.color }}>{meta.label}</span>
                <h3 className="font-display font-bold text-ink-900 text-lg mt-1">{event.title}</h3>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost p-2"><X size={20} /></button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <ModalRow icon={Clock} label="Time" value={`${formatTime12(event.start)} – ${formatTime12(event.end)} · ${format(new Date(event.date), 'EEE, MMM d')}`} />
          <ModalRow icon={MapPin} label="Location" value={event.location} />
          {resident && (
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-brand-50 text-brand-600"><User size={16} /></span>
              <div className="flex-1">
                <p className="text-xs text-ink-400">Resident</p>
                <p className="text-sm font-semibold text-ink-800">{resident.name} · {resident.room}</p>
              </div>
              <Avatar src={resident.photo} name={resident.name} size={36} />
            </div>
          )}
          {caregiver && (
            <div className="flex items-center gap-3">
              <Avatar src={caregiver.photo} name={caregiver.name} size={36} />
              <div className="flex-1">
                <p className="text-xs text-ink-400">Assigned caregiver</p>
                <p className="text-sm font-semibold text-ink-800">{caregiver.name}</p>
              </div>
            </div>
          )}
          {event.notes && (
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-xs text-ink-400 mb-1">Notes</p>
              <p className="text-sm text-ink-700">{event.notes}</p>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            {status === 'completed' ? (
              <div className="btn flex-1 bg-emerald-50 text-emerald-700 py-2.5"><Check size={17} /> Completed</div>
            ) : (
              <button onClick={markComplete} className="btn-primary flex-1"><Check size={17} /> Mark complete</button>
            )}
            <button onClick={onClose} className="btn-outline">Close</button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ModalRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid place-items-center h-9 w-9 rounded-lg bg-ink-50 text-ink-500"><Icon size={16} /></span>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-semibold text-ink-800">{value}</p>
      </div>
    </div>
  )
}
