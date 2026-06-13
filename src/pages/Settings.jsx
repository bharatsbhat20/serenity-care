import { useState } from 'react'
import {
  Settings as SettingsIcon, Database, FlaskConical, Check, AlertTriangle,
  Server, ShieldCheck, Bell, Palette, User, Home, ExternalLink,
} from 'lucide-react'
import { useData } from '../data/DataContext.jsx'
import { Card, SectionHeader } from '../components/ui.jsx'
import { cn } from '../lib/utils.js'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={cn('relative h-7 w-12 rounded-full transition-colors shrink-0', checked ? 'bg-brand-600' : 'bg-ink-200')}
    >
      <span className={cn('absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  )
}

export default function Settings() {
  const { useLiveDatabase, setUseLiveDatabase, apiConfigured } = useData()
  const [notifications, setNotifications] = useState({ critical: true, medication: true, daily: false })

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <SectionHeader title="Settings" subtitle="Configure your platform & data source" icon={SettingsIcon} />

      {/* DATA SOURCE — the headline feature */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 bg-gradient-to-br from-brand-700 to-brand-500 text-white">
          <div className="flex items-center gap-2 text-brand-100 text-sm font-medium">
            <Server size={16} /> Data Source
          </div>
          <h3 className="font-display font-bold text-lg mt-1">Mock data or live database</h3>
          <p className="text-brand-50/90 text-sm mt-1">
            Toggle between the built-in demo dataset and a connected backend. The entire app reads through one
            abstraction layer, so switching is instant and seamless.
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* The toggle row */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-ink-100 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className={cn('grid place-items-center h-12 w-12 rounded-xl shrink-0', useLiveDatabase ? 'bg-brand-50 text-brand-600' : 'bg-amber-50 text-amber-600')}>
                {useLiveDatabase ? <Database size={24} /> : <FlaskConical size={24} />}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">{useLiveDatabase ? 'Live Database' : 'Mock Data'}</p>
                <p className="text-sm text-ink-400">
                  {useLiveDatabase
                    ? 'Reading from your configured API backend.'
                    : 'Running on the built-in demo dataset — no backend required.'}
                </p>
              </div>
            </div>
            <Toggle checked={useLiveDatabase} onChange={setUseLiveDatabase} />
          </div>

          {/* Status / guidance */}
          {useLiveDatabase && !apiConfigured && (
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-3.5">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">No API endpoint configured</p>
                <p className="text-amber-700/90 mt-0.5">
                  Set <code className="px-1 py-0.5 rounded bg-amber-100 font-mono text-xs">VITE_API_BASE_URL</code> in
                  your <code className="px-1 py-0.5 rounded bg-amber-100 font-mono text-xs">.env.local</code> file, then
                  redeploy. Until then, requests will fail — switch back to mock data to keep exploring.
                </p>
              </div>
            </div>
          )}
          {useLiveDatabase && apiConfigured && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-800">
              <Check size={18} className="shrink-0" /> API endpoint configured and active.
            </div>
          )}

          {/* How to connect */}
          <div className="rounded-xl bg-ink-50 p-4">
            <p className="text-sm font-semibold text-ink-700 mb-2 flex items-center gap-2"><ShieldCheck size={16} /> Connecting a real backend</p>
            <ol className="text-sm text-ink-500 space-y-1.5 list-decimal list-inside">
              <li>Create <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-ink-100">.env.local</code> and set <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-ink-100">VITE_API_BASE_URL</code>.</li>
              <li>Expose REST endpoints matching <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-ink-100">src/data/apiService.js</code>.</li>
              <li>Return JSON in the same shape as <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-ink-100">src/data/mockData.js</code>.</li>
              <li>Flip this toggle — no other code changes needed.</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-5">
        <SectionHeader title="Notifications" icon={Bell} />
        <div className="space-y-1">
          {[
            { key: 'critical', label: 'Critical health alerts', desc: 'Abnormal vitals, emergencies, SOS' },
            { key: 'medication', label: 'Medication reminders', desc: 'Missed doses & low stock' },
            { key: 'daily', label: 'Daily summary digest', desc: 'End-of-day care report email' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between gap-4 py-2.5">
              <div>
                <p className="text-sm font-medium text-ink-800">{n.label}</p>
                <p className="text-xs text-ink-400">{n.desc}</p>
              </div>
              <Toggle checked={notifications[n.key]} onChange={(v) => setNotifications((s) => ({ ...s, [n.key]: v }))} />
            </div>
          ))}
        </div>
      </Card>

      {/* Profile + facility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionHeader title="Your profile" icon={User} />
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/80?img=31" alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow" />
            <div>
              <p className="font-semibold text-ink-900">Sarah Bennett</p>
              <p className="text-sm text-ink-400">Daughter & primary caregiver</p>
              <p className="text-xs text-ink-400 mt-0.5">sarah.bennett@email.com</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Care details" icon={Home} />
          <div className="space-y-2 text-sm">
            <Row label="Caring for" value="Robert (Dad)" />
            <Row label="Living situation" value="At home · Portland, OR" />
            <Row label="Care circle" value="6 people" />
            <Row label="Caring since" value="2024" />
          </div>
        </Card>
      </div>

      {/* Appearance */}
      <Card className="p-5">
        <SectionHeader title="About" icon={Palette} />
        <p className="text-sm text-ink-500">
          Serenity Care v3.0.1 — Family Caregiver edition. A warm, practical companion for coordinating care for an aging
          parent at home. Built with React, Vite, Tailwind CSS and Recharts. Optimized for mobile and desktop.
        </p>
        <a href="https://github.com/bharatsbhat20" target="_blank" rel="noreferrer" className="btn-outline mt-3 text-sm">
          <ExternalLink size={15} /> View source
        </a>
      </Card>
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
