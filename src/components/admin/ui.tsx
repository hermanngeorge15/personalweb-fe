import type { PropsWithChildren, ReactNode, SVGProps } from 'react'
import { twMerge } from 'tailwind-merge'

/*
 * The one admin look: every form, button, card and notice in the admin area takes its classes
 * from here, so hand-written forms and the shared AdminForm render the same way.
 */

const focusRing =
  'focus-visible:outline-brand-a focus-visible:outline-2 focus-visible:outline-offset-2'

const fieldBase = twMerge(
  'border-line-strong bg-page text-ink placeholder:text-fainter w-full rounded-lg border px-3 py-2 text-[15px] sm:text-sm',
  // [readonly], not :read-only — a <select> always matches :read-only.
  '[&[readonly]]:bg-subtle [&[readonly]]:text-muted disabled:opacity-60',
  'focus-visible:border-brand-a focus-visible:outline-brand-a/30 focus-visible:outline-2',
)

const mono = 'font-mono text-[13px] leading-relaxed sm:text-[13px]'

/** Text inputs and selects (44px tall on phones, 40px from sm). */
export const inputClass = twMerge(fieldBase, 'min-h-11 sm:min-h-10')

/** Textareas: height from `rows` or a min-h-* class. */
export const textareaClass = twMerge(fieldBase, 'resize-y')

/** Monospace variants for slugs, ids, JSON and code. */
export const codeInputClass = twMerge(inputClass, mono)
export const codeTextareaClass = twMerge(textareaClass, mono)

const buttonBase = twMerge(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-10',
  focusRing,
)

/** The main action of a form or page (Save, Create). */
export const primaryButton = twMerge(
  buttonBase,
  'bg-invert text-on-invert hover:opacity-90',
)

/** Secondary actions (Cancel, Edit, View). */
export const secondaryButton = twMerge(
  buttonBase,
  'border-line-strong bg-card text-body hover:bg-chip hover:text-ink border',
)

/** Destructive actions (Delete). */
export const dangerButton = twMerge(
  buttonBase,
  'border-line-strong bg-card text-danger hover:bg-danger/10 border',
)

/** The confirming click of a delete. */
export const dangerSolidButton = twMerge(
  buttonBase,
  'bg-danger text-on-brand hover:opacity-90',
)

/** Compact secondary button for row actions in lists. */
export const rowButton = twMerge(secondaryButton, 'px-3 sm:min-h-9')

/** White panel on the grey admin canvas. */
export function AdminCard({
  className,
  children,
  as: Tag = 'section',
  ...rest
}: PropsWithChildren<{
  className?: string
  as?: 'section' | 'div' | 'aside'
  'aria-labelledby'?: string
}>) {
  return (
    <Tag
      className={twMerge(
        'border-line bg-card rounded-2xl border p-5 sm:p-6',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** One labelled field: label above, hint and error below. */
export function Field({
  label,
  hint,
  error,
  className,
  children,
}: PropsWithChildren<{
  label: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
}>) {
  return (
    <label className={twMerge('grid content-start gap-1.5', className)}>
      <span className="text-body text-[13px] font-medium">{label}</span>
      {children}
      {hint && <span className="text-faint text-[13px]">{hint}</span>}
      {error && <span className="text-danger text-[13px]">{error}</span>}
    </label>
  )
}

/** Page title row: h1, optional description, actions on the right. */
export function AdminPageHeader({
  title,
  description,
  actions,
  meta,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-heading text-[24px] leading-tight font-semibold tracking-[-0.02em] sm:text-[28px]">
          {title}
        </h1>
        {meta && (
          <div className="text-muted mt-2 flex flex-wrap items-center gap-2 text-[13px]">
            {meta}
          </div>
        )}
        {description && (
          <p className="text-muted mt-1.5 max-w-[640px] text-[15px] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

/** Card heading (h2) with optional actions. */
export function CardTitle({
  id,
  children,
  actions,
}: PropsWithChildren<{ id?: string; actions?: ReactNode }>) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 id={id} className="text-heading text-base font-semibold">
        {children}
      </h2>
      {actions}
    </div>
  )
}

/** Loading, error and empty messages for a list or record. */
export function Notice({
  tone = 'muted',
  children,
}: PropsWithChildren<{ tone?: 'muted' | 'danger' }>) {
  return (
    <p
      role={tone === 'danger' ? 'alert' : undefined}
      className={twMerge(
        'text-[15px]',
        tone === 'danger' ? 'text-danger' : 'text-muted',
      )}
    >
      {children}
    </p>
  )
}

/** Small pill: "published" in brand green, anything else neutral. */
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={twMerge(
        'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
        status === 'published'
          ? 'bg-brand-b/10 text-brand-b'
          : 'bg-chip text-body',
      )}
    >
      {status}
    </span>
  )
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function AdminStrokeIcon({ size = 16, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/** "Opens elsewhere" arrow for View site links. */
export function ArrowUpRightIcon(props: IconProps) {
  return (
    <AdminStrokeIcon {...props}>
      <path d="M7 17L17 7M9 7h8v8" />
    </AdminStrokeIcon>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <AdminStrokeIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </AdminStrokeIcon>
  )
}

export function SignOutIcon(props: IconProps) {
  return (
    <AdminStrokeIcon {...props}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3" />
    </AdminStrokeIcon>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <AdminStrokeIcon {...props}>
      <path d="M12 5v14M5 12h14" />
    </AdminStrokeIcon>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <AdminStrokeIcon {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </AdminStrokeIcon>
  )
}

/** Joins admin classes so later ones win (min-h-[200px] over the input's min-h-10). */
export const cx = twMerge
