import { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/react'

interface KotlinPlaygroundProps {
  /** The Kotlin code to display and run */
  code: string
  /** Optional title for the example */
  title?: string
  /** Optional description */
  description?: string
  /** Expected output (shown for reference) */
  expectedOutput?: string
  /** Height of the playground in pixels */
  height?: number
  /** Whether to show line numbers */
  lineNumbers?: boolean
  /** Theme: 'default' | 'darcula' */
  theme?: 'default' | 'darcula'
  /** Whether the code is read-only */
  readOnly?: boolean
  /** Auto-run the code on load */
  autoRun?: boolean
}

/**
 * Embeds the official Kotlin Playground from play.kotlinlang.org
 * Uses the Kotlin Playground library for interactive code execution
 */
export function KotlinPlayground({
  code,
  title,
  description,
  expectedOutput,
  height = 300,
  lineNumbers = true,
  theme = 'darcula',
  readOnly = false,
  autoRun = false,
}: KotlinPlaygroundProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showExpectedOutput, setShowExpectedOutput] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)
  const playgroundInitialized = useRef(false)

  // Load Kotlin Playground script
  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById('kotlin-playground-script')) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.id = 'kotlin-playground-script'
    script.src = 'https://unpkg.com/kotlin-playground@1'
    script.async = true
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Don't remove script on unmount as other playgrounds may need it
    }
  }, [])

  // Initialize playground when script is loaded
  useEffect(() => {
    if (isLoaded && codeRef.current && !playgroundInitialized.current) {
      // @ts-expect-error - KotlinPlayground is loaded from external script
      if (typeof window.KotlinPlayground !== 'undefined') {
        // @ts-expect-error - KotlinPlayground is loaded from external script
        window.KotlinPlayground(codeRef.current)
        playgroundInitialized.current = true
      }
    }
  }, [isLoaded])

  // Format code for display
  const formattedCode = code.trim()

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      {/* Header */}
      {(title || description) && (
        <div className="border-b border-gray-200 bg-white px-4 py-3">
          {title && (
            <div className="flex items-center gap-2">
              <span className="text-lg">▶️</span>
              <h4 className="font-semibold text-gray-900">{title}</h4>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Runnable
              </span>
            </div>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}

      {/* Kotlin Playground */}
      <div className="relative">
        {!isLoaded && (
          <div
            className="flex items-center justify-center bg-gray-900"
            style={{ height }}
          >
            <div className="flex items-center gap-3 text-gray-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-r-transparent" />
              <span>Loading Kotlin Playground...</span>
            </div>
          </div>
        )}

        <div
          ref={codeRef}
          className={isLoaded ? '' : 'hidden'}
          style={{ minHeight: height }}
        >
          <code
            data-highlight-only={readOnly ? 'true' : undefined}
            data-auto-indent="true"
            data-theme={theme}
            data-min-compiler-version="1.9"
            data-autocomplete="true"
            data-highlight-on-fly="true"
            data-match-brackets="true"
            data-output-height="100"
            data-js-libs=""
            style={{
              display: 'block',
              whiteSpace: 'pre',
              fontSize: '14px',
            }}
          >
            {formattedCode}
          </code>
        </div>
      </div>

      {/* Expected Output Section */}
      {expectedOutput && (
        <div className="border-t border-gray-200 bg-white">
          <button
            onClick={() => setShowExpectedOutput(!showExpectedOutput)}
            className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              <span>📋</span>
              <span>Expected Output</span>
            </span>
            <span
              className={`transition-transform ${showExpectedOutput ? 'rotate-180' : ''}`}
            >
              ▼
            </span>
          </button>
          {showExpectedOutput && (
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
              <pre className="overflow-x-auto rounded bg-gray-800 p-3 text-sm text-green-400">
                {expectedOutput}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 text-xs text-gray-500">
        <span>Powered by Kotlin Playground</span>
        <a
          href="https://play.kotlinlang.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:underline"
        >
          Open in Full Editor →
        </a>
      </div>
    </div>
  )
}

/**
 * Simple code block without execution (for display only)
 */
export function KotlinCodeBlock({
  code,
  title,
  language = 'kotlin',
}: {
  code: string
  title?: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-gray-200">
      {title && (
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto bg-gray-900 p-4 text-sm text-gray-100">
          <code>{code.trim()}</code>
        </pre>
        <Button
          size="sm"
          variant="flat"
          className="absolute right-2 top-2 bg-gray-700 text-gray-300 hover:bg-gray-600"
          onClick={handleCopy}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  )
}

export default KotlinPlayground
