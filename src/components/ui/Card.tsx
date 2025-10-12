import { PropsWithChildren } from 'react'
import {
  Card as HeroCard,
  CardHeader as HeroCardHeader,
  CardBody as HeroCardBody,
  CardFooter as HeroCardFooter,
} from '@heroui/react'
import { twMerge } from 'tailwind-merge'

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <HeroCard
      className={twMerge(
        'rounded-xl border bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur',
        className,
      )}
    >
      {children}
    </HeroCard>
  )
}

export function CardHeader({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <HeroCardHeader className={twMerge('text-base font-medium', className)}>
      {children}
    </HeroCardHeader>
  )
}

export function CardBody({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <HeroCardBody className={twMerge('text-sm', className)}>
      {children}
    </HeroCardBody>
  )
}

export function CardFooter({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <HeroCardFooter className={twMerge('', className)}>
      {children}
    </HeroCardFooter>
  )
}
