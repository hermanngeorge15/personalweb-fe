/**
 * Difficulty is shown as text plus a coloured dot and 1–4 pips, so colour is
 * never the only signal. Colours come from the theme tokens.
 */
export const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
] as const

const DOT: Record<string, string> = {
  beginner: 'bg-brand-b',
  intermediate: 'bg-brand-a',
  advanced: 'bg-danger',
  expert: 'bg-ink',
}

const BORDER: Record<string, string> = {
  beginner: 'border-brand-b',
  intermediate: 'border-brand-a',
  advanced: 'border-danger',
  expert: 'border-ink',
}

export function difficultyDotClass(difficulty: string): string {
  return DOT[difficulty] ?? 'bg-fainter'
}

export function difficultyBorderClass(difficulty: string): string {
  return BORDER[difficulty] ?? 'border-line-strong'
}

function difficultyRank(difficulty: string): number {
  const index = DIFFICULTY_LEVELS.indexOf(
    difficulty as (typeof DIFFICULTY_LEVELS)[number],
  )
  return index === -1 ? 0 : index + 1
}

/** Small pill: coloured dot + label (e.g. "beginner"). */
export function DifficultyBadge({
  difficulty,
  className = '',
}: {
  difficulty: string
  className?: string
}) {
  return (
    <span
      className={`border-line-strong text-body inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] leading-none capitalize ${className}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${difficultyDotClass(difficulty)}`}
      />
      {difficulty}
    </span>
  )
}

/** Four pips, filled up to the level. Decorative; pair it with the text label. */
export function DifficultyPips({ difficulty }: { difficulty: string }) {
  const rank = difficultyRank(difficulty)
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-[3px]">
      {DIFFICULTY_LEVELS.map((level, index) => (
        <span
          key={level}
          className={`h-2.5 w-1 rounded-full ${index < rank ? difficultyDotClass(difficulty) : 'bg-line-strong'}`}
        />
      ))}
    </span>
  )
}
