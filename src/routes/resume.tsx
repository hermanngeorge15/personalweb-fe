import AppShell from '@/components/AppShell'
import {
  useResumeProjects,
  useResumeLanguages,
  useResumeEducation,
  useResumeCertificates,
  useResumeHobbies,
} from '@/lib/queries'
import { useEffect, useState } from 'react'
import { Link, Outlet, useChildMatches } from '@tanstack/react-router'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { downloadCV } from '@/lib/download'
import { AUTHOR, SOCIAL_LINKS } from '@/config/site'
import {
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MapPinIcon,
  PrinterIcon,
  SpinnerIcon,
} from '@/components/icons'
import {
  CertificateList,
  EducationList,
  ExperienceTimeline,
  FeaturedRoleCard,
  HobbyList,
  LanguageList,
  TechSummary,
} from '@/components/resume/ResumeSections'
import profileAvatar from '@/assets/images/profile-avatar.jpg'
import { sortByDateDesc } from '@/components/resume/format'

const section = 'relative mx-auto max-w-[1200px] px-4 sm:px-8'

const metaLink =
  'text-link inline-flex min-h-11 items-center gap-1.5 underline-offset-4 hover:underline sm:min-h-0'

function Hero({
  isDownloading,
  onDownload,
}: {
  isDownloading: boolean
  onDownload: () => void
}) {
  return (
    <section
      className={`${section} pt-16 pb-4 text-center sm:pt-[88px] sm:pb-6`}
    >
      <img
        src={profileAvatar}
        alt={AUTHOR.name}
        width={88}
        height={88}
        className="border-window-line mx-auto size-[72px] rounded-full border object-cover sm:size-[88px]"
      />
      <span className="border-line-strong bg-chip/60 text-body mt-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px]">
        <span aria-hidden="true" className="bg-brand-b size-1.5 rounded-full" />
        Resume · {AUTHOR.name}
      </span>
      <h1 className="text-heading mx-auto mt-6 max-w-[860px] text-[40px] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-[52px] lg:text-[64px]">
        Backend Software Engineer{' '}
        <span className="text-brand-gradient">
          Kotlin &amp; Spring Boot Expert
        </span>
      </h1>
      <ul className="text-faint mt-5 flex flex-wrap items-center justify-center gap-x-5 text-sm">
        <li className="inline-flex min-h-11 items-center gap-1.5 sm:min-h-0">
          <MapPinIcon size={16} />
          Prague, Czech Republic
        </li>
        {SOCIAL_LINKS.linkedin && (
          <li>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={metaLink}
            >
              <LinkedInIcon size={16} />
              LinkedIn
            </a>
          </li>
        )}
        {SOCIAL_LINKS.github && (
          <li>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className={metaLink}
            >
              <GitHubIcon size={16} />
              GitHub
            </a>
          </li>
        )}
      </ul>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          aria-busy={isDownloading}
          className="bg-brand-gradient-x text-on-brand inline-flex min-h-11 items-center gap-2 rounded-[10px] px-5 text-[15px] font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDownloading ? (
            <>
              <SpinnerIcon
                size={16}
                className="animate-spin motion-reduce:animate-none"
              />
              Downloading...
            </>
          ) : (
            <>
              <DownloadIcon size={16} />
              Download PDF
            </>
          )}
        </button>
        <Link
          to="/resume/print"
          className="border-window-line text-ink hover:bg-chip inline-flex min-h-11 items-center gap-2 rounded-[10px] border px-5 text-[15px] font-medium transition-colors"
        >
          <PrinterIcon size={16} />
          Print
        </Link>
      </div>
    </section>
  )
}

