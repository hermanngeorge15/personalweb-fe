import { useMemo, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AdminShell from '@/components/admin/AdminShell'
import { DeleteButton } from '@/components/admin/AdminForm'
import { PostEditor } from '@/components/admin/PostEditor'
import {
  AdminCard,
  AdminPageHeader,
  Notice,
  PlusIcon,
  SearchIcon,
  StatusBadge,
  primaryButton,
  rowButton,
} from '@/components/admin/ui'
import { formatShortDate } from '@/lib/blog-utils'
import {
  useAdminPosts,
  useCreatePost,
  useDeletePost,
  type AdminPostListItem,
} from '@/lib/queries'
import { emptyPostValues } from './-postForm'

type Filter = 'all' | 'published' | 'draft'

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
]

const ROW_GRID =
  'md:grid md:grid-cols-[minmax(0,1fr)_100px_110px_220px] md:items-center md:gap-4'

function PostRow({
  post,
  onDelete,
}: {
  post: AdminPostListItem
  onDelete: () => Promise<unknown>
}) {
  return (
    <li className={`flex flex-col gap-3 px-5 py-4 ${ROW_GRID}`}>
      <Link
        to="/admin/posts/$id"
        params={{ id: post.slug }}
        className="group min-w-0"
      >
        <span className="text-ink block truncate text-[15px] font-medium group-hover:underline">
          {post.title}
        </span>
        <span className="text-faint block truncate font-mono text-[13px]">
          /blog/{post.slug}
        </span>
      </Link>
      <span className="flex items-center gap-2 md:block">
        <StatusBadge status={post.status} />
        <span className="text-muted text-sm md:hidden">
          {post.published_at ? formatShortDate(post.published_at) : ''}
        </span>
      </span>
      <span className="text-muted hidden text-sm md:block">
        {post.published_at ? formatShortDate(post.published_at) : '—'}
      </span>
      <span className="flex flex-wrap items-center gap-2 md:justify-end">
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className={rowButton}
        >
          View
          <span className="sr-only"> {post.title}</span>
        </Link>
        <Link
          to="/admin/posts/$id"
          params={{ id: post.slug }}
          className={rowButton}
        >
          Edit
          <span className="sr-only"> {post.title}</span>
        </Link>
        <DeleteButton itemName={post.title} onDelete={onDelete} />
      </span>
    </li>
  )
}

function AdminPostsList() {
  const { data, isLoading, isError } = useAdminPosts()
  const createPost = useCreatePost()
  const deletePost = useDeletePost()
  // The dashboard's "New post" links here with #new.
  const hash = useLocation({ select: (location) => location.hash })
  const [creating, setCreating] = useState(hash === 'new')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(
    () => ({
      all: data?.length ?? 0,
      published: data?.filter((p) => p.status === 'published').length ?? 0,
      draft: data?.filter((p) => p.status !== 'published').length ?? 0,
    }),
    [data],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return (data ?? []).filter((post) => {
      if (filter === 'published' && post.status !== 'published') return false
      if (filter === 'draft' && post.status === 'published') return false
      if (!needle) return true
      return (
        post.title.toLowerCase().includes(needle) ||
        post.slug.toLowerCase().includes(needle)
      )
    })
  }, [data, filter, query])

  return (
    <AdminShell
      crumbs={[{ label: 'Admin', to: '/admin' }, { label: 'Posts' }]}
      viewHref="/blog"
    >
      {creating ? (
        <PostEditor
          heading="New post"
          defaultValues={emptyPostValues}
          submitLabel="Create"
          resetOnSuccess
          onCancel={() => setCreating(false)}
          onSubmit={(body) =>
            createPost.mutateAsync({
              slug: body.slug,
              title: body.title,
              excerpt: body.excerpt,
              mdx: body.content_mdx,
              cover_url: body.cover_url,
              tags: body.tags,
              status: body.status,
              published_at: body.published_at
                ? new Date(body.published_at)
                : null,
            })
          }
        />
      ) : (
        <AdminPageHeader
          title="Posts"
          actions={
            <button
              type="button"
              className={primaryButton}
              onClick={() => setCreating(true)}
            >
              <PlusIcon />
              New post
            </button>
          }
        />
      )}

      <div
        className={`flex flex-wrap items-center justify-between gap-3 ${creating ? 'mt-10' : 'mt-6'}`}
      >
        {creating && (
          <h2 className="text-heading w-full text-lg font-semibold">
            All posts
          </h2>
        )}
        <div
          role="group"
          aria-label="Filter by status"
          className="border-line bg-card flex gap-1 rounded-[10px] border p-1"
        >
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
              className={`focus-visible:outline-brand-a min-h-10 rounded-[7px] px-3 text-sm transition-colors focus-visible:outline-2 sm:min-h-9 ${
                filter === option.value
                  ? 'bg-invert text-on-invert'
                  : 'text-body hover:text-ink'
              }`}
            >
              {option.label}
              {data && (
                <span
                  className={
                    filter === option.value
                      ? 'ml-1.5 opacity-80'
                      : 'text-faint ml-1.5'
                  }
                >
                  {counts[option.value]}
                </span>
              )}
            </button>
          ))}
        </div>
        <label className="border-line-strong bg-card text-faint focus-within:border-brand-a flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 sm:min-h-10 sm:w-auto">
          <SearchIcon />
          <span className="sr-only">Search posts</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts"
            className="text-ink placeholder:text-fainter w-full min-w-0 bg-transparent text-[15px] outline-none sm:w-56 sm:text-sm"
          />
        </label>
      </div>

      <AdminCard className="mt-4 overflow-visible p-0 sm:p-0">
        <div
          aria-hidden="true"
          className={`bg-subtle text-muted hidden rounded-t-2xl px-5 py-2.5 text-xs font-semibold ${ROW_GRID}`}
        >
          <span>Title</span>
          <span>Status</span>
          <span>Published</span>
          <span />
        </div>
        {(isLoading || isError || (data && visible.length === 0)) && (
          <div className="border-line border-t px-5 py-4 first:border-t-0">
            {isLoading && <Notice>Loading…</Notice>}
            {isError && <Notice tone="danger">Failed to load posts.</Notice>}
            {data && data.length === 0 && <Notice>No posts yet.</Notice>}
            {data && data.length > 0 && visible.length === 0 && (
              <Notice>No posts match.</Notice>
            )}
          </div>
        )}
        {visible.length > 0 && (
          <ul className="divide-line border-line divide-y border-t md:border-t">
            {visible.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                onDelete={() => deletePost.mutateAsync({ id: post.id })}
              />
            ))}
          </ul>
        )}
      </AdminCard>
    </AdminShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminPostsList,
})
