import { http, HttpResponse } from 'msw'

const api = import.meta.env.VITE_API_URL ?? ''

export const handlers = [
  http.get(api + '/api/meta', () => {
    return HttpResponse.json({ name: 'WriteWave', version: '0.0.0' })
  }),
  http.get(api + '/api/posts', ({ request }) => {
    const url = new URL(request.url)
    const err = url.searchParams.get('err')
    if (err === '500')
      return new HttpResponse(null, { status: 500, statusText: 'Server Error' })
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const items = Array.from({ length: limit }).map((_, i) => ({
      slug: `post-${i + 1}`,
      title: `Mock Post ${i + 1}`,
      excerpt: 'Lorem ipsum dolor sit amet...',
    }))
    return HttpResponse.json({ items, nextCursor: null })
  }),
  http.get(api + '/api/posts/:slug', ({ params }) => {
    const { slug } = params as { slug: string }
    return HttpResponse.json({
      slug,
      title: `Mock ${slug}`,
      mdx: '# Hello World\n\nThis is a mock post.',
    })
  }),
  http.get(api + '/api/projects', () => {
    return HttpResponse.json([
      { id: 'p1', name: 'Project One', description: 'A great project' },
      { id: 'p2', name: 'Project Two', description: 'Another project' },
    ])
  }),
  http.post(api + '/api/projects', async ({ request }) => {
    const body = (await request.json()) as {
      id: string
      name: string
      description: string
    }
    return HttpResponse.json(body)
  }),
  http.put(api + '/api/projects/:id', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as { name: string; description: string }
    return HttpResponse.json({ id, ...body })
  }),
  http.delete(api + '/api/projects/:id', async ({ params }) => {
    const { id } = params as { id: string }
    return HttpResponse.json({ ok: true, id })
  }),
  http.get(api + '/api/testimonials', () => {
    return HttpResponse.json([
      { id: 't1', author: 'Ada Lovelace', quote: 'Wonderful work!' },
      { id: 't2', author: 'Alan Turing', quote: 'Highly recommended.' },
    ])
  }),
  http.post(api + '/api/testimonials', async ({ request }) => {
    const body = (await request.json()) as {
      id: string
      author: string
      quote: string
    }
    return HttpResponse.json(body)
  }),
  http.put(api + '/api/testimonials/:id', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as { author: string; quote: string }
    return HttpResponse.json({ id, ...body })
  }),
  http.delete(api + '/api/testimonials/:id', async ({ params }) => {
    const { id } = params as { id: string }
    return HttpResponse.json({ ok: true, id })
  }),
  http.get(api + '/api/resume', () => {
    return HttpResponse.json({
      name: 'Jiří Hermann',
      headline: 'Backend Software Engineer',
      summary:
        'Specializing in Kotlin, Java, Spring Boot, and building scalable backend systems. Founder of Kotlin Server Squad community.',
      sections: [
        {
          title: 'Experience',
          items: [
            'Company A — Senior Backend Engineer',
            'Company B — Backend Developer',
          ],
        },
        {
          title: 'Skills',
          items: ['Kotlin', 'Java', 'Spring Boot', 'PostgreSQL', 'Kubernetes'],
        },
      ],
    })
  }),
  http.post(api + '/api/contact', async () => {
    return HttpResponse.json({ ok: true })
  }),
  http.put(api + '/api/posts/:slug', async ({ params, request }) => {
    const { slug } = params as { slug: string }
    const body = (await request.json()) as { title?: string; mdx?: string }
    return HttpResponse.json({
      slug,
      title: body.title ?? 'Updated',
      mdx: body.mdx ?? '',
    })
  }),
  http.post(api + '/api/posts', async ({ request }) => {
    const body = (await request.json()) as {
      slug: string
      title: string
      mdx: string
    }
    return HttpResponse.json({
      slug: body.slug,
      title: body.title,
      mdx: body.mdx,
    })
  }),
  http.delete(api + '/api/posts/:slug', async ({ params }) => {
    const { slug } = params as { slug: string }
    return HttpResponse.json({ ok: true, slug })
  }),
]
