import AppShell from '@/components/AppShell'
import { useParams, Link } from '@tanstack/react-router'
import { usePost, usePosts, type PostSummary } from '@/lib/queries'
import MDXContent from '@/components/MDXContent'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SEO_DEFAULTS, setHead, setJsonLd } from '@/lib/seo'
import {
  calculateReadingTime,
  formatShortDate,
  isoDate,
  sortByPublishedDesc,
} from '@/lib/blog-utils'
import { AUTHOR, SOCIAL_LINKS } from '@/config/site'
import { AuthorAvatar } from '@/components/Brand'
import { PostCover } from '@/components/blog/PostCover'
import { ShareButtons } from '@/components/blog/ShareButtons'
import {
  TableOfContents,
  type TocHeading,
} from '@/components/blog/TableOfContents'

/** Older and newer neighbours of `slug` in the published list (newest first). */
function useAdjacentPosts(slug: string) {
  // Same query as the /blog page, so the list is usually already cached.
  const { data } = usePosts({ limit: 20 })
  return useMemo(() => {
    const posts = data ? sortByPublishedDesc(data.items) : []
    const index = posts.findIndex((post) => post.slug === slug)
    if (index === -1) return { older: undefined, newer: undefined }
    return { older: posts[index + 1], newer: posts[index - 1] }
  }, [data, slug])
}

function AdjacentPostLink({
  post,
  label,
}: {
  post: PostSummary
  label: string
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="border-line bg-card hover:border-line-strong group block rounded-2xl border p-6 transition-colors"
    >
      <span className="text-faint text-[13px]">{label}</span>
      <span className="text-heading mt-2 block text-[19px] leading-[1.3] font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
        {post.title}
      </span>
    </Link>
  )
}

function PostStatus() {
  return (
    <section className="relative mx-auto max-w-[880px] px-4 py-24 text-center sm:px-8">
      <h1 className="text-heading text-2xl font-semibold">
        Failed to load post
      </h1>
      <p className="text-muted mt-3">
        This post may not exist or there was an error loading it.
      </p>
      <Link
        to="/blog"
        className="border-line-strong text-ink hover:bg-chip mt-8 inline-block rounded-[10px] border px-5 py-3 text-[15px] font-medium transition-colors"
      >
        ← Back to Blog
      </Link>
    </section>
  )
}

function PostLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading post"
      className="relative mx-auto flex max-w-[880px] animate-pulse flex-col items-center gap-5 px-4 pt-[72px] pb-10 motion-reduce:animate-none sm:px-8"
    >
      <div className="bg-chip h-4 w-32 rounded" />
      <div className="bg-chip h-12 w-full max-w-[720px] rounded-lg" />
      <div className="bg-chip h-12 w-2/3 rounded-lg" />
      <div className="bg-chip h-5 w-1/2 rounded" />
    </section>
  )
}

function BlogPost() {
  const { slug } = useParams({ from: '/blog/$slug' })
  const { data, isLoading, isError } = usePost(slug)
  const { older, newer } = useAdjacentPosts(slug)
  const articleRef = useRef<HTMLDivElement>(null)
  const [headings, setHeadings] = useState<TocHeading[]>([])

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

  // The TOC lists the h2s exactly as rendered (ids come from rehypeHeadingIds).
  useEffect(() => {
    const article = articleRef.current
    if (!article) {
      setHeadings([])
      return
    }
    setHeadings(
      Array.from(article.querySelectorAll('h2[id]')).map((heading) => ({
        id: heading.id,
        text: heading.textContent ?? '',
      })),
    )
  }, [data?.mdx])

  const readingTime = data?.mdx ? calculateReadingTime(data.mdx) : undefined
  const date = formatShortDate(data?.publishedAt)
  const firstTag = data?.tags?.[0]

  return (
    <AppShell path="Blog / Post" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[280px] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 opacity-90"
      />

      {isLoading && <PostLoading />}
      {isError && <PostStatus />}

      {data && (
        <>
          <section className="relative mx-auto max-w-[880px] px-4 pt-14 pb-10 text-center sm:px-8 sm:pt-[72px]">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap justify-center gap-2 text-[13px]"
            >
              <Link
                to="/blog"
                className="text-muted hover:text-ink transition-colors"
              >
                Blog
              </Link>
              {firstTag && (
                <>
                  <span aria-hidden="true" className="text-fainter">
                    /
                  </span>
                  <span className="text-muted">{firstTag}</span>
                </>
              )}
            </nav>
            <h1 className="text-heading mt-5 text-[34px] leading-[1.08] font-semibold tracking-[-0.035em] sm:text-[44px] lg:text-[56px]">
              {data.title}
            </h1>
            {data.excerpt && (
              <p className="text-muted mx-auto mt-5 max-w-[640px] text-[17px] leading-[1.55] sm:text-[19px]">
                {data.excerpt}
              </p>
            )}
            <div className="text-faint mt-7 flex flex-wrap items-center justify-center gap-3 text-sm">
              <AuthorAvatar />
              <span className="text-ink">{AUTHOR.name}</span>
              {date && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={isoDate(data.publishedAt)}>{date}</time>
                </>
              )}
              {readingTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{readingTime} min read</span>
                </>
              )}
            </div>
          </section>

          <div className="relative mx-auto max-w-[1136px] px-4 sm:px-8">
            <PostCover post={data} size="hero" />
          </div>

          <div className="relative mx-auto flex max-w-[1136px] gap-14 px-4 pt-12 sm:px-8 sm:pt-14">
            <aside className="hidden w-[220px] shrink-0 lg:block">
              <div className="sticky top-28 flex flex-col gap-7">
                <TableOfContents headings={headings} />
                <ShareButtons title={data.title} />
              </div>
            </aside>

            <div className="max-w-[720px] min-w-0 flex-1">
              <MDXContent ref={articleRef} code={data.mdx} />

              {data.tags && data.tags.length > 0 && (
                <ul
                  aria-label="Tags"
                  className="mt-12 flex flex-wrap gap-2 text-[13px]"
                >
                  {data.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-line-strong text-body rounded-full border px-3 py-1.5"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex items-center gap-3 lg:hidden">
                <span className="text-faint text-sm">Share</span>
                <ShareButtons title={data.title} />
              </div>

              <div className="border-line bg-card mt-8 flex flex-wrap items-center gap-[18px] rounded-2xl border p-6">
                <AuthorAvatar size={56} />
                <div className="flex-[1_1_280px]">
                  <p className="text-heading text-base font-semibold">
                    {AUTHOR.name}
                  </p>
                  <p className="text-muted mt-1 text-sm leading-relaxed">
                    {AUTHOR.postBio}
                  </p>
                </div>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-gradient-x text-on-brand rounded-[10px] px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Follow on LinkedIn
                </a>
              </div>
            </div>
          </div>

          <section className="relative mx-auto max-w-[1136px] px-4 pt-16 pb-24 sm:px-8 sm:pt-[72px]">
            {(older || newer) && (
              <>
                <h2 className="text-heading text-[22px] font-semibold tracking-[-0.02em]">
                  Keep reading
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {older && (
                    <AdjacentPostLink post={older} label="← Previous post" />
                  )}
                  {newer && (
                    <AdjacentPostLink post={newer} label="Next post →" />
                  )}
                </div>
              </>
            )}
            <Link
              to="/blog"
              className="text-brand-a mt-8 inline-block text-[15px] font-medium hover:underline"
            >
              ← All posts
            </Link>
          </section>
        </>
      )}
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: BlogPost,
})
