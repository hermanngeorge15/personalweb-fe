import { Link, useNavigate } from '@tanstack/react-router'
import { ensureKeycloakAuth } from '@/lib/keycloak'
import AdminShell from '@/components/admin/AdminShell'
import { PostEditor } from '@/components/admin/PostEditor'
import {
  AdminCard,
  ArrowLeftIcon,
  Notice,
  secondaryButton,
} from '@/components/admin/ui'
import { useAdminPost, useUpdatePost } from '@/lib/queries'
import { postToFormValues } from './-postForm'

// The route param is the post's slug; the id needed to save comes from the admin endpoint.
function AdminPostEdit() {
  const { id: slug } = Route.useParams()
  const navigate = useNavigate()
  const { data: post, isLoading, isError } = useAdminPost(slug)
  const updatePost = useUpdatePost()
  return (
    <AdminShell
      crumbs={[
        { label: 'Admin', to: '/admin' },
        { label: 'Posts', to: '/admin/posts' },
        { label: slug },
      ]}
      viewHref={`/blog/${encodeURIComponent(post?.slug ?? slug)}`}
    >
      {isLoading && <Notice>Loading…</Notice>}
      {isError && (
        <AdminCard className="grid justify-items-start gap-4">
          <h1 className="text-heading text-[24px] font-semibold tracking-[-0.02em]">
            Edit post
          </h1>
          <Notice tone="danger">
            Could not load the post “{slug}”. It may have been deleted or
            renamed.
          </Notice>
          <Link to="/admin/posts" className={secondaryButton}>
            <ArrowLeftIcon />
            All posts
          </Link>
        </AdminCard>
      )}
      {post && (
        <PostEditor
          // Re-mount with fresh values when a different post loads; after a save the form
          // already holds what was saved, so it stays mounted and keeps its "Saved." note.
          key={post.id}
          heading={post.title}
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
    </AdminShell>
  )
}

export const Route = createFileRoute({
  beforeLoad: async () => {
    await ensureKeycloakAuth()
    return null
  },
  component: AdminPostEdit,
})
