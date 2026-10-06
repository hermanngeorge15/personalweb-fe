import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { api, apiAuth } from './api'
import { authHeader } from './keycloak'
import { getPostApi } from './client'
import { ResponseError } from '@/generated/runtime'

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
  excerpt?: string
  mdx: string
  coverUrl?: string
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
  slug: string
  title: string
  summary: string
  content_mdx: string
  /** JSON object as a string, e.g. {"github":"https://…"} */
  links: string
  order: number
}

export type ProjectUpsertBody = Omit<Project, 'id'>

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
  startAt?: string
  endAt?: string
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

/** Request bodies for the resume admin endpoints, in the backend's field names. */
export type LanguageBody = { name: string; level: string }

export type EducationBody = {
  institution: string
  field: string | null
  degree: string | null
  since: string
  expectedUntil: string | null
  thesisTitle: string | null
  thesisDescription: string | null
  status: 'studying' | 'graduated'
}

export type CertificateBody = {
  name: string
  issuer: string | null
  from: string | null
  to: string | null
  description: string | null
  certificateId: string | null
  url: string | null
}

export type ResumeCertificate = {
  id: string
  name?: string
  issuer?: string
  startAt?: string
  endAt?: string
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
          publishedAt: i.publishedAt,
          tags: i.tags ?? [],
          coverUrl: i.coverUrl,
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
    // A 404 (unknown slug, or a draft for a signed-out reader) will not change on retry; show
    // "Failed to load post" at once instead of after three retries (about 7 seconds).
    retry: (failureCount, error) =>
      !(error instanceof ResponseError && error.response.status === 404) &&
      failureCount < 3,
    queryFn: async () => {
      const postApi = getPostApi()
      const res = await postApi.get({ slug })
      return {
        slug: res.slug ?? slug,
        title: res.title ?? '',
        excerpt: res.excerpt ?? undefined,
        mdx: res.contentMdx ?? '',
        coverUrl: res.coverUrl ?? undefined,
        tags: res.tags ?? [],
        publishedAt: res.publishedAt ?? undefined,
      } satisfies PostDetail
    },
    enabled: !!slug,
  })
}

/** Body of PUT /api/posts/{id} and POST /api/posts (snake_case, as the backend expects). */
export type PostUpsertBody = {
  slug: string
  title: string
  excerpt: string
  content_mdx: string
  cover_url: string | null
  tags: string[]
  status: 'draft' | 'published'
  published_at: string | null
}

export type AdminPostListItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  tags: string[]
  status: string
  published_at: string | null
  updated_at: string
}

export type AdminPost = AdminPostListItem & {
  content_mdx: string
  cover_url: string | null
}

/** Every post, drafts included (admin only). */
export function useAdminPosts() {
  return useQuery({
    queryKey: ['admin', 'posts'],
    queryFn: async () =>
      apiAuth<AdminPostListItem[]>('/api/admin/posts', await authHeader()),
  })
}

/** One post in any status, with the id needed to save it (admin only). */
export function useAdminPost(slug: string) {
  return useQuery({
    queryKey: ['admin', 'post', slug],
    queryFn: async () =>
      apiAuth<AdminPost>(
        `/api/admin/posts/${encodeURIComponent(slug)}`,
        await authHeader(),
      ),
    enabled: !!slug,
  })
}

