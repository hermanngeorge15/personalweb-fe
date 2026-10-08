import type { SVGProps } from 'react'

/** Small stroke icons (24px grid) used by the header, footer and blog. Decorative: aria-hidden. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function StrokeIcon({ size = 18, children, ...props }: IconProps) {
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

export function GitHubIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </StrokeIcon>
  )
}

export function LinkedInIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </StrokeIcon>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </StrokeIcon>
  )
}

export function XIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 4l16 16M20 4L4 20" />
    </StrokeIcon>
  )
}

export function LinkIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </StrokeIcon>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M5 13l4 4L19 7" />
    </StrokeIcon>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </StrokeIcon>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </StrokeIcon>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </StrokeIcon>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </StrokeIcon>
  )
}

export function CodeIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
    </StrokeIcon>
  )
}

export function PlugIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3M8 12h8" />
    </StrokeIcon>
  )
}

export function DatabaseIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </StrokeIcon>
  )
}

export function LockIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </StrokeIcon>
  )
}

export function ChartIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />
    </StrokeIcon>
  )
}

export function BoltIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </StrokeIcon>
  )
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M7 17L17 7M8 7h9v9" />
    </StrokeIcon>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </StrokeIcon>
  )
}

export function PrinterIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="7" />
    </StrokeIcon>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </StrokeIcon>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </StrokeIcon>
  )
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M14 4h6v6M20 4L10 14" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </StrokeIcon>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.9L2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </StrokeIcon>
  )
}

export function SpinnerIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </StrokeIcon>
  )
}

export function LayersIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </StrokeIcon>
  )
}

export function LayoutIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </StrokeIcon>
  )
}

export function ComponentsIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <circle cx="17.5" cy="17.5" r="3.5" />
    </StrokeIcon>
  )
}

/** Solid quotation mark (fill, no stroke) for testimonial cards. */

export function QuoteIcon(props: IconProps) {
  return (
    <StrokeIcon fill="currentColor" stroke="none" {...props}>
      <path d="M7 7h4v4c0 3-1.5 5-4 6l-1-1.5c1.5-.8 2.3-2 2.4-3.5H7V7zm8 0h4v4c0 3-1.5 5-4 6l-1-1.5c1.5-.8 2.3-2 2.4-3.5H15V7z" />
    </StrokeIcon>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </StrokeIcon>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </StrokeIcon>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </StrokeIcon>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M7 4.5v15l12-7.5z" />
    </StrokeIcon>
  )
}

/** Learn Kotlin depth tiers: TL;DR, Beginner, Intermediate, Deep Dive. */

export function SproutIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 21v-9" />
      <path d="M12 12c0-4-3-7-8-7 0 4 3 7 8 7z" />
      <path d="M12 14c0-3.5 2.5-6 7-6 0 3.5-2.5 6-7 6z" />
    </StrokeIcon>
  )
}

export function WrenchIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" />
    </StrokeIcon>
  )
}

export function TargetIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </StrokeIcon>
  )
}

export function ClipboardIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
    </StrokeIcon>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 21V5M19 19v2H6" />
    </StrokeIcon>
  )
}

export function LightbulbIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />
    </StrokeIcon>
  )
}

export function MessageIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 5h16v11H9l-5 4z" />
    </StrokeIcon>
  )
}

export function FolderIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    </StrokeIcon>
  )
}
