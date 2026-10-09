/**
 * Site-wide links and copy, in one place. Components read from here instead of
 * hard-coding URLs, so a changed handle is fixed once.
 *
 * An empty string means "not set": the matching link or icon renders nothing.
 */

export const AUTHOR = {
  name: 'Jiří Hermann',
  initials: 'JH',
  footerBio:
    'Software engineer (Kotlin, Java, Spring Boot) working with agentic AI workflows. Founder of Kotlin Server Squad. Building UnityInFlow — open-source tooling for AI agents.',
  postBio:
    'Software engineer, founder of Kotlin Server Squad. Building open-source security tooling for AI agents.',
} as const

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/ji%C5%99%C3%AD-hermann-8926a173/',
  github: 'https://github.com/hermanngeorge15',
  /** Not set yet: the owner will add the profile URL. Empty hides the link. */
  instagram: '',
  kotlinServerSquad: 'https://kotlinserversquad.com',
} as const

/** RSS feed URL (planned: `/rss.xml`). Empty until the backend serves the feed; hides RSS links. */
export const RSS_URL = ''

export type Announcement = { text: string; href: string }

/** Slim bar above the header. Set to `null` to render nothing. */
export const ANNOUNCEMENT: Announcement | null = {
  text: 'injection-scanner v0.1.0 is out — 48 detection patterns, prebuilt binaries →',
  href: 'https://github.com/UnityInFlow/injection-scanner/releases/tag/v0.1.0',
}

export const PROJECT_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  {
    label: 'injection-scanner',
    href: 'https://github.com/UnityInFlow/injection-scanner',
  },
  { label: 'spec-linter', href: 'https://github.com/UnityInFlow/spec-linter' },
  { label: 'UnityInFlow', href: 'https://github.com/UnityInFlow' },
]
