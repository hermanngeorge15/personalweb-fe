import {
  useMemo,
  type ComponentType,
  type HTMLAttributes,
  type AnchorHTMLAttributes,
} from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

type UnknownProps = Record<string, unknown>

type ComponentsMap = Record<string, ComponentType<UnknownProps>>

export default function MDXContent({ code }: { code: string }) {
  const components: ComponentsMap = useMemo(
    () => ({
      h1: (props: UnknownProps) => (
        <h1
          className="text-3xl font-bold"
          {...(props as HTMLAttributes<HTMLHeadingElement>)}
        />
      ),
      h2: (props: UnknownProps) => (
        <h2
          className="text-2xl font-semibold"
          {...(props as HTMLAttributes<HTMLHeadingElement>)}
        />
      ),
      p: (props: UnknownProps) => (
        <p
          className="leading-7"
          {...(props as HTMLAttributes<HTMLParagraphElement>)}
        />
      ),
      a: (props: UnknownProps) => (
        <a
          className="underline"
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      ),
    }),
    [],
  )
  return (
    <article className="prose prose-zinc dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components as never}
      >
        {code}
      </ReactMarkdown>
    </article>
  )
}
