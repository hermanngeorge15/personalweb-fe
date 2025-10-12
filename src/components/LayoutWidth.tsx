import { PropsWithChildren } from 'react'

export default function LayoutWidth({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-[min(1400px,90vw)] px-4 sm:px-6 md:px-8 lg:max-w-[min(1400px,88vw)] xl:max-w-[min(1440px,84vw)] 2xl:max-w-[min(1600px,80vw)]">
      {children}
    </div>
  )
}
