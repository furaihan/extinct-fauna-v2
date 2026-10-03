import type { ReactNode } from 'react'
import { Badge } from '@/shared/ui/badge.tsx'

interface Props {
  eyebrow?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: Props) {
  return (
    <div className={`mb-10 flex flex-col gap-2.5 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
      {eyebrow && <Badge variant="secondary" className="rounded-full uppercase tracking-wider text-xs font-semibold">{eyebrow}</Badge>}
      <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl text-balance">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-muted-foreground text-base leading-relaxed text-balance">
          {description}
        </p>
      )}
    </div>
  )
}
