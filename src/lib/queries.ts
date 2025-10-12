import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { api } from './api'
import { authHeader } from './keycloak'
import { getPostApi } from './client'

export type PostSummary = {
  slug: string
  title: string
  excerpt: string
  publishedAt?: Date | string
  tags?: string[]
  coverUrl?: string
}

export type PostsResponse = {
  items: PostSummary[]
  nextCursor: string | null
}

export type PostDetail = {
  slug: string
  title: string
  mdx: string
  tags?: string[]
  publishedAt?: Date
}

export type Meta = {
  name: string
  version: string
  hero?: string
  location?: string
  socials?: string
}

export type Project = {
  id: string
  name: string
  description: string
}

export type Testimonial = {
  id: string
  author: string
  quote: string
  role?: string
  avatar_url?: string
  order?: number
}

export type Resume = {
  name: string
  headline?: string
  summary?: string
  sections?: Array<{ title: string; items: string[] }>
}

// Resume (split) types based on OpenAPI
export type ResumeProject = {
  id: string
  company?: string
  projectName?: string
  from?: string
  until?: string
  description?: string
  responsibilities?: string[]
  techStack?: string[]
  repoUrl?: string
  demoUrl?: string
}

export type ResumeLanguage = {
  id: string
  name?: string
  level?: string
}

export type ResumeEducation = {
  id: string
  institution?: string
  field?: string
  degree?: string
  since?: string
  expectedUntil?: string
  thesisTitle?: string
  thesisDescription?: string
  status?: string
}

export type ResumeCertificate = {
  id: string
  name?: string
  issuer?: string
  from?: string
  to?: string
  description?: string
  certificateId?: string
  url?: string
}

export type ResumeHobbies = {
  id: string
  sports?: string[]
  others?: string[]
}

