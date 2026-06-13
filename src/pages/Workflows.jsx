import { useState, useEffect, useMemo } from 'react'
import { ListChecks, Clock, CheckCircle2, Circle, Filter, ChevronDown } from 'lucide-react'
import { useAsync, useData } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner, StatCard, ProgressBar } from '../components/ui.jsx'
import { cn, priorityStyles } from '../lib/utils.js'

const categories = ['All', 'Daily routine', 'Health', 'Wellbeing', 'Safety', 'Appointments']

export default function Workflows() {
  const { service } = useData()
  const { data: initialWorkflows, loading } = useAsync((s) => s.getWorkflows())
  const { data: residents } = useAsync((s) => s.getResidents())
  const { data: caregivers } = useAsync((s) => s.getCaregivers())
  const [workflows, setWorkflows] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => { if (initialWorkflows) setWorkflows(initialWorkflows) }, [initialWorkflows])

  const residentById = useMemo(() => Object.fromEntries((residents || []).map((r) => [r.id, r])), [residents])
  const caregiverById = useMemo(() => Object.fromEntries((caregivers || []).map((c) => [c.id, c])), [caregivers])

  if (loading || !workflows || !residents) return <Spinner label="Loading care workflows…" />

  const toggleStep = async (wfId, stepId) => {
    // Optimistic update
    setWorkflows((cur) =>
      cur.map((w) => {
        if (w.id !== wfId) return w
        const steps = w.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s))
        const progress = Math.round((steps.filter((s) => s.done).length / steps.length) * 100)
        return { ...w, steps, progress }
      })
    )
    try { await service.toggleWorkflowStep(wfId, stepId) } catch { /* mock noop */ }
  }

  const filtered = filter === 'All' ? workflows : workflows.filter((w) => w.category === filter)
  const dueToday = workflows.filter((w) => w.dueToday).length
  const completed = workflows.filter((w) => w.progress === 100).length
  const avgProgress = Math.round(workflows.reduce((a, w) => a + w.progress, 0) / workflows.length)

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Dad’s Care Routines" subtitle="Simple checklists that keep his days steady" icon={ListChecks} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={ListChecks} label="Routines" value={workflows.length} accent="brand" />
        <StatCard icon={Clock} label="Due today" value={dueToday} accent="amber" />
        <StatCard icon={CheckCircle2} label="Completed" value={completed} accent="emerald" />
        <StatCard icon={ListChecks} label="Avg completion" value={`${avgProgress}%`} accent="violet" />
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Filter size={16} className="text-ink-400 shrink-0" />
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn('chip border whitespace-nowrap px-3 py-1.5', filter === c ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-600 border-ink-200 hover:border-brand-300')}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((w) => (
          <WorkflowCard
            key={w.id}
            workflow={w}
            resident={residentById[w.residentId]}
            caregiver={caregiverById[w.assignedTo]}
            onToggle={toggleStep}
          />
        ))}
      </div>
    </div>
  )
}

function WorkflowCard({ workflow: w, resident, caregiver, onToggle }) {
  const [open, setOpen] = useState(true)
  const doneCount = w.steps.filter((s) => s.done).length

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar src={resident?.photo} name={resident?.name} size={44} ring />
          <div className="min-w-0">
            <h3 className="font-display font-bold text-ink-900 truncate">{w.name}</h3>
            <p className="text-xs text-ink-400">{resident?.preferredName} · {w.category}</p>
          </div>
        </div>
        <span className={cn('chip capitalize shrink-0', priorityStyles[w.priority])}>{w.priority}</span>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1">
          <ProgressBar value={w.progress} barClass={w.progress === 100 ? 'bg-emerald-500' : w.priority === 'critical' ? 'bg-rose-500' : 'bg-brand-500'} />
        </div>
        <span className="text-sm font-bold text-ink-700 shrink-0">{doneCount}/{w.steps.length}</span>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost p-1">
          <ChevronDown size={18} className={cn('transition-transform', open && 'rotate-180')} />
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-1">
          {w.steps.map((s) => (
            <button
              key={s.id}
              onClick={() => onToggle(w.id, s.id)}
              className={cn('w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors', s.done ? 'bg-emerald-50/50' : 'hover:bg-ink-50')}
            >
              {s.done ? (
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              ) : (
                <Circle size={20} className="text-ink-300 shrink-0" />
              )}
              <span className={cn('text-sm flex-1', s.done ? 'text-ink-400 line-through' : 'text-ink-700')}>{s.label}</span>
              <span className="text-xs text-ink-300 shrink-0">{s.time}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100 text-xs text-ink-400">
        <span className="flex items-center gap-1.5">
          <Avatar src={caregiver?.photo} name={caregiver?.name} size={22} />
          {caregiver?.isYou ? 'You' : caregiver?.name}
        </span>
        <span className="flex items-center gap-1"><Clock size={12} /> {w.frequency}</span>
      </div>
    </Card>
  )
}
