// Small shared helpers used across the app.

export function cn(...args) {
  return args.filter(Boolean).join(' ')
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

// Map a domain status to a tailwind-friendly token set.
export const statusStyles = {
  stable: { label: 'Stable', dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700' },
  attention: { label: 'Needs attention', dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700' },
  critical: { label: 'Critical', dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700' },
  'on-duty': { label: 'On duty', dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700' },
  'off-duty': { label: 'Off duty', dot: 'bg-ink-300', chip: 'bg-ink-100 text-ink-500' },
  'on-break': { label: 'On break', dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700' },
}

export const severityStyles = {
  critical: { chip: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', ring: 'ring-rose-100' },
  warning: { chip: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', ring: 'ring-amber-100' },
  info: { chip: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500', ring: 'ring-sky-100' },
}

export const priorityStyles = {
  critical: 'bg-rose-50 text-rose-700',
  high: 'bg-orange-50 text-orange-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-ink-100 text-ink-600',
}

export function riskBand(score) {
  if (score >= 70) return { label: 'High', color: 'text-rose-600', bar: 'bg-rose-500' }
  if (score >= 45) return { label: 'Moderate', color: 'text-amber-600', bar: 'bg-amber-500' }
  return { label: 'Low', color: 'text-emerald-600', bar: 'bg-emerald-500' }
}

export function formatTime12(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
