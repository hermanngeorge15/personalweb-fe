import AppShell from '@/components/AppShell'
import { useParams, Link } from '@tanstack/react-router'
import { usePost } from '@/lib/queries'
import MDXContent from '@/components/MDXContent'
import { useEffect, useState } from 'react'
import { SEO_DEFAULTS, setHead, setJsonLd } from '@/lib/seo'
import { MotionSection } from '@/components/MotionSection'
import { Button } from '@heroui/react'
import { 
  formatDate, 
  calculateReadingTime, 
  shareOnTwitter, 
  shareOnLinkedIn, 
  copyToClipboard 
} from '@/lib/blog-utils'

function BlogPost() {
  const { slug } = useParams({ from: '/blog/$slug' })
  const { data, isLoading, isError } = usePost(slug)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (data?.title) {
      const canonicalUrl = `${SEO_DEFAULTS.siteUrl}/blog/${slug}`
      setHead({
        title: `${data.title} — ${SEO_DEFAULTS.siteName}`,
        canonical: canonicalUrl,
        og: {
          title: `${data.title} — ${SEO_DEFAULTS.siteName}`,
          url: canonicalUrl,
        },
        twitter: {
          card: 'summary',
          title: `${data.title} — ${SEO_DEFAULTS.siteName}`,
        },
      })
      setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.title,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        author: { '@type': 'Person', name: 'Jiří Hermann' },
        publisher: { '@type': 'Organization', name: SEO_DEFAULTS.siteName },
      })
    }
  }, [data?.title, slug])

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const readingTime = data?.mdx ? calculateReadingTime(data.mdx) : 5

  return (
    <AppShell path="Blog / Post">
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading post...</p>
          </div>
        </div>
      )}
      
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-red-900">Failed to load post</h3>
          <p className="mt-2 text-sm text-red-600">This post may not exist or there was an error loading it.</p>
          <Button
            as={Link}
            to="/blog"
            className="mt-6"
            variant="bordered"
          >
            ← Back to Blog
          </Button>
        </div>
      )}
      
      {data && (
        <div className="grid gap-8">
          {/* Back Button */}
          <div>
            <Button
              as={Link}
              to="/blog"
              variant="light"
              className="hover:underline"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Button>
          </div>

          <MotionSection variant="fade-up">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white/40 p-8 shadow-lg ring-1 ring-blue-500/10 backdrop-blur md:p-12">
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 via-cyan-400/10 to-teal-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-tr from-green-400/20 via-emerald-400/10 to-teal-400/10 blur-3xl" />
              
              <div className="relative">
                <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                  <span className="bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                    {data.title}
                  </span>
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {data.publishedAt && (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{formatDate(data.publishedAt)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Jiri Hermann</span>
                  </div>
                </div>

                {data.tags && data.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Share:</span>
                  <button
                    onClick={() => shareOnTwitter(data.title, window.location.href)}
                    className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-gray-800"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter
                  </button>
                  <button
                    onClick={() => shareOnLinkedIn(window.location.href)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0077B5] px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-[#006399]"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8 8h3.8v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.15V23h-4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.98V23h-4V8z"/>
                    </svg>
                    LinkedIn
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:scale-105 hover:bg-gray-50"
                  >
                    {copied ? (
                      <>
                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </MotionSection>

          {/* Article Content */}
          <MotionSection variant="fade-up">
            <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg prose-img:shadow-lg">
              <MDXContent code={data.mdx} />
            </article>
          </MotionSection>

          {/* Author Bio */}
          <MotionSection variant="fade-up">
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white/60 to-gray-50/60 p-8 backdrop-blur">
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 text-3xl font-bold text-white">
                  JH
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">About the Author</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Jiri Hermann is a product-focused full-stack engineer specializing in frontend and user experience. 
                    Building performant, accessible interfaces and robust systems that scale.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <a href="https://www.linkedin.com/in/your-handle" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                      Follow on LinkedIn →
                    </a>
                    <a href="https://github.com/your-handle" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                      GitHub →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </MotionSection>

          {/* Back to Blog CTA */}
          <div className="flex justify-center pt-8">
            <Button
              as={Link}
              to="/blog"
              color="primary"
              size="lg"
              className="font-medium"
            >
              ← See All Posts
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: BlogPost,
})
