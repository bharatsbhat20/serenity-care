import { Users, Phone, Mail, Clock, Heart, HandHeart, Star } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner, StatCard } from '../components/ui.jsx'
import { cn } from '../lib/utils.js'

const statusMeta = {
  'on-duty': { label: 'Available', dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700' },
  'off-duty': { label: 'Not now', dot: 'bg-ink-300', chip: 'bg-ink-100 text-ink-500' },
  'on-break': { label: 'Busy', dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700' },
}

export default function Caregivers() {
  const { data: caregivers } = useAsync((s) => s.getCaregivers())
  const { data: analytics } = useAsync((s) => s.getAnalytics())

  if (!caregivers) return <Spinner label="Loading the care circle…" />

  const available = caregivers.filter((c) => c.status === 'on-duty').length
  const family = caregivers.filter((c) => ['Daughter', 'Son'].includes(c.relationship)).length
  const totalHours = caregivers.reduce((a, c) => a + (c.hoursThisWeek || 0), 0)
  const you = caregivers.find((c) => c.isYou)

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Dad’s Care Circle" subtitle={`${caregivers.length} people helping · you’re not alone in this`} icon={Users} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label="In the circle" value={caregivers.length} accent="brand" />
        <StatCard icon={Heart} label="Family helping" value={family} accent="rose" />
        <StatCard icon={Clock} label="Available now" value={available} accent="emerald" />
        <StatCard icon={HandHeart} label="Care hours / wk" value={totalHours} accent="violet" sub="across everyone" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {caregivers.map((c) => {
            const sm = statusMeta[c.status] || statusMeta['off-duty']
            return (
              <Card key={c.id} className={cn('p-5', c.isYou && 'ring-2 ring-brand-200 border-brand-200')}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Avatar src={c.photo} name={c.name} size={64} ring className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-ink-900">{c.name}</h3>
                          {c.isYou && <span className="chip bg-brand-100 text-brand-700">You</span>}
                        </div>
                        <p className="text-sm text-brand-600 font-medium">{c.role}</p>
                      </div>
                      <span className={cn('chip', sm.chip)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', sm.dot)} /> {sm.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-ink-500">
                      <span className="flex items-center gap-1"><Star size={13} className="text-amber-400" /> {c.relationship}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {c.availability}</span>
                      {c.hoursThisWeek != null && <span className="flex items-center gap-1"><HandHeart size={13} /> {c.hoursThisWeek}h this week</span>}
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-ink-400 mb-1.5">Helps with</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.helpsWith.map((h) => <span key={h} className="chip bg-brand-50 text-brand-700">{h}</span>)}
                      </div>
                    </div>

                    {c.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.certifications.map((s) => <span key={s} className="chip bg-ink-100 text-ink-500">{s}</span>)}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-ink-100">
                      <a href={`tel:${c.phone}`} className="btn-outline px-3 py-2 text-sm"><Phone size={15} /> Call</a>
                      <a href={`mailto:${c.email}`} className="btn-outline px-2.5 py-2"><Mail size={15} /></a>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="space-y-5">
          {analytics && (
            <Card className="p-5">
              <SectionHeader title="Who’s helping" subtitle="Care hours this week" icon={HandHeart} />
              <div className="space-y-3">
                {analytics.careContribution.map((c) => {
                  const max = Math.max(...analytics.careContribution.map((x) => x.hours))
                  return (
                    <div key={c.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-ink-600 font-medium">{c.name}</span>
                        <span className="text-ink-400">{c.hours}h</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-ink-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(c.hours / max) * 100}%`, background: c.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {analytics && (
            <Card className="p-5">
              <SectionHeader title="How care is shared" subtitle="Hours per day" icon={Clock} />
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.helperHours} margin={{ left: -22 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="you" name="You" stackId="a" fill="#1f9f93" />
                    <Bar dataKey="aide" name="Aide" stackId="a" fill="#43bbac" />
                    <Bar dataKey="family" name="Family" stackId="a" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {you && (
            <Card className="p-5 bg-brand-50/40 border-brand-100">
              <div className="flex items-center gap-2 text-brand-700 mb-1.5"><Heart size={16} /> <span className="font-semibold text-sm">A note for you</span></div>
              <p className="text-sm text-ink-600">
                You’re carrying {you.hoursThisWeek} hours of care this week on top of everything else. Remember to lean on
                the circle — and take time for yourself, too.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
