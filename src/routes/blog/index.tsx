import AppShell from '@/components/AppShell'
import { usePosts } from '@/lib/queries'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { Skeleton } from '@heroui/react'
import { MotionSection } from '@/components/MotionSection'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { H1 } from '@/components/ui/Typography'
import { formatDate } from '@/lib/blog-utils'

function BlogList() {
  const { data, isLoading, isError } = usePosts({ limit: 20 })
  useEffect(() => {
    setHead({
      title: `Blog — ${SEO_DEFAULTS.siteName}`,
      description: SEO_DEFAULTS.description,
      canonical: location.origin + '/blog',
      og: {
        title: `Blog — ${SEO_DEFAULTS.siteName}`,
        url: location.origin + '/blog',
        image: SEO_DEFAULTS.image,
        description: SEO_DEFAULTS.description,
      },
      twitter: {
        card: 'summary',
        title: `Blog — ${SEO_DEFAULTS.siteName}`,
        description: SEO_DEFAULTS.description,
        image: SEO_DEFAULTS.image,
      },
    })
  }, [])
  return (
    <AppShell path="Blog">
      <MotionSection variant="slide-up">
        <section className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white/40 p-6 shadow-lg ring-1 ring-blue-500/10 backdrop-blur md:p-10">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/30 via-cyan-400/20 to-teal-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-green-400/20 via-emerald-400/20 to-teal-400/20 blur-3xl" />
          <div className="relative grid gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <H1 className="bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                Blog
              </H1>
              <span className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent" />
            </div>
            <p className="text-muted-foreground -mt-2">
              Thoughts on software development, design, and technology
            </p>
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardBody>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-5/6" />
                    <div className="mt-4 flex items-center gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-red-600 font-medium">Failed to load posts</p>
              <p className="mt-2 text-sm text-red-500">Please try again later</p>
            </div>
          )}
          {data && data.items.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No posts yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Check back soon for new content!</p>
            </div>
          )}
          {data && data.items.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {data.items.map((p) => (
                <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group">
                  <Card className="h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-xl font-semibold leading-tight group-hover:text-blue-600 transition-colors flex-1">
                          {p.title}
                        </h2>
                        <svg className="h-5 w-5 shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <p className="text-muted-foreground line-clamp-3">{p.excerpt}</p>
                      
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {p.publishedAt && (
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(p.publishedAt)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>5 min read</span>
                        </div>
                      </div>

                      {p.tags && p.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                            >
                              {tag}
                            </span>
                          ))}
                          {p.tags.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                              +{p.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          </div>
        </section>
      </MotionSection>
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: BlogList,
})
