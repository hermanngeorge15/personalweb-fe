import { useCallback, useEffect, useState } from 'react'

/**
 * Light/dark theme.
 *
 * The `dark` class on <html> is the single switch: Tailwind's `dark:` variant,
 * HeroUI and the design tokens in globals.css all key off it. An inline script
 * in index.html sets it before first paint (no flash of the wrong theme); this
 * module keeps it in sync afterwards.
 *
 * Default = the visitor's `prefers-color-scheme`. The header toggle stores an
 * explicit choice in localStorage, which then wins over the system setting.
 */

export type Theme = 'light' | 'dark'

/** Must match the key read by the inline script in index.html. */
export const THEME_STORAGE_KEY = 'theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage blocked (private mode, disabled cookies): the choice lasts for this page only.
  }
}

function systemTheme(): Theme {
  return window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  // Follow the OS setting live, until the visitor picks a theme explicitly.
  useEffect(() => {
    const media = window.matchMedia?.(DARK_QUERY)
    if (!media) return
    const onChange = () => {
      if (readStoredTheme()) return
      const next = systemTheme()
      applyTheme(next)
      setTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    storeTheme(next)
    setTheme(next)
  }, [])

  return { theme, toggle }
}
