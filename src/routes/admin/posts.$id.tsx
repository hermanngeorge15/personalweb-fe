import { useParams } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { usePost, useUpdatePost } from '@/lib/queries'

function AdminPostEdit() {
  const { id } = useParams({ from: '/admin/posts/$id' })
  const { data, isLoading, isError } = usePost(id)
  const updatePost = useUpdatePost()
  return (
    <AppShell path="Admin / Posts / Edit">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Post</h1>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load post.</div>}
        {data && (
          <form
            className="grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget as HTMLFormElement
              const fd = new FormData(form)
              const title = String(fd.get('title') ?? data.title)
              const excerpt = String(fd.get('excerpt') ?? '')
              const mdx = String(fd.get('mdx') ?? data.mdx)
              const cover_url = String(fd.get('cover_url') ?? '')
              const tagsRaw = String(fd.get('tags') ?? '')
              const status = String(fd.get('status') ?? 'draft') || 'draft'
              const publishedAtStr = String(fd.get('published_at') ?? '')

              const tags = tagsRaw
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)

              await updatePost.mutateAsync({
                slug: data.slug,
                title,
                excerpt: excerpt || data.title,
                mdx,
                cover_url: cover_url || undefined,
                tags,
                status,
                published_at: publishedAtStr
                  ? new Date(publishedAtStr)
                  : undefined,
              })
            }}
          >
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">Slug</span>
              <input
                className="w-full rounded border p-2"
                value={data.slug}
                readOnly
              />
            </label>
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">Title</span>
              <input
                name="title"
                className="w-full rounded border p-2"
                defaultValue={data.title}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">Excerpt</span>
              <input
                name="excerpt"
                className="w-full rounded border p-2"
                defaultValue={data.mdx.slice(0, 160)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">
                Content (MDX)
              </span>
              <textarea
                name="mdx"
                className="min-h-[300px] w-full rounded border p-2"
                defaultValue={data.mdx}
              />
            </label>
            <div className="grid gap-2 md:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Cover URL</span>
                <input name="cover_url" className="w-full rounded border p-2" />
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Tags</span>
                <input
                  name="tags"
                  placeholder="comma-separated"
                  className="w-full rounded border p-2"
                  defaultValue={(data.tags ?? []).join(', ')}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-muted-foreground text-sm">Status</span>
                <select name="status" className="w-full rounded border p-2">
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>
            </div>
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">
                Published at
              </span>
              <input
                type="datetime-local"
                name="published_at"
                className="w-full rounded border p-2"
              />
            </label>
            <div>
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                disabled={updatePost.isPending}
              >
                {updatePost.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </section>
    </AppShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminPostEdit,
})
