import AppShell from '@/components/AppShell'
import {
  useResumeProjects,
  useResumeLanguages,
  useResumeEducation,
  useResumeCertificates,
} from '@/lib/queries'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { AUTHOR } from '@/config/site'
import { formatRange, sortByDateDesc } from '@/components/resume/format'

const heading = 'text-heading border-line border-b pb-1 text-lg font-semibold'

function PrintResumePage() {
  const projects = useResumeProjects()
  const languages = useResumeLanguages()
  const education = useResumeEducation()
  const certificates = useResumeCertificates()

  useEffect(() => {
    setHead({
      title: `Resume (PDF) — ${SEO_DEFAULTS.siteName}`,
      description: SEO_DEFAULTS.description,
      canonical: `${SEO_DEFAULTS.siteUrl}/resume/print`,
    })
    // Open print dialog automatically when all data is loaded
    const ready =
      !projects.isLoading &&
      !languages.isLoading &&
      !education.isLoading &&
      !certificates.isLoading
    if (ready) {
      setTimeout(() => window.print(), 300)
    }
  }, [
    projects.isLoading,
    languages.isLoading,
    education.isLoading,
    certificates.isLoading,
  ])

  return (
    <AppShell path="Resume / Print" fullBleed>
      <div className="px-4 py-8 sm:px-8 sm:py-12 print:p-0">
        <article className="border-line bg-card text-ink mx-auto grid max-w-[794px] gap-5 rounded-2xl border p-6 sm:p-10 print:max-w-none print:rounded-none print:border-0 print:p-0">
          <div className="border-line-strong grid gap-1 border-b pb-3">
            <h1 className="text-heading text-2xl font-semibold tracking-tight">
              {AUTHOR.name} — Resume
            </h1>
            <p className="text-muted text-sm">
              Backend Software Engineer • Kotlin &amp; Spring Boot Expert
            </p>
            <p className="text-faint text-[13px] print:hidden">
              Generated from live data
            </p>
          </div>

          {/* Experience / Projects */}
          {projects.data && projects.data.length > 0 && (
            <section className="grid gap-2">
              <h2 className={heading}>Experience</h2>
              <ul className="grid gap-3">
                {sortByDateDesc(projects.data, (p) => p.startAt).map((p) => {
                  const dates = formatRange(p.startAt, p.endAt)
                  return (
                    <li key={p.id} className="break-inside-avoid">
                      <div className="flex items-baseline justify-between gap-3">
                        <div>
                          <div className="text-heading font-medium">
                            {p.company || '—'}
                          </div>
                          {p.projectName && (
                            <div className="text-muted text-sm">
                              {p.projectName}
                            </div>
                          )}
                        </div>
                        <div className="text-muted shrink-0 text-sm">
                          {dates}
                        </div>
                      </div>
                      {p.description && (
                        <p className="text-body mt-1 text-[13px] leading-snug">
                          {p.description}
                        </p>
                      )}
                      {p.responsibilities && p.responsibilities.length > 0 && (
                        <ul className="text-body mt-1 list-disc pl-5 text-[13px] leading-snug">
                          {p.responsibilities.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      )}
                      {p.techStack && p.techStack.length > 0 && (
                        <div className="text-body mt-1 flex flex-wrap gap-1 text-[11px]">
                          {p.techStack.map((t, i) => (
                            <span
                              key={i}
                              className="border-line-strong rounded border px-1.5 py-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {/* Education */}
          {education.data && education.data.length > 0 && (
            <section className="grid gap-2">
              <h2 className={heading}>Education</h2>
              <ul className="grid gap-2">
                {sortByDateDesc(education.data, (e) => e.since).map((e) => (
                  <li
                    key={e.id}
                    className="flex break-inside-avoid items-baseline justify-between gap-3"
                  >
                    <div>
                      <div className="text-heading font-medium">
                        {e.institution}
                      </div>
                      <div className="text-muted text-sm">
                        {e.degree || e.field}
                      </div>
                      {e.thesisTitle && (
                        <div className="text-body text-[13px]">
                          Thesis: {e.thesisTitle}
                        </div>
                      )}
                    </div>
                    <div className="text-muted shrink-0 text-sm">
                      {formatRange(e.since, e.expectedUntil, undefined, '')}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certificates */}
          {certificates.data && certificates.data.length > 0 && (
            <section className="grid gap-2">
              <h2 className={heading}>Certificates</h2>
              <ul className="grid gap-2">
                {sortByDateDesc(certificates.data, (c) => c.startAt).map(
                  (c) => (
                    <li
                      key={c.id}
                      className="flex break-inside-avoid items-baseline justify-between gap-3"
                    >
                      <div>
                        <div className="text-heading font-medium">{c.name}</div>
                        {(c.issuer || c.description) && (
                          <div className="text-muted text-sm">
                            {[c.description, c.issuer]
                              .filter(Boolean)
                              .join(' · ')}
                          </div>
                        )}
                      </div>
                      <div className="text-muted shrink-0 text-sm">
                        {formatRange(c.startAt, c.endAt, undefined, '')}
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.data && languages.data.length > 0 && (
            <section className="grid gap-2">
              <h2 className={heading}>Languages</h2>
              <ul className="text-body grid gap-1">
                {languages.data.map((l) => (
                  <li key={l.id} className="break-inside-avoid">
                    {l.name}
                    {l.level ? ` — ${l.level}` : ''}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
      <style>
        {`@media print {
          @page { size: A4; margin: 14mm; }
          :root { color-scheme: light !important; }
          html, body { background: white !important; }
          /* Hide the site chrome (skip link, announcement bar, header, footer): only <main> prints. */
          header, nav, footer, :has(> main#content) > :not(main#content) { display: none !important; }
          .break-inside-avoid { break-inside: avoid; }
        }`}
      </style>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: PrintResumePage,
})
