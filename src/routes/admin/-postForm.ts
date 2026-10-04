import { z } from 'zod'
import type {
  AdminField,
  AdminFormValues,
  AdminSchema,
} from '@/components/admin/AdminForm'
import type { AdminPost, PostUpsertBody } from '@/lib/queries'
import {
  fromDateTimeInput,
  optionalText,
  requiredText,
  splitList,
  toDateTimeInput,
} from '@/lib/adminFormat'

// Shared by the create form (posts.tsx) and the edit page (posts_.$id.tsx).
// The leading "-" keeps TanStack Router from treating this file as a route.

export const postFields: AdminField[] = [
  { name: 'title', label: 'Title' },
  { name: 'slug', label: 'Slug', hint: 'The URL: /blog/<slug>' },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
  {
    name: 'content_mdx',
    label: 'Content (Markdown)',
    type: 'textarea',
    rows: 18,
  },
  { name: 'cover_url', label: 'Cover URL', placeholder: '/api/media/files/…' },
  { name: 'tags', label: 'Tags', placeholder: 'comma-separated' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['draft', 'published'],
  },
  {
    name: 'published_at',
    label: 'Published at',
    type: 'datetime-local',
    hint: 'Left empty on a published post, it is set to now.',
  },
]

export const postSchema: AdminSchema<PostUpsertBody> = z
  .object({
    title: requiredText('Title'),
    slug: z
      .string()
      .trim()
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        'Lowercase letters, digits and dashes only',
      ),
    excerpt: requiredText('Excerpt'),
    content_mdx: requiredText('Content'),
    cover_url: optionalText,
    tags: z.string().transform(splitList),
    status: z.enum(['draft', 'published']),
    published_at: z.string().transform(fromDateTimeInput),
  })
  .transform((post) => ({
    ...post,
    // A published post always has a date: the blog list orders by it.
    published_at:
      post.status === 'published' && !post.published_at
        ? new Date().toISOString()
        : post.published_at,
  }))

export const emptyPostValues: AdminFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content_mdx: '',
  cover_url: '',
  tags: '',
  status: 'draft',
  published_at: '',
}

export function postToFormValues(post: AdminPost): AdminFormValues {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content_mdx: post.content_mdx,
    cover_url: post.cover_url ?? '',
    tags: post.tags.join(', '),
    status: post.status === 'published' ? 'published' : 'draft',
    published_at: toDateTimeInput(post.published_at),
  }
}
