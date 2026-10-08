import { Link } from '@tanstack/react-router'
import { twMerge } from 'tailwind-merge'
import type { PostSummary } from '@/lib/queries'
import { formatShortDate, isoDate } from '@/lib/blog-utils'

const glowVariants = ['bg-cover-both', 'bg-cover-green', 'bg-cover-blue']

function glowFor(slug: string) {
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return glowVariants[Math.abs(hash) % glowVariants.length]
}

/** Small cover thumbnail: the post's image, or a branded glow with its first tag. Decorative. */
function Thumbnail({ post }: { post: PostSummary }) {
  const frame =
    'border-line hidden h-[120px] w-[150px] shrink-0 overflow-hidden rounded-[10px] border sm:block'
  if (post.coverUrl) {
    return (
      <div className={twMerge(frame, 'bg-canvas')}>
        <img
          src={post.coverUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        frame,
        'text-body items-center justify-center p-3 text-center font-mono text-[11px] sm:flex',
        glowFor(post.slug),
      )}
    >
      <span className="truncate">
        <span className="text-brand-b">›</span> {post.tags?.[0] ?? 'blog'}
      </span>
    </div>
  )
}

/** Compact horizontal post card for the Home "Latest from the blog" section. */
export function HomePostCard({ post }: { post: PostSummary }) {
  const date = formatShortDate(post.publishedAt)
  const firstTag = post.tags?.[0]
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="border-line bg-card hover:border-line-strong group flex gap-5 rounded-2xl border p-[18px] transition-colors sm:p-5"
    >
      <Thumbnail post={post} />
      <div className="min-w-0">
        {(firstTag || date) && (
          <span className="text-faint text-[13px]">
            {firstTag}
            {firstTag && date && ' · '}
            {date && <time dateTime={isoDate(post.publishedAt)}>{date}</time>}
          </span>
        )}
        <h3 className="text-heading mt-1.5 text-lg leading-[1.3] font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:mt-2 sm:text-[19px]">
          {post.title}
        </h3>
        {post.excerpt && (
          <div className="hidden sm:block">
            <p className="text-muted mt-2 line-clamp-2 text-sm leading-[1.55]">
              {post.excerpt}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
