import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { usePosts, useCreatePost, useDeletePost } from '@/lib/queries'

function AdminPostsList() {
  const { data, isLoading, isError } = usePosts({ limit: 20 })
  const createPost = useCreatePost()
  const deletePost = useDeletePost()
  return (
    <AppShell path="Admin / Posts">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
        <form
          className="grid gap-2 rounded border p-3"
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget as HTMLFormElement)
            const slug = String(fd.get('slug') ?? '')
            const title = String(fd.get('title') ?? '')
            const excerpt = String(fd.get('excerpt') ?? '')
            const mdx = String(fd.get('mdx') ?? '')
            const cover_url = String(fd.get('cover_url') ?? '')
            const tagsRaw = String(fd.get('tags') ?? '')
            const status = String(fd.get('status') ?? 'draft') || 'draft'
            const publishedAtStr = String(fd.get('published_at') ?? '')

            const tags = tagsRaw
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)

            if (!slug || !title || !excerpt || !mdx) return
            await createPost.mutateAsync({
              slug,
              title,
              excerpt,
              mdx,
              cover_url: cover_url || undefined,
              tags,
              status,
              published_at: publishedAtStr ? new Date(publishedAtStr) : undefined,
            })
            ;(e.currentTarget as HTMLFormElement).reset()
          }}
        >
          <div className="grid gap-2 md:grid-cols-2">
            <input
              name="slug"
              placeholder="slug"
              className="rounded border p-2"
              required
            />
            <input
              name="title"
              placeholder="title"
              className="rounded border p-2"
              required
            />
          </div>
          <input
            name="excerpt"
            placeholder="excerpt"
            className="rounded border p-2"
            required
          />
          <textarea
            name="mdx"
            placeholder="content (mdx)"
            className="min-h-[160px] rounded border p-2"
            required
          />
          <div className="grid gap-2 md:grid-cols-3">
            <input
              name="cover_url"
              placeholder="cover URL (optional)"
              className="rounded border p-2"
            />
            <input
              name="tags"
              placeholder="tags (comma-separated)"
              className="rounded border p-2"
            />
            <select name="status" className="rounded border p-2">
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-muted-foreground text-sm">Published at</span>
              <input
                type="datetime-local"
                name="published_at"
                className="rounded border p-2"
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
              disabled={createPost.isPending}
            >
              {createPost.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Failed to load posts.</div>}
        {data && (
          <ul className="grid gap-2">
            {data.items.map((p) => (
              <li
                key={p.slug}
                className="flex items-center justify-between rounded border p-3"
              >
                <span>{p.title}</span>
                <div className="flex items-center gap-3">
                  <Link
                    to="/admin/posts/$id"
                    params={{ id: p.slug }}
                    className="underline"
                  >
                    Edit
                  </Link>
                  <button
                    className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                    onClick={async () => {
                      await deletePost.mutateAsync({ slug: p.slug })
                    }}
                    disabled={deletePost.isPending}
                  >
                    {deletePost.isPending ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
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
  component: AdminPostsList,
})
