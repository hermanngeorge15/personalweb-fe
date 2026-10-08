/**
 * Rehype plugin: give every h2/h3 in the rendered markdown a stable, unique id
 * (a slug of its text), so the post's table of contents can link to it.
 * Headings that already carry an id keep it.
 */

type HastNode = {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

const HEADINGS = new Set(['h2', 'h3'])

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? ''
  return (node.children ?? []).map(textOf).join('')
}

/** "What it *actually* catches?" → "what-it-actually-catches". Diacritics are folded. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const used = new Map<string, number>()
    const visit = (node: HastNode) => {
      if (
        node.type === 'element' &&
        node.tagName &&
        HEADINGS.has(node.tagName)
      ) {
        node.properties = node.properties ?? {}
        if (!node.properties.id) {
          const base = slugify(textOf(node)) || 'section'
          const count = used.get(base) ?? 0
          used.set(base, count + 1)
          node.properties.id = count === 0 ? base : `${base}-${count + 1}`
        }
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}