export function usePosts(params?: {
  limit?: number
  tag?: string
  cursor?: string | null
}) {
  const limit = params?.limit ?? 10
  const tag = params?.tag
  const cursor = params?.cursor ?? null
  const search = new URLSearchParams()
  if (limit) search.set('limit', String(limit))
  if (tag) search.set('tag', tag)
  if (cursor) search.set('cursor', cursor)

  return useQuery({
    queryKey: ['posts', { limit, tag, cursor }],
    queryFn: async () => {
      const postApi = getPostApi()
      const res = await postApi.list3({
        limit,
        tag,
        cursor: cursor ?? undefined,
      })
      return {
        items: (res.items ?? []).map((i) => ({
          slug: i.slug ?? '',
          title: i.title ?? '',
          excerpt: i.excerpt ?? '',
          publishedAt: i.published_at,
          tags: i.tags ?? [],
          coverUrl: i.cover_url,
        })),
        nextCursor: res.nextCursor ?? null,
      } satisfies PostsResponse
    },
    placeholderData: keepPreviousData,
  })
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const postApi = getPostApi()
      const res = await postApi.get({ slug })
      return {
        slug: res.slug ?? slug,
        title: res.title ?? '',
        mdx: res.content_mdx ?? '',
        tags: res.tags ?? [],
        publishedAt: res.published_at ?? undefined,
      } satisfies PostDetail
    },
    enabled: !!slug,
  })
}

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      slug: string
      title: string
      excerpt: string
      mdx: string
      cover_url?: string | null
      tags?: string[]
      status?: string
      published_at?: Date | null
    }) => {
      const postApi = getPostApi()
      await postApi.update2({
        id: input.slug,
        postUpsertRequest: {
          slug: input.slug,
          title: input.title,
          excerpt: input.excerpt,
          content_mdx: input.mdx,
          cover_url: input.cover_url ?? undefined,
          tags: input.tags,
          status: input.status,
          published_at: input.published_at ?? undefined,
        },
      })
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['post', variables.slug] })
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      slug: string
      title: string
      excerpt: string
      mdx: string
      cover_url?: string | null
      tags?: string[]
      status?: string
      published_at?: Date | null
    }) => {
      const postApi = getPostApi()
      await postApi.create2({
        postUpsertRequest: {
          slug: input.slug,
          title: input.title,
          excerpt: input.excerpt,
          content_mdx: input.mdx,
          cover_url: input.cover_url ?? undefined,
          tags: input.tags,
          status: input.status,
          published_at: input.published_at ?? undefined,
        },
      })
    },
    onSuccess: (_data, _variables) => {
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { slug: string }) => {
      const postApi = getPostApi()
      await postApi.delete2({ id: input.slug })
      return input.slug
    },
    onSuccess: (slug) => {
      qc.removeQueries({ queryKey: ['post', slug] })
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useMeta() {
  return useQuery({
    queryKey: ['meta'],
    queryFn: () => api<Meta>('/api/meta'),
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => api<Project[]>('/api/projects'),
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      id: string
      name: string
      description: string
    }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/projects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify(input),
        },
      )
      if (!res.ok) throw new Error('Failed to create project')
      return (await res.json()) as Project
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      id: string
      name: string
      description: string
    }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/projects/${input.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify({
            name: input.name,
            description: input.description,
          }),
        },
      )
      if (!res.ok) throw new Error('Failed to update project')
      return (await res.json()) as Project
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/projects/${input.id}`,
        {
          method: 'DELETE',
          headers: {
            ...(await authHeader()),
          },
        },
      )
      if (!res.ok) throw new Error('Failed to delete project')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api<Testimonial[]>('/api/testimonials'),
  })
}

export function useCreateTestimonial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      id: string
      author: string
      quote: string
      role?: string
      avatar_url?: string
      order?: number
    }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/testimonials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify(input),
        },
      )
      if (!res.ok) throw new Error('Failed to create testimonial')
      return (await res.json()) as Testimonial
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}

export function useUpdateTestimonial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      id: string
      author: string
      quote: string
      role?: string
      avatar_url?: string
      order?: number
    }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/testimonials/${input.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify({
            author: input.author,
            quote: input.quote,
            role: input.role,
            avatar_url: input.avatar_url,
            order: input.order,
          }),
        },
      )
      if (!res.ok) throw new Error('Failed to update testimonial')
      return (await res.json()) as Testimonial
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}

export function useDeleteTestimonial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/testimonials/${input.id}`,
        {
          method: 'DELETE',
          headers: {
            ...(await authHeader()),
          },
        },
      )
      if (!res.ok) throw new Error('Failed to delete testimonial')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
}

export function useResume() {
  return useQuery({
    queryKey: ['resume'],
    queryFn: () => api<Resume>('/api/resume'),
  })
}

// Split resume queries
export function useResumeProjects() {
  return useQuery({
    queryKey: ['resume', 'projects'],
    queryFn: () => api<ResumeProject[]>('/api/resume/projects'),
  })
}

export function useResumeLanguages() {
  return useQuery({
    queryKey: ['resume', 'languages'],
    queryFn: () => api<ResumeLanguage[]>('/api/resume/languages'),
  })
}

export function useResumeEducation() {
  return useQuery({
    queryKey: ['resume', 'education'],
    queryFn: () => api<ResumeEducation[]>('/api/resume/education'),
  })
}

export function useResumeCertificates() {
  return useQuery({
    queryKey: ['resume', 'certificates'],
    queryFn: () => api<ResumeCertificate[]>('/api/resume/certificates'),
  })
}

export function useResumeHobbies() {
  return useQuery({
    queryKey: ['resume', 'hobbies'],
    queryFn: () => api<ResumeHobbies>('/api/resume/hobbies'),
  })
}

// Admin mutations for split resume
export function useCreateResumeProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<ResumeProject, 'id'> & { id?: string }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/projects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify(input),
        },
      )
      if (!res.ok) throw new Error('Failed to create resume project')
      return (await res.json()) as string
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'projects'] })
    },
  })
}

