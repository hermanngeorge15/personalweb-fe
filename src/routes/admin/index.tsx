import { useMemo, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AdminShell, {
  ADMIN_NAV,
  adminUserName,
} from '@/components/admin/AdminShell'
import {
  cx,
  AdminCard,
  AdminPageHeader,
  CardTitle,
  Notice,
  PlusIcon,
  StatusBadge,
  primaryButton,
  rowButton,
  secondaryButton,
} from '@/components/admin/ui'
import { formatShortDate } from '@/lib/blog-utils'
import {
  useAdminPosts,
  useKotlinTopicsAdmin,
  useResumeProjects,
  useTestimonials,
} from '@/lib/queries'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** One number tile. Shows "—" until the query has an answer. */
function StatTile({
  label,
  value,
  note,
  to,
}: {
  label: string
  value: number | undefined
  note?: ReactNode
  to: string
}) {
  return (
    <Link
      to={to}
      className="border-line bg-card hover:border-line-strong focus-visible:outline-brand-a block rounded-2xl border p-5 transition-colors focus-visible:outline-2"
    >
      <span className="text-muted block text-[13px]">{label}</span>
      <span className="text-heading mt-1.5 block text-[28px] leading-tight font-semibold">
        {value ?? '—'}
      </span>
      {note && (
        <span className="text-faint mt-1 block text-[13px]">{note}</span>
      )}
    </Link>
  )
}

function AdminDashboard() {
  const posts = useAdminPosts()
  const topics = useKotlinTopicsAdmin()
  const roles = useResumeProjects()
  const testimonials = useTestimonials()

  const published = posts.data?.filter((p) => p.status === 'published')
  const drafts = posts.data?.filter((p) => p.status !== 'published')
  const modules = topics.data
    ? new Set(topics.data.map((t) => t.module || 'Other')).size
    : undefined
  const firstYear = useMemo(() => {
    const years = (roles.data ?? [])
      .map((r) => (r.startAt ? new Date(r.startAt).getFullYear() : NaN))
      .filter((year) => !Number.isNaN(year))
    return years.length ? Math.min(...years) : undefined
  }, [roles.data])

  const recent = useMemo(
    () =>
      [...(posts.data ?? [])]
        .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
        .slice(0, 5),
    [posts.data],
  )

  // Things worth a look, computed from the data above — nothing hard-coded.
  const attention = useMemo(() => {
    const items: Array<{ text: string; to: string }> = []
    if (drafts && drafts.length > 0) {
      items.push({
        text: `${drafts.length} ${drafts.length === 1 ? 'post is' : 'posts are'} still a draft.`,
        to: '/admin/posts',
      })
    }
    if (testimonials.data && testimonials.data.length === 0) {
      items.push({ text: 'No testimonials yet.', to: '/admin/testimonials' })
    }
    const seen = new Map<string, number>()
    for (const topic of topics.data ?? []) {
      const key = topic.title.trim().toLowerCase()
      seen.set(key, (seen.get(key) ?? 0) + 1)
    }
    for (const topic of topics.data ?? []) {
      const count = seen.get(topic.title.trim().toLowerCase()) ?? 0
      if (count > 1) {
        items.push({
          text: `Kotlin topic “${topic.title}” exists ${count} times.`,
          to: '/admin/kotlin/topics',
        })
        seen.delete(topic.title.trim().toLowerCase())
      }
    }
    return items
  }, [drafts, testimonials.data, topics.data])

  const firstName = adminUserName().split(' ')[0]

  return (
    <AdminShell crumbs={[{ label: 'Admin' }]}>
      <AdminPageHeader
        title={`${greeting()}, ${firstName}`}
        description="What’s on the site and what needs a look."
        actions={
          <Link to="/admin/posts" hash="new" className={primaryButton}>
            <PlusIcon />
            New post
          </Link>
        }
      />

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3.5">
        <StatTile
          label="Published posts"
          value={published?.length}
          note={
            drafts &&
            `${drafts.length} ${drafts.length === 1 ? 'draft' : 'drafts'}`
          }
          to="/admin/posts"
        />
        <StatTile
          label="Kotlin topics"
          value={topics.data?.length}
          note={modules !== undefined && `in ${modules} modules`}
          to="/admin/kotlin/topics"
        />
        <StatTile
          label="Resume projects"
          value={roles.data?.length}
          note={firstYear !== undefined && `since ${firstYear}`}
          to="/admin/resume/projects"
        />
        <StatTile
          label="Testimonials"
          value={testimonials.data?.length}
          to="/admin/testimonials"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-start gap-5">
        <AdminCard
          className="min-w-0 flex-[999_1_520px] overflow-hidden p-0 sm:p-0"
          aria-labelledby="recent-posts"
        >
          <div className="flex items-center justify-between gap-3 px-5 py-3.5">
            <h2
              id="recent-posts"
              className="text-heading text-base font-semibold"
            >
              Recent posts
            </h2>
            <Link
              to="/admin/posts"
              className="text-link text-sm hover:underline"
            >
              All posts →
            </Link>
          </div>
          {posts.isLoading && (
            <div className="border-line border-t px-5 py-4">
              <Notice>Loading…</Notice>
            </div>
          )}
          {posts.isError && (
            <div className="border-line border-t px-5 py-4">
              <Notice tone="danger">Failed to load posts.</Notice>
            </div>
          )}
          {posts.data && posts.data.length === 0 && (
            <div className="border-line border-t px-5 py-4">
              <Notice>No posts yet.</Notice>
            </div>
          )}
          {recent.length > 0 && (
            <ul className="divide-line border-line divide-y border-t">
              {recent.map((post) => (
                <li
                  key={post.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-5 py-3.5 sm:grid-cols-[minmax(0,1fr)_90px_110px_auto]"
                >
                  <Link
                    to="/admin/posts/$id"
                    params={{ id: post.slug }}
                    className="group col-span-2 min-w-0 sm:col-span-1"
                  >
                    <span className="text-ink block truncate text-[15px] font-medium group-hover:underline">
                      {post.title}
                    </span>
                    <span className="text-faint block truncate font-mono text-[13px]">
                      /blog/{post.slug}
                    </span>
                  </Link>
                  <span className="flex items-center gap-2 sm:block">
                    <StatusBadge status={post.status} />
                    <span className="text-muted text-sm sm:hidden">
                      {formatShortDate(post.published_at ?? undefined)}
                    </span>
                  </span>
                  <span className="text-muted hidden text-sm sm:block">
                    {post.published_at
                      ? formatShortDate(post.published_at)
                      : '—'}
                  </span>
                  <Link
                    to="/admin/posts/$id"
                    params={{ id: post.slug }}
                    className={cx(rowButton, 'justify-self-end')}
                  >
                    Edit<span className="sr-only"> {post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard className="min-w-0 flex-[1_1_320px]">
          <CardTitle>Needs attention</CardTitle>
          {attention.length > 0 ? (
            <ul className="grid gap-3 text-[15px] leading-normal">
              {attention.map((item) => (
                <li key={item.text} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="bg-brand-a mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  <Link
                    to={item.to}
                    className="text-body hover:text-ink hover:underline"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Notice>
              {posts.isLoading || topics.isLoading || testimonials.isLoading
                ? 'Checking…'
                : 'Nothing needs a look right now.'}
            </Notice>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/admin/posts" hash="new" className={primaryButton}>
              New post
            </Link>
            <Link to="/admin/kotlin/topics" className={secondaryButton}>
              New topic
            </Link>
          </div>
        </AdminCard>
      </div>

      <AdminCard className="mt-5" aria-labelledby="all-sections">
        <CardTitle id="all-sections">All sections</CardTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-5">
          {ADMIN_NAV.filter((group) => group.heading !== 'Overview').map(
            (group) => (
              <div key={group.heading}>
                <p className="text-faint mb-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase">
                  {group.heading}
                </p>
                <ul className="grid gap-0.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="text-link inline-flex min-h-9 items-center text-[15px] hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      </AdminCard>
    </AdminShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminDashboard,
})
