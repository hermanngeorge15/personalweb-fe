import { useEffect, useRef, useState } from 'react'
import {
  copyToClipboard,
  shareOnLinkedIn,
  shareOnTwitter,
} from '@/lib/blog-utils'
import { CheckIcon, LinkedInIcon, LinkIcon, XIcon } from '../icons'

const buttonClass =
  'border-line-strong text-body hover:text-ink hover:bg-chip focus-visible:outline-brand-a flex size-10 items-center justify-center rounded-[10px] border transition-colors focus-visible:outline-2'

/** Icon-only share buttons: LinkedIn, X, copy link. */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleCopyLink = async () => {
    if (await copyToClipboard(window.location.href)) {
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
        className={buttonClass}
        onClick={() => shareOnLinkedIn(window.location.href)}
      >
        <LinkedInIcon size={16} />
      </button>
      <button
        type="button"
        aria-label="Share on X"
        title="Share on X"
        className={buttonClass}
        onClick={() => shareOnTwitter(title, window.location.href)}
      >
        <XIcon size={15} />
      </button>
      <button
        type="button"
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title={copied ? 'Link copied' : 'Copy link'}
        className={buttonClass}
        onClick={handleCopyLink}
      >
        {copied ? <CheckIcon size={16} /> : <LinkIcon size={16} />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  )
}
