import { twMerge } from 'tailwind-merge'
import {
  formatReleaseMonth,
  projectUrl,
  type ProjectEntry,
  type ProjectLanguage,
} from '@/config/projects'

const dotByLanguage: Record<ProjectLanguage, string> = {
  Rust: 'bg-ink',
  Kotlin: 'bg-brand-gradient',
  TypeScript: 'bg-brand-a',
}

/** Small coloured dot that marks a project's language. Decorative. */
export function LanguageDot({
  language,
  className,
}: {
  language: ProjectLanguage
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        'size-2 shrink-0 rounded-full',
        dotByLanguage[language],
        className,
      )}
    />
  )
}

/**
 * A released UnityInFlow tool, linking to its GitHub repo. `full` adds the
 * distribution + release month footer (Projects page); `compact` clamps the
 * description (Home).
 */
export function ProjectCard({
  project,
  variant = 'full',
  className,
}: {
  project: ProjectEntry
  variant?: 'full' | 'compact'
  className?: string
}) {
  return (
    <a
      href={projectUrl(project.name)}
      target="_blank"
      rel="noopener noreferrer"
      className={twMerge(
        'border-line bg-card hover:border-line-strong group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-colors sm:p-7',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="bg-brand-a/10 pointer-events-none absolute -top-20 -right-20 size-48 rounded-full blur-3xl"
      />
      <div className="relative flex items-center justify-between gap-3 font-mono text-xs">
        <span className="text-faint inline-flex items-center gap-2">
          <LanguageDot language={project.language} />
          {project.language}
        </span>
        <span className="bg-brand-b/10 text-brand-b rounded-md px-2 py-[3px]">
          {project.version}
        </span>
      </div>
      <h3 className="text-heading relative mt-4 text-lg font-semibold tracking-[-0.015em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:mt-[18px] sm:text-[21px]">
        {project.name}
        <span className="sr-only"> (GitHub repository)</span>
      </h3>
      <p
        className={twMerge(
          'text-muted relative mt-2 flex-1 text-[15px] leading-relaxed sm:mt-2.5',
          variant === 'compact' && 'line-clamp-3',
        )}
      >
        {project.description}
      </p>
      {variant === 'full' && (
        <div className="border-line text-faint relative mt-5 flex flex-wrap justify-between gap-x-3 gap-y-1 border-t pt-4 text-[13px]">
          <span>{project.distribution}</span>
          <span>Released {formatReleaseMonth(project.released)}</span>
        </div>
      )}
    </a>
  )
}
