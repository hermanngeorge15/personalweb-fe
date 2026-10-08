import { useTheme } from '@/lib/theme'
import { MoonIcon, SunIcon } from './icons'

/** Sun/moon button that switches between light and dark and remembers the choice. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="text-muted hover:bg-chip hover:text-ink focus-visible:outline-brand-a flex size-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-2"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
