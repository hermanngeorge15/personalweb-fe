import type { PropsWithChildren, ReactNode } from 'react'
import type {
  ResumeCertificate,
  ResumeEducation,
  ResumeHobbies,
  ResumeLanguage,
  ResumeProject,
} from '@/lib/queries'
import { ExternalLinkIcon, GitHubIcon } from '@/components/icons'
import { PostCover } from '@/components/blog/PostCover'
import { formatRange, formatYear, sortByDateDesc } from './format'

/** Side-column card (Skills, Education, …) on /resume. */
export function AsideCard({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section className="border-line bg-subtle rounded-2xl border p-6">
      <h2 className="text-heading text-lg font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="border-line-strong text-body rounded-md border px-2 py-0.5 font-mono text-[13px]">
      {children}
    </li>
  )
}

function ProjectLink({
  href,
  icon,
  children,
}: PropsWithChildren<{ href: string; icon: ReactNode }>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="border-line-strong text-ink hover:bg-chip inline-flex min-h-11 items-center gap-2 rounded-[10px] border px-4 text-sm font-medium transition-colors"
    >
      {icon}
      {children}
    </a>
  )
}

/** One job/project on the experience timeline. */
function ExperienceItem({
  project,
  current,
}: {
  project: ResumeProject
  current: boolean
}) {
  const dates = formatRange(project.startAt, project.endAt)
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={`border-page absolute top-7 -left-[27px] size-[13px] rounded-full border-2 sm:-left-[35px] ${
          current ? 'bg-brand-gradient' : 'bg-window-dot'
        }`}
      />
      <article className="border-line bg-card rounded-2xl border p-5 sm:px-6 sm:py-[22px]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-heading text-[19px] font-semibold tracking-[-0.01em]">
            {project.company || '—'}
          </h3>
          {dates && (
            <span className="text-faint font-mono text-[13px]">{dates}</span>
          )}
        </div>
        {project.projectName && (
          <p className="text-brand-a mt-1 text-[15px] font-medium">
            {project.projectName}
          </p>
        )}
        {project.description && (
          <p className="text-body mt-2.5 text-[15px] leading-relaxed">
            {project.description}
          </p>
        )}
        {project.responsibilities && project.responsibilities.length > 0 && (
          <div className="mt-4">
            <h4 className="text-heading text-sm font-semibold">
              Key Responsibilities
            </h4>
            <ul className="text-body marker:text-faint mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
              {project.responsibilities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {project.techStack && project.techStack.length > 0 && (
          <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech, idx) => (
              <Chip key={idx}>{tech}</Chip>
            ))}
          </ul>
        )}
        <ProjectLinks project={project} />
      </article>
    </li>
  )
}

/** "Česká spořitelna" → "ceska-sporitelna", for the cover's window path. */
function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * The current role as a large two-column card, styled like the featured post on /blog:
 * generated window cover on one side, role details on the other.
 */
