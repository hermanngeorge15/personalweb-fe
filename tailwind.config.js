import typography from '@tailwindcss/typography'
import { heroui } from '@heroui/react'

export default {
  content: [
    'index.html',
    './src/**/*.{js,jsx,ts,tsx,vue,html}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'wv-color-layout-navigation': {
          background: 'var(--wv-color-layout-navigation-background)',
          border: 'var(--wv-color-layout-navigation-border)',
        },
        'wv-color-layout-content': {
          background: 'var(--wv-color-layout-content-background)',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [typography(), heroui()],
}