function StatusBox({ title, detail }: { title: string; detail?: string }) {
  return (
    <div
      role="status"
      className="border-line bg-subtle rounded-[20px] border px-6 py-14 text-center"
    >
      <p className="text-heading text-lg font-semibold">{title}</p>
      {detail && <p className="text-faint mt-2 text-sm">{detail}</p>}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading resume"
      className="flex flex-col gap-5"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="border-line bg-card flex animate-pulse flex-col gap-3 rounded-2xl border p-6 motion-reduce:animate-none"
        >
          <div className="bg-chip h-5 w-2/5 rounded-lg" />
          <div className="bg-chip h-4 w-1/3 rounded-lg" />
          <div className="bg-chip h-4 w-4/5 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

function ContactCta() {
  return (
    <section className={`${section} pb-24`}>
      <div className="border-line bg-cta-glow flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] border p-6 sm:p-12">
        <div className="flex-[1_1_420px]">
          <h2 className="text-heading text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] sm:text-[30px]">
            Get in Touch
          </h2>
          <p className="text-muted mt-2.5 max-w-[520px] text-base leading-relaxed">
            Have a project in mind? Let&apos;s build something great together.
          </p>
        </div>
        <Link
          to="/contact"
          className="bg-brand-gradient-x text-on-brand inline-flex min-h-11 items-center rounded-[10px] px-5 text-[15px] font-medium transition-opacity hover:opacity-90"
        >
          Contact me
        </Link>
      </div>
    </section>
  )
}

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

  // The open-ended newest role is featured on its own card; the timeline lists the rest.
  const sortedProjects = projects.data
    ? sortByDateDesc(projects.data, (p) => p.startAt)
    : []
  const currentRole =
    sortedProjects[0] && !sortedProjects[0].endAt ? sortedProjects[0] : null
  const earlierRoles = currentRole ? sortedProjects.slice(1) : sortedProjects

  const queries = [projects, languages, education, certificates, hobbies]
  const isLoading = queries.some((q) => q.isLoading)
  const isError = queries.some((q) => q.isError)

  const hasAside = Boolean(
    (projects.data && projects.data.length > 0) ||
      (education.data && education.data.length > 0) ||
      (certificates.data && certificates.data.length > 0) ||
      (languages.data && languages.data.length > 0) ||
      hobbies.data,
  )

  return (
    <AppShell path="Resume" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[300px] left-1/2 h-[600px] w-[1100px] -translate-x-1/2 opacity-75"
      />
      <Hero isDownloading={isDownloading} onDownload={handleDownloadPDF} />

      {currentRole && (
        <section
          aria-labelledby="current-role-heading"
          className={`${section} pt-10 sm:pt-12`}
        >
          <h2 id="current-role-heading" className="sr-only">
            Current role
          </h2>
          <FeaturedRoleCard project={currentRole} />
        </section>
      )}

      <div
        className={`${section} flex flex-wrap items-start gap-12 pt-12 pb-16 sm:pt-14 sm:pb-[72px]`}
      >
        <section
          aria-labelledby="experience-heading"
          className="min-w-0 flex-[999_1_600px]"
        >
          <h2
            id="experience-heading"
            className="text-heading text-[26px] font-semibold tracking-[-0.02em]"
          >
            {currentRole ? 'Earlier experience' : 'Professional Experience'}
          </h2>
          {isError && (
            <div className="mt-6">
              <StatusBox
                title="Failed to load resume."
                detail="Please try again later"
              />
            </div>
          )}
          {isLoading && !projects.data && (
            <div className="mt-6">
              <LoadingSkeleton />
            </div>
          )}
          {earlierRoles.length > 0 && (
            <ExperienceTimeline projects={earlierRoles} />
          )}
        </section>

        {hasAside && (
          <aside
            aria-label="Skills, education and more"
            className="flex min-w-0 flex-[1_1_340px] flex-col gap-5"
          >
            {projects.data && <TechSummary projects={projects.data} />}
            {education.data && education.data.length > 0 && (
              <EducationList items={education.data} />
            )}
            {certificates.data && certificates.data.length > 0 && (
              <CertificateList items={certificates.data} />
            )}
            {languages.data && languages.data.length > 0 && (
              <LanguageList items={languages.data} />
            )}
            {hobbies.data && <HobbyList hobbies={hobbies.data} />}
          </aside>
        )}
      </div>

      <ContactCta />
    </AppShell>
  )
}

/**
 * /resume/print (routes/resume.print.tsx) is a child of this route, so it only renders through
 * an <Outlet />. Without this switch /resume/print showed the normal resume page instead.
 */
function ResumeRoute() {
  const childMatches = useChildMatches()
  return childMatches.length > 0 ? <Outlet /> : <ResumePage />
}

export const Route = createFileRoute({
  component: ResumeRoute,
})
