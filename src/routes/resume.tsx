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
      <section className="grid gap-8 md:gap-12">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8 shadow-sm ring-1 ring-black/5 backdrop-blur md:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-teal-400/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                Resume
              </h1>
              <p className="mt-2 text-base text-gray-600">
                Backend Software Engineer • Kotlin & Spring Boot Expert
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
        {(projects.isLoading ||
          languages.isLoading ||
          education.isLoading ||
          certificates.isLoading ||
          hobbies.isLoading) && <div>Loading…</div>}
        {(projects.isError ||
          languages.isError ||
          education.isError ||
          certificates.isError ||
          hobbies.isError) && <div>Failed to load resume.</div>}
        {
          <div>
            {/* Projects */}
            {projects.data && projects.data.length > 0 && (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Professional Experience</h2>
                </div>
                <ul className="grid gap-6">
                  {projects.data
                    .sort((a, b) => {
                      const dateA = a.startAt ? new Date(a.startAt).getTime() : 0
                      const dateB = b.startAt ? new Date(b.startAt).getTime() : 0
                      return dateB - dateA // Most recent first
                    })
                    .map((p) => {
                    const company = p.company || '—'
                    const projectName = p.projectName || ''
                    const formatDate = (value?: string) => {
                      if (!value || value.trim() === '') return ''
                      const d = new Date(value)
                      return d.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })
                    }
                    const start = formatDate(p.startAt)
                    const endDate = formatDate(p.endAt)
                    const end = endDate || 'Present'
                    const hasAnyDates = Boolean(start)
                    return (
                      <li key={p.id}>
                        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg md:p-8">
                          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100/50 to-cyan-100/50 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
                          <div className="relative">
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                              <div className="flex-1">
                                <div className="text-xl font-bold text-gray-900">
                                  {company}
                                </div>
                                {projectName && (
                                  <div className="mt-1 text-base font-medium text-cyan-600">
                                    {projectName}
                                  </div>
                                )}
                              </div>
                              {hasAnyDates && (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {start}
                                  {start && ' – '}
                                  {end}
                                </div>
                              )}
                            </div>
                            {p.description && (
                              <p className="mt-4 text-base leading-relaxed text-gray-700">
                                {p.description}
                              </p>
                            )}
                            {p.responsibilities &&
                              p.responsibilities.length > 0 && (
                                <div className="mt-5">
                                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Key Responsibilities
                                  </div>
                                  <ul className="space-y-1.5 text-[15px] text-gray-700">
                                    {p.responsibilities.map((r, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                        <span>{r}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            {p.techStack && p.techStack.length > 0 && (
                              <div className="mt-5">
                                <div className="mb-2.5 text-sm font-semibold text-gray-900">
                                  Tech Stack
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {p.techStack.map((t, idx) => (
                                    <span
                                      key={idx}
                                      className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-200/50 transition-all hover:ring-blue-300"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {(p.repoUrl || p.demoUrl) && (
                              <div className="mt-5 flex flex-wrap gap-3">
                                {p.repoUrl && (
                                  <a
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                                    href={p.repoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.13-4.55-5 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.04A9.27 9.27 0 0112 7.49c.85 0 1.7.12 2.5.35 1.9-1.31 2.74-1.04 2.74-1.04.55 1.41.2 2.45.1 2.71.64.71 1.02 1.62 1.02 2.73 0 3.88-2.34 4.73-4.57 4.99.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.58.69.48A10.01 10.01 0 0022 12.26C22 6.58 17.52 2 12 2z" />
                                    </svg>
                                    Repository
                                  </a>
                                )}
                                {p.demoUrl && (
                                  <a
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-md"
                                    href={p.demoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View Demo
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}

            {/* Education */}
            {education.data && education.data.length > 0 && (
              <section className="mt-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                </div>
                <div className="grid gap-4">
                  {education.data
                    .sort((a, b) => {
                      const dateA = a.since ? new Date(a.since).getTime() : 0
                      const dateB = b.since ? new Date(b.since).getTime() : 0
                      return dateB - dateA // Most recent first
                    })
                    .map((e) => (
                    <div key={e.id} className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-6 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <div className="font-semibold text-gray-900">{e.institution}</div>
                      {e.degree && <div className="mt-1 text-sm text-gray-600">{e.degree}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certificates */}
            {certificates.data && certificates.data.length > 0 && (
              <section className="mt-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Certificates</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {certificates.data
                    .sort((a, b) => {
                      const dateA = a.startAt ? new Date(a.startAt).getTime() : 0
                      const dateB = b.startAt ? new Date(b.startAt).getTime() : 0
                      return dateB - dateA // Most recent first
                    })
                    .map((c) => (
                    <div key={c.id} className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-5 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <div className="font-semibold text-gray-900">{c.name}</div>
                      {c.issuer && <div className="mt-1 text-sm text-gray-600">{c.issuer}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.data && languages.data.length > 0 && (
              <section className="mt-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Languages</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {languages.data.map((l) => (
                    <div key={l.id} className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50/50 to-white p-5 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <div className="font-semibold text-gray-900">{l.name}</div>
                      {l.level && (
                        <div className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {l.level}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Hobbies */}
            {hobbies.data && (
              <section className="mt-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Hobbies & Interests</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {hobbies.data.sports && hobbies.data.sports.length > 0 && (
                    <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/50 to-white p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
                      <div className="mb-3 flex items-center gap-2">
                        <svg className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-semibold text-gray-900">Sports</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hobbies.data.sports.map((sport, idx) => (
                          <span key={idx} className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700">
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {hobbies.data.others && hobbies.data.others.length > 0 && (
                    <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
                      <div className="mb-3 flex items-center gap-2">
                        <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="font-semibold text-gray-900">Other Interests</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hobbies.data.others.map((other, idx) => (
                          <span key={idx} className="rounded-full bg-rose-100 px-3 py-1 text-sm text-rose-700">
                            {other}
                          </span>
                        ))}
                      </div>
                    </div>
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
