import { Link } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { AdminForm, DeleteButton } from '@/components/admin/AdminForm'
import { useAdminPosts, useCreatePost, useDeletePost } from '@/lib/queries'
import { postFields, postSchema, emptyPostValues } from './-postForm'

function AdminPostsList() {
  const { data, isLoading, isError } = useAdminPosts()
  const createPost = useCreatePost()
  const deletePost = useDeletePost()
  return (
    <AppShell path="Admin / Posts">
      <section className="grid gap-6 md:gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>

        <details className="rounded border p-3">
          <summary className="cursor-pointer font-medium">New post</summary>
          <div className="mt-3">
            <AdminForm
              schema={postSchema}
              fields={postFields}
              defaultValues={emptyPostValues}
              submitLabel="Create"
              resetOnSuccess
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
          </div>
        </details>

        {isLoading && <div>Loading…</div>}
        {isError && <div className="text-red-600">Failed to load posts.</div>}
        {data && data.length === 0 && <div>No posts yet.</div>}
        {data && data.length > 0 && (
          <ul className="grid gap-2">
            {data.map((post) => (
              <li
                key={post.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded border p-3"
              >
                <div className="grid min-w-0 gap-1">
                  <span className="font-medium">{post.title}</span>
                  <span className="text-muted-foreground text-sm">
                    <span
                      className={
                        post.status === 'published'
                          ? 'rounded bg-green-100 px-1.5 py-0.5 text-green-800'
                          : 'rounded bg-amber-100 px-1.5 py-0.5 text-amber-800'
                      }
                    >
                      {post.status}
                    </span>{' '}
                    /blog/{post.slug}
                    {post.published_at &&
                      ` · ${new Date(post.published_at).toLocaleDateString()}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="underline"
                  >
                    View
                  </Link>
                  <Link
                    to="/admin/posts/$id"
                    params={{ id: post.slug }}
                    className="underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    onDelete={() => deletePost.mutateAsync({ id: post.id })}
                  />
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
