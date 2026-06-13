// Reusable presentational primitives shared across pages.
import { cn, initials } from '../lib/utils.js'

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  )
}

export function SectionHeader({ title, subtitle, action, icon: Icon }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-50 text-brand-600">
            <Icon size={20} />
          </span>
        )}
        <div>
          <h2 className="section-title text-lg sm:text-xl leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function Avatar({ src, name, size = 40, className, ring }) {
  return (
    <div
      className={cn(
        'relative shrink-0 rounded-full overflow-hidden bg-brand-100 text-brand-700 grid place-items-center font-semibold',
        ring && 'ring-2 ring-white shadow-sm',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  )
}

export function StatusDot({ status, styles }) {
  const s = styles[status]
  if (!s) return null
  return (
    <span className={cn('chip border', s.chip)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}

export function ProgressBar({ value, className, barClass = 'bg-brand-500' }) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-ink-100 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', barClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, sub, trend, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-50 text-accent-600',
    violet: 'bg-violet-50 text-violet-600',
    sky: 'bg-sky-50 text-sky-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <span className={cn('grid place-items-center h-11 w-11 rounded-xl', accents[accent])}>
          {Icon && <Icon size={22} />}
        </span>
        {trend && (
          <span
            className={cn(
              'text-xs font-semibold px-2 py-1 rounded-lg',
              trend.dir === 'up'
                ? 'bg-emerald-50 text-emerald-600'
                : trend.dir === 'down'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-ink-100 text-ink-500'
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight">{value}</div>
        <div className="text-sm text-ink-500 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-ink-400 mt-1">{sub}</div>}
      </div>
    </Card>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-400">
      <span className="h-5 w-5 rounded-full border-2 border-ink-200 border-t-brand-500 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      {Icon && (
        <span className="grid place-items-center h-14 w-14 rounded-2xl bg-ink-100 text-ink-400 mb-3">
          <Icon size={26} />
        </span>
      )}
      <p className="font-semibold text-ink-700">{title}</p>
      {hint && <p className="text-sm text-ink-400 mt-1 max-w-xs">{hint}</p>}
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <Card className="p-6 border-rose-200 bg-rose-50/40">
      <p className="font-semibold text-rose-700">Couldn’t load data</p>
      <p className="text-sm text-rose-600/80 mt-1">{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-3 text-rose-700 border-rose-200">
          Try again
        </button>
      )}
    </Card>
  )
}

export function Pill({ children, className }) {
  return <span className={cn('chip bg-ink-100 text-ink-600', className)}>{children}</span>
}
