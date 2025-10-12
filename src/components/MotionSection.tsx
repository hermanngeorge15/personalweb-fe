import { PropsWithChildren } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Variant = 'fade-up' | 'slide-up'

export function MotionSection({
  children,
  variant = 'fade-up',
  id,
}: PropsWithChildren<{ variant?: Variant; id?: string }>) {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) {
    return <section id={id}>{children}</section>
  }
  const initial =
    variant === 'slide-up' ? { opacity: 0, y: 24 } : { opacity: 0, y: 12 }
  const animate = { opacity: 1, y: 0 }
  return (
    <motion.section
      id={id}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}