function invalidatePosts(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['admin'] })
  qc.invalidateQueries({ queryKey: ['posts'] })
  qc.invalidateQueries({ queryKey: ['post'] })
}

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: PostUpsertBody }) => {
      await apiAuth(`/api/posts/${input.id}`, await authHeader(), {
        method: 'PUT',
        body: JSON.stringify(input.body),
      })
    },
    onSuccess: () => invalidatePosts(qc),
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
          contentMdx: input.mdx,
          coverUrl: input.cover_url ?? undefined,
          tags: input.tags,
          status: input.status,
          publishedAt: input.published_at ?? undefined,
        },
      })
    },
    onSuccess: () => invalidatePosts(qc),
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      await apiAuth(`/api/posts/${input.id}`, await authHeader(), {
        method: 'DELETE',
      })
      return input.id
    },
    onSuccess: () => invalidatePosts(qc),
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
    mutationFn: async (input: ProjectUpsertBody) => {
      return apiAuth<{ id: string }>('/api/projects', await authHeader(), {
        method: 'POST',
        body: JSON.stringify(input),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: ProjectUpsertBody }) => {
      await apiAuth(`/api/projects/${input.id}`, await authHeader(), {
        method: 'PUT',
        body: JSON.stringify(input.body),
      })
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
      await apiAuth(`/api/projects/${input.id}`, await authHeader(), {
        method: 'DELETE',
      })
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
      author: string
      quote: string
      role: string
      avatar_url?: string
      order?: number
    }) => {
      return apiAuth<{ id: string }>('/api/testimonials', await authHeader(), {
        method: 'POST',
        body: JSON.stringify(input),
      })
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
      role: string
      avatar_url?: string
      order?: number
    }) => {
      return apiAuth(`/api/testimonials/${input.id}`, await authHeader(), {
        method: 'PUT',
        body: JSON.stringify({
          author: input.author,
          quote: input.quote,
          role: input.role,
          avatar_url: input.avatar_url,
          order: input.order,
        }),
      })
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
      await apiAuth(`/api/testimonials/${input.id}`, await authHeader(), {
        method: 'DELETE',
      })
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

/** The API names the dates from/until, while ResumeProject (as listed) has startAt/endAt. */
function resumeProjectBody(input: Omit<ResumeProject, 'id'>) {
  return JSON.stringify({
    company: input.company,
    projectName: input.projectName,
    from: input.startAt,
    until: input.endAt,
    description: input.description,
    responsibilities: input.responsibilities,
    techStack: input.techStack,
    repoUrl: input.repoUrl,
    demoUrl: input.demoUrl,
  })
}

export function useCreateResumeProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<ResumeProject, 'id'>) => {
      return apiAuth<string>('/api/resume/projects', await authHeader(), {
        method: 'POST',
        body: resumeProjectBody(input),
      })
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
      await apiAuth(`/api/resume/projects/${input.id}`, await authHeader(), {
        method: 'PUT',
        body: resumeProjectBody(input),
      })
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
      await apiAuth(`/api/resume/projects/${input.id}`, await authHeader(), {
        method: 'DELETE',
      })
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
    mutationFn: async (input: LanguageBody) => {
      return apiAuth<string>('/api/resume/languages', await authHeader(), {
        method: 'POST',
        body: JSON.stringify(input),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'languages'] })
    },
  })
}

export function useUpdateResumeLanguage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: LanguageBody }) => {
      await apiAuth(`/api/resume/languages/${input.id}`, await authHeader(), {
        method: 'PUT',
        body: JSON.stringify(input.body),
      })
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
      await apiAuth(`/api/resume/languages/${input.id}`, await authHeader(), {
        method: 'DELETE',
      })
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
    mutationFn: async (input: EducationBody) => {
      return apiAuth<string>('/api/resume/education', await authHeader(), {
        method: 'POST',
        body: JSON.stringify(input),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'education'] })
    },
  })
}

export function useUpdateResumeEducation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: EducationBody }) => {
      await apiAuth(`/api/resume/education/${input.id}`, await authHeader(), {
        method: 'PUT',
        body: JSON.stringify(input.body),
      })
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
      await apiAuth(`/api/resume/education/${input.id}`, await authHeader(), {
        method: 'DELETE',
      })
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
    mutationFn: async (input: CertificateBody) => {
      return apiAuth<string>('/api/resume/certificates', await authHeader(), {
        method: 'POST',
        body: JSON.stringify(input),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'certificates'] })
    },
  })
}

