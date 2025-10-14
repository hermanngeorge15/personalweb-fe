import AppShell from '@/components/AppShell'
import {
  useResumeProjects,
  useResumeLanguages,
  useResumeEducation,
  useResumeCertificates,
  useResumeHobbies,
} from '@/lib/queries'
import { useEffect, useState } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { Button } from '@heroui/react'
import { downloadCV } from '@/lib/download'

function ResumePage() {
  const projects = useResumeProjects()
  const languages = useResumeLanguages()
  const education = useResumeEducation()
  const certificates = useResumeCertificates()
  const hobbies = useResumeHobbies()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      await downloadCV('jirihermann', 'eng')
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    setHead({
      title: `Resume — ${SEO_DEFAULTS.siteName}`,
      description: SEO_DEFAULTS.description,
      canonical: `${SEO_DEFAULTS.siteUrl}/resume`,
      og: {
        title: `Resume — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/resume`,
        image: SEO_DEFAULTS.image,
        description: SEO_DEFAULTS.description,
      },
      twitter: {
        card: 'summary',
        title: `Resume — ${SEO_DEFAULTS.siteName}`,
        description: SEO_DEFAULTS.description,
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])
  return (
    <AppShell path="Resume">
      <section className="grid gap-6 md:gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
          <Button
            size="sm"
            variant="bordered"
            onPress={handleDownloadPDF}
            isLoading={isDownloading}
            isDisabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
        {(projects.isLoading || languages.isLoading || education.isLoading || certificates.isLoading || hobbies.isLoading) && (
          <div>Loading…</div>
        )}
        {(projects.isError || languages.isError || education.isError || certificates.isError || hobbies.isError) && (
          <div>Failed to load resume.</div>
        )}
        {
          <div className="prose">
            

            {/* Projects */}
            {projects.data && projects.data.length > 0 && (
              <section>
                <h3>Projects</h3>
                <ul className="grid gap-4">
                  {projects.data.map((p) => {
                    const company = p.company || '—'
                    const projectName = p.projectName || ''
                    const formatDate = (value?: string) => {
                      if (!value) return ''
                      const d = new Date(value)
                      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
                    }
                    const start = formatDate(p.from)
                    const end = p.until ? formatDate(p.until) : 'Present'
                    const hasAnyDates = Boolean(start || end)
                    return (
                      <li key={p.id}>
                        <div className="rounded-xl border bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur">
                          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="text-lg font-semibold">{company}</div>
                              {projectName && (
                                <div className="text-muted-foreground">{projectName}</div>
                              )}
                            </div>
                            {hasAnyDates && (
                              <div className="text-sm text-muted-foreground">
                                {start}
                                {start && ' – '}
                                {end}
                              </div>
                            )}
                          </div>
                          {p.description && (
                            <p className="mt-3 text-[15px] leading-relaxed">{p.description}</p>
                          )}
                          {(p.responsibilities && p.responsibilities.length > 0) && (
                            <div className="mt-3">
                              <div className="text-sm font-medium">Responsibilities</div>
                              <ul className="mt-1 list-disc pl-6 text-[15px]">
                                {p.responsibilities.map((r, idx) => (
                                  <li key={idx}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(p.techStack && p.techStack.length > 0) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {p.techStack.map((t, idx) => (
                                <span key={idx} className="rounded-full border bg-white/60 px-2 py-0.5 text-xs ring-1 ring-black/5 backdrop-blur">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          {(p.repoUrl || p.demoUrl) && (
                            <div className="mt-3 flex gap-3 text-sm">
                              {p.repoUrl && (
                                <a className="underline" href={p.repoUrl} target="_blank" rel="noreferrer">
                                  Repo
                                </a>
                              )}
                              {p.demoUrl && (
                                <a className="underline" href={p.demoUrl} target="_blank" rel="noreferrer">
                                  Demo
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}

            {/* Education */}
            {education.data && education.data.length > 0 && (
              <section>
                <h3>Education</h3>
                <ul>
                  {education.data.map((e) => (
                    <li key={e.id}>
                      <strong>{e.institution}</strong>
                      {e.degree ? ` — ${e.degree}` : ''}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Certificates */}
            {certificates.data && certificates.data.length > 0 && (
              <section>
                <h3>Certificates</h3>
                <ul>
                  {certificates.data.map((c) => (
                    <li key={c.id}>
                      <strong>{c.name}</strong>
                      {c.issuer ? ` — ${c.issuer}` : ''}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {languages.data && languages.data.length > 0 && (
              <section>
                <h3>Languages</h3>
                <ul>
                  {languages.data.map((l) => (
                    <li key={l.id}>
                      <strong>{l.name}</strong>
                      {l.level ? ` — ${l.level}` : ''}
                  </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Hobbies */}
            {hobbies.data && (
              <section>
                <h3>Hobbies</h3>
                <div>
                  {hobbies.data.sports && hobbies.data.sports.length > 0 && (
                    <p>
                      <strong>Sports:</strong> {hobbies.data.sports.join(', ')}
                    </p>
                  )}
                  {hobbies.data.others && hobbies.data.others.length > 0 && (
                    <p>
                      <strong>Other:</strong> {hobbies.data.others.join(', ')}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        }
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: ResumePage,
})
