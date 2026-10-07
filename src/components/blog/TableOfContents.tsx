import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export type TocHeading = { id: string; text: string }

/** Offset that clears the sticky header when deciding which section is current. */
const ACTIVE_OFFSET_PX = 120

/** Id of the last heading scrolled past the top of the viewport (scroll-spy). */
function useActiveHeading(headings: TocHeading[]) {
  const [activeId, setActiveId] = useState<string | undefined>(headings[0]?.id)

  useEffect(() => {
    if (headings.length === 0) return
    let frame = 0
    const update = () => {
      frame = 0
      let current = headings[0].id
      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET_PX) {
          current = heading.id
        }
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [headings])

  return activeId
}

/** "On this page" list of the article's h2 headings. */
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const activeId = useActiveHeading(headings)
  if (headings.length === 0) return null
  return (
    <nav aria-label="On this page">
      <p className="text-ink mb-3.5 text-[13px] font-semibold">On this page</p>
      <ul className="border-line flex flex-col gap-0.5 border-l text-sm">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? 'location' : undefined}
                className={twMerge(
                  '-ml-px block border-l-2 border-transparent py-1.5 pl-3.5 transition-colors',
                  active
                    ? 'border-brand-a text-ink'
                    : 'text-faint hover:text-ink',
                )}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
