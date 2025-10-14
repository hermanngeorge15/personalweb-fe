export function setHead({
  title,
  description,
  canonical,
  og,
  twitter,
}: {
  title: string
  description?: string
  canonical?: string
  og?: Partial<OgMeta>
  twitter?: Partial<TwitterMeta>
}) {
  document.title = title
  setMeta('description', description ?? '')
  if (canonical) setLinkCanonical(canonical)
  if (og) setOg(og)
  if (twitter) setTwitter(twitter)
}
function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
function setLinkCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

type OgMeta = {
  title: string
  description: string
  image: string
  url: string
}

function setOg(meta: Partial<OgMeta>) {
  setProperty('og:title', meta.title)
  setProperty('og:description', meta.description)
  setProperty('og:image', meta.image)
  setProperty('og:url', meta.url)
}

type TwitterMeta = {
  card: 'summary' | 'summary_large_image'
  title: string
  description: string
  image: string
}

function setTwitter(meta: Partial<TwitterMeta>) {
  setMeta('twitter:card', meta.card ?? 'summary_large_image')
  if (meta.title) setMeta('twitter:title', meta.title)
  if (meta.description) setMeta('twitter:description', meta.description)
  if (meta.image) setMeta('twitter:image', meta.image)
}

function setProperty(property: string, content?: string) {
  if (!content) return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export const SEO_DEFAULTS = {
  siteName: 'Jiří Hermann',
  siteUrl: 'https://jirihermann.com',
  description:
    'Backend Software Engineer specializing in Kotlin, Java, Spring Boot, and scalable systems. Founder of Kotlin Server Squad community. Building clean, reliable backend solutions.',
  image: '/og-default.png',
}

export function setJsonLd(data: unknown) {
  const id = 'jsonld-primary'
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}
