import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

/** Page section container: the 1200px column used by the redesigned pages. */
export const sectionClass = 'relative mx-auto max-w-[1200px] px-4 sm:px-8'

/** Gradient call-to-action button (links styled as buttons). */
export const primaryButtonClass =
  'bg-brand-gradient-x text-on-brand inline-flex min-h-11 items-center justify-center rounded-[10px] px-5 py-3 text-[15px] font-medium transition-opacity hover:opacity-90'

/** Outlined secondary button. */
export const secondaryButtonClass =
  'border-window-line text-ink hover:bg-chip inline-flex min-h-11 items-center justify-center rounded-[10px] border px-5 py-3 text-[15px] font-medium transition-colors'

/** Small coloured label above a section heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={twMerge(
        'text-brand-a text-[13px] font-medium tracking-[0.01em]',
        className,
      )}
    >
      {children}
    </p>
  )
}

/** Eyebrow + h2, with an optional link on the right ("All posts →"). */
export function SectionHeading({
  eyebrow,
  title,
  titleId,
  action,
}: {
  eyebrow: string
  title: ReactNode
  titleId?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className="text-heading mt-2.5 text-[26px] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[34px] sm:leading-[1.15] sm:tracking-[-0.025em]"
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

/** Brand-coloured "All posts →" style link next to a section heading. */
export const sectionLinkClass =
  'text-brand-a inline-flex min-h-11 items-center text-[15px] font-medium hover:underline hover:underline-offset-4'

/** Soft radial brand glow behind the top of a page. Decorative. */
export function PageGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        'bg-glow-hero pointer-events-none absolute -top-[240px] left-1/2 h-[620px] w-[1100px] -translate-x-1/2',
        className,
      )}
    />
  )
}
