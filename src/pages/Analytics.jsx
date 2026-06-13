import { BarChart3, TrendingUp, Users, Activity, Heart, Smile } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Spinner, StatCard } from '../components/ui.jsx'

export default function Analytics() {
  const { data: a } = useAsync((s) => s.getAnalytics())
  const { data: facility } = useAsync((s) => s.getFacility())

  if (!a || !facility) return <Spinner label="Crunching the numbers…" />

  const totalIncidents = a.incidentsByType.reduce((s, i) => s + i.count, 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Analytics & Insights" subtitle="Facility performance, quality & wellbeing metrics" icon={BarChart3} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Users} label="Occupancy" value={`${Math.round((facility.occupied / facility.capacity) * 100)}%`} accent="brand" trend={{ dir: 'up', value: '+4%' }} />
        <StatCard icon={Activity} label="Med adherence" value="93%" accent="emerald" trend={{ dir: 'up', value: '+2%' }} />
        <StatCard icon={Heart} label="Incidents (mo)" value={totalIncidents} accent="rose" trend={{ dir: 'down', value: '-12%' }} />
        <StatCard icon={Smile} label="Satisfaction" value="4.8" accent="amber" sub="out of 5.0" trend={{ dir: 'up', value: '+0.2' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Census trend */}
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Occupancy trend" subtitle="Residents vs capacity · 6 months" icon={TrendingUp} />
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={a.censusTrend} margin={{ left: -18 }}>
                <defs>
                  <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f9f93" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#1f9f93" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} domain={[70, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="capacity" name="Capacity" stroke="#d4d9e2" strokeWidth={1.5} strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="occupancy" name="Occupancy" stroke="#1f9f93" strokeWidth={2.5} fill="url(#occ)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Care level mix */}
        <Card className="p-5">
          <SectionHeader title="Care level mix" icon={Users} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={a.careLevelMix} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={3}>
                  {a.careLevelMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {a.careLevelMix.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                <span className="text-ink-600 flex-1">{c.name}</span>
                <span className="font-semibold text-ink-800">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Adherence trend */}
        <Card className="p-5">
          <SectionHeader title="Medication adherence" subtitle="6-week trend" icon={Activity} />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={a.adherenceTrend} margin={{ left: -22 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="adherence" name="Adherence %" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Incidents */}
        <Card className="p-5">
          <SectionHeader title="Incidents by type" subtitle="This month" icon={Heart} />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.incidentsByType} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: '#62718d' }} axisLine={false} tickLine={false} width={78} />
                <Tooltip />
                <Bar dataKey="count" name="Incidents" fill="#fa3c11" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Wellbeing radar */}
        <Card className="p-5">
          <SectionHeader title="Resident wellbeing" subtitle="Aggregate index" icon={Smile} />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={a.wellbeingRadar} outerRadius="72%">
                <PolarGrid stroke="#eceef2" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#62718d' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="#1f9f93" fill="#1f9f93" fillOpacity={0.35} strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Satisfaction + staffing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionHeader title="Family satisfaction" subtitle="Quarterly score (of 5)" icon={Smile} />
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.satisfaction} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[4, 5]} tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="score" name="Satisfaction" fill="#d97706" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Weekly staffing hours" subtitle="Direct care vs administrative" icon={Users} />
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.staffHours} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="direct" name="Direct care" stackId="a" fill="#1f9f93" />
                <Bar dataKey="admin" name="Administrative" stackId="a" fill="#aee9dd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