export function useUpdateResumeCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: CertificateBody }) => {
      await apiAuth(
        `/api/resume/certificates/${input.id}`,
        await authHeader(),
        {
          method: 'PUT',
          body: JSON.stringify(input.body),
        },
      )
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
      await apiAuth(
        `/api/resume/certificates/${input.id}`,
        await authHeader(),
        {
          method: 'DELETE',
        },
      )
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
      return apiAuth<string>('/api/resume/hobbies', await authHeader(), {
        method: 'PUT',
        body: JSON.stringify(input),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume', 'hobbies'] })
    },
  })
}

// ========================================
// Kotlin Learning Platform Types & Queries
// ========================================

export type KotlinTopicListItem = {
  id: string
  title: string
  module: string
  difficulty: string
  description?: string
  readingTimeMinutes: number
}

export type KotlinCodeExample = {
  language: string
  versionLabel?: string
  code: string
  explanation: string
}

export type KotlinExperience = {
  title: string
  content: string
  type: string
}

export type KotlinDocLink = {
  type: string
  url: string
  title: string
  description?: string
}

export type TopicNavigation = {
  previous?: string
  next?: string
}

export type KotlinTopicDetail = {
  id: string
  title: string
  module: string
  difficulty: string
  description?: string
  kotlinExplanation: string
  kotlinCode: string
  readingTimeMinutes: number
  codeExamples: KotlinCodeExample[]
  experiences: KotlinExperience[]
  docLinks: KotlinDocLink[]
  navigation?: TopicNavigation
}

export type KotlinModule = {
  name: string
  topics: KotlinTopicListItem[]
}

export type MindMapTopic = {
  id: string
  title: string
  module: string
  difficulty: string
}

export type MindMapDependency = {
  from: string
  to: string
  type: string
}

export type MindMapData = {
  topics: MindMapTopic[]
  dependencies: MindMapDependency[]
}

// Source language type for filtering
export type SourceLanguage = 'java' | 'csharp' | null

export function useKotlinTopics() {
  return useQuery({
    queryKey: ['kotlin-learning', 'topics'],
    queryFn: () => api<KotlinTopicListItem[]>('/api/learn-kotlin/topics'),
  })
}

export function useKotlinTopicsByModule() {
  return useQuery({
    queryKey: ['kotlin-learning', 'topics-by-module'],
    queryFn: () => api<KotlinModule[]>('/api/learn-kotlin/topics/by-module'),
  })
}

export function useKotlinTopic(id: string, sourceLanguage?: SourceLanguage) {
  const params = new URLSearchParams()
  if (sourceLanguage) params.set('sourceLanguage', sourceLanguage)
  const queryString = params.toString()
  const path = `/api/learn-kotlin/topics/${id}${queryString ? `?${queryString}` : ''}`

  return useQuery({
    queryKey: ['kotlin-learning', 'topic', id, sourceLanguage],
    queryFn: () => api<KotlinTopicDetail>(path),
    enabled: !!id,
  })
}

export function useKotlinMindMap() {
  return useQuery({
    queryKey: ['kotlin-learning', 'mindmap'],
    queryFn: () => api<MindMapData>('/api/learn-kotlin/mindmap'),
  })
}

// ========================================
// Tiered Content Types & Queries
// ========================================

export type KotlinContentTier = {
  tierLevel: number
  tierName: string
  title?: string
  explanation: string
  codeExamples?: string[]
  readingTimeMinutes: number
  learningObjectives?: string[]
  prerequisites?: string[]
}

export type KotlinRunnableExample = {
  title: string
  description?: string
  code: string
  expectedOutput?: string
  tierLevel: number
}

export type ExpenseTrackerChapterRef = {
  chapterNumber: number
  title: string
  usageType: string
  contextDescription?: string
}

export type KotlinTopicWithTiers = {
  id: string
  title: string
  module: string
  difficulty: string
  description?: string
  partNumber?: number
  partName?: string
  contentStructure?: string
  maxTierLevel: number
  availableTiers: number[]
  tiers: KotlinContentTier[]
  runnableExamples: KotlinRunnableExample[]
  codeExamples: KotlinCodeExample[]
  experiences: KotlinExperience[]
  docLinks: KotlinDocLink[]
  navigation?: TopicNavigation
  expenseTrackerChapters?: ExpenseTrackerChapterRef[]
}

