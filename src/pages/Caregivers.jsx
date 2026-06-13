import { useMemo } from 'react'
import { UserCog, Star, Phone, Mail, Clock, Award, Users } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Avatar, Spinner, StatCard, StatusDot } from '../components/ui.jsx'
import { cn, statusStyles } from '../lib/utils.js'

export default function Caregivers() {
  const { data: caregivers } = useAsync((s) => s.getCaregivers())
  const { data: residents } = useAsync((s) => s.getResidents())
  const { data: analytics } = useAsync((s) => s.getAnalytics())

  const residentById = useMemo(() => Object.fromEntries((residents || []).map((r) => [r.id, r])), [residents])

  if (!caregivers || !residents) return <Spinner label="Loading care team…" />

  const onDuty = caregivers.filter((c) => c.status === 'on-duty').length
  const avgRating = (caregivers.reduce((a, c) => a + c.rating, 0) / caregivers.length).toFixed(1)
  const totalHours = caregivers.reduce((a, c) => a + c.hoursThisWeek, 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Care Team" subtitle={`${caregivers.length} caregivers · ${onDuty} on duty now`} icon={UserCog} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label="Team size" value={caregivers.length} accent="brand" />
        <StatCard icon={Clock} label="On duty" value={onDuty} accent="emerald" sub="right now" />
        <StatCard icon={Star} label="Avg rating" value={avgRating} accent="amber" sub="out of 5.0" />
        <StatCard icon={Award} label="Weekly hours" value={totalHours} accent="violet" sub="across team" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {caregivers.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 sm:block sm:text-center sm:w-28 shrink-0">
                  <Avatar src={c.photo} name={c.name} size={64} ring className="sm:mx-auto" />
                  <div className="sm:mt-2">
                    <div className="flex items-center gap-1 text-amber-500 sm:justify-center">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold text-ink-800">{c.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-ink-900">{c.name}</h3>
                      <p className="text-sm text-brand-600 font-medium">{c.role}</p>
                    </div>
                    <StatusDot status={c.status} styles={statusStyles} />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Clock size={13} /> {c.shift}</span>
                    <span className="flex items-center gap-1"><Award size={13} /> {c.hoursThisWeek}h this week</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {c.specialties.map((s) => <span key={s} className="chip bg-brand-50 text-brand-700">{s}</span>)}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {c.certifications.map((s) => <span key={s} className="chip bg-ink-100 text-ink-500">{s}</span>)}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-400">Assigned:</span>
                      <div className="flex -space-x-2">
                        {c.assignedResidents.map((rid) => {
                          const r = residentById[rid]
                          return <Avatar key={rid} src={r?.photo} name={r?.name} size={26} ring />
                        })}
                      </div>
                      <span className="text-xs text-ink-400">{c.assignedResidents.length} residents</span>
                    </div>
                    <div className="flex gap-1.5">
                      <a href={`tel:${c.phone}`} className="btn-outline px-2.5 py-2"><Phone size={15} /></a>
                      <a href={`mailto:${c.email}`} className="btn-outline px-2.5 py-2"><Mail size={15} /></a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-5">
          {analytics && (
            <Card className="p-5">
              <SectionHeader title="Staffing hours" subtitle="Direct vs admin · this week" icon={Clock} />
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.staffHours} margin={{ left: -18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="direct" name="Direct care" stackId="a" fill="#1f9f93" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="admin" name="Administrative" stackId="a" fill="#aee9dd" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          <Card className="p-5">
            <SectionHeader title="Shift coverage" icon={Users} />
            <div className="space-y-3">
              {['Day (7a–3p)', 'Evening (3p–11p)', 'Night (11p–7a)'].map((shift, i) => {
                const count = caregivers.filter((c) => c.shift.includes(shift.split(' ')[0])).length || (i === 2 ? 2 : 0)
                const pct = Math.min(100, (count / 3) * 100)
                return (
                  <div key={shift}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-ink-600 font-medium">{shift}</span>
                      <span className="text-ink-400">{count} staff</span>
                    </div>
                    <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                      <div className={cn('h-full rounded-full', pct >= 66 ? 'bg-emerald-500' : pct >= 33 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: `${Math.max(pct, 12)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
