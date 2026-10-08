/**
 * Released UnityInFlow tools, newest release first. Source of truth for the
 * Projects page and the Home "Tools" section. Versions and release months are
 * each repo's latest GitHub Release; update them here when a tool ships.
 */

export type ProjectLanguage = 'Rust' | 'Kotlin' | 'TypeScript'

export type ProjectEntry = {
  /** Repo name under github.com/UnityInFlow. */
  name: string
  language: ProjectLanguage
  /** Latest released version, e.g. "v0.1.0". */
  version: string
  /** Month of that release, as YYYY-MM. */
  released: string
  /** Where the release is distributed. */
  distribution: string
  description: string
}

export const GITHUB_ORG_URL = 'https://github.com/UnityInFlow'

export const projectUrl = (name: string) => `${GITHUB_ORG_URL}/${name}`

export const PROJECTS: ReadonlyArray<ProjectEntry> = [
  {
    name: 'injection-scanner',
    language: 'Rust',
    version: 'v0.1.0',
    released: '2026-08',
    distribution: 'Prebuilt binaries · SLSA provenance',
    description:
      'Prompt injection static scanner — detects role overrides, instruction injection, exfiltration, jailbreaks, and encoding attacks.',
  },
  {
    name: 'spec-ci-plugin',
    language: 'TypeScript',
    version: 'v1.1.1',
    released: '2026-08',
    distribution: 'GitHub Marketplace',
    description:
      'Spec compliance CI/CD plugin — enforces spec-linter, injection-scanner, scope, and criteria checks on every PR.',
  },
  {
    name: 'prompt-vc',
    language: 'Rust',
    version: 'v0.0.1',
    released: '2026-07',
    distribution: 'Homebrew',
    description:
      'Version control for system prompts — semantic diff, A/B comparison runs, auto changelogs.',
  },
  {
    name: 'agent-tracer',
    language: 'Kotlin',
    version: 'v0.1.0',
    released: '2026-07',
    distribution: 'GitHub Release',
    description: 'Purpose-built agent call graph visualizer.',
  },
  {
    name: 'agent-memory',
    language: 'Rust',
    version: 'v0.0.1',
    released: '2026-07',
    distribution: 'MCP stdio server',
    description:
      'Persistent, cross-runtime, typed memory for AI agents — MCP server over embedded SQLite. Local, offline, no cloud.',
  },
  {
    name: 'mcp-hub',
    language: 'Rust',
    version: 'v0.1.1',
    released: '2026-06',
    distribution: 'crates.io',
    description:
      'PM2 for MCP servers — manage, monitor, and configure your MCP servers.',
  },
  {
    name: 'kore-runtime',
    language: 'Kotlin',
    version: 'v0.1.1',
    released: '2026-06',
    distribution: 'Maven Central',
    description: 'Production-grade Kotlin agent runtime for the JVM.',
  },
  {
    name: 'budget-breaker',
    language: 'Kotlin',
    version: 'v0.1.0',
    released: '2026-06',
    distribution: 'Maven Central',
    description:
      'Kotlin coroutine budget circuit breaker for AI agents — soft/hard token limits with cost estimation.',
  },
  {
    name: 'token-dashboard',
    language: 'Kotlin',
    version: 'v0.1.0',
    released: '2026-05',
    distribution: 'jar · GHCR image',
    description:
      'Real-time AI agent token burn dashboard — burn rate, cost forecast, anomaly detection, budget alerts.',
  },
  {
    name: 'spec-linter',
    language: 'TypeScript',
    version: 'v0.0.1',
    released: '2026-04',
    distribution: 'npm',
    description:
      'Lint CLAUDE.md and AI spec files — catches missing sections, secrets, and context bloat.',
  },
  {
    name: 'ai-changelog',
    language: 'TypeScript',
    version: 'v0.0.1',
    released: '2026-04',
    distribution: 'npm',
    description:
      'AI-aware changelog generator — product and technical changelogs from agent commits and planning files.',
  },
]

/** Tools shown on the Home page, in this order. */
export const FEATURED_PROJECT_NAMES = [
  'injection-scanner',
  'kore-runtime',
  'mcp-hub',
] as const

/** "2026-08" → "Aug 2026". */
export function formatReleaseMonth(released: string): string {
  const [year, month] = released.split('-').map(Number)
  if (!year || !month) return released
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
