import { twMerge } from 'tailwind-merge'

type CoverPost = {
  slug: string
  coverUrl?: string
  tags?: string[]
}

type CoverSize = 'card' | 'featured' | 'hero'

const glowVariants = ['bg-cover-both', 'bg-cover-green', 'bg-cover-blue']

/** Stable pick per post, so a post keeps the same generated cover everywhere. */
function glowFor(slug: string, size: CoverSize) {
  if (size !== 'card') return glowVariants[0]
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) | 0
  return glowVariants[Math.abs(hash) % glowVariants.length]
}

const frameBySize: Record<CoverSize, string> = {
  card: 'h-[200px] p-6',
  featured: 'min-h-[240px] p-6 sm:p-10 md:min-h-[380px]',
  hero: 'h-[220px] rounded-[20px] border border-line p-5 sm:h-[300px] sm:p-8 md:h-[360px]',
}

const windowBySize: Record<CoverSize, string> = {
  card: 'text-xs leading-[1.8]',
  featured: 'max-w-[460px] text-[13px] leading-[1.9]',
  hero: 'max-w-[560px] text-[13px] leading-[1.9] sm:text-sm',
}

/**
 * A post's cover: its `coverUrl` image when set, otherwise a generated branded
 * cover — brand glows with a small terminal-style window listing the post's
 * first tags. Purely decorative (the title sits next to it), so no alt text.
 */
export function PostCover({
  post,
  size,
  className,
  path,
}: {
  post: CoverPost
  size: CoverSize
  className?: string
  /** First line of the window; defaults to the post's blog path. */
  path?: string
}) {
  if (post.coverUrl) {
    return (
      <div
        className={twMerge(
          'bg-canvas overflow-hidden',
          frameBySize[size],
          'p-0 sm:p-0',
          className,
        )}
      >
        <img
          src={post.coverUrl}
          alt=""
          loading={size === 'card' ? 'lazy' : 'eager'}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const tags = (post.tags ?? []).slice(0, size === 'card' ? 2 : 3)
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        'flex items-center justify-center',
        glowFor(post.slug, size),
        frameBySize[size],
        className,
      )}
    >
      <div
        className={twMerge(
          'border-window-line bg-window shadow-window w-full overflow-hidden rounded-xl border font-mono',
          windowBySize[size],
        )}
      >
        {size !== 'card' && (
          <div className="border-line flex gap-1.5 border-b px-3.5 py-3">
            <span className="bg-window-dot size-2.5 rounded-full" />
            <span className="bg-window-dot size-2.5 rounded-full" />
            <span className="bg-window-dot size-2.5 rounded-full" />
          </div>
        )}
        <div className="text-body px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="text-faint truncate">
            {path ?? `~/blog/${post.slug}`}
          </div>
          {tags.map((tag) => (
            <div key={tag} className="truncate">
              <span className="text-brand-b">›</span> {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
