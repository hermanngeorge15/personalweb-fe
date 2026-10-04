import { z } from 'zod'

/** ISO instant -> value for <input type="date"> ("" when absent). */
export function toDateInput(iso?: string | Date | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

/** <input type="date"> value -> ISO instant at UTC midnight, or null when empty. */
export function fromDateInput(value: string): string | null {
  return value ? `${value}T00:00:00Z` : null
}

/** ISO instant -> value for <input type="datetime-local"> in the browser's time zone. */
export function toDateTimeInput(iso?: string | Date | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

/** <input type="datetime-local"> value -> ISO instant, or null when empty. */
export function fromDateTimeInput(value: string): string | null {
  return value ? new Date(value).toISOString() : null
}

/** "a, b , c" -> ["a", "b", "c"] */
export function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

/** Optional text: "" becomes null so the API stores "no value", not an empty string. */
export const optionalText = z
  .string()
  .transform((value) => (value.trim() === '' ? null : value.trim()))

export const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`)

/** A whole number typed into a text or number input. */
export const intText = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^-?\d+$/, `${label} must be a whole number`)
    .transform(Number)
