import { PropsWithChildren, type HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function H1({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={twMerge('text-2xl font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

export function Muted({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <p className={twMerge('text-muted-foreground', className)}>{children}</p>
  )
}
