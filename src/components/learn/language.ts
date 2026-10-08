import type { SourceLanguage } from '@/lib/queries'

/** localStorage key for the reader's background language; topic pages read it too. */
export const LANGUAGE_STORAGE_KEY = 'kotlin-learning-source-language'

export const LANGUAGE_LABEL: Record<'java' | 'csharp', string> = {
  java: 'Java',
  csharp: 'C#',
}

export function isSourceLanguage(value: unknown): value is 'java' | 'csharp' {
  return value === 'java' || value === 'csharp'
}

/** The remembered background, or null (storage can be unavailable or blocked). */
export function readStoredLanguage(): SourceLanguage {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isSourceLanguage(stored) ? stored : null
  } catch {
    return null
  }
}

export function storeLanguage(language: SourceLanguage) {
  if (typeof window === 'undefined') return
  try {
    if (language) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    else window.localStorage.removeItem(LANGUAGE_STORAGE_KEY)
  } catch {
    // Remembering the choice is a convenience; the ?lang= link still carries it.
  }
}
