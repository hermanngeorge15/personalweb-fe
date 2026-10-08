import { useMemo } from 'react'
import {
  useResumeProjects,
  type ResumeEducation,
  type ResumeProject,
} from '@/lib/queries'

/** UTC year of an API date string, or null when missing/invalid. */
export function yearOf(date: string | null | undefined): number | null {
  if (!date) return null
  const year = new Date(date).getUTCFullYear()
  return Number.isNaN(year) ? null : year
}

/** "Jun 2022" from an API date string; empty when missing/invalid. */
export function monthYearOf(date: string | null | undefined): string {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "2018 — 2020", "2022 — now", or a single year. */
export function yearRange(start: number | null, end: number | null): string {
  if (start === null) return end === null ? '' : String(end)
  if (end === null) return `${start} — now`
  return start === end ? String(start) : `${start} — ${end}`
}

/** The resume entry with no end date (latest start wins), or null. */
export function useCurrentRole(): ResumeProject | null {
  const { data } = useResumeProjects()
  return useMemo(
    () =>
      (data ?? [])
        .filter((item) => !item.endAt && item.startAt)
        .sort((a, b) => (b.startAt ?? '').localeCompare(a.startAt ?? ''))[0] ??
      null,
    [data],
  )
}

export type PathEntry = {
  key: string
  title: string
  detail: string
  years: string
  current: boolean
  /** Sort key: start year. */
  start: number
}

/**
 * Resume roles grouped by company (one entry per employer, spanning its
 * earliest start to latest end) plus education entries, newest start first.
 */
export function buildPath(
  projects: ReadonlyArray<ResumeProject>,
  education: ReadonlyArray<ResumeEducation>,
): PathEntry[] {
  const byCompany = new Map<string, ResumeProject[]>()
  for (const project of projects) {
    const company = project.company?.trim() || project.projectName || ''
    if (!company) continue
    byCompany.set(company, [...(byCompany.get(company) ?? []), project])
  }

  const roles: PathEntry[] = [...byCompany.entries()].map(
    ([company, items]) => {
      const starts = items
        .map((item) => yearOf(item.startAt))
        .filter((year) => year !== null)
      const current = items.some((item) => !item.endAt)
      const ends = items
        .map((item) => yearOf(item.endAt))
        .filter((year) => year !== null)
      const start = starts.length > 0 ? Math.min(...starts) : null
      const end = current || ends.length === 0 ? null : Math.max(...ends)
      const roleNames = [
        ...new Set(
          [...items]
            .sort((a, b) => (b.startAt ?? '').localeCompare(a.startAt ?? ''))
            .map((item) => item.projectName?.trim())
            .filter((name): name is string => !!name),
        ),
      ]
      return {
        key: `role-${company}`,
        title: company,
        detail: roleNames.join(' · '),
        years: current
          ? yearRange(start, null)
          : yearRange(start, end ?? start),
        current,
        start: start ?? 0,
      }
    },
  )

  const schools: PathEntry[] = education.map((item) => {
    const start = yearOf(item.since)
    const end = yearOf(item.expectedUntil)
    return {
      key: `edu-${item.id}`,
      title: item.institution ?? '',
      detail: [item.degree, item.field].filter(Boolean).join(' · '),
      years: yearRange(start, end ?? start),
      current: false,
      start: start ?? 0,
    }
  })

  return [...roles, ...schools]
    .filter((entry) => entry.title)
    .sort((a, b) => b.start - a.start)
}
