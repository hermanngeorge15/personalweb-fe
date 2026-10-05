import { Link, useNavigate } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AppShell from '@/components/AppShell'
import { AdminForm } from '@/components/admin/AdminForm'
import { useAdminPost, useUpdatePost } from '@/lib/queries'
import { postFields, postSchema, postToFormValues } from './-postForm'

// The route param is the post's slug; the id needed to save comes from the admin endpoint.
function AdminPostEdit() {
  const { id: slug } = Route.useParams()
  const navigate = useNavigate()
  const { data: post, isLoading, isError } = useAdminPost(slug)
  const updatePost = useUpdatePost()
  return (
    <AppShell path="Admin / Posts / Edit">
      <section className="grid gap-6 md:gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
          <div className="flex gap-4">
            <Link to="/admin/posts" className="underline">
              All posts
            </Link>
            {post && (
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="underline"
              >
                View on site
              </Link>
            )}
          </div>
        </div>
        {isLoading && <div>Loading…</div>}
        {isError && (
          <div className="text-red-600">
            Could not load the post “{slug}”. It may have been deleted or
            renamed.
          </div>
        )}
        {post && (
          <AdminForm
            // Re-mount with fresh values when a different post loads; after a save the form
            // already holds what was saved, so it stays mounted and keeps its "Saved." note.
            key={post.id}
            schema={postSchema}
            fields={postFields}
            defaultValues={postToFormValues(post)}
            submitLabel="Save"
            onSubmit={async (body) => {
              await updatePost.mutateAsync({ id: post.id, body })
              // A changed slug changes this page's address.
              if (body.slug !== slug) {
                await navigate({
                  to: '/admin/posts/$id',
                  params: { id: body.slug },
                })
              }
            }}
          />
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
