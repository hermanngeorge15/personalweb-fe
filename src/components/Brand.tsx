import { twMerge } from 'tailwind-merge'
import { AUTHOR } from '@/config/site'

/** Gradient "JH" tile used as the site logo (header and footer). */
export function LogoTile({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        'bg-brand-gradient text-on-brand flex size-[30px] shrink-0 items-center justify-center rounded-lg text-[13px] font-bold',
        className,
      )}
    >
      {AUTHOR.initials}
    </span>
  )
}

/** Round gradient "JH" avatar used in post bylines and the author card. */
export function AuthorAvatar({ size = 32 }: { size?: 32 | 56 }) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        'bg-brand-gradient text-on-brand flex shrink-0 items-center justify-center rounded-full font-bold',
        size === 56 ? 'size-14 text-lg' : 'size-8 text-xs',
      )}
    >
      {AUTHOR.initials}
    </span>
  )
}