export function FeaturedRoleCard({ project }: { project: ResumeProject }) {
  const dates = formatRange(project.startAt, project.endAt)
  const slug = slugify(project.company || 'current-role')
  const stack = project.techStack ?? []
  return (
    <article className="border-line bg-card flex flex-wrap overflow-hidden rounded-[20px] border">
      <PostCover
        post={{ slug, tags: stack.slice(0, 3) }}
        path={`~/resume/${slug}`}
        size="featured"
        className="flex-[1_1_520px]"
      />
      <div className="flex flex-[1_1_420px] flex-col justify-center p-6 sm:p-12">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="bg-brand-gradient-x text-on-brand rounded-full px-2.5 py-1">
            Current role
          </span>
          {dates && (
            <span className="border-line-strong text-body rounded-full border px-2.5 py-1 font-mono">
              {dates}
            </span>
          )}
        </div>
        <h3 className="text-heading mt-5 text-[28px] leading-[1.12] font-semibold tracking-[-0.025em] sm:text-4xl">
          {project.company || '—'}
        </h3>
        {project.projectName && (
          <p className="text-brand-a mt-2 text-[17px] font-medium">
            {project.projectName}
          </p>
        )}
        {project.description && (
          <p className="text-muted mt-3.5 text-[17px] leading-relaxed">
            {project.description}
          </p>
        )}
        {project.responsibilities && project.responsibilities.length > 0 && (
          <ul className="text-body marker:text-faint mt-4 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed">
            {project.responsibilities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        {stack.length > 0 && (
          <ul aria-label="Tech stack" className="mt-6 flex flex-wrap gap-1.5">
            {stack.map((tech, idx) => (
              <Chip key={idx}>{tech}</Chip>
            ))}
          </ul>
        )}
        <ProjectLinks project={project} />
      </div>
    </article>
  )
}

/** Repository and demo links of a role, when the API has them. */
function ProjectLinks({ project }: { project: ResumeProject }) {
  if (!project.repoUrl && !project.demoUrl) return null
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {project.repoUrl && (
        <ProjectLink href={project.repoUrl} icon={<GitHubIcon size={16} />}>
          Repository
        </ProjectLink>
      )}
      {project.demoUrl && (
        <ProjectLink
          href={project.demoUrl}
          icon={<ExternalLinkIcon size={16} />}
        >
          View Demo
        </ProjectLink>
      )}
    </div>
  )
}

/** Experience timeline, newest first. The open-ended (current) role gets the brand dot. */
export function ExperienceTimeline({
  projects,
}: {
  projects: ResumeProject[]
}) {
  const sorted = sortByDateDesc(projects, (p) => p.startAt)
  return (
    <ol className="border-line-strong mt-6 flex flex-col gap-5 border-l pl-5 sm:pl-7">
      {sorted.map((project, idx) => (
        <ExperienceItem
          key={project.id}
          project={project}
          current={idx === 0 && !project.endAt}
        />
      ))}
    </ol>
  )
}

/** Every technology listed across the roles, most used first (case-insensitive de-dupe). */
export function TechSummary({ projects }: { projects: ResumeProject[] }) {
  const counts = new Map<string, { label: string; count: number }>()
  for (const project of projects) {
    for (const tech of project.techStack ?? []) {
      const key = tech.trim().toLowerCase()
      if (!key) continue
      const entry = counts.get(key)
      if (entry) entry.count += 1
      else counts.set(key, { label: tech.trim(), count: 1 })
    }
  }
  const techs = [...counts.values()].sort((a, b) => b.count - a.count)
  if (techs.length === 0) return null
  return (
    <AsideCard title="Skills">
      <p className="text-faint text-[13px]">Tech used across the roles</p>
      <p className="text-body mt-1.5 text-sm leading-relaxed">
        {techs.map((t) => t.label).join(' · ')}
      </p>
    </AsideCard>
  )
}

export function EducationList({ items }: { items: ResumeEducation[] }) {
  const sorted = sortByDateDesc(items, (e) => e.since)
  return (
    <AsideCard title="Education">
      <ul className="flex flex-col gap-4 text-sm leading-normal">
        {sorted.map((e) => {
          const years = formatRange(e.since, e.expectedUntil, formatYear, '')
          const title = [e.degree || e.field, years].filter(Boolean).join(' · ')
          return (
            <li key={e.id}>
              {title && <p className="text-heading font-semibold">{title}</p>}
              {e.institution && <p className="text-muted">{e.institution}</p>}
              {e.degree && e.field && <p className="text-muted">{e.field}</p>}
              {e.thesisTitle && (
                <p className="text-faint mt-1">Thesis: {e.thesisTitle}</p>
              )}
              {e.thesisDescription && (
                <p className="text-faint">{e.thesisDescription}</p>
              )}
            </li>
          )
        })}
      </ul>
    </AsideCard>
  )
}

export function CertificateList({ items }: { items: ResumeCertificate[] }) {
  const sorted = sortByDateDesc(items, (c) => c.startAt)
  return (
    <AsideCard title="Certificates">
      <ul className="flex flex-col gap-3 text-sm leading-normal">
        {sorted.map((c) => {
          const dates = formatRange(c.startAt, c.endAt, undefined, '')
          const meta = [c.description, c.issuer, dates, c.certificateId]
            .filter(Boolean)
            .join(' · ')
          return (
            <li key={c.id}>
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link font-medium underline-offset-4 hover:underline"
                >
                  {c.name}
                </a>
              ) : (
                <p className="text-ink font-medium">{c.name}</p>
              )}
              {meta && <p className="text-faint text-[13px]">{meta}</p>}
            </li>
          )
        })}
      </ul>
    </AsideCard>
  )
}

export function LanguageList({ items }: { items: ResumeLanguage[] }) {
  return (
    <AsideCard title="Languages">
      <dl className="flex flex-col gap-2.5 text-sm">
        {items.map((l) => (
          <div key={l.id} className="flex justify-between gap-4">
            <dt className="text-ink">{l.name}</dt>
            {l.level && <dd className="text-faint">{l.level}</dd>}
          </div>
        ))}
      </dl>
    </AsideCard>
  )
}

function Pills({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-faint text-[13px]">{label}</h3>
      <ul className="mt-2 flex flex-wrap gap-2 text-sm">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="border-line-strong text-body rounded-full border px-2.5 py-1"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HobbyList({ hobbies }: { hobbies: ResumeHobbies }) {
  const sports = hobbies.sports ?? []
  const others = hobbies.others ?? []
  if (sports.length === 0 && others.length === 0) return null
  return (
    <AsideCard title="Hobbies & Interests">
      <div className="flex flex-col gap-4">
        {sports.length > 0 && <Pills label="Sports" items={sports} />}
        {others.length > 0 && <Pills label="Other Interests" items={others} />}
      </div>
    </AsideCard>
  )
}
