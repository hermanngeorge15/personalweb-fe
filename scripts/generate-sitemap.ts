#!/usr/bin/env tsx
/**
 * Generate sitemap.xml with all static pages and dynamic blog posts
 * Run during build: npm run generate-sitemap
 */

import { writeFileSync } from 'fs'
import { join } from 'path'

const DOMAIN = 'https://jirihermann.com'
const API_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:8891'

type SitemapUrl = {
  loc: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  lastmod?: string
}

// Static pages
const staticPages: SitemapUrl[] = [
  {
    loc: `${DOMAIN}/`,
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    loc: `${DOMAIN}/about`,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/services`,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/resume`,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: `${DOMAIN}/testimonials`,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${DOMAIN}/contact`,
    changefreq: 'yearly',
    priority: 0.7,
  },
  {
    loc: `${DOMAIN}/blog`,
    changefreq: 'daily',
    priority: 0.9,
  },
]

async function fetchBlogPosts(): Promise<SitemapUrl[]> {
  try {
    console.log(`📡 Fetching blog posts from: ${API_BASE}/api/posts`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(`${API_BASE}/api/posts?limit=1000`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`⚠️  Failed to fetch blog posts: ${response.status}`)
      console.warn(`⚠️  Sitemap will only include static pages`)
      return []
    }

    const data = await response.json()
    const posts = data.items || []

    return posts.map((post: any) => ({
      loc: `${DOMAIN}/blog/${post.slug}`,
      changefreq: 'monthly' as const,
      priority: 0.7,
      lastmod: post.published_at ? new Date(post.published_at).toISOString().split('T')[0] : undefined,
    }))
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('⚠️  API request timed out after 10 seconds')
    } else {
      console.warn('⚠️  Error fetching blog posts for sitemap:', error)
    }
    console.warn('⚠️  Sitemap will only include static pages')
    return []
  }
}

function generateXML(urls: SitemapUrl[]): string {
  const urlsXML = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urlsXML}
</urlset>
`
}

async function main() {
  console.log('🗺️  Generating sitemap...')

  // Fetch dynamic blog posts
  const blogPosts = await fetchBlogPosts()
  console.log(`✅ Fetched ${blogPosts.length} blog posts`)

  // Combine all URLs
  const allUrls = [...staticPages, ...blogPosts]

  // Generate XML
  const xml = generateXML(allUrls)

  // Write to public/sitemap.xml
  const outputPath = join(process.cwd(), 'public', 'sitemap.xml')
  writeFileSync(outputPath, xml, 'utf-8')

  console.log(`✅ Sitemap generated with ${allUrls.length} URLs`)
  console.log(`📄 Written to: ${outputPath}`)
}

main().catch((error) => {
  console.error('❌ Failed to generate sitemap:', error)
  process.exit(1)
})
