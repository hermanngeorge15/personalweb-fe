import AppShell from '@/components/AppShell'
import { usePosts } from '@/lib/queries'
import { useEffect, useMemo } from 'react'
import { SEO_DEFAULTS, setHead } from '@/lib/seo'
import { sortByPublishedDesc } from '@/lib/blog-utils'
import { RSS_URL, SOCIAL_LINKS } from '@/config/site'
import { FeaturedPostCard, PostCard } from '@/components/blog/PostCards'

const section = 'relative mx-auto max-w-[1200px] px-4 sm:px-8'

function Hero() {
  return (
    <section
      className={`${section} pt-16 pb-8 text-center sm:pt-[88px] sm:pb-10`}
    >
      <span className="border-line-strong bg-chip/60 text-body inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px]">
        <span aria-hidden="true" className="bg-brand-b size-1.5 rounded-full" />
        Blog · Securing AI agents
      </span>
      <h1 className="text-heading mx-auto mt-6 max-w-[860px] text-[40px] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-[52px] lg:text-[64px]">
        Building secure tooling{' '}
        <span className="text-brand-gradient">for AI agents</span>
      </h1>
      <p className="text-muted mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.55] sm:text-[19px]">
        Prompt injection, SSRF, agent tooling and backend engineering in Kotlin
        and Rust — with the code, the numbers, and the gaps I find red-teaming
        my own work.
      </p>
    </section>
  )
}

function StatusBox({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-line bg-subtle rounded-[20px] border px-6 py-14 text-center">
      <p className="text-heading text-lg font-semibold">{title}</p>
      <p className="text-faint mt-2 text-sm">{detail}</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading posts">
      <div className="border-line bg-card flex min-h-[380px] animate-pulse flex-wrap overflow-hidden rounded-[20px] border motion-reduce:animate-none">
        <div className="bg-subtle min-h-[240px] flex-[1_1_520px]" />
        <div className="flex flex-[1_1_420px] flex-col justify-center gap-4 p-6 sm:p-12">
          <div className="bg-chip h-5 w-24 rounded-full" />
          <div className="bg-chip h-9 w-11/12 rounded-lg" />
          <div className="bg-chip h-5 w-4/5 rounded-lg" />
          <div className="bg-chip h-5 w-2/5 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function FollowCta() {
  return (
    <section className={`${section} pt-16 pb-24 sm:pt-[72px]`}>
      <div className="border-line bg-cta-glow flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[20px] border p-6 sm:p-12">
        <div className="flex-[1_1_420px]">
          <h2 className="text-heading text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] sm:text-[30px]">
            Follow the series
          </h2>
          <p className="text-muted mt-2.5 max-w-[520px] text-base leading-relaxed">
            A new post every week on securing AI agents — follow along on
            LinkedIn.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-gradient-x text-on-brand rounded-[10px] px-5 py-3 text-[15px] font-medium transition-opacity hover:opacity-90"
          >
            Follow on LinkedIn
          </a>
          {RSS_URL && (
            <a
              href={RSS_URL}
              className="border-window-line text-ink hover:bg-chip rounded-[10px] border px-5 py-3 text-[15px] font-medium transition-colors"
            >
              RSS
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function BlogList() {
  const { data, isLoading, isError } = usePosts({ limit: 20 })
  const posts = useMemo(
    () => (data ? sortByPublishedDesc(data.items) : []),
    [data],
  )
  const [featured, ...rest] = posts

  useEffect(() => {
    setHead({
      title: `Blog — ${SEO_DEFAULTS.siteName}`,
      description: SEO_DEFAULTS.description,
      canonical: `${SEO_DEFAULTS.siteUrl}/blog`,
      og: {
        title: `Blog — ${SEO_DEFAULTS.siteName}`,
        url: `${SEO_DEFAULTS.siteUrl}/blog`,
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
    <AppShell path="Blog" fullBleed>
      <div
        aria-hidden="true"
        className="bg-glow-hero pointer-events-none absolute -top-[260px] left-1/2 h-[620px] w-[1100px] -translate-x-1/2"
      />
      <Hero />

      <section className={`${section} pt-6 sm:pt-8`}>
        {isLoading && <LoadingSkeleton />}
        {isError && (
          <StatusBox
            title="Failed to load posts"
            detail="Please try again later"
          />
        )}
        {data && posts.length === 0 && (
          <StatusBox
            title="No posts yet"
            detail="Check back soon for new content!"
          />
        )}
        {featured && <FeaturedPostCard post={featured} />}
      </section>

      {rest.length > 0 && (
        <section className={`${section} pt-16 sm:pt-[72px]`}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-heading text-[26px] font-semibold tracking-[-0.02em]">
              Latest
            </h2>
            {RSS_URL && (
              <a
                href={RSS_URL}
                className="text-muted hover:text-ink text-sm transition-colors"
              >
                RSS feed
              </a>
            )}
          </div>
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <FollowCta />
    </AppShell>
  )
}

export const Route = createFileRoute({
  component: BlogList,
})
