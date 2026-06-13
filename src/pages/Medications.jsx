import { useState, useMemo } from 'react'
import { Pill, Search, AlertTriangle, Clock, Package, CheckCircle2, RefreshCw, Sun, Moon, Sunrise } from 'lucide-react'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner, ProgressBar, StatCard } from '../components/ui.jsx'
import { cn, formatTime12 } from '../lib/utils.js'

const tabs = ['Today’s schedule', 'All medications']

export default function Medications() {
  const { data: meds } = useAsync((s) => s.getMedications())
  const { data: residents } = useAsync((s) => s.getResidents())
  const [tab, setTab] = useState('Today’s schedule')
  const [query, setQuery] = useState('')

  const residentById = useMemo(() => Object.fromEntries((residents || []).map((r) => [r.id, r])), [residents])

  if (!meds || !residents) return <Spinner label="Loading medications…" />

  const lowStock = meds.filter((m) => m.stock <= 10)
  const critical = meds.filter((m) => m.critical)
  const avgAdherence = Math.round(meds.reduce((a, m) => a + m.adherence, 0) / meds.length)

  // Build time-of-day schedule
  const timeBlocks = [
    { key: 'morning', label: 'Morning', range: [5, 11], icon: Sunrise, accent: 'amber' },
    { key: 'midday', label: 'Midday', range: [11, 16], icon: Sun, accent: 'sky' },
    { key: 'evening', label: 'Evening', range: [16, 22], icon: Moon, accent: 'violet' },
  ]
  const scheduleDoses = []
  meds.forEach((m) => m.times.forEach((t) => scheduleDoses.push({ ...m, time: t })))

  const filteredMeds = meds.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      residentById[m.residentId]?.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Dad’s Medications" subtitle={`${meds.length} prescriptions · keeping track so nothing is missed`} icon={Pill} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Pill} label="Active meds" value={meds.length} accent="brand" />
        <StatCard icon={CheckCircle2} label="Avg adherence" value={`${avgAdherence}%`} accent="emerald" trend={{ dir: 'up', value: '+2%' }} />
        <StatCard icon={AlertTriangle} label="Must-not-miss" value={critical.length} accent="rose" sub="key daily meds" />
        <StatCard icon={Package} label="Low stock" value={lowStock.length} accent="amber" sub="need reorder" />
      </div>

      {lowStock.length > 0 && (
        <Card className="p-4 border-amber-200 bg-amber-50/50">
          <div className="flex items-start gap-3">
            <span className="grid place-items-center h-10 w-10 rounded-xl bg-amber-100 text-amber-600 shrink-0"><Package size={20} /></span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800">Reorder needed</p>
              <p className="text-sm text-amber-700/80 mt-0.5">
                {lowStock.map((m) => `${m.name} (${m.stock} left)`).join(' · ')}
              </p>
            </div>
            <button className="btn bg-amber-600 text-white px-3 py-2 text-sm hover:bg-amber-700 shrink-0"><RefreshCw size={15} /> Reorder</button>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 border border-ink-100 w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('btn px-4 py-2 text-sm', tab === t ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-50')}>{t}</button>
        ))}
      </div>

      {tab === 'Today’s schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {timeBlocks.map((block) => {
            const doses = scheduleDoses
              .filter((d) => {
                const h = Number(d.time.split(':')[0])
                return h >= block.range[0] && h < block.range[1]
              })
              .sort((a, b) => a.time.localeCompare(b.time))
            const Icon = block.icon
            const accents = { amber: 'bg-amber-50 text-amber-600', sky: 'bg-sky-50 text-sky-600', violet: 'bg-violet-50 text-violet-600' }
            return (
              <Card key={block.key} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn('grid place-items-center h-9 w-9 rounded-xl', accents[block.accent])}><Icon size={18} /></span>
                  <div>
                    <p className="font-display font-bold text-ink-900">{block.label}</p>
                    <p className="text-xs text-ink-400">{doses.length} doses</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {doses.map((d, i) => {
                    const r = residentById[d.residentId]
                    return (
                      <div key={d.id + i} className="flex items-center gap-3 rounded-xl border border-ink-100 p-2.5">
                        <span className="text-xs font-bold text-ink-500 w-14 shrink-0">{formatTime12(d.time)}</span>
                        <Avatar src={r?.photo} name={r?.name} size={32} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink-800 truncate">{d.name} {d.dose}</p>
                          <p className="text-xs text-ink-400 truncate">{r?.preferredName}</p>
                        </div>
                        {d.critical && <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" title="Critical" />}
                      </div>
                    )
                  })}
                  {doses.length === 0 && <p className="text-sm text-ink-300 text-center py-4">No doses</p>}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'All medications' && (
        <>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-10" placeholder="Search medications…" />
          </div>
          <div className="space-y-2">
            {filteredMeds.map((m) => {
              const r = residentById[m.residentId]
              return (
                <Card key={m.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className={cn('grid place-items-center h-12 w-12 rounded-xl shrink-0', m.critical ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-600')}><Pill size={22} /></span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-ink-900">{m.name} <span className="text-ink-400 font-normal">{m.dose}</span></p>
                        {m.critical && <span className="chip bg-rose-50 text-rose-600">Critical</span>}
                        <span className="chip bg-ink-100 text-ink-500">{m.form}</span>
                      </div>
                      <p className="text-sm text-ink-400 mt-0.5">{m.purpose} · {m.frequency} · {m.prescriber}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Avatar src={r?.photo} name={r?.name} size={22} />
                        <span className="text-xs text-ink-500">{r?.name} · {r?.relationship}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 sm:gap-6">
                      <div className="text-center">
                        <div className="text-[11px] text-ink-400 flex items-center gap-1"><Clock size={11} /> Times</div>
                        <div className="text-sm font-semibold text-ink-700">{m.times.length ? m.times.map(formatTime12).join(', ') : 'PRN'}</div>
                      </div>
                      <div className="w-24">
                        <div className="text-[11px] text-ink-400 mb-1">Adherence {m.adherence}%</div>
                        <ProgressBar value={m.adherence} barClass={m.adherence >= 90 ? 'bg-emerald-500' : 'bg-amber-500'} />
                      </div>
                      <div className="text-center">
                        <div className="text-[11px] text-ink-400">Stock</div>
                        <div className={cn('text-sm font-bold', m.stock <= 10 ? 'text-rose-600' : 'text-ink-700')}>{m.stock}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
