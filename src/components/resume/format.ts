/**
 * Date helpers shared by /resume and /resume/print.
 *
 * Resume dates come from the API as UTC timestamps at month precision (e.g. an end date of
 * `2018-09-30T23:59:59Z`). They are formatted in UTC so a visitor's time zone can't shift a
 * month boundary (that timestamp is already October in Prague).
 */

function parse(value?: string | null): Date | null {
  if (!value || value.trim() === '') return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

/** "Jun 2022"; empty string when missing or invalid. */
export function formatMonthYear(value?: string | null): string {
  const date = parse(value)
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

/** "2014"; empty string when missing or invalid. */
export function formatYear(value?: string | null): string {
  const date = parse(value)
  return date ? String(date.getUTCFullYear()) : ''
}

/**
 * "Jun 2022 – Present", "Jan 2017 – Sep 2018", or "" when there is no start date.
 * `openEnd` is the label for a missing end date ("Present" for jobs, "" to omit it).
 */
export function formatRange(
  start: string | null | undefined,
  end: string | null | undefined,
  format: (value?: string | null) => string = formatMonthYear,
  openEnd = 'Present',
): string {
  const from = format(start)
  if (!from) return ''
  const to = format(end) || openEnd
  return to ? `${from} – ${to}` : from
}

/** Newest first by the given date field; items without a date go last. Returns a new array. */
export function sortByDateDesc<T>(
  items: readonly T[],
  dateOf: (item: T) => string | null | undefined,
): T[] {
  const time = (item: T) => parse(dateOf(item))?.getTime() ?? 0
  return [...items].sort((a, b) => time(b) - time(a))
}
