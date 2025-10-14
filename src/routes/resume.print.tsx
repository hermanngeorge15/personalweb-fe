import AppShell from '@/components/AppShell'
import {
  useResumeProjects,
  useResumeLanguages,
  useResumeEducation,
  useResumeCertificates,
} from '@/lib/queries'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'

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
    const ready = !projects.isLoading && !languages.isLoading && !education.isLoading && !certificates.isLoading
    if (ready) {
      setTimeout(() => window.print(), 300)
    }
  }, [projects.isLoading, languages.isLoading, education.isLoading, certificates.isLoading])

  const fmt = (value?: string) =>
    value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ''

  return (
    <AppShell path="Resume / Print">
      <section
        className="mx-auto grid max-w-[794px] gap-4 rounded border bg-white p-6 shadow print:max-w-[794px] print:rounded-none print:border-0 print:p-0 print:shadow-none"
      >
        <header className="grid gap-1 border-b pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
          <p className="text-muted-foreground text-sm">Generated from live data</p>
        </header>

        {/* Experience / Projects */}
        {projects.data && projects.data.length > 0 && (
          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">Experience</h2>
            <ul className="grid gap-3">
              {projects.data.map((p) => {
                const company = p.company || '—'
                const proj = p.projectName || ''
                const start = fmt(p.from)
                const end = p.until ? fmt(p.until) : 'Present'
                return (
                  <li key={p.id} className="break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <div className="font-medium">{company}</div>
                        {proj && <div className="text-muted-foreground text-sm">{proj}</div>}
                      </div>
                      <div className="text-muted-foreground text-sm">{start}{start && ' – '}{end}</div>
                    </div>
                    {p.description && (
                      <p className="mt-1 text-[13px] leading-snug">{p.description}</p>
                    )}
                    {p.responsibilities && p.responsibilities.length > 0 && (
                      <ul className="mt-1 list-disc pl-5 text-[13px] leading-snug">
                        {p.responsibilities.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    )}
                    {p.techStack && p.techStack.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                        {p.techStack.map((t, i) => (
                          <span key={i} className="rounded border px-1.5 py-0.5">{t}</span>
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
            <h2 className="text-lg font-semibold">Education</h2>
            <ul className="grid gap-2">
              {education.data.map((e) => (
                <li key={e.id} className="break-inside-avoid flex items-baseline justify-between">
                  <div>
                    <div className="font-medium">{e.institution}</div>
                    <div className="text-muted-foreground text-sm">{e.degree || e.field}</div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {fmt(e.since)}{e.since && ' – '}{fmt(e.expectedUntil)}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certificates */}
        {certificates.data && certificates.data.length > 0 && (
          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">Certificates</h2>
            <ul className="grid gap-2">
              {certificates.data.map((c) => (
                <li key={c.id} className="break-inside-avoid flex items-baseline justify-between">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-muted-foreground text-sm">{c.issuer}</div>
                  </div>
                  <div className="text-muted-foreground text-sm">{fmt(c.from)}{c.from && ' – '}{fmt(c.to)}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {languages.data && languages.data.length > 0 && (
          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">Languages</h2>
            <ul className="grid gap-1">
              {languages.data.map((l) => (
                <li key={l.id} className="break-inside-avoid">{l.name}{l.level ? ` — ${l.level}` : ''}</li>
              ))}
            </ul>
          </section>
        )}
      </section>
      <style>
        {`@media print {
          @page { size: A4; margin: 14mm; }
          body { background: white; }
          header, nav, footer { display: none !important; }
          .break-inside-avoid { break-inside: avoid; }
        }`}
      </style>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: PrintResumePage,
})


