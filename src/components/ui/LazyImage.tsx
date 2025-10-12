import { ImgHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  aspectClassName?: string
}

export function LazyImage({ className, aspectClassName, ...props }: Props) {
  return (
    <div className={twMerge('overflow-hidden rounded', aspectClassName)}>
      <img
        loading="lazy"
        decoding="async"
        className={twMerge('h-auto w-full', className)}
        {...props}
      />
    </div>
  )
}