export function useKotlinTopicWithTiers(
  id: string,
  sourceLanguage?: SourceLanguage,
  tier?: number,
) {
  const params = new URLSearchParams()
  if (sourceLanguage) params.set('sourceLanguage', sourceLanguage)
  if (tier) params.set('tier', tier.toString())
  const queryString = params.toString()
  const path = `/api/learn-kotlin/topics/${id}/tiered${queryString ? `?${queryString}` : ''}`

  return useQuery({
    queryKey: ['kotlin-learning', 'topic-tiered', id, sourceLanguage, tier],
    queryFn: () => api<KotlinTopicWithTiers>(path),
    enabled: !!id,
  })
}

// ========================================
// Expense Tracker Journey Types & Queries
// ========================================

export type ExpenseTrackerChapterList = {
  chapterNumber: number
  title: string
  description?: string
  difficulty: string
  estimatedTimeMinutes: number
  topicCount: number
}

export type ExpenseTrackerTopicRef = {
  topicId: string
  topicTitle: string
  usageType: string
  contextDescription?: string
}

export type ExpenseTrackerCodeSnippet = {
  filename: string
  language: string
  code: string
  explanation?: string
}

export type ChapterNavigation = {
  previous?: number
  next?: number
}

export type ExpenseTrackerChapterDetail = {
  chapterNumber: number
  title: string
  description?: string
  introduction?: string
  implementationSteps?: string[]
  codeSnippets?: ExpenseTrackerCodeSnippet[]
  summary?: string
  difficulty: string
  estimatedTimeMinutes: number
  topics: ExpenseTrackerTopicRef[]
  navigation: ChapterNavigation
}

export function useExpenseTrackerChapters() {
  return useQuery({
    queryKey: ['kotlin-learning', 'expense-tracker', 'chapters'],
    queryFn: () =>
      api<ExpenseTrackerChapterList[]>(
        '/api/learn-kotlin/expense-tracker/chapters',
      ),
  })
}

export function useExpenseTrackerChapter(chapterNumber: number) {
  return useQuery({
    queryKey: ['kotlin-learning', 'expense-tracker', 'chapter', chapterNumber],
    queryFn: () =>
      api<ExpenseTrackerChapterDetail>(
        `/api/learn-kotlin/expense-tracker/chapters/${chapterNumber}`,
      ),
    enabled: chapterNumber > 0,
  })
}

// ========================================
// Kotlin Learning Admin Types & Mutations
// ========================================

export type KotlinTopicAdmin = {
  id: string
  title: string
  module: string
  difficulty: string
  description?: string
  kotlinExplanation: string
  kotlinCode: string
  readingTimeMinutes: number
  orderIndex: number
  partNumber?: number
  partName?: string
  contentStructure?: string
  maxTierLevel: number
}

export type KotlinTopicUpsertRequest = {
  id: string
  title: string
  module: string
  difficulty: string
  description?: string
  kotlinExplanation: string
  kotlinCode: string
  readingTimeMinutes?: number
  orderIndex?: number
  partNumber?: number
  partName?: string
  contentStructure?: string
  maxTierLevel?: number
}

export type ExpenseTrackerChapterAdmin = {
  id: number
  chapterNumber: number
  title: string
  description?: string
  introduction?: string
  implementationSteps?: string
  codeSnippets?: string
  summary?: string
  difficulty: string
  estimatedTimeMinutes: number
  previousChapter?: number
  nextChapter?: number
}

export type ExpenseTrackerChapterUpsertRequest = {
  chapterNumber: number
  title: string
  description?: string
  introduction?: string
  implementationSteps?: string
  codeSnippets?: string
  summary?: string
  difficulty?: string
  estimatedTimeMinutes?: number
}

