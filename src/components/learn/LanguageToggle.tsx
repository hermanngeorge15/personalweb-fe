import { useId } from 'react'
import type { SourceLanguage } from '@/lib/queries'
import { LANGUAGE_LABEL } from './language'

const OPTIONS = ['java', 'csharp'] as const

/**
 * Java / C# segmented control built from native radio inputs, so keyboard
 * (arrow keys) and screen readers work without extra code.
 */
export function LanguageToggle({
  value,
  onChange,
  legend,
  size = 'md',
  className = '',
}: {
  value: SourceLanguage
  onChange: (language: 'java' | 'csharp') => void
  legend: string
  size?: 'md' | 'sm'
  className?: string
}) {
  const name = useId()
  const pad = size === 'md' ? 'min-h-12 text-[15px]' : 'min-h-11 text-sm'
  return (
    <fieldset className={className}>
      <legend className="sr-only">{legend}</legend>
      <div className="border-line bg-subtle grid grid-cols-2 gap-1 rounded-xl border p-1">
        {OPTIONS.map((option) => (
          <label key={option} className="relative">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={`${pad} text-body hover:text-ink peer-checked:bg-invert peer-checked:text-on-invert peer-focus-visible:outline-brand-a flex cursor-pointer items-center justify-center rounded-[9px] px-4 font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2`}
            >
              {LANGUAGE_LABEL[option]}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
