import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { copyToClipboard } from '@/lib/blog-utils'
import { rehypeHeadingIds } from '@/lib/rehype-heading-ids'

type CodeNode = {
  children?: Array<{ tagName?: string; properties?: { className?: unknown } }>
}

/** Language of a fenced block, from the `language-xxx` class on its <code>. */
function languageOf(node: CodeNode | undefined): string | undefined {
  const code = node?.children?.find((child) => child.tagName === 'code')
  const classes = code?.properties?.className
  if (!Array.isArray(classes)) return undefined
  const match = classes.map(String).find((name) => name.startsWith('language-'))
  return match?.slice('language-'.length) || undefined
}

/** Fenced code: bordered block with a header bar (language or "terminal") and a Copy button. */
function CodeBlock({
  node,
  children,
  ...props
}: ComponentPropsWithoutRef<'pre'> & { node?: CodeNode }) {
  const preRef = useRef<HTMLPreElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const [copied, setCopied] = useState(false)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? ''
    if (await copyToClipboard(text.replace(/\n$/, ''))) {
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <figure className="code-block">
      <div className="code-block-bar">
        <span className="code-block-lang">
          {languageOf(node) ?? 'terminal'}
        </span>
        <button type="button" className="code-block-copy" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </figure>
  )
}

const components: Components = {
  pre: CodeBlock as Components['pre'],
  // Wide tables scroll inside their own box instead of widening the page.
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
}

/**
 * Renders a post's markdown inside the single `.article-body` container whose
 * styles live in globals.css. Headings get ids for the table of contents.
 */
const MDXContent = forwardRef<HTMLDivElement, { code: string }>(
  function MDXContent({ code }, ref) {
    return (
      <div ref={ref} className="article-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeHeadingIds]}
          components={components}
        >
          {code}
        </ReactMarkdown>
      </div>
    )
  },
)

export default MDXContent
