import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, Search, Plus, MapPin, Pill, AlertTriangle, ArrowRight } from 'lucide-react'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner, ProgressBar } from '../components/ui.jsx'
import { cn, statusStyles, riskBand } from '../lib/utils.js'

const filters = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'attention', label: 'Attention' },
  { key: 'stable', label: 'Stable' },
]

export default function Residents() {
  const { data: residents } = useAsync((s) => s.getResidents())
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const list = useMemo(() => {
    if (!residents) return []
    return residents.filter((r) => {
      const matchesQuery =
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.conditions.join(' ').toLowerCase().includes(query.toLowerCase()) ||
        r.room.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'all' || r.status === filter
      return matchesQuery && matchesFilter
    })
  }, [residents, query, filter])

  if (!residents) return <Spinner label="Loading residents…" />

  const counts = {
    all: residents.length,
    critical: residents.filter((r) => r.status === 'critical').length,
    attention: residents.filter((r) => r.status === 'attention').length,
    stable: residents.filter((r) => r.status === 'stable').length,
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Care Recipients"
        subtitle={`${residents.length} residents under active care`}
        icon={Users}
        action={<button className="btn-primary hidden sm:inline-flex"><Plus size={17} /> Add resident</button>}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10"
            placeholder="Search by name, condition, or room…"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'btn px-3.5 py-2.5 whitespace-nowrap text-sm',
                filter === f.key ? 'bg-brand-600 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:border-brand-300'
              )}
            >
              {f.label}
              <span className={cn('ml-1 text-xs font-bold', filter === f.key ? 'text-brand-100' : 'text-ink-400')}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((r) => {
          const s = statusStyles[r.status]
          const risk = riskBand(r.riskScore)
          return (
            <Link
              to={`/residents/${r.id}`}
              key={r.id}
              className="card p-5 hover:shadow-soft hover:border-brand-200 transition-all group"
            >
              <div className="flex items-start gap-3">
                <Avatar src={r.photo} name={r.name} size={60} ring />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-ink-900 truncate">{r.name}</h3>
                  </div>
                  <p className="text-sm text-ink-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={13} /> {r.room} · {r.age} yrs · {r.careLevel}
                  </p>
                  <span className={cn('chip mt-2', s.chip)}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
                    {s.label}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {r.conditions.slice(0, 2).map((c) => (
                  <span key={c} className="chip bg-ink-100 text-ink-600">{c}</span>
                ))}
                {r.conditions.length > 2 && (
                  <span className="chip bg-ink-100 text-ink-500">+{r.conditions.length - 2}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink-400 flex items-center gap-1"><Pill size={12} /> Adherence</span>
                    <span className="font-semibold text-ink-700">{r.adherence}%</span>
                  </div>
                  <ProgressBar value={r.adherence} barClass="bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-ink-400 flex items-center gap-1"><AlertTriangle size={12} /> Risk</span>
                    <span className={cn('font-semibold', risk.color)}>{risk.label}</span>
                  </div>
                  <ProgressBar value={r.riskScore} barClass={risk.bar} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100">
                <span className="text-xs text-ink-400">Dr. {r.primaryPhysician.split(' ').slice(-1)}</span>
                <span className="text-sm font-semibold text-brand-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  View profile <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {list.length === 0 && (
        <Card className="p-10 text-center text-ink-400">No residents match your search.</Card>
      )}
    </div>
  )
}
