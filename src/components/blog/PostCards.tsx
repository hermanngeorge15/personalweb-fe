import { Link } from '@tanstack/react-router'
import type { PostSummary } from '@/lib/queries'
import { AUTHOR } from '@/config/site'
import { formatShortDate, isoDate } from '@/lib/blog-utils'
import { AuthorAvatar } from '../Brand'
import { PostCover } from './PostCover'

/** Large two-column card for the newest post on /blog. */
export function FeaturedPostCard({ post }: { post: PostSummary }) {
  const date = formatShortDate(post.publishedAt)
  const firstTag = post.tags?.[0]
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="border-line bg-card hover:border-line-strong group flex flex-wrap overflow-hidden rounded-[20px] border transition-colors"
    >
      <PostCover post={post} size="featured" className="flex-[1_1_520px]" />
      <div className="flex flex-[1_1_420px] flex-col justify-center p-6 sm:p-12">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="bg-brand-gradient-x text-on-brand rounded-full px-2.5 py-1">
            Featured
          </span>
          {firstTag && (
            <span className="border-line-strong text-body rounded-full border px-2.5 py-1">
              {firstTag}
            </span>
          )}
        </div>
        <h2 className="text-heading mt-5 text-[28px] leading-[1.12] font-semibold tracking-[-0.025em] sm:text-4xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-muted mt-3.5 text-[17px] leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <div className="text-faint mt-7 flex flex-wrap items-center gap-3 text-sm">
          <AuthorAvatar />
          <span className="text-ink">{AUTHOR.name}</span>
          {date && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={isoDate(post.publishedAt)}>{date}</time>
            </>
          )}
        </div>
        <span className="text-brand-a mt-7 text-[15px] font-medium group-hover:underline">
          Read article →
        </span>
      </div>
    </Link>
  )
}

/** Card in the "Latest" grid on /blog. */
export function PostCard({ post }: { post: PostSummary }) {
  const date = formatShortDate(post.publishedAt)
  const meta = [post.tags?.[0], date].filter(Boolean).join(' · ')
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="border-line bg-card hover:border-line-strong group flex flex-col overflow-hidden rounded-2xl border transition-colors"
    >
      <PostCover post={post} size="card" />
      <div className="flex flex-1 flex-col p-6">
        {meta && <span className="text-faint text-[13px]">{meta}</span>}
        <h3 className="text-heading mt-2.5 text-[21px] leading-tight font-semibold tracking-[-0.015em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-muted mt-2.5 line-clamp-3 text-[15px] leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
