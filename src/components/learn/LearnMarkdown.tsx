import MDXContent from '@/components/MDXContent'

const FENCE = /^\s*(```|~~~)/
const HEADING = /^\s{0,3}#{1,5}\s/
const TABLE_ROW = /^\s*\|/

/**
 * Prepares Learn Kotlin text (markdown from the API) for the blog's markdown
 * renderer:
 * - headings drop one level, because each block already sits under the
 *   page's own h2 (so `## Foo` becomes an h3);
 * - single line breaks inside a paragraph stay line breaks, as the old
 *   renderer showed them (markdown would otherwise join the lines).
 * Fenced code is left untouched.
 */
export function prepareLearnMarkdown(text: string): string {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  let inFence = false
  return lines
    .map((line, index) => {
      if (FENCE.test(line)) {
        inFence = !inFence
        return line
      }
      if (inFence) return line
      if (HEADING.test(line)) return `#${line.trimStart()}`
      const next = lines[index + 1]
      const continues =
        line.trim() !== '' &&
        next !== undefined &&
        next.trim() !== '' &&
        !TABLE_ROW.test(line) &&
        !FENCE.test(next)
      return continues ? `${line.replace(/\s+$/, '')}  ` : line
    })
    .join('\n')
}

/** Markdown with the blog's article styles (tables, highlighted code, copy buttons). */
export function LearnMarkdown({
  text,
  size = 'md',
}: {
  text: string
  size?: 'md' | 'sm'
}) {
  return (
    <div
      className={
        size === 'sm'
          ? '[&_.article-body]:max-w-none [&_.article-body]:text-[15px] [&_.article-body]:leading-[1.7] [&_.article-body_p]:mb-3.5'
          : '[&_.article-body]:max-w-none [&_.article-body]:text-[17px] sm:[&_.article-body]:text-[18px]'
      }
    >
      <MDXContent code={prepareLearnMarkdown(text)} />
    </div>
  )
}

/** A code string shown as a highlighted, copyable fenced block. */
export function LearnCode({
  code,
  language = 'kotlin',
}: {
  code: string
  language?: string
}) {
  const fence = code.includes('```') ? '~~~~' : '```'
  return (
    <div className="[&_.article-body]:max-w-none [&_.code-block]:mb-0">
      <MDXContent code={`${fence}${language}\n${code}\n${fence}`} />
    </div>
  )
}