// Admin queries for topics
export function useKotlinTopicsAdmin() {
  return useQuery({
    queryKey: ['kotlin-learning', 'admin', 'topics'],
    queryFn: async () =>
      apiAuth<KotlinTopicAdmin[]>(
        '/api/learn-kotlin/admin/topics',
        await authHeader(),
      ),
  })
}

export function useKotlinTopicAdmin(id: string) {
  return useQuery({
    queryKey: ['kotlin-learning', 'admin', 'topic', id],
    queryFn: async () =>
      apiAuth<KotlinTopicAdmin>(
        `/api/learn-kotlin/admin/topics/${id}`,
        await authHeader(),
      ),
    enabled: !!id,
  })
}

// Admin mutations for topics
export function useCreateKotlinTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: KotlinTopicUpsertRequest) => {
      return apiAuth<{ id: string }>(
        '/api/learn-kotlin/topics',
        await authHeader(),
        {
          method: 'POST',
          body: JSON.stringify(input),
        },
      )
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kotlin-learning'] })
    },
  })
}

export function useUpdateKotlinTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: KotlinTopicUpsertRequest) => {
      await apiAuth(
        `/api/learn-kotlin/topics/${input.id}`,
        await authHeader(),
        {
          method: 'PUT',
          body: JSON.stringify(input),
        },
      )
      return input.id
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ['kotlin-learning'] })
      qc.invalidateQueries({
        queryKey: ['kotlin-learning', 'admin', 'topic', id],
      })
    },
  })
}

export function useDeleteKotlinTopic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      await apiAuth(
        `/api/learn-kotlin/topics/${input.id}`,
        await authHeader(),
        {
          method: 'DELETE',
        },
      )
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kotlin-learning'] })
    },
  })
}

// Admin queries for chapters
export function useKotlinChaptersAdmin() {
  return useQuery({
    queryKey: ['kotlin-learning', 'admin', 'chapters'],
    queryFn: async () =>
      apiAuth<ExpenseTrackerChapterAdmin[]>(
        '/api/learn-kotlin/admin/chapters',
        await authHeader(),
      ),
  })
}

export function useKotlinChapterAdmin(id: number) {
  return useQuery({
    queryKey: ['kotlin-learning', 'admin', 'chapter', id],
    queryFn: async () =>
      apiAuth<ExpenseTrackerChapterAdmin>(
        `/api/learn-kotlin/admin/chapters/${id}`,
        await authHeader(),
      ),
    enabled: id > 0,
  })
}

// Admin mutations for chapters
export function useCreateKotlinChapter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ExpenseTrackerChapterUpsertRequest) => {
      return apiAuth<{ id: number }>(
        '/api/learn-kotlin/chapters',
        await authHeader(),
        {
          method: 'POST',
          body: JSON.stringify(input),
        },
      )
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kotlin-learning'] })
    },
  })
}

export function useUpdateKotlinChapter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ExpenseTrackerChapterAdmin) => {
      await apiAuth(
        `/api/learn-kotlin/chapters/${input.id}`,
        await authHeader(),
        {
          method: 'PUT',
          body: JSON.stringify({
            chapterNumber: input.chapterNumber,
            title: input.title,
            description: input.description,
            introduction: input.introduction,
            implementationSteps: input.implementationSteps,
            codeSnippets: input.codeSnippets,
            summary: input.summary,
            difficulty: input.difficulty,
            estimatedTimeMinutes: input.estimatedTimeMinutes,
          }),
        },
      )
      return input.id
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ['kotlin-learning'] })
      qc.invalidateQueries({
        queryKey: ['kotlin-learning', 'admin', 'chapter', id],
      })
    },
  })
}

export function useDeleteKotlinChapter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: number }) => {
      await apiAuth(
        `/api/learn-kotlin/chapters/${input.id}`,
        await authHeader(),
        {
          method: 'DELETE',
        },
      )
      return input.id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kotlin-learning'] })
    },
  })
}