export function useUpdateResumeProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ResumeProject) => {
      if (!input.id) throw new Error('id is required')
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/projects/${input.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify({
            company: input.company,
            projectName: input.projectName,
            from: input.from,
            until: input.until,
            description: input.description,
            responsibilities: input.responsibilities,
            techStack: input.techStack,
            repoUrl: input.repoUrl,
            demoUrl: input.demoUrl,
          }),
        },
      )
      if (!res.ok) throw new Error('Failed to update resume project')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'projects'] })
    },
  })
}

export function useDeleteResumeProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/projects/${input.id}`,
        {
          method: 'DELETE',
          headers: {
            ...(await authHeader()),
          },
        },
      )
      if (!res.ok) throw new Error('Failed to delete resume project')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'projects'] })
    },
  })
}

export function useCreateResumeLanguage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<ResumeLanguage, 'id'>) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/languages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify(input),
        },
      )
      if (!res.ok) throw new Error('Failed to create language')
      return (await res.json()) as string
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'languages'] })
    },
  })
}

export function useUpdateResumeLanguage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ResumeLanguage) => {
      if (!input.id) throw new Error('id is required')
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/languages/${input.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify({ name: input.name, level: input.level }),
        },
      )
      if (!res.ok) throw new Error('Failed to update language')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'languages'] })
    },
  })
}

export function useDeleteResumeLanguage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/languages/${input.id}`,
        {
          method: 'DELETE',
          headers: {
            ...(await authHeader()),
          },
        },
      )
      if (!res.ok) throw new Error('Failed to delete language')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'languages'] })
    },
  })
}

export function useCreateResumeEducation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<ResumeEducation, 'id'>) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/education`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify(input),
        },
      )
      if (!res.ok) throw new Error('Failed to create education')
      return (await res.json()) as string
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'education'] })
    },
  })
}

export function useUpdateResumeEducation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ResumeEducation) => {
      if (!input.id) throw new Error('id is required')
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/education/${input.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify({
            institution: input.institution,
            field: input.field,
            degree: input.degree,
            since: input.since,
            expectedUntil: input.expectedUntil,
            thesisTitle: input.thesisTitle,
            thesisDescription: input.thesisDescription,
            status: input.status,
          }),
        },
      )
      if (!res.ok) throw new Error('Failed to update education')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'education'] })
    },
  })
}

export function useDeleteResumeEducation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/education/${input.id}`,
        {
          method: 'DELETE',
          headers: {
            ...(await authHeader()),
          },
        },
      )
      if (!res.ok) throw new Error('Failed to delete education')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'education'] })
    },
  })
}

export function useCreateResumeCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<ResumeCertificate, 'id'>) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/certificates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify(input),
        },
      )
      if (!res.ok) throw new Error('Failed to create certificate')
      return (await res.json()) as string
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'certificates'] })
    },
  })
}

export function useUpdateResumeCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ResumeCertificate) => {
      if (!input.id) throw new Error('id is required')
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/certificates/${input.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify({
            name: input.name,
            issuer: input.issuer,
            from: input.from,
            to: input.to,
            description: input.description,
            certificateId: input.certificateId,
            url: input.url,
          }),
        },
      )
      if (!res.ok) throw new Error('Failed to update certificate')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'certificates'] })
    },
  })
}

export function useDeleteResumeCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/certificates/${input.id}`,
        {
          method: 'DELETE',
          headers: {
            ...(await authHeader()),
          },
        },
      )
      if (!res.ok) throw new Error('Failed to delete certificate')
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'certificates'] })
    },
  })
}

export function useUpsertResumeHobbies() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { sports?: string[]; others?: string[] }) => {
      const res = await fetch(
        (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE ?? '') +
          `/api/resume/hobbies`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
          },
          body: JSON.stringify(input),
        },
      )
      if (!res.ok) throw new Error('Failed to upsert hobbies')
      return (await res.json()) as string
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'hobbies'] })
    },
  })
}
