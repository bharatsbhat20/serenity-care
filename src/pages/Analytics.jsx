import { BarChart3, TrendingUp, Smile, Pill, HandHeart, Activity, Heart } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { useAsync } from '../data/DataContext.jsx'
import { Card, SectionHeader, Spinner, StatCard } from '../components/ui.jsx'

export default function Analytics() {
  const { data: a } = useAsync((s) => s.getAnalytics())

  if (!a) return <Spinner label="Pulling together insights…" />

  const wellbeingNow = a.wellbeingTrend[a.wellbeingTrend.length - 1].score
  const adherenceNow = a.adherenceTrend[a.adherenceTrend.length - 1].adherence
  const moodNow = a.moodTrend[a.moodTrend.length - 1].mood
  const totalCareHours = a.careContribution.reduce((s, c) => s + c.hours, 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Insights" subtitle="How Dad is doing over time — and how care is shared" icon={BarChart3} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Heart} label="Wellbeing" value={wellbeingNow} sub="of 100" accent="brand" trend={{ dir: 'up', value: '+4' }} />
        <StatCard icon={Pill} label="Med adherence" value={`${adherenceNow}%`} accent="emerald" trend={{ dir: 'up', value: '+2%' }} />
        <StatCard icon={Smile} label="Mood" value={`${moodNow}`} sub="of 5" accent="amber" trend={{ dir: 'up', value: '+0.4' }} />
        <StatCard icon={HandHeart} label="Care hours / wk" value={totalCareHours} accent="violet" sub="across the circle" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Wellbeing trend */}
        <Card className="lg:col-span-2 p-5">
          <SectionHeader title="Overall wellbeing" subtitle="A blend of health, mood, sleep & activity · 6 months" icon={TrendingUp} />
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={a.wellbeingTrend} margin={{ left: -18 }}>
                <defs>
                  <linearGradient id="wb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f9f93" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#1f9f93" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" name="Wellbeing" stroke="#1f9f93" strokeWidth={2.5} fill="url(#wb)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Care contribution donut */}
        <Card className="p-5">
          <SectionHeader title="Who’s helping" subtitle="Care hours this week" icon={HandHeart} />
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={a.careContribution} dataKey="hours" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={3}>
                  {a.careContribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {a.careContribution.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                <span className="text-ink-600 flex-1">{c.name}</span>
                <span className="font-semibold text-ink-800">{c.hours}h</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Adherence */}
        <Card className="p-5">
          <SectionHeader title="Medication adherence" subtitle="6-week trend" icon={Pill} />
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

        {/* Health events */}
        <Card className="p-5">
          <SectionHeader title="Health events" subtitle="Logged this month" icon={Activity} />
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.healthEventsByType} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: '#62718d' }} axisLine={false} tickLine={false} width={86} />
                <Tooltip />
                <Bar dataKey="count" name="Count" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Wellbeing radar */}
        <Card className="p-5">
          <SectionHeader title="Wellbeing balance" subtitle="Where he’s thriving" icon={Heart} />
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

      {/* Mood + care sharing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionHeader title="Mood over time" subtitle="Daily check-ins · out of 5" icon={Smile} />
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.moodTrend} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="mood" name="Mood" fill="#d97706" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="How care is shared" subtitle="Hours per day across helpers" icon={HandHeart} />
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.helperHours} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8290a8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="you" name="You" stackId="a" fill="#1f9f93" />
                <Bar dataKey="aide" name="Aide" stackId="a" fill="#43bbac" />
                <Bar dataKey="family" name="Family" stackId="a" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
